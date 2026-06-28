"use client";

import { useState } from "react";
import { addTransactions } from "../../actions/finance";
import type { Category } from "@/types/finance";
import styles from "./checkbook.module.css";

interface AddTransactionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onSuccess: () => void;
}

interface RowState {
  type: "debit" | "credit";
  category_id: string;
  amount: string;
  description: string;
  date: string;
}

export default function AddTransactionsModal({
  isOpen,
  onClose,
  categories,
  onSuccess,
}: AddTransactionsModalProps) {
  const createEmptyRow = (): RowState => ({
    type: "debit",
    category_id: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [rows, setRows] = useState<RowState[]>([createEmptyRow()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (!isOpen) return null;

  const handleAddRow = () => {
    setRows([...rows, createEmptyRow()]);
  };

  const handleDeleteRow = (index: number) => {
    if (rows.length === 1) {
      setRows([createEmptyRow()]);
      return;
    }
    setRows(rows.filter((_, idx) => idx !== index));
  };

  const handleInputChange = (index: number, field: keyof RowState, value: string) => {
    const updatedRows = [...rows];
    updatedRows[index] = {
      ...updatedRows[index],
      [field]: value,
    };
    setRows(updatedRows);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate and format inputs
    const formattedPayload = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const parsedAmount = parseFloat(row.amount);

      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        setError(`Row ${i + 1}: Amount must be a positive number.`);
        setIsSubmitting(false);
        return;
      }

      if (!row.date) {
        setError(`Row ${i + 1}: Date is required.`);
        setIsSubmitting(false);
        return;
      }

      formattedPayload.push({
        amount: parsedAmount,
        type: row.type,
        category_id: row.category_id || null,
        description: row.description.trim() || null,
        date: row.date,
      });
    }

    const res = await addTransactions(formattedPayload);

    if (res.success) {
      setRows([createEmptyRow()]);
      onSuccess();
      onClose();
    } else {
      setError(res.error || "Failed to insert transactions.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Add Multiple Transactions</h2>
          <button type="button" onClick={onClose} className={styles.closeBtn}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
          <div className={styles.modalBody}>
            <table className={styles.modalTable}>
              <thead>
                <tr>
                  <th style={{ width: "15%" }}>Type</th>
                  <th style={{ width: "25%" }}>Category</th>
                  <th style={{ width: "20%" }}>Amount ($)</th>
                  <th style={{ width: "20%" }}>Date</th>
                  <th style={{ width: "15%" }}>Description</th>
                  <th style={{ width: "5%" }}></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={idx}>
                    <td>
                      <select
                        value={row.type}
                        onChange={(e) => handleInputChange(idx, "type", e.target.value as "debit" | "credit")}
                        className={styles.modalSelect}
                        required
                      >
                        <option value="debit">Debit (-)</option>
                        <option value="credit">Credit (+)</option>
                      </select>
                    </td>
                    <td>
                      <select
                        value={row.category_id}
                        onChange={(e) => handleInputChange(idx, "category_id", e.target.value)}
                        className={styles.modalSelect}
                      >
                        <option value="">No Category</option>
                        {categories
                          .filter((c) => c.type === row.type)
                          .map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={row.amount}
                        onChange={(e) => handleInputChange(idx, "amount", e.target.value)}
                        className={styles.modalInput}
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        value={row.date}
                        onChange={(e) => handleInputChange(idx, "date", e.target.value)}
                        className={styles.modalInput}
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="Optional note"
                        value={row.description}
                        onChange={(e) => handleInputChange(idx, "description", e.target.value)}
                        className={styles.modalInput}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleDeleteRow(idx)}
                        className={styles.deleteBtn}
                        title="Delete Row"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              type="button"
              onClick={handleAddRow}
              className={styles.modalRowAdd}
              id="add-row-btn"
            >
              + Add Another Row
            </button>

            {error && <div className={styles.errorText}>{error}</div>}
          </div>

          <div className={styles.modalFooter}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
              id="batch-submit-btn"
            >
              {isSubmitting ? "Saving..." : "Submit Transactions"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

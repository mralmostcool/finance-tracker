"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { deleteTransaction } from "../../actions/finance";
import type { Category, Transaction } from "@/types/finance";
import AddTransactionsModal from "./AddTransactionsModal";
import CustomSelect from "../../components/CustomSelect";
import styles from "./checkbook.module.css";

interface CheckbookLedgerProps {
  initialTransactions: Transaction[];
  categories: Category[];
}

export default function CheckbookLedger({
  initialTransactions,
  categories,
}: CheckbookLedgerProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter States
  const [typeFilter, setTypeFilter] = useState<"all" | "debit" | "credit">("all");
  const [categoryFilter, setCategoryFilter] = useState("");

  // 1. Calculate Running Balance chronologically (oldest first)
  const transactionsWithBalance = useMemo(() => {
    // Sort oldest first for running calculations
    const chronological = [...initialTransactions].sort((a, b) => {
      const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateDiff !== 0) return dateDiff;
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

    let running = 0;
    const computed = [];
    for (const t of chronological) {
      if (t.type === "credit") {
        running += Number(t.amount);
      } else {
        running -= Number(t.amount);
      }
      computed.push({
        ...t,
        runningBalance: running,
      });
    }

    // Reverse back to newest first for display
    return computed.reverse();
  }, [initialTransactions]);

  // 2. Filtered Transactions
  const filteredTransactions = useMemo(() => {
    return transactionsWithBalance.filter((t) => {
      const matchesType = typeFilter === "all" ? true : t.type === typeFilter;
      const matchesCategory = categoryFilter === "" ? true : t.category_id === categoryFilter;

      return matchesType && matchesCategory;
    });
  }, [transactionsWithBalance, typeFilter, categoryFilter]);

  // 3. Overall ledger stats (calculated from all transactions)
  const stats = useMemo(() => {
    let balance = 0;
    let totalCredit = 0;
    let totalDebit = 0;

    initialTransactions.forEach((t) => {
      const amt = Number(t.amount);
      if (t.type === "credit") {
        balance += amt;
        totalCredit += amt;
      } else {
        balance -= amt;
        totalDebit += amt;
      }
    });

    return {
      balance,
      totalCredit,
      totalDebit,
    };
  }, [initialTransactions]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      const res = await deleteTransaction(id);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error || "Failed to delete transaction.");
      }
    }
  };

  const handleSuccess = () => {
    router.refresh();
  };

  return (
    <div className={styles.container}>
      {/* KPI Ledger Summary Cards */}
      <section className={styles.ledgerSummary}>
        <div className={styles.ledgerCard}>
          <span className={styles.ledgerLabel}>Current Balance</span>
          <span className={styles.ledgerValue} style={{ color: stats.balance >= 0 ? "#0f766e" : "#be123c" }}>
            ${stats.balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className={styles.ledgerCard}>
          <span className={styles.ledgerLabel}>Total Credits (+)</span>
          <span className={styles.ledgerValue} style={{ color: "#0f766e" }}>
            ${stats.totalCredit.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className={styles.ledgerCard}>
          <span className={styles.ledgerLabel}>Total Debits (-)</span>
          <span className={styles.ledgerValue} style={{ color: "#be123c" }}>
            ${stats.totalDebit.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </section>

      {/* Filters Toolbar */}
      <section className={styles.toolbar}>
        <div className={styles.filters}>
          <CustomSelect
            value={typeFilter}
            onChange={(val) => setTypeFilter(val as "all" | "debit" | "credit")}
            options={[
              { value: "all", label: "All Types" },
              { value: "credit", label: "Credits (+)" },
              { value: "debit", label: "Debits (-)" },
            ]}
          />

          <CustomSelect
            value={categoryFilter}
            onChange={(val) => setCategoryFilter(val)}
            options={[
              { value: "", label: "All Categories" },
              ...categories.map((c) => ({
                value: c.id,
                label: `[${c.type.toUpperCase()}] ${c.name}`,
              })),
            ]}
          />
        </div>

        <button onClick={() => setIsModalOpen(true)} className={styles.addButton} id="add-transactions-btn">
          + Add Transactions
        </button>
      </section>

      {/* Table Card */}
      <section className={styles.card}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: "15%" }}>Date</th>
                <th style={{ width: "25%" }}>Description</th>
                <th style={{ width: "20%" }}>Category</th>
                <th style={{ width: "15%" }}>Amount</th>
                <th style={{ width: "20%" }}>Running Balance</th>
                <th style={{ width: "5%" }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className={styles.emptyState}>
                      <span className={styles.emptyStateIcon}>📖</span>
                      <h3>No transactions found</h3>
                      <p>Adjust your filters or add new transactions to get started.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t) => (
                  <tr key={t.id}>
                    <td>{new Date(t.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</td>
                    <td>{t.description || "—"}</td>
                    <td>
                      {t.category ? (
                        <span className={styles.categoryBadge}>{t.category.name}</span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className={t.type === "credit" ? styles.creditText : styles.debitText}>
                      {t.type === "credit" ? "+" : "-"}${Number(t.amount).toFixed(2)}
                    </td>
                    <td className={styles.balanceText} style={{ color: t.runningBalance >= 0 ? "#0f766e" : "#be123c" }}>
                      ${t.runningBalance.toFixed(2)}
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className={styles.deleteBtn}
                        title="Delete Transaction"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Interactive Batch Insert Modal */}
      {isModalOpen && (
        <AddTransactionsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          categories={categories}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}

import { getCategories, getTransactions } from "../../actions/finance";
import CheckbookLedger from "./CheckbookLedger";
import styles from "../dashboard.module.css";

export default async function CheckbookPage() {
  const [categoriesRes, transactionsRes] = await Promise.all([
    getCategories(),
    getTransactions(),
  ]);

  const categories = categoriesRes.success && categoriesRes.data ? categoriesRes.data : [];
  const transactions = transactionsRes.success && transactionsRes.data ? transactionsRes.data : [];

  return (
    <>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Checkbook Ledger</h1>
      </header>

      {/* Main Ledger Content */}
      <CheckbookLedger initialTransactions={transactions} categories={categories} />
    </>
  );
}

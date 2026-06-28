import styles from "./dashboard.module.css";

export default function DashboardPage() {
  return (
    <>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Dashboard</h1>
      </header>

      {/* Dashboard workspace starts here - Cards will be added dynamic/as-needed */}
      <div style={{ flex: 1 }}></div>
    </>
  );
}

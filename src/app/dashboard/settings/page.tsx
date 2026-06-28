import styles from "../dashboard.module.css";

export default function SettingsPage() {
  return (
    <>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Account Settings</h1>
      </header>

      {/* Settings workspace starts here - Under Construction */}
      <div style={{ flex: 1, padding: "2rem 0", color: "#6b7280" }}>
        <p>Account settings features will be populated here.</p>
      </div>
    </>
  );
}

import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.card}>
        <span className={styles.badge}>Next.js & Supabase Ready</span>
        <h1 className={styles.title}>Finance Tracker</h1>
        <p className={styles.subtitle}>
          Welcome to your new premium financial dashboard. Initialize database tables and start tracking your wealth.
        </p>
        <a
          href="https://supabase.com/docs"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.button}
          id="docs-button"
        >
          View Supabase Docs
        </a>
      </main>
    </div>
  );
}

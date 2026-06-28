import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { logout } from "../login/actions";
import styles from "./dashboard.module.css";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const userInitial = user.email ? user.email.charAt(0).toUpperCase() : "U";

  return (
    <div className={styles.dashboard}>
      <aside className={styles.sidebar}>
        <div>
          <div className={styles.brand}>Finance Tracker</div>
          <nav>
            <ul className={styles.menu}>
              <li>
                <a href="/dashboard" className={`${styles.menuItem} ${styles.menuItemActive}`}>
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className={styles.menuItem}>
                  Transactions
                </a>
              </li>
              <li>
                <a href="#" className={styles.menuItem}>
                  Budgets
                </a>
              </li>
              <li>
                <a href="#" className={styles.menuItem}>
                  Settings
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <form action={logout}>
          <button className={styles.logoutButton} id="logout-btn">
            Log Out
          </button>
        </form>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.welcomeSection}>
            <h1>Dashboard</h1>
            <p>Welcome back, {user.email}</p>
          </div>
          <div className={styles.userProfile}>
            <div className={styles.avatar}>{userInitial}</div>
          </div>
        </header>

        <section className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statTitle}>Total Balance</span>
            <span className={styles.statValue}>$0.00</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statTitle}>Monthly Income</span>
            <span className={styles.statValue}>$0.00</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statTitle}>Monthly Expenses</span>
            <span className={styles.statValue}>$0.00</span>
          </div>
        </section>

        <section className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>💸</div>
          <h2>No Transactions Yet</h2>
          <p>Get started by adding your first transaction to see financial insights here.</p>
          <button className={styles.ctaButton} id="add-transaction-btn">
            + Add Transaction
          </button>
        </section>
      </main>
    </div>
  );
}

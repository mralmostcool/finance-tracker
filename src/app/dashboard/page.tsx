import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { logout } from "../actions";
import styles from "./dashboard.module.css";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const userInitial = user.email ? user.email.charAt(0).toUpperCase() : "U";

  // Dynamically driven sidebar features
  const features = [
    {
      name: "Dashboard",
      href: "/dashboard",
      active: true,
      icon: (
        <svg className={styles.menuIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="9" rx="1" />
          <rect x="14" y="3" width="7" height="5" rx="1" />
          <rect x="14" y="12" width="7" height="9" rx="1" />
          <rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
      ),
    },
  ];

  return (
    <div className={styles.dashboard}>
      {/* Sidebar Navigation */}
      <aside className={styles.sidebar}>
        <div>
          <div className={styles.sectionLabel}>Features</div>
          <ul className={styles.menu}>
            {features.map((feature, idx) => (
              <li key={idx}>
                <a
                  href={feature.href}
                  className={`${styles.menuItem} ${feature.active ? styles.menuItemActive : ""}`}
                >
                  {feature.icon}
                  {feature.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <form action={logout} className={styles.logoutForm}>
          <button className={styles.logoutButton} id="logout-btn">
            Log Out
          </button>
        </form>
      </aside>

      {/* Main Panel Content */}
      <main className={styles.mainContent}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerTitle}>Dashboard</div>
          <div className={styles.headerActions}>
            <div className={styles.searchWrapper}>
              <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input type="text" className={styles.searchInput} placeholder="Search" />
            </div>
            <button className={styles.iconBtn}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
              </svg>
            </button>
            <div className={styles.avatar}>{userInitial}</div>
          </div>
        </header>

        {/* Dashboard workspace starts here - Cards will be added dynamic/as-needed */}
        <div style={{ flex: 1 }}></div>
      </main>
    </div>
  );
}

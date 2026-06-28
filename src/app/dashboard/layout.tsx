import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { logout } from "../actions";
import styles from "./dashboard.module.css";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

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

        <div className={styles.sidebarBottom}>
          <a href="/dashboard/settings" className={styles.userButton} id="settings-btn">
            <svg className={styles.menuIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
            <span className={styles.userNameText}>{user.email}</span>
          </a>

          <form action={logout} className={styles.logoutForm}>
            <button className={styles.logoutButton} id="logout-btn">
              Log Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
}

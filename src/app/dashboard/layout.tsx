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

  const displayName = user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email?.split('@')[0] ?? 'User';

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
          <a href="/dashboard/settings" className={styles.userButton} id="settings-btn" style={{ justifyContent: "center" }}>
            <span className={styles.userNameText}>{displayName}</span>
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

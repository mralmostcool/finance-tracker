"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "../actions";
import styles from "./dashboard.module.css";

interface SidebarNavProps {
  displayName: string;
}

export default function SidebarNav({ displayName }: SidebarNavProps) {
  const pathname = usePathname();

  const features = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: (
        <svg className={styles.menuIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="9" rx="1" />
          <rect x="14" y="3" width="7" height="5" rx="1" />
          <rect x="14" y="12" width="7" height="9" rx="1" />
          <rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
      ),
    },
    {
      name: "Checkbook",
      href: "/dashboard/checkbook",
      icon: (
        <svg className={styles.menuIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
  ];

  return (
    <aside className={styles.sidebar}>
      <div>
        <div className={styles.sectionLabel}>Features</div>
        <ul className={styles.menu}>
          {features.map((feature, idx) => {
            const isActive = pathname === feature.href;
            return (
              <li key={idx}>
                <Link
                  href={feature.href}
                  className={`${styles.menuItem} ${isActive ? styles.menuItemActive : ""}`}
                >
                  {feature.icon}
                  {feature.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={styles.sidebarBottom}>
        <Link
          href="/dashboard/settings"
          className={`${styles.userButton} ${pathname === "/dashboard/settings" ? styles.userButtonActive : ""}`}
          id="settings-btn"
          style={{ justifyContent: "center" }}
        >
          <span className={styles.userNameText}>{displayName}</span>
        </Link>

        <form action={logout} className={styles.logoutForm}>
          <button className={styles.logoutButton} id="logout-btn">
            Log Out
          </button>
        </form>
      </div>
    </aside>
  );
}

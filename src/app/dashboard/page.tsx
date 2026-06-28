import { redirect } from "next/navigation";
import Image from "next/image";
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

  // Mock Data matching the upload image design
  const stats = [
    {
      title: "Total Balance",
      value: "$58,154.07",
      change: "+2.5%",
      isPositive: true,
      icon: (
        <svg className={styles.statIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      ),
    },
    {
      title: "Monthly Expense",
      value: "$32,453.53",
      change: "+1.5%",
      isPositive: true,
      icon: (
        <svg className={styles.statIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12h14" />
        </svg>
      ),
    },
    {
      title: "Monthly Income",
      value: "$62,623.02",
      change: "+3.5%",
      isPositive: true,
      icon: (
        <svg className={styles.statIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M23 6l-9.5 9.5-5-5L1 18" />
          <path d="M17 6h6v6" />
        </svg>
      ),
    },
    {
      title: "Monthly Savings",
      value: "$62,766.43",
      change: "-1.5%",
      isPositive: false,
      icon: (
        <svg className={styles.statIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      ),
    },
  ];

  const cashFlowData = [
    { month: "Jan", income: 45, expense: 30 },
    { month: "Feb", income: 85, expense: 50 },
    { month: "Mar", income: 95, expense: 40 },
    { month: "Apr", income: 70, expense: 35 },
    { month: "May", income: 75, expense: 45 },
    { month: "Jun", income: 100, expense: 60, highlighted: true, label: "$16,251" },
    { month: "Jul", income: 55, expense: 30 },
    { month: "Aug", income: 45, expense: 20 },
    { month: "Sep", income: 75, expense: 40 },
    { month: "Oct", income: 98, expense: 55 },
    { month: "Nov", income: 80, expense: 35 },
    { month: "Dec", income: 70, expense: 45 },
  ];

  const upcomingTransactions = [
    { title: "Holiday trip", date: "10 Aug 2024", amount: "$1,846", color: "#e0e0ff", icon: "✈️" },
    { title: "Xbox", date: "02 Feb 2024", amount: "$2,121", color: "#f3e8ff", icon: "🎮" },
    { title: "Dropbox", date: "21 May 2024", amount: "$1,846", color: "#e0e0ff", icon: "📁" },
    { title: "Xbox", date: "19 Sep 2024", amount: "$2,121", color: "#f3e8ff", icon: "🎮" },
  ];

  const paymentHistory = [
    { name: "William Green", type: "Withdrawal", amount: "- $500.00", date: "10 Aug 2024", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" },
    { name: "Ronald Richards", type: "Transfer", amount: "- $163.00", date: "02 Feb 2024", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" },
    { name: "Darrell Steward", type: "Request", amount: "- $892.00", date: "21 May 2024", avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=100&q=80" },
    { name: "Albert Flores", type: "Withdrawal", amount: "- $273.00", date: "19 Sep 2024", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" },
    { name: "Annette Black", type: "Transfer", amount: "- $937.00", date: "25 Oct 2024", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" },
    { name: "Cameron", type: "Request", amount: "- $767.00", date: "02 Jul 2024", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=100&q=80" },
  ];

  return (
    <div className={styles.dashboard}>
      {/* Sidebar Navigation */}
      <aside className={styles.sidebar}>
        <div>
          <div className={styles.brand}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#635bff" strokeWidth="3">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
            </svg>
            Finance Tracker
          </div>

          <div className={styles.sectionLabel}>Main Menu</div>
          <ul className={styles.menu}>
            <li>
              <a href="/dashboard" className={`${styles.menuItem} ${styles.menuItemActive}`}>
                <svg className={styles.menuIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="9" rx="1" />
                  <rect x="14" y="3" width="7" height="5" rx="1" />
                  <rect x="14" y="12" width="7" height="9" rx="1" />
                  <rect x="3" y="16" width="7" height="5" rx="1" />
                </svg>
                Dashboard
              </a>
            </li>
            <li>
              <a href="#" className={styles.menuItem}>
                <svg className={styles.menuIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                My Wallet
              </a>
            </li>
            <li>
              <a href="#" className={styles.menuItem}>
                <svg className={styles.menuIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 3L21 7L17 11M7 21L3 17L7 13" />
                  <path d="M3 17H21M21 7H3" />
                </svg>
                Transfer
              </a>
            </li>
            <li>
              <a href="#" className={styles.menuItem}>
                <svg className={styles.menuIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Transactions
              </a>
            </li>
            <li>
              <a href="#" className={styles.menuItem}>
                <svg className={styles.menuIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <line x1="12" y1="4" x2="12" y2="20" />
                </svg>
                Payments
              </a>
            </li>
            <li>
              <a href="#" className={styles.menuItem}>
                <svg className={styles.menuIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
                Savings
              </a>
            </li>
          </ul>

          <div className={styles.sectionLabel}>Others</div>
          <ul className={styles.menu}>
            <li>
              <a href="#" className={styles.menuItem}>
                <svg className={styles.menuIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
                </svg>
                Settings
              </a>
            </li>
            <li>
              <a href="#" className={styles.menuItem}>
                <svg className={styles.menuIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
                Support
              </a>
            </li>
          </ul>
        </div>

        <div className={styles.upgradeCard}>
          <div className={styles.upgradeTitle}>Upgrade to Pro</div>
          <p className={styles.upgradeText}>Unlock advanced financial search, reports & charts.</p>
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

        {/* Stats Grid */}
        <section className={styles.statsGrid}>
          {stats.map((stat, idx) => (
            <div className={stat.title === "Total Balance" ? `${styles.statCard} ${styles.statCardBalance}` : styles.statCard} key={idx}>
              <div className={styles.statHeader}>
                {stat.icon}
                <span>{stat.title}</span>
              </div>
              <div className={styles.statValueWrapper}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={`${styles.badge} ${stat.isPositive ? styles.badgeSuccess : styles.badgeDanger}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </section>

        {/* Middle Section: Cash Flow & Donut */}
        <section className={styles.middleGrid}>
          {/* Cash Flow */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <span className={styles.statTitle}>Cash Flow</span>
                <h3 className={styles.chartValue}>$58,154.07</h3>
              </div>
              <div className={styles.cardActions}>
                <div className={styles.legend}>
                  <span className={styles.legendDot} style={{ backgroundColor: "#e0e0ff" }}></span> Expense
                </div>
                <div className={styles.legend}>
                  <span className={styles.legendDot} style={{ backgroundColor: "#635bff" }}></span> Income
                </div>
                <select className={styles.dropdown}>
                  <option>Monthly</option>
                  <option>Weekly</option>
                </select>
              </div>
            </div>

            <div className={styles.chartContainer}>
              <div className={styles.barChart}>
                {cashFlowData.map((data, idx) => (
                  <div className={styles.barGroup} key={idx}>
                    {data.highlighted && <div className={styles.tooltip}>{data.label}</div>}
                    <div className={styles.barWrapper}>
                      <div className={`${styles.bar} ${styles.barExpense}`} style={{ height: `${data.expense}%` }}></div>
                      <div className={`${styles.bar} ${styles.barIncome} ${data.highlighted ? styles.barActive : ""}`} style={{ height: `${data.income}%` }}></div>
                    </div>
                    <span className={styles.barLabel}>{data.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bill & Payment Donut */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Bill & Payment</h3>
              <select className={styles.dropdown}>
                <option>Monthly</option>
                <option>Weekly</option>
              </select>
            </div>

            <div className={styles.donutContainer}>
              <svg width="160" height="160" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                
                {/* 44% Daily Needs */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#635bff" strokeWidth="3.2" 
                        strokeDasharray="44 56" strokeDashoffset="25" />
                
                {/* 20% Savings */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#a855f7" strokeWidth="3.2" 
                        strokeDasharray="20 80" strokeDashoffset="81" />
                
                {/* 36% Shopping (Mocked for remaining gap, visually represents the rest) */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#60a5fa" strokeWidth="3.2" 
                        strokeDasharray="36 64" strokeDashoffset="61" />
              </svg>
              <div className={styles.donutCenter}>
                <span className={styles.donutLabel}>Total</span>
                <span className={styles.donutValue}>$102,000</span>
              </div>
            </div>

            <div className={styles.donutLegends}>
              <div className={styles.legend}>
                <span className={styles.legendDot} style={{ backgroundColor: "#635bff" }}></span> Needs (44%)
              </div>
              <div className={styles.legend}>
                <span className={styles.legendDot} style={{ backgroundColor: "#a855f7" }}></span> Savings (20%)
              </div>
              <div className={styles.legend}>
                <span className={styles.legendDot} style={{ backgroundColor: "#60a5fa" }}></span> Shopping (36%)
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Grid: Upcoming & History */}
        <section className={styles.bottomGrid}>
          {/* Upcoming Transaction */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Upcoming Transaction</h3>
            </div>
            <div className={styles.upcomingList}>
              {upcomingTransactions.map((item, idx) => (
                <div className={styles.upcomingItem} key={idx}>
                  <div className={styles.upcomingLeft}>
                    <div className={styles.upcomingIcon} style={{ backgroundColor: item.color }}>
                      {item.icon}
                    </div>
                    <div className={styles.upcomingInfo}>
                      <h4>{item.title}</h4>
                      <p>{item.date}</p>
                    </div>
                  </div>
                  <span className={styles.upcomingAmount}>{item.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* History */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Bill and Payment History</h3>
            </div>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>
                      <input type="checkbox" />
                    </th>
                    <th>Recipient</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <input type="checkbox" />
                      </td>
                      <td className={styles.userCell}>
                        <Image className={styles.tableAvatar} src={item.avatar} alt={item.name} width={28} height={28} />
                        {item.name}
                      </td>
                      <td>
                        <span className={`${styles.typeBadge} ${
                          item.type === "Withdrawal" ? styles.badgeWithdrawal :
                          item.type === "Transfer" ? styles.badgeTransfer :
                          styles.badgeRequest
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className={styles.amountCell}>{item.amount}</td>
                      <td>{item.date}</td>
                      <td>
                        <button className={styles.actionsBtn}>•••</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

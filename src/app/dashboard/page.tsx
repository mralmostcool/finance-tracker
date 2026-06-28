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

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Logged in as {user.email}</p>
        <form action={logout}>
          <button className={styles.logoutButton} id="logout-btn">
            Log Out
          </button>
        </form>
      </div>
    </div>
  );
}

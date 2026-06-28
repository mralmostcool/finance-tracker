import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import SidebarNav from "./SidebarNav";
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

  return (
    <div className={styles.dashboard}>
      <SidebarNav displayName={displayName} />
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
}

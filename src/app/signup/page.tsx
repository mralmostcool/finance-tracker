import Link from "next/link";
import { signup } from "../actions";
import GoogleButton from "../GoogleButton";
import styles from "../auth.module.css";

interface SearchParams {
  error?: string;
  message?: string;
}

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { error, message } = await searchParams;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>Get started with Finance Tracker today</p>

        {error && <div className={styles.errorAlert}>{error}</div>}
        {message && <div className={styles.successAlert}>{message}</div>}

        <form className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className={styles.input}
              placeholder="you@example.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className={styles.input}
              placeholder="••••••••"
            />
          </div>

          <button formAction={signup} className={styles.button} id="signup-btn">
            Sign Up
          </button>
        </form>

        <div className={styles.divider}>or</div>

        <GoogleButton />

        <p className={styles.footerText}>
          Already have an account?{" "}
          <Link href="/" className={styles.link} id="login-link">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}

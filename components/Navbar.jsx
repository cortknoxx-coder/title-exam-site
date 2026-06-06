import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <header className={styles.header}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          <span className="serif-title">Title Services</span>
        </Link>

        <nav className={styles.navLinks}>
          <Link href="/" className={styles.link}>Services & Coverage</Link>
          <Link href="/dashboard" className={styles.link}>Client Portal</Link>
          <Link href="/search" className={`${styles.link} ${styles.ctaLink}`}>
            Order Title Service
          </Link>
        </nav>

        <div className={styles.systemStatus}>
          <div className={styles.statusDot}></div>
          <span className={styles.statusText}>Courthouse Runners Active</span>
          <div className={styles.dropdown}>
            <div className={styles.countyStatus}>
              <span>Santa Clara (San Jose Court)</span>
              <span className={styles.onlineBadge}>Dispatched</span>
            </div>
            <div className={styles.countyStatus}>
              <span>Alameda (Oakland Court)</span>
              <span className={styles.onlineBadge}>Dispatched</span>
            </div>
            <div className={styles.countyStatus}>
              <span>San Mateo (Redwood City Court)</span>
              <span className={styles.onlineBadge}>Dispatched</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

import styles from "./Footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.branding}>
          <h2 className="serif-title">Aurelius</h2>
          <p className={styles.subtext}>
            High-fidelity title examination reports and document retrieval for 
            California Bay Area counties. Powered by an automated parsing engine.
          </p>
        </div>
        <div className={styles.grid}>
          <div className={styles.column}>
            <h3>Coverage</h3>
            <ul>
              <li>Santa Clara County</li>
              <li>Alameda County</li>
              <li>San Mateo County</li>
            </ul>
          </div>
          <div className={styles.column}>
            <h3>Search Types</h3>
            <ul>
              <li>Current Owner Search</li>
              <li>Two-Owner Chain</li>
              <li>30 / 60 Year Searches</li>
              <li>GIS Land Search</li>
            </ul>
          </div>
          <div className={styles.column}>
            <h3>Platform</h3>
            <ul>
              <li>Vercel Cloud</li>
              <li>Secure Storage</li>
              <li>Automated Dispatch</li>
            </ul>
          </div>
        </div>
      </div>
      <div className={styles.bottomBar}>
        <p>© {currentYear} Aurelius Title Services. All rights reserved.</p>
        <p className={styles.disclaimer}>
          Privacy Policy • Terms of Service • Licensed Escrow & County Recording Solutions
        </p>
      </div>
    </footer>
  );
}

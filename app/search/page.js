"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchForm from "@/components/SearchForm";
import styles from "./page.module.css";

export default function SearchPage() {
  return (
    <div className="app-wrapper">
      <Navbar />

      <main className="main-content">
        <div className="container" style={{ margin: "40px auto 80px" }}>
          
          <div className={styles.searchHeader}>
            <span className="badge badge-gold">Dispatch Terminal</span>
            <h1 className={styles.title}>Dispatch Courthouse Runner</h1>
            <p className={styles.subtitle}>
              Submit property parameters to dispatch a certified title runner to regional county vaults 
              to compile certified chain of title reports.
            </p>
          </div>

          <div className={styles.formContainer}>
            <SearchForm />
          </div>

          {/* Database connections stats */}
          <div className={styles.infoGrid}>
            <div className="premium-card">
              <h4>🔐 Enforced Encryption</h4>
              <p>All database queries utilize secure SHA-256 protocols and meet modern cloud data security compliance guidelines.</p>
            </div>
            <div className="premium-card">
              <h4>🏛️ Certified Recording Books</h4>
              <p>Direct electronic parsing of regional books including Deeds of Trust, Grant Deeds, Parcel Maps, and Tax Rolls.</p>
            </div>
            <div className="premium-card">
              <h4>📡 Serverless Index Sync</h4>
              <p>Vercel edge functions cache regional public deeds with automatic delta-index syncing every 10 seconds.</p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

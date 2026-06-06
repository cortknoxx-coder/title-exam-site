import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className="app-wrapper">
      <Navbar />

      <main className="main-content">
        {/* Agency Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.ambientBlob1}></div>
          <div className={styles.ambientBlob2}></div>

          <div className="container">
            <div className={styles.heroGrid}>
              <div className={styles.heroContent}>
                <h1 className={styles.title}>
                  Certified <span className="serif-title">Title Examinations</span>
                </h1>
                <p className={styles.subtitle}>
                  Certified title examination services across **Santa Clara, Alameda, and San Mateo** counties.
                </p>
                <div className={styles.heroCtas}>
                  <Link href="/search" className="btn btn-primary">
                    ⚡ Order Title Service
                  </Link>
                  <Link href="/dashboard" className="btn btn-secondary">
                    Access Client Portal
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Agency Metrics Banner */}
        <section className={styles.metricsSection}>
          <div className="container">
            <div className={styles.metricsGrid}>
              <div className="premium-card">
                <span className={styles.metricLabel}>Standard Turnaround</span>
                <h3 className={styles.metricVal}>3-5 Days</h3>
                <p>Standard courthouse searches completed in 3-5 business days. Certified document pulls in 24 hours.</p>
              </div>
              <div className="premium-card">
                <span className={styles.metricLabel}>Coverage Counties</span>
                <h3 className={styles.metricVal}>3 / 3</h3>
                <p>Runners stationed directly in Santa Clara, Alameda, & San Mateo county clerks.</p>
              </div>
              <div className="premium-card">
                <span className={styles.metricLabel}>Onsite Retrieval</span>
                <h3 className={styles.metricVal}>100%</h3>
                <p>Actual certified documents are pulled directly from physical microfilm rolls and paper ledgers.</p>
              </div>
              <div className="premium-card">
                <span className={styles.metricLabel}>Quality Assurance</span>
                <h3 className={styles.metricVal}>Double Pass</h3>
                <p>Every report undergoes a double-pass review by senior title examiners before delivery.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Professional Services Suite */}
        <section className={styles.countiesSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <span className="badge badge-gold">Standardized B2B Agency Rates</span>
              <h2>Professional Courthouse Services Catalog</h2>
              <p>
                All standard searches are completed in <strong>3-5 business days</strong>. Certified document retrievals are expedited in <strong>24 hours</strong>. 
                Need it faster? <strong>24-Hour Express Rush Dispatches</strong> are accepted on any order for an additional flat fee. 
                All order dispatch alerts and progress notifications are securely routed to <strong>cortney@dpaconsortium.org</strong>.
              </p>
            </div>

            <div className={styles.countyGrid}>
              {/* Service 1 */}
              <div className="premium-card">
                <div className={styles.countyHeader}>
                  <h3>Current Owner Search</h3>
                  <span className="badge badge-gold">$95 Standard</span>
                </div>
                <p className={styles.serviceDesc}>
                  Our runner goes onsite to the Clerk of Court to pull the active vesting deed, current owner of record, open mortgages, and local tax assessments.
                </p>
                <ul className={styles.countyStats}>
                  <li><span>Turnaround:</span> 3-5 Business Days</li>
                  <li><span>Rush Delivery:</span> Express 24-Hr Available</li>
                  <li><span>County Scope:</span> SC, Ala, SM</li>
                  <li><span>Document Copy:</span> Vesting Deed</li>
                </ul>
                <Link href="/search" className="btn btn-outline-gold" style={{ display: "flex", width: "100%" }}>
                  Order Current Owner Service
                </Link>
              </div>

              {/* Service 2 */}
              <div className="premium-card">
                <div className={styles.countyHeader}>
                  <h3>Two-Owner Search</h3>
                  <span className="badge badge-gold">$150 Standard</span>
                </div>
                <p className={styles.serviceDesc}>
                  Searches ownership back through the last two out-of-family deeds. Includes physical audit of deed indexes, active mortgages, liens, and taxes.
                </p>
                <ul className={styles.countyStats}>
                  <li><span>Turnaround:</span> 3-5 Business Days</li>
                  <li><span>Rush Delivery:</span> Express 24-Hr Available</li>
                  <li><span>County Scope:</span> SC, Ala, SM</li>
                  <li><span>Document Copy:</span> Last 2 Deeds</li>
                </ul>
                <Link href="/search" className="btn btn-outline-gold" style={{ display: "flex", width: "100%" }}>
                  Order Two-Owner Search
                </Link>
              </div>

              {/* Service 3 */}
              <div className="premium-card">
                <div className={styles.countyHeader}>
                  <h3>30-Year Chain Audit</h3>
                  <span className="badge badge-gold">$250 Standard</span>
                </div>
                <p className={styles.serviceDesc}>
                  A full, professional onsite audit of deeds, mortgages, judgements, and permanent utility easements recorded in county vaults over the last 30 years.
                </p>
                <ul className={styles.countyStats}>
                  <li><span>Turnaround:</span> 3-5 Business Days</li>
                  <li><span>Rush Delivery:</span> Express 24-Hr Available</li>
                  <li><span>County Scope:</span> SC, Ala, SM</li>
                  <li><span>Document Copy:</span> Complete chain</li>
                </ul>
                <Link href="/search" className="btn btn-outline-gold" style={{ display: "flex", width: "100%" }}>
                  Order 30-Year Search
                </Link>
              </div>

              {/* Service 4 */}
              <div className="premium-card">
                <div className={styles.countyHeader}>
                  <h3>60-Year Chain Audit</h3>
                  <span className="badge badge-gold">$375 Standard</span>
                </div>
                <p className={styles.serviceDesc}>
                  Comprehensive courthouse scan of early subdivisions, patent land grants, mineral rights, covenants, and long-term easement holdings since 1900.
                </p>
                <ul className={styles.countyStats}>
                  <li><span>Turnaround:</span> 3-5 Business Days</li>
                  <li><span>Rush Delivery:</span> Express 24-Hr Available</li>
                  <li><span>County Scope:</span> SC, Ala, SM</li>
                  <li><span>Document Copy:</span> Historic patent + chain</li>
                </ul>
                <Link href="/search" className="btn btn-outline-gold" style={{ display: "flex", width: "100%" }}>
                  Order 60-Year Search
                </Link>
              </div>

              {/* Service 5 */}
              <div className="premium-card">
                <div className={styles.countyHeader}>
                  <h3>Onsite Document Pull</h3>
                  <span className="badge badge-gold">$45 Standard</span>
                </div>
                <p className={styles.serviceDesc}>
                  Dispatches a field runner directly to the Clerk of Court record vaults to physically copy, scan, and certify specific instruments from microfilm rolls.
                </p>
                <ul className={styles.countyStats}>
                  <li><span>Turnaround:</span> 24 Hours</li>
                  <li><span>Rush Delivery:</span> Same-Day Rush Available</li>
                  <li><span>County Scope:</span> SC, Ala, SM</li>
                  <li><span>Document Copy:</span> Certified Instrument</li>
                </ul>
                <Link href="/search" className="btn btn-outline-gold" style={{ display: "flex", width: "100%" }}>
                  Order Document Pull
                </Link>
              </div>

              {/* Service 6 */}
              <div className="premium-card">
                <div className={styles.countyHeader}>
                  <h3>Land & GIS Assessor Audit</h3>
                  <span className="badge badge-gold">$110 Standard</span>
                </div>
                <p className={styles.serviceDesc}>
                  Detailed municipal lookup at the county assessor's office. Provides parcel dimensions, acreage maps, zoning classifications, and setbacks.
                </p>
                <ul className={styles.countyStats}>
                  <li><span>Turnaround:</span> 3-5 Business Days</li>
                  <li><span>Rush Delivery:</span> Express 24-Hr Available</li>
                  <li><span>County Scope:</span> SC, Ala, SM</li>
                  <li><span>Document Copy:</span> Assessor Plat Map</li>
                </ul>
                <Link href="/search" className="btn btn-outline-gold" style={{ display: "flex", width: "100%" }}>
                  Order Assessor Audit
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Physical Dispatch Operations Timeline */}
      </main>

      <Footer />
    </div>
  );
}

"use client";

import styles from "./Timeline.module.css";

export default function Timeline({ chain, onSelectDoc }) {
  if (!chain || chain.length === 0) return null;

  return (
    <div className="premium-card">
      <div className={styles.timelineHeader}>
        <h3>🔗 Chain of Title Conveyance History</h3>
        <p className={styles.subtext}>Chronological timeline of recorded deeds and ownership transfers.</p>
      </div>

      <div className={styles.timelineContainer}>
        {chain.map((deed, index) => {
          const year = deed.date.substring(0, 4);
          const isVesting = index === 0;

          return (
            <div key={deed.id} className={`${styles.timelineNode} ${isVesting ? styles.vestingNode : ""}`}>
              {/* Connector line */}
              {index < chain.length - 1 && <div className={styles.connectorLine}></div>}

              {/* Year badge */}
              <div className={styles.yearBadge}>
                <span>{year}</span>
              </div>

              {/* Node Indicator Dot */}
              <div className={styles.nodeDot}>
                <div className={styles.innerDot}></div>
              </div>

              {/* Card Details */}
              <div className={styles.nodeCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.titleWrapper}>
                    <h4>{deed.documentType}</h4>
                    {isVesting && <span className="badge badge-gold">Current Vesting Deed</span>}
                  </div>
                  <span className={styles.docNumber}>Doc #: {deed.documentNumber}</span>
                </div>

                <div className={styles.conveyanceDetails}>
                  <div className={styles.partyRow}>
                    <span>Grantor (Seller):</span>
                    <strong>{deed.grantor}</strong>
                  </div>
                  <div className={styles.partyRow}>
                    <span>Grantee (Buyer):</span>
                    <strong>{deed.grantee}</strong>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <div className={styles.metadata}>
                    {deed.consideration && (
                      <span>Consideration: <strong>{deed.consideration}</strong></span>
                    )}
                    {deed.bookPage && deed.bookPage !== "N/A - Electronic Record" && (
                      <span>• Book/Page: <strong>{deed.bookPage}</strong></span>
                    )}
                  </div>
                  <button 
                    type="button"
                    className="btn btn-outline-gold"
                    style={{ padding: "6px 12px", fontSize: "0.75rem" }}
                    onClick={() => onSelectDoc(deed)}
                  >
                    👁 Inspect Scanned Deed
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

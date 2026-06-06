"use client";

import styles from "./DocViewer.module.css";

export default function DocViewer({ doc, onClose }) {
  if (!doc) return null;

  // Determine standard legal body text based on document type
  const renderLegalText = () => {
    switch (doc.documentType) {
      case "Grant Deed":
        return (
          <div className={styles.legalBody}>
            <p className={styles.caps}>FOR A VALUABLE CONSIDERATION, RECEIPT OF WHICH IS HEREBY ACKNOWLEDGED,</p>
            <p className={styles.grantorLine}>
              <strong>{doc.grantor || doc.debtor}</strong>, hereby GRANTS to
            </p>
            <p className={styles.granteeLine}>
              <strong>{doc.grantee || doc.securedParty}</strong>, as Joint Tenants,
            </p>
            <p>the following described real property in the City of {doc.city || "San Jose"}, County of {doc.county}, State of California:</p>
            <p className={styles.indent}>
              {doc.legalDescription || "LOT 14 MAP OF WILLOW GLEN TRACT UNIT NO 3 REC. BOOK 42 OF MAPS PG 18, COUNTY RECORDS."}
            </p>
            <p>Assessor's Parcel Number: <strong>{doc.apn || "264-38-042"}</strong></p>
            <p>Commonly known as: <strong>{doc.propertyAddress || doc.address}</strong></p>
            
            <div className={styles.considerationBox}>
              CONSIDERATION SUBSTANTIATED: {doc.consideration || "$1,350,000"} (US DOLLARS)
            </div>
          </div>
        );
      case "Deed of Trust":
        return (
          <div className={styles.legalBody}>
            <p className={styles.caps}>THIS DEED OF TRUST SECURES A REAL ESTATE CONVEYANCE DEBT AND LIEN REGISTERED ON THIS DAY.</p>
            <p>
              This Deed of Trust is made among <strong>{doc.grantor || doc.debtor}</strong>, herein referred to as Trustor,
              whose address is {doc.propertyAddress || doc.address}, and <strong>{doc.grantee || doc.securedParty}</strong>, herein referred to as Beneficiary.
            </p>
            <p>
              Trustor irrevocably grants, transfers, and assigns to Trustee, in trust, with power of sale, the property described herein to secure the performance of covenants and payment of the principal sum of:
            </p>
            <p className={styles.amountLine}>
              <strong>{doc.consideration || doc.amount || "$1,080,000"}</strong>
            </p>
            <p>Secured by the property situated in the County of {doc.county}, State of California, commonly referred to as {doc.propertyAddress || doc.address}.</p>
          </div>
        );
      case "Notice of Lien":
      case "Notice of State Tax Lien":
      case "Notice of Mechanic's Lien":
        return (
          <div className={styles.legalBody}>
            <p className={styles.caps}>NOTICE IS HEREBY GIVEN THAT A REAL PROPERTY ENCUMBRANCE AND LIEN HAS BEEN RECORDED AGAINST THE SUBJECT VESTEE.</p>
            <p>
              Pursuant to California Civil Code regulations, the Lienor <strong>{doc.grantee || doc.securedParty}</strong> hereby asserts a claim and statutory lien against the interest of the property owner <strong>{doc.grantor || doc.debtor}</strong>.
            </p>
            <p>The amount of the claim, representing unpaid assessment, labor, or state taxes, constitutes a demand for:</p>
            <p className={styles.amountLine}>
              <strong>{doc.consideration || doc.amount || "$18,400"}</strong>
            </p>
            <p>This lien attaches to all land, improvements, and holdings associated with Assessor's Parcel Number {doc.apn || "084-0610-025-00"}, commonly known as {doc.propertyAddress || doc.address}.</p>
          </div>
        );
      default:
        return (
          <div className={styles.legalBody}>
            <p className={styles.caps}>RECORDED INSTRUMENT DOCUMENT INDEX ENTRY</p>
            <p><strong>Document Type:</strong> {doc.documentType}</p>
            <p><strong>County of Record:</strong> {doc.county}</p>
            <p><strong>Recorded Date:</strong> {doc.date}</p>
            <p><strong>Instrument ID:</strong> {doc.documentNumber}</p>
            <p><strong>Execution Details:</strong> {doc.details}</p>
            <p><strong>Parties Involved:</strong> {doc.grantor || doc.debtor} (First Party) and {doc.grantee || doc.securedParty} (Second Party)</p>
          </div>
        );
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Left Side: Mock Scanned Document */}
        <div className={styles.documentPaper}>
          <div className={styles.microfilmStrip}>
            <span>📼 AURELIUS DIGITAL MICROFILM PROJECTOR v1.1</span>
            <span>INDEX NO: {doc.documentNumber}</span>
          </div>

          <div className={styles.pageContent}>
            {/* Header Layout */}
            <div className={styles.headerBlock}>
              <div className={styles.requestBox}>
                <span>RECORDING REQUESTED BY:</span>
                <strong>First American Title Company</strong>
                <span>AND WHEN RECORDED MAIL TO:</span>
                <strong>{doc.grantee || doc.securedParty}</strong>
                <span>Mail Address: 100 Financial Way, SF, CA</span>
              </div>

              {/* simulated Recorder Stamp */}
              <div className={styles.recorderStamp}>
                <div className={styles.stampHeader}>RECORDER USE ONLY</div>
                <div className={styles.stampBody}>
                  <span>DOCUMENT NO: <strong>{doc.documentNumber}</strong></span>
                  <span>RECORDED: <strong>{doc.date}</strong></span>
                  <span>TIME: <strong>08:00 AM</strong></span>
                  <span>COUNTY: <strong>{doc.county.toUpperCase()}</strong></span>
                  <span>FEE: <strong>$28.00</strong> • DEP: <strong>AB</strong></span>
                </div>
              </div>
            </div>

            <hr className={styles.thickLine} />

            {/* Document Title */}
            <h1 className={styles.docTitle}>{doc.documentType.toUpperCase()}</h1>

            <hr className={styles.thinLine} />

            {/* Legal text */}
            {renderLegalText()}

            {/* Signature Block */}
            <div className={styles.signatureBlock}>
              <div className={styles.sigLineWrapper}>
                <div className={styles.cursiveSig}>
                  {doc.grantor ? doc.grantor.split(" ")[0] : "Grantor Signature"}
                </div>
                <span className={styles.sigLabel}>First Party / Grantor</span>
              </div>
              <div className={styles.sigLineWrapper}>
                <div className={styles.cursiveSig}>
                  {doc.grantee ? doc.grantee.split(" ")[0] : "Grantee Signature"}
                </div>
                <span className={styles.sigLabel}>Second Party / Grantee</span>
              </div>
            </div>

            {/* Notary block */}
            <div className={styles.notaryBlock}>
              <div className={styles.notaryWarning}>
                A notary public or other officer completing this certificate verifies only the identity of the 
                individual who signed the document to which this certificate is attached, and not the truthfulness, 
                accuracy, or validity of that document.
              </div>
              <div className={styles.notaryForm}>
                <p>State of California, County of {doc.county}</p>
                <p>On <strong>{doc.date}</strong>, before me, <strong>Clara Bow, Notary Public</strong>, personally appeared <strong>{doc.grantor || doc.debtor}</strong>, who proved to me on the basis of satisfactory evidence to be the person whose name is subscribed to the within instrument.</p>
              </div>
              
              {/* Gold circular notary seal */}
              <div className={styles.notarySeal}>
                <div className={styles.sealInner}>
                  <span>OFFICIAL SEAL</span>
                  <span>CLARA BOW</span>
                  <span>NOTARY - CALIF.</span>
                  <span>EXP. 2028</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Audit details & Controls */}
        <div className={styles.auditPanel}>
          <div className={styles.panelHeader}>
            <h3>📋 Legal Audit Registry</h3>
            <span className="badge badge-gold">Verified</span>
          </div>

          <div className={styles.auditDetails}>
            <div className={styles.auditRow}>
              <span>Document Type</span>
              <strong>{doc.documentType}</strong>
            </div>
            <div className={styles.auditRow}>
              <span>Document No.</span>
              <strong className={styles.mono}>{doc.documentNumber}</strong>
            </div>
            <div className={styles.auditRow}>
              <span>Recording Date</span>
              <strong className={styles.mono}>{doc.date}</strong>
            </div>
            <div className={styles.auditRow}>
              <span>Book & Page</span>
              <strong className={styles.mono}>{doc.bookPage || "Electronic Record"}</strong>
            </div>
            <div className={styles.auditRow}>
              <span>County</span>
              <strong>{doc.county}</strong>
            </div>
            {doc.consideration && doc.consideration !== "N/A" && (
              <div className={styles.auditRow}>
                <span>Consideration</span>
                <strong className={styles.highlight}>{doc.consideration}</strong>
              </div>
            )}
            <div className={styles.auditDescription}>
              <span>Audit Summary</span>
              <p>{doc.details || "This document represents a legally binding real property instrument filed and index-synchronized under standard ALTA registry guidelines."}</p>
            </div>
          </div>

          <div className={styles.verifiedCheck}>
            <div className={styles.checkmarkIcon}>🏛️</div>
            <div>
              <h4>Onsite Courthouse Pull</h4>
              <p>Physical record verified, copied, and certified directly from the Clerk of the Court vaults.</p>
            </div>
          </div>

          <div className={styles.panelActions}>
            <button type="button" className="btn btn-primary" onClick={() => window.print()}>
              🖨 Print / Export Instrument
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close Viewer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

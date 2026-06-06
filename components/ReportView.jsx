"use client";

import { useState } from "react";
import ParcelMap from "./ParcelMap";
import Timeline from "./Timeline";
import DocViewer from "./DocViewer";
import styles from "./ReportView.module.css";

export default function ReportView({ property, searchType }) {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [downloadingFile, setDownloadingFile] = useState(null);

  if (!property) return null;

  // Formatting helper for searchType labels
  const getSearchTypeLabel = () => {
    switch (searchType) {
      case "current_owner": return "Current Owner Search";
      case "two_owner": return "Two-Owner Search";
      case "thirty_year": return "30-Year Chain Scan";
      case "sixty_year": return "60-Year Chain Scan";
      case "land_search": return "Land & Parcel GIS Search";
      default: return "Full Title Examination";
    }
  };

  const handleOpenDoc = (deedOrEncumbrance) => {
    // Structure a document object to pass to DocViewer
    const documentToView = {
      ...deedOrEncumbrance,
      county: property.county,
      apn: property.apn,
      address: property.address,
      city: property.city,
      legalDescription: property.landDetails.legalDescription
    };
    setSelectedDoc(documentToView);
  };

  // Certified Attachments download handler
  const handleDownload = (fileKey, defaultName) => {
    const file = property.attachments?.[fileKey];
    
    if (file && file.content) {
      // If it is a real file uploaded via the workbook, download it directly!
      setDownloadingFile(file.name);
      setTimeout(() => {
        setDownloadingFile(null);
        const link = document.createElement("a");
        link.href = file.content;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, 800);
    } else {
      // Standard registry download: generate a real downloadable certified document in the browser!
      const fileName = file?.name || defaultName;
      setDownloadingFile(fileName);
      setTimeout(() => {
        setDownloadingFile(null);
        
        let reportTitle = "CERTIFIED COUNTY RECORD ARCHIVE RETRIEVAL";
        let contentBody = `AURELIUS TITLE SERVICES - COUNTY RECORD CLERK DISPATCH\n`;
        contentBody += `========================================================\n`;
        contentBody += `TICKET ID: ${property.ticketId || "#AX-2026-Pending"}\n`;
        contentBody += `PROPERTY APN: ${property.apn}\n`;
        contentBody += `ADDRESS: ${property.address}\n`;
        contentBody += `COUNTY: ${property.county} County Clerk Vault, CA\n`;
        contentBody += `DATE CERTIFIED: ${new Date().toLocaleDateString()}\n`;
        contentBody += `========================================================\n\n`;
        
        if (fileKey === "deedsFile") {
          reportTitle = "Vesting & Chain Deeds certified scan";
          contentBody += `OFFICIAL RECORD - CERTIFIED CONVEYANCE HISTORY\n\n`;
          (property.chainOfTitle || []).forEach((deed, index) => {
            contentBody += `Deed #${index + 1}: Recorded ${deed.date}\n`;
            contentBody += `  Document #: ${deed.documentNumber}\n`;
            contentBody += `  Book/Page: ${deed.bookPage}\n`;
            contentBody += `  Grantor (Seller): ${deed.grantor}\n`;
            contentBody += `  Grantee (Buyer): ${deed.grantee}\n`;
            contentBody += `  Consideration: ${deed.consideration}\n`;
            contentBody += `  Details: ${deed.details}\n\n`;
          });
        } else if (fileKey === "taxInvoiceFile") {
          reportTitle = "Courthouse services photostatic invoice";
          contentBody += `OFFICIAL PHOTOSTATIC SERVICE INVOICE\n\n`;
          contentBody += `Service Item: Courthouse Onsite Clerk Audit & Microfilm Retrieval\n`;
          contentBody += `County Dispatch Fee: $150.00\n`;
          contentBody += `Clerk Counter Copy Fee: $25.00\n`;
          contentBody += `Total Certified Service Charge: $175.00\n`;
          contentBody += `Status: PAID IN FULL - SECURE ESCROW CLEARANCE\n`;
        } else if (fileKey === "taxBillFile") {
          reportTitle = "Certified County Tax Assessor receipt";
          contentBody += `OFFICIAL TAX ASSESSOR RECEIPT & LEDGER\n\n`;
          contentBody += `Assessed Land value: $${property.taxes?.assessedValue?.land || "N/A"}\n`;
          contentBody += `Assessed Improvements: $${property.taxes?.assessedValue?.improvements || "N/A"}\n`;
          contentBody += `Assessed Total: $${property.taxes?.assessedValue?.total || "N/A"}\n`;
          contentBody += `Annual Property Tax: $${property.taxes?.annualTax || "N/A"}\n`;
          contentBody += `TRA Rate Area: ${property.taxes?.taxRateArea || "N/A"}\n`;
          contentBody += `Ledger Status: ${property.taxes?.status || "Paid"}\n\n`;
          contentBody += `Historical Ledger:\n`;
          (property.taxes?.history || []).forEach(h => {
            contentBody += `  Year ${h.year} - Amount $${h.amount} - Status ${h.status} (Paid ${h.paidDate})\n`;
          });
        } else {
          contentBody += `EXAMINER MASTER RUN SHEET EXHIBIT LEDGER\n\n`;
          (property.chainOfTitle || []).forEach(deed => {
            contentBody += `[DEED] ${deed.date} - Doc ${deed.documentNumber} - Book/Pg ${deed.bookPage}\n`;
            contentBody += `  Grantor: ${deed.grantor} | Grantee: ${deed.grantee} | Cons: ${deed.consideration}\n\n`;
          });
          (property.encumbrances || []).forEach(enc => {
            contentBody += `[${enc.documentType.toUpperCase()}] ${enc.date} - Doc ${enc.documentNumber} - Status ${enc.status}\n`;
            contentBody += `  Debtor: ${enc.debtor} | Secured: ${enc.securedParty} | Amt: ${enc.amount}\n\n`;
          });
        }
        
        contentBody += `========================================================\n`;
        contentBody += `🏛️ CERTIFIED PRIMARY SOURCE RECORDS VERIFICATION SEAL\n`;
        contentBody += `AURELIUS TITLE GROUP INC. • SECURE B2B RECORDS ARCHIVE\n`;
        
        // Generate a text file blob containing high-fidelity certified record logs and download it
        const blob = new Blob([contentBody], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName.replace(".pdf", ".txt"); // download as readable certified transcript!
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 800);
    }
  };

  // Find active mortgages and other liens
  const mortgages = property.encumbrances.filter(enc => enc.documentType === "Deed of Trust");
  const otherEncumbrances = property.encumbrances.filter(enc => enc.documentType !== "Deed of Trust");

  // Compile entire Run Sheet (deeds + encumbrances combined chronologically descending)
  const chainRunSheet = property.chainOfTitle.map(deed => ({
    ...deed,
    debtor: deed.grantor,
    securedParty: deed.grantee,
    amount: deed.consideration,
    status: "Chain of Title",
    badgeClass: "badge-gold"
  }));

  const encumbRunSheet = property.encumbrances.map(enc => ({
    ...enc,
    badgeClass: enc.status === "Released" ? "badge-success" : enc.status.includes("Permanent") ? "badge-info" : "badge-danger"
  }));

  const fullRunSheet = [...chainRunSheet, ...encumbRunSheet].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  // Extracted modular renderer for Spatial Plat Maps to support clean multi-column scoping
  const renderMapCard = () => (
    <ParcelMap landDetails={property.landDetails} apn={property.apn} />
  );

  // Extracted modular renderer for County Tax Registers to support clean multi-column scoping
  const renderTaxCard = () => (
    <div className="premium-card">
      <div className={styles.cardHeader}>
        <h3>🏦 Property Assessor & Tax Registers</h3>
        <p className={styles.cardSubtext}>County ad-valorem tax assessments, rates, and historical schedules.</p>
      </div>

      <div className={styles.taxSummaryBox}>
        <div className={styles.taxHighlightBox}>
          <span>Current Assessed Value</span>
          <h2>${property.taxes.assessedValue.total.toLocaleString()}</h2>
          <div className={styles.taxAssessmentSplit}>
            <span>Land: <strong>${property.taxes.assessedValue.land.toLocaleString()}</strong></span>
            <span>Improvements: <strong>${property.taxes.assessedValue.improvements.toLocaleString()}</strong></span>
          </div>
        </div>

        <div className={styles.taxHighlightBox}>
          <span>Annual Tax Amount</span>
          <h3 className={styles.taxVal}>${property.taxes.annualTax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
          <span className={`badge ${property.taxes.status === "Paid" ? "badge-success" : "badge-danger"}`} style={{ alignSelf: "flex-start", marginTop: "6px" }}>
            Status: {property.taxes.status}
          </span>
        </div>
      </div>

      <div className={styles.taxDetailsGrid}>
        <div>
          <span>Tax Rate Area:</span> <strong>{property.taxes.taxRateArea}</strong>
        </div>
        <div>
          <span>GIS Lot Area:</span> <strong>{property.landDetails.squareFeet} Sq Ft ({property.landDetails.acreage} Ac)</strong>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <h4 style={{ margin: "16px 0 8px", fontSize: "0.85rem", textTransform: "uppercase", color: "var(--text-muted)" }}>Payment Ledger</h4>
        <table className={styles.reportTable}>
          <thead>
            <tr>
              <th>Tax Year</th>
              <th>Annual Assessment</th>
              <th>Date Paid</th>
              <th>Ledger Status</th>
            </tr>
          </thead>
          <tbody>
            {property.taxes.history.map(hist => (
              <tr key={hist.year}>
                <td className={styles.mono}>{hist.year}</td>
                <td>${hist.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td>{hist.paidDate || "— (Delinquent)"}</td>
                <td>
                  <span className={`badge ${hist.status === "Paid" ? "badge-success" : "badge-danger"}`}>
                    {hist.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className={styles.reportContainer}>
      {/* 1. TOP HEADER BANNER */}
      <div className={`${styles.headerBanner} premium-card`}>
        <div className={styles.headerLeft}>
          <span className="badge badge-gold">{getSearchTypeLabel()}</span>
          <h1 className={styles.addressTitle}>{property.address}</h1>
          <p className={styles.apnLine}>
            APN: <strong>{property.apn}</strong> • County Jurisdiction: <strong>{property.county} County Clerk, CA</strong>
          </p>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.certSealBox}>
            <span className={styles.sealCheck}>🏛️</span>
            <div>
              <span>ONSITE FIELD SEARCH</span>
              <strong>COURTHOUSE CERTIFIED</strong>
            </div>
          </div>
          <button 
            type="button" 
            className="btn btn-primary no-print"
            onClick={() => window.print()}
          >
            🖨 Print / Export PDF
          </button>
        </div>
      </div>

      {/* 2. SPLIT LAYOUT PANEL */}
      <div className={styles.gridSplit}>
        
        {/* LEFT COLUMN: Conveyance Timelines, Mortgages, GIS Bounds */}
        <div className={styles.leftColumn}>
          
          {/* Spatial maps & Assessor schedules strictly in left wide panel for GIS searches */}
          {searchType === "land_search" && (
            <>
              {renderMapCard()}
              {renderTaxCard()}
            </>
          )}

          {/* A. CONVEYANCE TIMELINE (Only for ownership searches) */}
          {searchType !== "land_search" && searchType !== "doc_retrieval" && (
            <Timeline chain={property.chainOfTitle} onSelectDoc={handleOpenDoc} />
          )}

          {/* B. OUTSTANDING MORTGAGES (Only for ownership searches) */}
          {searchType !== "land_search" && searchType !== "doc_retrieval" && (
            <div className="premium-card">
              <div className={styles.cardHeader}>
                <h3>💳 Active Mortgages / Deeds of Trust</h3>
                <p className={styles.cardSubtext}>Active recorded liens securing real estate lending agreements.</p>
              </div>

              {mortgages.length > 0 ? (
                <div className={styles.tableWrapper}>
                  <table className={styles.reportTable}>
                    <thead>
                      <tr>
                        <th>Lender</th>
                        <th>Borrower</th>
                        <th>Amount</th>
                        <th>Recording Date</th>
                        <th>Doc #</th>
                        <th>Status</th>
                        <th className="no-print">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mortgages.map(mort => (
                        <tr key={mort.id} className={mort.status === "Released" ? styles.releasedRow : ""}>
                          <td><strong>{mort.securedParty}</strong></td>
                          <td>{mort.debtor}</td>
                          <td className={styles.mortAmount}>{mort.amount}</td>
                          <td>{mort.date}</td>
                          <td className={styles.mono}>{mort.documentNumber}</td>
                          <td>
                            <span className={`badge ${mort.status === "Released" ? "badge-success" : "badge-warning"}`}>
                              {mort.status}
                            </span>
                          </td>
                          <td className="no-print">
                            <button 
                              type="button"
                              className="btn btn-secondary"
                              style={{ padding: "4px 8px", fontSize: "0.7rem" }}
                              onClick={() => handleOpenDoc(mort)}
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className={styles.noEncumbText}>No outstanding deeds of trust found of record.</p>
              )}
            </div>
          )}

          {/* C. LIENS, JUDGMENTS & EASEMENTS (Only for ownership searches) */}
          {searchType !== "land_search" && searchType !== "doc_retrieval" && (
            <div className="premium-card">
              <div className={styles.cardHeader}>
                <h3>⚠️ Encumbrances, Easements & Liens</h3>
                <p className={styles.cardSubtext}>Tax liens, mechanical liens, permanent easements, and court judgments.</p>
              </div>

              {otherEncumbrances.length > 0 ? (
                <div className={styles.tableWrapper}>
                  <table className={styles.reportTable}>
                    <thead>
                      <tr>
                        <th>Claimant</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Recording Date</th>
                        <th>Instrument #</th>
                        <th>Status</th>
                        <th className="no-print">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {otherEncumbrances.map(enc => (
                        <tr key={enc.id}>
                          <td><strong>{enc.securedParty}</strong></td>
                          <td>{enc.documentType}</td>
                          <td className={styles.mortAmount}>{enc.amount}</td>
                          <td>{enc.date}</td>
                          <td className={styles.mono}>{enc.documentNumber}</td>
                          <td>
                            <span className={`badge ${enc.status.includes("Permanent") ? "badge-info" : enc.status === "Released" ? "badge-success" : "badge-danger"}`}>
                              {enc.status}
                            </span>
                          </td>
                          <td className="no-print">
                            <button 
                              type="button"
                              className="btn btn-secondary"
                              style={{ padding: "4px 8px", fontSize: "0.7rem" }}
                              onClick={() => handleOpenDoc(enc)}
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className={styles.noEncumbText}>No outstanding liens, judgements, or easements found of record.</p>
              )}
            </div>
          )}

          {/* D. MASTER ONSITE RUN SHEET EXHIBITS (Strictly for full 30-Yr & 60-Yr historical searches) */}
          {(searchType === "thirty_year" || searchType === "sixty_year") && (
            <div className={`${styles.runSheetExhibitBox} premium-card`}>
              <div className={styles.tableHeaderSection}>
                <div>
                  <h3>📋 Courthouse Examination Run Sheet Exhibits</h3>
                  <p className={styles.cardSubtext}>Chronological onsite search ledger compiled by field runner directly from county clerk index vaults.</p>
                </div>
                <button 
                  type="button" 
                  className="btn btn-outline-gold no-print"
                  onClick={() => handleDownload("runsheet", `runsheet_APN_${property.apn}.pdf`)}
                >
                  📥 Download Run Sheet PDF
                </button>
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.runSheetReportTable}>
                  <thead>
                    <tr>
                      <th>Ref #</th>
                      <th>Type</th>
                      <th>Date</th>
                      <th>Grantor/Seller</th>
                      <th>Grantee/Buyer</th>
                      <th>Book / Page / Doc #</th>
                      <th>Value/Amt</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fullRunSheet.map((inst, index) => (
                      <tr key={inst.id} className={inst.status === "Released" ? styles.releasedRow : ""}>
                        <td className={styles.mono}>#{fullRunSheet.length - index}</td>
                        <td><strong>{inst.documentType}</strong></td>
                        <td className={styles.mono}>{inst.date}</td>
                        <td>{inst.debtor || inst.grantor}</td>
                        <td>{inst.securedParty || inst.grantee}</td>
                        <td className={styles.mono}>
                          {inst.bookPage && inst.bookPage !== "N/A - Electronic Record" && inst.bookPage !== "N/A - Recorded Instrument"
                            ? inst.bookPage 
                            : `Doc: ${inst.documentNumber}`}
                        </td>
                        <td className={styles.mortAmount}>{inst.amount || inst.consideration}</td>
                        <td>
                          <span className={`badge ${inst.badgeClass}`}>
                            {inst.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Spatial Map, Assessor Cards, certified attachments */}
        <div className={styles.rightColumn}>
          
          {/* Spatial plat GIS boundaries strictly for full chain title examinations */}
          {(searchType === "thirty_year" || searchType === "sixty_year") && renderMapCard()}

          {/* A. CERTIFIED RECORDS ATTACHMENTS (Always show photostatic counter receipts & scans, scoped by modality) */}
          {searchType !== "doc_retrieval" && (
            <div className="premium-card">
              <div className={styles.cardHeader}>
                <h3>📁 Certified Records Attachments</h3>
                <p className={styles.cardSubtext}>Onsite photostatic scans and billing bills certified by the Clerk of the Court.</p>
              </div>

              <div className={styles.attachmentsList}>
                {/* Deeds attachment (Shown for ownership/chain searches, hidden for pure GIS Land searches) */}
                {(searchType === "current_owner" || searchType === "two_owner" || searchType === "thirty_year" || searchType === "sixty_year") && (
                  <div className={styles.attachmentRow} onClick={() => handleDownload("deedsFile", `deeds_scan_${property.apn}.pdf`)}>
                    <span className={styles.fileIcon}>📜</span>
                    <div className={styles.fileMeta}>
                      <span>{searchType === "current_owner" ? "Vesting Deed Scan" : "Vesting & Chain Deeds Scan"}</span>
                      <strong>{property.attachments?.deedsFile?.name || `${searchType === "current_owner" ? "vesting_deed" : "deeds_microfilm"}_APN_${property.apn}.pdf`}</strong>
                      <span className={styles.fileMetaSize}>{property.attachments?.deedsFile?.size || "2.4 MB"} • Certified Onsite</span>
                    </div>
                    <span className={styles.downloadIconBadge}>📥</span>
                  </div>
                )}

                {/* invoice attachment (Only shown for thirty_year / sixty_year full audits to avoid client billing clutter) */}
                {(searchType === "thirty_year" || searchType === "sixty_year") && (
                  <div className={styles.attachmentRow} onClick={() => handleDownload("taxInvoiceFile", `invoice_AX_${property.ticketId || "2026"}.pdf`)}>
                    <span className={styles.fileIcon}>💵</span>
                    <div className={styles.fileMeta}>
                      <span>Courthouse Service Invoice</span>
                      <strong>{property.attachments?.taxInvoiceFile?.name || `invoice_order_${property.ticketId || "4820"}.pdf`}</strong>
                      <span className={styles.fileMetaSize}>{property.attachments?.taxInvoiceFile?.size || "124 KB"} • Certified Bill</span>
                    </div>
                    <span className={styles.downloadIconBadge}>📥</span>
                  </div>
                )}

                {/* Tax bill attachment (Shown only for Land/GIS and full chain audits, hidden for simple current/two owner conveyance searches) */}
                {(searchType === "land_search" || searchType === "thirty_year" || searchType === "sixty_year") && (
                  <div className={styles.attachmentRow} onClick={() => handleDownload("taxBillFile", `tax_receipt_${property.apn}.pdf`)}>
                    <span className={styles.fileIcon}>🏦</span>
                    <div className={styles.fileMeta}>
                      <span>Certified Tax Assessment Bill</span>
                      <strong>{property.attachments?.taxBillFile?.name || `tax_assessor_receipt_${property.apn}.pdf`}</strong>
                      <span className={styles.fileMetaSize}>{property.attachments?.taxBillFile?.size || "980 KB"} • Certified Receipt</span>
                    </div>
                    <span className={styles.downloadIconBadge}>📥</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Ad-valorem ad-taxes strictly for full chain title examinations */}
          {(searchType === "thirty_year" || searchType === "sixty_year") && renderTaxCard()}

          {/* B. REPORT CERTIFICATION SEAL OF EXAMINER (Always show to certify search validity) */}
          {searchType !== "doc_retrieval" && (
            <div className={`${styles.certCard} premium-card`}>
              <div className={styles.certCardHeader}>
                <div className={styles.goldLace}></div>
                <h3 className="serif-title">Certificate of Courthouse Examination</h3>
              </div>
              <p className={styles.certText}>
                {searchType === "land_search" ? (
                  <>
                    Aurelius Title Registry hereby certifies that the subject property, Assessor's Parcel Number 
                    <strong> {property.apn} </strong> in <strong> {property.county} County </strong> has been examined 
                    by our dispatched field runners. Onsite municipal plat maps, ad-valorem tax rolls, parcel acreage boundaries, 
                    and zoning bounds have been physically retrieved, scanned, and verified onsite directly from the county assessor 
                    and tax registers, in complete accordance with standard real estate GIS practices.
                  </>
                ) : (
                  <>
                    Aurelius Title Registry hereby certifies that the subject property, Assessor's Parcel Number 
                    <strong> {property.apn} </strong> in <strong> {property.county} County </strong> has been examined 
                    by our dispatched field runners. Recording deeds, deeds of trust, covenants, and open liens have been physically 
                    retrieved, photocopied, and verified onsite directly from the official indices at the Clerk of Court record vaults, 
                    in complete accordance with standard property indexing guidelines.
                  </>
                )}
              </p>
              <div className={styles.certSignature}>
                <div>
                  <span className={styles.signatureCursive}>Aurelius Field Audit</span>
                  <span>Courthouse Examiner</span>
                </div>
                <div className={styles.blockchainBadge}>
                  <span>INDEXED RECORD SHA-256</span>
                  <span className={styles.hashText}>F3A8-E04D-C285-E840</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* 3. DOWNLOAD LOADER OVERLAY */}
      {downloadingFile && (
        <div className={styles.downloadOverlay}>
          <div className={`${styles.downloadModal} premium-card`}>
            <div className={styles.spinner}></div>
            <h3>Compiling Certified Records</h3>
            <p>Bundling courthouse microfilm files and formatting certified PDF package...</p>
            <span className={styles.fileBadge}>{downloadingFile}</span>
          </div>
        </div>
      )}

      {/* 4. SCANNED DOCUMENT VIEWER MODAL */}
      {selectedDoc && (
        <DocViewer doc={selectedDoc} onClose={() => setSelectedDoc(null)} />
      )}
    </div>
  );
}

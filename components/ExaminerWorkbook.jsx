"use client";

import { useState, useEffect } from "react";
import styles from "./ExaminerWorkbook.module.css";

export default function ExaminerWorkbook({ order, onSave, onClose }) {
  const [activeTab, setActiveTab] = useState("property"); // property, taxes, runsheet, attachments

  // 1. Property Details State
  const [address, setAddress] = useState("");
  const [apn, setApn] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [zoning, setZoning] = useState("");
  const [acreage, setAcreage] = useState(0);
  const [squareFeet, setSquareFeet] = useState(0);
  const [legalDescription, setLegalDescription] = useState("");

  // 2. Tax Assessor State
  const [landVal, setLandVal] = useState(0);
  const [impVal, setImpVal] = useState(0);
  const [annualTax, setAnnualTax] = useState(0);
  const [taxStatus, setTaxStatus] = useState("Paid");
  const [taxRateArea, setTaxRateArea] = useState("");
  const [taxHistory, setTaxHistory] = useState([]);

  // 3. Certified Attachments State
  const [attachedDeeds, setAttachedDeeds] = useState(null);
  const [attachedInvoice, setAttachedInvoice] = useState(null);
  const [attachedBills, setAttachedBills] = useState(null);

  // 4. Run Sheet Builder State (Combined Deeds & Encumbrances)
  const [runSheet, setRunSheet] = useState([]);

  // Load existing order data on mount
  useEffect(() => {
    if (order) {
      // Property Info
      setAddress(order.address || "");
      setApn(order.apn || "");
      setCity(order.city || "San Jose");
      setZipCode(order.zipCode || "95125");
      
      const land = order.landDetails || {};
      setZoning(land.zoning || "");
      setAcreage(land.acreage || 0);
      setSquareFeet(land.squareFeet || 0);
      setLegalDescription(land.legalDescription || "");

      // Tax Info
      const taxes = order.taxes || {};
      const assessed = taxes.assessedValue || {};
      setLandVal(assessed.land || 0);
      setImpVal(assessed.improvements || 0);
      setAnnualTax(taxes.annualTax || 0);
      setTaxStatus(taxes.status || "Paid");
      setTaxRateArea(taxes.taxRateArea || "");
      setTaxHistory(taxes.history || []);

      // File Attachments
      const attachments = order.attachments || {};
      setAttachedDeeds(attachments.deedsFile || null);
      setAttachedInvoice(attachments.taxInvoiceFile || null);
      setAttachedBills(attachments.taxBillFile || null);

      // Compile current Chain + Encumbrances into a single chronological Run Sheet
      const chainItems = (order.chainOfTitle || []).map(deed => ({
        id: deed.id,
        date: deed.date,
        documentType: deed.documentType,
        documentNumber: deed.documentNumber,
        bookPage: deed.bookPage,
        grantor: deed.grantor,
        grantee: deed.grantee,
        consideration: deed.consideration,
        details: deed.details,
        category: "deed"
      }));

      const encumbItems = (order.encumbrances || []).map(enc => ({
        id: enc.id,
        date: enc.date,
        documentType: enc.documentType,
        documentNumber: enc.documentNumber,
        bookPage: enc.bookPage || "N/A - Recorded Instrument",
        grantor: enc.debtor,
        grantee: enc.securedParty,
        consideration: enc.amount,
        details: enc.details,
        category: "encumbrance",
        status: enc.status
      }));

      // Sort chronological descending
      const combined = [...chainItems, ...encumbItems].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );

      setRunSheet(combined);

      // Reset activeTab if it is scoped out for the current order modality
      if ((order.type === "current_owner" || order.type === "two_owner") && activeTab === "taxes") {
        setActiveTab("property");
      }
      if (order.type === "land_search" && activeTab === "runsheet") {
        setActiveTab("property");
      }
    }
  }, [order, activeTab]);

  // Tax history table controls
  const handleAddTaxRow = () => {
    const nextYear = taxHistory.length > 0 
      ? `${parseInt(taxHistory[0].year.split("-")[0]) + 1}-${parseInt(taxHistory[0].year.split("-")[1]) + 1}`
      : "2026-2027";
    
    const newRow = {
      year: nextYear,
      amount: annualTax || 12000,
      status: "Paid",
      paidDate: new Date().toISOString().split("T")[0]
    };
    setTaxHistory([newRow, ...taxHistory]);
  };

  const handleRemoveTaxRow = (index) => {
    setTaxHistory(taxHistory.filter((_, i) => i !== index));
  };

  const handleTaxRowChange = (index, field, value) => {
    const updated = taxHistory.map((row, i) => {
      if (i === index) {
        return {
          ...row,
          [field]: field === "amount" ? parseFloat(value) || 0 : value
        };
      }
      return row;
    });
    setTaxHistory(updated);
  };

  // Run Sheet Table controls
  const handleAddRunSheetRow = () => {
    const newRow = {
      id: "run-inst-" + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toISOString().split("T")[0],
      documentType: "Grant Deed",
      documentNumber: "2026-" + Math.floor(100000 + Math.random() * 900000),
      bookPage: "N/A - Electronic Record",
      grantor: "",
      grantee: "",
      consideration: "$0",
      details: "",
      category: "deed",
      status: "Active (Unreleased)"
    };
    setRunSheet([newRow, ...runSheet]);
  };

  const handleRemoveRunSheetRow = (id) => {
    setRunSheet(runSheet.filter(row => row.id !== id));
  };

  const handleRunSheetRowChange = (id, field, value) => {
    const updated = runSheet.map(row => {
      if (row.id === id) {
        // Auto assign category based on document type selection
        let category = row.category;
        if (field === "documentType") {
          const deeds = ["Grant Deed", "Patent Deed", "Corporation Deed", "Warranty Deed"];
          category = deeds.includes(value) ? "deed" : "encumbrance";
        }
        return {
          ...row,
          [field]: value,
          category
        };
      }
      return row;
    });
    setRunSheet(updated);
  };

  // File Upload Dropzones real reader
  const handleFileDrop = (type, files) => {
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileData = {
          name: file.name,
          size: (file.size / 1024).toFixed(1) + " KB",
          date: new Date().toLocaleDateString(),
          content: e.target.result // Real Base64 Data URL!
        };
        if (type === "deeds") setAttachedDeeds(fileData);
        if (type === "invoice") setAttachedInvoice(fileData);
        if (type === "bills") setAttachedBills(fileData);
      };
      reader.readAsDataURL(file);
    }
  };

  // Compile states and submit
  const handleSaveSubmit = (e) => {
    e.preventDefault();

    // Split run sheet back into deeds chain and encumbrances
    // Sort descending chronologically
    const compiledChain = runSheet
      .filter(row => row.category === "deed")
      .map(row => ({
        id: row.id,
        date: row.date,
        documentType: row.documentType,
        documentNumber: row.documentNumber,
        bookPage: row.bookPage,
        grantor: row.grantor,
        grantee: row.grantee,
        consideration: row.consideration,
        details: row.details,
        verified: true
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const compiledEncumbrances = runSheet
      .filter(row => row.category === "encumbrance")
      .map(row => ({
        id: row.id,
        date: row.date,
        documentType: row.documentType,
        documentNumber: row.documentNumber,
        bookPage: row.bookPage,
        debtor: row.grantor,
        securedParty: row.grantee,
        amount: row.consideration,
        details: row.details,
        status: row.status || "Active (Unreleased)"
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    // Formulate updated order ticket
    const updatedOrder = {
      ...order,
      address,
      apn,
      city,
      zipCode,
      landDetails: {
        zoning,
        acreage: parseFloat(acreage) || 0,
        squareFeet: parseInt(squareFeet) || 0,
        legalDescription
      },
      taxes: {
        assessedValue: {
          land: parseFloat(landVal) || 0,
          improvements: parseFloat(impVal) || 0,
          total: (parseFloat(landVal) || 0) + (parseFloat(impVal) || 0)
        },
        annualTax: parseFloat(annualTax) || 0,
        status: taxStatus,
        taxRateArea,
        history: taxHistory
      },
      attachments: {
        deedsFile: attachedDeeds,
        taxInvoiceFile: attachedInvoice,
        taxBillFile: attachedBills
      },
      chainOfTitle: compiledChain,
      encumbrances: compiledEncumbrances,
      status: "Completed", // Automatically marks completed once saved!
      badgeClass: "badge-success"
    };

    onSave(updatedOrder);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Workbook Sidebar Header */}
        <div className={styles.modalHeader}>
          <div>
            <span className="badge badge-gold">Auditor Workbook</span>
            <h2>Examine Property: {address || "New Request"}</h2>
            <p>Order ID: {order?.ticketId || "#AX-2026-Pending"} • Courthouse Dispatch: {order?.county} County</p>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        {/* Workbook Tab headers */}
        <div className={styles.workbookTabs}>
          <button 
            type="button" 
            className={`${styles.tabBtn} ${activeTab === "property" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("property")}
          >
            🏠 Property Details
          </button>
          
          {order?.type !== "current_owner" && order?.type !== "two_owner" && (
            <button 
              type="button" 
              className={`${styles.tabBtn} ${activeTab === "taxes" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("taxes")}
            >
              🏦 Assessor Taxes
            </button>
          )}

          {order?.type !== "land_search" && (
            <button 
              type="button" 
              className={`${styles.tabBtn} ${activeTab === "runsheet" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("runsheet")}
            >
              📋 Onsite Run Sheet Builder
            </button>
          )}

          <button 
            type="button" 
            className={`${styles.tabBtn} ${activeTab === "attachments" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("attachments")}
          >
            📁 Certified Attachments Upload
          </button>
        </div>

        {/* Workbook Scrollable Form container */}
        <form onSubmit={handleSaveSubmit} className={styles.workbookForm}>
          
          {/* TAB 1: PROPERTY DETAILS FORM */}
          {activeTab === "property" && (
            <div className={styles.formSection}>
              <h3>🏠 Property Information & Legal Bounds</h3>
              <p className={styles.sectionDesc}>Edit basic property fields pulled from onsite deeds and assessor books.</p>
              
              <div className={styles.formGrid}>
                <div className="form-group">
                  <label className="form-label">Property Address</label>
                  <input type="text" className="form-control" required value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Parcel APN Number</label>
                  <input type="text" className="form-control" required value={apn} onChange={(e) => setApn(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">City Jurisdiction</label>
                  <input type="text" className="form-control" required value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Zip Code</label>
                  <input type="text" className="form-control" required value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
                </div>
                {order?.type !== "current_owner" && order?.type !== "two_owner" && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Zoning Classification</label>
                      <input type="text" className="form-control" placeholder="e.g. R1-8 Residential" value={zoning} onChange={(e) => setZoning(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Lot Acreage (Acres)</label>
                      <input type="number" step="0.01" className="form-control" value={acreage} onChange={(e) => setAcreage(e.target.value)} />
                    </div>
                  </>
                )}
                {order?.type !== "land_search" && (
                  <div className="form-group" style={{ gridColumn: "span 2" }}>
                    <label className="form-label">Legal Description (Drawn from Vesting Deed)</label>
                    <textarea rows="3" className="form-control" style={{ fontFamily: "serif" }} value={legalDescription} onChange={(e) => setLegalDescription(e.target.value)} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: TAX ASSESSOR DETAILS FORM */}
          {activeTab === "taxes" && (
            <div className={styles.formSection}>
              <h3>🏦 County Tax Assessor Registry & History</h3>
              <p className={styles.sectionDesc}>Edit tax evaluations, rates, and historical payment ledgers compiled onsite.</p>
              
              <div className={styles.formGrid}>
                <div className="form-group">
                  <label className="form-label">Assessed Land Value ($)</label>
                  <input type="number" className="form-control" value={landVal} onChange={(e) => setLandVal(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Assessed Improvements ($)</label>
                  <input type="number" className="form-control" value={impVal} onChange={(e) => setImpVal(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Annual Tax Amount ($)</label>
                  <input type="number" step="0.01" className="form-control" value={annualTax} onChange={(e) => setAnnualTax(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Ledger Payment Status</label>
                  <select className="form-control" value={taxStatus} onChange={(e) => setTaxStatus(e.target.value)}>
                    <option value="Paid">Paid (Current)</option>
                    <option value="Delinquent">Delinquent (Unpaid)</option>
                    <option value="Tax Sale">Tax Sale (Delinquent Lien)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Tax Rate Area (TRA)</label>
                  <input type="text" className="form-control" placeholder="e.g. 017-004" value={taxRateArea} onChange={(e) => setTaxRateArea(e.target.value)} />
                </div>
              </div>

              {/* Tax History Log */}
              <div className={styles.taxHistorySection}>
                <div className={styles.tableHeaderSection}>
                  <h4>Historical Payment Ledger</h4>
                  <button type="button" className="btn btn-outline-gold" style={{ padding: "4px 10px", fontSize: "0.75rem" }} onClick={handleAddTaxRow}>
                    + Add Tax Year
                  </button>
                </div>

                <table className={styles.ledgerTable}>
                  <thead>
                    <tr>
                      <th>Tax Year</th>
                      <th>Amount ($)</th>
                      <th>Payment Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taxHistory.map((hist, index) => (
                      <tr key={index}>
                        <td>
                          <input type="text" className="form-control" style={{ padding: "4px 8px", fontSize: "0.8rem", width: "110px" }} value={hist.year} onChange={(e) => handleTaxRowChange(index, "year", e.target.value)} />
                        </td>
                        <td>
                          <input type="number" className="form-control" style={{ padding: "4px 8px", fontSize: "0.8rem", width: "120px" }} value={hist.amount} onChange={(e) => handleTaxRowChange(index, "amount", e.target.value)} />
                        </td>
                        <td>
                          <input type="date" className="form-control" style={{ padding: "4px 8px", fontSize: "0.8rem", width: "140px" }} value={hist.paidDate || ""} onChange={(e) => handleTaxRowChange(index, "paidDate", e.target.value)} />
                        </td>
                        <td>
                          <select className="form-control" style={{ padding: "4px 8px", fontSize: "0.8rem", width: "120px" }} value={hist.status} onChange={(e) => handleTaxRowChange(index, "status", e.target.value)}>
                            <option value="Paid">Paid</option>
                            <option value="Delinquent">Delinquent</option>
                          </select>
                        </td>
                        <td>
                          <button type="button" className={styles.removeBtn} onClick={() => handleRemoveTaxRow(index)}>×</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ONSITE RUN SHEET BUILDER */}
          {activeTab === "runsheet" && (
            <div className={styles.formSection} style={{ maxWidth: "100%", overflowX: "auto" }}>
              <div className={styles.tableHeaderSection}>
                <div>
                  <h3>📋 Onsite Courthouse Run Sheet Builder</h3>
                  <p className={styles.sectionDesc}>Compile chronological grantor-grantee deeds, mortgages, liens, easements physically audited in record rooms.</p>
                </div>
                <button type="button" className="btn btn-primary" style={{ padding: "6px 14px", fontSize: "0.8rem" }} onClick={handleAddRunSheetRow}>
                  + Add Recorded Instrument
                </button>
              </div>

              <table className={styles.runSheetTable}>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Document ID</th>
                    <th>Grantor (Seller/Debtor)</th>
                    <th>Grantee (Buyer/Secured)</th>
                    <th>Book/Page</th>
                    <th>Amount/Cons.</th>
                    <th>Audit Status</th>
                    <th>Remarks / Title Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {runSheet.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <select className="form-control" style={{ padding: "4px 6px", fontSize: "0.75rem", width: "115px" }} value={row.documentType} onChange={(e) => handleRunSheetRowChange(row.id, "documentType", e.target.value)}>
                          <option value="Grant Deed">Grant Deed</option>
                          <option value="Deed of Trust">Deed of Trust</option>
                          <option value="Easement Agreement">Easement Agreement</option>
                          <option value="Notice of Lien">Notice of Lien</option>
                          <option value="Notice of State Tax Lien">Notice of State Tax Lien</option>
                          <option value="Notice of Mechanic's Lien">Notice of Mechanic's Lien</option>
                          <option value="Abstract of Judgment">Abstract of Judgment</option>
                          <option value="Corporation Deed">Corporation Deed</option>
                          <option value="Patent Deed">Patent Deed</option>
                        </select>
                      </td>
                      <td>
                        <input type="date" className="form-control" style={{ padding: "4px 6px", fontSize: "0.75rem", width: "120px" }} value={row.date} onChange={(e) => handleRunSheetRowChange(row.id, "date", e.target.value)} />
                      </td>
                      <td>
                        <input type="text" className="form-control" style={{ padding: "4px 6px", fontSize: "0.75rem", width: "100px", fontFamily: "monospace" }} value={row.documentNumber} onChange={(e) => handleRunSheetRowChange(row.id, "documentNumber", e.target.value)} />
                      </td>
                      <td>
                        <input type="text" className="form-control" style={{ padding: "4px 6px", fontSize: "0.75rem", width: "120px" }} placeholder="Grantor / Debtor" value={row.grantor} onChange={(e) => handleRunSheetRowChange(row.id, "grantor", e.target.value)} />
                      </td>
                      <td>
                        <input type="text" className="form-control" style={{ padding: "4px 6px", fontSize: "0.75rem", width: "120px" }} placeholder="Grantee / Secured" value={row.grantee} onChange={(e) => handleRunSheetRowChange(row.id, "grantee", e.target.value)} />
                      </td>
                      <td>
                        <input type="text" className="form-control" style={{ padding: "4px 6px", fontSize: "0.75rem", width: "100px", fontFamily: "monospace" }} placeholder="e.g. Bk 412 Pg 1" value={row.bookPage} onChange={(e) => handleRunSheetRowChange(row.id, "bookPage", e.target.value)} />
                      </td>
                      <td>
                        <input type="text" className="form-control" style={{ padding: "4px 6px", fontSize: "0.75rem", width: "90px", color: "var(--primary)", fontWeight: "bold" }} placeholder="Cons./Amount" value={row.consideration} onChange={(e) => handleRunSheetRowChange(row.id, "consideration", e.target.value)} />
                      </td>
                      <td>
                        {row.category === "encumbrance" ? (
                          <select className="form-control" style={{ padding: "4px 6px", fontSize: "0.75rem", width: "100px" }} value={row.status || "Active (Unreleased)"} onChange={(e) => handleRunSheetRowChange(row.id, "status", e.target.value)}>
                            <option value="Active (Unreleased)">Active</option>
                            <option value="Active (Permanent)">Permanent</option>
                            <option value="Released">Released</option>
                          </select>
                        ) : (
                          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", paddingLeft: "8px" }}>— (Chain)</span>
                        )}
                      </td>
                      <td>
                        <input type="text" className="form-control" style={{ padding: "4px 6px", fontSize: "0.75rem", width: "160px" }} placeholder="Remarks, assignments, easement details..." value={row.details || ""} onChange={(e) => handleRunSheetRowChange(row.id, "details", e.target.value)} />
                      </td>
                      <td>
                        <button type="button" className={styles.removeBtn} onClick={() => handleRemoveRunSheetRow(row.id)}>×</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ padding: "12px", background: "rgba(223, 177, 91, 0.02)", border: "1px dashed rgba(223, 177, 91, 0.15)", borderRadius: "var(--radius-sm)", marginTop: "16px" }}>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>💡 <strong>System Auto-Compiler:</strong> Document types like <em>Grant Deed, Corporation Deed, Patent Deed</em> are automatically routed into the client's **Vertical Ownership Timeline**. Document types like <em>Deed of Trust, Liens, Easements, Judgments</em> are routed into outstanding encumbrance tables and registers.</p>
              </div>
            </div>
          )}

          {/* TAB 4: CERTIFIED ATTACHMENTS UPLOAD */}
          {activeTab === "attachments" && (
            <div className={styles.formSection}>
              <h3>📁 Certified Records & Billing Invoices Upload</h3>
              <p className={styles.sectionDesc}>Attach finalized PDF files scanned onsite from Clerk record shelves. Clients can download these directly.</p>
              
              <div className={styles.uploaderGrid}>
                {/* deeds dropzone */}
                {order?.type !== "land_search" && (
                  <div className={styles.uploadBox}>
                    <h4>📜 Vesting & Chain Deeds PDF</h4>
                    <div className={styles.fileDropZone}>
                      <input type="file" id="deeds-pdf-uploader" accept=".pdf" className={styles.hiddenFileField} onChange={(e) => handleFileDrop("deeds", e.target.files)} />
                      <label htmlFor="deeds-pdf-uploader" className={styles.dropZoneLabel}>
                        {attachedDeeds ? (
                          <div className={styles.attachedFileBox}>
                            <span className={styles.fileCheckedIcon}>✓</span>
                            <span><strong>{attachedDeeds.name}</strong></span>
                            <span className={styles.fileSizeBadge}>{attachedDeeds.size}</span>
                          </div>
                        ) : (
                          <>
                            <span className={styles.cloudIcon}>📂</span>
                            <span>Click or Drop Deeds PDF Scan</span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                )}

                {/* invoice dropzone */}
                {(order?.type === "thirty_year" || order?.type === "sixty_year") && (
                  <div className={styles.uploadBox}>
                    <h4>💰 Service Invoice Bill PDF</h4>
                    <div className={styles.fileDropZone}>
                      <input type="file" id="invoice-pdf-uploader" accept=".pdf" className={styles.hiddenFileField} onChange={(e) => handleFileDrop("invoice", e.target.files)} />
                      <label htmlFor="invoice-pdf-uploader" className={styles.dropZoneLabel}>
                        {attachedInvoice ? (
                          <div className={styles.attachedFileBox}>
                            <span className={styles.fileCheckedIcon}>✓</span>
                            <span><strong>{attachedInvoice.name}</strong></span>
                            <span className={styles.fileSizeBadge}>{attachedInvoice.size}</span>
                          </div>
                        ) : (
                          <>
                            <span className={styles.cloudIcon}>💵</span>
                            <span>Click or Drop Invoice PDF Scan</span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                )}

                {/* tax bills dropzone */}
                {(order?.type === "land_search" || order?.type === "thirty_year" || order?.type === "sixty_year") && (
                  <div className={styles.uploadBox}>
                    <h4>🏢 Certified Tax Assessment Bill PDF</h4>
                    <div className={styles.fileDropZone}>
                      <input type="file" id="bills-pdf-uploader" accept=".pdf" className={styles.hiddenFileField} onChange={(e) => handleFileDrop("bills", e.target.files)} />
                      <label htmlFor="bills-pdf-uploader" className={styles.dropZoneLabel}>
                        {attachedBills ? (
                          <div className={styles.attachedFileBox}>
                            <span className={styles.fileCheckedIcon}>✓</span>
                            <span><strong>{attachedBills.name}</strong></span>
                            <span className={styles.fileSizeBadge}>{attachedBills.size}</span>
                          </div>
                        ) : (
                          <>
                            <span className={styles.cloudIcon}>🏦</span>
                            <span>Click or Drop Assessor Tax Bills</span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form Actions Footer */}
          <div className={styles.modalActions}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Discard Changes
            </button>
            <button type="submit" className="btn btn-primary">
              🔒 Save & Certify Courthouse Audit
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

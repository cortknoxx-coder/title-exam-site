"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { performSearch } from "@/lib/mockDatabase";
import styles from "./SearchForm.module.css";

const SEARCH_MODALITIES = [
  {
    id: "current_owner",
    title: "Current Owner Search",
    description: "Our runner dispatches to the county records office to pull the active vesting deed, current owner of record, open mortgages, and tax status.",
    timeframe: "3-5 Business Days",
    icon: "👤",
    price: 95
  },
  {
    id: "two_owner",
    title: "Two-Owner Search",
    description: "Searches ownership back through the last two out-of-family deeds. A field examiner audits deed indexes, active mortgages, and liens at the courthouse.",
    timeframe: "3-5 Business Days",
    icon: "👥",
    price: 150
  },
  {
    id: "thirty_year",
    title: "30-Year Chain Search",
    description: "Full courthouse search tracing all physical deeds, mortgages, easements, and civil court judgements recorded in the county indexes over 30 years.",
    timeframe: "3-5 Business Days",
    icon: "📅",
    price: 250
  },
  {
    id: "sixty_year",
    title: "60-Year Chain Search",
    description: "Deep historical audit tracing the full parcel chain of title down to original subdivisions, subdivisions patents, and easements in county record vaults.",
    timeframe: "3-5 Business Days",
    icon: "🏛️",
    price: 375
  },
  {
    id: "land_search",
    title: "Land & Parcel GIS Search",
    description: "Physical and municipal record lookup at the assessor's office for parcel dimensions, acreage maps, zoning bounds, and utility easements.",
    timeframe: "3-5 Business Days",
    icon: "🗺️",
    price: 110
  },
  {
    id: "doc_retrieval",
    title: "Document Retrieval",
    description: "Certified document pull requiring our field runner to go onsite directly to the Clerk of Court record vaults to physically copy, certify, and upload the recorded instrument.",
    timeframe: "24 Hours (Expedited)",
    icon: "📄",
    price: 45
  }
];

export default function SearchForm() {
  const router = useRouter();

  // State management
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parseStep, setParseStep] = useState(0);
  const [parseComplete, setParseComplete] = useState(false);

  // Unified batch states
  const [selectedModality, setSelectedModality] = useState("current_owner");
  const [isRush, setIsRush] = useState(false);

  // Multi-Property list state
  const [properties, setProperties] = useState([
    { id: "initial-row", county: "Santa Clara", address: "", apn: "" }
  ]);

  // Dispatch Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(0);

  const processingPhrases = [
    "Registering courthouse examination orders in Aurelius dispatch logs...",
    "Sending dispatch notifications to cortney@dpaconsortium.org...",
    "Assigning field runners to target county courthouse locations...",
    "Alerting vault teams for physical book lookups...",
    "Checking Clerk of Court recording index ledgers...",
    "Runners en route to physically retrieve microfilm and paper records...",
    "Batch dispatches scheduled! Turnaround operations initialized..."
  ];

  const parsingPhrases = [
    "Uploading client order document to secure servers...",
    "Initializing character recognition (OCR) engines...",
    "Scanning document grid for county recording stamps...",
    "Extracting metadata & parsing multiple parcel parameters...",
    "Multi-property auto-population compiled! Review details below..."
  ];

  // OCR file parsing simulation
  useEffect(() => {
    let interval;
    if (isParsing) {
      interval = setInterval(() => {
        setParseStep(prev => {
          if (prev >= parsingPhrases.length - 1) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isParsing]);

  // Dispatch processing simulation
  useEffect(() => {
    let interval;
    if (isProcessing) {
      interval = setInterval(() => {
        setProcessStep(prev => {
          if (prev >= processingPhrases.length - 1) {
            clearInterval(interval);
            setTimeout(() => {
              executeBatchDispatchRedirect();
            }, 800);
            return prev;
          }
          return prev + 1;
        });
      }, 550);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  // Add a new empty property row card
  const addPropertyRow = () => {
    setProperties(prev => [
      ...prev,
      { 
        id: `row-${Date.now()}-${Math.floor(Math.random() * 1000)}`, 
        county: "Santa Clara", 
        address: "", 
        apn: "" 
      }
    ]);
  };

  // Remove a specific property row card
  const removePropertyRow = (id) => {
    if (properties.length <= 1) return;
    setProperties(prev => prev.filter(p => p.id !== id));
  };

  // Update a specific field for a property row card
  const updatePropertyField = (id, field, value) => {
    setProperties(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, [field]: value };
      }
      return p;
    }));
  };

  // Dynamic file parser for parsing MULTIPLE properties from a dropped document
  const handleFileSelect = (file) => {
    setIsParsing(true);
    setParseStep(0);
    setParseComplete(false);

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target.result;

      setTimeout(() => {
        setIsParsing(false);
        setParseComplete(true);
        
        // Parse the file name to set standard modality
        if (file.name.toLowerCase().includes("doc") || file.name.toLowerCase().includes("deed")) {
          setSelectedModality("doc_retrieval");
        } else {
          setSelectedModality("thirty_year");
        }

        // Dynamically auto-populate multiple properties to demonstrate parsing
        // We set 2 high-fidelity properties extracted from the escrow sheet
        setProperties([
          {
            id: `parsed-row-1`,
            county: "Santa Clara",
            address: "345 Hamilton Avenue, Palo Alto",
            apn: "142-12-089"
          },
          {
            id: `parsed-row-2`,
            county: "Alameda",
            address: "2480 Lakeshore Avenue, Oakland",
            apn: "084-0610-025-00"
          }
        ]);

        setUploadedFile({
          name: file.name,
          size: (file.size / 1024).toFixed(1) + " KB",
          date: new Date().toLocaleDateString(),
          data: base64Data
        });
      }, 1500); // OCR scan delay
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setParseComplete(false);
    setProperties([
      { id: "initial-row", county: "Santa Clara", address: "", apn: "" }
    ]);
  };

  // Processes dispatches for ALL properties in the list statefully
  const executeBatchDispatchRedirect = async () => {
    const fileMetadata = uploadedFile ? {
      name: uploadedFile.name,
      size: uploadedFile.size,
      date: uploadedFile.date,
      data: uploadedFile.data
    } : null;

    const today = new Date().toISOString().split("T")[0];
    const modalityLabel = SEARCH_MODALITIES.find(m => m.id === selectedModality)?.title || "Courthouse Search";

    const batchOrders = [];

    // Loop through properties list to generate orders
    properties.forEach((prop, idx) => {
      const searchQuery = prop.address.trim() || prop.apn.trim();
      const result = performSearch(selectedModality, searchQuery, prop.county);
      const randomTicketNum = Math.floor(1000 + Math.random() * 9000);

      let orderToCreate = {};

      if (result.error) {
        // High fidelity custom order details fallback
        orderToCreate = {
          id: `custom-${randomTicketNum}`,
          ticketId: `#AX-2026-${randomTicketNum}`,
          address: prop.address || "Custom Real Estate Address",
          apn: prop.apn || `APN-${Math.floor(100 + Math.random() * 899)}-${Math.floor(10 + Math.random() * 89)}-${Math.floor(100 + Math.random() * 899)}`,
          county: prop.county,
          type: selectedModality,
          typeLabel: `${modalityLabel} (Form Intake)${isRush ? " - ⚡ Express 24-Hr Rush" : ""}`,
          date: today,
          status: "Dispatched",
          badgeClass: "badge-info",
          owner: "Pending Auditor Search",
          runner: prop.county === "Alameda" ? "James Lee (Oakland Courthouse Vault)" : prop.county === "San Mateo" ? "Clara Bow (Redwood City Onsite)" : "Arthur Vance (San Jose Dispatch)",
          isRush: isRush,
          priority: isRush ? "Express Rush" : "Standard",
          uploadedFile: fileMetadata,
          landDetails: {
            acreage: 0.00,
            squareFeet: 0,
            zoning: "Pending Auditor Assessment",
            legalDescription: "VERBATIM LEGAL BOUNDS DETAILS WILL BE TRANSCRIBED ONSITE BY CLERK VAULT RUNNER...",
            coordinates: { lat: prop.county === "Alameda" ? 37.8102 : prop.county === "San Mateo" ? 37.4852 : 37.3382, lng: prop.county === "Alameda" ? -122.2455 : prop.county === "San Mateo" ? -122.2364 : -121.8863 },
            boundaries: [],
            adjacentParcels: []
          },
          taxes: {
            assessedValue: { land: 0, improvements: 0, total: 0 },
            annualTax: 0.00,
            status: "Pending Assessment",
            taxRateArea: "Pending",
            history: []
          },
          chainOfTitle: [],
          encumbrances: [],
          attachments: {}
        };
      } else {
        // Mock property matched - merge the static details with custom attachments & priority
        if (result.type === "document") {
          orderToCreate = {
            id: `doc-${result.data.documentNumber}`,
            ticketId: `#AX-2026-${randomTicketNum}`,
            address: result.data.propertyAddress,
            apn: result.data.apn || "Assessor Roll Pull",
            county: result.data.county,
            type: "doc_retrieval",
            typeLabel: `Document Pull #${result.data.documentNumber}${isRush ? " - ⚡ Express 24-Hr Rush" : ""}`,
            date: today,
            status: "Dispatched",
            badgeClass: "badge-info",
            owner: result.data.grantee,
            runner: result.data.county === "Alameda" ? "James Lee (Oakland Courthouse Vault)" : result.data.county === "San Mateo" ? "Clara Bow (Redwood City Onsite)" : "Arthur Vance (San Jose Dispatch)",
            isRush: isRush,
            priority: isRush ? "Express Rush" : "Standard",
            uploadedFile: fileMetadata
          };
        } else {
          orderToCreate = {
            id: result.data.id,
            ticketId: `#AX-2026-${randomTicketNum}`,
            address: result.data.address,
            apn: result.data.apn,
            county: result.data.county,
            type: selectedModality,
            typeLabel: `${modalityLabel} (Form Intake)${isRush ? " - ⚡ Express 24-Hr Rush" : ""}`,
            date: today,
            status: "Dispatched",
            badgeClass: "badge-info",
            owner: result.data.chainOfTitle[0]?.grantee || "Owner of Record",
            runner: result.data.county === "Alameda" ? "James Lee (Oakland Courthouse Vault)" : prop.county === "San Mateo" ? "Clara Bow (Redwood City Onsite)" : "Arthur Vance (San Jose Dispatch)",
            isRush: isRush,
            priority: isRush ? "Express Rush" : "Standard",
            uploadedFile: fileMetadata
          };
        }
      }

      batchOrders.push(orderToCreate);
    });

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(batchOrders),
      });
    } catch (error) {
      console.error("Failed to POST orders to database:", error);
    }

    // Redirect to dashboard with success query parameters
    router.push(`/dashboard?multiDispatched=true&count=${properties.length}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Verify that at least one property has address/APN populated
    const hasValidProperty = properties.some(p => p.address.trim() || p.apn.trim());
    if (!hasValidProperty) return;
    setIsProcessing(true);
    setProcessStep(0);
  };

  // 1. Full-screen Runner Dispatch Processing Modal overlay
  if (isProcessing) {
    return (
      <div className={styles.processingCard}>
        <div className={styles.loaderContainer}>
          <div className={styles.goldSpinner}>
            <div className={styles.innerGlow}></div>
          </div>
          <div className={styles.radarLine}></div>
        </div>
        <h2 className="serif-title">Batch Runner Dispatched</h2>
        <div className={styles.statusBox}>
          <p className={styles.statusText}>{processingPhrases[processStep]}</p>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${((processStep + 1) / processingPhrases.length) * 100}%` }}
            ></div>
          </div>
        </div>
        <p className={styles.countyBadge}>
          DISPATCH TARGET: BATCH DISPATCH ({properties.length} PROPERTIES)
        </p>
      </div>
    );
  }

  return (
    <div className={styles.wizardContainer}>
      
      {/* SECTION 1: Dynamic File Uploader Dropzone */}
      <div className={styles.sectionHeader} style={{ marginBottom: "16px" }}>
        <span className={styles.stepIndicator}>Step 1 of 2 (Optional)</span>
        <h2>📂 Upload Order Document / PDF</h2>
        <p>Have an escrow order form, purchase contract, or parcel map? Drop it here to parse multiple property coordinates instantly, or build your properties list manually below.</p>
      </div>

      <div className="premium-card" style={{ marginBottom: "28px" }}>
        {isParsing ? (
          <div className={styles.inlineParser}>
            <div className={styles.smallGoldSpinner}></div>
            <div>
              <p className={styles.parserStatusText}>{parsingPhrases[parseStep]}</p>
              <div className={styles.inlineProgressBar}>
                <div 
                  className={styles.inlineProgressFill} 
                  style={{ width: `${((parseStep + 1) / parsingPhrases.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ) : uploadedFile ? (
          <div className={styles.attachedCard}>
            <div className={styles.attachedDetails}>
              <span className={styles.checkIcon}>✓</span>
              <div>
                <h4>Bulk Document Attached & Parsed</h4>
                <p>
                  <strong style={{ color: "#dfb15b" }}>{uploadedFile.name}</strong> ({uploadedFile.size})
                </p>
              </div>
            </div>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={removeFile}
              style={{ padding: "8px 16px", color: "#f04438", background: "rgba(240, 68, 56, 0.05)", border: "1px solid rgba(240, 68, 56, 0.2)", cursor: "pointer" }}
            >
              🗑️ Clear File
            </button>
          </div>
        ) : (
          <div 
            className={`${styles.dropzone} ${dragActive ? styles.dropzoneActive : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload-input"
              className={styles.hiddenFileInput}
              onChange={handleFileChange}
              accept=".pdf,.docx,.doc,.xlsx,.xls,.csv"
            />
            <label htmlFor="file-upload-input" className={styles.dropzoneLabel}>
              <span className={styles.uploadIcon}>📥</span>
              <h3>Drag & Drop your escrow order or PDF here</h3>
              <p>or click to browse your files</p>
              <span className={styles.fileFormats}>Supports PDF, DOC, DOCX, XLS, XLSX, and CSV</span>
            </label>
          </div>
        )}
        
        {parseComplete && (
          <div className={styles.parseSuccessAlert}>
            <span>💡</span>
            <p><strong>OCR Bulk Parsing complete:</strong> 2 distinct property targets parsed from document. Review the pre-populated cards below and adjust or add more properties as needed.</p>
          </div>
        )}
      </div>

      {/* SECTION 2: Property & Search Coordinates Form */}
      <div className={styles.sectionHeader} style={{ marginBottom: "16px" }}>
        <span className={styles.stepIndicator}>Step 2 of 2</span>
        <h2>✍️ Property & Search Parameters</h2>
        <p>Choose your title service scope depth and configure target coordinates for each property in this order batch.</p>
      </div>

      <form onSubmit={handleSubmit} className="premium-card">
        {/* Modality Cards Selector Grid */}
        <div style={{ marginBottom: "28px" }}>
          <label className="form-label" style={{ marginBottom: "12px", display: "block" }}>Title Service Depth (Applies to all properties in batch)</label>
          <div className={styles.grid}>
            {SEARCH_MODALITIES.map(mod => (
              <div 
                key={mod.id}
                className={`${styles.modalityCard} ${selectedModality === mod.id ? styles.activeModality : ""}`}
                onClick={() => setSelectedModality(mod.id)}
              >
                <div className={styles.modIcon}>{mod.icon}</div>
                <div className={styles.modContent}>
                  <h3>{mod.title}</h3>
                  <p>{mod.description}</p>
                  <span className={styles.timeTag}>{mod.timeframe}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Selection Confirmation Banner */}
        {selectedModality && (() => {
          const mod = SEARCH_MODALITIES.find(m => m.id === selectedModality);
          if (!mod) return null;
          return (
            <div className={styles.selectionConfirmationBanner}>
              <div className={styles.bannerHeader}>
                <span className={styles.confirmationBadge}>🎯 ACTIVE SELECTION</span>
                <span className={styles.bannerPrice}>${mod.price} Flat Rate</span>
              </div>
              <h3 className={styles.bannerTitle}>👉 {mod.title}</h3>
              <p className={styles.bannerDesc}>{mod.description}</p>
              <div className={styles.confirmationMeta}>
                <span>⏱️ Est. Turnaround: <strong>{mod.timeframe}</strong></span>
                <span>Jurisdiction: <strong>Santa Clara, Alameda, or San Mateo County Clerk</strong></span>
              </div>
            </div>
          );
        })()}

        {/* Multi-Property Grid Builder */}
        <div style={{ marginBottom: "28px" }}>
          <label className="form-label" style={{ marginBottom: "16px", display: "block" }}>Property Dispatches List ({properties.length})</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "16px" }}>
            {properties.map((prop, index) => (
              <div key={prop.id} className={styles.propertyRowCard}>
                <div className={styles.rowCardHeader}>
                  <h4>
                    📍 Property #{index + 1}
                    <span className={styles.rowScopeBadge}>
                      — {SEARCH_MODALITIES.find(m => m.id === selectedModality)?.title} scope
                    </span>
                  </h4>
                  {properties.length > 1 && (
                    <button 
                      type="button" 
                      className={styles.removeRowBtn}
                      onClick={() => removePropertyRow(prop.id)}
                    >
                      ✕ Remove Property
                    </button>
                  )}
                </div>
                
                <div className={styles.rowCardGrid}>
                  <div className="form-group">
                    <label className="form-label">County Jurisdiction</label>
                    <select 
                      className="form-control"
                      value={prop.county}
                      onChange={(e) => updatePropertyField(prop.id, "county", e.target.value)}
                    >
                      <option value="Santa Clara">Santa Clara County (San Jose Clerk)</option>
                      <option value="Alameda">Alameda County (Oakland Clerk)</option>
                      <option value="San Mateo">San Mateo County (Redwood City Clerk)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Property Address</label>
                    <input 
                      type="text"
                      className="form-control"
                      required
                      value={prop.address}
                      onChange={(e) => updatePropertyField(prop.id, "address", e.target.value)}
                      placeholder="e.g., 2480 Lakeshore Avenue, Oakland"
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: "span 2" }}>
                    <label className="form-label">Assessor's Parcel Number (APN)</label>
                    <input 
                      type="text"
                      className="form-control"
                      value={prop.apn}
                      onChange={(e) => updatePropertyField(prop.id, "apn", e.target.value)}
                      placeholder="e.g., 084-0610-025-00 (Optional)"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={addPropertyRow}
            style={{ width: "100%", border: "1px dashed rgba(223, 177, 91, 0.4)", background: "rgba(223, 177, 91, 0.02)", color: "#dfb15b", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", cursor: "pointer", padding: "12px", borderRadius: "var(--radius-sm)" }}
          >
            ➕ Add Another Property to Order
          </button>
        </div>

        {/* Pricing, Priority & Notification Alerts */}
        <div style={{ marginBottom: "28px", borderTop: "1px solid rgba(255, 255, 255, 0.04)", paddingTop: "20px" }}>
          <label className="form-label">Service Dispatch Priority</label>
          <div style={{ display: "flex", gap: "24px", marginTop: "8px", background: "rgba(255, 255, 255, 0.02)", padding: "14px", borderRadius: "var(--radius-sm)", border: "1px solid rgba(223, 177, 91, 0.1)" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.85rem" }}>
              <input 
                type="radio" 
                name="rushPriority" 
                checked={!isRush} 
                onChange={() => setIsRush(false)} 
                style={{ accentColor: "var(--primary)" }}
              />
              <span>Standard Delivery (3-5 Business Days) - Standard Rates</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.85rem" }}>
              <input 
                type="radio" 
                name="rushPriority" 
                checked={isRush} 
                onChange={() => setIsRush(true)} 
                style={{ accentColor: "var(--primary)" }}
              />
              <span style={{ color: "#dfb15b", fontWeight: "bold" }}>⚡ Express 24-Hr Rush Dispatch (+$50 flat fee per property)</span>
            </label>
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
            ✉️ <em>Order dispatch confirmations and progress alerts are routed automatically to <strong>cortney@dpaconsortium.org</strong>.</em>
          </p>
        </div>

        {/* Batch Cost Summary Box */}
        {(() => {
          const mod = SEARCH_MODALITIES.find(m => m.id === selectedModality);
          if (!mod) return null;
          const basePrice = mod.price * properties.length;
          const rushFee = isRush ? 50 * properties.length : 0;
          const total = basePrice + rushFee;
          return (
            <div className={styles.batchSummaryBox}>
              <div className={styles.summaryItem}>
                <span>Requested Service Scope:</span>
                <strong>{mod.title} ({properties.length} {properties.length === 1 ? "Property" : "Properties"})</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Base Service Rate:</span>
                <strong>{properties.length} x ${mod.price} = ${basePrice}</strong>
              </div>
              {isRush && (
                <div className={styles.summaryItem} style={{ color: "#dfb15b" }}>
                  <span>⚡ Express 24-Hr Rush:</span>
                  <strong>{properties.length} x $50 = +${rushFee}</strong>
                </div>
              )}
              <div className={`${styles.summaryItem} ${styles.summaryTotal}`}>
                <span>Total Estimated Cost:</span>
                <strong>${total}</strong>
              </div>
            </div>
          );
        })()}

        {/* Submit Actions */}
        <div className={styles.formActions}>
          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ width: "100%", padding: "16px", fontSize: "1rem", letterSpacing: "0.05em" }}
          >
            ⚡ Dispatch {SEARCH_MODALITIES.find(m => m.id === selectedModality)?.title} Runner {properties.length > 1 ? `for ${properties.length} Properties` : "for 1 Property"}
          </button>
        </div>
      </form>
    </div>
  );
}

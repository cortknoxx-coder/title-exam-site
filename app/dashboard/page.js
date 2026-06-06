"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchForm from "@/components/SearchForm";
import ExaminerWorkbook from "@/components/ExaminerWorkbook";
import { mockProperties } from "@/lib/mockDatabase";
import styles from "./page.module.css";

const BASE_MOCK_ORDERS = [];

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [isExaminerMode, setIsExaminerMode] = useState(false);
  const [successBanner, setSuccessBanner] = useState(null);
  
  // Simulated Interactive Action states
  const [emailingOrder, setEmailingOrder] = useState(null);
  const [emailStatus, setEmailStatus] = useState("idle"); // idle, sending, success
  const [activeUploadOrder, setActiveUploadOrder] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("idle"); // idle, processing, success
  const [activeWorkbookOrder, setActiveWorkbookOrder] = useState(null);
  const [previewRunSheetId, setPreviewRunSheetId] = useState(null);

  // Parse redirect query success parameters dynamically
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("multiDispatched") === "true") {
        const count = params.get("count") || "1";
        setSuccessBanner(`✓ Success! Dispatched ${count} courthouse field runners statefully. Order dispatches routed to cortney@dpaconsortium.org.`);
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (params.get("uploaded") === "true") {
        setSuccessBanner(`✓ Success! Escrow bulk order PDF attached. 2 active dispatches generated and routed to Santa Clara & Alameda County Clerk offices.`);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  // Fetch latest orders from server-side database
  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch orders from server:", error);
    }
  };

  // Initialize and load orders from server-side database
  useEffect(() => {
    fetchOrders();
  }, [successBanner]);

  // Sync state changes back to server-side database
  const syncOrderToServer = async (updatedOrder) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedOrder),
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(prev => prev.map(o => (o.id === data.id || o.ticketId === data.ticketId) ? data : o));
      }
    } catch (error) {
      console.error("Failed to sync order to server:", error);
    }
  };

  // Examiner action: Upload Completed Scans
  const handleUploadClick = (order) => {
    setActiveUploadOrder(order);
    setUploadStatus("processing");
    
    // Simulate Clerk of Court document scanning & upload (1.8 seconds)
    setTimeout(() => {
      setUploadStatus("success");
      
      const modifiedOrder = {
        ...order,
        status: "Completed",
        badgeClass: "badge-success"
      };
      
      syncOrderToServer(modifiedOrder);
      
      // Clear overlay after success message
      setTimeout(() => {
        setActiveUploadOrder(null);
        setUploadStatus("idle");
      }, 1500);
    }, 1800);
  };

  const handleEditWorkbookClick = (order) => {
    // Merge order with details from mock database if they aren't already populated
    const matched = mockProperties.find(p => p.id === order.id || p.apn === order.apn) || {};
    setActiveWorkbookOrder({
      ...matched,
      ...order,
      landDetails: order.landDetails || matched.landDetails || {},
      taxes: order.taxes || matched.taxes || {},
      chainOfTitle: order.chainOfTitle || matched.chainOfTitle || [],
      encumbrances: order.encumbrances || matched.encumbrances || [],
      attachments: order.attachments || matched.attachments || {}
    });
  };

  const handleSaveWorkbook = (updatedOrder) => {
    syncOrderToServer(updatedOrder);
    setActiveWorkbookOrder(null);
  };

  // Examiner action: Send Certified Email
  const handleEmailClick = (order) => {
    setEmailingOrder(order);
    setEmailStatus("sending");
    
    // Simulate secure email dispatch (1.8 seconds)
    setTimeout(() => {
      setEmailStatus("success");
      
      // Clear overlay after success message
      setTimeout(() => {
        setEmailingOrder(null);
        setEmailStatus("idle");
      }, 1500);
    }, 1800);
  };

  const getActiveOrdersCount = () => {
    return orders.filter(o => o.status !== "Completed").length;
  };

  return (
    <div className="app-wrapper">
      <Navbar />

      <main className="main-content">
        <div className="container">
          
          {/* Client Portal Header */}
          <div className={styles.dashHeader}>
            <div>
              <span className="badge badge-gold">
                {isExaminerMode ? "Examiner Audit Terminal" : "Client Service Portal"}
              </span>
              <h1 className={styles.title}>
                {isExaminerMode ? "Courthouse Examiner Console" : "Title Examination Client Portal"}
              </h1>
              <p>
                {isExaminerMode 
                  ? "Audit field queues, upload onsite record scans, and email certified title packages."
                  : "Dispatch courthouse field runners, track open records orders, and download certified title audits."}
              </p>
            </div>
            
            {/* Elegant Mode Toggle Slider */}
            <div className={styles.toggleContainer}>
              <span className={isExaminerMode ? styles.toggleLabelMuted : styles.toggleLabelActive}>Client View</span>
              <label className={styles.switch}>
                <input 
                  type="checkbox" 
                  checked={isExaminerMode} 
                  onChange={(e) => setIsExaminerMode(e.target.checked)} 
                />
                <span className={styles.slider}></span>
              </label>
              <span className={isExaminerMode ? styles.toggleLabelActive : styles.toggleLabelMuted}>Examiner Portal</span>
            </div>
          </div>

          {/* Dynamic Metrics */}
          <div className={styles.metricsGrid}>
            <div className="premium-card">
              <div className={styles.metricHeader}>
                <span>{isExaminerMode ? "Pending Audits" : "Active Orders"}</span>
                <span className={styles.metricIcon}>⚡</span>
              </div>
              <h2>{getActiveOrdersCount()}</h2>
              <p className={styles.activePulse}>Examiners onsite in Clerk vaults...</p>
            </div>
            <div className="premium-card">
              <div className={styles.metricHeader}>
                <span>Completed Reports</span>
                <span className={styles.metricIcon}>✓</span>
              </div>
              <h2>{orders.filter(o => o.status === "Completed").length}</h2>
              <p className={styles.positiveGrowth}>Physically certified & scanned</p>
            </div>
            <div className="premium-card">
              <div className={styles.metricHeader}>
                <span>Courthouse Runners</span>
                <span className={styles.metricIcon}>👥</span>
              </div>
              <h2>1 Active</h2>
              <p className={styles.positiveGrowth}>SC, Ala, & SM coverage</p>
            </div>
            <div className="premium-card">
              <div className={styles.metricHeader}>
                <span>Clerk vault pull rate</span>
                <span className={styles.metricIcon}>🔒</span>
              </div>
              <h2>100%</h2>
              <p className={styles.positiveGrowth}>Primary source verified</p>
            </div>
          </div>

          {successBanner && (
            <div className="premium-card" style={{ marginBottom: "24px", border: "1px solid rgba(46, 204, 113, 0.3)", background: "rgba(46, 204, 113, 0.03)", display: "flex", gap: "12px", alignItems: "center" }}>
              <span style={{ fontSize: "1.3rem" }}>⚡</span>
              <p style={{ fontSize: "0.9rem", color: "var(--text-primary)", margin: "0" }}>{successBanner}</p>
            </div>
          )}

          {/* Main Workspace Split Console */}
          <div className={styles.consoleGrid}>
            
            {/* Left Console: Intake Uploader/Form (only visible in Client Mode to keep screens focused!) */}
            {!isExaminerMode ? (
              <div className={styles.searchConsole}>
                <div className={styles.consoleTitle}>
                  <h3>⚡ Initialize New Examination Order</h3>
                </div>
                <SearchForm />
              </div>
            ) : (
              <div className="premium-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <h3 className="serif-title">Examiner Audit Guidelines</h3>
                <p style={{ fontSize: "0.9rem" }}>Welcome to the Aurelius Field Dispatch Console. Follow these required guidelines when auditing county records rooms:</p>
                <div className={styles.guidelineBox}>
                  <h4>1. Primary Vault Sourcing</h4>
                  <p>All chain elements must be matched to physical grantor-grantee books. Electronic index lookups must be cross-verified with microfilm images.</p>
                </div>
                <div className={styles.guidelineBox}>
                  <h4>2. Onsite Clerk of Court Copies</h4>
                  <p>To register a completed search, physically copy the recording ledger at the clerk's counter and scan/upload using the dispatch terminal.</p>
                </div>
                <div className={styles.guidelineBox}>
                  <h4>3. Direct Client Delivery</h4>
                  <p>Upon scan completion, send the certified PDF title report copy directly to the client's email via the dispatch router.</p>
                </div>
              </div>
            )}

            {/* Right Console: Order list (widens to full-width or keeps split based on mode) */}
            <div className={styles.recentOrdersConsole}>
              <div className={styles.consoleTitle} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", flexWrap: "wrap", gap: "12px" }}>
                <h3>
                  {isExaminerMode 
                    ? "📋 Assigned Courthouse Dispatches" 
                    : "📋 Dispatched Courthouse Orders"}
                </h3>
                {orders.length > 0 && (
                  <button 
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: "6px 12px", fontSize: "0.75rem", border: "1px solid rgba(240, 68, 56, 0.2)", color: "#f04438", background: "rgba(240, 68, 56, 0.05)", cursor: "pointer" }}
                    onClick={() => {
                      if (confirm("Are you sure you want to purge all active and completed courthouse dispatches?")) {
                        syncOrdersToStorage([]);
                      }
                    }}
                  >
                    🗑️ Purge Registry
                  </button>
                )}
              </div>
              
              <div className={styles.ordersList}>
                {orders.length > 0 ? (
                  orders.map(order => (
                    <div 
                      key={order.ticketId} 
                      className={`${styles.orderCard} premium-card`}
                    >
                      <div className={styles.orderTop}>
                        <div>
                          <span className={styles.ticketId}>{order.ticketId}</span>
                          <h4>{order.address}</h4>
                          <p className={styles.orderApn}>APN: {order.apn} • {order.county} County</p>
                        </div>
                        <span className={`badge ${order.badgeClass}`}>{order.status}</span>
                      </div>

                      {order.uploadedFile && (
                        <div style={{ margin: "4px 0 12px", padding: "8px 12px", background: "rgba(223, 177, 91, 0.04)", border: "1px dashed rgba(223, 177, 91, 0.2)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.75rem" }}>
                          <span>📎 Attached Order Sheet:</span>
                          <strong style={{ color: "#dfb15b" }}>{order.uploadedFile.name}</strong>
                          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>({order.uploadedFile.size})</span>
                        </div>
                      )}

                      <div className={styles.orderBottom}>
                        <div className={styles.orderMetadata}>
                          <span>Auditor: <strong>{order.runner}</strong></span>
                          <span>Service: <strong className={styles.typeHighlight}>{order.typeLabel}</strong></span>
                        </div>
                        <span className={styles.orderDate}>{order.date}</span>
                      </div>

                      {/* Interactive Console Controls */}
                      <div className={styles.orderControls}>
                        {isExaminerMode ? (
                          <div className={styles.examinerBtns}>
                            <button 
                              type="button"
                              className="btn btn-outline-gold"
                              style={{ padding: "6px 12px", fontSize: "0.75rem" }}
                              onClick={() => handleEditWorkbookClick(order)}
                            >
                              ⚙️ Compile & Edit Audit
                            </button>

                            {order.status !== "Completed" ? (
                              <button 
                                type="button"
                                className="btn btn-primary"
                                style={{ padding: "6px 12px", fontSize: "0.75rem" }}
                                onClick={() => handleUploadClick(order)}
                              >
                                📤 Upload Clerk Vault Scan
                              </button>
                            ) : (
                              <span className={styles.examinerCheckBadge}>✓ Search Uploaded</span>
                            )}
                            
                            <button 
                              type="button"
                              className="btn btn-secondary"
                              style={{ padding: "6px 12px", fontSize: "0.75rem" }}
                              onClick={() => handleEmailClick(order)}
                            >
                              📧 Email Certified Report
                            </button>

                            {order.status === "Completed" && (
                              <button 
                                type="button"
                                className="btn btn-secondary"
                                style={{ padding: "6px 12px", fontSize: "0.75rem", border: "1px solid rgba(223, 177, 91, 0.3)", background: "rgba(223, 177, 91, 0.05)" }}
                                onClick={() => setPreviewRunSheetId(previewRunSheetId === order.ticketId ? null : order.ticketId)}
                              >
                                📋 {previewRunSheetId === order.ticketId ? "Hide" : "View"} Vendor Run Sheet
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className={styles.clientBtns}>
                            {order.status === "Completed" ? (
                              <Link 
                                href={`/reports/${order.id}?searchType=${order.type}`}
                                className="btn btn-primary"
                                style={{ padding: "6px 12px", fontSize: "0.75rem" }}
                              >
                                👁 View Certified Title Exam
                              </Link>
                            ) : (
                              <span className={styles.clientActiveAlert}>
                                ⏱ Onsite Field Runner Dispatch In Progress
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {previewRunSheetId === order.ticketId && (
                        <div style={{ marginTop: "16px", padding: "16px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(223, 177, 91, 0.15)", borderRadius: "var(--radius-sm)", overflowX: "auto" }}>
                          <h4 style={{ color: "#dfb15b", fontSize: "0.85rem", marginBottom: "12px", display: "flex", justifyContent: "space-between" }}>
                            <span>📋 Vendor Title Search Run Sheet - {order.ticketId}</span>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{order.county} County Clerk Vault</span>
                          </h4>
                          <table style={{ width: "100%", fontSize: "0.75rem", borderCollapse: "collapse", textAlign: "left" }}>
                            <thead>
                              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--text-muted)" }}>
                                <th style={{ padding: "6px 8px" }}>Type</th>
                                <th style={{ padding: "6px 8px" }}>Date</th>
                                <th style={{ padding: "6px 8px" }}>Reference</th>
                                <th style={{ padding: "6px 8px" }}>Grantor/Debtor</th>
                                <th style={{ padding: "6px 8px" }}>Grantee/Secured</th>
                                <th style={{ padding: "6px 8px" }}>Amount</th>
                                <th style={{ padding: "6px 8px" }}>Remarks</th>
                              </tr>
                            </thead>
                            <tbody>
                              {/* Combine chain of title & encumbrances chronologically descending */}
                              {[
                                ...(order.chainOfTitle || []).map(d => ({ ...d, grantor: d.grantor, grantee: d.grantee, amount: d.consideration, remarks: d.details })),
                                ...(order.encumbrances || []).map(e => ({ ...e, grantor: e.debtor, grantee: e.securedParty, amount: e.amount, remarks: e.details }))
                              ]
                              .sort((a, b) => new Date(b.date) - new Date(a.date))
                              .map((inst, index) => (
                                <tr key={inst.id || index} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                  <td style={{ padding: "8px", fontWeight: "bold" }}>{inst.documentType}</td>
                                  <td style={{ padding: "8px", fontFamily: "monospace" }}>{inst.date}</td>
                                  <td style={{ padding: "8px", fontFamily: "monospace" }}>{inst.bookPage && inst.bookPage !== "N/A - Electronic Record" && inst.bookPage !== "N/A - Recorded Instrument" ? inst.bookPage : inst.documentNumber}</td>
                                  <td style={{ padding: "8px" }}>{inst.grantor}</td>
                                  <td style={{ padding: "8px" }}>{inst.grantee}</td>
                                  <td style={{ padding: "8px", color: "var(--primary)", fontWeight: "bold" }}>{inst.amount}</td>
                                  <td style={{ padding: "8px", color: "var(--text-muted)", fontSize: "0.7rem", maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={inst.remarks}>{inst.remarks || "—"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px" }}>No courthouse orders found in registry history.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 1. MOCK FILE UPLOAD OVERLAY */}
      {activeUploadOrder && uploadStatus === "processing" && (
        <div className={styles.interactiveOverlay}>
          <div className={`${styles.actionModal} premium-card`}>
            <div className={styles.uploadSpinner}></div>
            <h3>Uploading Onsite Courthouse Scan</h3>
            <p>Scanning physical microfilm records and attaching Clerk of Court certification seals...</p>
            <span className={styles.uploadOrderBadge}>{activeUploadOrder.ticketId} • {activeUploadOrder.county} County Clerk</span>
          </div>
        </div>
      )}

      {activeUploadOrder && uploadStatus === "success" && (
        <div className={styles.interactiveOverlay}>
          <div className={`${styles.actionModal} ${styles.actionSuccess} premium-card`}>
            <span className={styles.successIcon}>✓</span>
            <h3>Courthouse Audit Completed</h3>
            <p>Certified Clerk of Court record file has been compiled and uploaded successfully!</p>
            <span className={styles.uploadOrderBadge}>{activeUploadOrder.ticketId}</span>
          </div>
        </div>
      )}

      {/* 2. MOCK EMAIL DISPATCH OVERLAY */}
      {emailingOrder && (
        <div className={styles.interactiveOverlay} onClick={() => setEmailStatus("idle")}>
          <div className={`${styles.actionModal} premium-card`} onClick={(e) => e.stopPropagation()}>
            {emailStatus === "sending" ? (
              <>
                <div className={styles.emailSpinner}>📧</div>
                <h3>Dispatching Certified Email</h3>
                <p>Routing certified Title Examination package to client's registered inbox...</p>
                <div className={styles.emailRoutingDetails}>
                  <div><span>Recipient:</span> <strong>{emailingOrder.clientEmail || "client@counsel.com"}</strong></div>
                  <div><span>Subject:</span> <strong>Certified Title Exam - Ticket {emailingOrder.ticketId}</strong></div>
                </div>
              </>
            ) : (
              <>
                <span className={styles.successIcon}>✓</span>
                <h3>Certified Report Emailed</h3>
                <p>The complete Title Audit PDF package has been delivered successfully to:</p>
                <strong className={styles.emailSuccessLabel}>{emailingOrder.clientEmail || "client@counsel.com"}</strong>
                <button 
                  type="button"
                  className="btn btn-primary"
                  style={{ marginTop: "16px", width: "100%" }}
                  onClick={() => setEmailingOrder(null)}
                >
                  Return to Console
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* 3. EXAMINER AUDIT WORKBOOK MODAL */}
      {activeWorkbookOrder && (
        <ExaminerWorkbook 
          order={activeWorkbookOrder} 
          onClose={() => setActiveWorkbookOrder(null)} 
          onSave={handleSaveWorkbook} 
        />
      )}

      <Footer />
    </div>
  );
}

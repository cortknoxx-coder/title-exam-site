"use client";

import { useState } from "react";
import styles from "./ParcelMap.module.css";

export default function ParcelMap({ landDetails, apn }) {
  const [activeTab, setActiveTab] = useState("boundaries"); // boundaries, satellite, zoning
  const [selectedAdjacent, setSelectedAdjacent] = useState(null);
  const [showEasement, setShowEasement] = useState(true);

  const handleAdjacentClick = (parcel) => {
    setSelectedAdjacent(parcel);
  };

  return (
    <div className="premium-card">
      <div className={styles.mapHeader}>
        <div>
          <h3>🗺️ Interactive Parcel GIS Map</h3>
          <p className={styles.subtext}>Lot layout, setbacks, and adjoining records.</p>
        </div>
        <div className={styles.tabs}>
          <button 
            type="button"
            className={`${styles.tabBtn} ${activeTab === "boundaries" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("boundaries")}
          >
            Plat Map
          </button>
          <button 
            type="button"
            className={`${styles.tabBtn} ${activeTab === "zoning" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("zoning")}
          >
            Zoning Plan
          </button>
        </div>
      </div>

      <div className={`${styles.mapViewport} ${activeTab === "zoning" ? styles.zoningMode : ""}`}>
        {/* SVG Drawing of the Parcel */}
        <svg viewBox="0 0 200 200" className={styles.svgMap}>
          {/* Grid Background */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Adjoining Parcels */}
          {/* North Lot */}
          <polygon 
            points="10,10 190,10 190,40 10,40" 
            className={styles.adjoiningParcel} 
            onClick={() => handleAdjacentClick(landDetails.adjacentParcels[0])}
          />
          <text x="100" y="28" className={styles.parcelText}>ADJOINING PARCEL (NORTH)</text>

          {/* South Lot */}
          <polygon 
            points="10,140 190,140 190,190 10,190" 
            className={styles.adjoiningParcel}
            onClick={() => handleAdjacentClick(landDetails.adjacentParcels[1])}
          />
          <text x="100" y="168" className={styles.parcelText}>ADJOINING PARCEL (SOUTH)</text>

          {/* West Lot (Left) */}
          <polygon 
            points="10,40 40,40 40,140 10,140" 
            className={styles.adjoiningParcel}
            onClick={() => handleAdjacentClick({ apn: "264-38-009", address: "1077 Meridian Ave", owner: "State Transit Easement" })}
          />

          {/* East Lot (Right) */}
          <polygon 
            points="160,40 190,40 190,140 160,140" 
            className={styles.adjoiningParcel}
            onClick={() => handleAdjacentClick(landDetails.adjacentParcels[2] || { apn: "264-38-050", address: "1083 rear", owner: "City Utility" })}
          />

          {/* SUBJECT PROPERTY (Golden highlighted polygon in the center) */}
          <polygon 
            points="40,40 160,40 160,140 40,140" 
            className={styles.subjectParcel}
          />
          <text x="100" y="90" className={styles.subjectText}>SUBJECT LOT</text>
          <text x="100" y="104" className={styles.subjectSubText}>{apn}</text>

          {/* Dimensions Labels */}
          <text x="100" y="52" className={styles.dimText}>120.00' (Frontage)</text>
          <text x="100" y="134" className={styles.dimText}>120.00' (Rear)</text>
          <text x="50" y="95" className={styles.dimTextVert} transform="rotate(-90 45 95)">100.00'</text>
          <text x="155" y="95" className={styles.dimTextVert} transform="rotate(90 155 95)">100.00'</text>

          {/* PG&E Easement Line (Dashed red line along the right rear side of the subject property) */}
          {showEasement && (
            <g>
              <line x1="150" y1="40" x2="150" y2="140" stroke="var(--danger)" strokeWidth="2" strokeDasharray="4 3" />
              <text x="146" y="90" className={styles.easementLabel} transform="rotate(90 146 90)">5' PG&E UTILITY EASEMENT (REC. 1994)</text>
            </g>
          )}
        </svg>

        {/* Zoning overlay tags */}
        {activeTab === "zoning" && (
          <div className={styles.zoningOverlay}>
            <span>Zoning Classification: <strong>{landDetails.zoning}</strong></span>
            <span>Setbacks: Front 20', Rear 15', Sides 5'</span>
          </div>
        )}
      </div>

      <div className={styles.mapControls}>
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span className={styles.legendColor} style={{ backgroundColor: "var(--primary)" }}></span>
            <span>Subject Property</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendColor} style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)" }}></span>
            <span>Adjoining Lots</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendColor} style={{ borderBottom: "2px dashed var(--danger)", height: "0px", width: "16px", display: "inline-block" }}></span>
            <span>Easement boundary</span>
          </div>
        </div>
        
        <button 
          type="button" 
          className="btn btn-secondary" 
          style={{ padding: "6px 12px", fontSize: "0.75rem" }}
          onClick={() => setShowEasement(!showEasement)}
        >
          {showEasement ? "🙈 Hide Easement" : "👁 Show Easement"}
        </button>
      </div>

      {/* Adjoining Property Inspection Drawer */}
      {selectedAdjacent ? (
        <div className={styles.inspectionDrawer}>
          <div className={styles.drawerHeader}>
            <h4>🔍 Adjacent Lot Record</h4>
            <button type="button" className={styles.closeBtn} onClick={() => setSelectedAdjacent(null)}>×</button>
          </div>
          <div className={styles.drawerContent}>
            <div>
              <span>APN:</span> <strong>{selectedAdjacent.apn}</strong>
            </div>
            <div>
              <span>Address:</span> <strong>{selectedAdjacent.address}</strong>
            </div>
            <div>
              <span>Current Owner:</span> <strong>{selectedAdjacent.owner}</strong>
            </div>
          </div>
        </div>
      ) : (
        <p className={styles.instructionText}>
          💡 Interactive Demo: Click on adjacent lots on the map to audit their county ownership records in real-time.
        </p>
      )}
    </div>
  );
}

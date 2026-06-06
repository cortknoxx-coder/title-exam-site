"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReportView from "@/components/ReportView";
import DocViewer from "@/components/DocViewer";
import { mockProperties, mockStandaloneDocuments } from "@/lib/mockDatabase";
import styles from "./page.module.css";

export default function ReportDetailPage({ params }) {
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;
  const searchParams = useSearchParams();
  const searchType = searchParams.get("searchType") || "thirty_year";
  const searchedQuery = searchParams.get("searchedQuery") || "";
  const isFallback = searchParams.get("fallback") === "true";

  // Check if this is a document retrieval report or a property report
  const isDocReport = id.startsWith("doc-");

  // Property state for local storage integration
  const [property, setProperty] = useState(() => {
    if (isDocReport) return null;
    return mockProperties.find(p => p.id === id) || null;
  });

  useEffect(() => {
    if (!isDocReport) {
      const fetchOrder = async () => {
        try {
          const res = await fetch("/api/orders");
          if (res.ok) {
            const orders = await res.json();
            const matchedOrder = orders.find(o => o.id === id);
            if (matchedOrder) {
              const baseMock = mockProperties.find(p => p.id === id) || {};
              setProperty({
                ...baseMock,
                ...matchedOrder,
                landDetails: matchedOrder.landDetails || baseMock.landDetails || {},
                taxes: matchedOrder.taxes || baseMock.taxes || {},
                chainOfTitle: matchedOrder.chainOfTitle || baseMock.chainOfTitle || [],
                encumbrances: matchedOrder.encumbrances || baseMock.encumbrances || [],
                attachments: matchedOrder.attachments || baseMock.attachments || {}
              });
            }
          }
        } catch (error) {
          console.error("Failed to fetch order details from server:", error);
        }
      };
      fetchOrder();
    }
  }, [id, isDocReport]);

  if (isDocReport) {
    const docNum = id.replace("doc-", "");
    
    // Find in standalone documents
    let documentObj = mockStandaloneDocuments.find(d => d.documentNumber === docNum);
    
    // If not found in standalone, search inside property history
    if (!documentObj) {
      for (const prop of mockProperties) {
        const foundChain = prop.chainOfTitle.find(deed => deed.documentNumber === docNum);
        if (foundChain) {
          documentObj = {
            ...foundChain,
            county: prop.county,
            propertyAddress: prop.address,
            apn: prop.apn,
            legalDescription: prop.landDetails.legalDescription
          };
          break;
        }
        
        const foundEnc = prop.encumbrances.find(enc => enc.documentNumber === docNum);
        if (foundEnc) {
          documentObj = {
            ...foundEnc,
            county: prop.county,
            propertyAddress: prop.address,
            apn: prop.apn,
            legalDescription: prop.landDetails.legalDescription
          };
          break;
        }
      }
    }

    if (!documentObj) {
      return (
        <div className="app-wrapper">
          <Navbar />
          <main className="main-content flex-center">
            <div className={`${styles.errorCard} premium-card`}>
              <h2>Document Not Found</h2>
              <p>The document identifier "{docNum}" could not be parsed by our index registry.</p>
              <Link href="/dashboard" className="btn btn-primary">
                Return to Command Center
              </Link>
            </div>
          </main>
          <Footer />
        </div>
      );
    }

    return (
      <div className="app-wrapper">
        <Navbar />
        <main className="main-content">
          <div className="container" style={{ margin: "24px auto" }}>
            <div className={styles.backNav}>
              <Link href="/dashboard" className={styles.backLink}>
                ⬅ Back to Command Center
              </Link>
            </div>
            
            <div className={`${styles.docRetrievedBanner} premium-card`}>
              <div>
                <span className="badge badge-gold">Document Retrieved</span>
                <h2>Instrument Reference: {documentObj.documentNumber}</h2>
                <p>Retrieved from the {documentObj.county} County recorder index archive.</p>
              </div>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={() => window.print()}
              >
                🖨 Print Document
              </button>
            </div>

            <div className={styles.inlineDocWrapper}>
              <DocViewer doc={documentObj} onClose={() => {}} />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="app-wrapper">
        <Navbar />
        <main className="main-content flex-center">
          <div className={`${styles.errorCard} premium-card`}>
            <h2>Property Registry Record Not Found</h2>
            <p>The parcel reference "{id}" could not be parsed by our database indexes.</p>
            <Link href="/dashboard" className="btn btn-primary">
              Return to Command Center
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Adjust property data locally based on the search type for dynamic fidelity
  const propertyData = { ...property };
  
  // Enforce B2B search modalities strictly so reports only render relevant purchased details!
  if (searchType === "current_owner") {
    propertyData.chainOfTitle = (propertyData.chainOfTitle || []).slice(0, 1);
    const currentOwner = propertyData.chainOfTitle[0]?.grantee || "";
    const currentOwnerNormalized = currentOwner.toLowerCase().replace(/[^a-z]/g, "");
    
    propertyData.encumbrances = (propertyData.encumbrances || []).filter(enc => {
      const debtorNormalized = enc.debtor.toLowerCase().replace(/[^a-z]/g, "");
      const matchesOwner = currentOwnerNormalized.includes(debtorNormalized) || debtorNormalized.includes(currentOwnerNormalized);
      return matchesOwner && (enc.status.includes("Active") || enc.status.includes("Permanent")) && !enc.status.includes("Released");
    });
  } else if (searchType === "two_owner") {
    propertyData.chainOfTitle = (propertyData.chainOfTitle || []).slice(0, 2);
    const currentOwner = propertyData.chainOfTitle[0]?.grantee || "";
    const priorOwner = propertyData.chainOfTitle[1]?.grantee || "";
    const currentOwnerNorm = currentOwner.toLowerCase().replace(/[^a-z]/g, "");
    const priorOwnerNorm = priorOwner.toLowerCase().replace(/[^a-z]/g, "");
    
    propertyData.encumbrances = (propertyData.encumbrances || []).filter(enc => {
      const debtorNorm = enc.debtor.toLowerCase().replace(/[^a-z]/g, "");
      const matchesOwners = currentOwnerNorm.includes(debtorNorm) || debtorNorm.includes(currentOwnerNorm) ||
                            priorOwnerNorm.includes(debtorNorm) || debtorNorm.includes(priorOwnerNorm);
      return matchesOwners && (enc.status.includes("Active") || enc.status.includes("Permanent")) && !enc.status.includes("Released");
    });
  } else if (searchType === "land_search") {
    propertyData.chainOfTitle = [];
    propertyData.encumbrances = [];
  } else if (searchType === "thirty_year") {
    const cutOffYear = 1996;
    propertyData.chainOfTitle = (propertyData.chainOfTitle || []).filter(deed => {
      const year = parseInt(deed.date.substring(0, 4));
      return year >= cutOffYear;
    });
    propertyData.encumbrances = (propertyData.encumbrances || []).filter(enc => {
      const year = parseInt(enc.date.substring(0, 4));
      return year >= cutOffYear || enc.status.includes("Permanent");
    });
  } else if (searchType === "sixty_year") {
    const cutOffYear = 1966;
    propertyData.chainOfTitle = (propertyData.chainOfTitle || []).filter(deed => {
      const year = parseInt(deed.date.substring(0, 4));
      return year >= cutOffYear;
    });
    propertyData.encumbrances = (propertyData.encumbrances || []).filter(enc => {
      const year = parseInt(enc.date.substring(0, 4));
      return year >= cutOffYear || enc.status.includes("Permanent");
    });
  }

  return (
    <div className="app-wrapper">
      <Navbar />

      <main className="main-content">
        <div className="container">
          
          <div className={styles.backNav}>
            <Link href="/dashboard" className={styles.backLink}>
              ⬅ Back to Command Center
            </Link>
          </div>

          {/* Core Report Compiler Component */}
          <ReportView property={propertyData} searchType={searchType} />

        </div>
      </main>

      <Footer />
    </div>
  );
}

// Mock Database for Title Examination Web Application
// Covers Santa Clara, Alameda, and San Mateo counties.
// Provides properties with complete title chains, encumbrances, tax data, GIS boundaries, and document imagery.

export const mockProperties = [
  {
    id: "prop-sc-1",
    county: "Santa Clara",
    apn: "264-38-042",
    address: "1082 Meridian Avenue, San Jose, CA 95125",
    city: "San Jose",
    zipCode: "95125",
    landDetails: {
      acreage: 0.18,
      squareFeet: 7840,
      zoning: "R1-8 (Single-Family Residential)",
      legalDescription: "LOT 14 MAP OF WILLOW GLEN TRACT UNIT NO 3 REC. BOOK 42 OF MAPS PG 18, SANTA CLARA COUNTY RECORDS.",
      coordinates: { lat: 37.3015, lng: -121.8988 },
      boundaries: [
        { x: 30, y: 30 },
        { x: 170, y: 30 },
        { x: 170, y: 130 },
        { x: 30, y: 130 }
      ],
      adjacentParcels: [
        { apn: "264-38-041", address: "1078 Meridian Ave", owner: "Robert & Lisa Vance" },
        { apn: "264-38-043", address: "1086 Meridian Ave", owner: "Chung Family Trust" },
        { apn: "264-38-010", address: "1081 Willow St (Rear)", owner: "City of San Jose Easement" }
      ]
    },
    taxes: {
      assessedValue: {
        land: 425000,
        improvements: 685000,
        total: 1110000
      },
      annualTax: 13542.50,
      status: "Paid",
      taxRateArea: "017-004",
      history: [
        { year: "2025-2026", amount: 13542.50, status: "Paid", paidDate: "2026-04-10" },
        { year: "2024-2025", amount: 13276.90, status: "Paid", paidDate: "2025-04-08" },
        { year: "2023-2024", amount: 13016.50, status: "Paid", paidDate: "2024-04-05" }
      ]
    },
    chainOfTitle: [
      {
        id: "doc-sc-1a",
        date: "2021-06-18",
        documentType: "Grant Deed",
        documentNumber: "2021-258931",
        bookPage: "N/A - Electronic Record",
        grantor: "Marcus A. Sterling and Elena Sterling",
        grantee: "David K. Cho and Sarah M. Cho, Husband and Wife as Joint Tenants",
        consideration: "$1,350,000",
        verified: true,
        details: "Vesting deed transferring full fee simple interest. Signed before notary Arthur Pendelton, Santa Clara County."
      },
      {
        id: "doc-sc-1b",
        date: "2012-11-05",
        documentType: "Grant Deed",
        documentNumber: "2012-094823",
        bookPage: "Book 21902, Page 415",
        grantor: "Arthur G. Henderson and Beatrice Henderson",
        grantee: "Marcus A. Sterling and Elena Sterling, Husband and Wife as Joint Tenants",
        consideration: "$795,000",
        verified: true,
        details: "Transfer of property. Standard residential warranty covenant."
      },
      {
        id: "doc-sc-1c",
        date: "1994-08-12",
        documentType: "Grant Deed",
        documentNumber: "1994-048923",
        bookPage: "Book 14890, Page 881",
        grantor: "Willow Glen Builders Inc.",
        grantee: "Arthur G. Henderson and Beatrice Henderson, Tenants in Common",
        consideration: "$285,000",
        verified: true,
        details: "Deed from developer. Includes standard building line restrictions."
      },
      {
        id: "doc-sc-1d",
        date: "1966-03-24",
        documentType: "Corporation Deed",
        documentNumber: "1966-004812",
        bookPage: "Book 7382, Page 104",
        grantor: "San Jose Agricultural Holdings Corp.",
        grantee: "Willow Glen Builders Inc., a California Corporation",
        consideration: "$42,000",
        verified: true,
        details: "Historical transfer of agricultural parcel, later subdivided into Tract 3."
      },
      {
        id: "doc-sc-1e",
        date: "1945-10-12",
        documentType: "Warranty Deed",
        documentNumber: "1945-001204",
        bookPage: "Book 1482, Page 22",
        grantor: "Willow Glen Agricultural Cooperative",
        grantee: "San Jose Agricultural Holdings Corp., a Partnership",
        consideration: "$18,500",
        verified: true,
        details: "Conveyance of orchard lands comprising forty acres total."
      },
      {
        id: "doc-sc-1f",
        date: "1912-05-18",
        documentType: "Patent Deed",
        documentNumber: "1912-000088",
        bookPage: "Book 412, Page 88",
        grantor: "State of California Land Office",
        grantee: "Willow Glen Agricultural Cooperative",
        consideration: "Homestead Patent Grant",
        verified: true,
        details: "Original public land patent grant under California legislative act of 1889, conveying full rights to soil, minerals, and water."
      }
    ],
    encumbrances: [
      {
        id: "enc-sc-1",
        date: "2021-06-18",
        documentType: "Deed of Trust",
        documentNumber: "2021-258932",
        amount: "$1,080,000",
        debtor: "David K. Cho and Sarah M. Cho",
        securedParty: "JPMorgan Chase Bank, N.A.",
        status: "Active (Unreleased)",
        details: "30-year conventional mortgage. 2.875% fixed rate interest."
      },
      {
        id: "enc-sc-2",
        date: "2012-11-05",
        documentType: "Deed of Trust",
        documentNumber: "2012-094824",
        amount: "$636,000",
        debtor: "Marcus A. Sterling and Elena Sterling",
        securedParty: "Wells Fargo Bank, N.A.",
        status: "Released",
        releaseDoc: "2021-258930",
        details: "Paid in full and released concurrently with the 2021 sale."
      },
      {
        id: "enc-sc-3",
        date: "1994-08-20",
        documentType: "Easement Agreement",
        documentNumber: "1994-050112",
        amount: "N/A",
        debtor: "Henderson Family (Property Owner)",
        securedParty: "Pacific Gas & Electric Company (PG&E)",
        status: "Active (Permanent)",
        details: "Permanent 5-foot utility easement running along the rear (Eastern) property boundary for electrical transmission line maintenance."
      }
    ]
  },
  {
    id: "prop-sc-2",
    county: "Santa Clara",
    apn: "142-12-089",
    address: "345 Hamilton Avenue, Palo Alto, CA 94301",
    city: "Palo Alto",
    zipCode: "94301",
    landDetails: {
      acreage: 0.12,
      squareFeet: 5220,
      zoning: "CD-C (Commercial Downtown - Community)",
      legalDescription: "LOT 2 IN BLOCK 15 OF MAP OF PALO ALTO REC. MAP BOOK 2 PG 88, SANTA CLARA COUNTY RECORDS.",
      coordinates: { lat: 37.4449, lng: -122.1612 },
      boundaries: [
        { x: 40, y: 40 },
        { x: 160, y: 40 },
        { x: 160, y: 140 },
        { x: 40, y: 140 }
      ],
      adjacentParcels: [
        { apn: "142-12-088", address: "339 Hamilton Ave", owner: "Hamilton Commercial Partners" },
        { apn: "142-12-090", address: "353 Hamilton Ave", owner: "TechSpace Office LLC" }
      ]
    },
    taxes: {
      assessedValue: {
        land: 1250000,
        improvements: 2150000,
        total: 3400000
      },
      annualTax: 41820.00,
      status: "Delinquent (1st Installment)",
      taxRateArea: "006-012",
      history: [
        { year: "2025-2026", amount: 41820.00, status: "Delinquent", paidDate: null, penalty: 2091.00 },
        { year: "2024-2025", amount: 40980.00, status: "Paid", paidDate: "2024-12-05" }
      ]
    },
    chainOfTitle: [
      {
        id: "doc-sc-2a",
        date: "2018-09-12",
        documentType: "Corporation Deed",
        documentNumber: "2018-189204",
        bookPage: "N/A - Electronic Record",
        grantor: "Hamilton Ventures LLC",
        grantee: "Nova Real Estate Holdings LP",
        consideration: "$4,200,000",
        verified: true,
        details: "Fee simple transfer of commercial real estate. Signed by Principal Officer Jonathan Vance."
      },
      {
        id: "doc-sc-2b",
        date: "2005-04-30",
        documentType: "Grant Deed",
        documentNumber: "2005-084920",
        bookPage: "Book 19041, Page 229",
        grantor: "Palo Alto Holdings Corp.",
        grantee: "Hamilton Ventures LLC, a California LLC",
        consideration: "$2,650,000",
        verified: true,
        details: "Deed transfer with standard commercial covenants."
      },
      {
        id: "doc-sc-2c",
        date: "1978-06-15",
        documentType: "Grant Deed",
        documentNumber: "1978-024890",
        bookPage: "Book 8904, Page 312",
        grantor: "Stanford Land Trust",
        grantee: "Palo Alto Holdings Corp.",
        consideration: "$480,000",
        verified: true,
        details: "Historical transfer. Covenants restrict heavy industrial use."
      },
      {
        id: "doc-sc-2d",
        date: "1948-11-04",
        documentType: "Grant Deed",
        documentNumber: "1948-002498",
        bookPage: "Book 1922, Page 312",
        grantor: "Palo Alto Agricultural Union",
        grantee: "Stanford Land Trust",
        consideration: "$24,000",
        verified: true,
        details: "Transfer of downtown sector parcel pre-subdivision."
      },
      {
        id: "doc-sc-2e",
        date: "1915-06-12",
        documentType: "Patent Deed",
        documentNumber: "1915-000042",
        bookPage: "Book 312, Page 14",
        grantor: "State of California Land Commission",
        grantee: "Palo Alto Agricultural Union",
        consideration: "Homestead Grant",
        verified: true,
        details: "Historical homestead patent granting original public land rights."
      }
    ],
    encumbrances: [
      {
        id: "enc-sc-2_1",
        date: "2018-09-12",
        documentType: "Deed of Trust",
        documentNumber: "2018-189205",
        amount: "$3,000,000",
        debtor: "Nova Real Estate Holdings LP",
        securedParty: "East West Bank",
        status: "Active (Unreleased)",
        details: "Commercial mortgage, secured by property rentals."
      },
      {
        id: "enc-sc-2_2",
        date: "2023-11-10",
        documentType: "Notice of State Tax Lien",
        documentNumber: "2023-098412",
        amount: "$42,350",
        debtor: "Nova Real Estate Holdings LP",
        securedParty: "State of California Franchise Tax Board",
        status: "Active (Unreleased)",
        details: "Unpaid corporate franchise taxes. Attaches to all assets within Santa Clara County."
      }
    ]
  },
  {
    id: "prop-ala-1",
    county: "Alameda",
    apn: "084-0610-025-00",
    address: "2480 Lakeshore Avenue, Oakland, CA 94610",
    city: "Oakland",
    zipCode: "94610",
    landDetails: {
      acreage: 0.22,
      squareFeet: 9583,
      zoning: "RM-2 (Mixed Housing District)",
      legalDescription: "PORTION OF LOT 8 IN BLOCK C MAP OF LAKE SHORE HIGHLANDS REC. MAP BOOK 8 PG 33, ALAMEDA COUNTY RECORDS.",
      coordinates: { lat: 37.8102, lng: -122.2455 },
      boundaries: [
        { x: 50, y: 20 },
        { x: 150, y: 50 },
        { x: 120, y: 150 },
        { x: 20, y: 120 }
      ],
      adjacentParcels: [
        { apn: "084-0610-024-00", address: "2476 Lakeshore Ave", owner: "Gerald & Evelyn Jenkins" },
        { apn: "084-0610-026-00", address: "2484 Lakeshore Ave", owner: "Oakland Co-Housing Cooperative" }
      ]
    },
    taxes: {
      assessedValue: {
        land: 310000,
        improvements: 590000,
        total: 900000
      },
      annualTax: 11430.00,
      status: "Paid",
      taxRateArea: "17-022",
      history: [
        { year: "2025-2026", amount: 11430.00, status: "Paid", paidDate: "2026-04-09" },
        { year: "2024-2025", amount: 11200.00, status: "Paid", paidDate: "2025-04-05" }
      ]
    },
    chainOfTitle: [
      {
        id: "doc-ala-1a",
        date: "2023-02-14",
        documentType: "Grant Deed",
        documentNumber: "2023-018492",
        bookPage: "N/A - Electronic Record",
        grantor: "Estate of Eleanor Fitzroy, deceased",
        grantee: "Michael T. Lawson and Christopher Lawson, Brothers as Tenants in Common",
        consideration: "Gift / Inherited",
        verified: true,
        details: "Transfer from Administrator of the Estate of Eleanor Fitzroy pursuant to probate case PR-22-09418."
      },
      {
        id: "doc-ala-1b",
        date: "1998-05-10",
        documentType: "Grant Deed",
        documentNumber: "1998-120481",
        bookPage: "Book 29810, Page 901",
        grantor: "Samuel & Patricia Abernathy",
        grantee: "Eleanor Fitzroy, an unmarried woman",
        consideration: "$345,000",
        verified: true,
        details: "Vesting deed. Subject to local municipal utility easements."
      },
      {
        id: "doc-ala-1c",
        date: "1972-10-08",
        documentType: "Grant Deed",
        documentNumber: "1972-048912",
        bookPage: "Book 9241, Page 112",
        grantor: "Lakeshore Developers Corp.",
        grantee: "Samuel & Patricia Abernathy, Husband and Wife",
        consideration: "$68,000",
        verified: true,
        details: "First sale of parcel post-subdivision."
      },
      {
        id: "doc-ala-1d",
        date: "1951-09-08",
        documentType: "Grant Deed",
        documentNumber: "1951-001482",
        bookPage: "Book 4821, Page 221",
        grantor: "Oakland Hills Land Syndicate",
        grantee: "Lakeshore Developers Corp., a California Corp.",
        consideration: "$21,000",
        verified: true,
        details: "Conveyance of multiple lots overlooking Lake Temescal and Lake Merritt."
      },
      {
        id: "doc-ala-1e",
        date: "1928-11-20",
        documentType: "Patent Deed",
        documentNumber: "1928-000012",
        bookPage: "Book 841, Page 22",
        grantor: "Federal Land Commission",
        grantee: "Oakland Hills Land Syndicate",
        consideration: "$2,500",
        verified: true,
        details: "Federal patent granting original hillside land rights."
      }
    ],
    encumbrances: [
      {
        id: "enc-ala-1",
        date: "2023-02-14",
        documentType: "Deed of Trust",
        documentNumber: "2023-018493",
        amount: "$450,000",
        debtor: "Michael T. Lawson and Christopher Lawson",
        securedParty: "Bank of America, N.A.",
        status: "Active (Unreleased)",
        details: "Home acquisition and remodel loan."
      },
      {
        id: "enc-ala-2",
        date: "2024-08-11",
        documentType: "Notice of Mechanic's Lien",
        documentNumber: "2024-089104",
        amount: "$18,400",
        debtor: "Michael T. Lawson",
        securedParty: "Apex Roofing Specialists Inc.",
        status: "Active (Unreleased)",
        details: "Lien filed for unpaid labor and roofing materials supplied to property."
      }
    ]
  },
  {
    id: "prop-ala-2",
    county: "Alameda",
    apn: "501-1430-012-04",
    address: "3924 Mowry Avenue, Fremont, CA 94538",
    city: "Fremont",
    zipCode: "94538",
    landDetails: {
      acreage: 0.35,
      squareFeet: 15246,
      zoning: "C-G (General Commercial)",
      legalDescription: "LOT 4 IN PARCEL MAP NO 4930 AS FILED IN RECORD BOOK OF PARCEL MAPS PG 94, ALAMEDA COUNTY RECORDS.",
      coordinates: { lat: 37.5512, lng: -121.9823 },
      boundaries: [
        { x: 30, y: 30 },
        { x: 180, y: 30 },
        { x: 180, y: 150 },
        { x: 30, y: 150 }
      ],
      adjacentParcels: [
        { apn: "501-1430-012-03", address: "3912 Mowry Ave", owner: "Fremont Strip Mall LLC" },
        { apn: "501-1430-012-05", address: "3936 Mowry Ave", owner: "Chevron Stations Inc." }
      ]
    },
    taxes: {
      assessedValue: {
        land: 880000,
        improvements: 1450000,
        total: 2330000
      },
      annualTax: 27960.00,
      status: "Paid",
      taxRateArea: "05-001",
      history: [
        { year: "2025-2026", amount: 27960.00, status: "Paid", paidDate: "2026-04-12" },
        { year: "2024-2025", amount: 27410.00, status: "Paid", paidDate: "2025-04-10" }
      ]
    },
    chainOfTitle: [
      {
        id: "doc-ala-2a",
        date: "2020-11-04",
        documentType: "Grant Deed",
        documentNumber: "2020-318491",
        bookPage: "N/A - Electronic Record",
        grantor: "Richard & Shirley Chang",
        grantee: "Mowry Commercial Plaza LLC, a Delaware LLC",
        consideration: "$2,950,000",
        verified: true,
        details: "Corporate commercial acquisition. Standard bargain and sale covenants."
      },
      {
        id: "doc-ala-2b",
        date: "2010-05-18",
        documentType: "Grant Deed",
        documentNumber: "2010-098231",
        bookPage: "Book 24901, Page 22",
        grantor: "Fremont Orchards Investment Co.",
        grantee: "Richard & Shirley Chang, Tenants by the Entirety",
        consideration: "$1,850,000",
        verified: true,
        details: "Warranty Deed. Assumes existing easements."
      },
      {
        id: "doc-ala-2c",
        date: "1960-04-12",
        documentType: "Patent Deed",
        documentNumber: "1960-002419",
        bookPage: "Book 1204, Page 381",
        grantor: "State of California Land Commission",
        grantee: "Fremont Orchards Investment Co.",
        consideration: "$12,500",
        verified: true,
        details: "Historical state patent granting land rights for commercial development."
      },
      {
        id: "doc-ala-2d",
        date: "1932-08-15",
        documentType: "Grant Deed",
        documentNumber: "1932-000189",
        bookPage: "Book 984, Page 12",
        grantor: "Washington Township Farming Group",
        grantee: "Fremont Orchards Investment Co.",
        consideration: "$8,500",
        verified: true,
        details: "Transfer of land for agricultural orchard operations."
      },
      {
        id: "doc-ala-2e",
        date: "1910-03-22",
        documentType: "Patent Deed",
        documentNumber: "1910-000004",
        bookPage: "Book 182, Page 221",
        grantor: "State of California Land Office",
        grantee: "Washington Township Farming Group",
        consideration: "Land Patent",
        verified: true,
        details: "Original public land patent conveying title of the Washington township tracts."
      }
    ],
    encumbrances: [
      {
        id: "enc-ala-2_1",
        date: "2020-11-04",
        documentType: "Deed of Trust",
        documentNumber: "2020-318492",
        amount: "$2,100,000",
        debtor: "Mowry Commercial Plaza LLC",
        securedParty: "First Republic Bank (assumed by Chase)",
        status: "Active (Unreleased)",
        details: "Commercial facility and construction line mortgage."
      }
    ]
  },
  {
    id: "prop-sm-1",
    county: "San Mateo",
    apn: "052-192-040",
    address: "412 Redwood Avenue, Redwood City, CA 94061",
    city: "Redwood City",
    zipCode: "94061",
    landDetails: {
      acreage: 0.15,
      squareFeet: 6534,
      zoning: "R2 (Duplex Residential)",
      legalDescription: "LOT 3 MAP OF REDWOOD WOODS RESUBDIVISION REC. BOOK 15 OF MAPS PG 40, SAN MATEO COUNTY RECORDS.",
      coordinates: { lat: 37.4852, lng: -122.2364 },
      boundaries: [
        { x: 30, y: 30 },
        { x: 170, y: 30 },
        { x: 170, y: 130 },
        { x: 30, y: 130 }
      ],
      adjacentParcels: [
        { apn: "052-192-039", address: "408 Redwood Ave", owner: "Charles F. Sterling" },
        { apn: "052-192-041", address: "416 Redwood Ave", owner: "Gregory & Sylvia Ruiz" }
      ]
    },
    taxes: {
      assessedValue: {
        land: 520000,
        improvements: 780000,
        total: 1300000
      },
      annualTax: 15340.00,
      status: "Paid",
      taxRateArea: "08-011",
      history: [
        { year: "2025-2026", amount: 15340.00, status: "Paid", paidDate: "2026-04-08" },
        { year: "2024-2025", amount: 15020.00, status: "Paid", paidDate: "2025-04-06" }
      ]
    },
    chainOfTitle: [
      {
        id: "doc-sm-1a",
        date: "2022-10-15",
        documentType: "Grant Deed",
        documentNumber: "2022-094182",
        bookPage: "N/A - Electronic Record",
        grantor: "Sylvia M. Albright",
        grantee: "Jason L. Peterson and Emily R. Peterson, Husband and Wife as Joint Tenants",
        consideration: "$1,450,000",
        verified: true,
        details: "Vesting deed. Executed in Redwood City, CA before notary Public James C. Lee."
      },
      {
        id: "doc-sm-1b",
        date: "2015-03-22",
        documentType: "Grant Deed",
        documentNumber: "2015-021084",
        bookPage: "Book 34211, Page 129",
        grantor: "Thomas & Martha Peterson",
        grantee: "Sylvia M. Albright, an unmarried woman",
        consideration: "$895,000",
        verified: true,
        details: "Conveyed property with normal warranties."
      },
      {
        id: "doc-sm-1c",
        date: "1992-02-14",
        documentType: "Grant Deed",
        documentNumber: "1992-012480",
        bookPage: "Book 18491, Page 22",
        grantor: "San Mateo Lands Development Co.",
        grantee: "Thomas & Martha Peterson, Husband and Wife",
        consideration: "$210,000",
        verified: true,
        details: "Original subdivision purchase deed."
      },
      {
        id: "doc-sm-1d",
        date: "1958-09-08",
        documentType: "Grant Deed",
        documentNumber: "1958-001892",
        bookPage: "Book 4812, Page 99",
        grantor: "Redwood Agricultural Syndicate",
        grantee: "San Mateo Lands Development Co.",
        consideration: "$14,000",
        verified: true,
        details: "Transfer of undivided parcel."
      },
      {
        id: "doc-sm-1e",
        date: "1921-06-18",
        documentType: "Patent Deed",
        documentNumber: "1921-000011",
        bookPage: "Book 724, Page 11",
        grantor: "State of California",
        grantee: "Redwood Agricultural Syndicate",
        consideration: "Patent Grant",
        verified: true,
        details: "Original state patent grant conveying timberland rights."
      }
    ],
    encumbrances: [
      {
        id: "enc-sm-1",
        date: "2022-10-15",
        documentType: "Deed of Trust",
        documentNumber: "2022-094183",
        amount: "$1,160,000",
        debtor: "Jason L. Peterson and Emily R. Peterson",
        securedParty: "Wells Fargo Bank, N.A.",
        status: "Active (Unreleased)",
        details: "30-year conventional mortgage loan."
      },
      {
        id: "enc-sm-2",
        date: "2025-01-20",
        documentType: "Notice of Judgment / Abstract of Judgment",
        documentNumber: "2025-001489",
        amount: "$12,450",
        debtor: "Jason L. Peterson",
        securedParty: "Citibank, N.A.",
        status: "Active (Unreleased)",
        details: "Abstract of civil court judgment from San Mateo Superior Court Case #SM-CV-24-99824. Unpaid credit card debt."
      }
    ]
  },
  {
    id: "prop-sm-2",
    county: "San Mateo",
    apn: "031-102-110",
    address: "710 Elm Street, San Mateo, CA 94401",
    city: "San Mateo",
    zipCode: "94401",
    landDetails: {
      acreage: 0.16,
      squareFeet: 6969,
      zoning: "R1 (Single Family Residential)",
      legalDescription: "LOT 7 BLOCK 14 MAP OF ELM PARK EXTENSION REC. BOOK 8 OF MAPS PG 212, SAN MATEO COUNTY RECORDS.",
      coordinates: { lat: 37.5619, lng: -122.3218 },
      boundaries: [
        { x: 30, y: 30 },
        { x: 170, y: 30 },
        { x: 170, y: 130 },
        { x: 30, y: 130 }
      ],
      adjacentParcels: [
        { apn: "031-102-100", address: "706 Elm St", owner: "Timothy & Jane Vance" },
        { apn: "031-102-120", address: "714 Elm St", owner: "Clara Davis" }
      ]
    },
    taxes: {
      assessedValue: {
        land: 610000,
        improvements: 890000,
        total: 1500000
      },
      annualTax: 17700.00,
      status: "Paid",
      taxRateArea: "05-008",
      history: [
        { year: "2025-2026", amount: 17700.00, status: "Paid", paidDate: "2026-04-05" },
        { year: "2024-2025", amount: 17350.00, status: "Paid", paidDate: "2025-04-04" }
      ]
    },
    chainOfTitle: [
      {
        id: "doc-sm-2a",
        date: "2019-07-22",
        documentType: "Grant Deed",
        documentNumber: "2019-064891",
        bookPage: "N/A - Electronic Record",
        grantor: "Mark & Sandra Sterling",
        grantee: "Gregory A. Vance and Linda K. Vance, Co-Trustees of the Vance Family Revocable Trust",
        consideration: "$1,620,000",
        verified: true,
        details: "Vesting deed. Transfer to family trust."
      },
      {
        id: "doc-sm-2b",
        date: "2010-09-12",
        documentType: "Grant Deed",
        documentNumber: "2010-089201",
        bookPage: "Book 25412, Page 88",
        grantor: "Alfred J. Henderson",
        grantee: "Mark & Sandra Sterling, Husband and Wife",
        consideration: "$1,120,000",
        verified: true,
        details: "Warranty deed. Includes local utility covenants."
      },
      {
        id: "doc-sm-2c",
        date: "1962-05-18",
        documentType: "Grant Deed",
        documentNumber: "1962-004812",
        bookPage: "Book 4124, Page 221",
        grantor: "San Mateo Orchard Land Syndicate",
        grantee: "Alfred J. Henderson",
        consideration: "$14,500",
        verified: true,
        details: "Original developer deed, agricultural transition."
      },
      {
        id: "doc-sm-2d",
        date: "1938-10-12",
        documentType: "Grant Deed",
        documentNumber: "1938-001248",
        bookPage: "Book 1489, Page 88",
        grantor: "San Mateo Agricultural Union",
        grantee: "San Mateo Orchard Land Syndicate",
        consideration: "$9,800",
        verified: true,
        details: "Transfer of regional parcel for subdivision mapping."
      },
      {
        id: "doc-sm-2e",
        date: "1911-04-05",
        documentType: "Patent Deed",
        documentNumber: "1911-000003",
        bookPage: "Book 214, Page 18",
        grantor: "State of California Land Office",
        grantee: "San Mateo Agricultural Union",
        consideration: "Homestead Patent",
        verified: true,
        details: "Original public land homestead patent."
      }
    ],
    encumbrances: [
      {
        id: "enc-sm-2_1",
        date: "2019-07-22",
        documentType: "Deed of Trust",
        documentNumber: "2019-064892",
        amount: "$1,200,000",
        debtor: "Gregory A. Vance and Linda K. Vance",
        securedParty: "Citibank, N.A.",
        status: "Active (Unreleased)",
        details: "Trustee residential mortgage loan."
      }
    ]
  }
];

// Add standalone documents specifically for Document Retrieval search
export const mockStandaloneDocuments = [
  {
    documentNumber: "2026-081923",
    county: "Santa Clara",
    date: "2026-03-12",
    documentType: "Grant Deed",
    bookPage: "N/A - Electronic Record",
    grantor: "Fremont Hills Development Corp",
    grantee: "Julian & Clarissa Mercer",
    propertyAddress: "14820 Stonebrook Dr, Los Altos Hills, CA 94022",
    consideration: "$4,850,000",
    details: "Fee simple transfer of lot 4 of the Stonebrook subdivision. Witnessed and stamped by Clara Bow, Notary."
  },
  {
    documentNumber: "2024-001239",
    county: "San Mateo",
    date: "2024-01-08",
    documentType: "Notice of Lien",
    bookPage: "N/A - Electronic Record",
    grantor: "County of San Mateo Tax Collector",
    grantee: "Alexander & Marie Dupont",
    propertyAddress: "940 Vista Del Monte, Hillsborough, CA 94010",
    consideration: "$38,421.50 (Unpaid Taxes)",
    details: "Tax lien filed for delinquent special assessments under California Revenue and Tax Code Section 2191.3."
  },
  {
    documentNumber: "2025-104921",
    county: "Alameda",
    date: "2025-05-18",
    documentType: "Easement Agreement",
    bookPage: "Book 34812, Page 22",
    grantor: "East Bay Municipal Utility District (EBMUD)",
    grantee: "Kensington Heights Association",
    propertyAddress: "84 Yale Ave, Berkeley, CA 94708",
    consideration: "$1.00 and covenants",
    details: "Right-of-way granted for installation and maintenance of municipal water pipelines."
  }
];

// Query function that supports: APN, Address, Document Number
export function performSearch(searchType, query, county) {
  const normQuery = query ? query.toLowerCase().trim() : "";
  const normCounty = county ? county.toLowerCase().trim() : "";

  // 1. Document Retrieval search (strictly check document numbers)
  if (searchType === "doc_retrieval") {
    // Search standalone documents first
    const standaloneDoc = mockStandaloneDocuments.find(
      doc => doc.documentNumber.toLowerCase() === normQuery &&
             (!county || doc.county.toLowerCase() === normCounty)
    );
    if (standaloneDoc) {
      return { type: "document", data: standaloneDoc };
    }

    // Search inside properties for a match
    for (const prop of mockProperties) {
      if (!county || prop.county.toLowerCase() === normCounty) {
        // Search inside chainOfTitle
        const chainMatch = prop.chainOfTitle.find(doc => doc.documentNumber.toLowerCase() === normQuery);
        if (chainMatch) {
          return {
            type: "document",
            data: {
              documentNumber: chainMatch.documentNumber,
              county: prop.county,
              date: chainMatch.date,
              documentType: chainMatch.documentType,
              bookPage: chainMatch.bookPage,
              grantor: chainMatch.grantor,
              grantee: chainMatch.grantee,
              propertyAddress: prop.address,
              consideration: chainMatch.consideration,
              details: chainMatch.details
            }
          };
        }
        // Search inside encumbrances
        const encMatch = prop.encumbrances.find(doc => doc.documentNumber.toLowerCase() === normQuery);
        if (encMatch) {
          return {
            type: "document",
            data: {
              documentNumber: encMatch.documentNumber,
              county: prop.county,
              date: encMatch.date,
              documentType: encMatch.documentType,
              bookPage: "N/A - Recorded Instrument",
              grantor: encMatch.debtor,
              grantee: encMatch.securedParty,
              propertyAddress: prop.address,
              consideration: encMatch.amount,
              details: encMatch.details
            }
          };
        }
      }
    }
    return { error: "No document found matching this document number and county." };
  }

  // 2. Property-based searches (Address, APN, or Owner Name)
  const matchingProperties = mockProperties.filter(prop => {
    // Filter by county if specified
    if (county && prop.county.toLowerCase() !== normCounty) return false;

    // Check APN match
    if (prop.apn.toLowerCase().replace(/[^a-z0-9]/g, "") === normQuery.replace(/[^a-z0-9]/g, "")) return true;

    // Check Address match
    if (prop.address.toLowerCase().includes(normQuery)) return true;

    // Check current/previous owners
    const ownerMatch = prop.chainOfTitle.some(deed =>
      deed.grantee.toLowerCase().includes(normQuery) || deed.grantor.toLowerCase().includes(normQuery)
    );
    if (ownerMatch) return true;

    return false;
  });

  if (matchingProperties.length === 0) {
    return { error: "No properties found matching your search criteria." };
  }

  // For property results, return the primary match, but tailor details based on searchType
  const primaryMatch = { ...matchingProperties[0] };

  if (searchType === "current_owner") {
    // Current owner search: Limit chain to the most recent vesting deed
    primaryMatch.chainOfTitle = [primaryMatch.chainOfTitle[0]];
    primaryMatch.encumbrances = primaryMatch.encumbrances.filter(enc => enc.status === "Active (Unreleased)" || enc.status === "Active (Permanent)");
  } else if (searchType === "two_owner") {
    // Two owner search: Limit chain to the last two deeds (current and immediate past owner)
    primaryMatch.chainOfTitle = primaryMatch.chainOfTitle.slice(0, 2);
    // Find active encumbrances + historical encumbrances that match the periods of these owners
    primaryMatch.encumbrances = primaryMatch.encumbrances.filter(enc => {
      // Keep active ones
      if (enc.status === "Active (Unreleased)" || enc.status === "Active (Permanent)") return true;
      // Keep released ones if they belong to these owners
      const currentOwner = primaryMatch.chainOfTitle[0].grantee;
      const priorOwner = primaryMatch.chainOfTitle[1].grantee;
      return enc.debtor.includes(currentOwner) || enc.debtor.includes(priorOwner);
    });
  } else if (searchType === "thirty_year") {
    // Thirty-year search: Filter chain to documents recorded within the last 30 years (from 1996 to 2026)
    const cutOffYear = 1996;
    primaryMatch.chainOfTitle = primaryMatch.chainOfTitle.filter(deed => {
      const year = parseInt(deed.date.substring(0, 4));
      return year >= cutOffYear;
    });
    primaryMatch.encumbrances = primaryMatch.encumbrances.filter(enc => {
      const year = parseInt(enc.date.substring(0, 4));
      return year >= cutOffYear || enc.status.includes("Permanent");
    });
  } else if (searchType === "sixty_year") {
    // Historical search: Filter chain to documents recorded since early land patents (from 1900 to 2026)
    const cutOffYear = 1900;
    primaryMatch.chainOfTitle = primaryMatch.chainOfTitle.filter(deed => {
      const year = parseInt(deed.date.substring(0, 4));
      return year >= cutOffYear;
    });
  }

  return { type: "property", data: primaryMatch };
}

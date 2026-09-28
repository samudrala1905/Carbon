// Reporting periods for Carbon Passport. Lifecycle enforces an audited flow.

export const LIFECYCLE = ["OPEN", "DATA LOCKED", "SUBMITTED", "VERIFIED", "CLOSED"];

// Permission required to move FROM a given status to the next one.
export const TRANSITION_PERMISSION = {
  OPEN: "Edit", // -> DATA LOCKED
  "DATA LOCKED": "Submit", // -> SUBMITTED
  SUBMITTED: "Verify", // -> VERIFIED
  VERIFIED: "Approve", // -> CLOSED
};

export const TRANSITION_LABEL = {
  OPEN: "Lock Data",
  "DATA LOCKED": "Submit",
  SUBMITTED: "Verify",
  VERIFIED: "Close Period",
};

export const PERIOD_TYPES = [
  "Monthly",
  "Quarterly",
  "Financial Year",
  "Calendar Year",
  "Custom Period",
];

export const periods = [
  {
    id: "RP-2026-FY",
    name: "FY 2026",
    type: "Financial Year",
    start: "2026-01-01",
    end: "2026-12-31",
    facilities: 4,
    ccfStatus: "In Progress",
    dataCompleteness: 96,
    verificationStatus: "Verification Pending",
    status: "OPEN",
    versions: [{ version: 1, note: "Initial period created", by: "Organisation Admin", date: "2026-01-01" }],
  },
  {
    id: "RP-2026-M05",
    name: "May 2026",
    type: "Monthly",
    start: "2026-05-01",
    end: "2026-05-31",
    facilities: 4,
    ccfStatus: "In Progress",
    dataCompleteness: 78,
    verificationStatus: "Not Started",
    status: "OPEN",
    versions: [{ version: 1, note: "Initial period created", by: "Facility Manager", date: "2026-05-01" }],
  },
  {
    id: "RP-2026-Q1",
    name: "Q1 2026",
    type: "Quarterly",
    start: "2026-01-01",
    end: "2026-03-31",
    facilities: 4,
    ccfStatus: "Calculated",
    dataCompleteness: 100,
    verificationStatus: "Not Started",
    status: "DATA LOCKED",
    versions: [{ version: 1, note: "Initial period created", by: "Facility Manager", date: "2026-01-01" }],
  },
  {
    id: "RP-2025-Q4",
    name: "Q4 2025",
    type: "Quarterly",
    start: "2025-10-01",
    end: "2025-12-31",
    facilities: 4,
    ccfStatus: "Calculated",
    dataCompleteness: 100,
    verificationStatus: "In Review",
    status: "SUBMITTED",
    versions: [{ version: 1, note: "Initial period created", by: "Carbon Manager", date: "2025-10-01" }],
  },
  {
    id: "RP-2025-FY",
    name: "FY 2025",
    type: "Financial Year",
    start: "2025-01-01",
    end: "2025-12-31",
    facilities: 3,
    ccfStatus: "Locked",
    dataCompleteness: 100,
    verificationStatus: "Verified",
    status: "VERIFIED",
    versions: [
      { version: 1, note: "Initial period created", by: "Carbon Manager", date: "2025-01-01" },
      { version: 2, note: "Recalculation — Scope 2 factor update (grid mix 2025)", by: "Carbon Manager", date: "2026-02-11" },
    ],
  },
  {
    id: "RP-2024-FY",
    name: "FY 2024",
    type: "Financial Year",
    start: "2024-01-01",
    end: "2024-12-31",
    facilities: 3,
    ccfStatus: "Locked",
    dataCompleteness: 100,
    verificationStatus: "Verified",
    status: "CLOSED",
    versions: [
      { version: 1, note: "Initial period created", by: "Carbon Manager", date: "2024-01-01" },
      { version: 2, note: "Restatement — corrected diesel factor", by: "Carbon Manager", date: "2025-03-20" },
    ],
  },
];

| Spec ID | Spec screen | Required role(s) | Existing route/component | Coverage | Missing details | Fix status | Evidence |
|---|---|---|---|---|---|---|---|
| S00 | Login / Access Landing | All users | `sfpcl-lms/src/pages/auth/LoginScreen.tsx`; MP auth screens | Complete | None noted for prototype | Verified | docs/screen-spec.md:455; sfpcl-lms/src/App.tsx |
| S01 | Role-Based Dashboard | All internal users | `sfpcl-lms/src/pages/Dashboard.tsx` | Complete | None noted | Fixed | docs/screen-spec.md:506; dashboard role cards |
| S02 | Global Search Results | Internal users | `sfpcl-lms/src/pages/search/GlobalSearchResults.tsx` via header search | Complete | None noted for prototype | Fixed | docs/screen-spec.md:614; sfpcl-lms/src/components/layout/Header.tsx |
| S03 | Task Inbox | Internal users | `sfpcl-lms/src/pages/tasks/TaskInbox.tsx` | Complete | None noted | Verified | docs/screen-spec.md:670 |
| S04 | Notifications and Alerts Center | Internal users | `sfpcl-lms/src/pages/notifications/NotificationsCenter.tsx` via bell menu | Complete | None noted for prototype | Fixed | docs/screen-spec.md:715; sfpcl-lms/src/components/layout/Header.tsx |
| S05 | Member Directory | Credit, Finance, Compliance | `sfpcl-lms/src/pages/members/MemberDirectory.tsx` | Complete | None noted | Verified | docs/screen-spec.md:755 |
| S06 | Member Profile | Credit, Finance, Compliance | `sfpcl-lms/src/pages/members/MemberProfile.tsx` | Complete | Sensitive IDs are masked/reveal-controlled where represented | Verified | docs/screen-spec.md:808 |
| S07 | Borrower 360 | Credit, Finance, Compliance | `sfpcl-lms/src/pages/members/Borrower360.tsx` | Complete | None noted | Verified | docs/screen-spec.md:904 |
| S08 | Nominee Detail Panel | Credit/Finance | `ApplicationDetail`, `MemberProfile`, `NewApplication` | Consolidated | No standalone panel | Verified | docs/screen-spec.md:953 |
| S09 | Witness Detail Panel | Credit/Finance | `ApplicationDetail`, `NewApplication`, documentation screens | Consolidated | No standalone panel | Verified | docs/screen-spec.md:985 |
| S10 | New Loan Application | Deputy Manager Finance, Credit Manager | `sfpcl-lms/src/pages/applications/NewApplication.tsx` | Complete | None noted | Verified | docs/screen-spec.md:1011 |
| S11 | Application Draft Review | Deputy Manager Finance, Credit Manager | `NewApplication` review step | Consolidated | No separate route | Verified | docs/screen-spec.md:1125 |
| S12 | Application Completeness Check | Deputy Manager Finance, Credit Manager | `ApplicationDetail` completeness tab/state | Complete | None noted | Verified | docs/screen-spec.md:1157 |
| S13 | Loan Request Register | Credit, Finance, Auditor | `RegistersHub` loan request tab | Complete | Mock-derived rows only | Verified | docs/screen-spec.md:1228 |
| S14 | Deficiency / Rejection Note Builder | Credit, Finance | `ApplicationDetail`, `MP10` deficiency response | Complete | None noted | Verified | docs/screen-spec.md:1279 |
| S15 | Eligibility Assessment | Deputy Manager Finance, Credit Manager | `AppraisalWorkbench`, `EligibilityChecklist` | Complete | None noted | Verified | docs/screen-spec.md:1335 |
| S16 | Active Member Verification | Deputy Manager Finance, Credit Manager | `AppraisalWorkbench`, `NewApplication` member gate | Complete | None noted | Verified | docs/screen-spec.md:1385 |
| S17 | KYC Verification | Credit, Compliance | `AppraisalWorkbench`, `ComplianceDashboard`, member screens | Complete | None noted | Verified | docs/screen-spec.md:1451 |
| S18 | Loan Limit Calculator | Finance/Credit | `components/loan/LoanLimitCalculator.tsx` | Complete | Configurable ambiguity called out in UI formula | Verified | docs/screen-spec.md:1497 |
| S19 | Loan Appraisal Note | Deputy Manager Finance | `AppraisalWorkbench` | Complete | None noted | Verified | docs/screen-spec.md:1571 |
| S20 | Credit Manager Review | Credit Manager | `AppraisalWorkbench` credit review panel | Complete | None noted | Verified | docs/screen-spec.md:1645 |
| S21 | Sanction Committee Workbench | Sanction Committee, CFO, Director | `SanctionWorkbench` | Complete | None noted | Verified | docs/screen-spec.md:1685 |
| S22 | Sanction Case Detail | Sanction Committee, CFO, Director | `ApplicationDetail`, `SanctionWorkbench` detail | Consolidated | No separate route | Verified | docs/screen-spec.md:1732 |
| S23 | Credit Sanction Register | Sanction/Credit/Auditor | `RegistersHub` sanction tab | Complete | Mock-derived rows only | Verified | docs/screen-spec.md:1797 |
| S24 | Special Case Approval | CFO, Director, Sanction Committee | `SanctionWorkbench`, `ApplicationDetail` special case panels | Complete | None noted | Verified | docs/screen-spec.md:1840 |
| S25 | Exception Register | CFO, Director, Credit, Auditor | `RegistersHub` exception tab | Complete | Mock-derived rows only | Verified | docs/screen-spec.md:1885 |
| S26-S35 | Documentation workspace through final approval | Company Secretary, Compliance, Credit, Finance | `DocumentationHub`, `DocumentChecklist`, borrower MP13 | Consolidated | Covered as stepper workbench, not standalone legal routes | Verified | docs/screen-spec.md:1928-2369 |
| S36-S41 | SAP setup, readiness, payment, CFC auth, advice | Senior Manager Finance, CFC | `DisbursementHub` | Complete | Local state only; no backend persistence | Fixed | docs/screen-spec.md:2379-2596; sfpcl-lms/src/App.tsx |
| S42-S46 | Loan account, schedule, direct repayment, subsidiary reconciliation, ledger | Accounts/Credit/CFO/Auditor | `LoanAccount360`, `RepaymentsHub`, `RepaymentLedger` | Consolidated | No separate routes for every sub-screen | Verified | docs/screen-spec.md:2612-2806 |
| S47-S49 | Interest accrual, invoice, capitalisation | Accounts/CFO | `InterestManagement` | Complete | Mock/local state only | Verified | docs/screen-spec.md:2820-2934 |
| S50-S52 | Monitoring, DPD/PAR, reminders | Credit/CFO/Accounts | `MonitoringDashboard` | Complete | None noted | Verified | docs/screen-spec.md:2942-3053 |
| S53-S57 | Default case, extension, non-payment note, recovery approval, security invocation | Credit, CFO, Director/Sanction, CS | `DefaultRecoveryHub` | Complete | Mock/local state only | Verified | docs/screen-spec.md:3063-3299 |
| S58-S61 | Closure, NOC, security return, archive | CFO, Company Secretary | `LoanClosureHub` | Complete | Mock/local state only | Verified | docs/screen-spec.md:3307-3454 |
| S62-S68 | Compliance dashboard and statutory trackers/registers | Compliance, CS, CFO, Auditor | `ComplianceDashboard`, `RegistersHub` | Complete | Mock-derived rows only | Verified | docs/screen-spec.md:3454-3684 |
| S69 | Reports and MIS Center | CFO, Credit, Accounts, Auditor | `ReportsMIS` | Complete | None noted | Verified | docs/screen-spec.md:3695 |
| S70-S73 | Policy, approval matrix, templates, user/role management | Admin, CFO, CS | `SettingsHub` | Complete | Prototype settings only | Verified | docs/screen-spec.md:3729-3893 |
| S74 | Audit Log Explorer | Auditor, Admin, Management | `RegistersHub` audit view | Consolidated | No separate audit route content beyond register hub | Verified | docs/screen-spec.md:3910 |
| S76 | Borrower Portal | Borrower/Member | `BorrowerPortal` and MP screens | Complete | None noted | Verified | docs/screen-spec.md:4243 |
| MP00 | Member Portal Login | Borrower/Member | `MP00_Login` wired from staff login | Complete | None noted | Verified | docs/screen-spec-member-portal.md:193; sfpcl-lms/src/App.tsx |
| MP01 | Account Activation | Borrower/Member | `MP01_Activation` | Complete | None noted | Verified | docs/screen-spec-member-portal.md:243 |
| MP02 | Forgot Password / OTP | Borrower/Member | `MP02_ForgotPassword` | Complete | None noted | Verified | docs/screen-spec-member-portal.md:285 |
| MP03 | Dashboard | Borrower/Member | `MP03_Dashboard` | Complete | None noted | Verified | docs/screen-spec-member-portal.md:315 |
| MP04 | My Profile | Borrower/Member | `MP04_MyProfile` | Complete | None noted | Verified | docs/screen-spec-member-portal.md:362 |
| MP05-MP08 | New application start, form, uploads, review | Borrower/Member | `MP05_NewApplication`, `MP07_DocumentChecklist` | Consolidated | MP06/MP08 not separate files | Verified | docs/screen-spec-member-portal.md:433-633 |
| MP09-MP12 | Applications list, status, deficiency, sanction terms | Borrower/Member | `MP09`, `MP10`, `MP12` | Consolidated | MP11 represented inside status/deficiency flow | Verified | docs/screen-spec-member-portal.md:655-820 |
| MP13-MP14 | Documentation actions, disbursement status | Borrower/Member | `MP13_DocumentationActions`, `MP14_DisbursementStatus` | Complete | None noted | Verified | docs/screen-spec-member-portal.md:833-903 |
| MP15-MP20 | Loans, account detail, repayments, direct repayment, notices, closure/NOC | Borrower/Member | `MP15`, `MP17`, `MP18`, `MP19`, `MP20` | Consolidated | MP16 inside MP15 | Verified | docs/screen-spec-member-portal.md:917-1111 |
| MP21-MP22 | Grievance submission and tracking | Borrower/Member | `MP24_SupportGrievance` | Consolidated | Uses support/grievance combined screen | Verified | docs/screen-spec-member-portal.md:1124-1184 |
| MP23 | Notifications Center | Borrower/Member | `MP23_Notifications` | Complete | None noted | Verified | docs/screen-spec-member-portal.md:1193 |
| MP24 | Help & Required Documents Guide | Borrower/Member | `MP24_SupportGrievance` | Consolidated | Help and grievance combined | Verified | docs/screen-spec-member-portal.md:1223 |
| MP25 | Profile Security Settings | Borrower/Member | `MP25_SecuritySettings` | Complete | None noted | Verified | docs/screen-spec-member-portal.md:1250 |

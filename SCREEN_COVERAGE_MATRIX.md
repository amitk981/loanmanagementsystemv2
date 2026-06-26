| Spec ID | Spec screen | Required role(s) | Existing route/component | Coverage | Missing details | Fix status | Evidence |
|---|---|---|---|---|---|---|---|
| S00 | Login / Access Landing | All users | `sfpcl-lms/src/pages/auth/LoginScreen.tsx`; `MP00_Login`; `MP01_Activation`; `MP02_ForgotPassword` | Complete | None noted for prototype | Verified | docs/screen-spec.md:455; sfpcl-lms/src/App.tsx |
| S01 | Role-Based Dashboard | All internal users | `sfpcl-lms/src/pages/Dashboard.tsx` | Complete | None noted | Fixed | docs/screen-spec.md:506; role cards and page guard |
| S02 | Global Search Results | Internal users | `sfpcl-lms/src/pages/search/GlobalSearchResults.tsx` via header search | Complete | None noted for prototype | Fixed | docs/screen-spec.md:614; sfpcl-lms/src/components/layout/Header.tsx |
| S03 | Task Inbox | Internal users | `sfpcl-lms/src/pages/tasks/TaskInbox.tsx` | Complete | None noted | Verified | docs/screen-spec.md:670 |
| S04 | Notifications and Alerts Center | Internal users | `sfpcl-lms/src/pages/notifications/NotificationsCenter.tsx` via bell menu | Complete | None noted for prototype | Fixed | docs/screen-spec.md:715; sfpcl-lms/src/components/layout/Header.tsx |
| S05 | Member Directory | Credit, Compliance, Accounts, Auditors | `sfpcl-lms/src/pages/members/MemberDirectory.tsx` | Complete | None noted | Verified | docs/screen-spec.md:755 |
| S06 | Member Profile | Credit, Finance, Compliance, Auditor | `sfpcl-lms/src/pages/members/MemberProfile.tsx` | Complete | Sensitive IDs are masked/reveal-controlled where represented | Verified | docs/screen-spec.md:808 |
| S07 | Borrower 360 | Credit, Finance, Compliance | `sfpcl-lms/src/pages/members/Borrower360.tsx` | Complete | None noted | Verified | docs/screen-spec.md:904 |
| S08 | Nominee Detail Panel | Credit/Finance | `ApplicationDetail`, `MemberProfile`, `NewApplication` | Consolidated | No standalone panel; nominee fields/actions are embedded where used | Verified | docs/screen-spec.md:953 |
| S09 | Witness Detail Panel | Credit/Finance | `ApplicationDetail`, `NewApplication`, `DocumentationHub` | Consolidated | No standalone panel; witness/signature evidence is embedded where used | Verified | docs/screen-spec.md:985 |
| S10 | New Loan Application | Field Officer, Deputy Manager Finance, Credit Manager | `sfpcl-lms/src/pages/applications/NewApplication.tsx` | Complete | None noted | Verified | docs/screen-spec.md:1011 |
| S11 | Application Draft Review | Deputy Manager Finance, Credit Manager | `NewApplication` review step | Consolidated | No separate route | Verified | docs/screen-spec.md:1125 |
| S12 | Application Completeness Check | Deputy Manager Finance, Credit Manager | `ApplicationDetail` completeness tab/state | Complete | None noted | Verified | docs/screen-spec.md:1157 |
| S13 | Loan Request Register | Credit Manager, Auditors | `RegistersHub` loan request tab | Complete | Mock-derived rows only | Verified | docs/screen-spec.md:1228 |
| S14 | Deficiency / Rejection Note Builder | Credit Manager, Deputy Manager Finance | `ApplicationDetail`; borrower `MP10` deficiency response | Complete | None noted | Verified | docs/screen-spec.md:1279 |
| S15 | Eligibility Assessment | Deputy Manager Finance, Credit Manager | `AppraisalWorkbench`; `EligibilityChecklist` | Complete | None noted | Verified | docs/screen-spec.md:1335 |
| S16 | Active Member Verification | Deputy Manager Finance, Credit Manager | `AppraisalWorkbench`; `NewApplication` member gate | Complete | None noted | Verified | docs/screen-spec.md:1385 |
| S17 | KYC Verification | Credit, Compliance | `AppraisalWorkbench`; `ComplianceDashboard`; member screens | Complete | None noted | Verified | docs/screen-spec.md:1451 |
| S18 | Loan Limit Calculator | Finance/Credit | `components/loan/LoanLimitCalculator.tsx` | Complete | Configurable ambiguity visible in formula/explanation | Verified | docs/screen-spec.md:1497 |
| S19 | Loan Appraisal Note | Deputy Manager Finance, Credit Manager | `AppraisalWorkbench` appraisal note panel | Complete | None noted | Verified | docs/screen-spec.md:1571 |
| S20 | Credit Manager Review | Credit Manager | `AppraisalWorkbench` credit review panel | Complete | None noted | Verified | docs/screen-spec.md:1645 |
| S21 | Sanction Committee Workbench | Sanction Committee, CFO, Director | `SanctionWorkbench` | Complete | None noted | Verified | docs/screen-spec.md:1685 |
| S22 | Sanction Case Detail | Sanction Committee, CFO, Director | `ApplicationDetail`; `SanctionWorkbench` case detail | Consolidated | No separate route | Verified | docs/screen-spec.md:1732 |
| S23 | Credit Sanction Register | Sanction Committee, CS, Auditors | `RegistersHub` sanction register tab | Complete | Mock-derived rows only | Verified | docs/screen-spec.md:1797 |
| S24 | Special Case Approval | CFO, Director, Sanction Committee | `SanctionWorkbench`; `ApplicationDetail` special case panels | Complete | None noted | Verified | docs/screen-spec.md:1840 |
| S25 | Exception Register | CFO, Director, Credit, Auditor | `RegistersHub` exception register tab | Complete | Mock-derived rows only | Verified | docs/screen-spec.md:1885 |
| S26 | Documentation Workspace | Company Secretary, Compliance, Credit, Finance | `DocumentationHub` | Complete | None noted | Verified | docs/screen-spec.md:1928 |
| S27 | Document Checklist | Company Secretary, Compliance, Credit, Finance | `DocumentChecklist`; `DocumentationHub` final checklist | Complete | None noted | Verified | docs/screen-spec.md:1969 |
| S28 | Power of Attorney Screen | Company Secretary, Compliance, Finance | `DocumentationHub` legal action card for Power of Attorney | Consolidated | Represented inside documentation workbench with document-level status/actions/evidence | Verified | docs/screen-spec.md:2017 |
| S29 | Tri-Party Agreement Screen | Company Secretary, Compliance, Finance | `DocumentationHub` legal action card for Tri-Party Agreement | Consolidated | Represented inside documentation workbench with document-level status/actions/evidence | Verified | docs/screen-spec.md:2056 |
| S30 | SH-4 Physical Share Security Screen | Company Secretary, Compliance, Finance | `DocumentationHub` legal action card for SH-4 Physical Share Security | Consolidated | Represented inside documentation workbench with document-level status/actions/evidence | Verified | docs/screen-spec.md:2092 |
| S31 | CDSL Pledge Screen | Company Secretary, Compliance, Finance | `DocumentationHub` legal action card for CDSL Pledge | Consolidated | Represented inside documentation workbench with document-level status/actions/evidence | Verified | docs/screen-spec.md:2133 |
| S32 | Term Sheet Screen | Company Secretary, Compliance, Finance | `DocumentationHub` legal action card for Term Sheet | Consolidated | Represented inside documentation workbench with document-level status/actions/evidence | Verified | docs/screen-spec.md:2185 |
| S33 | Loan Agreement Screen | Company Secretary, Compliance, Finance | `DocumentationHub` legal action card for Loan Agreement | Consolidated | Represented inside documentation workbench with document-level status/actions/evidence | Verified | docs/screen-spec.md:2233 |
| S34 | Bank Verification / Signature Mismatch Screen | Company Secretary, Compliance, Finance | `DocumentationHub` legal action card for Bank Verification / Signature Mismatch | Consolidated | Represented inside documentation workbench with document-level status/actions/evidence | Verified | docs/screen-spec.md:2277 |
| S35 | Final Documentation Approval Screen | Company Secretary, Credit Manager, Sanction Committee, Finance | `DocumentationHub` final approvals/sign-offs | Complete | None noted | Verified | docs/screen-spec.md:2329 |
| S36 | SAP Customer Code Request | Senior Manager Finance | `DisbursementHub` SAP setup panel | Complete | Local state only | Verified | docs/screen-spec.md:2379 |
| S37 | SAP Customer Code Confirmation | Senior Manager Finance | `DisbursementHub` SAP confirmation/readiness panels | Complete | Local state only | Verified | docs/screen-spec.md:2423 |
| S38 | Disbursement Readiness Review | Senior Manager Finance | `DisbursementHub` readiness review | Complete | Local state only | Verified | docs/screen-spec.md:2457 |
| S39 | Payment Initiation Screen | Senior Manager Finance | `DisbursementHub` payment initiation panel | Complete | Local state only | Verified | docs/screen-spec.md:2492 |
| S40 | CFC Payment Authorisation Screen | Chief Financial Controller | `DisbursementHub` CFC authorisation panel; `cfc` page permission | Complete | Local state only | Verified | docs/screen-spec.md:2537 |
| S41 | Disbursement Advice Screen | Senior Manager Finance, CFC | `DisbursementHub` UTR/evidence/advice panel | Complete | Local state only | Verified | docs/screen-spec.md:2575 |
| S42 | Loan Account 360 | Accounts, Credit, CFO, Auditor | `LoanAccount360` | Complete | None noted | Verified | docs/screen-spec.md:2612 |
| S43 | Repayment Schedule Screen | Accounts, Credit, CFO, Auditor | `LoanAccount360` repayment schedule tab | Complete | None noted | Verified | docs/screen-spec.md:2662 |
| S44 | Direct Repayment Entry | Accounts | `RepaymentsHub` post repayment modal; `RepaymentLedger` | Complete | None noted | Verified | docs/screen-spec.md:2700 |
| S45 | Subsidiary Deduction Reconciliation | Accounts | `RepaymentsHub`; `RepaymentLedger` subsidiary deduction rows | Complete | None noted | Verified | docs/screen-spec.md:2745 |
| S46 | Loan Ledger | Accounts, Credit, Auditors | `RepaymentLedger`; `LoanAccount360` ledger tab | Complete | None noted | Verified | docs/screen-spec.md:2784 |
| S47 | Interest Accrual Screen | Accounts, CFO | `InterestManagement` accrual tab | Complete | Mock/local state only | Verified | docs/screen-spec.md:2820 |
| S48 | Yearly Interest Invoice Screen | Sales Team, Accounts, Credit Manager | `InterestManagement` invoice tab | Complete | Mock/local state only | Verified | docs/screen-spec.md:2860 |
| S49 | Interest Capitalisation Screen | Accounts, CFO | `InterestManagement` capitalisation tab | Complete | Mock/local state only | Verified | docs/screen-spec.md:2897 |
| S50 | Monitoring Dashboard | Credit, CFO, Accounts | `MonitoringDashboard` | Complete | None noted | Verified | docs/screen-spec.md:2942 |
| S51 | DPD / Portfolio at Risk Screen | Credit, CFO, Accounts | `MonitoringDashboard` DPD/PAR table | Complete | None noted | Verified | docs/screen-spec.md:2987 |
| S52 | Reminder Management Screen | Credit, CFO, Accounts | `MonitoringDashboard` reminder/SOP bucket panels | Complete | None noted | Verified | docs/screen-spec.md:3029 |
| S53 | Default Case Detail | Credit, CFO, Director/Sanction, CS | `DefaultRecoveryHub` case detail | Complete | Mock/local state only | Verified | docs/screen-spec.md:3063 |
| S54 | Grace Period and Extension Screen | Credit, CFO | `DefaultRecoveryHub` grace/extension tab | Complete | Mock/local state only | Verified | docs/screen-spec.md:3114 |
| S55 | Note for Non-Payment Screen | Credit, CFO | `DefaultRecoveryHub` non-payment note section | Complete | Mock/local state only | Verified | docs/screen-spec.md:3164 |
| S56 | Recovery Action Approval Screen | CFO, Director/Sanction Committee | `DefaultRecoveryHub` recovery approval panel | Complete | Mock/local state only | Verified | docs/screen-spec.md:3201 |
| S57 | Security Invocation Screen | Company Secretary, Sanction Committee, CFO | `DefaultRecoveryHub` security invocation panel | Complete | Mock/local state only | Verified | docs/screen-spec.md:3249 |
| S58 | Loan Closure Screen | CFO, Company Secretary | `LoanClosureHub` closure checklist | Complete | Mock/local state only | Verified | docs/screen-spec.md:3307 |
| S59 | NOC Generation Screen | Company Secretary | `LoanClosureHub` NOC generation tab | Complete | Mock/local state only | Verified | docs/screen-spec.md:3345 |
| S60 | Security Return / Unpledge Screen | Company Secretary | `LoanClosureHub` security return/unpledge tab | Complete | Mock/local state only | Verified | docs/screen-spec.md:3379 |
| S61 | Archive Screen | Company Secretary, Auditor | `LoanClosureHub` archive tab | Complete | Mock/local state only | Verified | docs/screen-spec.md:3426 |
| S62 | Compliance Dashboard | CFO, CS, Compliance, Auditor | `ComplianceDashboard` | Complete | None noted | Verified | docs/screen-spec.md:3454 |
| S63 | Section 186 Limit Tracker | CFO, CS, Compliance, Auditor | `ComplianceDashboard` Section 186 panel | Complete | None noted | Verified | docs/screen-spec.md:3499 |
| S64 | NBFC Principal Business Test | CFO, CS, Compliance, Auditor | `ComplianceDashboard` NBFC principal business test panel | Complete | None noted | Verified | docs/screen-spec.md:3532 |
| S65 | KYC / AML and Re-KYC Tracker | Compliance, Credit, Auditor | `ComplianceDashboard` KYC/Re-KYC tracker | Complete | None noted | Verified | docs/screen-spec.md:3569 |
| S66 | Stamp Duty Register | Company Secretary, Compliance, Auditor | `RegistersHub` stamp duty register tab | Complete | Mock-derived rows only | Verified | docs/screen-spec.md:3601 |
| S67 | Money-Lending Annual Review | Company Secretary, Compliance, Auditor | `ComplianceDashboard`; `RegistersHub` compliance register | Complete | Mock-derived rows only | Verified | docs/screen-spec.md:3632 |
| S68 | Grievance Register | Compliance, CS, Auditor | `RegistersHub` grievance register tab; borrower grievance screen | Complete | Mock-derived rows only | Verified | docs/screen-spec.md:3660 |
| S69 | Reports and MIS Center | CFO, Credit, Accounts, Sales Team, Auditors | `ReportsMIS` | Complete | None noted | Fixed | docs/screen-spec.md:3695; sfpcl-lms/src/pages/reports/ReportsMIS.tsx |
| S70 | Policy and Product Configuration | Admin, CFO, CS | `SettingsHub` policy configuration tab | Complete | Prototype settings only | Verified | docs/screen-spec.md:3729 |
| S71 | Approval Matrix Settings | Admin, CFO, CS | `SettingsHub` approval matrix tab | Complete | Prototype settings only | Verified | docs/screen-spec.md:3781 |
| S72 | Template Management | Admin, CFO, CS | `SettingsHub` template management tab | Complete | Prototype settings only | Verified | docs/screen-spec.md:3820 |
| S73 | User and Role Management | Admin | `SettingsHub` user and role management tab | Complete | Prototype settings only; Field Officer and Sales Team included | Fixed | docs/screen-spec.md:3873; sfpcl-lms/src/pages/settings/SettingsHub.tsx |
| S74 | Audit Log Explorer | Auditor, Admin, CS | `RegistersHub` audit log explorer | Complete | Consolidated inside register hub | Verified | docs/screen-spec.md:3910 |
| S76 | Borrower Portal | Borrower/Member | `BorrowerPortal` and MP screens | Complete | None noted | Verified | docs/screen-spec.md:4243 |
| MP00 | Member Portal Login | Borrower/Member | `MP00_Login` wired from staff login | Complete | None noted | Verified | docs/screen-spec-member-portal.md:193; sfpcl-lms/src/App.tsx |
| MP01 | Account Activation / First-Time Access | Borrower/Member | `MP01_Activation` | Complete | None noted | Verified | docs/screen-spec-member-portal.md:243 |
| MP02 | Forgot Password / OTP Verification | Borrower/Member | `MP02_ForgotPassword` | Complete | None noted | Verified | docs/screen-spec-member-portal.md:285 |
| MP03 | Member Portal Dashboard | Borrower/Member | `MP03_Dashboard` | Complete | None noted | Verified | docs/screen-spec-member-portal.md:315 |
| MP04 | My Profile | Borrower/Member | `MP04_MyProfile` | Complete | None noted | Verified | docs/screen-spec-member-portal.md:362 |
| MP05 | New Loan Application — Start | Borrower/Member | `MP05_NewApplication` start/applicant step | Complete | None noted | Verified | docs/screen-spec-member-portal.md:433 |
| MP06 | Loan Application Form | Borrower/Member | `MP05_NewApplication` application form steps | Consolidated | No separate file; represented in multi-step new application flow | Verified | docs/screen-spec-member-portal.md:475 |
| MP07 | Document Upload Checklist | Borrower/Member | `MP07_DocumentChecklist`; upload section in `MP05_NewApplication` | Complete | None noted | Verified | docs/screen-spec-member-portal.md:573 |
| MP08 | Application Review & Submission | Borrower/Member | `MP05_NewApplication` review and submit step | Consolidated | No separate file; represented in multi-step new application flow | Verified | docs/screen-spec-member-portal.md:616 |
| MP09 | My Applications List | Borrower/Member | `MP09_MyApplications` | Complete | None noted | Verified | docs/screen-spec-member-portal.md:655 |
| MP10 | Application Status Detail | Borrower/Member | `MP10_ApplicationStatus` | Complete | None noted | Verified | docs/screen-spec-member-portal.md:694 |
| MP11 | Deficiency Response | Borrower/Member | `MP10_ApplicationStatus` deficiency response panel | Consolidated | No separate file; deficiency response is embedded in status detail | Verified | docs/screen-spec-member-portal.md:753 |
| MP12 | Sanction Outcome & Terms | Borrower/Member | `MP12_SanctionOutcome` | Complete | None noted | Verified | docs/screen-spec-member-portal.md:793 |
| MP13 | Documentation Actions | Borrower/Member | `MP13_DocumentationActions` | Complete | None noted | Verified | docs/screen-spec-member-portal.md:833 |
| MP14 | Disbursement Status | Borrower/Member | `MP14_DisbursementStatus` | Complete | None noted | Verified | docs/screen-spec-member-portal.md:875 |
| MP15 | My Loans | Borrower/Member | `MP15_MyLoans` | Complete | None noted | Verified | docs/screen-spec-member-portal.md:917 |
| MP16 | Loan Account Detail | Borrower/Member | `MP15_MyLoans` loan detail sections | Consolidated | No separate file; active loan detail is embedded in My Loans | Verified | docs/screen-spec-member-portal.md:944 |
| MP17 | Repayments | Borrower/Member | `MP17_Repayments` | Complete | None noted | Verified | docs/screen-spec-member-portal.md:983 |
| MP18 | Direct Repayment Information | Borrower/Member | `MP18_DirectRepaymentInfo` | Complete | None noted | Verified | docs/screen-spec-member-portal.md:1027 |
| MP19 | Notices & Letters | Borrower/Member | `MP19_NoticesLetters` | Complete | None noted | Verified | docs/screen-spec-member-portal.md:1056 |
| MP20 | Closure & NOC | Borrower/Member | `MP20_ClosureNOC` | Complete | None noted | Verified | docs/screen-spec-member-portal.md:1094 |
| MP21 | Grievance Submission | Borrower/Member | `MP24_SupportGrievance` grievance submission section | Consolidated | Combined help/grievance screen | Verified | docs/screen-spec-member-portal.md:1124 |
| MP22 | Grievance Detail & Tracking | Borrower/Member | `MP24_SupportGrievance` grievance tracking section | Consolidated | Combined help/grievance screen | Verified | docs/screen-spec-member-portal.md:1167 |
| MP23 | Notifications Center | Borrower/Member | `MP23_Notifications` | Complete | None noted | Verified | docs/screen-spec-member-portal.md:1193 |
| MP24 | Help & Required Documents Guide | Borrower/Member | `MP24_SupportGrievance` help guide section | Complete | Help and grievance are combined by design | Verified | docs/screen-spec-member-portal.md:1223 |
| MP25 | Profile Security Settings | Borrower/Member | `MP25_SecuritySettings` | Complete | None noted | Verified | docs/screen-spec-member-portal.md:1250 |

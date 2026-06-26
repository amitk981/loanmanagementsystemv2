| Gate | Source docs | UI location | Expected blocker | Current state | Fix | Verified |
|---|---|---|---|---|---|---|
| Member-only loan processing | screen-spec S10/S16; functional-spec | `NewApplication`, `AppraisalWorkbench` | Inactive/non-member cannot proceed except exception | Visible member validation and disabled selection | Existing | Yes |
| Productive agriculture purpose only | screen-spec S10/S15; functional-spec | `NewApplication`, borrower `MP05` | Non-productive purpose blocked | Purpose validation visible | Existing | Yes |
| Required profile evidence | screen-spec S05-S09/S10 | Member/application screens | KYC/shareholding/land/crop/nominee/witness visible | Consolidated across member/application/detail | Existing | Yes |
| Completeness reference threshold | screen-spec S12 | `ApplicationDetail` | Reference generated only after completeness pass | Local completeness state and reference state visible | Existing | Yes |
| Deficiency/rejection reason | screen-spec S14; member MP11 | `ApplicationDetail`, `MP10` | Reason, borrower message, owner/date/next action | Visible in detail/status flows | Existing | Yes |
| Eligibility amount and exception route | screen-spec S15/S18 | `AppraisalWorkbench`, `LoanLimitCalculator` | Above eligible amount creates exception | Formula and exception path represented | Existing | Yes |
| Maker/checker appraisal | screen-spec S19/S20; component-spec | `AppraisalWorkbench` | DM Finance prepares; Credit Manager reviews | Role-aware actions visible | Existing | Yes |
| Approval matrix | screen-spec S21-S24 | `SanctionWorkbench`, `ApplicationDetail` | <= Rs.5L CFO + 1 Director; > Rs.5L CFO + 2 Directors | Visible approver rows and special case messaging | Existing | Yes |
| Conflicted approver exclusion | screen-spec S24 | `SanctionWorkbench` | Conflict disclosed/excluded | Special case/conflict controls represented | Existing | Yes |
| Documentation blocks disbursement | screen-spec S26-S38 | `DocumentationHub`, `DocumentChecklist`, `DisbursementHub` | SAP/payment blocked until docs/security/signoffs complete | Readiness queue only includes doc-complete sanctioned apps | Existing | Yes |
| Security custody/invocation controlled | screen-spec S30/S31/S57/S60 | `DocumentationHub`, `DefaultRecoveryHub`, `LoanClosureHub` | SH-4/CDSL/cheque cannot be casual actions | Controlled status/action panels visible | Existing | Yes |
| SAP before disbursement | screen-spec S36-S38 | `DisbursementHub` | SAP code/bank verification before readiness | Readiness cards and disabled actions visible | Existing | Yes |
| SM Finance owns initiation | screen-spec S39; auth-permissions | `DisbursementHub`, `App.tsx` | Only SM Finance can initiate | Page permission guard plus button-level can check | Fixed | Yes |
| CFC final authority | screen-spec S40 | `DisbursementHub`, `App.tsx` | Separate final CFC authorisation | Separate route permission and button-level check | Fixed | Yes |
| UTR/evidence/advice after auth | screen-spec S41 | `DisbursementHub` | Advice only after UTR/evidence | Disabled until reference and evidence uploaded | Existing | Yes |
| Repayment allocation principal-first | screen-spec S44-S46 | `RepaymentLedger`, `RepaymentsHub` | Allocation displayed | Ledger shows principal/interest allocation | Existing | Yes |
| Interest invoice/capitalisation | screen-spec S47-S49 | `InterestManagement` | Accrual/invoice/capitalisation represented | Tabs and controls visible | Existing | Yes |
| DPD/PAR and CFO MIS | screen-spec S50-S52/S69 | `MonitoringDashboard`, `ReportsMIS` | Buckets, owner, MIS visibility | Visible via monitoring/reports | Existing | Yes |
| Formal recovery approval | screen-spec S53-S57 | `DefaultRecoveryHub` | Recovery/security invocation only after approval | Recovery approval and invocation panels visible | Existing | Yes |
| Closure requires zero outstanding/NOC/security/archive | screen-spec S58-S61 | `LoanClosureHub`, borrower `MP20` | Closure blocked until repayment and final steps | Outstanding blocker plus checklist | Existing | Yes |
| Compliance statutory gates | screen-spec S62-S68 | `ComplianceDashboard`, `RegistersHub` | Section 186, NBFC, KYC, stamp, money-lending, grievance, retention visible | Dashboard/register coverage present | Existing | Yes |
| Role-aware access | auth-permissions; screen-spec cross-rules | `Sidebar`, `App.tsx`, `GlobalSearchResults`, `NotificationsCenter`, page actions | Unauthorized role cannot open/act or see unrelated search/alert data | Central page guard plus role-filtered search/alerts added | Fixed | Yes |
| Auditor read-only | auth-permissions | `Dashboard`, action-level screens | No create/edit/approve/disburse actions | Read-only notice and no action permissions | Existing | Yes |

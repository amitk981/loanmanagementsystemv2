# SFPCL Flow Gap Ledger

This ledger tracks the Mermaid/spec-to-implementation gaps being closed in the current UI prototype.

Implementation note: this is a design prototype, so `Done` means the screen/state is represented in the UI with local prototype state. It does not imply backend persistence or real workflow automation.

Status key:
- `Done` means represented in the current UI with existing project styling.
- `Partial` means represented, but still mock/local-state or consolidated.
- `Open` means not yet represented in the current UI.

| Area | Gap | Status | Notes |
|---|---|---:|---|
| Borrower portal | MP04 My Profile is implemented but not reachable from borrower navigation | Done | Wired into borrower sidebar/header flow. |
| Borrower portal | MP09 My Applications exists but is not reachable | Done | Wired into borrower portal. |
| Borrower portal | MP12 Sanction Outcome & Terms | Done | Added borrower-facing outcome/terms view. |
| Borrower portal | MP13 Documentation Actions | Done | Added borrower-facing legal/signature actions view. |
| Borrower portal | MP14 Disbursement Status | Done | Added borrower-facing SAP/disbursement/advice view. |
| Borrower portal | MP18 Direct Repayment Information | Done | Added bank transfer instructions and UTR submission guidance. |
| Borrower portal | MP19 Notices & Letters | Done | Added borrower-facing letters/notices center. |
| Borrower portal | MP20 Closure & NOC | Done | Added borrower-facing NOC/security return status. |
| Borrower portal | MP23 Notifications Center | Done | Added borrower-facing notification list. |
| Borrower portal | MP25 Profile Security Settings | Done | Added account security settings. |
| Registers | S13 Loan Request Register is not separately labeled | Done | Added a dedicated loan request register alongside the loan account register. |
| Registers | Credit Sanction, Exception, Security, Grievance, Recovery registers | Done | Present in `RegistersHub`, but populated from mock data. |
| Registers | Register tab labels and panels drift after Member Register | Done | Added the missing Compliance Register tab so Stamp Duty, Audit Log, Grievance, and Recovery panels line up correctly. |
| Registers | Fine-grained statutory registers from docs | Done | Added dedicated tabs for cheque, SH-4, CDSL, SAP, disbursement, repayment, interest invoice, accrual, DPD, NOC, archive and SOP change registers; still mock data. |
| Borrower access | Borrower-specific MP00/MP01/MP02 auth screens are present but not wired into app login | Done | Shared login now opens the member login, activation, and forgot-password flow. |
| Borrower portal | Header notification/help shortcuts are visual only | Done | Notification button opens MP23; help button opens MP24 support/grievance. |
| Borrower portal | MP16 Loan Account Detail is consolidated inside MP15 | Done | MP15 now includes schedule, statement, documents, notices and closure readiness for the active loan. |
| Borrower portal | MP06/MP08/MP11/MP21/MP22/MP24 are consolidated rather than one file per spec screen | Done | Deliberately consolidated inside MP05, MP10 and MP24 to avoid duplicate borrower screens. |
| Documentation | S28-S34 standalone legal document screens | Done | Consolidated legal action workspace includes local completion states and borrower/register/audit impact preview. |
| Documentation | Hub is too scroll-heavy and hard to verify step-by-step | Done | Reworked `DocumentationHub` into a queue-only left panel plus stepper-driven workbench using existing `card`, grid and button styles. |
| Documentation | Stepper does not follow current stage and legal items lack document-level statuses | Done | Stepper now tracks active Previous/Next stage, and legal action cards show document-style prepared/signature/stamp/register statuses. |
| Documentation | S26-S35 intended actions and evidence not fully visible in consolidated hub | Done | Queue now shows required documentation status fields; legal actions include generate/upload/stamp/notary/signature/CS controls, document evidence fields, security evidence, deficiency actions and all four final sign-offs as local UI state. |
| Disbursement | S38 readiness gate stops at bank verification | Done | Added readiness review, bank verification clearance, UTR evidence, and advice generation controls. |
| Recovery | S53-S57 default/recovery flow | Done | Added local extension, non-payment, recovery approval, security invocation, borrower notice, register and audit UI states. |
| Closure | S58-S61 closure/NOC/security/archive flow | Done | Added local closure, NOC publication, security return/unpledge, archive, borrower publication, register and audit UI states. |
| State machine | Cross-screen workflow transitions and audit/register updates | Done | Represented as prototype workflow impact panels with local UI state; backend persistence remains outside prototype scope. |
| Verification | Production build | Done | `npm run build` completed successfully; only existing Vite/chunk-size warnings remain. |

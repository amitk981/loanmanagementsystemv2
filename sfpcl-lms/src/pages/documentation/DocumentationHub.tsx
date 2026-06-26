import React, { useState } from 'react';
import {
  FolderOpen, ChevronRight, Check, AlertTriangle, CheckCircle2,
  Lock, FileSignature, Landmark, Shield, Upload, ClipboardList,
  FileText, Clock, XCircle
} from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';
import StageStepper, { Step } from '../../components/ui/StageStepper';
import DocumentChecklist from '../../components/loan/DocumentChecklist';
import AuditTimeline from '../../components/loan/AuditTimeline';
import Tabs from '../../components/ui/Tabs';
import { documents, loanApplications, securities } from '../../data/mockData';
import { useRole, type Permission } from '../../contexts/RoleContext';

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');

const maskSensitive = (value: string, visible: boolean) =>
  visible ? value : value.replace(/[A-Z0-9]/g, '•');

const docComplete = (doc?: { status: string }) =>
  !!doc && ['verified', 'complete', 'notarised'].includes(doc.status);

const SECURITY_TYPE_LABELS: Record<string, string> = {
  poa: 'Power of Attorney',
  sh4: 'SH-4 Share Transfer',
  cdsl_pledge: 'CDSL Pledge',
  blank_cheque: 'Blank-Dated Cheque',
  tri_party: 'Tri-Party Agreement',
};

interface DocumentationHubProps {
  onOpenApplication: (id: string) => void;
  initialSelectedId?: string;
}

/* ─── Small helpers ─────────────────────────────────────── */
const FieldGrid: React.FC<{
  fields: { label: string; value: string; status: string }[];
}> = ({ fields }) => (
  <div className="mt-3 border border-slate-200 rounded-lg bg-white divide-y divide-slate-100">
    {fields.map(f => (
      <div key={f.label} className="grid grid-cols-[1fr_auto] items-center gap-3 px-3 py-2">
        <div className="min-w-0">
          <div className="text-xs font-medium text-slate-700">{f.label}</div>
          <div className="text-xs text-slate-400 truncate" title={f.value}>{f.value}</div>
        </div>
        <StatusBadge label={f.status} size="sm" />
      </div>
    ))}
  </div>
);

const ActionRow: React.FC<{
  buttons: { label: string; disabled?: boolean; disabledTitle?: string; primary?: boolean }[];
  onVerify?: (() => void) | null;
  verified?: boolean;
}> = ({ buttons, onVerify, verified }) => (
  <div className="mt-3 flex flex-wrap items-center gap-2">
    {buttons.map(b => (
      <button
        key={b.label}
        className={`${b.primary ? 'btn-primary' : 'btn-secondary'} text-xs disabled:opacity-40 disabled:cursor-not-allowed`}
        disabled={b.disabled}
        title={b.disabled ? b.disabledTitle : b.label}
      >
        {b.label}
      </button>
    ))}
    {onVerify !== undefined && (
      <button
        className="ml-auto text-xs px-3 py-1.5 rounded-lg border border-green-300 bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-40 disabled:cursor-not-allowed"
        disabled={!onVerify || verified}
        onClick={onVerify || undefined}
        title={!onVerify ? 'Prerequisites incomplete' : verified ? 'Already verified' : 'Mark verified'}
      >
        {verified ? <span className="flex items-center gap-1"><Check size={12} /> Verified</span> : 'Mark Verified'}
      </button>
    )}
  </div>
);

/* ─── Component ─────────────────────────────────────────── */
const DocumentationHub: React.FC<DocumentationHubProps> = ({ onOpenApplication, initialSelectedId }) => {
  const docQueue = loanApplications.filter(a =>
    ['sanctioned', 'documentation_in_progress'].includes(a.status) &&
    a.documentationStatus !== 'complete'
  );

  const initialApp = initialSelectedId
    ? docQueue.find(a => a.id === initialSelectedId || a.applicationNumber === initialSelectedId)
    : null;

  const [selected, setSelected] = useState<string | null>(initialApp?.id || docQueue[0]?.id || null);
  const [isDocComplete, setIsDocComplete] = useState(false);
  const [isCSApproved, setIsCSApproved] = useState(false);
  const [isCreditManagerApproved, setIsCreditManagerApproved] = useState(false);
  const [isSanctionFinalApproved, setIsSanctionFinalApproved] = useState(false);
  const [isFinanceSigned, setIsFinanceSigned] = useState(false);
  const [approvalCondition, setApprovalCondition] = useState('');
  const [completedLegalActions, setCompletedLegalActions] = useState<string[]>([]);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const { can, currentUser } = useRole();

  const app = docQueue.find(a => a.id === selected);
  const appDocuments = documents.filter(d => d.applicationId === selected);
  const appSecurities = securities.filter(s => s.applicationId === selected);
  const isAuditor = currentUser.role === 'auditor';
  const isReadOnly = isAuditor;
  const sensitiveVisible =
    can('manage_documentation') ||
    can('initiate_disbursement') ||
    currentUser.role === 'company_secretary';
  const recoveryApproved = !!(app?.isException && app?.riskRating === 'high');
  const signatureMismatch = app?.id === 'app004';
  const byType = (type: string) => appDocuments.find(doc => doc.documentType === type);

  // Prereq flags
  const borrowerKycReady = docComplete(byType('pan')) && docComplete(byType('aadhaar'));
  const nomineeKycReady = docComplete(byType('nominee_pan')) && docComplete(byType('nominee_aadhaar'));
  const witnessKycReady = docComplete(byType('witness_pan')) && docComplete(byType('witness_aadhaar'));
  const cancelledChequeReady = docComplete(byType('cancelled_cheque'));
  const blankChequeReady = docComplete(byType('blank_cheque'));
  const poaDoc = byType('poa');
  const poaReady =
    docComplete(poaDoc) &&
    poaDoc?.stampStatus === 'complete' &&
    poaDoc?.notarisationStatus === 'complete';
  const triPartyReady = !app?.sapCustomerCode || docComplete(byType('tri_party'));
  const sh4Ready =
    app?.shareMode !== 'physical' ||
    (docComplete(byType('sh4')) && appSecurities.some(s => s.securityType === 'sh4' && s.status === 'held'));
  const cdslReady =
    app?.shareMode !== 'demat' ||
    appSecurities.some(s => s.securityType === 'cdsl_pledge' && s.status === 'pledged');
  const termSheetReady = docComplete(byType('term_sheet'));
  const loanAgreementDoc = byType('loan_agreement');
  const loanAgreementReady =
    docComplete(loanAgreementDoc) &&
    loanAgreementDoc?.stampStatus === 'complete' &&
    loanAgreementDoc?.notarisationStatus === 'complete';
  const bankVerificationReady = !signatureMismatch || docComplete(byType('bank_verification_letter'));

  const approvalProgressCount = [isCSApproved, isCreditManagerApproved, isSanctionFinalApproved, isFinanceSigned].filter(Boolean).length;
  const approvalsComplete = isCSApproved && isCreditManagerApproved && isSanctionFinalApproved && isFinanceSigned;

  const mandatoryChecklistClear = [
    borrowerKycReady, nomineeKycReady, witnessKycReady,
    cancelledChequeReady, blankChequeReady, poaReady,
    triPartyReady, sh4Ready, cdslReady,
    termSheetReady, loanAgreementReady, bankVerificationReady,
  ].every(Boolean);

  const legalReadyByScreen: Record<string, boolean> = {
    S28: poaReady, S29: triPartyReady, S30: sh4Ready,
    S31: cdslReady, S32: termSheetReady, S33: loanAgreementReady,
    S34: bankVerificationReady,
  };

  const legalActions = [
    { screen: 'S28', name: 'Power of Attorney', owner: 'Company Secretary', status: poaReady ? 'complete' : poaDoc?.stampStatus === 'complete' ? 'pending_notarisation' : 'pending_stamp' },
    { screen: 'S32', name: 'Term Sheet', owner: 'Compliance Team', status: termSheetReady ? 'complete' : 'pending_signature' },
    { screen: 'S33', name: 'Loan Agreement', owner: 'Compliance Team', status: loanAgreementReady ? 'complete' : loanAgreementDoc?.stampStatus === 'complete' ? 'pending_notarisation' : 'pending_signature' },
    { screen: 'S29', name: 'Tri-Party Agreement', owner: 'Compliance / CS', status: triPartyReady ? (app?.sapCustomerCode ? 'complete' : 'not_required') : 'pending_signature', conditional: !app?.sapCustomerCode },
    ...(app?.shareMode === 'physical'
      ? [{ screen: 'S30', name: 'SH-4 Physical Share Security', owner: 'Company Secretary', status: sh4Ready ? 'complete' : 'pending', conditional: true }]
      : app?.shareMode === 'demat'
        ? [{ screen: 'S31', name: 'CDSL Pledge', owner: 'Company Secretary', status: cdslReady ? 'complete' : 'pending', conditional: true }]
        : []),
    { screen: 'S34', name: 'Bank Verification / Signature Mismatch', owner: 'Credit / Compliance', status: bankVerificationReady ? (signatureMismatch ? 'complete' : 'not_required') : 'pending', conditional: !signatureMismatch },
  ];

  const isLegalActionComplete = (screen: string) =>
    legalReadyByScreen[screen] || completedLegalActions.includes(screen);

  const completedLegalCount = legalActions.filter(a => isLegalActionComplete(a.screen)).length;
  const legalActionsComplete = completedLegalCount === legalActions.length;

  const toggleLegalAction = (screen: string) => {
    setCompletedLegalActions(prev =>
      prev.includes(screen) ? prev.filter(s => s !== screen) : [...prev, screen]
    );
  };

  const disbursementReady = mandatoryChecklistClear && legalActionsComplete && approvalsComplete;

  /* ── Blocker list ── */
  const blockerQueue = [
    { label: 'Borrower KYC', owner: 'Credit / Compliance', action: 'Upload', ready: borrowerKycReady },
    { label: 'Nominee KYC', owner: 'Credit / Compliance', action: 'Upload', ready: nomineeKycReady },
    { label: 'Witness KYC', owner: 'Compliance', action: 'Verify', ready: witnessKycReady },
    { label: 'Cancelled cheque', owner: 'Compliance / Finance', action: 'Upload', ready: cancelledChequeReady },
    { label: 'Blank cheque custody', owner: 'Company Secretary', action: 'Log custody', ready: blankChequeReady },
    { label: 'Power of Attorney', owner: 'Company Secretary', action: poaDoc?.stampStatus === 'complete' ? 'Mark notarised' : 'Mark stamped', ready: poaReady },
    ...(app?.sapCustomerCode ? [{ label: 'Tri-Party Agreement', owner: 'Compliance / CS', action: 'Upload signed', ready: triPartyReady }] : []),
    ...(app?.shareMode === 'physical' ? [{ label: 'SH-4 custody', owner: 'Company Secretary', action: 'Assign custody', ready: sh4Ready }] : []),
    ...(app?.shareMode === 'demat' ? [{ label: 'CDSL pledge', owner: 'Company Secretary', action: 'Enter PSN', ready: cdslReady }] : []),
    { label: 'Term Sheet', owner: 'Compliance', action: 'Route signatures', ready: termSheetReady },
    { label: 'Loan Agreement', owner: 'Compliance / CS', action: 'Upload stamped', ready: loanAgreementReady },
    ...(signatureMismatch ? [{ label: 'Bank mismatch resolution', owner: 'Credit / Compliance', action: 'Upload letter', ready: bankVerificationReady }] : []),
    { label: 'Final sign-offs', owner: 'CS → Credit → Sanction → Finance', action: 'Submit to CS', ready: approvalsComplete },
  ];
  const pendingBlockers = blockerQueue.filter(b => !b.ready);
  const firstBlocker = pendingBlockers[0];

  /* ── Approval steps ── */
  const approvalSteps: {
    role: string; seq: number; meaning: string; status: boolean;
    permission: Permission; action: string; onApprove: () => void;
  }[] = [
    { seq: 1, role: 'Company Secretary', meaning: 'Documents verified, stamped, notarised and security custody confirmed.', status: isCSApproved, permission: 'manage_documentation', action: 'Submit to Credit Manager', onApprove: () => setIsCSApproved(true) },
    { seq: 2, role: 'Credit Manager', meaning: 'Loan limit, checklist and credit conditions confirmed.', status: isCreditManagerApproved, permission: 'approve_credit_checklist', action: 'Submit to Sanction Committee', onApprove: () => setIsCreditManagerApproved(true) },
    { seq: 3, role: 'Sanction Committee', meaning: 'Final disbursement approval per authority matrix.', status: isSanctionFinalApproved, permission: 'approve_sanction', action: 'Submit to Finance', onApprove: () => setIsSanctionFinalApproved(true) },
    { seq: 4, role: 'Senior Manager – Finance', meaning: 'Finance handoff sign-off after disbursement readiness review.', status: isFinanceSigned, permission: 'initiate_disbursement', action: 'Finance handoff received', onApprove: () => setIsFinanceSigned(true) },
  ];

  /* ── Readiness checks (for Approvals tab) ── */
  const readinessChecks = [
    { label: 'Sanction approved', ok: app?.sanctionDecision === 'approved' },
    { label: 'Mandatory checklist clear', ok: mandatoryChecklistClear },
    { label: 'Signature mismatch resolved', ok: bankVerificationReady },
    { label: 'Security document complete', ok: app?.shareMode === 'physical' ? sh4Ready : cdslReady },
    { label: 'Term Sheet and Loan Agreement signed', ok: termSheetReady && loanAgreementReady },
    { label: 'Final sign-offs complete', ok: approvalsComplete },
  ];

  /* ── Evidence fields per document (compact) ── */
  const highValueRoute = (app?.requestedAmount || 0) > 500000;

  const docEvidenceFields = (screen: string): { label: string; value: string; status: string }[] => {
    const complete = isLegalActionComplete(screen);
    const st = (pending: string) => complete ? 'complete' : pending;

    const map: Record<string, { label: string; value: string; status: string }[]> = {
      S28: [
        { label: 'Borrower signature', value: 'Required', status: st('pending_signature') },
        { label: 'Nominee signature', value: 'Required', status: st('pending_signature') },
        { label: 'Stamp value', value: '₹500 stamp paper', status: poaDoc?.stampStatus === 'complete' ? 'complete' : st('pending_stamp') },
        { label: 'Stamp paper no.', value: 'E-STAMP-2026-0042', status: poaDoc?.stampStatus === 'complete' ? 'stamped' : st('pending_stamp') },
        { label: 'Notarisation', value: 'Notary name · Reg no · Date', status: poaDoc?.notarisationStatus === 'complete' ? 'notarised' : st('pending_notarisation') },
        { label: 'CS verification', value: 'Company Secretary', status: st('pending_cs_review') },
        { label: 'Custody location', value: maskSensitive('CS cabinet A / File A-042', sensitiveVisible), status: st('pending_cs_review') },
      ],
      S29: [
        { label: 'Subsidiary', value: 'Sahyadri Farms Post Harvest Care Ltd.', status: st('in_progress') },
        { label: 'Deduction scope', value: 'Principal, interest and all dues', status: st('in_progress') },
        { label: 'Borrower signature', value: 'Required', status: st('pending_signature') },
        { label: 'Nominee signature', value: 'Required if template applies', status: st('pending_signature') },
        { label: 'Subsidiary signatory', value: 'Authorised signer', status: st('pending_signature') },
        { label: 'SFPCL signatory', value: 'Authorised signer', status: st('pending_signature') },
      ],
      S30: app?.shareMode === 'physical' ? [
        { label: 'SH-4 reference', value: 'SH4-2026-0042', status: st('pending') },
        { label: 'Folio / Certificates', value: `${maskSensitive('FO-0334', sensitiveVisible)} / ${maskSensitive('SC-7781, SC-7782', sensitiveVisible)}`, status: st('pending') },
        { label: 'Borrower signature', value: 'Shareholder sign', status: st('pending_signature') },
        { label: 'Witness signature', value: 'Existing SFPCL shareholder', status: st('pending_signature') },
        { label: 'Witness shareholder validation', value: 'SFPCL shareholder register', status: st('pending_cs_review') },
        { label: 'Physical custody', value: 'CS cabinet A / file ref', status: st('pending_cs_review') },
        { label: 'Return / invocation', value: 'Held — invocation locked', status: 'held' },
      ] : [{ label: 'SH-4', value: 'Not required — shares are demat', status: 'not_required' }],
      S31: app?.shareMode === 'demat' ? [
        { label: 'Pledgor BO account', value: maskSensitive('120816000042', sensitiveVisible), status: st('pending') },
        { label: 'Pledgee BO account', value: maskSensitive('120816000001', sensitiveVisible), status: st('pending') },
        { label: 'PRF uploaded', value: 'Pledge Request Form', status: st('pending_upload') },
        { label: 'PSN number', value: appSecurities.find(s => s.securityType === 'cdsl_pledge')?.psnNumber ? maskSensitive(appSecurities.find(s => s.securityType === 'cdsl_pledge')!.psnNumber!, sensitiveVisible) : 'Pending', status: cdslReady ? 'complete' : st('pending') },
        { label: 'Pledge acceptance', value: 'DP confirmation required', status: cdslReady ? 'complete' : st('pending_upload') },
        { label: 'Future-share pledge flag', value: 'Yes — additional shares on issue', status: st('pending') },
        { label: 'Invocation / unpledge', value: 'Locked until recovery / closure', status: 'pending' },
      ] : [{ label: 'CDSL pledge', value: 'Not required — shares are physical', status: 'not_required' }],
      S32: [
        { label: 'Signature route', value: highValueRoute ? 'CFO + two Directors (>₹5L)' : 'CFO only', status: st('pending_signature') },
        { label: 'Borrower signature', value: 'Required', status: st('pending_signature') },
        { label: 'Nominee signature', value: 'Required', status: st('pending_signature') },
      ],
      S33: [
        { label: 'Stamp value', value: '₹500 stamp paper', status: loanAgreementDoc?.stampStatus === 'complete' ? 'stamped' : st('pending_stamp') },
        { label: 'Stamp paper no.', value: 'E-STAMP-2026-0043', status: loanAgreementDoc?.stampStatus === 'complete' ? 'stamped' : st('pending_stamp') },
        { label: 'Notarisation', value: 'Notary name · Reg no · Date', status: loanAgreementDoc?.notarisationStatus === 'complete' ? 'notarised' : st('pending_notarisation') },
        { label: 'Borrower signature', value: 'Required', status: st('pending_signature') },
        { label: 'Witness signature', value: 'Required', status: st('pending_signature') },
      ],
      S34: signatureMismatch ? [
        { label: 'Mismatch source', value: 'PAN vs cheque signature', status: 'pending' },
        { label: 'Masked account', value: `A/C ${maskSensitive('1234', sensitiveVisible)} · RATN••••001`, status: 'pending' },
        { label: 'Resolution option', value: 'Bank letter OR borrower declaration', status: st('pending') },
        { label: 'Bank letter status', value: 'Signed and stamped by bank', status: st('pending_upload') },
        { label: 'Declaration status', value: 'Non-judicial stamp paper alternative', status: st('pending_upload') },
        { label: 'Verifier', value: 'Credit Manager / Compliance', status: st('pending_cs_review') },
      ] : [{ label: 'Bank verification', value: 'No signature mismatch detected', status: 'not_required' }],
    };

    return map[screen] || [];
  };

  const docActionButtons = (screen: string) => {
    const disabled = isReadOnly;
    const map: Record<string, { label: string; disabled?: boolean; disabledTitle?: string }[]> = {
      S28: [
        { label: 'Generate PoA', disabled },
        { label: 'Upload Signed Copy', disabled },
        { label: 'Mark Stamped', disabled: disabled || poaDoc?.stampStatus === 'complete', disabledTitle: poaDoc?.stampStatus === 'complete' ? 'Already stamped' : 'Read-only' },
        { label: 'Mark Notarised', disabled: disabled || poaDoc?.notarisationStatus === 'complete', disabledTitle: poaDoc?.notarisationStatus === 'complete' ? 'Already notarised' : 'Read-only' },
        { label: 'Send for Correction', disabled },
      ],
      S29: [
        { label: 'Generate Agreement', disabled },
        { label: 'Upload Signed Agreement', disabled },
        { label: 'Mark Active', disabled },
        { label: 'Link Reconciliation', disabled },
      ],
      S30: [
        { label: 'Generate SH-4 Checklist', disabled },
        { label: 'Upload Scanned SH-4', disabled },
        { label: 'Mark Original Received', disabled },
        { label: 'Assign Custody', disabled },
        { label: 'Return on Closure', disabled },
        { label: 'Invoke', disabled: !recoveryApproved || disabled, disabledTitle: !recoveryApproved ? 'Approved recovery action required' : 'Read-only' },
      ],
      S31: [
        { label: 'Upload PRF', disabled },
        { label: 'Enter PSN', disabled },
        { label: 'Mark Accepted', disabled: disabled || !legalReadyByScreen['S31'], disabledTitle: !legalReadyByScreen['S31'] ? 'Pledge not complete' : 'Read-only' },
        { label: 'Mark Rejected', disabled },
        { label: 'Invoke', disabled: !recoveryApproved || disabled, disabledTitle: !recoveryApproved ? 'Approved recovery action required' : 'Read-only' },
        { label: 'Start Unpledge', disabled: !cdslReady || disabled, disabledTitle: !cdslReady ? 'Pledge must be accepted first' : 'Read-only' },
      ],
      S32: [
        { label: 'Generate Term Sheet', disabled },
        { label: 'Preview', disabled: false },
        { label: 'Send for Signature', disabled },
        { label: 'Upload Signed Copy', disabled },
        { label: `Route to ${highValueRoute ? 'CFO + Directors' : 'CFO'}`, disabled },
        { label: 'Mark Complete', disabled: disabled || !legalReadyByScreen['S32'], disabledTitle: !legalReadyByScreen['S32'] ? 'Prerequisites incomplete' : 'Read-only' },
      ],
      S33: [
        { label: 'Generate Agreement', disabled },
        { label: 'Upload Signed Copy', disabled },
        { label: 'Mark Stamped', disabled: disabled || loanAgreementDoc?.stampStatus === 'complete', disabledTitle: loanAgreementDoc?.stampStatus === 'complete' ? 'Already stamped' : 'Read-only' },
        { label: 'Mark Notarised', disabled: disabled || loanAgreementDoc?.notarisationStatus === 'complete', disabledTitle: loanAgreementDoc?.notarisationStatus === 'complete' ? 'Already notarised' : 'Read-only' },
        { label: 'Link Witness', disabled },
      ],
      S34: [
        { label: 'Generate Bank Letter', disabled },
        { label: 'Upload Bank Letter', disabled },
        { label: 'Upload Declaration', disabled },
        { label: 'Mark Resolved', disabled: disabled || !legalReadyByScreen['S34'], disabledTitle: !legalReadyByScreen['S34'] ? 'Resolution document pending' : 'Read-only' },
        { label: 'Block Disbursement', disabled },
      ],
    };
    return map[screen] || [];
  };

  /* ── Queue card summary ── */
  const queueSummary = (loanApp: typeof docQueue[number]) => {
    const docsForApp = documents.filter(d => d.applicationId === loanApp.id);
    const secsForApp = securities.filter(s => s.applicationId === loanApp.id);
    const qDoc = (t: string) => docsForApp.find(d => d.documentType === t);
    const qSigMismatch = loanApp.id === 'app004';
    const checks = [
      { label: 'Witness KYC', ready: docComplete(qDoc('witness_pan')) && docComplete(qDoc('witness_aadhaar')) },
      { label: 'PoA stamp/notary', ready: docComplete(qDoc('poa')) && qDoc('poa')?.stampStatus === 'complete' && qDoc('poa')?.notarisationStatus === 'complete' },
      { label: loanApp.shareMode === 'physical' ? 'SH-4 custody' : 'CDSL pledge', ready: loanApp.shareMode === 'physical' ? (docComplete(qDoc('sh4')) && secsForApp.some(s => s.securityType === 'sh4' && s.status === 'held')) : secsForApp.some(s => s.securityType === 'cdsl_pledge' && s.status === 'pledged') },
      { label: 'Loan Agreement', ready: docComplete(qDoc('loan_agreement')) && qDoc('loan_agreement')?.stampStatus === 'complete' && qDoc('loan_agreement')?.notarisationStatus === 'complete' },
      { label: 'Bank mismatch', ready: !qSigMismatch || docComplete(qDoc('bank_verification_letter')) },
      { label: 'Final sign-offs', ready: false },
    ];
    const blocker = checks.find(c => !c.ready);
    return blocker ?? { label: 'Ready for sign-off', ready: true };
  };

  /* ── Doc icon ── */
  const docIcon = (name: string) => {
    if (name.includes('Bank') || name.includes('SH-4')) return <Shield size={15} className="text-slate-500" />;
    if (name.includes('CDSL')) return <Landmark size={15} className="text-slate-500" />;
    return <FileSignature size={15} className="text-slate-500" />;
  };

  /* ── Stage stepper ── */
  const docStageStep = (idx: number, complete = false): Step['state'] => {
    if (complete || idx < activeTabIndex) return 'completed';
    if (idx === activeTabIndex) return 'in_progress';
    return 'not_started';
  };

  const documentationSteps: Step[] = [
    { id: 'checklist', label: 'Checklist', state: docStageStep(0, mandatoryChecklistClear) },
    { id: 'docs', label: 'Documents', state: docStageStep(1, legalActionsComplete) },
    { id: 'security', label: 'Securities', state: docStageStep(2, appSecurities.length > 0 && activeTabIndex > 2) },
    { id: 'approvals', label: 'Approvals', state: docStageStep(3, approvalsComplete) },
    { id: 'audit', label: 'Audit', state: 'not_started' },
  ];

  const tabs = [
    { id: 'checklist', label: 'Checklist', badge: pendingBlockers.length > 0 ? pendingBlockers.length : undefined },
    { id: 'documents', label: 'Documents', badge: legalActions.filter(a => !isLegalActionComplete(a.screen)).length || undefined },
    { id: 'security', label: 'Securities', badge: appSecurities.length || undefined },
    { id: 'approvals', label: 'Approvals', badge: approvalsComplete ? undefined : (4 - approvalProgressCount) },
    { id: 'audit', label: 'Audit Trail' },
  ];

  /* ─────────────────────── RENDER ─────────────────────── */
  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Documentation Hub</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {docQueue.length} application{docQueue.length !== 1 ? 's' : ''} pending documentation
          </p>
        </div>
      </div>

      {docQueue.length === 0 ? (
        <div className="card text-center py-16">
          <Check size={32} className="text-green-500 mx-auto mb-3" />
          <p className="text-slate-600 font-semibold">All documentation is complete</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] gap-6">

          {/* ── Queue sidebar ── */}
          <div className="card p-0 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Doc Queue ({docQueue.length})
              </p>
            </div>
            <div className="divide-y divide-slate-100">
              {docQueue.map(a => {
                const qs = queueSummary(a);
                return (
                  <button
                    key={a.id}
                    onClick={() => {
                      setSelected(a.id);
                      setActiveTabIndex(0);
                    }}
                    className={`w-full flex items-start gap-3 p-4 hover:bg-slate-50 transition-colors text-left ${selected === a.id ? 'bg-green-50 border-l-4 border-l-green-500' : ''}`}
                  >
                    <FolderOpen size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-semibold text-slate-900 num text-sm truncate">{a.applicationNumber}</div>
                        <StatusBadge label={qs.ready ? 'ready_for_payment' : a.documentationStatus} size="sm" />
                      </div>
                      <div className="text-xs text-slate-500 truncate mt-0.5">{a.memberName} · {fmt(a.requestedAmount)}</div>
                      <div className="mt-1.5 flex items-center gap-1.5 text-xs">
                        {qs.ready ? (
                          <span className="text-green-700 flex items-center gap-1"><Check size={11} /> Ready for sign-off</span>
                        ) : (
                          <span className="text-amber-700 flex items-center gap-1"><Clock size={11} /> {qs.label}</span>
                        )}
                      </div>
                      <div className="mt-0.5 text-xs text-slate-400 capitalize">{a.shareMode} shares</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Main panel ── */}
          {app && (
            <div className="space-y-4 min-w-0">

              {/* App header card */}
              <div className="card">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-bold text-slate-900 num">{app.applicationNumber}</h2>
                      <StatusBadge label={app.documentationStatus} size="sm" />
                      {legalActionsComplete && <StatusBadge label="legal_complete" size="sm" />}
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5">{app.memberName} · {fmt(app.requestedAmount)}</p>
                    {app.sapCustomerCode && (
                      <p className="text-xs text-slate-400 mt-0.5">SAP: <span className="num font-medium">{app.sapCustomerCode}</span></p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 self-start">
                    <button
                      className="btn-secondary text-xs disabled:opacity-50"
                      disabled={isReadOnly}
                      title={isReadOnly ? 'Read-only role' : 'Generate document pack'}
                    >
                      Generate Document Pack
                    </button>
                    <button onClick={() => onOpenApplication(app.id)} className="text-xs text-green-600 hover:underline flex items-center gap-1 self-center">
                      Full view <ChevronRight size={12} />
                    </button>
                  </div>
                </div>

                {/* Stage stepper */}
                <div className="mt-4">
                  <StageStepper steps={documentationSteps} />
                </div>

                {/* Blocker bar */}
                {!disbursementReady && (
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                    <div className="flex items-center gap-1.5 text-sm">
                      <AlertTriangle size={14} className="text-red-600 flex-shrink-0" />
                      <span className="text-red-800 font-semibold">Disbursement blocked</span>
                    </div>
                    <div className="flex-1 text-xs text-red-700 truncate">
                      {firstBlocker ? (
                        <><span className="font-medium">{firstBlocker.label}</span> · {firstBlocker.owner} · Action: {firstBlocker.action}</>
                      ) : 'Sign-offs incomplete'}
                    </div>
                    <span className="text-xs font-semibold text-red-600 bg-red-100 border border-red-200 rounded-full px-2 py-0.5">
                      {pendingBlockers.length} pending
                    </span>
                  </div>
                )}
                {disbursementReady && (
                  <div className="mt-4 flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
                    <CheckCircle2 size={14} className="text-green-600" />
                    <span className="text-sm font-semibold text-green-800">All checks complete — ready for SAP / disbursement</span>
                  </div>
                )}
              </div>

              {/* Tab panel */}
              <div className="card p-0 overflow-hidden">
                <Tabs tabs={tabs} activeIndex={activeTabIndex} onChange={setActiveTabIndex}>
                  {/* ─ Tab 0: Checklist ─ */}
                  <div className="p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                          <ClipboardList size={14} /> Document Checklist
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">All required items before disbursement can proceed.</p>
                      </div>
                    </div>
                    <DocumentChecklist
                      applicationId={app.id}
                      shareMode={app.shareMode}
                      subsidiaryRepayment={Boolean(app.sapCustomerCode)}
                      signatureMismatch={signatureMismatch}
                      readOnly={isAuditor}
                      canVerify={can('manage_documentation') || can('approve_credit_checklist')}
                      sensitiveVisible={sensitiveVisible}
                      finalSignoffsComplete={approvalsComplete}
                      finalSignoffProgress={approvalProgressCount}
                    />
                  </div>

                  {/* ─ Tab 1: Documents ─ */}
                  <div className="p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                          <FileText size={14} /> Legal &amp; Security Documents
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {completedLegalCount} of {legalActions.length} complete. Mark each verified once all sub-items are done.
                        </p>
                      </div>
                      <StatusBadge label={legalActionsComplete ? 'complete' : 'in_progress'} size="sm" />
                    </div>

                    <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
                      {legalActions.map(action => {
                        const complete = isLegalActionComplete(action.screen);
                        const fields = docEvidenceFields(action.screen);
                        const buttons = docActionButtons(action.screen);
                        // Conditional doc that isn't required for this loan
                        const isNotApplicable = action.status === 'not_required';

                        if (isNotApplicable) {
                          return (
                            <div key={action.screen} className="rounded-xl border border-slate-100 bg-slate-50 p-3 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                  {docIcon(action.name)}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-slate-500">{action.name}</p>
                                  <p className="text-xs text-slate-400 mt-0.5">{action.owner}</p>
                                </div>
                              </div>
                              <StatusBadge label="not_required" size="sm" />
                            </div>
                          );
                        }

                        return (
                          <div
                            key={action.screen}
                            className={`rounded-xl border p-4 ${complete ? 'border-green-200 bg-green-50' : 'border-slate-200 bg-white'}`}
                          >
                            {/* Doc header */}
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-2.5 min-w-0">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${complete ? 'bg-green-100' : 'bg-slate-100'}`}>
                                  {complete ? <Check size={15} className="text-green-600" /> : docIcon(action.name)}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-slate-900">{action.name}</p>
                                  <p className="text-xs text-slate-500 mt-0.5">{action.owner}</p>
                                </div>
                              </div>
                              <StatusBadge label={action.status} size="sm" />
                            </div>

                            {/* Field grid */}
                            <FieldGrid fields={fields} />

                            {/* Action buttons */}
                            <ActionRow
                              buttons={buttons}
                              onVerify={
                                !isReadOnly && legalReadyByScreen[action.screen] && !complete
                                  ? () => toggleLegalAction(action.screen)
                                  : isReadOnly || !legalReadyByScreen[action.screen] ? null : undefined
                              }
                              verified={complete}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ─ Tab 2: Securities ─ */}
                  <div className="p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                        <Shield size={14} /> Security Instruments
                      </h3>
                      <div className="flex gap-2">
                        <StatusBadge label={app.shareMode === 'physical' ? (sh4Ready ? 'complete' : 'pending') : (cdslReady ? 'complete' : 'pending')} size="sm" />
                      </div>
                    </div>

                    {appSecurities.length === 0 ? (
                      <div className="text-sm text-slate-400 py-6 text-center">No security instruments recorded for this application.</div>
                    ) : (
                      <div className="space-y-2">
                        {appSecurities.map(sec => (
                          <div key={sec.id} className="rounded-lg border border-slate-200 bg-white">
                            <div className="flex items-center gap-3 p-3">
                              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                <Shield size={14} className="text-slate-500" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-slate-900">
                                  {SECURITY_TYPE_LABELS[sec.securityType] || sec.securityType}
                                </div>
                                <div className="text-xs text-slate-500 mt-0.5">
                                  Custodian: {sec.custodian || 'Unassigned'}
                                  {sec.executionDate && ` · Executed: ${sec.executionDate}`}
                                  {sec.psnNumber && ` · PSN: ${maskSensitive(sec.psnNumber, sensitiveVisible)}`}
                                </div>
                              </div>
                              <StatusBadge label={sec.status} size="sm" />
                            </div>

                            {/* Sub-status row */}
                            {(sec.stampDutyStatus || sec.notarisationStatus) && (
                              <div className="border-t border-slate-100 px-3 py-2 flex flex-wrap gap-x-4 gap-y-1">
                                {sec.stampDutyStatus && sec.stampDutyStatus !== 'not_required' && (
                                  <span className={`text-xs ${sec.stampDutyStatus === 'complete' ? 'text-green-600' : 'text-amber-600'}`}>
                                    Stamp: {sec.stampDutyStatus}
                                  </span>
                                )}
                                {sec.notarisationStatus && sec.notarisationStatus !== 'not_required' && (
                                  <span className={`text-xs ${sec.notarisationStatus === 'complete' ? 'text-green-600' : 'text-amber-600'}`}>
                                    Notarised: {sec.notarisationStatus}
                                  </span>
                                )}
                                {/* Action buttons inline */}
                                <div className="ml-auto flex gap-1">
                                  {sec.securityType === 'sh4' && (
                                    <button className="text-xs px-2 py-0.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40" disabled={isReadOnly} title="Return after closure">Return</button>
                                  )}
                                  {sec.securityType === 'cdsl_pledge' && (
                                    <button className="text-xs px-2 py-0.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40" disabled={isReadOnly || sec.status !== 'pledged'} title={sec.status !== 'pledged' ? 'Pledge must be accepted first' : 'Unpledge after closure'}>Unpledge</button>
                                  )}
                                  <button
                                    className="text-xs px-2 py-0.5 rounded border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed"
                                    disabled={!recoveryApproved || isReadOnly}
                                    title={recoveryApproved ? 'Recovery approval recorded' : 'Approved recovery action required — locked'}
                                  >
                                    🔒 Invoke
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Compact status summary */}
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {[
                        { label: 'Blank cheque custody', status: blankChequeReady ? 'held' : 'pending' },
                        { label: 'Witness PAN / Aadhaar', status: witnessKycReady ? 'verified' : 'pending_upload' },
                        { label: app.shareMode === 'demat' ? 'Future-share pledge' : 'Share mode', status: app.shareMode === 'demat' ? (cdslReady ? 'complete' : 'pending') : 'not_required' },
                      ].map(item => (
                        <div key={item.label} className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                          <span className="text-xs text-slate-600">{item.label}</span>
                          <StatusBadge label={item.status} size="sm" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ─ Tab 3: Approvals (S35) ─ */}
                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                        <CheckCircle2 size={14} /> Final Approvals
                      </h3>
                      <StatusBadge label={approvalsComplete ? 'complete' : approvalProgressCount > 0 ? 'in_progress' : 'not_started'} size="sm" />
                    </div>

                    {/* Sequential approval stepper */}
                    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Sign-off sequence</p>
                      <StageStepper steps={[
                        { id: 'cs', label: 'CS', sublabel: 'Docs verified', state: isCSApproved ? 'completed' : 'in_progress' },
                        { id: 'credit', label: 'Credit Mgr', sublabel: 'Limits confirmed', state: isCSApproved ? (isCreditManagerApproved ? 'completed' : 'in_progress') : 'not_started' },
                        { id: 'sanction', label: 'Sanction', sublabel: 'Final approval', state: isCreditManagerApproved ? (isSanctionFinalApproved ? 'completed' : 'in_progress') : 'not_started' },
                        { id: 'finance', label: 'Finance', sublabel: 'Post-disburse', state: isSanctionFinalApproved ? (isFinanceSigned ? 'completed' : 'in_progress') : 'not_started' },
                      ]} />
                    </div>

                    {/* Readiness checks */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
                      {readinessChecks.map(check => (
                        <div key={check.label} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2">
                          <span className="text-xs font-medium text-slate-700">{check.label}</span>
                          <StatusBadge label={check.ok ? 'complete' : 'blocked'} size="sm" />
                        </div>
                      ))}
                    </div>

                    {/* Approval cards — sequential */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                      {approvalSteps.map((step, idx) => {
                        const prevComplete = idx === 0 ? true : approvalSteps[idx - 1].status;
                        const canAct = can(step.permission) && prevComplete && !step.status;
                        return (
                          <div key={step.role} className={`rounded-xl border p-4 ${step.status ? 'border-green-200 bg-green-50' : !prevComplete ? 'border-slate-100 bg-slate-50 opacity-60' : 'border-slate-200 bg-white'}`}>
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center flex-shrink-0">{step.seq}</span>
                                  {step.role}
                                </h4>
                                <p className="text-xs text-slate-500 mt-1">{step.meaning}</p>
                                {!prevComplete && <p className="text-xs text-amber-600 mt-1">Awaiting step {step.seq - 1}</p>}
                              </div>
                              <StatusBadge label={step.status ? 'complete' : prevComplete ? 'in_progress' : 'not_started'} size="sm" />
                            </div>
                            <div className="mt-3">
                              {step.status ? (
                                <div className="flex items-center gap-2 text-green-700 bg-green-100 rounded-lg px-3 py-2 text-xs">
                                  <Check size={13} /> Approval captured
                                </div>
                              ) : (
                                <button
                                  className="btn-primary text-xs disabled:opacity-50"
                                  disabled={!canAct}
                                  onClick={canAct ? step.onApprove : undefined}
                                  title={!prevComplete ? `Step ${step.seq - 1} must complete first` : !can(step.permission) ? `${step.role} only` : step.action}
                                >
                                  <Check size={13} className="mr-1.5 inline" />
                                  {step.action}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Final lock */}
                    <div className="rounded-xl border border-slate-200 p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <Lock size={14} /> Final Documentation Lock
                          </h3>
                          <p className="text-xs text-slate-500 mt-1">
                            Requires all legal actions and final sign-offs before moving to SAP / disbursement readiness.
                          </p>
                        </div>
                        <StatusBadge label={isDocComplete ? 'complete' : disbursementReady ? 'ready_for_payment' : 'blocked'} size="sm" />
                      </div>

                      {isDocComplete ? (
                        <div className="flex items-center gap-2 text-green-700 bg-green-50 rounded-lg p-3 mt-4">
                          <Check size={16} /> Documentation finalized and locked. Ready for disbursement.
                        </div>
                      ) : (
                        <div className="mt-4 space-y-3">
                          <textarea
                            rows={2}
                            value={approvalCondition}
                            onChange={e => setApprovalCondition(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Approver comments or condition to carry forward"
                          />
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            {!legalActionsComplete ? (
                              <div className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200 flex items-center gap-2">
                                <AlertTriangle size={13} />
                                {completedLegalCount}/{legalActions.length} legal documents complete
                              </div>
                            ) : !approvalsComplete ? (
                              <div className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200 flex items-center gap-2">
                                <AlertTriangle size={13} />
                                {approvalProgressCount}/4 approvals complete
                              </div>
                            ) : <div />}
                            <div className="flex flex-wrap justify-end gap-2">
                              <button className="btn-secondary text-xs disabled:opacity-50" disabled={isAuditor}>Return for Correction</button>
                              <button className="btn-secondary text-xs disabled:opacity-50" disabled={!approvalCondition || isAuditor}>Add Condition</button>
                              <button
                                className="btn-primary disabled:opacity-50"
                                disabled={!disbursementReady || !can('manage_documentation')}
                                onClick={() => setIsDocComplete(true)}
                              >
                                <Lock size={14} className="mr-1.5 inline" />
                                Mark Ready for Disbursement
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ─ Tab 4: Audit Trail ─ */}
                  <div className="p-5 space-y-4">
                    {/* Quick actions */}
                    <div className="flex flex-wrap gap-2">
                      <button className="btn-secondary text-xs disabled:opacity-50" disabled={isReadOnly}>
                        <XCircle size={12} className="mr-1 inline" /> Reject / Correction
                      </button>
                      <button className="btn-secondary text-xs disabled:opacity-50" disabled={isReadOnly}>
                        <FileSignature size={12} className="mr-1 inline" /> Request Signature
                      </button>
                      <button className="btn-secondary text-xs disabled:opacity-50" disabled={isReadOnly}>
                        <Upload size={12} className="mr-1 inline" /> Submit to CS
                      </button>
                    </div>

                    <AuditTimeline entityId={app.id} limit={8} />
                  </div>
                </Tabs>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentationHub;

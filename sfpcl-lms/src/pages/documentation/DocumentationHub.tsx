import React, { useState } from 'react';
import { FolderOpen, ChevronRight, Check, AlertTriangle, CheckCircle2, Lock, FileSignature, Landmark, Shield } from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';
import StageStepper, { Step } from '../../components/ui/StageStepper';
import DocumentChecklist from '../../components/loan/DocumentChecklist';
import { documents, loanApplications, securities } from '../../data/mockData';
import { useRole, type Permission } from '../../contexts/RoleContext';

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');

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

const DocumentationHub: React.FC<DocumentationHubProps> = ({ onOpenApplication, initialSelectedId }) => {
  const docQueue = loanApplications.filter(a =>
    ['sanctioned', 'documentation_in_progress'].includes(a.status) &&
    a.documentationStatus !== 'complete'
  );

  const initialApp = initialSelectedId ? docQueue.find(a => a.id === initialSelectedId || a.applicationNumber === initialSelectedId) : null;
  const [selected, setSelected] = useState<string | null>(
    initialApp?.id || docQueue[0]?.id || null
  );
  const [isDocComplete, setIsDocComplete] = useState(false);
  const [isCSApproved, setIsCSApproved] = useState(false);
  const [isCreditManagerApproved, setIsCreditManagerApproved] = useState(false);
  const [isSanctionFinalApproved, setIsSanctionFinalApproved] = useState(false);
  const [isFinanceSigned, setIsFinanceSigned] = useState(false);
  const [approvalCondition, setApprovalCondition] = useState('');
  const [completedLegalActions, setCompletedLegalActions] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState<'checklist' | 'legal' | 'security' | 'approvals' | 'impact'>('checklist');
  const { can } = useRole();

  const app = docQueue.find(a => a.id === selected);
  const appDocuments = documents.filter(d => d.applicationId === selected);
  const appSecurities = securities.filter(s => s.applicationId === selected);
  const legalActions = [
    { screen: 'S32', name: 'Term Sheet', owner: 'Compliance Team', status: 'pending_signature' },
    { screen: 'S33', name: 'Loan Agreement', owner: 'Compliance Team', status: 'pending_notarisation' },
    { screen: 'S28', name: 'Power of Attorney', owner: 'Company Secretary', status: 'pending_stamp' },
    { screen: 'S29', name: 'Tri-Party Agreement', owner: 'Compliance Team', status: 'pending_signature' },
    { screen: 'S30', name: 'SH-4 Physical Share Security', owner: 'Company Secretary', status: 'held' },
    { screen: 'S31', name: 'CDSL Pledge', owner: 'Company Secretary', status: 'pledged' },
    { screen: 'S34', name: 'Bank Verification / Signature Mismatch', owner: 'Senior Manager Finance', status: 'verified' },
  ];
  const completedLegalCount = completedLegalActions.length;
  const legalActionsComplete = completedLegalCount === legalActions.length;
  const approvalsComplete = isCSApproved && isCreditManagerApproved && isSanctionFinalApproved && isFinanceSigned;

  const toggleLegalAction = (screen: string) => {
    setCompletedLegalActions(actions =>
      actions.includes(screen)
        ? actions.filter(action => action !== screen)
        : [...actions, screen]
    );
  };

  const approvalProgressCount = [isCSApproved, isCreditManagerApproved, isSanctionFinalApproved, isFinanceSigned].filter(Boolean).length;
  const mandatoryChecklistClear = appDocuments.every(doc =>
    doc.requiredFlag !== 'mandatory' || ['verified', 'complete', 'notarised'].includes(doc.status)
  );

  const sectionTabs = [
    { id: 'checklist', label: 'Checklist', badge: app ? undefined : 0 },
    { id: 'legal', label: 'Legal Actions', badge: legalActions.length - completedLegalCount },
    { id: 'security', label: 'Securities', badge: appSecurities.length },
    { id: 'approvals', label: 'Approvals', badge: approvalsComplete ? 0 : 4 - approvalProgressCount },
    { id: 'impact', label: 'Impact', badge: completedLegalCount > 0 || isCreditManagerApproved || isDocComplete ? undefined : 0 },
  ] as const;
  const activeSectionIndex = sectionTabs.findIndex(tab => tab.id === activeSection);
  const activeSectionLabel = sectionTabs[activeSectionIndex]?.label || 'Checklist';
  const goToNextSection = () => {
    const next = sectionTabs[Math.min(activeSectionIndex + 1, sectionTabs.length - 1)];
    setActiveSection(next.id);
  };
  const activeStepIndexBySection = {
    checklist: 0,
    legal: 1,
    security: 2,
    approvals: 3,
    impact: 4,
  };
  const activeStepIndex = activeStepIndexBySection[activeSection];
  const stepState = (index: number, complete = false): Step['state'] => {
    if (complete || index < activeStepIndex) return 'completed';
    if (index === activeStepIndex) return 'in_progress';
    return 'not_started';
  };

  const documentationSteps: Step[] = [
    { id: 'checklist', label: 'Checklist', state: stepState(0) },
    { id: 'legal', label: 'Legal', state: stepState(1, legalActionsComplete) },
    { id: 'security', label: 'Security', state: stepState(2, appSecurities.length > 0 && activeStepIndex > 2) },
    { id: 'credit', label: 'Credit OK', state: stepState(3, isCreditManagerApproved) },
    { id: 'final', label: 'Final Lock', state: stepState(4, isDocComplete) },
  ];

  const queueStatusItems = (loanApp: typeof docQueue[number]) => [
    { label: 'Mode', value: loanApp.shareMode },
    { label: 'PoA', value: loanApp.documentationStatus === 'complete' ? 'complete' : 'pending' },
    { label: 'SH-4/CDSL', value: loanApp.shareMode === 'physical' ? 'sh4_required' : 'cdsl_required' },
    { label: 'Bank', value: loanApp.bankAccount ? 'verified' : 'pending' },
    { label: 'Owner', value: loanApp.currentOwner },
  ];

  const legalEvidenceFields = (action: typeof legalActions[number]) => {
    const complete = completedLegalActions.includes(action.screen);
    const status = (pending: string) => complete ? 'complete' : pending;
    const highValueRoute = (app?.requestedAmount || 0) > 500000;

    const fieldMap: Record<string, { label: string; value: string; status: string }[]> = {
      S28: [
        { label: 'Stamp paper number', value: 'E-STAMP-2026-0042', status: status('pending_stamp') },
        { label: 'Notary details', value: 'Notary name, registration, date', status: status('pending_notarisation') },
        { label: 'Borrower signature', value: 'Required', status: status('pending_signature') },
        { label: 'Nominee signature', value: 'Required', status: status('pending_signature') },
        { label: 'CS verification', value: 'Company Secretary', status: status('pending_cs_review') },
      ],
      S29: [
        { label: 'Subsidiary company', value: 'Configured subsidiary', status: status('drafted') },
        { label: 'Borrower / nominee signature', value: 'Required', status: status('pending_signature') },
        { label: 'Subsidiary signatory', value: 'Authorised signer', status: status('pending_signature') },
        { label: 'SFPCL signatory', value: 'Authorised signer', status: status('pending_signature') },
      ],
      S30: [
        { label: 'SH-4 reference', value: app?.shareMode === 'physical' ? 'SH4-2026-0042' : 'Not applicable for demat', status: app?.shareMode === 'physical' ? status('pending') : 'not_required' },
        { label: 'Borrower signature', value: 'Shareholder', status: app?.shareMode === 'physical' ? status('pending_signature') : 'not_required' },
        { label: 'Witness signature', value: 'Existing shareholder', status: app?.shareMode === 'physical' ? status('pending_signature') : 'not_required' },
        { label: 'Physical custody', value: 'Company Secretary', status: app?.shareMode === 'physical' ? status('held') : 'not_required' },
      ],
      S31: [
        { label: 'PRF upload', value: 'Pledge request form', status: app?.shareMode === 'demat' ? status('pending_upload') : 'not_required' },
        { label: 'PSN number', value: 'CDSL pledge sequence', status: app?.shareMode === 'demat' ? status('pending') : 'not_required' },
        { label: 'DP acceptance evidence', value: 'Depository participant confirmation', status: app?.shareMode === 'demat' ? status('pending_upload') : 'not_required' },
      ],
      S32: [
        { label: 'Signature route', value: highValueRoute ? 'CFO + two Directors' : 'CFO', status: status('pending_signature') },
        { label: 'Borrower signature', value: 'Required', status: status('pending_signature') },
        { label: 'Nominee signature', value: 'Required', status: status('pending_signature') },
      ],
      S33: [
        { label: 'Stamp paper number', value: 'E-STAMP-2026-0043', status: status('pending_stamp') },
        { label: 'Notary details', value: 'Notary name, registration, date', status: status('pending_notarisation') },
        { label: 'Borrower signature', value: 'Required', status: status('pending_signature') },
        { label: 'Witness signature', value: 'Required', status: status('pending_signature') },
      ],
      S34: [
        { label: 'Signature mismatch flag', value: 'Manual review field', status: status('pending') },
        { label: 'Bank verification letter', value: 'Bank signed / stamped', status: status('pending_upload') },
        { label: 'Borrower declaration', value: 'Non-judicial stamp alternative', status: status('pending_upload') },
      ],
    };

    return fieldMap[action.screen] || [];
  };

  const legalActionButtons = (screen: string) => {
    const actionMap: Record<string, string[]> = {
      S28: ['Generate PoA', 'Upload Signed Copy', 'Mark Stamped', 'Mark Notarised', 'Send for Correction'],
      S29: ['Generate Agreement', 'Upload Signed Agreement', 'Mark Active', 'Link Reconciliation'],
      S30: ['Generate SH-4 Checklist', 'Upload Scanned SH-4', 'Mark Original Received', 'Assign Custody', 'Return on Closure', 'Invoke After Recovery Approval'],
      S31: ['Create Pledge Task', 'Upload PRF', 'Enter PSN', 'Mark Accepted', 'Mark Rejected', 'Start Invocation Request', 'Start Unpledge Request'],
      S32: ['Generate Term Sheet', 'Preview', 'Send for Signature', 'Upload Signed Copy', 'Route to CFO / Directors', 'Mark Complete'],
      S33: ['Generate Agreement', 'Upload Signed Copy', 'Mark Stamped', 'Mark Notarised', 'Link Witness', 'Send to Checklist'],
      S34: ['Generate Bank Letter', 'Upload Bank Letter', 'Upload Declaration', 'Mark Resolved', 'Mark Unresolved and Block'],
    };

    return actionMap[screen] || [];
  };

  const requiredSecurityEvidence = [
    {
      label: app?.shareMode === 'physical' ? 'SH-4 physical custody' : 'CDSL PRF / DP evidence',
      value: app?.shareMode === 'physical' ? 'Original SH-4 and share security custody' : 'Pledge request form, PSN and DP acceptance',
      status: app?.shareMode === 'physical'
        ? (completedLegalActions.includes('S30') ? 'complete' : 'pending')
        : (completedLegalActions.includes('S31') ? 'complete' : 'pending'),
    },
    {
      label: 'Blank-dated cheque custody',
      value: 'Cheque number and custodian register reference',
      status: appSecurities.some(sec => sec.securityType === 'blank_cheque') ? 'held' : 'pending',
    },
    {
      label: 'Future-share pledge obligation',
      value: 'Additional shares to be pledged when issued',
      status: 'pending',
    },
    {
      label: 'Witness PAN / Aadhaar',
      value: 'Witness identity proof verified for security execution',
      status: 'pending_upload',
    },
  ];

  const approvalSteps: {
    role: string;
    meaning: string;
    status: boolean;
    permission: Permission;
    action: string;
    onApprove: () => void;
  }[] = [
    {
      role: 'Company Secretary',
      meaning: 'Document set, stamping, notarisation and security custody verified.',
      status: isCSApproved,
      permission: 'manage_documentation',
      action: 'Approve as CS',
      onApprove: () => setIsCSApproved(true),
    },
    {
      role: 'Credit Manager',
      meaning: 'Loan limit, checklist and credit conditions confirmed.',
      status: isCreditManagerApproved,
      permission: 'approve_credit_checklist',
      action: 'Approve as Credit Manager',
      onApprove: () => setIsCreditManagerApproved(true),
    },
    {
      role: 'Sanction Committee',
      meaning: 'Final sanction terms and documentation conditions acknowledged.',
      status: isSanctionFinalApproved,
      permission: 'approve_sanction',
      action: 'Approve as Sanction Committee',
      onApprove: () => setIsSanctionFinalApproved(true),
    },
    {
      role: 'Senior Manager – Finance',
      meaning: 'Finance sign-off after documentation gate and disbursement readiness review.',
      status: isFinanceSigned,
      permission: 'initiate_disbursement',
      action: 'Sign as Finance',
      onApprove: () => setIsFinanceSigned(true),
    },
  ];

  const impactItems = [
    {
      label: 'Borrower MP13',
      status: legalActionsComplete ? 'ready_to_sign' : 'pending_actions',
      note: legalActionsComplete ? 'All borrower-facing document actions are publishable.' : `${completedLegalCount}/${legalActions.length} legal actions complete.`,
    },
    {
      label: 'Security Register',
      status: legalActionsComplete ? 'updated' : 'in_progress',
      note: 'PoA, SH-4, CDSL, cheque and tri-party states are reflected for prototype review.',
    },
    {
      label: 'Audit Trail',
      status: completedLegalCount > 0 ? 'events_staged' : 'not_started',
      note: completedLegalCount > 0 ? 'Local audit preview records document action changes.' : 'No local action has been staged yet.',
    },
  ];
  const readinessChecks = [
    { label: 'Sanction approved', status: app?.sanctionDecision === 'approved' ? 'complete' : 'blocked' },
    {
      label: 'Mandatory checklist clear or exception approved',
      status: mandatoryChecklistClear ? 'complete' : 'blocked',
    },
    { label: 'Signature mismatch resolved', status: completedLegalActions.includes('S34') ? 'complete' : 'blocked' },
    { label: 'Security document complete', status: completedLegalActions.includes(app?.shareMode === 'physical' ? 'S30' : 'S31') ? 'complete' : 'blocked' },
    { label: 'Term Sheet and Loan Agreement signed', status: completedLegalActions.includes('S32') && completedLegalActions.includes('S33') ? 'complete' : 'blocked' },
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Documentation Hub</h1>
          <p className="text-sm text-slate-500 mt-0.5">{docQueue.length} application{docQueue.length !== 1 ? 's' : ''} pending documentation</p>
        </div>
      </div>

      {docQueue.length === 0 ? (
        <div className="card text-center py-16">
          <Check size={32} className="text-green-500 mx-auto mb-3" />
          <p className="text-slate-600 font-semibold">All documentation is complete</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card p-0 overflow-hidden lg:col-span-1">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Doc Queue ({docQueue.length})</p>
            </div>
            <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
              {docQueue.map(a => (
                <button
                  key={a.id}
                  onClick={() => {
                    setSelected(a.id);
                    setActiveSection('checklist');
                  }}
                  className={`w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors text-left ${selected === a.id ? 'bg-green-50 border-l-4 border-l-green-500' : ''}`}
                >
                  <FolderOpen size={16} className="text-amber-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900 num text-sm">{a.applicationNumber}</div>
                    <div className="text-xs text-slate-500 truncate">{a.memberName}</div>
                    <div className="text-xs text-slate-400 num">{fmt(a.requestedAmount)}</div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {queueStatusItems(a).map(item => (
                        <span key={item.label} className="text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {item.label}: {item.value}
                        </span>
                      ))}
                    </div>
                  </div>
                  <StatusBadge label={a.documentationStatus} size="sm" />
                </button>
              ))}
            </div>
          </div>

          {app && (
            <div className="lg:col-span-2 space-y-4 min-w-0">
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
                      <p className="text-xs text-slate-400 mt-0.5">SAP Code: <span className="num font-medium">{app.sapCustomerCode}</span></p>
                    )}
                  </div>
                  <button onClick={() => onOpenApplication(app.id)} className="text-xs text-green-600 hover:underline flex items-center gap-1 self-start">
                    Full view <ChevronRight size={12} />
                  </button>
                </div>
                <div className="mt-4">
                  <StageStepper steps={documentationSteps} />
                </div>
              </div>

              <div className="card p-0 overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Current Stage</p>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">{activeSectionIndex + 1}. {activeSectionLabel}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {sectionTabs[activeSectionIndex]?.badge !== undefined && sectionTabs[activeSectionIndex].badge > 0 && (
                      <span className="rounded-full bg-white border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600">
                        {sectionTabs[activeSectionIndex].badge} pending
                      </span>
                    )}
                    <span className="text-xs text-slate-500">{activeSectionIndex + 1} of {sectionTabs.length}</span>
                  </div>
                </div>

                <div className="p-5">
                  {activeSection === 'checklist' && (
                    <div>
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-semibold text-slate-900">Document Checklist</h3>
                          <p className="text-xs text-slate-500 mt-0.5">Review uploads, verification state, and disbursement blockers.</p>
                        </div>
                      </div>
                      <DocumentChecklist applicationId={app.id} />
                    </div>
                  )}

                  {activeSection === 'legal' && (
                    <div>
                      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                            <FileSignature size={14} /> Legal Document Actions
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">Complete each legal action before final documentation lock.</p>
                        </div>
                        <StatusBadge label={`${completedLegalCount}_of_${legalActions.length}_complete`} size="sm" />
                      </div>
                      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-3">
                        {legalActions.map(action => (
                          <div key={action.screen} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3 min-w-0">
                                <div className="w-9 h-9 rounded-lg bg-white border border-slate-100 flex items-center justify-center flex-shrink-0">
                                  {action.name.includes('Bank')
                                    ? <Landmark size={16} className="text-slate-500" />
                                    : action.name.includes('SH-4') || action.name.includes('CDSL')
                                      ? <Shield size={16} className="text-slate-500" />
                                      : <FileSignature size={16} className="text-slate-500" />}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <p className="text-sm font-semibold text-slate-900">{action.name}</p>
                                  </div>
                                  <p className="text-xs text-slate-400 mt-1">Owner: {action.owner}</p>
                                </div>
                              </div>
                              <StatusBadge label={completedLegalActions.includes(action.screen) ? 'complete' : action.status} size="sm" />
                            </div>
                            <div className="mt-3 border border-slate-200 rounded-lg bg-white divide-y divide-slate-100">
                              {legalEvidenceFields(action).map(field => (
                                <div key={field.label} className="flex items-center justify-between gap-3 px-3 py-2">
                                  <div className="min-w-0">
                                    <div className="text-xs font-medium text-slate-700">{field.label}</div>
                                    <div className="text-xs text-slate-400 truncate">{field.value}</div>
                                  </div>
                                  <StatusBadge label={field.status} size="sm" />
                                </div>
                              ))}
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {legalActionButtons(action.screen).map(actionLabel => (
                                <button key={actionLabel} className="btn-secondary text-xs">
                                  {actionLabel}
                                </button>
                              ))}
                            </div>
                            <div className="mt-3 flex justify-end">
                              <button
                                onClick={() => toggleLegalAction(action.screen)}
                                className="btn-secondary text-xs"
                              >
                                {completedLegalActions.includes(action.screen) ? 'Reopen' : 'Mark Complete'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeSection === 'security' && (
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-3">Security Instruments</h3>
                      <div className="border border-slate-200 rounded-lg bg-slate-50 p-3 mb-4">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Security Evidence Required</div>
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
                          {requiredSecurityEvidence.map(item => (
                            <div key={item.label} className="flex items-center justify-between gap-3 bg-white border border-slate-100 rounded-lg px-3 py-2">
                              <div className="min-w-0">
                                <div className="text-xs font-medium text-slate-700">{item.label}</div>
                                <div className="text-xs text-slate-400 truncate">{item.value}</div>
                              </div>
                              <StatusBadge label={item.status} size="sm" />
                            </div>
                          ))}
                        </div>
                      </div>
                      {appSecurities.length === 0 ? (
                        <p className="text-sm text-slate-400">No security instruments recorded.</p>
                      ) : (
                        <div className="space-y-2">
                          {appSecurities.map(sec => (
                            <div key={sec.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-slate-900">
                                  {SECURITY_TYPE_LABELS[sec.securityType] || sec.securityType}
                                </div>
                                <div className="text-xs text-slate-500 mt-0.5">
                                  Custodian: {sec.custodian || 'Unassigned'}
                                  {sec.executionDate && ` · Executed: ${sec.executionDate}`}
                                  {sec.psnNumber && ` · PSN: ${sec.psnNumber}`}
                                </div>
                                <div className="flex gap-3 mt-1 text-xs">
                                  {sec.stampDutyStatus !== undefined && sec.stampDutyStatus !== 'not_required' && (
                                    <span className={sec.stampDutyStatus === 'complete' ? 'text-green-600' : 'text-amber-600'}>
                                      Stamp: {sec.stampDutyStatus}
                                    </span>
                                  )}
                                  {sec.notarisationStatus !== undefined && sec.notarisationStatus !== 'not_required' && (
                                    <span className={sec.notarisationStatus === 'complete' ? 'text-green-600' : 'text-amber-600'}>
                                      Notarised: {sec.notarisationStatus}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <StatusBadge label={sec.status} size="sm" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeSection === 'approvals' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        {approvalSteps.map(step => (
                          <div key={step.role} className="rounded-lg border border-slate-200 p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                  <CheckCircle2 size={14} /> {step.role}
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">{step.meaning}</p>
                              </div>
                              <StatusBadge label={step.status ? 'complete' : 'pending'} size="sm" />
                            </div>
                            {step.status ? (
                              <div className="flex items-center gap-2 text-green-700 bg-green-50 rounded-lg p-3 mt-4">
                                <Check size={16} /> Approval captured in the local prototype state.
                              </div>
                            ) : (
                              <div className="mt-4">
                                {can(step.permission) ? (
                                  <button className="btn-primary" onClick={step.onApprove}>
                                    <Check size={16} className="mr-2" /> {step.action}
                                  </button>
                                ) : (
                                  <button className="btn-primary opacity-50 cursor-not-allowed" disabled title={`${step.role} only`}>
                                    <Check size={16} className="mr-2" /> {step.action}
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="rounded-lg border border-slate-200 p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                              <Lock size={14} /> Final Documentation Lock
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                              Requires all legal actions and final sign-offs before moving to SAP / disbursement readiness.
                            </p>
                          </div>
                          <StatusBadge label={isDocComplete ? 'complete' : approvalsComplete && legalActionsComplete ? 'ready_for_payment' : 'blocked'} size="sm" />
                        </div>
                        {isDocComplete ? (
                          <div className="flex items-center gap-2 text-green-700 bg-green-50 rounded-lg p-3 mt-4">
                            <Check size={16} /> Documentation finalized and locked. Ready for disbursement.
                          </div>
                        ) : (
                          <div className="mt-4 space-y-4">
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
                              {readinessChecks.map(check => (
                                <div key={check.label} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                                  <span className="text-xs font-medium text-slate-700">{check.label}</span>
                                  <StatusBadge label={check.status} size="sm" />
                                </div>
                              ))}
                            </div>
                            <textarea
                              rows={3}
                              value={approvalCondition}
                              onChange={(event) => setApprovalCondition(event.target.value)}
                              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                              placeholder="Approver comments or condition to be carried forward"
                            />
                            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                              <div className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200 flex items-center gap-2">
                                <AlertTriangle size={16} />
                                {legalActionsComplete ? `${approvalProgressCount}/4 approvals complete.` : `${completedLegalCount}/${legalActions.length} legal actions complete.`}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <button className="btn-secondary text-xs">Return for Correction</button>
                                <button className="btn-secondary text-xs" disabled={!approvalCondition}>Add Condition</button>
                                <button className="btn-secondary text-xs" disabled={!legalActionsComplete}>Submit to Next Approver</button>
                                {can('manage_documentation') ? (
                                  <button
                                    className="btn-primary disabled:opacity-50"
                                    disabled={!legalActionsComplete || !approvalsComplete || !mandatoryChecklistClear}
                                    onClick={() => setIsDocComplete(true)}
                                    title={!legalActionsComplete || !approvalsComplete || !mandatoryChecklistClear ? 'Complete legal actions, mandatory checklist items and final approvals first' : undefined}
                                  >
                                    <Lock size={16} className="mr-2" /> Mark Ready for SAP / Disbursement
                                  </button>
                                ) : (
                                  <button className="btn-primary opacity-50 cursor-not-allowed" disabled title="Company Secretary or Compliance team only">
                                    <Lock size={16} className="mr-2" /> Mark Ready for SAP / Disbursement
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeSection === 'impact' && (
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-3">Prototype Workflow Impact</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {impactItems.map(item => (
                          <div key={item.label} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-medium text-slate-800">{item.label}</p>
                              <StatusBadge label={item.status} size="sm" />
                            </div>
                            <p className="text-xs text-slate-500 mt-2">{item.note}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                          <div>
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Deficiency / Correction Actions</div>
                            <p className="text-xs text-slate-500 mt-1">
                              Use these local actions to represent documentation deficiency, borrower correction and CS submission paths.
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button className="btn-secondary text-xs">Raise Documentation Deficiency</button>
                            <button className="btn-secondary text-xs">Request Borrower Correction</button>
                            <button className="btn-secondary text-xs">Submit to Company Secretary</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      const previous = sectionTabs[Math.max(activeSectionIndex - 1, 0)];
                      setActiveSection(previous.id);
                    }}
                    disabled={activeSectionIndex === 0}
                    className="btn-secondary disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    onClick={goToNextSection}
                    disabled={activeSectionIndex === sectionTabs.length - 1}
                    className="btn-primary"
                  >
                    Next Stage
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentationHub;

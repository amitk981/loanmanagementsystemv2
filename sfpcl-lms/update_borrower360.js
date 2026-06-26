const fs = require('fs');

const content = fs.readFileSync('/Users/amitkallapa/Downloads/New Loan Management Designs/sfpcl-lms/src/pages/members/Borrower360.tsx', 'utf-8');

let newContent = content;

newContent = newContent.replace(
  "import { members, loanApplications, loanAccounts, repayments } from '../../data/mockData';",
  "import { members, loanApplications, loanAccounts, repayments, currentUser, auditEvents } from '../../data/mockData';"
);

newContent = newContent.replace(
  /const communicationsLog = \[([\s\S]*?)\];/,
  `const communicationsLog = [
  { date: '2026-06-15', type: 'SMS', direction: 'Outbound', message: 'Repayment reminder: ₹1,05,000 due on 30 Jun 2026. Please pay before due date to avoid overdue charges.', sentBy: 'System' },
  { date: '2026-06-01', type: 'Email', direction: 'Outbound', message: 'Loan sanction approval notification with sanction letter attached.', sentBy: 'Priya Kulkarni' },
  { date: '2026-05-22', type: 'Call', direction: 'Inbound', message: 'Borrower called to query about interest calculation. Clarified principal-first allocation.', sentBy: 'Priya Kulkarni' },
  { date: '2026-04-10', type: 'Letter', direction: 'Outbound', message: 'Hard copy of Loan Agreement dispatched by registered post. Tracking: RM123456789IN.', sentBy: 'Aarti Desai' },
];`
);

newContent = newContent.replace(
  /const riskExceptions = \[([\s\S]*?)\];/,
  `const riskExceptions = [
  { type: 'Amount Exception', description: 'LO00000042: Requested ₹4,50,000 exceeds eligible limit ₹90,000.', severity: 'high', status: 'pending', date: '2026-06-14', linkedId: 'LO00000042' },
  { type: 'KYC Re-verification', description: 'Annual KYC re-verification due — Borrower needs updated documents', severity: 'medium', status: 'open', date: '2026-06-01' },
];`
);

const oldComponentSetup = `const Borrower360: React.FC<Borrower360Props> = ({ memberId, onBack, onOpenApplication, onOpenLoanAccount }) => {
  const member = members.find(m => m.id === memberId) || members[0];
  const memberApps = loanApplications.filter(a => a.memberId === member.id);
  const memberLoans = loanAccounts.filter(l => l.memberId === member.id);
  const memberRepayments = repayments.filter(r => memberLoans.some(l => l.id === r.loanAccountId));
  const [activeTab, setActiveTab] = useState(0);

  const isFPC = member.memberType === 'fpc';
  const totalOutstanding = memberLoans.reduce((s, l) => s + l.outstandingPrincipal, 0);
  const totalAccruedInterest = memberLoans.reduce((s, l) => s + l.accruedInterest, 0);
  const hasOverdue = memberLoans.some(l => l.status === 'overdue' || l.status === 'grace_period');

  const TABS = [
    { id: 'summary',     label: 'Borrower Summary' },
    { id: 'applications', label: 'Applications', badge: memberApps.length || undefined },
    { id: 'loans',       label: 'Loan Accounts', badge: memberLoans.filter(l => l.status === 'active' || l.status === 'overdue').length || undefined },
    { id: 'repayments',  label: 'Repayment History' },
    { id: 'security',    label: 'Security Instruments' },
    { id: 'docs',        label: 'Documentation' },
    { id: 'comms',       label: 'Communications' },
    { id: 'risk',        label: 'Risk & Exceptions', badge: riskExceptions.length || undefined },
  ];`;

const newComponentSetup = `const Borrower360: React.FC<Borrower360Props> = ({ memberId, onBack, onOpenApplication, onOpenLoanAccount }) => {
  const member = members.find(m => m.id === memberId) || members[0];
  const memberApps = loanApplications.filter(a => a.memberId === member.id);
  const memberLoans = loanAccounts.filter(l => l.memberId === member.id);
  const memberRepayments = repayments.filter(r => memberLoans.some(l => l.id === r.loanAccountId));
  const memberAuditEvents = auditEvents.filter(e => 
    (e.entityType === 'member' && e.entityId === member.id) ||
    (e.entityType === 'application' && memberApps.some(a => a.id === e.entityId)) ||
    (e.entityType === 'loan_account' && memberLoans.some(l => l.id === e.entityId))
  ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const [activeTab, setActiveTab] = useState(0);

  const isFPC = member.memberType === 'fpc';
  const totalOutstanding = memberLoans.reduce((s, l) => s + l.outstandingPrincipal, 0);
  const totalAccruedInterest = memberLoans.reduce((s, l) => s + l.accruedInterest, 0);
  const overdueLoan = memberLoans.find(l => l.status === 'overdue');
  const hasOverdue = !!overdueLoan;

  const activeLoansCount = memberLoans.filter(l => ['active', 'overdue', 'grace_period', 'recovery_in_progress'].includes(l.status)).length;
  const overdueLoansCount = memberLoans.filter(l => ['overdue', 'grace_period', 'recovery_in_progress'].includes(l.status)).length;
  const openAppsCount = memberApps.filter(a => !['rejected_credit','rejected_sanction','disbursed','closed'].includes(a.status)).length;
  const maxDpd = Math.max(0, ...memberLoans.map(l => l.dpd || 0));

  const kycBadgeText = (member.kycStatus === 'verified' && riskExceptions.some(e => e.type === 'KYC Re-verification' && e.status === 'open'))
    ? 'Verified · Re-KYC due'
    : member.kycStatus === 'rekyc_due' ? 'Re-KYC Due' : member.kycStatus;

  const defaultBadgeText = member.defaultStatus === 'no_default' && maxDpd > 0
    ? \`No formal default · DPD \${maxDpd} overdue\`
    : member.defaultStatus === 'no_default' ? undefined : (maxDpd > 0 ? \`\${member.defaultStatus.replace(/_/g, ' ')} · DPD \${maxDpd}\` : member.defaultStatus.replace(/_/g, ' '));

  const canAddComm = ['credit_manager', 'accounts', 'sales_support', 'admin', 'field_officer', 'collection_officer'].includes(currentUser.role);
  const canExport = ['credit_manager', 'accounts', 'admin', 'cfo'].includes(currentUser.role);
  const canApproveException = ['cfo', 'director', 'sanction_committee', 'admin'].includes(currentUser.role);

  const TABS = [
    { id: 'summary',     label: 'Member Summary' },
    { id: 'applications', label: 'Applications', badge: memberApps.length || undefined },
    { id: 'loans',       label: 'Loan Accounts', badge: activeLoansCount || undefined },
    { id: 'repayments',  label: 'Repayment History' },
    { id: 'security',    label: 'Security Instruments' },
    { id: 'docs',        label: 'Documentation' },
    { id: 'comms',       label: 'Communications' },
    { id: 'risk',        label: 'Risk & Exceptions', badge: riskExceptions.length || undefined },
    { id: 'audit',       label: 'Audit Trail' },
  ];`;

newContent = newContent.replace(oldComponentSetup, newComponentSetup);

newContent = newContent.replace(
  '<span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">Borrower 360</span>',
  '<span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">Member 360</span>'
);

newContent = newContent.replace(
  '<StatusBadge label={member.kycStatus} size="sm" />\n                {member.defaultStatus !== \'no_default\' && <StatusBadge label={member.defaultStatus} size="sm" />}',
  '<StatusBadge label={kycBadgeText} size="sm" />\n                {defaultBadgeText && <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded uppercase">{defaultBadgeText}</span>}'
);

newContent = newContent.replace(
  '{hasOverdue && (\n        <AlertBanner type="error" title="Overdue Loan — Recovery Risk"\n          message="One or more loan accounts are overdue. DPD monitoring active. Reminder workflow should be initiated." />\n      )}',
  `{hasOverdue && overdueLoan && (
        <AlertBanner type="error" title="Overdue Loan — Reminder Due"
          message={\`\${overdueLoan.accountNumber} is overdue by \${overdueLoan.dpd} days. Next action: repayment reminder by Credit/Accounts.\`} />
      )}`
);

const oldChips = `      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total Outstanding', value: fmt(totalOutstanding), color: 'bg-slate-50 text-slate-900' },
          { label: 'Accrued Interest', value: fmt(totalAccruedInterest), color: 'bg-amber-50 text-amber-900' },
          { label: 'Active Loans', value: String(memberLoans.filter(l => l.status === 'active').length), color: 'bg-green-50 text-green-900' },
          { label: 'Overdue Loans', value: String(memberLoans.filter(l => l.status === 'overdue').length), color: memberLoans.some(l => l.status === 'overdue') ? 'bg-red-50 text-red-900' : 'bg-slate-50 text-slate-900' },
          { label: 'Open Applications', value: String(memberApps.filter(a => !['rejected_credit','rejected_sanction'].includes(a.status)).length), color: 'bg-slate-50 text-slate-900' },
          { label: 'KYC Status', value: member.kycStatus.replace(/_/g, ' '), color: member.kycStatus === 'verified' ? 'bg-green-50 text-green-800' : 'bg-amber-50 text-amber-800' },
        ].map(chip => (
          <div key={chip.label} className={\`rounded-xl p-3 border border-slate-100 \${chip.color}\`}>
            <p className="text-lg font-bold">{chip.value}</p>
            <p className="text-xs opacity-70 mt-0.5">{chip.label}</p>
          </div>
        ))}
      </div>`;

const newChips = `      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {[
          { label: 'Active Loan Accounts', value: String(activeLoansCount), color: 'bg-slate-50 text-slate-900' },
          { label: 'Overdue Loan Accounts', value: String(overdueLoansCount), color: overdueLoansCount > 0 ? 'bg-red-50 text-red-900' : 'bg-slate-50 text-slate-900' },
          { label: 'Open Application', value: String(openAppsCount), color: 'bg-slate-50 text-slate-900' },
          { label: 'KYC / Re-KYC', value: member.kycStatus === 'rekyc_due' ? 'Re-KYC Due' : (member.kycStatus === 'verified' && riskExceptions.some(e => e.type === 'KYC Re-verification' && e.status === 'open') ? 'Re-KYC Due' : kycBadgeText), color: (member.kycStatus === 'rekyc_due' || riskExceptions.some(e => e.type === 'KYC Re-verification' && e.status === 'open')) ? 'bg-amber-50 text-amber-800' : 'bg-green-50 text-green-800' },
          { label: 'Shareholding', value: \`\${member.sharesHeld} \${member.shareMode}\`, color: 'bg-slate-50 text-slate-900' },
          { label: 'Open Exceptions', value: String(riskExceptions.filter(e => e.status === 'open' || e.status === 'pending').length), color: 'bg-slate-50 text-slate-900' },
        ].map(chip => (
          <div key={chip.label} className={\`rounded-xl p-3 border border-slate-100 \${chip.color}\`}>
            <p className="text-lg font-bold">{chip.value}</p>
            <p className="text-xs opacity-70 mt-0.5">{chip.label}</p>
          </div>
        ))}
      </div>`;
newContent = newContent.replace(oldChips, newChips);

const oldProfile = `            <h3 className="font-semibold text-slate-800">Borrower Profile</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['Member ID', member.id.toUpperCase()],
                ['Folio Number', member.folioNumber],
                ['Member Type', isFPC ? 'FPC' : 'Individual Farmer'],
                ['Shares Held', \`\${member.sharesHeld.toLocaleString('en-IN')} (\${member.shareMode})\`],
                ['Mobile', member.mobile],
                ['Email', member.email],
                ['Active Status', member.activeStatus],
                ['Default Status', member.defaultStatus.replace(/_/g, ' ')],
              ].map(([k, v]) => (
                <div key={k} className="bg-slate-50 rounded-lg p-2">
                  <p className="text-xs text-slate-400">{k}</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">{v}</p>
                </div>
              ))}
            </div>`;

const newProfile = `            <h3 className="font-semibold text-slate-800">Member Profile</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['Member ID', member.id.toUpperCase()],
                ['Date of Membership', member.registeredOn ? new Date(member.registeredOn).toLocaleDateString('en-IN') : '—'],
                ['Active Member Basis', 'Regular Trading / Supply'],
                ['Active Status', member.activeStatus],
                ['Active Status Reason', member.activeStatus === 'active' ? 'Meets supply criteria' : 'N/A'],
                ['Shareholding Mode', member.shareMode],
                ['Share Valuation Applied', '₹100 per share'],
                ['Current DPD / Default', defaultBadgeText || 'No default'],
              ].map(([k, v]) => (
                <div key={k} className="bg-slate-50 rounded-lg p-2">
                  <p className="text-xs text-slate-400">{k}</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">{v}</p>
                </div>
              ))}
            </div>`;
newContent = newContent.replace(oldProfile, newProfile);

newContent = newContent.replace(
  '<button className="btn-secondary text-xs flex-1">Generate Statement</button>\n              <button className="btn-secondary text-xs flex-1">Add Communication</button>',
  '{canExport && <button className="btn-secondary text-xs flex-1">Generate Statement</button>}\n              {canAddComm && <button className="btn-secondary text-xs flex-1">Add Communication</button>}'
);

newContent = newContent.replace(
  '<button className="flex items-center gap-1 text-xs text-green-700 hover:underline">\n              <Download size={12} /> Export\n            </button>',
  '{canExport && (\n              <button className="flex items-center gap-1 text-xs text-green-700 hover:underline">\n                <Download size={12} /> Export\n              </button>\n            )}'
);

newContent = newContent.replace(
  '{sec.invocable && (\n                <span className="text-xs text-amber-600 font-medium bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg">Invocable</span>\n              )}',
  '{sec.invocable && (\n                <span className="text-xs text-slate-600 font-medium bg-slate-100 border border-slate-200 px-2 py-1 rounded-lg flex-shrink-0">Locked — approval required</span>\n              )}'
);

newContent = newContent.replace(
  '<h3 className="font-semibold text-slate-800">Documentation Status</h3>',
  \`<h3 className="font-semibold text-slate-800">KYC & Documentation Status</h3>
          <p className="text-xs text-slate-500 mt-1 mb-3">
            Linked records: {memberApps.map(a => a.applicationNumber).join(' · ')} {memberLoans.length > 0 ? '· ' + memberLoans.map(l => l.accountNumber).join(' · ') : ''}
          </p>\`
);

newContent = newContent.replace(
  '<button className="flex items-center gap-1 text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition-colors">\n              <MessageSquare size={12} /> Add Entry\n            </button>',
  `{canAddComm && (
              <button className="flex items-center gap-1 text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition-colors">
                <MessageSquare size={12} /> Add Entry
              </button>
            )}`
);

const oldRiskCard = `<p className="text-sm font-semibold text-slate-900">{ex.type}</p>
                    <StatusBadge label={ex.status} size="sm" />
                    <span className={\`text-xs font-semibold uppercase px-1.5 py-0.5 rounded \${ex.severity === 'high' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}\`}>
                      {ex.severity}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{ex.description}</p>
                  <p className="text-xs text-slate-400 mt-1">Flagged: {new Date(ex.date).toLocaleDateString('en-IN')}</p>
                </div>`;

const newRiskCard = `<p className="text-sm font-semibold text-slate-900">{ex.type}</p>
                    {ex.linkedId && <span className="text-xs font-mono text-slate-500">{ex.linkedId}</span>}
                    <StatusBadge label={ex.status} size="sm" />
                    <span className={\`text-xs font-semibold uppercase px-1.5 py-0.5 rounded \${ex.severity === 'high' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}\`}>
                      {ex.severity}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{ex.description}</p>
                  <p className="text-xs text-slate-400 mt-1">Flagged: {new Date(ex.date).toLocaleDateString('en-IN')}</p>
                  {canApproveException && ex.status === 'pending' && (
                    <div className="flex gap-2 mt-2">
                      <button className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded">Approve</button>
                      <button className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded">Reject</button>
                    </div>
                  )}
                </div>`;
newContent = newContent.replace(oldRiskCard, newRiskCard);

const auditTabContent = `
        {/* ── Tab 8: Audit Trail ── */}
        <div className="card p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">Audit Trail</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {memberAuditEvents.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">No audit records found.</div>
            ) : memberAuditEvents.map((e, i) => (
              <div key={i} className="flex gap-4 px-6 py-4 hover:bg-slate-50">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <History size={14} className="text-slate-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">{e.eventType}</p>
                  <p className="text-sm text-slate-600 mt-0.5">
                    {e.actorName} ({e.actorRole.replace(/_/g, ' ')})
                    {e.previousState && e.newState && \` changed state from \${e.previousState} to \${e.newState}\`}
                  </p>
                  {e.comment && <p className="text-xs text-slate-500 mt-1">{e.comment}</p>}
                  {e.reason && <p className="text-xs text-red-500 mt-1">{e.reason}</p>}
                  <p className="text-xs text-slate-400 mt-1">{new Date(e.timestamp).toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Tabs>`;
newContent = newContent.replace('</Tabs>', auditTabContent);

fs.writeFileSync('/Users/amitkallapa/Downloads/New Loan Management Designs/sfpcl-lms/src/pages/members/Borrower360.tsx', newContent);
console.log('Borrower360.tsx updated successfully');

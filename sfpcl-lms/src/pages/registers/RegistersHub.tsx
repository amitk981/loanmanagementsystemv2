import React, { useState } from 'react';
import { BookOpen, FileText, Scale, Gavel, AlertOctagon, RotateCcw, Archive, Stamp, Search, Download, History, Filter } from 'lucide-react';
import Tabs from '../../components/ui/Tabs';
import StatusBadge from '../../components/ui/StatusBadge';
import { loanApplications, loanAccounts, securities, members, complianceRecords, auditEvents } from '../../data/mockData';

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');

const REGISTER_TABS = [
  { id: 'loan_register',      label: 'Loan Account Register' },
  { id: 'loan_request_register', label: 'Loan Request Register' },
  { id: 'sanction_register',  label: 'Credit Sanction Register' },
  { id: 'security_register',  label: 'Security Register' },
  { id: 'exception_register', label: 'Exception Register' },
  { id: 'member_register',    label: 'Member Register' },
  { id: 'compliance_register', label: 'Compliance Register' },
  { id: 'stamp_duty',         label: 'Stamp Duty Register' },
  { id: 'audit_log',          label: 'Audit Log Explorer' },
  { id: 'grievance_register', label: 'Grievance Register' },
  { id: 'recovery_log',       label: 'Recovery Log' },
  { id: 'blank_cheque_register', label: 'Blank-Dated Cheque Register' },
  { id: 'sh4_register',       label: 'SH-4 Register' },
  { id: 'cdsl_register',      label: 'CDSL Pledge Register' },
  { id: 'sap_register',       label: 'SAP Customer Code Register' },
  { id: 'disbursement_register', label: 'Disbursement Register' },
  { id: 'repayment_register', label: 'Repayment Register' },
  { id: 'interest_invoice_register', label: 'Interest Invoice Register' },
  { id: 'accrual_register',   label: 'Accrual Register' },
  { id: 'dpd_register',       label: 'DPD / Monitoring Register' },
  { id: 'noc_register',       label: 'NOC / Closure Register' },
  { id: 'archive_register',   label: 'Archive Register' },
  { id: 'sop_change_register', label: 'SOP Change Register' },
];

const RegistersHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [auditSearch, setAuditSearch] = useState('');
  const [auditRoleFilter, setAuditRoleFilter] = useState('all');
  const [auditEntityFilter, setAuditEntityFilter] = useState('all');
  const [auditDateFrom, setAuditDateFrom] = useState('');
  const [auditDateTo, setAuditDateTo] = useState('');

  const exceptions = loanApplications.filter(a => a.isException);
  const sanctionedApps = loanApplications.filter(a => a.sanctionDecision === 'approved');

  // Stamp duty data
  const stampDutyRecords = [
    { doc: 'Power of Attorney (PoA)', appNo: 'LO00000042', borrower: 'Ganesh Thorat', stampDutyAmt: 500, paidOn: '2024-09-18', status: 'paid', notarised: true, custodian: 'Company Secretary', challanNo: 'MSFM2024082100012' },
    { doc: 'SH-4 Transfer Form', appNo: 'LO00000042', borrower: 'Ganesh Thorat', stampDutyAmt: 200, paidOn: '2024-09-15', status: 'paid', notarised: false, custodian: 'Company Secretary', challanNo: 'MSFM2024082100013' },
    { doc: 'Power of Attorney (PoA)', appNo: 'LO00000035', borrower: 'Sunita Bhosale', stampDutyAmt: 500, paidOn: '2026-04-22', status: 'paid', notarised: true, custodian: 'Company Secretary', challanNo: 'MSFM2026042200001' },
    { doc: 'Loan Agreement', appNo: 'LO00000047', borrower: 'Vijay Deshmukh', stampDutyAmt: 300, paidOn: null, status: 'pending', notarised: false, custodian: null, challanNo: null },
  ];

  // Filtered audit events
  const filteredAudit = auditEvents.filter(ev => {
    const matchSearch = !auditSearch ||
      ev.actorName.toLowerCase().includes(auditSearch.toLowerCase()) ||
      ev.entityId.toLowerCase().includes(auditSearch.toLowerCase()) ||
      ev.eventType.toLowerCase().includes(auditSearch.toLowerCase());
    const matchRole = auditRoleFilter === 'all' || ev.actorRole === auditRoleFilter;
    const matchEntity = auditEntityFilter === 'all' || ev.entityType === auditEntityFilter;
    const matchFrom = !auditDateFrom || ev.timestamp >= auditDateFrom;
    const matchTo = !auditDateTo || ev.timestamp <= auditDateTo + 'T23:59:59Z';
    return matchSearch && matchRole && matchEntity && matchFrom && matchTo;
  });

  const supplementalRegisters = [
    {
      title: 'Blank-Dated Cheque Register',
      subtitle: 'Cheque custody, return and invocation records',
      headers: ['Cheque ID', 'Application', 'Borrower', 'Bank', 'Custody', 'Status', 'Return / Invocation'],
      rows: [
        ['CHQ-2024-042', 'LO00000042', 'Ganesh Thorat', 'HDFC Bank', 'Company Secretary', 'held', 'Pending closure'],
        ['CHQ-2025-035', 'LO00000035', 'Kisan FPC Ltd', 'Bank of Maharashtra', 'Company Secretary', 'invocation_pending', 'Recovery approved'],
      ],
    },
    {
      title: 'SH-4 Register',
      subtitle: 'Physical share transfer forms held for security',
      headers: ['SH-4 ID', 'Application', 'Borrower', 'Shares', 'Execution Date', 'Custodian', 'Status'],
      rows: [
        ['SH4-2024-042', 'LO00000042', 'Ganesh Thorat', '5', '2024-09-15', 'Company Secretary', 'held'],
        ['SH4-2023-021', 'LO00000021', 'Ganesh Thorat', '3', '2022-09-14', 'Company Secretary', 'returned'],
      ],
    },
    {
      title: 'CDSL Pledge Register',
      subtitle: 'Demat pledge creation, invocation and unpledge tracking',
      headers: ['Pledge ID', 'Application', 'Borrower', 'PSN', 'BO ID', 'Status', 'Unpledge Date'],
      rows: [
        ['CDSL-2026-00234', 'LO00000035', 'Kisan FPC Ltd', 'PSN-00234', '12081600XXXX2234', 'pledged', '—'],
        ['CDSL-2025-00112', 'LO00000028', 'Vijay Patil', 'PSN-00112', '12081600XXXX1188', 'unpledged', '2025-05-14'],
      ],
    },
    {
      title: 'SAP Customer Code Register',
      subtitle: 'SAP customer profile request and confirmation records',
      headers: ['Request ID', 'Application', 'Borrower', 'Requested On', 'SAP Code', 'Status', 'Confirmed By'],
      rows: [
        ['SAPR-2024-042', 'LO00000042', 'Ganesh Thorat', '2024-09-20', 'SAP-240042', 'created', 'Senior Manager Finance'],
        ['SAPR-2026-047', 'LO00000047', 'Vijay Deshmukh', '2026-06-18', '—', 'pending', '—'],
      ],
    },
    {
      title: 'Disbursement Register',
      subtitle: 'Payment initiation, bank authorisation and UTR evidence',
      headers: ['Advice ID', 'Loan', 'Borrower', 'Amount', 'Initiated', 'UTR', 'Status'],
      rows: [
        ['DA-2024-042', 'LO00000042', 'Ganesh Thorat', fmt(500000), '2024-09-22', 'UTR2409220042', 'completed'],
        ['DA-2026-047', 'LO00000047', 'Vijay Deshmukh', fmt(450000), '—', '—', 'readiness_pending'],
      ],
    },
    {
      title: 'Repayment Register',
      subtitle: 'Repayment receipts, channels and allocation status',
      headers: ['Receipt ID', 'Loan', 'Borrower', 'Amount', 'Channel', 'UTR', 'Allocation'],
      rows: [
        ['RCP-2025-042-03', 'LO00000042', 'Ganesh Thorat', fmt(105000), 'Direct NEFT', 'UTR2506290042', 'principal_first'],
        ['RCP-2025-044-02', 'LO00000044', 'Sunita Kamble', fmt(52000), 'Subsidiary Deduction', 'SUB-APR-044', 'principal_first'],
      ],
    },
    {
      title: 'Interest Invoice Register',
      subtitle: 'Annual borrower interest invoices and payment status',
      headers: ['Invoice', 'Loan', 'Borrower', 'Period', 'Amount', 'Due By', 'Status'],
      rows: [
        ['INV-2025-001', 'LO00000042', 'Ganesh Thorat', 'FY 2024-25', fmt(36000), '2025-04-30', 'sent'],
        ['INV-2025-003', 'LO00000038', 'Malti Shinde', 'FY 2024-25', fmt(25200), '2025-04-30', 'overdue'],
      ],
    },
    {
      title: 'Accrual Register',
      subtitle: 'Monthly and quarterly interest accrual postings',
      headers: ['Accrual ID', 'Loan', 'Borrower', 'Period', 'Principal', 'Accrued', 'SAP Status'],
      rows: [
        ['ACR-2025-Q2-042', 'LO00000042', 'Ganesh Thorat', 'Q2 FY 2025-26', fmt(350000), fmt(10543), 'pending'],
        ['ACR-2025-Q2-038', 'LO00000038', 'Malti Shinde', 'Q2 FY 2025-26', fmt(180000), fmt(6273), 'pending'],
      ],
    },
    {
      title: 'DPD / Monitoring Register',
      subtitle: 'Delinquency bucket and reminder tracking',
      headers: ['Loan', 'Borrower', 'DPD', 'Bucket', 'Last Reminder', 'Next Action', 'Owner'],
      rows: [
        ['LO00000042', 'Ganesh Thorat', '45', '31-60', '2025-06-10', 'Grace review', 'Credit Manager'],
        ['LO00000038', 'Malti Shinde', '95', '91-365', '2025-06-15', 'Non-payment note', 'Credit Manager'],
      ],
    },
    {
      title: 'NOC / Closure Register',
      subtitle: 'Closure readiness, NOC issue and security return tracking',
      headers: ['NOC ID', 'Loan', 'Borrower', 'Balance', 'NOC Status', 'Security Return', 'Archive'],
      rows: [
        ['NOC-2025-042', 'LO00000031', 'Asha Bhosale', fmt(0), 'ready', 'pending', 'pending'],
        ['NOC-2025-025', 'LO00000025', 'Radha Kisan Org', fmt(0), 'issued', 'complete', 'archived'],
      ],
    },
    {
      title: 'Archive Register',
      subtitle: 'Closed loan file archive and retention records',
      headers: ['Archive ID', 'Loan', 'Borrower', 'Closed On', 'Location', 'Retention Until', 'Status'],
      rows: [
        ['ARC-2025-025', 'LO00000025', 'Radha Kisan Org', '2025-03-28', 'Cabinet 3, Row 2', '2033-03-28', 'archived'],
        ['ARC-2023-021', 'LO00000021', 'Ganesh Thorat', '2023-03-20', 'Cabinet 1, Row 4', '2031-03-20', 'archived'],
      ],
    },
    {
      title: 'SOP Change Register',
      subtitle: 'Policy/SOP revisions and Board approval tracking',
      headers: ['Change ID', 'Area', 'Requested By', 'Requested On', 'Approval', 'Effective Date', 'Status'],
      rows: [
        ['SOP-CHG-001', 'Loan threshold matrix', 'CFO', '2026-05-12', 'Board pending', '—', 'under_review'],
        ['SOP-CHG-002', 'KYC refresh cycle', 'Company Secretary', '2026-04-08', 'Approved', '2026-06-01', 'active'],
      ],
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen size={20} className="text-green-600" />
            SOP Registers
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">All statutory and internal registers · 8-year retention policy</p>
        </div>
        <button className="btn-secondary flex items-center gap-2 text-sm">
          <Archive size={14} />
          Export Register
        </button>
      </div>

      <Tabs tabs={REGISTER_TABS} activeIndex={activeTab} onChange={setActiveTab}>
        {/* Tab 0: Loan Register */}
        <div className="card p-0 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <FileText size={14} className="text-green-600" /> Loan Register
              </p>
              <p className="text-xs text-slate-500 mt-0.5">All loan accounts — {loanAccounts.length} records</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="table-header text-left">Account No.</th>
                  <th className="table-header text-left">Member</th>
                  <th className="table-header text-right">Disbursed</th>
                  <th className="table-header text-right">Outstanding</th>
                  <th className="table-header text-right">Rate</th>
                  <th className="table-header text-left">Status</th>
                  <th className="table-header text-left">SAP Code</th>
                  <th className="table-header text-right">DPD</th>
                  <th className="table-header text-left">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loanAccounts.map(l => (
                  <tr key={l.id} className="hover:bg-slate-50">
                    <td className="table-cell num font-semibold text-green-700">{l.accountNumber}</td>
                    <td className="table-cell font-medium">{l.memberName}</td>
                    <td className="table-cell text-right num">{fmt(l.disbursedAmount)}</td>
                    <td className="table-cell text-right num font-semibold">{fmt(l.outstandingPrincipal)}</td>
                    <td className="table-cell text-right">{l.interestRate}%</td>
                    <td className="table-cell"><StatusBadge label={l.status} size="sm" /></td>
                    <td className="table-cell num text-slate-600">{l.sapCustomerCode}</td>
                    <td className="table-cell text-right">
                      <span className={`font-bold num ${l.dpd > 90 ? 'text-red-600' : l.dpd > 0 ? 'text-amber-600' : 'text-green-600'}`}>{l.dpd}</span>
                    </td>
                    <td className="table-cell">{new Date(l.repaymentDueDate).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tab 1: Loan Request Register */}
        <div className="card p-0 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <FileText size={14} className="text-green-600" /> Loan Request Register
              </p>
              <p className="text-xs text-slate-500 mt-0.5">All submitted and draft loan requests before account creation — {loanApplications.length} records</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="table-header text-left">Application No.</th>
                  <th className="table-header text-left">Member</th>
                  <th className="table-header text-left">Type</th>
                  <th className="table-header text-right">Requested</th>
                  <th className="table-header text-right">Eligible</th>
                  <th className="table-header text-left">Purpose</th>
                  <th className="table-header text-left">Status</th>
                  <th className="table-header text-left">Owner</th>
                  <th className="table-header text-left">Exception</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loanApplications.map(app => (
                  <tr key={app.id} className={`hover:bg-slate-50 ${app.isException ? 'bg-violet-50/30' : ''}`}>
                    <td className="table-cell num font-semibold text-green-700">{app.applicationNumber}</td>
                    <td className="table-cell font-medium">{app.memberName}</td>
                    <td className="table-cell capitalize">{app.memberType.replace('_', ' ')}</td>
                    <td className="table-cell text-right num">{fmt(app.requestedAmount)}</td>
                    <td className="table-cell text-right num">{fmt(app.eligibleAmount)}</td>
                    <td className="table-cell capitalize">{app.purpose.replace(/_/g, ' ')}</td>
                    <td className="table-cell"><StatusBadge label={app.status} size="sm" /></td>
                    <td className="table-cell text-slate-600">{app.currentOwner}</td>
                    <td className="table-cell">
                      {app.isException ? (
                        <span className="flex items-center gap-1 text-xs text-violet-700">
                          <AlertOctagon size={12} /> Yes
                        </span>
                      ) : (
                        <span className="text-xs text-green-600">No</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tab 2: Credit Sanction Register */}
        <div className="card p-0 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Gavel size={14} className="text-green-600" /> Credit Sanction Register
            </p>
            <p className="text-xs text-slate-500 mt-0.5">All sanctioned loan applications — {sanctionedApps.length} records</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="table-header text-left">Application No.</th>
                  <th className="table-header text-left">Member</th>
                  <th className="table-header text-right">Sanctioned Amount</th>
                  <th className="table-header text-left">Decision</th>
                  <th className="table-header text-left">Sanctioned On</th>
                  <th className="table-header text-left">Sanctioned By</th>
                  <th className="table-header text-left">Exception</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sanctionedApps.map(app => (
                  <tr key={app.id} className="hover:bg-slate-50">
                    <td className="table-cell num font-semibold text-green-700">{app.applicationNumber}</td>
                    <td className="table-cell font-medium">{app.memberName}</td>
                    <td className="table-cell text-right num">{fmt(app.requestedAmount)}</td>
                    <td className="table-cell">
                      <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full capitalize">
                        {app.sanctionDecision}
                      </span>
                    </td>
                    <td className="table-cell">{app.sanctionedAt ? new Date(app.sanctionedAt).toLocaleDateString('en-IN') : '—'}</td>
                    <td className="table-cell text-slate-600">CFO + {app.requestedAmount > 500000 ? '2 Directors' : '1 Director'}</td>
                    <td className="table-cell">
                      {app.isException ? (
                        <span className="flex items-center gap-1 text-xs text-violet-700">
                          <AlertOctagon size={12} /> Yes
                        </span>
                      ) : (
                        <span className="text-xs text-green-600">No</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tab 2: Security Register */}
        <div className="card p-0 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Scale size={14} className="text-green-600" /> Security Register
            </p>
            <p className="text-xs text-slate-500 mt-0.5">All collateral and security instruments — {securities.length} records</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="table-header text-left">Instrument</th>
                  <th className="table-header text-left">Application</th>
                  <th className="table-header text-left">Status</th>
                  <th className="table-header text-left">Execution Date</th>
                  <th className="table-header text-left">Custodian</th>
                  <th className="table-header text-left">Stamp Duty</th>
                  <th className="table-header text-left">Notarised</th>
                  <th className="table-header text-left">PSN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {securities.map(sec => (
                  <tr key={sec.id} className="hover:bg-slate-50">
                    <td className="table-cell font-semibold capitalize">{sec.securityType.replace('_', ' ')}</td>
                    <td className="table-cell num text-green-700">{sec.applicationId}</td>
                    <td className="table-cell"><StatusBadge label={sec.status} size="sm" /></td>
                    <td className="table-cell">{sec.executionDate || '—'}</td>
                    <td className="table-cell">{sec.custodian || '—'}</td>
                    <td className="table-cell">
                      <span className={`text-xs capitalize ${sec.stampDutyStatus === 'complete' ? 'text-green-600' : sec.stampDutyStatus === 'pending' ? 'text-amber-600' : 'text-slate-400'}`}>
                        {sec.stampDutyStatus || '—'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className={`text-xs capitalize ${sec.notarisationStatus === 'complete' ? 'text-green-600' : sec.notarisationStatus === 'pending' ? 'text-amber-600' : 'text-slate-400'}`}>
                        {sec.notarisationStatus || '—'}
                      </span>
                    </td>
                    <td className="table-cell num text-xs text-slate-500">{sec.psnNumber || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tab 3: Exception Register */}
        <div className="card p-0 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <AlertOctagon size={14} className="text-violet-600" /> Exception Register
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Applications where requested amount exceeds eligible limit — {exceptions.length} records</p>
          </div>
          {exceptions.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">No exception cases on record.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {exceptions.map(app => (
                <div key={app.id} className="p-4 bg-violet-50/50">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 num">{app.applicationNumber}</span>
                        <StatusBadge label={app.status} size="sm" />
                      </div>
                      <p className="text-sm text-slate-700 mt-1">{app.memberName} · {fmt(app.requestedAmount)} requested · {fmt(app.eligibleAmount)} eligible</p>
                      <p className="text-xs text-violet-700 mt-1 bg-violet-50 rounded px-2 py-1">{app.exceptionReason}</p>
                    </div>
                    <div className="text-xs text-slate-400 flex-shrink-0">{app.applicationDate}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tab 4: Member Register */}
        <div className="card p-0 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <BookOpen size={14} className="text-green-600" /> Member Register
            </p>
            <p className="text-xs text-slate-500 mt-0.5">All SFPCL members — {members.length} records</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="table-header text-left">Name</th>
                  <th className="table-header text-left">Folio</th>
                  <th className="table-header text-left">Type</th>
                  <th className="table-header text-right">Shares</th>
                  <th className="table-header text-left">KYC</th>
                  <th className="table-header text-left">Status</th>
                  <th className="table-header text-right">Exposure</th>
                  <th className="table-header text-left">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {members.map(m => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="table-cell font-semibold text-slate-900">{m.name}</td>
                    <td className="table-cell num text-slate-600">{m.folioNumber}</td>
                    <td className="table-cell capitalize text-xs">{m.memberType === 'fpc' ? 'FPC' : m.memberType}</td>
                    <td className="table-cell text-right num">{m.sharesHeld.toLocaleString('en-IN')}</td>
                    <td className="table-cell"><StatusBadge label={m.kycStatus} size="sm" /></td>
                    <td className="table-cell"><StatusBadge label={m.activeStatus} size="sm" /></td>
                    <td className="table-cell text-right num">{m.currentExposure > 0 ? fmt(m.currentExposure) : '—'}</td>
                    <td className="table-cell">{new Date(m.registeredOn).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tab 5: Audit Log */}
        <div className="card p-0 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <RotateCcw size={14} className="text-green-600" /> Audit Log
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Compliance records — retained for 8 years per SOP</p>
          </div>
          <div className="divide-y divide-slate-100">
            {complianceRecords.map(rec => (
              <div key={rec.id} className="flex items-center gap-4 p-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{rec.area}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {rec.owner} · {rec.frequency} · {rec.evidenceCount} evidence records
                  </p>
                </div>
                <div className="text-right">
                  <StatusBadge label={rec.status} size="sm" />
                  <p className="text-xs text-slate-400 mt-1">Due: {new Date(rec.nextDueDate).toLocaleDateString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tab 5: Stamp Duty Register (S66) */}
        <div className="card p-0 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <FileText size={14} className="text-green-600" /> Stamp Duty Register
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Stamp duty and notarisation records for all security documents</p>
            </div>
            <button className="flex items-center gap-1 text-xs text-green-700 hover:underline">
              <Download size={12} /> Export
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {['Document Type', 'Application No.', 'Borrower', 'Stamp Duty Amt', 'Paid On', 'Challan No.', 'Notarised', 'Custodian', 'Status'].map(h => (
                    <th key={h} className="table-header text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stampDutyRecords.map((row, i) => (
                  <tr key={i} className={`hover:bg-slate-50 ${row.status === 'pending' ? 'bg-amber-50/30' : ''}`}>
                    <td className="table-cell font-medium text-slate-800">{row.doc}</td>
                    <td className="table-cell num text-slate-600">{row.appNo}</td>
                    <td className="table-cell text-slate-700">{row.borrower}</td>
                    <td className="table-cell num text-slate-900 font-semibold">₹{row.stampDutyAmt}</td>
                    <td className="table-cell text-slate-600">{row.paidOn || '—'}</td>
                    <td className="table-cell font-mono text-xs text-slate-500">{row.challanNo || '—'}</td>
                    <td className="table-cell">
                      {row.notarised
                        ? <span className="text-xs text-green-700 font-semibold">Yes ✓</span>
                        : <span className="text-xs text-amber-600">No</span>}
                    </td>
                    <td className="table-cell text-slate-600">{row.custodian || '—'}</td>
                    <td className="table-cell"><StatusBadge label={row.status} size="sm" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tab 6: Audit Log Explorer (S74) */}
        <div className="space-y-3">
          {/* Filters */}
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Filter size={14} className="text-slate-500" />
              <p className="text-sm font-semibold text-slate-700">Audit Log Explorer</p>
              <span className="text-xs text-slate-400 ml-auto">{filteredAudit.length} events</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-48">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search actor, entity ID, event type…"
                  value={auditSearch}
                  onChange={e => setAuditSearch(e.target.value)}
                  className="field-input pl-8 text-sm py-2 w-full"
                />
              </div>
              <select value={auditRoleFilter} onChange={e => setAuditRoleFilter(e.target.value)} className="field-select text-sm py-2">
                <option value="all">All Roles</option>
                <option value="deputy_manager_finance">Deputy Manager – Finance</option>
                <option value="credit_manager">Credit Manager</option>
                <option value="cfo">CFO</option>
                <option value="company_secretary">Company Secretary</option>
                <option value="director">Director</option>
                <option value="accounts">Accounts</option>
              </select>
              <select value={auditEntityFilter} onChange={e => setAuditEntityFilter(e.target.value)} className="field-select text-sm py-2">
                <option value="all">All Entity Types</option>
                <option value="application">Application</option>
                <option value="loan_account">Loan Account</option>
                <option value="member">Member</option>
                <option value="security">Security</option>
              </select>
              <input
                type="date"
                value={auditDateFrom}
                onChange={e => setAuditDateFrom(e.target.value)}
                className="field-input text-sm py-2"
                placeholder="From date"
              />
              <input
                type="date"
                value={auditDateTo}
                onChange={e => setAuditDateTo(e.target.value)}
                className="field-input text-sm py-2"
                placeholder="To date"
              />
              <button className="flex items-center gap-1 text-xs text-green-700 hover:underline">
                <Download size={12} /> Export
              </button>
            </div>
          </div>

          <div className="card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    {['Timestamp', 'Actor', 'Role', 'Entity Type', 'Entity ID', 'Event', 'Before State', 'After State', 'Comment'].map(h => (
                      <th key={h} className="table-header text-left whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAudit.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="table-cell text-center text-slate-400 py-8">No events match the current filters.</td>
                    </tr>
                  ) : filteredAudit.map(ev => (
                    <tr key={ev.id} className="hover:bg-slate-50">
                      <td className="table-cell text-xs text-slate-500 whitespace-nowrap">{new Date(ev.timestamp).toLocaleString('en-IN')}</td>
                      <td className="table-cell font-medium text-slate-900">{ev.actorName}</td>
                      <td className="table-cell text-xs text-slate-500 capitalize">{ev.actorRole.replace(/_/g, ' ')}</td>
                      <td className="table-cell text-xs text-slate-500 capitalize">{ev.entityType.replace(/_/g, ' ')}</td>
                      <td className="table-cell font-mono text-xs text-slate-600">{ev.entityId}</td>
                      <td className="table-cell font-medium text-slate-800">{ev.eventType}</td>
                      <td className="table-cell">
                        {ev.previousState
                          ? <span className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{ev.previousState}</span>
                          : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="table-cell">
                        {ev.newState
                          ? <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">{ev.newState}</span>
                          : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="table-cell text-xs text-slate-500 max-w-xs truncate">{ev.comment || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Tab 7: Grievance Register */}
        <div className="card p-0 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <AlertOctagon size={14} className="text-amber-500" /> Grievance Register
            </p>
            <p className="text-xs text-slate-500 mt-0.5">All borrower grievances — 7-day resolution SLA</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="table-header text-left">Ref No.</th>
                  <th className="table-header text-left">Borrower</th>
                  <th className="table-header text-left">Subject</th>
                  <th className="table-header text-left">Raised On</th>
                  <th className="table-header text-left">Status</th>
                  <th className="table-header text-left">CS Response</th>
                  <th className="table-header text-left">Resolved On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { ref: 'GR-001', borrower: 'Ganesh Thorat',   subject: 'Interest calculation query',        date: '2025-01-10', status: 'resolved', response: 'Interest calculated at 12% p.a. on outstanding principal per agreement.', resolved: '2025-01-17' },
                  { ref: 'GR-002', borrower: 'Sunita Kamble',   subject: 'Repayment receipt not received',    date: '2025-03-05', status: 'resolved', response: 'Receipt sent via registered email. Physical copy couriered.', resolved: '2025-03-10' },
                  { ref: 'GR-003', borrower: 'Kiran Pawar',     subject: 'Delay in NOC after repayment',      date: '2025-05-20', status: 'in_progress', response: 'Under CS review — NOC generation in progress.', resolved: null },
                ].map(g => (
                  <tr key={g.ref} className="hover:bg-slate-50">
                    <td className="table-cell font-mono text-slate-600">{g.ref}</td>
                    <td className="table-cell font-medium text-slate-900">{g.borrower}</td>
                    <td className="table-cell text-slate-700">{g.subject}</td>
                    <td className="table-cell">{g.date}</td>
                    <td className="table-cell"><StatusBadge label={g.status} size="sm" /></td>
                    <td className="table-cell text-xs text-slate-500 max-w-xs truncate">{g.response}</td>
                    <td className="table-cell text-slate-500">{g.resolved || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tab 7: Recovery Log */}
        <div className="card p-0 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Scale size={14} className="text-red-600" /> Recovery Log
            </p>
            <p className="text-xs text-slate-500 mt-0.5">All default management and recovery action records</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="table-header text-left">Loan No.</th>
                  <th className="table-header text-left">Borrower</th>
                  <th className="table-header text-right">Outstanding</th>
                  <th className="table-header text-right">DPD</th>
                  <th className="table-header text-left">Stage</th>
                  <th className="table-header text-left">Action Taken</th>
                  <th className="table-header text-left">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { loan: 'LO00000042', borrower: 'Ganesh Thorat',   outstanding: 350000, dpd: 45,  stage: 'grace_period',    action: 'Reminder calls + SMS issued',      date: '2025-06-10' },
                  { loan: 'LO00000038', borrower: 'Malti Shinde',    outstanding: 180000, dpd: 95,  stage: 'default_review',  action: 'Non-payment note submitted to SC', date: '2025-06-15' },
                  { loan: 'LO00000035', borrower: 'Kisan FPC Ltd',   outstanding: 890000, dpd: 187, stage: 'recovery_approved', action: 'CFO approved security invocation', date: '2025-04-28' },
                ].map(r => (
                  <tr key={r.loan} className={`hover:bg-slate-50 ${r.dpd > 90 ? 'bg-red-50/20' : ''}`}>
                    <td className="table-cell font-mono text-slate-700">{r.loan}</td>
                    <td className="table-cell font-medium text-slate-900">{r.borrower}</td>
                    <td className="table-cell text-right num">{fmt(r.outstanding)}</td>
                    <td className="table-cell text-right font-semibold text-red-600">{r.dpd}</td>
                    <td className="table-cell"><StatusBadge label={r.stage} size="sm" /></td>
                    <td className="table-cell text-slate-600">{r.action}</td>
                    <td className="table-cell text-slate-500">{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {supplementalRegisters.map(register => (
          <div key={register.title} className="card p-0 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <BookOpen size={14} className="text-green-600" /> {register.title}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{register.subtitle}</p>
              </div>
              <button className="flex items-center gap-1 text-xs text-green-700 hover:underline">
                <Download size={12} /> Export
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    {register.headers.map(header => (
                      <th key={header} className="table-header text-left whitespace-nowrap">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {register.rows.map((row, rowIndex) => (
                    <tr key={`${register.title}-${rowIndex}`} className="hover:bg-slate-50">
                      {row.map((cell, cellIndex) => (
                        <td
                          key={`${register.title}-${rowIndex}-${cellIndex}`}
                          className={`table-cell ${cellIndex === 0 ? 'font-mono text-slate-700' : 'text-slate-600'}`}
                        >
                          {cellIndex === row.length - 1 ? <StatusBadge label={cell} size="sm" /> : cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </Tabs>
    </div>
  );
};

export default RegistersHub;

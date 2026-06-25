import React, { useState } from 'react';
import {
  CheckCircle2, FileText, Download, Archive, Shield,
  AlertTriangle, BadgeCheck, Clock, ChevronRight, Unlock
} from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';
import { useRole } from '../../contexts/RoleContext';

type ClosureTab = 'closure' | 'noc' | 'security_return' | 'archive';

const closureLoans = [
  { id: 'la001', loanNo: 'LO00000031', borrower: 'Asha Bhosale',    sanctioned: 200000, outstanding: 0,     status: 'fully_repaid', repaidOn: '2025-05-10', nocStatus: 'ready' },
  { id: 'la002', loanNo: 'LO00000028', borrower: 'Vijay Patil',     sanctioned: 350000, outstanding: 12000, status: 'active',        repaidOn: null,        nocStatus: 'not_ready' },
  { id: 'la003', loanNo: 'LO00000025', borrower: 'Radha Kisan Org', sanctioned: 500000, outstanding: 0,     status: 'closed',       repaidOn: '2025-03-28', nocStatus: 'issued' },
];

const LoanClosureHub: React.FC = () => {
  const { can } = useRole();
  const [activeTab, setActiveTab] = useState<ClosureTab>('closure');
  const [selectedLoan, setSelectedLoan] = useState(closureLoans[0]);
  const [nocIssued, setNocIssued] = useState(false);
  const [nocPublished, setNocPublished] = useState(false);
  const [securityReturnConfirmed, setSecurityReturnConfirmed] = useState(false);
  const [archiveCompleted, setArchiveCompleted] = useState(false);
  const [loanMarkedClosed, setLoanMarkedClosed] = useState(false);
  const [closureNotes, setClosureNotes] = useState('');

  const tabs: { id: ClosureTab; label: string }[] = [
    { id: 'closure',         label: 'Closure Checklist' },
    { id: 'noc',             label: 'NOC Generation' },
    { id: 'security_return', label: 'Security Return / Unpledge' },
    { id: 'archive',         label: 'Archive' },
  ];

  const nocComplete = selectedLoan.nocStatus === 'issued' || nocIssued || nocPublished;
  const securityComplete = selectedLoan.nocStatus === 'issued' || securityReturnConfirmed;
  const archiveComplete = selectedLoan.status === 'closed' || archiveCompleted;
  const closedComplete = selectedLoan.status === 'closed' || loanMarkedClosed || archiveCompleted;

  const closureChecklist = [
    { item: 'All principal repaid',                         done: selectedLoan.outstanding === 0 },
    { item: 'All interest repaid (incl. capitalised)',      done: selectedLoan.outstanding === 0 },
    { item: 'Penal interest (if any) cleared',             done: true },
    { item: 'Closing balance confirmed in SAP',            done: selectedLoan.outstanding === 0 },
    { item: 'Security documents accounted',                done: true },
    { item: 'Compliance checklist complete',               done: true },
    { item: 'NOC issued to borrower',                      done: nocComplete },
    { item: 'SH-4 / CDSL pledge released',                 done: securityComplete },
    { item: 'Blank cheque returned',                       done: securityComplete },
    { item: 'Loan record archived',                        done: archiveComplete },
  ];

  const completedCount = closureChecklist.filter(c => c.done).length;
  const publicationImpact = [
    { label: 'Borrower MP20', status: nocPublished ? 'published' : nocComplete ? 'ready_to_publish' : 'not_ready', note: nocPublished ? 'Closure/NOC status is staged for the borrower portal.' : 'Publish after NOC generation.' },
    { label: 'NOC Register', status: nocComplete ? 'updated' : 'pending', note: nocComplete ? 'NOC reference and issue date are visible in the register preview.' : 'Waiting for NOC issue.' },
    { label: 'Security Register', status: securityComplete ? 'returned' : 'held', note: securityComplete ? 'SH-4, cheque, PoA and CDSL release states are complete.' : 'Security remains in custody.' },
    { label: 'Archive Register', status: archiveComplete ? 'archived' : loanMarkedClosed ? 'ready' : 'pending', note: archiveComplete ? 'Archive ID and retention date are staged.' : 'Archive after closure checklist completion.' },
    { label: 'Audit Trail', status: closedComplete ? 'events_staged' : 'in_progress', note: 'Local prototype events show closure, NOC, security return and archive actions.' },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Loan Closure & Archive</h1>
        <p className="text-sm text-slate-500 mt-1">Manage NOC generation, security return, CDSL unpledge and record archival for fully-repaid loans.</p>
      </div>

      {/* Loan selector */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {closureLoans.map(loan => (
          <button
            key={loan.id}
            onClick={() => setSelectedLoan(loan)}
            className={`text-left border rounded-xl p-4 transition-all ${
              selectedLoan.id === loan.id
                ? 'border-green-300 bg-green-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-medium text-slate-600">{loan.loanNo}</span>
              <StatusBadge label={loan.nocStatus === 'issued' ? 'closed' : loan.outstanding === 0 ? 'complete' : 'active'} size="sm" />
            </div>
            <div className="font-medium text-slate-900 text-sm">{loan.borrower}</div>
            <div className="text-xs text-slate-500 mt-1">
              {loan.outstanding === 0 ? 'Fully repaid' : `₹${loan.outstanding.toLocaleString('en-IN')} outstanding`}
            </div>
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 mb-6">
        <div className="flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-green-600 text-green-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Prototype Publication Impact</h3>
            <p className="text-xs text-slate-500 mt-0.5">Local UI state preview for borrower publication, registers and audit.</p>
          </div>
          <StatusBadge label={archiveComplete ? 'archived' : closedComplete ? 'closure_in_progress' : selectedLoan.status} size="sm" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {publicationImpact.map(item => (
            <div key={item.label} className="rounded-lg bg-slate-50 border border-slate-100 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-slate-700">{item.label}</p>
                <StatusBadge label={item.status} size="sm" />
              </div>
              <p className="text-xs text-slate-500 mt-2">{item.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Closure Checklist */}
      {activeTab === 'closure' && (
        <div className="max-w-2xl space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-900">Closure Checklist — {selectedLoan.loanNo}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedLoan.borrower}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{completedCount}/{closureChecklist.length}</div>
                <div className="text-xs text-slate-500">items complete</div>
              </div>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2 mb-5">
              <div
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${(completedCount / closureChecklist.length) * 100}%` }}
              />
            </div>

            <div className="space-y-2">
              {closureChecklist.map((item, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${item.done ? 'bg-green-50' : 'bg-slate-50'}`}>
                  {item.done
                    ? <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
                    : <Clock size={16} className="text-slate-300 flex-shrink-0" />
                  }
                  <span className={`text-sm ${item.done ? 'text-green-800' : 'text-slate-500'}`}>{item.item}</span>
                </div>
              ))}
            </div>

            {selectedLoan.outstanding === 0 && (
              <div className="mt-5 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Closure Notes</label>
                  <textarea
                    value={closureNotes}
                    onChange={e => setClosureNotes(e.target.value)}
                    rows={3}
                    placeholder="Record any final observations before closure…"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  />
                </div>
                {can('manage_documentation') && completedCount >= 6 && (
                  <button
                    onClick={() => setLoanMarkedClosed(true)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                  >
                    <BadgeCheck size={16} />
                    {loanMarkedClosed ? 'Closure Marked' : 'Mark Loan as Closed'}
                  </button>
                )}
              </div>
            )}
            {selectedLoan.outstanding > 0 && (
              <div className="mt-4 flex items-center gap-2 text-amber-700 bg-amber-50 rounded-xl p-4 text-sm">
                <AlertTriangle size={16} className="flex-shrink-0" />
                Closure cannot proceed — outstanding balance of ₹{selectedLoan.outstanding.toLocaleString('en-IN')} remains.
              </div>
            )}
          </div>
        </div>
      )}

      {/* NOC Generation */}
      {activeTab === 'noc' && (
        <div className="max-w-2xl space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <BadgeCheck size={16} className="text-green-600" />
              No Objection Certificate (NOC) Generation
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 rounded-lg p-4 mb-5">
              <div><div className="text-slate-500">Loan Account</div><div className="font-medium">{selectedLoan.loanNo}</div></div>
              <div><div className="text-slate-500">Borrower</div><div className="font-medium">{selectedLoan.borrower}</div></div>
              <div><div className="text-slate-500">Sanctioned Amount</div><div className="font-medium">₹{selectedLoan.sanctioned.toLocaleString('en-IN')}</div></div>
              <div><div className="text-slate-500">Repayment Completed</div><div className="font-medium">{selectedLoan.repaidOn || 'Pending'}</div></div>
            </div>

            {selectedLoan.outstanding === 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'NOC Date', type: 'date' },
                    { label: 'Reference Number', type: 'text' },
                  ].map(f => (
                    <div key={f.label}>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">{f.label}</label>
                      <input
                        type={f.type}
                        defaultValue={f.type === 'date' ? new Date().toISOString().split('T')[0] : 'NOC-2025-042'}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">NOC Language</label>
                  <select className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                    <option>English</option>
                    <option>Marathi</option>
                    <option>English + Marathi</option>
                  </select>
                </div>
                {!nocIssued ? (
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setNocIssued(true);
                        setNocPublished(true);
                      }}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                    >
                      <BadgeCheck size={16} />
                      Generate, Issue & Publish NOC
                    </button>
                    <button className="flex items-center gap-2 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                      <FileText size={16} />
                      Preview
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
                    <CheckCircle2 size={20} className="text-green-600 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-green-800 text-sm">NOC issued and published successfully</div>
                      <div className="text-xs text-green-600 mt-0.5">Ref: NOC-2025-042 · {new Date().toLocaleDateString('en-IN')} · Borrower MP20 updated</div>
                    </div>
                    <button className="ml-auto flex items-center gap-1.5 text-sm text-green-700 font-medium hover:underline flex-shrink-0">
                      <Download size={14} />
                      Download
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-amber-700 bg-amber-50 rounded-xl p-4 text-sm">
                <AlertTriangle size={16} className="flex-shrink-0" />
                NOC cannot be generated — outstanding balance of ₹{selectedLoan.outstanding.toLocaleString('en-IN')} remains.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Security Return */}
      {activeTab === 'security_return' && (
        <div className="max-w-2xl space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Unlock size={16} className="text-green-600" />
              Security Return & CDSL Unpledge
            </h3>

            <div className="space-y-3 mb-5">
              {[
                { doc: 'SH-4 Transfer Form',   securityType: 'Physical share transfer',    status: securityComplete ? 'returned' : 'held',   returnDate: securityComplete ? selectedLoan.repaidOn || new Date().toISOString().split('T')[0] : null },
                { doc: 'Blank Cheque',         securityType: 'Cheque returned to borrower', status: securityComplete ? 'returned' : 'held',   returnDate: securityComplete ? selectedLoan.repaidOn || new Date().toISOString().split('T')[0] : null },
                { doc: 'CDSL Pledge Release',  securityType: 'Demat shares unpledged',      status: securityComplete ? 'released' : 'pledged', returnDate: securityComplete ? selectedLoan.repaidOn || new Date().toISOString().split('T')[0] : null },
                { doc: 'Power of Attorney',    securityType: 'PoA cancelled/returned',      status: securityComplete ? 'returned' : 'held',   returnDate: securityComplete ? selectedLoan.repaidOn || new Date().toISOString().split('T')[0] : null },
              ].map(item => (
                <div key={item.doc} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50">
                  <div>
                    <div className="text-sm font-medium text-slate-800">{item.doc}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{item.securityType}</div>
                    {item.returnDate && <div className="text-xs text-green-600 mt-0.5">Returned: {item.returnDate}</div>}
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge label={item.status} size="sm" />
                    {can('manage_compliance') && item.status === 'held' && (
                      <button className="text-xs border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors">
                        Mark Returned
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {can('manage_compliance') && selectedLoan.outstanding === 0 && (
              <button
                onClick={() => setSecurityReturnConfirmed(true)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                <Shield size={16} />
                {securityReturnConfirmed ? 'Securities Returned' : 'Confirm All Securities Returned'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Archive */}
      {activeTab === 'archive' && (
        <div className="max-w-2xl space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Archive size={16} className="text-slate-600" />
              Loan Record Archival
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Per SOP Section 13 — all loan records must be archived for a minimum of 8 years after closure. Digital records must be backed up.
            </p>

            <div className="space-y-3 mb-5">
              {[
                { category: 'Application & Appraisal Documents', count: 7, status: 'ready' },
                { category: 'Sanction Documents',                  count: 3, status: 'ready' },
                { category: 'Legal & Security Documents',          count: 5, status: 'ready' },
                { category: 'Disbursement Records',                count: 2, status: 'ready' },
                { category: 'Repayment Ledger',                    count: 1, status: 'ready' },
                { category: 'Compliance Records',                  count: 4, status: 'ready' },
              ].map(cat => (
                <div key={cat.category} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-slate-800">{cat.category}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{cat.count} document{cat.count !== 1 ? 's' : ''}</div>
                  </div>
                  <StatusBadge label={cat.status} size="sm" />
                </div>
              ))}
            </div>

            <div className="bg-slate-50 rounded-xl p-4 mb-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><div className="text-slate-500 text-xs">Total Documents</div><div className="font-semibold text-slate-900">22</div></div>
                <div><div className="text-slate-500 text-xs">Archive Retention</div><div className="font-semibold text-slate-900">8 years (until 2033)</div></div>
                <div><div className="text-slate-500 text-xs">Archive ID</div><div className="font-semibold text-slate-900">ARC-2025-042</div></div>
                <div><div className="text-slate-500 text-xs">Physical File Location</div><div className="font-semibold text-slate-900">Cabinet 3, Row 2</div></div>
              </div>
            </div>

            {can('manage_documentation') && (selectedLoan.status === 'closed' || loanMarkedClosed) && (
              <div className="flex gap-3">
                <button
                  onClick={() => setArchiveCompleted(true)}
                  className="flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                >
                  <Archive size={16} />
                  {archiveCompleted ? 'Loan Record Archived' : 'Archive Loan Record'}
                </button>
                <button className="flex items-center gap-2 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                  <Download size={16} />
                  Download Archive Package
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanClosureHub;

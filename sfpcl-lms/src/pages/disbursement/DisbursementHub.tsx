import React, { useState } from 'react';
import { Banknote, ChevronRight, Check, AlertTriangle, Building2, ShieldCheck, Download, FileText, Upload } from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';
import AlertBanner from '../../components/ui/AlertBanner';
import { loanApplications } from '../../data/mockData';
import { useRole } from '../../contexts/RoleContext';

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');

interface DisbursementHubProps {
  onOpenApplication: (id: string) => void;
  initialSelectedId?: string;
}

type DisbStage = 'sap_pending' | 'bank_verify' | 'ready' | 'initiated' | 'cfc_pending' | 'completed';

const STAGE_LABELS: Record<DisbStage, string> = {
  sap_pending: 'SAP Code Pending',
  bank_verify: 'Bank Verification',
  ready: 'Ready for Payment',
  initiated: 'Payment Initiated',
  cfc_pending: 'CFC Approval',
  completed: 'Completed',
};

const DisbursementHub: React.FC<DisbursementHubProps> = ({ onOpenApplication, initialSelectedId }) => {
  const disbQueue = loanApplications.filter(a =>
    a.status === 'sanctioned' && a.documentationStatus === 'complete'
  );
  
  const initialApp = initialSelectedId ? disbQueue.find(a => a.id === initialSelectedId || a.applicationNumber === initialSelectedId) : null;
  const [selected, setSelected] = useState<string | null>(
    initialApp?.id || disbQueue[0]?.id || null
  );
  const [sapCode, setSapCode] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankIfsc, setBankIfsc] = useState('');
  const [stage, setStage] = useState<DisbStage>('sap_pending');
  const [confirmed, setConfirmed] = useState(false);
  const [bankVerified, setBankVerified] = useState(false);
  const [bankReference, setBankReference] = useState('');
  const [evidenceUploaded, setEvidenceUploaded] = useState(false);
  const { can } = useRole();

  const app = disbQueue.find(a => a.id === selected) || loanApplications.find(a => a.disbursementStatus === 'completed');

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Disbursement Hub</h1>
          <p className="text-sm text-slate-500 mt-0.5">{disbQueue.length} application{disbQueue.length !== 1 ? 's' : ''} ready for disbursement</p>
        </div>
      </div>

      {/* All-clear or queue */}
      {disbQueue.length === 0 ? (
        <div className="card">
          <div className="text-center py-8">
            <Check size={32} className="text-green-500 mx-auto mb-3" />
            <p className="text-slate-600 font-semibold">No applications pending disbursement</p>
            <p className="text-slate-400 text-sm mt-1">Documentation completion will move sanctioned loans here.</p>
          </div>
          {/* Show already-disbursed */}
          <div className="mt-6 border-t pt-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Recently Disbursed</p>
            {loanApplications.filter(a => a.disbursementStatus === 'completed').map(a => (
              <div key={a.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg mb-2">
                <div className="flex-1">
                  <span className="font-semibold text-slate-900 num">{a.applicationNumber}</span>
                  <span className="text-slate-400 mx-2">·</span>
                  <span className="text-slate-700">{a.memberName}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-green-700 num">{fmt(a.disbursedAmount || 0)}</div>
                  <div className="text-xs text-slate-400">Disbursed {a.disbursedAt ? new Date(a.disbursedAt).toLocaleDateString('en-IN') : '—'}</div>
                </div>
                <StatusBadge label={a.disbursementStatus} size="sm" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Queue */}
          <div className="card p-0 overflow-hidden lg:col-span-1">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Ready to Disburse ({disbQueue.length})</p>
            </div>
            <div className="divide-y divide-slate-100">
              {disbQueue.map(a => (
                <button
                  key={a.id}
                  onClick={() => { setSelected(a.id); setStage('sap_pending'); setConfirmed(false); }}
                  className={`w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors text-left ${selected === a.id ? 'bg-green-50 border-l-4 border-l-green-500' : ''}`}
                >
                  <Banknote size={16} className="text-green-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900 num text-sm">{a.applicationNumber}</div>
                    <div className="text-xs text-slate-500 truncate">{a.memberName}</div>
                    <div className="text-xs text-green-700 num font-medium">{fmt(a.requestedAmount)}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Detail */}
          {app && (
            <div className="lg:col-span-2 space-y-4">
              {/* Application summary */}
              <div className="card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-slate-900 num">{app.applicationNumber}</h2>
                      <StatusBadge label={app.disbursementStatus} size="sm" />
                    </div>
                    <p className="text-sm text-slate-500">{app.memberName} · {fmt(app.requestedAmount)}</p>
                  </div>
                  <button onClick={() => onOpenApplication(app.id)} className="text-xs text-green-600 hover:underline flex items-center gap-1">
                    Full view <ChevronRight size={12} />
                  </button>
                </div>

                {/* Progress stages */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
                  {(Object.entries(STAGE_LABELS) as Array<[DisbStage, string]>).map(([s, label]) => (
                    <div
                      key={s}
                      className={`rounded-lg p-2 text-center text-xs font-medium ${
                        stage === s ? 'bg-green-100 text-green-700 border border-green-300' :
                        (Object.keys(STAGE_LABELS).indexOf(s) < Object.keys(STAGE_LABELS).indexOf(stage))
                          ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'
                      }`}
                    >
                      {label}
                    </div>
                  ))}
                </div>
              </div>

              {/* SAP Code */}
              <div className="card">
                <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <Building2 size={14} /> SAP Customer Code Setup
                </h3>
                {app.sapCustomerCode ? (
                  <div className="flex items-center gap-2 text-green-700 bg-green-50 rounded-lg p-3">
                    <Check size={16} /> SAP Code assigned: <span className="font-bold num">{app.sapCustomerCode}</span>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="field-label">SAP Customer Code</label>
                        <input
                          type="text"
                          value={sapCode}
                          onChange={e => setSapCode(e.target.value)}
                          className="field-input"
                          placeholder="e.g. SAP-240042"
                        />
                      </div>
                      <div>
                        <label className="field-label">Bank Account</label>
                        <input
                          type="text"
                          value={bankAccount}
                          onChange={e => setBankAccount(e.target.value)}
                          className="field-input"
                          placeholder="Account number"
                        />
                      </div>
                      <div>
                        <label className="field-label">IFSC Code</label>
                        <input
                          type="text"
                          value={bankIfsc}
                          onChange={e => setBankIfsc(e.target.value.toUpperCase())}
                          className="field-input"
                          placeholder="e.g. SBIN0001234"
                        />
                      </div>
                    </div>
                    <button
                      className="btn-primary mt-3 text-sm"
                      disabled={!sapCode.trim() || !bankAccount.trim() || !bankIfsc.trim()}
                      onClick={() => setStage('bank_verify')}
                    >
                      Save SAP Setup & Verify Bank
                    </button>
                  </>
                )}
              </div>

              {/* Bank verification and readiness gate */}
              {(stage === 'sap_pending' || stage === 'bank_verify' || stage === 'ready') && (
                <div className="card">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <ShieldCheck size={14} /> Disbursement Readiness Review
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    {[
                      { label: 'Documentation', value: app.documentationStatus === 'complete' ? 'Complete' : 'Pending', ok: app.documentationStatus === 'complete' },
                      { label: 'SAP Code', value: app.sapCustomerCode || sapCode || 'Pending', ok: Boolean(app.sapCustomerCode || sapCode) },
                      { label: 'Bank Verification', value: bankVerified || stage === 'ready' ? 'Verified' : 'Pending', ok: bankVerified || stage === 'ready' },
                    ].map(item => (
                      <div key={item.label} className={`rounded-lg border p-3 ${item.ok ? 'bg-green-50 border-green-100' : 'bg-amber-50 border-amber-100'}`}>
                        <p className="text-xs text-slate-500">{item.label}</p>
                        <p className={`text-sm font-semibold mt-0.5 ${item.ok ? 'text-green-800' : 'text-amber-800'}`}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                  {stage !== 'ready' ? (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="text-sm text-amber-800">
                        <p className="font-semibold">Bank verification required before payment initiation</p>
                        <p className="text-xs mt-0.5">Confirm account name, account number, IFSC, and signature mismatch clearance.</p>
                      </div>
                      {can('initiate_disbursement') ? (
                        <button
                          className="btn-primary text-sm flex-shrink-0"
                          disabled={!(app.sapCustomerCode || sapCode)}
                          onClick={() => { setBankVerified(true); setStage('ready'); }}
                        >
                          <ShieldCheck size={16} className="mr-2" /> Mark Ready for Payment
                        </button>
                      ) : (
                        <button className="btn-primary text-sm opacity-50 cursor-not-allowed flex-shrink-0" disabled>
                          <ShieldCheck size={16} className="mr-2" /> Mark Ready for Payment
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-green-700 bg-green-50 rounded-lg p-3">
                      <Check size={16} /> All readiness gates cleared. Payment can be initiated.
                    </div>
                  )}
                </div>
              )}

              {/* Payment initiation */}
              {(stage === 'ready' || stage === 'initiated' || stage === 'cfc_pending' || stage === 'completed') && (
                <div className="card">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <Banknote size={14} /> Initiate Payment
                  </h3>
                  {confirmed ? (
                    <div className="flex items-center gap-2 text-green-700 bg-green-50 rounded-lg p-3">
                      <Check size={16} /> Payment initiated. Pending CFC approval for final release.
                    </div>
                  ) : (
                    <>
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                        <div className="flex gap-2">
                          <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                          <div className="text-sm text-amber-800">
                            <p className="font-semibold">Confirm payment details before initiating</p>
                            <p className="mt-1">Amount: <strong>{fmt(app.requestedAmount)}</strong> · Account: {bankAccount || app.bankAccount || '—'} · IFSC: {bankIfsc || app.bankIfsc || '—'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="btn-secondary text-sm flex-1">Hold for Review</button>
                        {can('initiate_disbursement') ? (
                          <button className="btn-primary text-sm flex-1" onClick={() => { setConfirmed(true); setStage('cfc_pending'); }}>
                            Initiate RTGS/NEFT Payment
                          </button>
                        ) : (
                          <button className="btn-primary text-sm flex-1 opacity-50 cursor-not-allowed" disabled title="Senior Manager Finance only">
                            Initiate RTGS/NEFT Payment
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* CFC Approval */}
              {(stage === 'cfc_pending' || stage === 'completed') && (
                <div className="card">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <ShieldCheck size={14} /> Authorise Release (CFC)
                  </h3>
                  {stage === 'completed' ? (
                    <div className="flex items-center gap-2 text-green-700 bg-green-50 rounded-lg p-3">
                      <Check size={16} /> Payment authorised and released successfully.
                    </div>
                  ) : (
                    <div className="flex justify-end gap-3">
                      {can('authorise_disbursement') ? (
                        <button className="btn-primary" onClick={() => setStage('completed')}>
                          <ShieldCheck size={16} className="mr-2" /> Authorise Payment
                        </button>
                      ) : (
                        <button className="btn-primary opacity-50 cursor-not-allowed" disabled title="CFC only">
                          <ShieldCheck size={16} className="mr-2" /> Authorise Payment
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Bank evidence and disbursement advice */}
              {stage === 'completed' && (
                <div className="card">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <FileText size={14} /> UTR Evidence & Disbursement Advice
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="field-label">UTR / Bank Reference</label>
                      <input
                        value={bankReference}
                        onChange={e => setBankReference(e.target.value.toUpperCase())}
                        className="field-input"
                        placeholder="e.g. UTR20260624123456"
                      />
                    </div>
                    <div>
                      <label className="field-label">Bank Evidence</label>
                      <button
                        type="button"
                        onClick={() => setEvidenceUploaded(true)}
                        className={`w-full flex items-center justify-center gap-2 border rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                          evidenceUploaded
                            ? 'border-green-200 bg-green-50 text-green-700'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {evidenceUploaded ? <Check size={15} /> : <Upload size={15} />}
                        {evidenceUploaded ? 'Evidence Uploaded' : 'Upload Evidence'}
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-sm text-green-800">
                      <p className="font-semibold">Disbursement advice ready</p>
                      <p className="text-xs mt-0.5">Publish the borrower copy after UTR and bank evidence are recorded.</p>
                    </div>
                    <button
                      className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                      disabled={!bankReference || !evidenceUploaded}
                    >
                      <Download size={15} /> Generate Advice
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DisbursementHub;

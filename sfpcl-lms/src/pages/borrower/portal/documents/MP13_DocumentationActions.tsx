import React from 'react';
import { FileSignature, Upload, Download, Landmark, Shield } from 'lucide-react';
import StatusBadge from '../../../../components/ui/StatusBadge';

const MP13_DocumentationActions: React.FC = () => {
  const actions = [
    { name: 'Term Sheet', status: 'pending_signature', action: 'Acknowledge terms', note: 'Borrower and nominee signature required.' },
    { name: 'Loan Agreement', status: 'pending_signature', action: 'Upload signed copy', note: 'Stamped and notarised copy will be verified by Compliance.' },
    { name: 'Power of Attorney', status: 'notarised', action: 'Download copy', note: 'Executed and held by Company Secretary.' },
    { name: 'Tri-party Agreement', status: 'signed', action: 'View declaration', note: 'Applicable for subsidiary deduction repayment.' },
    { name: 'SH-4 Physical Share Security', status: 'held', action: 'View status', note: 'Physical share security is held in custody.' },
    { name: 'Bank Verification Letter', status: 'verified', action: 'View letter', note: 'Bank account and signature verified.' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Documentation Actions</h2>
        <p className="text-sm text-slate-500 mt-1">Complete borrower-side signatures, uploads, and acknowledgements.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[
          ['Pending borrower actions', '2'],
          ['Documents accepted', '4'],
          ['Security items held', '2'],
        ].map(([label, value]) => (
          <div key={label} className="bg-white rounded-xl border border-slate-100 p-4">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <FileSignature size={17} className="text-green-600" />
            Legal Document Checklist
          </h3>
        </div>
        <div className="divide-y divide-slate-50">
          {actions.map(item => (
            <div key={item.name} className="px-6 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                  {item.name.includes('Bank') ? <Landmark size={18} className="text-slate-500" /> : item.name.includes('SH-4') ? <Shield size={18} className="text-slate-500" /> : <FileSignature size={18} className="text-slate-500" />}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                    <StatusBadge label={item.status} size="sm" />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{item.note}</p>
                </div>
              </div>
              <button className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                item.action.includes('Upload')
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}>
                {item.action.includes('Upload') ? <Upload size={15} /> : <Download size={15} />}
                {item.action}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MP13_DocumentationActions;

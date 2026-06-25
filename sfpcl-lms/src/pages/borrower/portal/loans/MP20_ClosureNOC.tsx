import React from 'react';
import { Archive, CheckCircle2, Download, Shield, Unlock } from 'lucide-react';
import StatusBadge from '../../../../components/ui/StatusBadge';

const MP20_ClosureNOC: React.FC = () => {
  const items = [
    ['Outstanding balance zero', 'pending', '₹3,50,000 principal remains outstanding.'],
    ['Closure review', 'not_started', 'Starts automatically after full repayment.'],
    ['NOC generation', 'pending', 'Available only after authorised issuance.'],
    ['SH-4 / CDSL release', 'held', 'Security remains in custody until closure.'],
    ['Blank cheque return', 'held', 'Returned after closure approval.'],
    ['Archive completed', 'not_started', 'Internal file archive follows security return.'],
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Closure & NOC</h2>
        <p className="text-sm text-slate-500 mt-1">Track final closure, NOC issuance, and security return status.</p>
      </div>

      <div className="bg-white rounded-xl border border-amber-200 p-5">
        <div className="flex items-start gap-3">
          <Archive size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-amber-900">Closure is not ready yet</h3>
            <p className="text-sm text-amber-700 mt-1">NOC can be issued only after all principal, interest, and security-return checks are complete.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <Unlock size={17} className="text-green-600" />
            Closure Checklist
          </h3>
        </div>
        <div className="divide-y divide-slate-50">
          {items.map(([label, status, note]) => (
            <div key={label} className="px-6 py-4 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                {status === 'complete' ? <CheckCircle2 size={17} className="text-green-600 mt-0.5" /> : <Shield size={17} className="text-slate-300 mt-0.5" />}
                <div>
                  <p className="text-sm font-semibold text-slate-900">{label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{note}</p>
                </div>
              </div>
              <StatusBadge label={status} size="sm" />
            </div>
          ))}
        </div>
      </div>

      <button className="flex items-center justify-center gap-2 border border-slate-200 text-slate-400 px-4 py-2.5 rounded-lg text-sm font-medium cursor-not-allowed" disabled>
        <Download size={16} />
        Download NOC
      </button>
    </div>
  );
};

export default MP20_ClosureNOC;

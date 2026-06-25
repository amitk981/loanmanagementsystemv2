import React from 'react';
import { CheckCircle2, Download, FileText, IndianRupee, ShieldCheck } from 'lucide-react';
import StatusBadge from '../../../../components/ui/StatusBadge';

const MP12_SanctionOutcome: React.FC = () => {
  const terms = [
    ['Application No.', 'APP-2024-0042'],
    ['Sanctioned Amount', '₹5,00,000'],
    ['Tenure', '12 months'],
    ['Interest Rate', '12% p.a. floating'],
    ['Purpose', 'Crop Production (Grapes & Tomato)'],
    ['Approval Route', 'CFO + 1 Director'],
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Sanction Outcome & Terms</h2>
        <p className="text-sm text-slate-500 mt-1">View the borrower-facing sanction result and published terms.</p>
      </div>

      <div className="bg-white rounded-xl border border-green-200 overflow-hidden">
        <div className="bg-green-50 border-b border-green-100 px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 size={22} className="text-green-700" />
            </div>
            <div>
              <h3 className="font-bold text-green-950">Loan approved</h3>
              <p className="text-sm text-green-700 mt-1">Approved on 05 Sep 2024. Documentation is the next step.</p>
            </div>
          </div>
          <StatusBadge label="approved" size="sm" />
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {terms.map(([label, value]) => (
            <div key={label} className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500">{label}</p>
              <p className="text-sm font-semibold text-slate-900 mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <IndianRupee size={16} className="text-green-600" />
            Borrower Commitments
          </h3>
          <div className="space-y-3">
            {[
              'Use funds only for the approved agriculture purpose.',
              'Complete documentation and security requirements before disbursement.',
              'Repay principal and interest as per the final loan agreement.',
              'Keep KYC, bank, and contact details updated through the loan tenure.',
            ].map(item => (
              <div key={item} className="flex items-start gap-3 text-sm text-slate-700">
                <CheckCircle2 size={15} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <ShieldCheck size={16} className="text-green-600" />
            Available Documents
          </h3>
          <div className="space-y-3">
            {[
              ['Sanction Letter', 'Available'],
              ['Term Sheet', 'Signature pending'],
              ['Loan Agreement', 'Preparing'],
            ].map(([name, status]) => (
              <div key={name} className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText size={15} className="text-slate-400 flex-shrink-0" />
                  <span className="text-sm font-medium text-slate-800">{name}</span>
                </div>
                <StatusBadge label={status.toLowerCase().replace(/\s+/g, '_')} size="sm" />
              </div>
            ))}
          </div>
          <button className="mt-4 flex items-center justify-center gap-2 w-full border border-slate-200 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            <Download size={16} />
            Download Sanction Letter
          </button>
        </div>
      </div>
    </div>
  );
};

export default MP12_SanctionOutcome;

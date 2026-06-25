import React, { useState } from 'react';
import { CheckCircle2, Copy, Landmark, Send } from 'lucide-react';

const MP18_DirectRepaymentInfo: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Direct Repayment Information</h2>
        <p className="text-sm text-slate-500 mt-1">Use these details for RTGS/NEFT and submit the bank reference after payment.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 p-5">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Landmark size={16} className="text-green-600" />
          SFPCL Repayment Bank Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            ['Beneficiary Name', 'Sahyadri Farmers Producer Company Ltd.'],
            ['Bank Name', 'RBL Bank'],
            ['Account Number', 'XXXXXX1234'],
            ['IFSC Code', 'RATN0000001'],
            ['Payment Remark', 'LO00000042 / Ganesh Thorat'],
            ['Amount Due', '₹1,05,000'],
          ].map(([label, value]) => (
            <div key={label} className="bg-slate-50 rounded-lg p-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500">{label}</p>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">{value}</p>
              </div>
              <Copy size={14} className="text-slate-300 flex-shrink-0 mt-1" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 p-5">
        <h3 className="font-semibold text-slate-900 mb-4">Submit Payment Reference</h3>
        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-5 flex items-start gap-3">
            <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-900">Payment reference submitted</p>
              <p className="text-sm text-green-700 mt-0.5">SFPCL Accounts will verify the bank receipt and update your ledger.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">UTR / Bank Reference</label>
              <input className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="UTR20260624123456" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Payment Date</label>
              <input type="date" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Amount Paid</label>
              <input type="number" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="105000" />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <button onClick={() => setSubmitted(true)} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
                <Send size={16} />
                Submit Reference
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MP18_DirectRepaymentInfo;

import React from 'react';
import { Banknote, CheckCircle2, Clock, Download, Landmark } from 'lucide-react';
import StatusBadge from '../../../../components/ui/StatusBadge';

const MP14_DisbursementStatus: React.FC = () => {
  const stages = [
    ['Documentation Complete', true, '18 Sep 2024'],
    ['SAP Customer Code Created', true, '21 Sep 2024'],
    ['Payment Authorised', true, '22 Sep 2024'],
    ['Disbursement Advice Issued', true, '22 Sep 2024'],
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Disbursement Status</h2>
        <p className="text-sm text-slate-500 mt-1">Track SAP setup, bank authorisation, and final payment advice.</p>
      </div>

      <div className="bg-white rounded-xl border border-green-200 overflow-hidden">
        <div className="bg-green-50 px-6 py-5 border-b border-green-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
              <Banknote size={22} className="text-green-700" />
            </div>
            <div>
              <h3 className="font-bold text-green-950">Disbursement completed</h3>
              <p className="text-sm text-green-700 mt-1">₹5,00,000 transferred on 22 Sep 2024.</p>
            </div>
          </div>
          <StatusBadge label="completed" size="sm" />
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            ['SAP Customer Code', 'SAP-240042'],
            ['Bank Reference / UTR', 'UTR20240922001042'],
            ['Credited Account', '****1234 / RATN0000001'],
          ].map(([label, value]) => (
            <div key={label} className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500">{label}</p>
              <p className="text-sm font-semibold text-slate-900 mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 p-5">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Clock size={16} className="text-green-600" />
          Processing Timeline
        </h3>
        <div className="space-y-3">
          {stages.map(([label, done, date]) => (
            <div key={label as string} className="flex items-center gap-3">
              {done ? <CheckCircle2 size={17} className="text-green-600" /> : <Clock size={17} className="text-slate-300" />}
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">{label}</p>
                <p className="text-xs text-slate-400">{date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <Landmark size={18} className="text-slate-500 mt-0.5" />
          <div>
            <p className="font-semibold text-slate-900">Disbursement Advice</p>
            <p className="text-sm text-slate-500 mt-0.5">Official borrower copy with amount, date, bank reference, and account details.</p>
          </div>
        </div>
        <button className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
          <Download size={16} />
          Download Advice
        </button>
      </div>
    </div>
  );
};

export default MP14_DisbursementStatus;

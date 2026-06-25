import React from 'react';
import { Download, IndianRupee } from 'lucide-react';
import StatusBadge from '../../../../components/ui/StatusBadge';

const MP17_Repayments: React.FC = () => {
  const repaymentSchedule = [
    { due: '2024-12-31', principal: 100000, interest: 6000, total: 106000, status: 'paid', paid: '2024-12-28', utr: 'SFPCL2024120010' },
    { due: '2025-03-31', principal: 100000, interest: 5500, total: 105500, status: 'paid', paid: '2025-03-29', utr: 'SFPCL2025030022' },
    { due: '2025-06-30', principal: 100000, interest: 5000, total: 105000, status: 'overdue', paid: null, utr: null },
    { due: '2025-09-30', principal: 100000, interest: 4500, total: 104500, status: 'upcoming', paid: null, utr: null },
    { due: '2025-12-31', principal: 100000, interest: 4000, total: 104000, status: 'upcoming', paid: null, utr: null },
    { due: '2026-03-31', principal: 0,      interest: 3500, total: 3500,   status: 'upcoming', paid: null, utr: null },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Repayment Schedule</h2>
          <p className="text-sm text-slate-500 mt-1">Track your EMIs, view overdue amounts, and download statements.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right mr-2">
            <p className="text-xs text-slate-500">Active Loan</p>
            <p className="text-sm font-bold text-slate-900">LO00000042</p>
          </div>
          <button
            className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Download size={16} className="text-slate-400" />
            Download PDF
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 bg-slate-50 border-b border-slate-100">
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
              <IndianRupee size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Overdue Amount</p>
              <p className="text-lg font-bold text-red-600">₹1,05,000</p>
            </div>
          </div>
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
              <IndianRupee size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Paid</p>
              <p className="text-lg font-bold text-slate-900">₹2,11,500</p>
            </div>
          </div>
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 flex-shrink-0">
              <IndianRupee size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Outstanding Balance</p>
              <p className="text-lg font-bold text-slate-900">₹3,50,000</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Due Date</th>
                <th className="text-right px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Principal</th>
                <th className="text-right px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Interest</th>
                <th className="text-right px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Due</th>
                <th className="text-center px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Payment Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {repaymentSchedule.map((row, i) => (
                <tr key={i} className={`${row.status === 'overdue' ? 'bg-red-50/50' : ''} hover:bg-slate-50 transition-colors group`}>
                  <td className="px-6 py-4 font-medium text-slate-800 whitespace-nowrap">{row.due}</td>
                  <td className="px-4 py-4 text-right text-slate-600 whitespace-nowrap">
                    {row.principal > 0 ? `₹${row.principal.toLocaleString('en-IN')}` : '—'}
                  </td>
                  <td className="px-4 py-4 text-right text-slate-600 whitespace-nowrap">₹{row.interest.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-4 text-right font-bold text-slate-900 whitespace-nowrap">₹{row.total.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-4 text-center whitespace-nowrap">
                    <StatusBadge label={row.status} size="sm" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {row.status === 'paid' ? (
                      <div>
                        <div className="text-xs font-medium text-slate-700">Paid: {row.paid}</div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">Ref: {row.utr}</div>
                      </div>
                    ) : row.status === 'overdue' ? (
                      <div className="text-xs font-medium text-red-600">Please pay immediately</div>
                    ) : (
                      <div className="text-xs text-slate-400">—</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MP17_Repayments;

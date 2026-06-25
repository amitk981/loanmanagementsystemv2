import React from 'react';
import { Download, FileText, MailOpen } from 'lucide-react';
import StatusBadge from '../../../../components/ui/StatusBadge';

const MP19_NoticesLetters: React.FC = () => {
  const notices = [
    { type: 'Deficiency Note', title: 'Bank statement pages requested again', date: '15 Aug 2024', status: 'action_required' },
    { type: 'Sanction Letter', title: 'Loan approved for ₹5,00,000', date: '05 Sep 2024', status: 'available' },
    { type: 'Disbursement Advice', title: 'Funds transferred to registered bank account', date: '22 Sep 2024', status: 'available' },
    { type: 'Repayment Reminder', title: 'Instalment overdue since 30 Jun 2025', date: '02 Jul 2025', status: 'overdue' },
    { type: 'Interest Invoice', title: 'FY 2025 interest invoice', date: '30 Apr 2025', status: 'available' },
    { type: 'NOC', title: 'Available after full repayment and security return', date: 'Pending', status: 'pending' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Notices & Letters</h2>
        <p className="text-sm text-slate-500 mt-1">View official borrower communications and downloadable letters.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
          <MailOpen size={17} className="text-green-600" />
          <h3 className="font-semibold text-slate-900">Communication History</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {notices.map(notice => (
            <div key={`${notice.type}-${notice.date}`} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                  <FileText size={18} className="text-slate-500" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">{notice.type}</p>
                    <StatusBadge label={notice.status} size="sm" />
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{notice.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{notice.date}</p>
                </div>
              </div>
              <button className="flex items-center justify-center gap-2 border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-40" disabled={notice.status === 'pending'}>
                <Download size={15} />
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MP19_NoticesLetters;

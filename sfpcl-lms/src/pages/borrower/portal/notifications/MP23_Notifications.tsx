import React from 'react';
import { Bell, CheckCircle2, Clock, FileWarning } from 'lucide-react';
import StatusBadge from '../../../../components/ui/StatusBadge';

const MP23_Notifications: React.FC = () => {
  const notifications = [
    { title: 'Bank statement deficiency raised', detail: 'February to April pages must be re-uploaded.', time: '15 Aug 2024, 11:40 AM', status: 'action_required', icon: FileWarning },
    { title: 'Sanction approved', detail: 'Your loan has been approved for ₹5,00,000.', time: '05 Sep 2024, 4:15 PM', status: 'read', icon: CheckCircle2 },
    { title: 'Disbursement completed', detail: 'Funds transferred with UTR UTR20240922001042.', time: '22 Sep 2024, 2:30 PM', status: 'read', icon: CheckCircle2 },
    { title: 'Repayment overdue', detail: '₹1,05,000 due from 30 Jun 2025.', time: '02 Jul 2025, 9:00 AM', status: 'overdue', icon: Clock },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Notifications</h2>
        <p className="text-sm text-slate-500 mt-1">All borrower-facing alerts, reminders, and workflow updates.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
          <Bell size={17} className="text-green-600" />
          <h3 className="font-semibold text-slate-900">Notification Center</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {notifications.map(item => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="px-6 py-4 flex items-start justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className={item.status === 'overdue' ? 'text-red-600' : item.status === 'action_required' ? 'text-amber-600' : 'text-green-600'} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    <p className="text-sm text-slate-600 mt-1">{item.detail}</p>
                    <p className="text-xs text-slate-400 mt-1">{item.time}</p>
                  </div>
                </div>
                <StatusBadge label={item.status} size="sm" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MP23_Notifications;

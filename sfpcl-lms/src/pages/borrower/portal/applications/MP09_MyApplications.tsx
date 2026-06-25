import React from 'react';
import { ClipboardList, Plus, FileText, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import StatusBadge from '../../../../components/ui/StatusBadge';

interface MP09_MyApplicationsProps {
  onNavigateToApplication: (id: string) => void;
  onNavigateToNew: () => void;
}

const MP09_MyApplications: React.FC<MP09_MyApplicationsProps> = ({ onNavigateToApplication, onNavigateToNew }) => {
  // Mock applications data
  const applications = [
    {
      id: 'APP-2024-0042',
      date: '10 Aug 2024',
      type: 'Crop Loan',
      amount: '₹5,00,000',
      status: 'pending',
      stage: 'Sanction Approval',
      lastUpdate: '5 Sep 2024'
    },
    {
      id: 'APP-2023-0198',
      date: '15 Jun 2023',
      type: 'Agri Equipment',
      amount: '₹1,50,000',
      status: 'approved',
      stage: 'Disbursed',
      lastUpdate: '20 Jul 2023'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">My Applications</h2>
          <p className="text-sm text-slate-500 mt-1">Track your loan applications and their current status.</p>
        </div>
        <button
          onClick={onNavigateToNew}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus size={16} />
          New Loan Application
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {applications.map(app => (
          <div
            key={app.id}
            onClick={() => onNavigateToApplication(app.id)}
            className="bg-white rounded-xl border border-slate-100 p-5 hover:border-green-200 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${app.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                  {app.status === 'approved' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-green-700 transition-colors">{app.type}</h3>
                  <div className="text-xs text-slate-500 mt-0.5">{app.id}</div>
                </div>
              </div>
              <StatusBadge label={app.status === 'approved' ? 'Active' : 'In Progress'} size="sm" />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-slate-500">Requested Amount</p>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">{app.amount}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Applied On</p>
                <p className="text-sm font-medium text-slate-900 mt-0.5">{app.date}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Current Stage</p>
                <p className="text-sm font-medium text-slate-700 mt-0.5 flex items-center gap-1.5">
                  <ClipboardList size={14} className="text-slate-400" />
                  {app.stage}
                </p>
              </div>
              <ChevronRight size={18} className="text-slate-300 group-hover:text-green-500 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MP09_MyApplications;

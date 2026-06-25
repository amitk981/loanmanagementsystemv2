import React from 'react';
import {
  CheckCircle2, AlertTriangle, CreditCard, IndianRupee, Calendar,
  AlertCircle, Clock, Shield, Leaf, FileCheck, Signature, Landmark,
  ClipboardList, MessageSquare, Phone
} from 'lucide-react';
import StatusBadge from '../../../components/ui/StatusBadge';
import { useRole } from '../../../contexts/RoleContext';
import { BorrowerTab } from './MemberPortalLayout';

interface DashboardProps {
  onNavigate: (tab: BorrowerTab) => void;
}

const MP03_Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { currentUser } = useRole();

  return (
    <div className="space-y-4">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-5 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <p className="text-green-100 text-sm mb-1">Welcome back</p>
            <h2 className="text-2xl font-bold">{currentUser.name}</h2>
            <p className="text-green-100 text-sm mt-1">Folio: M-00042 · Shares: 5 · Member since 2019</p>
            <div className="mt-2 inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              <CheckCircle2 size={11} /> Active Member ✓
            </div>
          </div>
          <div className="sm:text-right">
            <p className="text-green-100 text-xs mb-1">Outstanding Loan</p>
            <p className="text-2xl font-bold">₹3,50,000</p>
            <p className="text-green-100 text-xs mt-1">Loan No. LO00000042</p>
          </div>
        </div>
        
        {/* Overdue alert */}
        <div className="mt-4 bg-red-900/50 border border-red-300/40 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center gap-3">
          <AlertTriangle size={18} className="text-red-200 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white">Instalment overdue</p>
            <p className="text-xs text-red-100">₹1,05,000 due on 30 Jun 2025 — please contact your SFPCL officer</p>
          </div>
          <button onClick={() => onNavigate('repayments')} className="sm:ml-auto flex-shrink-0 text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg transition-colors">
            View Schedule
          </button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Loan Amount', value: '₹5,00,000', icon: <CreditCard size={16} />, color: 'text-green-600' },
          { label: 'Outstanding', value: '₹3,50,000', icon: <IndianRupee size={16} />, color: 'text-red-500' },
          { label: 'EMIs Paid', value: '2 of 5', icon: <CheckCircle2 size={16} />, color: 'text-green-600' },
          { label: 'Next Due', value: '30 Sep 2025', icon: <Calendar size={16} />, color: 'text-amber-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-slate-100">
            <div className={`${s.color} mb-2`}>{s.icon}</div>
            <div className="text-lg font-bold text-slate-900">{s.value}</div>
            <div className="text-xs text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Pending Actions */}
      <div className="bg-white rounded-xl border border-slate-100 p-6">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <AlertCircle size={16} className="text-amber-500" />
          Pending Actions
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3">
            <AlertTriangle size={15} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-red-800">Overdue instalment — ₹1,05,000</p>
              <p className="text-xs text-red-600 mt-0.5">Due: 30 June 2025 · Loan No. LO00000042 · Contact your SFPCL officer immediately</p>
            </div>
            <button onClick={() => onNavigate('repayments')} className="flex-shrink-0 text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors">View</button>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <AlertTriangle size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-800">Bank statement deficiency open</p>
              <p className="text-xs text-amber-700 mt-0.5">February to April pages requested — upload corrected statement via Application Status</p>
            </div>
            <button onClick={() => onNavigate('application')} className="flex-shrink-0 text-xs bg-amber-600 text-white px-3 py-1.5 rounded-lg hover:bg-amber-700 transition-colors">Respond</button>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <Clock size={15} className="text-slate-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700">Re-KYC due: 30 September 2026</p>
              <p className="text-xs text-slate-500 mt-0.5">Ensure your PAN and Aadhaar copies are updated before the re-KYC deadline</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Member & Eligibility */}
        <div className="bg-white rounded-xl border border-slate-100 p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Shield size={16} className="text-green-600" />
            Member &amp; Eligibility
          </h3>
          <div className="space-y-2.5">
            {[
              ['Member Type', 'Individual Farmer'],
              ['Folio Number', 'M-00042'],
              ['Shares Held', '5 shares (Physical)'],
              ['Land Under Cultivation', '4.5 acres'],
              ['Produce Supply', '5 consecutive years'],
              ['4-Year Rule', 'Met ✓'],
              ['KYC Status', 'Verified ✓'],
              ['Re-KYC Due', '30 September 2026'],
              ['Default Status', 'No default on record'],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between text-sm border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                <span className="text-slate-500">{k}</span>
                <span className="font-medium text-slate-900 text-right">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* My Loan Details */}
        <div className="bg-white rounded-xl border border-slate-100 p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Leaf size={16} className="text-green-600" />
            My Loan Details
          </h3>
          <div className="space-y-2.5">
            {[
              ['Loan Account', 'LO00000042'],
              ['Sanctioned Amount', '₹5,00,000'],
              ['Outstanding Principal', '₹3,50,000'],
              ['Interest Rate', '12% p.a.'],
              ['Loan Type', 'Short-term (1 year)'],
              ['Purpose', 'Crop Production'],
              ['Next Instalment', '₹1,04,500 on 30 Sep 2025'],
              ['Repayment Mode', 'Direct / Subsidiary deduction'],
              ['Disbursed On', '22 September 2024'],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between text-sm border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                <span className="text-slate-500">{k}</span>
                <span className="font-medium text-slate-900 text-right">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Instruments */}
      <div className="bg-white rounded-xl border border-slate-100 p-6">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Shield size={16} className="text-green-600" />
          Security Instruments
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { doc: 'Share Certificate (SH-4)', status: 'held', note: 'Held in custody by Company Secretary', icon: <FileCheck size={15} className="text-slate-400" /> },
            { doc: 'Power of Attorney', status: 'notarised', note: 'Notarised and executed', icon: <Signature size={15} className="text-slate-400" /> },
            { doc: 'Blank-Dated Cheque', status: 'held', note: 'Held in custody by SFPCL', icon: <Landmark size={15} className="text-slate-400" /> },
          ].map(item => (
            <div key={item.doc} className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50">
              <div className="mt-0.5 flex-shrink-0">{item.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-800 mb-1">{item.doc}</div>
                <div className="text-xs text-slate-400 mb-2">{item.note}</div>
                <StatusBadge label={item.status} size="sm" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'New Loan Application', icon: <ClipboardList size={20} />, style: 'bg-green-600 hover:bg-green-700 text-white shadow-sm shadow-green-200', tab: 'newApplication' },
          { label: 'Repayment Schedule', icon: <IndianRupee size={20} />, style: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200', tab: 'repayments' },
          { label: 'My Documents', icon: <FileCheck size={20} />, style: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200', tab: 'documents' },
          { label: 'Raise Grievance', icon: <MessageSquare size={20} />, style: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200', tab: 'grievance' },
        ].map(action => (
          <button
            key={action.label}
            onClick={() => onNavigate(action.tab as BorrowerTab)}
            className={`flex flex-col items-center justify-center gap-2 rounded-xl p-4 text-sm font-medium transition-colors ${action.style}`}
          >
            {action.icon}
            <span className="text-center leading-tight">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Contact Officer */}
      <div className="bg-white rounded-xl border border-slate-100 p-6">
        <h3 className="font-semibold text-slate-900 mb-1">Contact Your Officer</h3>
        <p className="text-xs text-slate-500 mb-4">For queries about your loan, repayment or documents, reach out to your assigned SFPCL credit officer.</p>
        <div className="flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors">
            <Phone size={16} />
            Call Officer
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
            <MessageSquare size={16} />
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default MP03_Dashboard;

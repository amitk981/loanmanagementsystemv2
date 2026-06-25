import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Clock, AlertTriangle, ChevronRight, History, Landmark, ClipboardList, Shield, UserRound, Signature, AlertCircle } from 'lucide-react';
import StatusBadge from '../../../../components/ui/StatusBadge';

interface MP10_ApplicationStatusProps {
  applicationId: string;
  onBack: () => void;
}

const MP10_ApplicationStatus: React.FC<MP10_ApplicationStatusProps> = ({ applicationId, onBack }) => {
  const [activeTab, setActiveTab] = useState<'progress' | 'data'>('progress');

  const loanStages = [
    { label: 'Application Submitted',   done: true,  date: '10 Aug 2024', owner: 'Borrower' },
    { label: 'Completeness Check',      done: true,  date: '20 Aug 2024', owner: 'Deputy Manager - Finance' },
    { label: 'Appraisal & Eligibility', done: true,  date: '29 Aug 2024', owner: 'Credit Manager' },
    { label: 'Sanction Approval',       done: true,  date: '05 Sep 2024', owner: 'Sanction Committee' },
    { label: 'Documentation',           done: true,  date: '18 Sep 2024', owner: 'Company Secretary' },
    { label: 'SAP Setup',               done: true,  date: '21 Sep 2024', owner: 'Senior Manager - Finance' },
    { label: 'Disbursement',            done: true,  date: '22 Sep 2024', owner: 'CFC' },
    { label: 'Active Loan / Monitoring', done: true, date: 'Ongoing', owner: 'Credit and Accounts' },
    { label: 'Closure / NOC',           done: false, date: null, owner: 'Compliance and CS' },
  ];

  const applicationFieldSections = [
    {
      title: 'Borrower Details',
      icon: UserRound,
      rows: [
        ['Application Channel', 'Digital Portal'],
        ['Member ID', 'MEM-00042'],
        ['Full Legal Name', 'Ganesh Thorat'],
        ['PAN', 'ABCDE1234F'],
        ['Mobile Number', '+91 98765 43210'],
      ],
    },
    {
      title: 'Membership & Eligibility',
      icon: Shield,
      rows: [
        ['Member Type', 'Individual Farmer'],
        ['Shares Held', '5 shares'],
        ['Produce Supply History', '5 consecutive years'],
        ['Land Area Under Cultivation', '4.5 acres'],
        ['Default Flag', 'No default on record'],
      ],
    },
    {
      title: 'Loan Request',
      icon: ClipboardList,
      rows: [
        ['Required Loan Amount', '₹5,00,000'],
        ['Eligible Amount', '₹5,00,000'],
        ['Loan Purpose', 'Crop production'],
        ['Loan Type', 'Short-term'],
        ['Requested Tenure', '12 months'],
      ],
    },
    {
      title: 'Nominee & Signatures',
      icon: Signature,
      rows: [
        ['Nominee Name', 'Suman Thorat'],
        ['Relationship', 'Spouse'],
        ['Nominee PAN', 'FGHIJ5678K'],
        ['Completeness Status', 'One deficiency open'],
      ],
    },
  ];

  const validationMessages = [
    { label: 'Member and folio details captured', status: 'passed' },
    { label: 'Loan purpose is agriculture / crop production related', status: 'passed' },
    { label: 'Nominee is not a minor and KYC is attached', status: 'passed' },
    { label: 'Bank statement pages for February to April must be re-uploaded', status: 'attention' },
  ];

  const auditSnapshot = [
    { at: '10 Aug 2024, 10:22 AM', by: 'Ganesh Thorat', role: 'Borrower / Member', action: 'Application submitted', evidence: 'Portal submission v1' },
    { at: '15 Aug 2024, 11:40 AM', by: 'Suresh Patil', role: 'Deputy Manager - Finance', action: 'Deficiency raised', evidence: 'Bank statement pages missing' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Application {applicationId}</h2>
            <StatusBadge label="pending" size="sm" />
          </div>
          <p className="text-sm text-slate-500 mt-1">Crop Loan • ₹5,00,000 • Submitted 10 Aug 2024</p>
        </div>
      </div>

      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('progress')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'progress' ? 'border-green-600 text-green-700' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Track Progress
        </button>
        <button
          onClick={() => setActiveTab('data')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'data' ? 'border-green-600 text-green-700' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Submitted Data & Deficiencies
        </button>
      </div>

      {activeTab === 'progress' && (
        <div className="bg-white rounded-xl border border-slate-100 p-6">
          <h3 className="font-semibold text-slate-900 mb-6">Application Journey</h3>
          <div className="space-y-0">
            {loanStages.map((stage, i) => (
              <div key={stage.label} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    stage.done ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {stage.done ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                  </div>
                  {i < loanStages.length - 1 && (
                    <div className={`w-0.5 flex-1 my-1 min-h-[24px] ${stage.done ? 'bg-green-300' : 'bg-slate-100'}`} />
                  )}
                </div>
                <div className="pb-6 flex-1">
                  <div className={`text-sm font-medium ${stage.done ? 'text-slate-900' : 'text-slate-400'}`}>
                    {stage.label}
                  </div>
                  {stage.date && (
                    <div className="text-xs text-slate-400 mt-0.5">{stage.date}</div>
                  )}
                  <div className="text-xs text-slate-500 mt-1">Owner: {stage.owner}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'data' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <AlertCircle size={16} className="text-amber-600" />
                Validations & Deficiency Response
              </h3>
              <div className="space-y-3">
                {validationMessages.map(item => (
                  <div
                    key={item.label}
                    className={`flex items-start gap-3 rounded-lg border p-3 text-sm ${
                      item.status === 'passed'
                        ? 'border-green-100 bg-green-50 text-green-800'
                        : 'border-amber-200 bg-amber-50 text-amber-800'
                    }`}
                  >
                    {item.status === 'passed'
                      ? <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
                      : <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />}
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg border border-slate-200 p-4">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Borrower response</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  placeholder="Add a note for the officer before uploading the corrected bank statement"
                />
                <button className="mt-3 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  <ChevronRight size={15} />
                  Submit Deficiency Response
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <History size={16} className="text-green-600" />
                Borrower-Visible Audit Snapshot
              </h3>
              <div className="space-y-3">
                {auditSnapshot.map(item => (
                  <div key={`${item.at}-${item.action}`} className="border-l-2 border-green-200 pl-3 py-1">
                    <div className="text-sm font-medium text-slate-900">{item.action}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{item.at} · {item.by} · {item.role}</div>
                    <div className="text-xs text-slate-400 mt-1">Evidence: {item.evidence}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {applicationFieldSections.map(section => {
              const Icon = section.icon;
              return (
                <div key={section.title} className="bg-white rounded-xl border border-slate-100 p-5">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Icon size={16} className="text-green-600" />
                    {section.title}
                  </h3>
                  <div className="space-y-3">
                    {section.rows.map(([label, value]) => (
                      <div key={label} className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-1 sm:gap-3 text-sm">
                        <div className="text-slate-500">{label}</div>
                        <div className="font-medium text-slate-900 break-words">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};

export default MP10_ApplicationStatus;

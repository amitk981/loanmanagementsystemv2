import React, { useState } from 'react';
import { IndianRupee, Download, Clock, History, FileText, Phone, CheckCircle2, Calendar, Shield, AlertTriangle } from 'lucide-react';
import StatusBadge from '../../../../components/ui/StatusBadge';

const MP15_MyLoans: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  const activeLoan = {
    loanNo: 'LO00000042',
    disbursedOn: '22 September 2024',
    sanctionedAmount: 500000,
    outstandingPrincipal: 350000,
    purpose: 'Crop Production (Grapes & Tomato)',
    tenure: '12 months',
    interestRate: '12% p.a.',
    nextDue: '₹1,04,500 on 30 Sep 2025',
    repaymentMode: 'Direct / Subsidiary deduction',
    disbursementUtr: 'UTR2409220042',
    statementPeriod: 'Sep 2024 - Jun 2025',
    closureStatus: 'Not ready',
  };

  const activeRepaymentSchedule = [
    { due: '31 Dec 2024', principal: 100000, interest: 6000, total: 106000, status: 'paid', paidOn: '28 Dec 2024' },
    { due: '31 Mar 2025', principal: 100000, interest: 5500, total: 105500, status: 'paid', paidOn: '29 Mar 2025' },
    { due: '30 Jun 2025', principal: 100000, interest: 5000, total: 105000, status: 'overdue', paidOn: 'Pending' },
    { due: '30 Sep 2025', principal: 100000, interest: 4500, total: 104500, status: 'upcoming', paidOn: 'Pending' },
  ];

  const activeStatementRows = [
    { date: '22 Sep 2024', particulars: 'Loan disbursement', debit: 500000, credit: 0, balance: 500000 },
    { date: '28 Dec 2024', particulars: 'Repayment received', debit: 0, credit: 106000, balance: 400000 },
    { date: '29 Mar 2025', particulars: 'Repayment received', debit: 0, credit: 105500, balance: 300000 },
    { date: '30 Jun 2025', particulars: 'Interest accrued', debit: 5000, credit: 0, balance: 305000 },
  ];

  const activeDocuments = [
    { name: 'Sanction Letter', status: 'available', date: '15 Sep 2024' },
    { name: 'Loan Agreement', status: 'available', date: '18 Sep 2024' },
    { name: 'Disbursement Advice', status: 'available', date: '22 Sep 2024' },
    { name: 'Repayment Schedule', status: 'available', date: '22 Sep 2024' },
    { name: 'NOC', status: 'pending', date: 'After full repayment' },
  ];

  const closureReadiness = [
    { label: 'Outstanding principal zero', status: 'pending' },
    { label: 'Interest and dues cleared', status: 'pending' },
    { label: 'Security return / CDSL unpledge', status: 'not_started' },
    { label: 'NOC publication', status: 'not_started' },
  ];

  const activeNotices = [
    { title: 'Repayment reminder', date: '20 Jun 2025', status: 'sent' },
    { title: 'Interest invoice FY 2024-25', date: '05 Apr 2025', status: 'available' },
  ];

  const loanHistory = [
    {
      loanNo: 'LO00000021',
      disbursedOn: '15 September 2022',
      closedOn: '20 March 2023',
      sanctionedAmount: 300000,
      purpose: 'Crop Production (Grapes, Kharif 2022)',
      tenure: '6 months',
      interestRate: '12% p.a.',
      totalInterestPaid: 18000,
      totalPrincipalPaid: 300000,
      repaymentMode: 'Direct RTGS',
      nocIssued: true,
      nocDate: '25 March 2023',
      securityReturned: true,
      status: 'closed',
      repayments: [
        { due: '2022-12-31', principal: 150000, interest: 9000, status: 'paid', utr: 'SFPCL2022120009' },
        { due: '2023-03-20', principal: 150000, interest: 9000, status: 'paid', utr: 'SFPCL2023031415' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">My Loans</h2>
        <p className="text-sm text-slate-500 mt-1">View your active loan details and past loan history.</p>
      </div>

      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'active' ? 'border-green-600 text-green-700' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Clock size={16} /> Active Loan
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'history' ? 'border-green-600 text-green-700' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <History size={16} /> Loan History
        </button>
      </div>

      {activeTab === 'active' && (
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-green-100 text-sm mb-1">Outstanding Principal</p>
                <h2 className="text-3xl font-bold">₹{activeLoan.outstandingPrincipal.toLocaleString('en-IN')}</h2>
                <div className="mt-2 inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-300"></span>
                  Active Loan ({activeLoan.loanNo})
                </div>
              </div>
              <div className="sm:text-right">
                <p className="text-green-100 text-xs mb-1">Sanctioned Amount</p>
                <p className="text-xl font-semibold">₹{activeLoan.sanctionedAmount.toLocaleString('en-IN')}</p>
                <p className="text-green-100 text-xs mt-1">Disbursed: {activeLoan.disbursedOn}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Loan Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
              {[
                ['Purpose', activeLoan.purpose],
                ['Interest Rate', activeLoan.interestRate],
                ['Tenure', activeLoan.tenure],
                ['Repayment Mode', activeLoan.repaymentMode],
                ['Next Instalment', activeLoan.nextDue],
              ].map(([k, v]) => (
                <div key={k} className="border-b border-slate-50 pb-2">
                  <div className="text-xs text-slate-500">{k}</div>
                  <div className="text-sm font-medium text-slate-900 mt-1">{v}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 bg-green-50 text-green-700 hover:bg-green-100 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border border-green-200">
                <IndianRupee size={16} /> View Repayments
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-white text-slate-700 hover:bg-slate-50 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border border-slate-200">
                <FileText size={16} /> Loan Statement
              </button>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 border border-slate-100 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <Calendar size={15} className="text-green-600" />
                    Repayment Schedule
                  </h4>
                  <span className="text-xs text-slate-500">Principal-first allocation</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-white border-b border-slate-100">
                        {['Due Date', 'Principal', 'Interest', 'Total', 'Status', 'Paid On'].map(header => (
                          <th key={header} className="px-4 py-2 text-left text-xs font-semibold text-slate-500">{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {activeRepaymentSchedule.map(row => (
                        <tr key={row.due} className={row.status === 'overdue' ? 'bg-red-50/40' : 'hover:bg-slate-50'}>
                          <td className="px-4 py-3 text-slate-700">{row.due}</td>
                          <td className="px-4 py-3 text-slate-700">₹{row.principal.toLocaleString('en-IN')}</td>
                          <td className="px-4 py-3 text-slate-700">₹{row.interest.toLocaleString('en-IN')}</td>
                          <td className="px-4 py-3 font-semibold text-slate-900">₹{row.total.toLocaleString('en-IN')}</td>
                          <td className="px-4 py-3"><StatusBadge label={row.status} size="sm" /></td>
                          <td className="px-4 py-3 text-slate-500">{row.paidOn}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border border-slate-100 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <AlertTriangle size={15} className="text-amber-600" />
                  Notices Linked to Loan
                </h4>
                <div className="mt-3 space-y-3">
                  {activeNotices.map(notice => (
                    <div key={notice.title} className="flex items-start justify-between gap-3 rounded-lg bg-slate-50 p-3">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{notice.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{notice.date}</p>
                      </div>
                      <StatusBadge label={notice.status} size="sm" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="border border-slate-100 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                  <h4 className="text-sm font-semibold text-slate-900">Loan Statement</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{activeLoan.statementPeriod} · Disbursement UTR {activeLoan.disbursementUtr}</p>
                </div>
                <div className="divide-y divide-slate-50">
                  {activeStatementRows.map(row => (
                    <div key={`${row.date}-${row.particulars}`} className="grid grid-cols-5 gap-2 px-4 py-3 text-xs">
                      <div className="text-slate-500">{row.date}</div>
                      <div className="col-span-2 text-slate-800">{row.particulars}</div>
                      <div className="text-right text-slate-600">{row.debit ? `₹${row.debit.toLocaleString('en-IN')}` : '—'}</div>
                      <div className="text-right font-semibold text-slate-900">₹{row.balance.toLocaleString('en-IN')}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-slate-100 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                  <h4 className="text-sm font-semibold text-slate-900">Loan Documents</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Borrower-facing copies and closure documents</p>
                </div>
                <div className="divide-y divide-slate-50">
                  {activeDocuments.map(doc => (
                    <div key={doc.name} className="flex items-center justify-between gap-3 px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{doc.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{doc.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge label={doc.status} size="sm" />
                        {doc.status === 'available' && (
                          <button className="p-1.5 text-green-700 hover:bg-green-50 rounded-lg" title="Download document">
                            <Download size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 border border-slate-100 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Shield size={15} className="text-green-600" />
                Closure Readiness
              </h4>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {closureReadiness.map(item => (
                  <div key={item.label} className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">{item.label}</p>
                    <div className="mt-2"><StatusBadge label={item.status} size="sm" /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-4">
          {loanHistory.map(loan => (
            <div key={loan.loanNo} className="bg-white rounded-xl border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    {loan.purpose}
                    <StatusBadge label={loan.status} size="sm" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Loan No: {loan.loanNo} • Disbursed: {loan.disbursedOn}</p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-900">₹{loan.sanctionedAmount.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-slate-500">Sanctioned Amount</p>
                </div>
              </div>
              <div className="p-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Closed On</p>
                  <p className="text-sm font-medium text-slate-900 mt-0.5">{loan.closedOn}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Total Interest Paid</p>
                  <p className="text-sm font-medium text-slate-900 mt-0.5">₹{loan.totalInterestPaid.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Tenure</p>
                  <p className="text-sm font-medium text-slate-900 mt-0.5">{loan.tenure}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Security Returned</p>
                  <p className="text-sm font-medium text-slate-900 mt-0.5 flex items-center gap-1">
                    {loan.securityReturned && <CheckCircle2 size={14} className="text-green-600" />} Yes
                  </p>
                </div>
              </div>
              <div className="px-6 pb-6 pt-2">
                <div className="p-4 bg-green-50 border border-green-100 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-green-900">No Objection Certificate (NOC)</p>
                    <p className="text-xs text-green-700 mt-0.5">Issued on {loan.nocDate}</p>
                  </div>
                  <button className="flex items-center gap-1.5 text-xs font-medium text-green-700 bg-white border border-green-200 px-3 py-2 rounded-lg hover:bg-green-50 transition-colors">
                    <Download size={14} /> Download NOC
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="bg-white rounded-xl border border-slate-100 p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-800">Need a statement for an older loan?</p>
              <p className="text-xs text-slate-500 mt-0.5">Contact your SFPCL credit officer to request a full ledger or NOC copy for loans not listed here.</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button className="flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded-lg hover:bg-green-100 transition-colors">
                <Phone size={13} /> Call Officer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MP15_MyLoans;

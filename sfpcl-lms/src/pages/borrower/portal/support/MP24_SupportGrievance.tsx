import React, { useState } from 'react';
import { MessageSquareWarning, Send, Search, Phone, Mail, Clock, CheckCircle2 } from 'lucide-react';
import StatusBadge from '../../../../components/ui/StatusBadge';

const MP24_SupportGrievance: React.FC = () => {
  const [grievanceSubject, setGrievanceSubject] = useState('');
  const [grievanceText, setGrievanceText] = useState('');
  const [submittedGrievance, setSubmittedGrievance] = useState(false);

  const grievances = [
    { id: 'GR-001', subject: 'Interest calculation query on Dec 2024 instalment', status: 'resolved', date: '10 Jan 2025', response: 'Interest calculated at 12% p.a. on outstanding principal as per loan agreement.' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Support & Grievance</h2>
          <p className="text-sm text-slate-500 mt-1">Raise tickets, track resolutions, and contact your designated officer.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <MessageSquareWarning size={18} className="text-amber-600" />
                Raise a New Grievance
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {submittedGrievance ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <CheckCircle2 size={32} className="mx-auto text-green-600 mb-3" />
                  <h4 className="font-semibold text-green-900 mb-1">Grievance Submitted</h4>
                  <p className="text-sm text-green-700">Your grievance has been logged successfully (Ticket #GR-043). An officer will respond within 48 hours.</p>
                  <button 
                    onClick={() => setSubmittedGrievance(false)}
                    className="mt-4 px-4 py-2 bg-white border border-green-200 text-green-700 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors"
                  >
                    Raise Another Issue
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Related Loan / Topic</label>
                    <select className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                      <option>Loan LO00000042</option>
                      <option>General Membership / Shareholding</option>
                      <option>Produce Supply / Payments</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Brief description of the issue"
                      value={grievanceSubject}
                      onChange={(e) => setGrievanceSubject(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                      placeholder="Please provide details about your issue..."
                      value={grievanceText}
                      onChange={(e) => setGrievanceText(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => setSubmittedGrievance(true)}
                      disabled={!grievanceSubject || !grievanceText}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Send size={16} />
                      Submit Grievance
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Past Grievances</h3>
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search tickets..." 
                  className="pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>
            <div className="divide-y divide-slate-50">
              {grievances.map(g => (
                <div key={g.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-slate-900">{g.subject}</h4>
                      <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                        <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{g.id}</span>
                        <span>•</span>
                        <span>Logged on {g.date}</span>
                      </div>
                    </div>
                    <StatusBadge label={g.status} size="sm" />
                  </div>
                  {g.response && (
                    <div className="mt-4 bg-slate-50 border border-slate-200 rounded-lg p-4">
                      <p className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                        <MessageSquareWarning size={14} className="text-slate-400" /> SFPCL Response
                      </p>
                      <p className="text-sm text-slate-600">{g.response}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-100 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone size={14} className="text-slate-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Toll-Free Helpline</p>
                  <p className="text-sm font-medium text-slate-900 mt-0.5">1800 123 4567</p>
                  <p className="text-xs text-slate-400 mt-0.5">Mon-Sat, 9am to 6pm</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail size={14} className="text-slate-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Email Support</p>
                  <p className="text-sm font-medium text-slate-900 mt-0.5">support@sfpcl.in</p>
                </div>
              </div>
            </div>
            
            <hr className="my-5 border-slate-100" />
            
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Your Designated Officer</h4>
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-slate-900">Suresh Patil</p>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-green-700 bg-green-100 px-2 py-0.5 rounded">Credit</span>
              </div>
              <p className="text-xs text-slate-600">Deputy Manager - Finance</p>
              <div className="mt-3 flex gap-2">
                <button className="flex-1 bg-white border border-slate-200 text-slate-700 text-xs font-medium py-1.5 rounded hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5">
                  <Phone size={12} /> Call
                </button>
                <button className="flex-1 bg-white border border-slate-200 text-slate-700 text-xs font-medium py-1.5 rounded hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5">
                  <Mail size={12} /> Email
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
            <h4 className="text-sm font-semibold text-amber-900 flex items-center gap-2 mb-2">
              <Clock size={16} /> SLA Notice
            </h4>
            <p className="text-xs text-amber-800 leading-relaxed">
              Standard grievances are resolved within 2-3 working days. For urgent disbursement or repayment issues, please call the toll-free helpline directly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MP24_SupportGrievance;

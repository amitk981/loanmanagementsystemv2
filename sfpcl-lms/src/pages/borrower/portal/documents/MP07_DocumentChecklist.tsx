import React, { useState } from 'react';
import { FileText, Download, Upload, Info } from 'lucide-react';
import StatusBadge from '../../../../components/ui/StatusBadge';

const MP07_DocumentChecklist: React.FC = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);

  const myDocuments = [
    { name: 'PAN Card Copy',              status: 'verified',   date: '2024-08-10', section: 'KYC', note: 'Self-attested borrower copy' },
    { name: 'Aadhaar Card Copy',          status: 'verified',   date: '2024-08-10', section: 'KYC', note: 'Masked display; full value restricted' },
    { name: 'Nominee PAN and Aadhaar',    status: 'verified',   date: '2024-08-12', section: 'Nominee', note: 'Includes signed nominee declaration' },
    { name: 'Share Certificate Copy',     status: 'verified',   date: '2024-08-12', section: 'Shareholding', note: 'Folio M-00042; 5 shares' },
    { name: '7/12 Extract',               status: 'verified',   date: '2024-08-14', section: 'Land', note: '4.5 acres under cultivation' },
    { name: 'Crop Plan',                  status: 'verified',   date: '2024-08-14', section: 'Crop', note: 'Grapes and tomato cultivation plan' },
    { name: 'Six-Month Bank Statement',   status: 'deficient',  date: '2024-08-15', section: 'Bank', note: 'February to April pages requested again' },
    { name: 'Term Sheet',                 status: 'available',  date: '2024-09-15', section: 'Sanction', note: 'Signed by CFO for amount up to ₹5,00,000' },
    { name: 'Loan Agreement',             status: 'available',  date: '2024-09-18', section: 'Legal', note: 'Stamped and notarised' },
    { name: 'Disbursement Advice',        status: 'available',  date: '2024-09-22', section: 'Disbursement', note: 'UTR retained in loan file' },
    { name: 'Repayment Schedule',         status: 'available',  date: '2024-09-22', section: 'Repayment', note: 'Principal-first allocation' },
    { name: 'FY 2025 Interest Invoice',   status: 'available',  date: '2025-04-30', section: 'Interest', note: 'Yearly interest invoice' },
    { name: 'NOC',                        status: 'pending',    date: null,         section: 'Closure', note: 'Available after full repayment and security return' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">My Documents</h2>
          <p className="text-sm text-slate-500 mt-1">Access all your loan-related and KYC documents in one place.</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Upload size={16} />
          Upload Document
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-900">Document Checklist</h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Info size={14} className="text-slate-400" />
            <span>Deficient documents require re-upload</span>
          </div>
        </div>
        
        <div className="divide-y divide-slate-50">
          {myDocuments.map(doc => (
            <div key={doc.name} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-start sm:items-center gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  doc.status === 'available' || doc.status === 'verified' ? 'bg-green-50' :
                  doc.status === 'deficient' ? 'bg-red-50' : 'bg-amber-50'
                }`}>
                  <FileText
                    size={20}
                    className={
                      doc.status === 'available' || doc.status === 'verified' ? 'text-green-600' :
                      doc.status === 'deficient' ? 'text-red-600' : 'text-amber-600'
                    }
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <div className="text-sm font-semibold text-slate-800">{doc.name}</div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 bg-slate-100 rounded px-2 py-0.5">{doc.section}</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    {doc.date ? `Updated on ${doc.date}` : 'Not yet available'} • {doc.note}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center sm:justify-end gap-3 w-full sm:w-auto">
                {doc.status === 'available' || doc.status === 'verified' ? (
                  <button className="flex items-center justify-center flex-1 sm:flex-none gap-1.5 text-sm bg-white border border-slate-200 text-slate-700 font-medium px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <Download size={16} className="text-slate-400" />
                    {doc.status === 'verified' ? 'View' : 'Download'}
                  </button>
                ) : doc.status === 'deficient' ? (
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center justify-center flex-1 sm:flex-none gap-1.5 text-sm bg-red-50 text-red-700 border border-red-200 font-medium px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Upload size={16} />
                    Re-upload
                  </button>
                ) : (
                  <div className="flex-1 sm:flex-none flex justify-center sm:justify-end">
                    <StatusBadge label="pending" size="sm" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Upload Document</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Document Type</label>
                <select className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                  <option>Six-Month Bank Statement</option>
                  <option>PAN Card</option>
                  <option>Aadhaar Card</option>
                  <option>Nominee PAN/Aadhaar</option>
                  <option>Share Certificate Copy</option>
                  <option>7/12 Extract</option>
                  <option>Crop Plan</option>
                  <option>Borrower/Nominee Signature Page</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="border-2 border-dashed border-slate-200 hover:border-green-400 hover:bg-green-50 transition-colors rounded-xl p-8 text-center cursor-pointer group">
                <Upload size={28} className="mx-auto text-slate-300 group-hover:text-green-500 mb-3 transition-colors" />
                <p className="text-sm font-medium text-slate-700 group-hover:text-green-700">Click to select file or drag and drop</p>
                <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG • Max 5 MB</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MP07_DocumentChecklist;

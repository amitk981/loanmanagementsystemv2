import React from 'react';
import { Shield, FileCheck, Landmark, Edit3, Eye, Download, UserRound, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import StatusBadge from '../../../components/ui/StatusBadge';
import { useRole } from '../../../contexts/RoleContext';
import Tabs from '../../../components/ui/Tabs';

const MP04_MyProfile: React.FC = () => {
  const { currentUser } = useRole();

  const TABS = [
    { id: 'member', label: 'Member Details' },
    { id: 'contact', label: 'Contact Details' },
    { id: 'nominee', label: 'Nominee Details' },
    { id: 'shareholding', label: 'Shareholding' },
    { id: 'land', label: 'Land & Crop Details' },
    { id: 'bank', label: 'Bank Details' },
    { id: 'kyc', label: 'KYC Status' },
  ];

  return (
    <div className="space-y-4">
      {/* Profile Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex gap-4 items-start">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-2xl flex-shrink-0">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{currentUser.name}</h2>
            <p className="text-sm text-slate-500">Folio Number: M-00042</p>
            <div className="flex gap-2 mt-2">
              <StatusBadge label="Active Member" size="sm" />
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                Individual Farmer
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 min-w-[200px]">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <p className="text-xs text-slate-500 mb-1">Profile Completion</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[95%]"></div>
              </div>
              <span className="text-xs font-bold text-slate-700">95%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col min-h-[500px]">
        <Tabs tabs={TABS}>
          
          {/* Tab 1: Member Details */}
          <div className="p-6">
            <div className="max-w-3xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 text-lg">Member Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Full Name</p>
                  <p className="font-medium text-slate-900">{currentUser.name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Member Type</p>
                  <p className="font-medium text-slate-900">Individual Farmer</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Folio Number</p>
                  <p className="font-medium text-slate-900 font-mono">M-00042</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Active Status</p>
                  <p className="font-medium text-slate-900">Active (Since 12 May 2019)</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Shares Held</p>
                  <p className="font-medium text-slate-900">5 (Physical mode)</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Primary Produce</p>
                  <p className="font-medium text-slate-900">Grapes, Tomato</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab 2: Contact Details */}
          <div className="p-6">
            <div className="max-w-3xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-slate-900 text-lg">Contact & Address</h3>
                <button className="flex items-center gap-1.5 text-sm font-medium text-green-700 hover:text-green-800">
                  <Edit3 size={16} /> Edit Contact
                </button>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50">
                  <Phone className="text-slate-400 mt-0.5" size={20} />
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Mobile Number</p>
                    <p className="font-medium text-slate-900">+91 98765 43210</p>
                    <p className="text-xs text-green-600 font-medium mt-1">Verified via OTP</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50">
                  <MapPin className="text-slate-400 mt-0.5" size={20} />
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Registered Address</p>
                    <p className="font-medium text-slate-900 leading-relaxed">
                      At Post Mohadi, Tal. Dindori,<br />
                      Nashik, Maharashtra - 422202
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Self-declared update. Subject to verification for legal documents.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab 3: Nominee Details */}
          <div className="p-6">
            <div className="max-w-3xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-slate-900 text-lg">Registered Nominee</h3>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Nominee Name</p>
                    <p className="font-medium text-slate-900">Suman Thorat</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Relationship</p>
                    <p className="font-medium text-slate-900">Spouse</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Age</p>
                    <p className="font-medium text-slate-900">42 Years (Adult)</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Nominee PAN</p>
                    <p className="font-medium text-slate-900 font-mono text-sm tracking-wider">XXXXX5678K</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab 4: Shareholding */}
          <div className="p-0">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Certificate No</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Issue Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Quantity</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">SFPCL-C-0021</td>
                  <td className="px-6 py-4 text-slate-600">12 May 2019</td>
                  <td className="px-6 py-4 font-medium text-slate-900">5</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                      <CheckCircle2 size={12} /> Active (Physical)
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tab 5: Land & Crop Details */}
          <div className="p-6">
            <div className="space-y-6 max-w-4xl">
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Land Record Summary</h3>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-sm text-amber-800 mb-4">
                  <Shield className="flex-shrink-0" size={18} />
                  <p>Land area recorded from your last application is <strong>4.5 acres</strong>. If this has changed, you must update it during your next loan application with an updated 7/12 extract.</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Recent Crop Plans</h3>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-4 py-3 font-semibold text-slate-600">Season</th>
                        <th className="px-4 py-3 font-semibold text-slate-600">Crop</th>
                        <th className="px-4 py-3 font-semibold text-slate-600">Area Expected</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="px-4 py-3 text-slate-900">Kharif 2026</td>
                        <td className="px-4 py-3 text-slate-900">Grapes</td>
                        <td className="px-4 py-3 text-slate-600">2 Acres</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-slate-900">Kharif 2026</td>
                        <td className="px-4 py-3 text-slate-900">Tomato</td>
                        <td className="px-4 py-3 text-slate-600">1.5 Acres</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Tab 6: Bank Details */}
          <div className="p-6">
            <div className="max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-slate-900 text-lg">Primary Bank Account</h3>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <div className="flex items-start gap-4">
                  <Landmark size={24} className="text-slate-400 mt-1" />
                  <div className="space-y-4 flex-1">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Account Holder Name</p>
                      <p className="font-medium text-slate-900">Ganesh Vishnu Thorat</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Bank Name</p>
                        <p className="font-medium text-slate-900">State Bank of India</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Account Number</p>
                        <p className="font-medium text-slate-900 font-mono tracking-widest">XXXX1234</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">IFSC Code</p>
                        <p className="font-medium text-slate-900 font-mono">SBIN0001234</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Branch</p>
                        <p className="font-medium text-slate-900">Nashik Main</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab 7: KYC Status */}
          <div className="p-0">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">Re-KYC Deadline: 30 September 2026</p>
                <p className="text-sm text-slate-500 mt-0.5">Your KYC documents are currently verified and valid.</p>
              </div>
              <StatusBadge label="verified" />
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Document</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Masked Value</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                    <FileCheck size={16} className="text-slate-400" /> PAN Card
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-mono">XXXXX1234F</td>
                  <td className="px-6 py-4"><StatusBadge label="verified" size="sm" /></td>
                  <td className="px-6 py-4 text-slate-600 text-sm">12 May 2019</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                    <FileCheck size={16} className="text-slate-400" /> Aadhaar Card
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-mono">XXXX XXXX 7788</td>
                  <td className="px-6 py-4"><StatusBadge label="verified" size="sm" /></td>
                  <td className="px-6 py-4 text-slate-600 text-sm">12 May 2019</td>
                </tr>
              </tbody>
            </table>
          </div>

        </Tabs>
      </div>
    </div>
  );
};

export default MP04_MyProfile;

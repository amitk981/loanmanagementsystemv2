import React from 'react';
import { Leaf, Calendar, Scale, IndianRupee, CheckCircle2 } from 'lucide-react';
import StatusBadge from '../../../../components/ui/StatusBadge';

const MP22_ProduceSupply: React.FC = () => {
  const supplyHistory = [
    { season: 'Kharif 2024', crop: 'Tomato', quantity: '12.5 MT', value: 250000, status: 'completed' },
    { season: 'Rabi 2023', crop: 'Grapes', quantity: '8.2 MT', value: 320000, status: 'completed' },
    { season: 'Kharif 2023', crop: 'Tomato', quantity: '11.0 MT', value: 220000, status: 'completed' },
    { season: 'Rabi 2022', crop: 'Grapes', quantity: '7.5 MT', value: 280000, status: 'completed' },
    { season: 'Kharif 2022', crop: 'Tomato', quantity: '10.5 MT', value: 200000, status: 'completed' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Produce Supply History</h2>
          <p className="text-sm text-slate-500 mt-1">Track your agricultural supply to SFPCL for loan eligibility.</p>
        </div>
        <div className="bg-green-50 border border-green-200 px-4 py-2 rounded-lg flex items-center gap-2">
          <CheckCircle2 size={18} className="text-green-600" />
          <span className="text-sm font-medium text-green-800">4-Year Rule Met</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Continuous Supply</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">5 Years</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0 text-amber-600">
            <Scale size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Volume</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">49.7 MT</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 text-green-600">
            <IndianRupee size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Value</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">₹12.7L</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-semibold text-slate-900">Historical Supply Records</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Season</th>
                <th className="text-left px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Crop</th>
                <th className="text-right px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Quantity</th>
                <th className="text-right px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Value Delivered</th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {supplyHistory.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800 whitespace-nowrap">{row.season}</td>
                  <td className="px-4 py-4 text-slate-600 whitespace-nowrap flex items-center gap-2">
                    <Leaf size={14} className="text-green-600" />
                    {row.crop}
                  </td>
                  <td className="px-4 py-4 text-right font-medium text-slate-700 whitespace-nowrap">{row.quantity}</td>
                  <td className="px-4 py-4 text-right text-slate-600 whitespace-nowrap">₹{row.value.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <StatusBadge label={row.status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-sm text-blue-800">
        <div className="mt-0.5">
          <CheckCircle2 size={18} className="text-blue-600" />
        </div>
        <div>
          <span className="font-semibold block mb-1">Eligibility Note</span>
          SFPCL credit policy requires continuous produce supply for 4 consecutive years to be eligible for maximum loan limit enhancements. You currently fulfill this criteria.
        </div>
      </div>
    </div>
  );
};

export default MP22_ProduceSupply;

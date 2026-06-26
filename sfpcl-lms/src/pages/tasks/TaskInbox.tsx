import React, { useState } from 'react';
import {
  Inbox, Clock, AlertTriangle, CheckCircle2, ChevronRight,
  Filter, Calendar, User, ArrowRight, Download, MoreVertical,
  MessageSquare, UserPlus, Ban
} from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';
import { useRole } from '../../contexts/RoleContext';

type TaskPriority = 'critical' | 'high' | 'normal';
type TaskType =
  | 'completeness_check' | 'appraisal' | 'sanction' | 'document_verification'
  | 'sap_setup' | 'disbursement' | 'repayment_posting' | 'default_review' | 'approval';

interface Task {
  id: string;
  type: TaskType;
  loanNo: string;
  borrower: string;
  amount: number;
  priority: TaskPriority;
  tatRemaining: string;
  status: string;
  assignedRole: string;
  assignedUser?: string;
  createdDate: string;
  dueDate: string;
  borrowerType: 'individual' | 'fpc';
  isSpecialCase: boolean;
  isException: boolean;
}

const typeLabels: Record<TaskType, string> = {
  completeness_check:  'Completeness Check',
  appraisal:           'Prepare Appraisal',
  sanction:            'Sanction Decision',
  document_verification: 'Document Verification',
  sap_setup:           'SAP Setup',
  disbursement:        'Disbursement Initiation',
  repayment_posting:   'Repayment Posting',
  default_review:      'Default Review',
  approval:            'Approval Required',
};

const typeColors: Record<TaskType, string> = {
  completeness_check:  'bg-blue-50 text-blue-700',
  appraisal:           'bg-amber-50 text-amber-700',
  sanction:            'bg-violet-50 text-violet-700',
  document_verification: 'bg-teal-50 text-teal-700',
  sap_setup:           'bg-slate-50 text-slate-600',
  disbursement:        'bg-green-50 text-green-700',
  repayment_posting:   'bg-indigo-50 text-indigo-700',
  default_review:      'bg-red-50 text-red-700',
  approval:            'bg-orange-50 text-orange-700',
};

const roleTaskTypes: Record<string, TaskType[]> = {
  field_officer:          ['completeness_check', 'document_verification'],
  deputy_manager_finance: ['completeness_check', 'appraisal'],
  credit_manager:         ['completeness_check', 'appraisal', 'sanction', 'default_review'],
  sanction_committee:     ['sanction', 'approval'],
  cfo:                    ['sanction', 'approval'],
  director:               ['sanction', 'approval'],
  compliance_team:        ['document_verification'],
  company_secretary:      ['document_verification'],
  senior_manager_finance: ['sap_setup', 'disbursement'],
  accounts:               ['repayment_posting'],
  sales_team_user:        ['repayment_posting'],
  cfc:                    ['sanction', 'approval', 'default_review'],
  auditor:                [], // view only
  admin:                  Object.keys(typeLabels) as TaskType[],
};

const allTasks: Task[] = [
  { id: 'T000', type: 'document_verification',loanNo: 'LO00000047', borrower: 'Anjali Wagh',      amount: 100000, priority: 'high',     tatRemaining: '1 day',         status: 'draft',               assignedRole: 'field_officer',          assignedUser: 'Amit Kallapa', createdDate: '2026-06-18', dueDate: '2026-06-27', borrowerType: 'individual', isSpecialCase: false, isException: false },
  { id: 'T001', type: 'completeness_check',  loanNo: 'LO00000047', borrower: 'Ramesh Kulkarni',  amount: 250000, priority: 'critical', tatRemaining: '3 hrs',        status: 'submitted',           assignedRole: 'deputy_manager_finance', assignedUser: 'Amit Kallapa', createdDate: '2025-06-24', dueDate: '2025-06-25', borrowerType: 'individual', isSpecialCase: false, isException: false },
  { id: 'T002', type: 'appraisal',            loanNo: 'LO00000046', borrower: 'Sunita Kamble',    amount: 150000, priority: 'high',     tatRemaining: '1 day',         status: 'reference_generated',  assignedRole: 'deputy_manager_finance', createdDate: '2025-06-23', dueDate: '2025-06-26', borrowerType: 'individual', isSpecialCase: true,  isException: false },
  { id: 'T003', type: 'sanction',             loanNo: 'LO00000044', borrower: 'Kiran Pawar',      amount: 400000, priority: 'high',     tatRemaining: '2 days',        status: 'pending_sanction',     assignedRole: 'sanction_committee',     createdDate: '2025-06-22', dueDate: '2025-06-27', borrowerType: 'fpc',        isSpecialCase: false, isException: true  },
  { id: 'T004', type: 'document_verification',loanNo: 'LO00000043', borrower: 'Asha Bhosale',     amount: 200000, priority: 'normal',   tatRemaining: '3 days',        status: 'sanctioned',           assignedRole: 'compliance_team',        createdDate: '2025-06-21', dueDate: '2025-06-28', borrowerType: 'individual', isSpecialCase: false, isException: false },
  { id: 'T005', type: 'sap_setup',            loanNo: 'LO00000041', borrower: 'Vijay Patil',      amount: 300000, priority: 'high',     tatRemaining: '1 day',         status: 'pending_sap_code',     assignedRole: 'senior_manager_finance', createdDate: '2025-06-20', dueDate: '2025-06-26', borrowerType: 'individual', isSpecialCase: false, isException: false },
  { id: 'T006', type: 'disbursement',         loanNo: 'LO00000040', borrower: 'Manoj Thorat',     amount: 500000, priority: 'normal',   tatRemaining: '2 days',        status: 'ready_for_payment',    assignedRole: 'senior_manager_finance', createdDate: '2025-06-19', dueDate: '2025-06-27', borrowerType: 'fpc',        isSpecialCase: true,  isException: false },
  { id: 'T007', type: 'default_review',       loanNo: 'LO00000038', borrower: 'Malti Shinde',     amount: 180000, priority: 'critical', tatRemaining: 'Overdue',       status: 'default_review',       assignedRole: 'credit_manager',         assignedUser: 'Amit Kallapa', createdDate: '2025-06-15', dueDate: '2025-06-20', borrowerType: 'individual', isSpecialCase: false, isException: false },
  { id: 'T008', type: 'approval',             loanNo: 'LO00000042', borrower: 'Ganesh Thorat',    amount: 350000, priority: 'high',     tatRemaining: '4 hrs',         status: 'pending_sanction',     assignedRole: 'cfo',                    createdDate: '2025-06-24', dueDate: '2025-06-25', borrowerType: 'individual', isSpecialCase: false, isException: true  },
];

const priorityConfig: Record<TaskPriority, { color: string; label: string }> = {
  critical: { color: 'bg-red-100 text-red-700',    label: 'Critical' },
  high:     { color: 'bg-amber-100 text-amber-700', label: 'High' },
  normal:   { color: 'bg-slate-100 text-slate-600', label: 'Normal' },
};

interface TaskInboxProps {
  onNavigate?: (page: any, id?: string) => void;
}

const TaskInbox: React.FC<TaskInboxProps> = ({ onNavigate }) => {
  const { currentUser } = useRole();
  const [filter, setFilter] = useState<'all' | TaskPriority>('all');
  const [typeFilter, setTypeFilter] = useState<TaskType | 'all'>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  
  // Advanced filters
  const [timeFilter, setTimeFilter] = useState<'all' | 'due_today' | 'overdue'>('all');
  const [borrowerTypeFilter, setBorrowerTypeFilter] = useState<'all' | 'individual' | 'fpc'>('all');
  const [amountFilter, setAmountFilter] = useState<'all' | 'over_5l' | 'under_5l'>('all');
  const [specialCaseFilter, setSpecialCaseFilter] = useState<'all' | 'yes'>('all');
  const [exceptionFilter, setExceptionFilter] = useState<'all' | 'yes'>('all');
  const [assignmentFilter, setAssignmentFilter] = useState<'team' | 'me'>('team');

  const myTasks = allTasks.filter(t =>
    t.assignedRole === currentUser.role ||
    currentUser.role === 'admin'
  );

  const filtered = myTasks.filter(t => {
    if (filter !== 'all' && t.priority !== filter) return false;
    if (typeFilter !== 'all' && t.type !== typeFilter) return false;
    
    if (timeFilter === 'due_today' && t.dueDate !== new Date().toISOString().split('T')[0]) return false;
    if (timeFilter === 'overdue' && t.tatRemaining !== 'Overdue') return false;
    
    if (borrowerTypeFilter !== 'all' && t.borrowerType !== borrowerTypeFilter) return false;
    if (amountFilter === 'over_5l' && t.amount <= 500000) return false;
    if (amountFilter === 'under_5l' && t.amount > 500000) return false;
    if (specialCaseFilter === 'yes' && !t.isSpecialCase) return false;
    if (exceptionFilter === 'yes' && !t.isException) return false;
    
    if (assignmentFilter === 'me' && t.assignedUser !== currentUser.name) return false;
    
    return true;
  });

  const criticalCount = myTasks.filter(t => t.priority === 'critical').length;
  const highCount     = myTasks.filter(t => t.priority === 'high').length;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Task Inbox</h1>
          <p className="text-sm text-slate-500 mt-1">
            Your pending tasks for role: <span className="font-medium text-green-700">{currentUser.name}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {criticalCount > 0 && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-red-700 bg-red-100 px-3 py-1.5 rounded-full">
              <AlertTriangle size={12} />
              {criticalCount} critical
            </span>
          )}
          {highCount > 0 && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-100 px-3 py-1.5 rounded-full">
              <Clock size={12} />
              {highCount} high priority
            </span>
          )}
          <button
            onClick={() => {
              // Mock CSV export
              alert(`Exporting ${filtered.length} tasks to CSV...`);
            }}
            className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors ml-2"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
          {(['all', 'critical', 'high', 'normal'] as const).map(p => (
            <button
              key={p}
              onClick={() => setFilter(p)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors capitalize ${
                filter === p ? 'bg-green-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {p === 'all' ? 'All' : p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value as TaskType | 'all')}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
        >
          <option value="all">All task types</option>
          {(roleTaskTypes[currentUser.role] || Object.keys(typeLabels) as TaskType[]).map(k => (
            <option key={k} value={k}>{typeLabels[k]}</option>
          ))}
        </select>
        
        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className={`flex items-center gap-2 text-sm px-3 py-2 border rounded-lg transition-colors ${
            showAdvancedFilters ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Filter size={16} />
          Advanced Filters
        </button>
      </div>

      {showAdvancedFilters && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Assignment</label>
            <select value={assignmentFilter} onChange={e => setAssignmentFilter(e.target.value as any)} className="field-select text-sm py-1.5 w-full">
              <option value="team">Assigned to My Team</option>
              <option value="me">Assigned to Me</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Time</label>
            <select value={timeFilter} onChange={e => setTimeFilter(e.target.value as any)} className="field-select text-sm py-1.5 w-full">
              <option value="all">Any time</option>
              <option value="due_today">Due Today</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Borrower Type</label>
            <select value={borrowerTypeFilter} onChange={e => setBorrowerTypeFilter(e.target.value as any)} className="field-select text-sm py-1.5 w-full">
              <option value="all">Any type</option>
              <option value="individual">Individual</option>
              <option value="fpc">FPC</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Amount Threshold</label>
            <select value={amountFilter} onChange={e => setAmountFilter(e.target.value as any)} className="field-select text-sm py-1.5 w-full">
              <option value="all">Any amount</option>
              <option value="over_5l">&gt; ₹5 Lakhs</option>
              <option value="under_5l">&le; ₹5 Lakhs</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Flags</label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={specialCaseFilter === 'yes'} onChange={e => setSpecialCaseFilter(e.target.checked ? 'yes' : 'all')} className="w-4 h-4 rounded text-green-600 focus:ring-green-500" />
                Special Cases only
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={exceptionFilter === 'yes'} onChange={e => setExceptionFilter(e.target.checked ? 'yes' : 'all')} className="w-4 h-4 rounded text-green-600 focus:ring-green-500" />
                Exceptions only
              </label>
            </div>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <CheckCircle2 size={40} className="text-green-400 mb-4" />
          <h2 className="text-lg font-semibold text-slate-700 mb-2">All clear!</h2>
          <p className="text-sm text-slate-400">No pending tasks for your role.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase">
            <Inbox size={14} />
            {filtered.length} task{filtered.length !== 1 ? 's' : ''} pending
          </div>
          <div className="divide-y divide-slate-50">
            {filtered.map(task => (
              <div
                key={task.id}
                className={`px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors ${
                  task.priority === 'critical' ? 'bg-red-50/30' : ''
                }`}
              >
                {/* Priority indicator */}
                <div className={`w-1 h-12 rounded-full flex-shrink-0 ${
                  task.priority === 'critical' ? 'bg-red-500' :
                  task.priority === 'high'     ? 'bg-amber-400' :
                  'bg-slate-200'
                }`} />

                {/* Task type chip */}
                <div className="flex-shrink-0 w-36">
                  <span className={`text-xs font-medium px-2 py-1 rounded-lg ${typeColors[task.type]}`}>
                    {typeLabels[task.type]}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-slate-600">{task.loanNo}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-sm font-medium text-slate-900 truncate">{task.borrower}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-500">
                    <span>₹{(task.amount / 100000).toFixed(1)}L</span>
                    <span>Created {task.createdDate}</span>
                    <span className="flex items-center gap-1"><Calendar size={12}/> Due {task.dueDate}</span>
                    <span className="flex items-center gap-1"><User size={12}/> {task.assignedUser || task.assignedRole.replace(/_/g, ' ')}</span>
                    <StatusBadge label={task.status} size="sm" />
                  </div>
                </div>

                {/* TAT */}
                <div className="flex-shrink-0 text-right">
                  <div className={`text-sm font-semibold ${
                    task.tatRemaining === 'Overdue' ? 'text-red-600' :
                    task.tatRemaining.includes('hrs') ? 'text-amber-600' :
                    'text-slate-700'
                  }`}>
                    {task.tatRemaining === 'Overdue' ? (
                      <span className="flex items-center gap-1"><AlertTriangle size={12} />Overdue</span>
                    ) : task.tatRemaining}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">TAT remaining</div>
                </div>

                {/* Priority */}
                <div className="flex-shrink-0">
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${priorityConfig[task.priority].color}`}>
                    {priorityConfig[task.priority].label}
                  </span>
                </div>

                {/* Action */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (!onNavigate) return;
                      const map: Record<TaskType, string> = {
                        completeness_check: 'applications/detail',
                        appraisal: 'appraisal',
                        sanction: 'sanction',
                        document_verification: 'documentation',
                        sap_setup: 'disbursement',
                        disbursement: 'disbursement',
                        repayment_posting: 'repayments',
                        default_review: 'defaults',
                        approval: 'sanction',
                      };
                      onNavigate(map[task.type], task.loanNo);
                    }}
                    className="flex-shrink-0 flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
                  >
                    Open <ArrowRight size={12} />
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setActiveMenu(activeMenu === task.id ? null : task.id)}
                      className="p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-lg transition-colors"
                    >
                      <MoreVertical size={16} />
                    </button>
                    {activeMenu === task.id && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-10 py-1">
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                          <UserPlus size={14} /> Reassign Task
                        </button>
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                          <MessageSquare size={14} /> Add Comment
                        </button>
                        <div className="border-t border-slate-100 my-1"></div>
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors">
                          <Ban size={14} /> Mark Blocked
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskInbox;

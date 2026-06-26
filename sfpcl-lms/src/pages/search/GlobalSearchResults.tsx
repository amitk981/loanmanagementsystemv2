import React, { useMemo, useState } from 'react';
import { ArrowRight, Banknote, FileText, Search, ShieldCheck, UserRound } from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';
import { loanAccounts, loanApplications, members } from '../../data/mockData';
import { useRole } from '../../contexts/RoleContext';
import type { Page } from '../../App';

interface GlobalSearchResultsProps {
  query: string;
  onNavigate: (page: Page, id?: string) => void;
}

type ResultType = 'member' | 'application' | 'loan';

interface SearchResult {
  id: string;
  type: ResultType;
  title: string;
  subtitle: string;
  status: string;
  route: Page;
  entityId: string;
  fields: Array<[string, string]>;
}

const typeIcon: Record<ResultType, React.ReactNode> = {
  member: <UserRound size={16} className="text-green-600" />,
  application: <FileText size={16} className="text-blue-600" />,
  loan: <Banknote size={16} className="text-amber-600" />,
};

const normalize = (value: string | number | undefined) => String(value || '').toLowerCase();

const GlobalSearchResults: React.FC<GlobalSearchResultsProps> = ({ query, onNavigate }) => {
  const { can } = useRole();
  const [localQuery, setLocalQuery] = useState(query);
  const [submittedQuery, setSubmittedQuery] = useState(query);
  const [typeFilter, setTypeFilter] = useState<ResultType | 'all'>('all');

  const results = useMemo<SearchResult[]>(() => {
    const q = normalize(submittedQuery).trim();
    if (!q) return [];

    const memberResults = can('view_members') ? members
      .filter(m => [
        m.name, m.folioNumber, m.id, m.pan, m.aadhaar, m.mobile, m.sapCustomerCode,
        m.memberType, m.activeStatus, m.kycStatus,
      ].some(value => normalize(value).includes(q)))
      .map<SearchResult>(m => ({
        id: `member-${m.id}`,
        type: 'member',
        title: m.name,
        subtitle: `${m.folioNumber} · ${m.memberType.replace(/_/g, ' ')}`,
        status: m.activeStatus,
        route: 'members/profile',
        entityId: m.id,
        fields: [
          ['Member ID', m.id],
          ['Folio', m.folioNumber],
          ['KYC', m.kycStatus],
          ['PAN', m.pan.replace(/^(.{5}).*(.{1})$/, '$1****$2')],
        ],
      })) : [];

    const applicationResults = can('view_applications') ? loanApplications
      .filter(a => [
        a.applicationNumber, a.memberName, a.memberId, a.status, a.currentOwner,
        a.sapCustomerCode, a.bankAccount, a.bankIfsc, a.exceptionReason,
      ].some(value => normalize(value).includes(q)))
      .map<SearchResult>(a => ({
        id: `application-${a.id}`,
        type: 'application',
        title: a.applicationNumber,
        subtitle: `${a.memberName} · Rs.${a.requestedAmount.toLocaleString('en-IN')}`,
        status: a.status,
        route: 'applications/detail',
        entityId: a.id,
        fields: [
          ['Owner', a.currentOwner],
          ['Documentation', a.documentationStatus],
          ['Disbursement', a.disbursementStatus],
          ['Exception', a.isException ? 'Yes' : 'No'],
        ],
      })) : [];

    const loanResults = can('view_loan_accounts') ? loanAccounts
      .filter(l => [
        l.accountNumber, l.applicationNumber, l.memberName, l.memberId, l.status,
        l.sapCustomerCode, l.dpdBucket,
      ].some(value => normalize(value).includes(q)))
      .map<SearchResult>(l => ({
        id: `loan-${l.id}`,
        type: 'loan',
        title: l.accountNumber,
        subtitle: `${l.memberName} · ${l.applicationNumber}`,
        status: l.status,
        route: 'loan-accounts/detail',
        entityId: l.id,
        fields: [
          ['Outstanding', `Rs.${l.outstandingPrincipal.toLocaleString('en-IN')}`],
          ['DPD', String(l.dpd)],
          ['SAP', l.sapCustomerCode],
          ['Due', l.repaymentDueDate],
        ],
      })) : [];

    return [...memberResults, ...applicationResults, ...loanResults];
  }, [can, submittedQuery]);

  const visibleResults = typeFilter === 'all' ? results : results.filter(result => result.type === typeFilter);

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Global Search Results</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Search across members, applications, loan accounts, SAP references and masked sensitive identifiers.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm">
          <p className="text-xs text-slate-500">Results</p>
          <p className="text-2xl font-bold text-slate-900 num">{visibleResults.length}</p>
        </div>
      </div>

      <div className="card">
        <form
          className="flex flex-col gap-3 sm:flex-row"
          onSubmit={e => {
            e.preventDefault();
            setSubmittedQuery(localQuery);
          }}
        >
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={localQuery}
              onChange={e => setLocalQuery(e.target.value)}
              className="field-input pl-10"
              placeholder="Borrower, folio, app no., loan no., SAP code, PAN, Aadhaar last 4..."
            />
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as ResultType | 'all')} className="field-select sm:w-48">
            <option value="all">All record types</option>
            <option value="member">Members</option>
            <option value="application">Applications</option>
            <option value="loan">Loan accounts</option>
          </select>
          <button className="btn-primary" type="submit">Search</button>
        </form>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Matched Records</h2>
            <p className="text-xs text-slate-500 mt-0.5">Query: {submittedQuery || 'No query entered'}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck size={14} className="text-green-600" />
            Sensitive identifiers masked by default
          </div>
        </div>

        {visibleResults.length === 0 ? (
          <div className="py-12 text-center">
            <Search size={28} className="mx-auto text-slate-300 mb-3" />
            <p className="text-sm font-semibold text-slate-700">No matching records found</p>
            <p className="text-xs text-slate-400 mt-1">Try an application number, folio, member name, loan account, SAP code or last-four identifier.</p>
            <p className="text-xs text-slate-400 mt-1">Results are limited to the modules available to your current role.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {visibleResults.map(result => (
              <button
                key={result.id}
                onClick={() => onNavigate(result.route, result.entityId)}
                className="w-full p-4 text-left hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="mt-0.5 h-8 w-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                      {typeIcon[result.type]}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-slate-900 num">{result.title}</p>
                        <StatusBadge label={result.status} size="sm" />
                      </div>
                      <p className="text-sm text-slate-500 mt-0.5 truncate">{result.subtitle}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 lg:w-[520px]">
                    {result.fields.map(([label, value]) => (
                      <div key={`${result.id}-${label}`} className="rounded-lg bg-slate-50 px-3 py-2">
                        <p className="text-[11px] text-slate-400">{label}</p>
                        <p className="text-xs font-medium text-slate-700 truncate">{value}</p>
                      </div>
                    ))}
                  </div>
                  <ArrowRight size={16} className="hidden lg:block text-slate-300 flex-shrink-0" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalSearchResults;

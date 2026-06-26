import React from 'react';
import { AlertTriangle, Eye, Upload } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import type { DocumentRecord, ShareMode } from '../../types';
import { documents } from '../../data/mockData';

type Requirement = 'mandatory' | 'conditional' | 'not_required';
type CompactState = 'not_required' | 'pending' | 'uploaded' | 'signed' | 'complete' | 'verified' | 'blocked';

interface ChecklistRow {
  id: string;
  name: string;
  required: Requirement;
  owner: string;
  status: CompactState;
  signatureStatus: CompactState;
  stampStatus: CompactState;
  notaryStatus: CompactState;
  verificationStatus: CompactState;
  evidence: string;
  deficiency: string;
  nextAction: string;
  prerequisitesComplete: boolean;
}

interface DocumentChecklistProps {
  applicationId: string;
  shareMode: ShareMode;
  subsidiaryRepayment?: boolean;
  signatureMismatch?: boolean;
  readOnly?: boolean;
  canVerify?: boolean;
  sensitiveVisible?: boolean;
}

const docByType = (docs: DocumentRecord[], type: string) => docs.find(d => d.documentType === type);

const compactStatus = (doc?: DocumentRecord): CompactState => {
  if (!doc) return 'pending';
  if (doc.status === 'rejected') return 'blocked';
  if (['verified', 'complete', 'notarised'].includes(doc.status)) return 'verified';
  if (doc.status === 'signed') return 'signed';
  if (['uploaded', 'under_review'].includes(doc.status)) return 'uploaded';
  return 'pending';
};

const mask = (value: string, visible?: boolean) => visible ? value : value.replace(/[A-Z0-9]/g, '•');

const DocumentChecklist: React.FC<DocumentChecklistProps> = ({
  applicationId,
  shareMode,
  subsidiaryRepayment = true,
  signatureMismatch = true,
  readOnly = false,
  canVerify = false,
  sensitiveVisible = false,
}) => {
  const docs = documents.filter(d => d.applicationId === applicationId);
  const pan = docByType(docs, 'pan');
  const aadhaar = docByType(docs, 'aadhaar');
  const nomineePan = docByType(docs, 'nominee_pan');
  const nomineeAadhaar = docByType(docs, 'nominee_aadhaar');
  const witnessPan = docByType(docs, 'witness_pan');
  const witnessAadhaar = docByType(docs, 'witness_aadhaar');
  const poa = docByType(docs, 'poa');
  const triParty = docByType(docs, 'tri_party');
  const sh4 = docByType(docs, 'sh4');
  const termSheet = docByType(docs, 'term_sheet');
  const loanAgreement = docByType(docs, 'loan_agreement');
  const cancelledCheque = docByType(docs, 'cancelled_cheque');
  const blankCheque = docByType(docs, 'blank_cheque');
  const bankVerification = docByType(docs, 'bank_verification_letter');

  const rows: ChecklistRow[] = [
    {
      id: 'borrower-kyc',
      name: 'Borrower PAN / Aadhaar',
      required: 'mandatory',
      owner: 'Credit / Compliance',
      status: pan?.status === 'verified' && aadhaar?.status === 'verified' ? 'verified' : 'pending',
      signatureStatus: 'not_required',
      stampStatus: 'not_required',
      notaryStatus: 'not_required',
      verificationStatus: pan?.status === 'verified' && aadhaar?.status === 'verified' ? 'verified' : 'pending',
      evidence: `${mask('ABCDE1234F', sensitiveVisible)} / Aadhaar ${mask('4521', sensitiveVisible)}`,
      deficiency: pan && aadhaar ? '-' : 'Borrower KYC pending',
      nextAction: pan && aadhaar ? 'View' : 'Upload',
      prerequisitesComplete: pan?.status === 'verified' && aadhaar?.status === 'verified',
    },
    {
      id: 'nominee-kyc',
      name: 'Nominee PAN / Aadhaar',
      required: 'mandatory',
      owner: 'Credit / Compliance',
      status: nomineePan?.status === 'verified' && nomineeAadhaar?.status === 'verified' ? 'verified' : 'pending',
      signatureStatus: 'not_required',
      stampStatus: 'not_required',
      notaryStatus: 'not_required',
      verificationStatus: nomineePan?.status === 'verified' && nomineeAadhaar?.status === 'verified' ? 'verified' : 'pending',
      evidence: `${mask('FGHIJ5678K', sensitiveVisible)} / Aadhaar ${mask('7789', sensitiveVisible)}`,
      deficiency: nomineePan && nomineeAadhaar ? '-' : 'Nominee KYC pending',
      nextAction: nomineePan && nomineeAadhaar ? 'View' : 'Upload',
      prerequisitesComplete: nomineePan?.status === 'verified' && nomineeAadhaar?.status === 'verified',
    },
    {
      id: 'witness-kyc',
      name: 'Witness PAN / Aadhaar',
      required: 'mandatory',
      owner: 'Compliance',
      status: witnessPan?.status === 'verified' && witnessAadhaar?.status === 'verified' ? 'verified' : 'uploaded',
      signatureStatus: 'not_required',
      stampStatus: 'not_required',
      notaryStatus: 'not_required',
      verificationStatus: witnessPan?.status === 'verified' && witnessAadhaar?.status === 'verified' ? 'verified' : 'pending',
      evidence: `${mask('WITNS1234Q', sensitiveVisible)} / shareholder check`,
      deficiency: 'Witness shareholder validation pending',
      nextAction: 'Verify',
      prerequisitesComplete: witnessPan?.status === 'verified' && witnessAadhaar?.status === 'verified',
    },
    {
      id: 'cancelled-cheque',
      name: 'Cancelled cheque',
      required: 'mandatory',
      owner: 'Compliance / Finance',
      status: compactStatus(cancelledCheque),
      signatureStatus: 'not_required',
      stampStatus: 'not_required',
      notaryStatus: 'not_required',
      verificationStatus: compactStatus(cancelledCheque),
      evidence: `Acct ${mask('1234', sensitiveVisible)} / IFSC RATN••••001`,
      deficiency: compactStatus(cancelledCheque) === 'verified' ? '-' : 'Bank proof pending',
      nextAction: compactStatus(cancelledCheque) === 'verified' ? 'View' : 'Upload',
      prerequisitesComplete: compactStatus(cancelledCheque) === 'verified',
    },
    {
      id: 'blank-cheque',
      name: 'Blank-dated cheque custody',
      required: 'mandatory',
      owner: 'Company Secretary',
      status: compactStatus(blankCheque),
      signatureStatus: 'not_required',
      stampStatus: 'not_required',
      notaryStatus: 'not_required',
      verificationStatus: compactStatus(blankCheque),
      evidence: `Custody ref ${mask('BCHQ-0042', sensitiveVisible)}`,
      deficiency: compactStatus(blankCheque) === 'verified' ? '-' : 'Custody not logged',
      nextAction: compactStatus(blankCheque) === 'verified' ? 'View' : 'Log custody',
      prerequisitesComplete: compactStatus(blankCheque) === 'verified',
    },
    {
      id: 'poa',
      name: 'Power of Attorney',
      required: 'mandatory',
      owner: 'Compliance / CS',
      status: compactStatus(poa),
      signatureStatus: poa?.status === 'signed' || compactStatus(poa) === 'verified' ? 'signed' : 'pending',
      stampStatus: poa?.stampStatus === 'complete' ? 'complete' : 'pending',
      notaryStatus: poa?.notarisationStatus === 'complete' ? 'complete' : 'pending',
      verificationStatus: compactStatus(poa) === 'verified' ? 'verified' : 'pending',
      evidence: 'PoA draft / custody CS cabinet A',
      deficiency: poa?.stampStatus === 'complete' && poa?.notarisationStatus === 'complete' ? '-' : 'Stamp or notary pending',
      nextAction: 'Mark stamped',
      prerequisitesComplete: compactStatus(poa) === 'verified' && poa?.stampStatus === 'complete' && poa?.notarisationStatus === 'complete',
    },
    {
      id: 'tri-party',
      name: 'Tri-party Agreement',
      required: subsidiaryRepayment ? 'conditional' : 'not_required',
      owner: 'Compliance / CS',
      status: subsidiaryRepayment ? compactStatus(triParty) : 'not_required',
      signatureStatus: subsidiaryRepayment ? (compactStatus(triParty) === 'verified' ? 'signed' : 'pending') : 'not_required',
      stampStatus: 'not_required',
      notaryStatus: 'not_required',
      verificationStatus: subsidiaryRepayment ? compactStatus(triParty) : 'not_required',
      evidence: subsidiaryRepayment ? 'Subsidiary deduction agreement' : '-',
      deficiency: subsidiaryRepayment && compactStatus(triParty) !== 'verified' ? 'All party signatures pending' : '-',
      nextAction: subsidiaryRepayment ? 'Upload signed' : 'None',
      prerequisitesComplete: !subsidiaryRepayment || compactStatus(triParty) === 'verified',
    },
    {
      id: 'sh4',
      name: 'SH-4 Physical Share Security',
      required: shareMode === 'physical' ? 'conditional' : 'not_required',
      owner: 'Company Secretary',
      status: shareMode === 'physical' ? compactStatus(sh4) : 'not_required',
      signatureStatus: shareMode === 'physical' ? (compactStatus(sh4) === 'verified' ? 'signed' : 'pending') : 'not_required',
      stampStatus: 'not_required',
      notaryStatus: 'not_required',
      verificationStatus: shareMode === 'physical' ? compactStatus(sh4) : 'not_required',
      evidence: shareMode === 'physical' ? `Folio ${mask('FO-0334', sensitiveVisible)} / cert ${mask('SC-7781', sensitiveVisible)}` : '-',
      deficiency: shareMode === 'physical' && compactStatus(sh4) !== 'verified' ? 'Witness signature or custody pending' : '-',
      nextAction: shareMode === 'physical' ? 'Assign custody' : 'None',
      prerequisitesComplete: shareMode !== 'physical' || compactStatus(sh4) === 'verified',
    },
    {
      id: 'cdsl',
      name: 'CDSL pledge',
      required: shareMode === 'demat' ? 'conditional' : 'not_required',
      owner: 'Company Secretary',
      status: shareMode === 'demat' ? 'pending' : 'not_required',
      signatureStatus: 'not_required',
      stampStatus: 'not_required',
      notaryStatus: 'not_required',
      verificationStatus: shareMode === 'demat' ? 'pending' : 'not_required',
      evidence: shareMode === 'demat' ? `BO ${mask('120816000042', sensitiveVisible)} / PSN pending` : '-',
      deficiency: shareMode === 'demat' ? 'DP acceptance pending' : '-',
      nextAction: shareMode === 'demat' ? 'Enter PSN' : 'None',
      prerequisitesComplete: shareMode !== 'demat',
    },
    {
      id: 'term-sheet',
      name: 'Term Sheet',
      required: 'mandatory',
      owner: 'Compliance',
      status: compactStatus(termSheet),
      signatureStatus: compactStatus(termSheet) === 'verified' ? 'signed' : 'pending',
      stampStatus: 'not_required',
      notaryStatus: 'not_required',
      verificationStatus: compactStatus(termSheet),
      evidence: 'Borrower, nominee, CFO/director route',
      deficiency: compactStatus(termSheet) === 'verified' ? '-' : 'Signature route pending',
      nextAction: 'Route signatures',
      prerequisitesComplete: compactStatus(termSheet) === 'verified',
    },
    {
      id: 'loan-agreement',
      name: 'Loan Agreement',
      required: 'mandatory',
      owner: 'Compliance / CS',
      status: compactStatus(loanAgreement),
      signatureStatus: compactStatus(loanAgreement) === 'verified' ? 'signed' : 'pending',
      stampStatus: loanAgreement?.stampStatus === 'complete' ? 'complete' : 'pending',
      notaryStatus: loanAgreement?.notarisationStatus === 'complete' ? 'complete' : 'pending',
      verificationStatus: compactStatus(loanAgreement),
      evidence: `Stamp ${mask('E-STAMP-2026-0043', sensitiveVisible)}`,
      deficiency: 'Borrower/witness signature, stamp and notary required',
      nextAction: 'Upload signed',
      prerequisitesComplete: compactStatus(loanAgreement) === 'verified' && loanAgreement?.stampStatus === 'complete' && loanAgreement?.notarisationStatus === 'complete',
    },
    {
      id: 'bank-verification',
      name: 'Bank Verification Letter / declaration',
      required: signatureMismatch ? 'conditional' : 'not_required',
      owner: 'Credit / Compliance',
      status: signatureMismatch ? compactStatus(bankVerification) : 'not_required',
      signatureStatus: signatureMismatch ? 'pending' : 'not_required',
      stampStatus: signatureMismatch ? 'pending' : 'not_required',
      notaryStatus: 'not_required',
      verificationStatus: signatureMismatch ? compactStatus(bankVerification) : 'not_required',
      evidence: signatureMismatch ? `Mismatch: cheque vs PAN / acct ${mask('1234', sensitiveVisible)}` : '-',
      deficiency: signatureMismatch && compactStatus(bankVerification) !== 'verified' ? 'Resolution document pending' : '-',
      nextAction: signatureMismatch ? 'Upload resolution' : 'None',
      prerequisitesComplete: !signatureMismatch || compactStatus(bankVerification) === 'verified',
    },
    {
      id: 'final-signatures',
      name: 'Final checklist signatures',
      required: 'mandatory',
      owner: 'CS / Credit / Sanction / Finance',
      status: 'pending',
      signatureStatus: 'pending',
      stampStatus: 'not_required',
      notaryStatus: 'not_required',
      verificationStatus: 'pending',
      evidence: 'Approval chain',
      deficiency: 'Final sign-offs incomplete',
      nextAction: 'Submit to CS',
      prerequisitesComplete: false,
    },
  ];

  const blockingRows = rows.filter(row => row.required !== 'not_required' && !row.prerequisitesComplete);

  const markVerifiedDisabled = (row: ChecklistRow) =>
    readOnly || !canVerify || !row.prerequisitesComplete || row.verificationStatus === 'verified';

  return (
    <div className="space-y-3">
      {blockingRows.length > 0 && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <AlertTriangle size={16} className="text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-800 font-medium">
            Disbursement blocked: {blockingRows[0].name} pending{blockingRows.length > 1 ? ` +${blockingRows.length - 1}` : ''}.
          </p>
        </div>
      )}

      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="table-header text-left">Document</th>
              <th className="table-header text-left">Req.</th>
              <th className="table-header text-left">Owner</th>
              <th className="table-header text-left">Status</th>
              <th className="table-header text-left">Sig.</th>
              <th className="table-header text-left">Stamp</th>
              <th className="table-header text-left">Notary</th>
              <th className="table-header text-left">Verified</th>
              <th className="table-header text-left">Evidence</th>
              <th className="table-header text-left">Deficiency</th>
              <th className="table-header text-left">Next</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map(row => (
              <tr key={row.id} className="hover:bg-slate-50">
                <td className="table-cell font-medium text-slate-900 min-w-48">{row.name}</td>
                <td className="table-cell"><StatusBadge label={row.required} size="sm" /></td>
                <td className="table-cell text-xs text-slate-600 min-w-32">{row.owner}</td>
                <td className="table-cell"><StatusBadge label={row.status} size="sm" /></td>
                <td className="table-cell"><StatusBadge label={row.signatureStatus} size="sm" /></td>
                <td className="table-cell"><StatusBadge label={row.stampStatus} size="sm" /></td>
                <td className="table-cell"><StatusBadge label={row.notaryStatus} size="sm" /></td>
                <td className="table-cell"><StatusBadge label={row.verificationStatus} size="sm" /></td>
                <td className="table-cell text-xs text-slate-500 min-w-44">{row.evidence}</td>
                <td className="table-cell text-xs text-slate-500 min-w-44">{row.deficiency}</td>
                <td className="table-cell">
                  <div className="flex items-center gap-1">
                    <button
                      className="text-xs px-2 py-1 border border-slate-200 rounded text-slate-600 hover:bg-slate-50"
                      disabled={readOnly}
                      title={readOnly ? 'Read-only role' : row.nextAction}
                    >
                      {row.nextAction === 'View' ? <Eye size={12} /> : row.nextAction.includes('Upload') ? <Upload size={12} /> : row.nextAction}
                    </button>
                    <button
                      className="text-xs px-2 py-1 bg-blue-50 border border-blue-200 rounded text-blue-700 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={markVerifiedDisabled(row)}
                      title={markVerifiedDisabled(row) ? 'Prerequisites or role approval required' : 'Mark verified'}
                    >
                      Verify
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentChecklist;

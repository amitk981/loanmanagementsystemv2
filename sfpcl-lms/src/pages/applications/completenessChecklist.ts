export type CompletenessItem = {
  id: string;
  category: string;
  label: string;
  required: true;
  deficiencyReason: string;
};

export const COMPLETENESS_ITEMS: CompletenessItem[] = [
  {
    id: 'application_form',
    category: 'Application details',
    label: 'Loan Application Form present',
    required: true,
    deficiencyReason: 'Loan Application Form is missing',
  },
  {
    id: 'applicant_signature',
    category: 'Application details',
    label: 'Applicant signature present',
    required: true,
    deficiencyReason: 'Applicant signature is missing',
  },
  {
    id: 'nominee_signature',
    category: 'Nominee validation',
    label: 'Nominee signature present',
    required: true,
    deficiencyReason: 'Nominee signature is missing',
  },
  {
    id: 'folio_number',
    category: 'Mandatory field checklist',
    label: 'Folio number present',
    required: true,
    deficiencyReason: 'Folio number is missing',
  },
  {
    id: 'shares_present',
    category: 'Mandatory field checklist',
    label: 'Number of shares present',
    required: true,
    deficiencyReason: 'Number of shares is missing',
  },
  {
    id: 'active_member',
    category: 'Mandatory field checklist',
    label: 'Active member status verified',
    required: true,
    deficiencyReason: 'Member is not active',
  },
  {
    id: 'loan_purpose',
    category: 'Mandatory field checklist',
    label: 'Loan purpose captured as agriculture / crop production',
    required: true,
    deficiencyReason: 'Loan purpose is not valid',
  },
  {
    id: 'existing_default',
    category: 'Mandatory field checklist',
    label: 'Existing default check completed',
    required: true,
    deficiencyReason: 'Existing default check failed',
  },
  {
    id: 'loan_amount',
    category: 'Mandatory field checklist',
    label: 'Requested amount captured',
    required: true,
    deficiencyReason: 'Requested loan amount is missing',
  },
  {
    id: 'nominee_fields',
    category: 'Nominee validation',
    label: 'Nominee name, Aadhaar, PAN and gender present',
    required: true,
    deficiencyReason: 'Nominee name, Aadhaar, PAN or gender is missing',
  },
  {
    id: 'nominee_age',
    category: 'Nominee validation',
    label: 'Nominee age confirmed / not minor',
    required: true,
    deficiencyReason: 'Nominee age not confirmed or minor',
  },
  {
    id: 'borrower_kyc',
    category: 'Mandatory document checklist',
    label: 'Borrower PAN and Aadhaar uploaded',
    required: true,
    deficiencyReason: 'Borrower PAN or Aadhaar upload is missing',
  },
  {
    id: 'nominee_kyc',
    category: 'Mandatory document checklist',
    label: 'Nominee PAN and Aadhaar uploaded',
    required: true,
    deficiencyReason: 'Nominee PAN or Aadhaar upload is missing',
  },
  {
    id: 'share_certificate',
    category: 'Mandatory document checklist',
    label: 'Share certificate uploaded if physical',
    required: true,
    deficiencyReason: 'Share certificate is required for physical shares',
  },
  {
    id: 'land_712',
    category: 'Mandatory document checklist',
    label: '7/12 extract uploaded',
    required: true,
    deficiencyReason: '7/12 extract is missing',
  },
  {
    id: 'crop_plan',
    category: 'Mandatory document checklist',
    label: 'Crop plan uploaded',
    required: true,
    deficiencyReason: 'Crop plan is missing',
  },
  {
    id: 'bank_statement',
    category: 'Mandatory document checklist',
    label: 'Six-month bank statement uploaded',
    required: true,
    deficiencyReason: 'Six-month bank statement is missing',
  },
];

export const COMPLETENESS_CATEGORIES = [
  'Application details',
  'Mandatory field checklist',
  'Mandatory document checklist',
  'Nominee validation',
] as const;

export const getNextLoanReference = (references: string[]) => {
  const next = references.reduce((max, ref) => {
    const match = ref.match(/^LO(\d{8})$/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0) + 1;

  return `LO${String(next).padStart(8, '0')}`;
};

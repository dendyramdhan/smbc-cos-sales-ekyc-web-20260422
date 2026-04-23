//ok
export const CUSTOMER_TYPE_MOCK_DATA: Array<{ id: number; code: string; name: string; }> = [
  { id: 1, code: '31', name: 'Corporate Japanese' },
  { id: 2, code: '32', name: 'Corporate Non Japanese' },
  { id: 3, code: '33', name: 'Commercial' },
  { id: 4, code: '02', name: 'Bank' },
] as const;

//ok
export const LEGAL_ENTITY_TYPE_MOCK_DATA: Array<{ id: number; code: string; label: string; }> = [
  { id: 1, code: 'PT', label: 'PERUSAHAAN TERBATAS - LIMITED LIABILITY COMPANY' },
  { id: 2, code: 'CV', label: 'CV/PERSEKUTUAN KOMANDITER - PARTNERSHIP' },
  { id: 3, code: 'YY', label: 'YAYASAN - FOUNDATION' },
  { id: 4, code: 'KP', label: 'KOPERASI - COOPERATIVE' },
  { id: 5, code: 'KN', label: 'KEMENTRIAN NEGARA/LEMBAGA/SATUAN KERJA/LEMBAGA PEMERINTAHAN - MINISTRY OF STATE/AGENCY/WORK UNIT/GOVERNMENT INSTITUTION' },
  { id: 6, code: 'LN', label: 'LAINNYA - OTHERS' },
  { id: 7, code: 'PP', label: 'PERUSAHAAN PERORANGAN - INDIVIDUAL COMPANY' },
  { id: 8, code: 'PA', label: 'PERUSAHAAN ASING - FOREIGN COMPANY' },
  { id: 9, code: 'KA', label: 'KANTOR PERWAKILAN PERUSAHAAN ASING - REPRESENTATIVE OFFICE' },
  { id: 10, code: 'PK', label: 'PERKUMPULAN - COMMUNITY' },
  { id: 11, code: 'RD', label: 'REKSADANA - MUTUAL FUND' },
  { id: 12, code: 'DP', label: 'DANA PENSIUN - PENSION FUND' },
  { id: 13, code: 'LI', label: 'LEMBAGA INTERNASIONAL/PERWAKILAN ASING - INTERNATIONAL INSTITUTION/FOREIGN REPRESENTATIVE' },
  { id: 14, code: 'PL', label: 'PERIKATAN LAINNYA - LEGAL ARRANGEMENT' },
] as const;

export const LEGAL_ENTITY_CHARACTERISTIC_MOCK_DATA: Array<{ id: number; code: string; label: string; }> = [
  { id: 1, code: 'PL', label: 'Publicly Listed' },
  { id: 2, code: 'PH', label: 'Privately Held' },
  { id: 3, code: 'GO', label: 'Government Owned' },
  { id: 4, code: 'SO', label: 'State Owned Enterprise' },
] as const;

export const LINE_OF_BUSINESS_MOCK_DATA: Array<{ id: number; code: string; label: string; }> = [
  { id: 1, code: 'AM', label: 'Automotive Manufacturing' },
  { id: 2, code: 'FS', label: 'Financial Services' },
  { id: 3, code: 'TK', label: 'Technology' },
  { id: 4, code: 'HC', label: 'Healthcare' },
  { id: 5, code: 'RE', label: 'Real Estate' },
  { id: 6, code: 'EN', label: 'Energy' },
  { id: 7, code: 'RT', label: 'Retail' },
  { id: 8, code: 'TR', label: 'Transportation' },
] as const;

export const COUNTRY_MOCK_DATA: Array<{ id: number; code: string; name: string; }> = [
  { id: 1, code: 'JP', name: 'Japan' },
  { id: 2, code: 'ID', name: 'Indonesia' },
  { id: 3, code: 'SG', name: 'Singapore' },
  { id: 4, code: 'MY', name: 'Malaysia' },
  { id: 5, code: 'TH', name: 'Thailand' },
  { id: 6, code: 'PH', name: 'Philippines' },
  { id: 7, code: 'VN', name: 'Vietnam' },
  { id: 8, code: 'US', name: 'United States' },
  { id: 9, code: 'GB', name: 'United Kingdom' },
  { id: 10, code: 'CN', name: 'China' },
] as const;

export const CHECKLIST_STATUSES_MOCK_DATA: Array<{ id: number; label: string; }> = [
  { id: 1, label: 'Pending' },
  { id: 2, label: 'Approved' },
  { id: 3, label: 'Archived' },
  { id: 4, label: 'Cancelled' },
  { id: 5, label: 'Closed' },
] as const;

// ok
export const CHECKLIST_STAGES_MOCK_DATA: Array<{ id: number; label: string; }> = [
  { id: 1, label: 'KYCprogress' },
  { id: 2, label: 'KYCChecked' },
  { id: 3, label: 'KYCRMChecked' },
  { id: 4, label: 'KYCApproved' },
  { id: 5, label: 'Verifier2Checked' },
  { id: 6, label: 'Verifier2Acknowledge' },
  { id: 7, label: 'MGT1Approved' },
  { id: 8, label: 'MGT2Approved' },
  { id: 9, label: 'Cancelled' },
] as const;

// ok
export const GENERAL_CHECKING_MOCK_DATA: Array<{ key: string; label: string; }> = [
  {
    key: 'a',
    label:
      'Customers requests an unusually amount or given a fictitious names',
  },
  {
    key: 'b',
    label:
      'Customer refuses to submit / provide required document / information including key ROBUS policy',
  },
  {
    key: 'c',
    label:
      'Customer not allowed to open an account based on instructions from governing authorities, Public Policy, Indonesia policy',
  },
  {
    key: 'd',
    label:
      'Customer doing transactions of a dual book or provide false account to be used by dual/fronts',
  },
  { key: 'e', label: 'Customer having bearer shares' },
  { key: 'f', label: 'None of the above' },
] as const;

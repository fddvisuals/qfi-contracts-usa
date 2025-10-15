export const IMPORTANT_FIELDS = [
  'Source_File',
  'School',
  'Grant ID',
  'Title of Project',
  'Date of Letter ',
  'Date range of grant',
  'Date of application',
  'Year',
  'Amount',
  'Amount Requested',
  'Full grant amount disbursed',
  'Purpose of Grant'
] as const;

export type ImportantField = (typeof IMPORTANT_FIELDS)[number];

export interface RawGrantRecord {
  [key: string]: string | undefined;
}

export interface GrantRecord {
  id: string;
  sourceFile: string;
  school: string;
  grantId: string;
  title: string;
  dateOfLetter: string;
  dateRange: string;
  dateOfApplication: string;
  yearLabel: string;
  yearValue: number | null;
  amount: number | null;
  amountRaw: string;
  amountRequested: number | null;
  amountRequestedRaw: string;
  fullGrantAmountDisbursed: number | null;
  fullGrantAmountDisbursedRaw: string;
  purpose: string;
  importantFields: Record<ImportantField, string>;
  otherFields: Array<{ key: string; value: string }>;
  raw: RawGrantRecord;
}

export interface GrantMetrics {
  totalGrants: number;
  totalAwarded: number;
  totalRequested: number;
  totalSchools: number;
  totalSources: number;
  averageGrant: number;
  requestToAwardRatio: number | null;
}

export interface Aggregations {
  amountByYear: Array<{ year: string; totalAmount: number }>;
  amountBySource: Array<{ source: string; totalAmount: number; grants: number }>;
  topPurposes: Array<{ purpose: string; count: number; amount: number }>;
  topSchools: Array<{ school: string; count: number; amount: number }>;
}

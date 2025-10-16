import { useEffect, useMemo, useState } from 'react';
import Papa, { ParseError, ParseResult } from 'papaparse';
import { Aggregations, GrantMetrics, GrantRecord, IMPORTANT_FIELDS, ImportantField, RawGrantRecord } from '../types';
import { extractYear, parseCurrency, safeString } from '../utils/format';

const DATA_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSNjJoTuW3uSqBFYHZ2KpKXduY4NDE7f6E2ZG9Ix-0yHV49P4S-3WEvJRABVVw_og1CZP3xxkjZkyDD/pub?gid=722552634&single=true&output=csv";

interface UseGrantDataResult {
  loading: boolean;
  error: string | null;
  records: GrantRecord[];
  metrics: GrantMetrics | null;
  aggregations: Aggregations | null;
  refresh: () => void;
}

const importantFieldLookup = new Set<ImportantField>(IMPORTANT_FIELDS);

const parseCoordinate = (value?: string): number | null => {
  if (!value) return null;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const normalizeRecord = (raw: RawGrantRecord, index: number): GrantRecord => {
  const importantFieldsEntries = IMPORTANT_FIELDS.map((field) => [field, safeString(raw[field])]);
  const importantFields = Object.fromEntries(importantFieldsEntries) as Record<ImportantField, string>;

  const otherFields = Object.entries(raw)
    .filter(([key, value]) => !importantFieldLookup.has(key as ImportantField) && safeString(value))
    .map(([key, value]) => ({ key, value: safeString(value) }));

  const amount = parseCurrency(importantFields['Amount']);
  const amountRequested = parseCurrency(importantFields['Amount Requested']);
  const fullDisbursed = parseCurrency(importantFields['Full grant amount disbursed']);
  const yearFromField = safeString(importantFields['Year']);
  const yearNumeric = yearFromField ? Number.parseInt(yearFromField, 10) : NaN;
  const yearValue = Number.isNaN(yearNumeric) ? extractYear(importantFields['Date of Letter '] || importantFields['Date range of grant']) : yearNumeric;
  const latitude = parseCoordinate(raw['Latitude']);
  const longitude = parseCoordinate(raw['Longitude']);

  return {
    id: `${importantFields['Grant ID'] || 'record'}-${index}`,
    sourceFile: importantFields['Source_File'] || 'Unspecified',
    school: importantFields['School'] || 'Unspecified',
    grantId: importantFields['Grant ID'] || 'Unspecified',
    title: importantFields['Title of Project'] || 'Untitled Project',
    dateOfLetter: importantFields['Date of Letter '],
    dateRange: importantFields['Date range of grant'],
    dateOfApplication: importantFields['Date of application'],
    yearLabel: yearFromField || (yearValue ? `${yearValue}` : 'Unspecified'),
    yearValue: yearValue ?? null,
    amount,
    amountRaw: importantFields['Amount'],
    amountRequested,
    amountRequestedRaw: importantFields['Amount Requested'],
    fullGrantAmountDisbursed: fullDisbursed,
    fullGrantAmountDisbursedRaw: importantFields['Full grant amount disbursed'],
    purpose: importantFields['Purpose of Grant'] || 'Unspecified',
    latitude,
    longitude,
    importantFields,
    otherFields,
    raw
  };
};

export const computeMetrics = (records: GrantRecord[]): GrantMetrics => {
  const totalGrants = records.length;
  let totalAwarded = 0;
  let totalRequested = 0;
  const schoolSet = new Set<string>();
  const sourceSet = new Set<string>();

  records.forEach((record) => {
    if (record.amount) totalAwarded += record.amount;
    if (record.amountRequested) totalRequested += record.amountRequested;
    if (record.school) schoolSet.add(record.school);
    if (record.sourceFile) sourceSet.add(record.sourceFile);
  });

  return {
    totalGrants,
    totalAwarded,
    totalRequested,
    totalSchools: schoolSet.size,
    totalSources: sourceSet.size,
    averageGrant: totalGrants > 0 ? totalAwarded / totalGrants : 0,
    requestToAwardRatio: totalRequested > 0 ? totalAwarded / totalRequested : null
  };
};

export const computeAggregations = (records: GrantRecord[]): Aggregations => {
  const byYear = new Map<string, { amount: number }>();
  const bySource = new Map<string, { amount: number; grants: number }>();
  const byPurpose = new Map<string, { count: number; amount: number }>();
  const bySchool = new Map<string, { count: number; amount: number }>();

  records.forEach((record) => {
    const yearKey = record.yearValue ? String(record.yearValue) : record.yearLabel || 'Unspecified';
    const sourceKey = record.sourceFile || 'Unspecified';
    const purposeKey = record.purpose || 'Unspecified';
    const schoolKey = record.school || 'Unspecified';

    if (!byYear.has(yearKey)) {
      byYear.set(yearKey, { amount: 0 });
    }
    const includeSource = sourceKey !== 'Unspecified';
    const includePurpose = purposeKey !== 'Unspecified';
    const includeSchool = schoolKey !== 'Unspecified';

    if (includeSource && !bySource.has(sourceKey)) {
      bySource.set(sourceKey, { amount: 0, grants: 0 });
    }
    if (includePurpose && !byPurpose.has(purposeKey)) {
      byPurpose.set(purposeKey, { count: 0, amount: 0 });
    }
    if (includeSchool && !bySchool.has(schoolKey)) {
      bySchool.set(schoolKey, { count: 0, amount: 0 });
    }

    const yearData = byYear.get(yearKey)!;
    const sourceData = includeSource ? bySource.get(sourceKey)! : null;
    const purposeData = includePurpose ? byPurpose.get(purposeKey)! : null;
    const schoolData = includeSchool ? bySchool.get(schoolKey)! : null;

    if (record.amount) {
      yearData.amount += record.amount;
      if (sourceData) sourceData.amount += record.amount;
      if (purposeData) purposeData.amount += record.amount;
      if (schoolData) schoolData.amount += record.amount;
    }
    if (sourceData) sourceData.grants += 1;
    if (purposeData) purposeData.count += 1;
    if (schoolData) schoolData.count += 1;
  });

  const amountByYear = Array.from(byYear.entries())
    .filter(([year]) => year !== 'Unspecified')
    .map(([year, { amount }]) => ({ year, totalAmount: amount }))
    .sort((a, b) => {
      const aYear = Number.parseInt(a.year, 10);
      const bYear = Number.parseInt(b.year, 10);
      if (Number.isNaN(aYear) && Number.isNaN(bYear)) return a.year.localeCompare(b.year);
      if (Number.isNaN(aYear)) return 1;
      if (Number.isNaN(bYear)) return -1;
      return aYear - bYear;
    });

  const amountBySource = Array.from(bySource.entries())
    .map(([source, { amount, grants }]) => ({ source, totalAmount: amount, grants }))
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 12);

  const topPurposes = Array.from(byPurpose.entries())
    .map(([purpose, { count, amount }]) => ({ purpose, count, amount }))
    .sort((a, b) => b.count - a.count || b.amount - a.amount);

  const topSchools = Array.from(bySchool.entries())
    .map(([school, { count, amount }]) => ({ school, count, amount }))
    .sort((a, b) => b.amount - a.amount || b.count - a.count);

  return { amountByYear, amountBySource, topPurposes, topSchools };
};

export const useGrantData = (): UseGrantDataResult => {
  const [records, setRecords] = useState<GrantRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Papa.parse<RawGrantRecord>(DATA_URL, {
      download: true,
      header: true,
      skipEmptyLines: 'greedy',
      complete: (results: ParseResult<RawGrantRecord>) => {
        if (cancelled) return;
        if (results.errors.length > 0) {
          setError(results.errors.map((err: ParseError) => err.message).join('\n'));
          setLoading(false);
          return;
        }
        const parsedRecords = results.data
          .map((row: RawGrantRecord, index: number) => normalizeRecord(row, index))
          .filter((record: GrantRecord) => record.school !== '');
        setRecords(parsedRecords);
        setLoading(false);
      },
      error: (err: Error) => {
        if (cancelled) return;
        setError(err.message);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [trigger]);

  const metrics = useMemo(() => (records.length ? computeMetrics(records) : null), [records]);
  const aggregations = useMemo(() => (records.length ? computeAggregations(records) : null), [records]);

  return {
    loading,
    error,
    records,
    metrics,
    aggregations,
    refresh: () => setTrigger((prev: number) => prev + 1)
  };
};

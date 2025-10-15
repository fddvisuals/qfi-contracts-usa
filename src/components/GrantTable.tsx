import { ReactNode, useMemo, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { GrantRecord } from '../types';
import { formatCurrency, formatDate, safeString } from '../utils/format';

interface GrantTableProps {
  records: GrantRecord[];
  loading: boolean;
}

interface ColumnConfig {
  key: keyof Pick<
    GrantRecord,
    | 'sourceFile'
    | 'school'
    | 'grantId'
    | 'title'
    | 'yearLabel'
    | 'dateOfLetter'
    | 'dateOfApplication'
    | 'dateRange'
    | 'amount'
    | 'amountRequested'
    | 'purpose'
  >;
  label: string;
  render: (record: GrantRecord) => ReactNode;
  className?: string;
}

const columns: ColumnConfig[] = [
  {
    key: 'sourceFile',
    label: 'Source file',
    render: (record: GrantRecord) => record.sourceFile || '—'
  },
  {
    key: 'school',
    label: 'School / Partner',
    render: (record: GrantRecord) => record.school || '—'
  },
  {
    key: 'grantId',
    label: 'Grant ID',
    render: (record: GrantRecord) => record.grantId || '—'
  },
  {
    key: 'title',
    label: 'Title of project',
    render: (record: GrantRecord) => record.title || '—'
  },
  {
    key: 'yearLabel',
    label: 'Year',
    render: (record: GrantRecord) => record.yearLabel || '—',
    className: 'text-center'
  },
  {
    key: 'dateOfLetter',
    label: 'Date of letter',
    render: (record: GrantRecord) => formatDate(record.dateOfLetter)
  },
  {
    key: 'dateOfApplication',
    label: 'Date of application',
    render: (record: GrantRecord) => formatDate(record.dateOfApplication)
  },
  {
    key: 'dateRange',
    label: 'Grant period',
    render: (record: GrantRecord) => formatDate(record.dateRange)
  },
  {
    key: 'amount',
    label: 'Amount approved',
    render: (record: GrantRecord) => formatCurrency(record.amount),
    className: 'text-right'
  },
  {
    key: 'amountRequested',
    label: 'Amount requested',
    render: (record: GrantRecord) => formatCurrency(record.amountRequested),
    className: 'text-right'
  },
  {
    key: 'purpose',
    label: 'Purpose of grant',
    render: (record: GrantRecord) => record.purpose || '—'
  }
];

const GrantTable = ({ records, loading }: GrantTableProps) => {
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const sortedRecords = useMemo(() => {
    return [...records].sort((a, b) => {
      const amountA = a.amount ?? 0;
      const amountB = b.amount ?? 0;
      if (amountA === amountB) {
        return safeString(a.school).localeCompare(safeString(b.school));
      }
      return amountB - amountA;
    });
  }, [records]);

  const toggleRow = (id: string) => {
    setExpandedRowId((current: string | null) => (current === id ? null : id));
  };

  return (
    <section className="rounded-3xl border border-white/5 bg-black/30 p-6 shadow-lg shadow-brand-950/20">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Grant-level detail</h2>
          <p className="text-sm text-white/60">
            Sorted by approved award to spotlight larger commitments while keeping every record accessible.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-white/40">
          <span>{records.length} results</span>
          {expandedRowId && <span>Expanded: {expandedRowId}</span>}
        </div>
      </header>
      <div className="mt-6 rounded-2xl border border-white/10">
        <div className="max-h-[32rem] overflow-auto">
          <table className="min-w-full table-fixed border-separate border-spacing-y-2 text-left text-sm text-white/80">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-white/40">
              {columns.map((column) => (
                <th key={column.key} className={`px-4 py-2 ${column.className ?? ''}`}>
                  {column.label}
                </th>
              ))}
              <th className="px-4 py-2 text-right text-xs uppercase tracking-wider text-white/40">Other fields</th>
            </tr>
          </thead>
          <tbody>
            {sortedRecords.map((record) => {
              const isExpanded = expandedRowId === record.id;
              const otherCount = record.otherFields.length;
              return (
                <>
                  <tr key={record.id} className="rounded-2xl bg-white/5 backdrop-blur transition hover:bg-white/10">
                    {columns.map((column) => (
                      <td key={column.key} className={`px-4 py-3 align-top ${column.className ?? ''}`}>
                        {column.render(record)}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      {otherCount === 0 ? (
                        <span className="text-xs text-white/40">None</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => toggleRow(record.id)}
                          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-white/70 transition hover:border-white/30 hover:text-white"
                          aria-expanded={isExpanded}
                          aria-controls={`${record.id}-details`}
                        >
                          View {otherCount} field{otherCount > 1 ? 's' : ''}
                          <ChevronDownIcon
                            className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180 text-brand-200' : 'text-white/60'}`}
                          />
                        </button>
                      )}
                    </td>
                  </tr>
                  {isExpanded && otherCount > 0 && (
                    <tr key={`${record.id}-details`}>
                      <td colSpan={columns.length + 1} className="px-4 pb-4">
                        <div
                          id={`${record.id}-details`}
                          className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm text-white/70"
                        >
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50">Additional context</h3>
                          <dl className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {record.otherFields.map((field) => (
                              <div key={field.key} className="rounded-xl border border-white/5 bg-white/5 p-3">
                                <dt className="text-xs font-semibold uppercase tracking-wide text-white/40">
                                  {field.key}
                                </dt>
                                <dd className="mt-1 text-sm text-white/80">{field.value}</dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
            {!loading && sortedRecords.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-6 text-center text-sm text-white/50">
                  No grants match the current filter selection.
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-6 text-center text-sm text-white/50">
                  Loading grant records…
                </td>
              </tr>
            )}
          </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default GrantTable;

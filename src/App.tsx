import { useMemo, useState } from 'react';
import FiltersPanel from './components/FiltersPanel';
import SummaryCards from './components/SummaryCards';
import YearlyFundingChart from './components/charts/YearlyFundingChart';
import FundingBySourceChart from './components/charts/FundingBySourceChart';
import PurposeLeaderboard from './components/PurposeLeaderboard';
import GrantTable from './components/GrantTable';
import { computeAggregations, computeMetrics, useGrantData } from './hooks/useGrantData';

const App = () => {
  const { loading, error, records, metrics, aggregations, refresh } = useGrantData();
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [search, setSearch] = useState<string>('');

  const yearOptions = useMemo(() => {
    const yearSet = new Set<string>();
    records.forEach((record) => {
      if (record.yearLabel) {
        yearSet.add(record.yearLabel.trim());
      }
    });
    return Array.from(yearSet).sort((a, b) => {
      const aYear = Number.parseInt(a, 10);
      const bYear = Number.parseInt(b, 10);
      if (Number.isNaN(aYear) && Number.isNaN(bYear)) return a.localeCompare(b);
      if (Number.isNaN(aYear)) return 1;
      if (Number.isNaN(bYear)) return -1;
      return bYear - aYear;
    });
  }, [records]);

  const sourceOptions = useMemo(() => {
    const sourceSet = new Set<string>();
    records.forEach((record) => {
      if (record.sourceFile) {
        sourceSet.add(record.sourceFile.trim());
      }
    });
    return Array.from(sourceSet).sort((a, b) => a.localeCompare(b));
  }, [records]);

  const hasFilters = selectedYears.length > 0 || selectedSources.length > 0 || search.trim().length > 0;

  const filteredRecords = useMemo(() => {
    if (!hasFilters) return records;
    const searchTerm = search.trim().toLowerCase();
    return records.filter((record) => {
      const matchesYear =
        selectedYears.length === 0 || selectedYears.includes(record.yearLabel.trim() || 'Unspecified');
      const matchesSource =
        selectedSources.length === 0 || selectedSources.includes(record.sourceFile.trim() || 'Unspecified');
      const matchesSearch =
        searchTerm.length === 0 ||
        [
          record.school,
          record.title,
          record.purpose,
          record.grantId,
          record.sourceFile,
          record.dateRange,
          record.dateOfApplication,
          record.dateOfLetter,
          ...record.otherFields.map((field) => `${field.key} ${field.value}`)
        ]
          .join(' ')
          .toLowerCase()
          .includes(searchTerm);
      return matchesYear && matchesSource && matchesSearch;
    });
  }, [records, selectedYears, selectedSources, search, hasFilters]);

  const filteredMetrics = useMemo(() => computeMetrics(filteredRecords), [filteredRecords]);
  const filteredAggregations = useMemo(() => computeAggregations(filteredRecords), [filteredRecords]);

  const activeMetrics = hasFilters ? filteredMetrics : metrics;
  const activeAggregations = hasFilters ? filteredAggregations : aggregations;

  const resetFilters = () => {
    setSelectedSources([]);
    setSelectedYears([]);
    setSearch('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="relative isolate">
        <div className="pointer-events-none absolute inset-x-0 top-[-20rem] -z-10 flex justify-center blur-3xl">
          <div className="aspect-[1155/678] w-[72rem] bg-gradient-to-tr from-brand-500/30 via-brand-400/20 to-brand-200/10 opacity-50" />
        </div>
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-12">
          <header className="flex flex-col gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-200">QFI Intelligence Hub</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Grants portfolio insight dashboard
              </h1>
              <p className="mt-4 max-w-3xl text-base text-white/70">
                Explore grant performance by program, geography, and purpose. Layer filters to understand where funding is
                concentrated, how requests convert to awards, and the stories behind each grant record.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-white/40">
              <span>{records.length} records loaded</span>
              <span>Last refreshed: realtime CSV</span>
              <button
                type="button"
                onClick={refresh}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-white/70 transition hover:border-white/30 hover:text-white"
              >
                Refresh data
              </button>
            </div>
          </header>

          <main className="mt-10 space-y-10">
            <FiltersPanel
              years={yearOptions}
              sources={sourceOptions}
              selectedYears={selectedYears}
              onYearsChange={setSelectedYears}
              selectedSources={selectedSources}
              onSourcesChange={setSelectedSources}
              search={search}
              onSearchChange={setSearch}
              onReset={resetFilters}
            />

            {loading && (
              <p className="rounded-3xl border border-white/5 bg-white/5 p-6 text-sm text-white/70">
                Loading grant data from the CSV source…
              </p>
            )}

            {error && (
              <div className="rounded-3xl border border-rose-500/40 bg-rose-500/10 p-6 text-sm text-rose-100">
                <p className="font-semibold">We ran into an issue fetching data.</p>
                <p className="mt-2 text-rose-50/80">{error}</p>
              </div>
            )}

            {activeMetrics && (
              <SummaryCards metrics={activeMetrics} />
            )}

            {activeAggregations && (
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <YearlyFundingChart data={activeAggregations.amountByYear} />
                </div>
                <div className="lg:col-span-3">
                  <PurposeLeaderboard
                    purposes={activeAggregations.topPurposes}
                    schools={activeAggregations.topSchools}
                  />
                </div>
                <div className="lg:col-span-3">
                  <FundingBySourceChart data={activeAggregations.amountBySource} />
                </div>
              </div>
            )}

            <GrantTable records={filteredRecords} loading={loading} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;

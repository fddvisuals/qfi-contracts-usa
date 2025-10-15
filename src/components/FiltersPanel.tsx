import { ChangeEvent } from 'react';
import { Disclosure, Transition } from '@headlessui/react';
import { FunnelIcon, ChevronUpDownIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface FiltersPanelProps {
  years: string[];
  sources: string[];
  selectedYears: string[];
  onYearsChange: (years: string[]) => void;
  selectedSources: string[];
  onSourcesChange: (sources: string[]) => void;
  search: string;
  onSearchChange: (value: string) => void;
  onReset: () => void;
}

const toggleValue = (current: string[], value: string) => {
  return current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
};

const FiltersPanel = ({
  years,
  sources,
  selectedYears,
  onYearsChange,
  selectedSources,
  onSourcesChange,
  search,
  onSearchChange,
  onReset
}: FiltersPanelProps) => {
  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => onSearchChange(event.target.value);

  const hasActiveFilters = selectedYears.length > 0 || selectedSources.length > 0 || search.trim().length > 0;

  return (
    <section aria-label="Interactive filters" className="rounded-3xl border border-white/5 bg-white/5 p-4 shadow-lg shadow-brand-950/20 backdrop-blur">
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-500/20 px-3 py-1 text-sm font-medium text-brand-100">
          <FunnelIcon className="h-4 w-4" /> Filters
        </span>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-wide text-white/70 transition hover:border-white/30 hover:text-white"
          >
            <XMarkIcon className="h-4 w-4" /> Reset
          </button>
        )}
        <div className="w-full flex-1">
          <label htmlFor="search" className="sr-only">
            Search grants
          </label>
          <input
            id="search"
            type="search"
            value={search}
            onChange={handleSearch}
            placeholder="Search by school, project title, purpose, grant ID..."
            className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/60"
          />
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Disclosure defaultOpen>
          {({ open }: { open: boolean }) => (
            <div className="rounded-2xl border border-white/5 bg-black/20">
              <Disclosure.Button className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-semibold text-white">
                <span>Filter by year</span>
                <ChevronUpDownIcon
                  className={`h-5 w-5 transition-transform ${open ? 'rotate-180 text-brand-200' : 'text-white/60'}`}
                />
              </Disclosure.Button>
              <Transition
                show={open}
                enter="transition duration-150 ease-out"
                enterFrom="transform scale-y-75 opacity-0"
                enterTo="transform scale-y-100 opacity-100"
                leave="transition duration-100 ease-in"
                leaveFrom="transform scale-y-100 opacity-100"
                leaveTo="transform scale-y-75 opacity-0"
              >
                <Disclosure.Panel className="grid max-h-64 gap-2 overflow-y-auto px-4 pb-4">
                  {years.map((year) => (
                    <label key={year} className="flex items-center gap-3 text-sm text-white/80">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-white/20 bg-white/10 text-brand-400 focus:ring-brand-400"
                        checked={selectedYears.includes(year)}
                        onChange={() => onYearsChange(toggleValue(selectedYears, year))}
                      />
                      <span>{year}</span>
                    </label>
                  ))}
                  {years.length === 0 && <p className="text-sm text-white/50">No year data available.</p>}
                </Disclosure.Panel>
              </Transition>
            </div>
          )}
        </Disclosure>

        <Disclosure defaultOpen>
          {({ open }: { open: boolean }) => (
            <div className="rounded-2xl border border-white/5 bg-black/20">
              <Disclosure.Button className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-semibold text-white">
                <span>Filter by source file</span>
                <ChevronUpDownIcon
                  className={`h-5 w-5 transition-transform ${open ? 'rotate-180 text-brand-200' : 'text-white/60'}`}
                />
              </Disclosure.Button>
              <Transition
                show={open}
                enter="transition duration-150 ease-out"
                enterFrom="transform scale-y-75 opacity-0"
                enterTo="transform scale-y-100 opacity-100"
                leave="transition duration-100 ease-in"
                leaveFrom="transform scale-y-100 opacity-100"
                leaveTo="transform scale-y-75 opacity-0"
              >
                <Disclosure.Panel className="grid max-h-64 gap-2 overflow-y-auto px-4 pb-4">
                  {sources.map((source) => (
                    <label key={source} className="flex items-center gap-3 text-sm text-white/80">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-white/20 bg-white/10 text-brand-400 focus:ring-brand-400"
                        checked={selectedSources.includes(source)}
                        onChange={() => onSourcesChange(toggleValue(selectedSources, source))}
                      />
                      <span>{source}</span>
                    </label>
                  ))}
                  {sources.length === 0 && <p className="text-sm text-white/50">No source file data available.</p>}
                </Disclosure.Panel>
              </Transition>
            </div>
          )}
        </Disclosure>
      </div>
    </section>
  );
};

export default FiltersPanel;

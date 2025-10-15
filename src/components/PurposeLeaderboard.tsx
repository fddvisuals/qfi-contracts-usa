import { Aggregations } from '../types';
import { formatCurrency, formatNumber } from '../utils/format';

interface PurposeLeaderboardProps {
  purposes: Aggregations['topPurposes'];
  schools: Aggregations['topSchools'];
}

const PurposeLeaderboard = ({ purposes, schools }: PurposeLeaderboardProps) => {
  return (
    <section className="rounded-3xl border border-white/5 bg-black/20 p-6 shadow-lg shadow-brand-950/20">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Purpose focus areas</h2>
          <p className="text-sm text-white/60">
            Snapshot of the most frequently funded grant purposes and their approved totals.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">School reach</h3>
          <p className="text-xs text-white/60">
            Leading schools by cumulative approved funding across the portfolio.
          </p>
        </div>
      </header>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <article className="flex h-80 flex-col rounded-2xl border border-white/5 bg-white/5 p-4">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-white/60">Purposes</h4>
          <div className="mt-3 flex-1 space-y-3 overflow-y-auto pr-2">
            {purposes.map((item, index) => (
              <div key={item.purpose} className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-black/30 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500/20 text-sm font-semibold text-brand-100">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white/90">{item.purpose}</p>
                    <p className="text-xs uppercase tracking-wide text-white/40">{formatNumber(item.count)} grants</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-brand-100">{formatCurrency(item.amount)}</p>
              </div>
            ))}
            {purposes.length === 0 && <p className="text-sm text-white/50">Purpose details unavailable for the current filters.</p>}
          </div>
        </article>
        <article className="flex h-80 flex-col rounded-2xl border border-white/5 bg-white/5 p-4">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-white/60">Schools</h4>
          <div className="mt-3 flex-1 space-y-3 overflow-y-auto pr-2">
            {schools.map((item, index) => (
              <div key={item.school} className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-black/30 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500/20 text-sm font-semibold text-brand-100">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white/90">{item.school}</p>
                    <p className="text-xs uppercase tracking-wide text-white/40">{formatNumber(item.count)} grants</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-brand-100">{formatCurrency(item.amount)}</p>
              </div>
            ))}
            {schools.length === 0 && <p className="text-sm text-white/50">School details unavailable for the current filters.</p>}
          </div>
        </article>
      </div>
    </section>
  );
};

export default PurposeLeaderboard;

import { GrantMetrics } from '../types';
import { formatCurrency, formatNumber } from '../utils/format';

interface SummaryCardsProps {
  metrics: GrantMetrics;
}

type CardKey = keyof Pick<
  GrantMetrics,
  'totalAwarded' | 'totalRequested' | 'totalGrants' | 'totalSchools' | 'totalSources' | 'averageGrant'
>;

interface CardDefinition {
  key: CardKey;
  title: string;
  description: string;
  formatter: (value: number | null) => string;
}

const cardConfig: CardDefinition[] = [
  {
    key: 'totalAwarded',
    title: 'Total Awarded',
    description: 'Aggregate approved grant funding across the dataset.',
    formatter: formatCurrency
  },
  {
    key: 'totalRequested',
    title: 'Funding Requested',
    description: 'Total dollars organizations requested where data is available.',
    formatter: formatCurrency
  },
  {
    key: 'totalGrants',
    title: 'Grant Records',
    description: 'Individual grant instances tracked across programs.',
    formatter: formatNumber
  },
  {
    key: 'totalSchools',
    title: 'Schools & Partners',
    description: 'Unique schools or institutions receiving support.',
    formatter: formatNumber
  },
  {
    key: 'totalSources',
    title: 'Source Files',
    description: 'Distinct dossiers contributing to the portfolio.',
    formatter: formatNumber
  },
  {
    key: 'averageGrant',
    title: 'Average Grant',
    description: 'Mean approved award amount across all grants.',
    formatter: (value: number | null) => formatCurrency(value, { maximumFractionDigits: 0 })
  }
];

const SummaryCards = ({ metrics }: SummaryCardsProps) => {
  return (
    <section
      aria-label="Headline funding metrics"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6"
    >
      {cardConfig.map(({ key, title, description, formatter }) => {
        const rawValue = metrics[key] ?? null;
        return (
          <article
            key={key}
            className="rounded-2xl border border-white/5 bg-white/5 p-6 shadow-lg shadow-brand-950/20 backdrop-blur"
          >
            <header className="flex items-start justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">{title}</h3>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/10 text-brand-300">
                {title.charAt(0)}
              </span>
            </header>
            <p className="mt-4 text-3xl font-semibold text-white">{formatter(rawValue)}</p>
            <p className="mt-3 text-sm text-white/70">{description}</p>
          </article>
        );
      })}
    </section>
  );
};

export default SummaryCards;

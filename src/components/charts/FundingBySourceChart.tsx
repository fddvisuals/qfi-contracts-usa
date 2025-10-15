import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Aggregations } from '../../types';
import { formatCurrency } from '../../utils/format';

interface FundingBySourceChartProps {
  data: Aggregations['amountBySource'];
}

const FundingBySourceChart = ({ data }: FundingBySourceChartProps) => {
  return (
    <section className="rounded-3xl border border-white/5 bg-black/20 p-6 shadow-lg shadow-brand-950/20">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Top source files by approved funding</h2>
          <p className="text-sm text-white/60">
            Highlights the highest funded source dossiers and how many grant instances they cover.
          </p>
        </div>
      </header>
      <div className="mt-6 h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 120, right: 24, top: 10, bottom: 10 }}
            barSize={16}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.08)" />
            <XAxis
              type="number"
              tickFormatter={(value: number) => formatCurrency(value, { notation: 'compact' })}
              stroke="rgba(255,255,255,0.6)"
            />
            <YAxis
              type="category"
              dataKey="source"
              width={120}
              stroke="rgba(255,255,255,0.6)"
              tick={{ fontSize: 12, fill: 'rgba(226, 232, 240, 0.9)' }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(148, 163, 184, 0.2)' }}
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                borderRadius: '1rem',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                padding: '1rem',
                color: '#e2e8f0'
              }}
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label: string) => `Source file: ${label}`}
            />
            <Bar dataKey="totalAmount" name="Approved funding" fill="#60a5fa" radius={[0, 16, 16, 0]}>
              <Tooltip cursor={{ fill: 'rgba(96,165,250,0.15)' }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-4 text-xs uppercase tracking-widest text-white/40">
        Displaying top 12 source files by approved award volume.
      </p>
    </section>
  );
};

export default FundingBySourceChart;

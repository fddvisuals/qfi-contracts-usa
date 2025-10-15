import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { Aggregations } from '../../types';
import { formatCurrency } from '../../utils/format';

interface YearlyFundingChartProps {
  data: Aggregations['amountByYear'];
}

const YearlyFundingChart = ({ data }: YearlyFundingChartProps) => {
  return (
    <section className="rounded-3xl border border-white/5 bg-black/20 p-6 shadow-lg shadow-brand-950/20">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Funding momentum</h2>
          <p className="text-sm text-white/60">
            Track the annual flow of approved grants over time.
          </p>
        </div>
      </header>
      <div className="mt-6 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="amountGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#4ba0ff" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#4ba0ff" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="year" stroke="rgba(255,255,255,0.6)" tickLine={false} />
            <YAxis
              stroke="rgba(255,255,255,0.6)"
              tickFormatter={(value) => formatCurrency(value, { notation: 'compact' })}
              tickLine={false}
              width={90}
            />
            <Tooltip
              cursor={{ stroke: 'rgba(148, 163, 184, 0.4)', strokeDasharray: '4 3' }}
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                borderRadius: '1rem',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                padding: '1rem',
                color: '#e2e8f0'
              }}
              formatter={(value: number, name: string) => [formatCurrency(value), name]}
            />
            <Legend formatter={(value) => <span className="text-sm text-white/80">{value}</span>} />
            <Area
              type="monotone"
              dataKey="totalAmount"
              name="Approved"
              stroke="#4ba0ff"
              strokeWidth={2}
              fill="url(#amountGradient)"
              fillOpacity={1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default YearlyFundingChart;

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface HealthDonutProps {
  title: string;
  healthy: number;
  warning: number;
  critical: number;
  total: number;
  subtitle?: string;
}

export function HealthDonut({ title, healthy, warning, critical, total, subtitle }: HealthDonutProps) {
  const data = [
    { name: 'Healthy', value: healthy, color: 'hsl(142, 71%, 45%)' },
    { name: 'Warning', value: warning, color: 'hsl(38, 92%, 50%)' },
    { name: 'Critical', value: critical, color: 'hsl(0, 72%, 51%)' },
  ];

  const healthPercent = total > 0 ? Math.round((healthy / total) * 100) : 0;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={38}
              outerRadius={55}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-foreground">{healthPercent}%</span>
        </div>
      </div>
      <div className="mt-2 text-center">
        <div className="text-sm font-medium text-foreground">{title}</div>
        {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
      </div>
      <div className="flex gap-3 mt-2 text-xs">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'hsl(142, 71%, 45%)' }} />
          {healthy}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'hsl(38, 92%, 50%)' }} />
          {warning}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'hsl(0, 72%, 51%)' }} />
          {critical}
        </span>
      </div>
    </div>
  );
}


import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from 'recharts';
const COLORS = ['#00C49F', '#FF0000', '#FFBB28', '#0088FE', '#800080', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, percent, index }) => {
    if (percent === 0) return null;
  
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
};

const renderEmptyPie = () => (
  <Pie data={[{ name: 'Belum Ada', value: 1 }]} cx="50%" cy="50%" outerRadius={80} fill="#ccc" dataKey="value">
    <Cell fill="#ccc" />
  </Pie>
);

function DonutChart({ data, title }) {
  const totalValue = data.reduce((acc, entry) => acc + entry.value, 0);

  return (
    <div>
      <h4 className="text-center pt-5 opacity-70">{title}</h4>
      <ResponsiveContainer height={200}>
        <PieChart>
          {totalValue === 0 ? (
            renderEmptyPie()
          ) : (
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          )}
          <Tooltip />
          <Legend layout="vertical" align="right" verticalAlign="middle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DonutChart;

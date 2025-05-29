import React from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import ResizableBox from "./ResizableBox";

const COLORS = [
  "#00C49F",
  "#FF0000",
  "#FFBB28",
  "#0088FE",
  "#800080",
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  value,
  percent,
  index,
}) => {
  if (percent === 0) return null;

  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${value} (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
};

function DonutChart2({ data }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
      <Pie
          data={data}
          cx={120}
          cy={200}
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
       
        <Tooltip />

        <Legend layout="vertical" align="right" verticalAlign="middle" />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default DonutChart2;

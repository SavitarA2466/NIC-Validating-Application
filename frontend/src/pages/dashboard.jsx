import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import 'tailwindcss/tailwind.css';

// Color palettes
const BAR_COLORS = ['#4E79A7', '#F28E2B'];
const PIE_COLORS = ['#FF6F61', '#6B5B95'];

const NicCountBarChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
      <XAxis dataKey="date" className="text-sm" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="male" stackId="a">
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={BAR_COLORS[0]} />
        ))}
        <LabelList dataKey="male" position="inside" fill="#fff" />
      </Bar>
      <Bar dataKey="female" stackId="a">
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={BAR_COLORS[1]} />
        ))}
        <LabelList dataKey="female" position="inside" fill="#fff" />
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

const GenderDistributionPieChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={120}
        fill="#8884d8"
        dataKey="value"
        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        animationDuration={1000}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
);

function Dashboard() {
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);

  const fetchNicStats = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/nic-validation/stats/last7days');
      const data = response.data;

      const groupedData = data.reduce((acc, item) => {
        if (!acc[item.date]) {
          acc[item.date] = { date: item.date, male: 0, female: 0 };
        }
        acc[item.date][item.gender.toLowerCase()] += item.count;
        return acc;
      }, {});

      setBarData(Object.values(groupedData));
    } catch (err) {
      console.error('Failed to fetch NIC stats:', err);
    }
  };

  const fetchGenderDistribution = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/nic-validation/stats/gender-distribution');
      const data = response.data;

      setPieData(
        data.map((item) => ({
          name: item.gender,
          value: item.count,
        }))
      );
    } catch (err) {
      console.error('Failed to fetch gender distribution:', err);
    }
  };

  useEffect(() => {
    fetchNicStats();
    fetchGenderDistribution();
  }, []);

  return (
    <div className="container mx-auto p-6 pt-16 bg-gradient-to-r from-indigo-50 to-blue-50 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 mb-8">
        <div className="col-span-2 bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <h3 className="text-2xl font-semibold text-indigo-600 mb-4">NIC Count Overview</h3>
          <NicCountBarChart data={barData} />
        </div>

        <div className="col-span-1 bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <h3 className="text-2xl font-semibold text-indigo-600 mb-4">Gender Distribution</h3>
          <GenderDistributionPieChart data={pieData} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;


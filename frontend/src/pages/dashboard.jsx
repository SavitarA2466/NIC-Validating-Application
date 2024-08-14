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
  ResponsiveContainer
} from 'recharts';
import 'tailwindcss/tailwind.css';

function Dashboard() {
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);

  // Fetch NIC stats for the last 7 days
  const fetchNicStats = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/nic-validation/stats/last7days');
      const data = response.data;

      // Group data by date and gender
      const groupedData = data.reduce((acc, item) => {
        if (!acc[item.date]) {
          acc[item.date] = { date: item.date, male: 0, female: 0 };
        }
        if (item.gender === 'Male') {
          acc[item.date].male += item.count;
        } else if (item.gender === 'Female') {
          acc[item.date].female += item.count;
        }
        return acc;
      }, {});

      setBarData(Object.values(groupedData)); // Set data for bar chart
    } catch (err) {
      console.error('Failed to fetch NIC stats:', err);
    }
  };

  // Fetch gender distribution data
  const fetchGenderDistribution = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/nic-validation/stats/gender-distribution');
      const data = response.data;

      // Format data for pie chart
      const formattedData = data.map(item => ({
        name: item.gender,
        value: item.count,
      }));

      setPieData(formattedData); // Set data for pie chart
    } catch (err) {
      console.error('Failed to fetch gender distribution:', err);
    }
  };

  useEffect(() => {
    fetchNicStats(); // Fetch bar chart data on mount
    fetchGenderDistribution(); // Fetch pie chart data on mount
  }, []);

  const COLORS = ['#D95890', '#106DB5']; // Define colors for pie chart

  return (

    <div className="container mx-auto p-6 pt-16">

      <div className="grid grid-cols-3 gap-7 mb-8 pt-12">
        <div className="col-span-2 bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">NIC Count (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" className='text-sm'/>
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="male" stackId="a" fill="#106DB5" />
              <Bar dataKey="female" stackId="a" fill="#D95890" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="col-span-1 bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Gender Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#7F7BC9"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

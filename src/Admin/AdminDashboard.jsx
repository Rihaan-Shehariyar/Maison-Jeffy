// AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { FaDollarSign, FaShoppingCart, FaUserAlt, FaTruck, FaChartLine } from "react-icons/fa";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersRes = await axios.get("http://localhost:5000/orders");
        const usersRes = await axios.get("http://localhost:5000/users");
        setOrders(ordersRes.data);
        setUsers(usersRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p className="text-center mt-20 text-white">Loading dashboard...</p>;

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const totalCustomers = users.length;
  const pendingDelivery = orders.filter(order => order.status === "Pending").length;
  const totalProfit = totalRevenue * 0.3;
  const avgOrderValue = totalOrders ? (totalRevenue / totalOrders).toFixed(2) : 0;

  const salesByDate = orders.reduce((acc, order) => {
    const date = new Date(order.date).toLocaleDateString();
    if (!acc[date]) acc[date] = 0;
    acc[date] += order.total;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(salesByDate),
    datasets: [
      {
        label: "Revenue",
        data: Object.values(salesByDate),
        fill: true,
        backgroundColor: "rgba(59, 130, 246, 0.3)",
        borderColor: "rgba(59, 130, 246, 1)",
        tension: 0.4,
        pointRadius: 3,
      },
    ],
  };

  const overviewData = [
    { title: "Total Revenue", value: `$${totalRevenue}`, icon: <FaDollarSign className="text-green-400" /> },
    { title: "Total Orders", value: totalOrders, icon: <FaShoppingCart className="text-blue-400" /> },
    { title: "Total Customers", value: totalCustomers, icon: <FaUserAlt className="text-yellow-400" /> },
    { title: "Pending Delivery", value: pendingDelivery, icon: <FaTruck className="text-red-400" /> },
  ];

  const profitData = [
    { title: "Total Profit", value: `$${totalProfit}`, icon: <FaDollarSign className="text-purple-400" /> },
    { title: "Avg Order Value", value: `$${avgOrderValue}`, icon: <FaChartLine className="text-indigo-400" /> },
  ];

  return (
    <div className="p-5 flex flex-col gap-6 bg-[#0f172a] min-h-screen text-white">
      {/* Overview */}
    
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {overviewData.map((item, idx) => (
          <div key={idx} className="bg-[#1e293b] p-4 rounded shadow flex flex-col gap-1 text-sm">
            <div className="flex justify-between items-center">
              <div className="font-semibold">{item.title}</div>
              <div className="text-lg">{item.icon}</div>
            </div>
            <div className="text-xl font-bold">{item.value}</div>
          </div>
        ))}
      </div>

      {/* Profit & Revenue Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {profitData.map((item, idx) => (
          <div key={idx} className="bg-[#1e293b] p-4 rounded shadow flex flex-col gap-1 text-sm">
            <div className="flex justify-between items-center">
              <div className="font-semibold">{item.title}</div>
              <div className="text-lg">{item.icon}</div>
            </div>
            <div className="text-xl font-bold">{item.value}</div>
          </div>
        ))}
      </div>

      {/* Sales Area Chart */}
      <div className="bg-[#1e293b] p-4 rounded shadow w-full">
        <h2 className="font-semibold text-sm mb-2 text-white">Sales Analytics</h2>
        <div className="w-full h-72 md:h-96">
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { labels: { color: "white" } },
                tooltip: { bodyColor: "white", titleColor: "white" },
              },
              scales: {
                x: { ticks: { color: "white", autoSkip: false, maxRotation: 0 }, grid: { color: "#334155" } },
                y: { beginAtZero: true, ticks: { color: "white" }, grid: { color: "#334155" } },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

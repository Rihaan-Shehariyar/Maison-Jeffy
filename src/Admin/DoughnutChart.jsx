import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DoughnutChart() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Count how many times each product was sold
  const productSales = {};
  orders.forEach((order) => {
    order.products.forEach((prod) => {
      productSales[prod.name] = (productSales[prod.name] || 0) + prod.qty;
    });
  });

  const chartData = {
    labels: Object.keys(productSales),
    datasets: [
      {
        label: "Most Sold Products",
        data: Object.values(productSales),
        backgroundColor: [
          "#3b82f6",
          "#f59e0b",
          "#10b981",
          "#ef4444",
          "#8b5cf6",
          "#ec4899",
          "#14b8a6",
        ],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Most Sold Products

        
      </h2>

      {Object.keys(productSales).length > 0 ? (
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          {/* Legend Section */}
          <div className="flex flex-col gap-3">
            {Object.keys(productSales).map((label, index) => (
              <div key={label} className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{
                    backgroundColor: [
                      "#3b82f6",
                      "#f59e0b",
                      "#10b981",
                      "#ef4444",
                      "#8b5cf6",
                      "#ec4899",
                      "#14b8a6",
                    ][index % 7],
                  }}
                ></div>
                <span className="text-gray-700 text-sm font-medium">
                  {label} — {productSales[label]} sold
                </span>
              </div>
            ))}
          </div>

          {/* Chart Section */}
          <div className="w-64 h-64 md:w-80 md:h-80 ">
            <Doughnut
              data={chartData}
              options={{
                plugins: {
                  legend: { display: false }, // hide default legend
                },
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No order data available</p>
      )}
    </div>
  );
}

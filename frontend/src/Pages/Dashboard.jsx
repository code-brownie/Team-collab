/* eslint-disable no-unused-vars */
import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import summaryData from "../data/SummaryData";
import SummaryCard from "../components/SummaryCard";
import { doughnutChartData, doughnutChartOptions, lineChartData, lineChartOptions } from "../data/ChartData";

// Register required components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

const Dashboard = () => {
  return (
    <div className="dashboard-container p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center lg:text-left">
        Dashboard
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryData.map((card, index) => (
          <SummaryCard
            key={index}
            title={card.title}
            value={card.value}
            change={card.change}
            changeColor={card.changeColor}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="bg-white p-6 shadow rounded mb-8">
        <h3 className="text-xl font-bold mb-4">Task Overview</h3>
        <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
          <div className="flex flex-col items-center">
            <div className="w-40 h-40">
              <Doughnut
                data={doughnutChartData}
                options={doughnutChartOptions}
              />
            </div>
            <div className="flex justify-between w-full mt-4">
              <div className="text-center">
                <span className="block w-3 h-3 rounded-full bg-indigo-600 mx-auto mb-1"></span>
                <p className="text-gray-700 text-sm mx-1">Projects Completed</p>
                <p className="text-gray-500 text-xs">45%</p>
              </div>
              <div className="text-center">
                <span className="block w-3 h-3 rounded-full bg-indigo-300 mx-auto mb-1"></span>
                <p className="text-gray-700 text-sm mx-1">Tasks Completed</p>
                <p className="text-gray-500 text-xs">35%</p>
              </div>
              <div className="text-center">
                <span className="block w-3 h-3 rounded-full bg-indigo-100 mx-auto mb-1"></span>
                <p className="text-gray-700 text-sm mx-1">Tasks Pending</p>
                <p className="text-gray-500 text-xs">20%</p>
              </div>
            </div>
          </div>
          {/* Line Chart */}
          <div className="flex flex-col items-center w-full lg:w-80 h-60">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="stat-card bg-white p-4 shadow rounded">
          <h3 className="text-gray-500">Projects Completed</h3>
          <p className="text-2xl font-bold">150</p>
        </div>
        <div className="stat-card bg-white p-4 shadow rounded">
          <h3 className="text-gray-500">Tasks Completed</h3>
          <p className="text-2xl font-bold">620</p>
        </div>
        <div className="stat-card bg-white p-4 shadow rounded">
          <h3 className="text-gray-500">Tasks Pending</h3>
          <p className="text-2xl font-bold">115</p>
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;

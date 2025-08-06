import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getAdminMetrics } from "../api";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useUser } from "../context/UserContext";

// Register necessary chart elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Tooltip,
  Legend
);

/**
 * Renders the admin metrics chart (bar chart visualization)
 */
const MetricsChart = ({ data }) => {
  const labels = data.map((d) => new Date(d.date).toLocaleDateString());

  const chartData = {
    labels,
    datasets: [
      {
        label: "Bursts",
        data: data.map((d) => d.bursts),
        backgroundColor: "rgba(59,130,246,0.8)", // blue-500
      },
      {
        label: "Wins",
        data: data.map((d) => d.wins),
        backgroundColor: "rgba(34,197,94,0.6)", // green-500
      },
      {
        label: "Purchases",
        data: data.map((d) => d.purchases),
        backgroundColor: "rgba(234,179,8,0.6)", // yellow-500
      },
      {
        label: "Redemptions",
        data: data.map((d) => d.redemptions),
        backgroundColor: "rgba(239,68,68,0.6)", // red-500
      },
      {
        label: "Referrals",
        data: data.map((d) => d.referrals),
        backgroundColor: "rgba(168,85,247,0.6)", // purple-500
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: { legend: { position: "bottom" } },
    scales: { x: { ticks: { maxTicksLimit: 10 } } },
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md h-80">
      <Bar data={chartData} options={options} />
    </div>
  );
};

/**
 * AdminMetrics Page Component
 * Displays summary tiles + time-based metrics graph
 */
const AdminMetrics = () => {
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState(null);
  const [timeRange, setTimeRange] = useState("daily"); // 'daily' | 'weekly' | 'monthly'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useUser();

  /**
   * Fetches metrics data based on selected time range
   */
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const now = new Date();
        let since = new Date(now);

        // Calculate 'since' date based on time range
        if (timeRange === "weekly") since.setDate(now.getDate() - 7);
        else if (timeRange === "monthly") since.setDate(now.getDate() - 30);
        else since.setDate(now.getDate() - 1); // default daily

        const response = await getAdminMetrics(since.toISOString(), user.email);
        setMetrics(response.data);
        setLoading(false);
      } catch (err) {
        setError(t("common.error"));
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [timeRange, t]);

  if (loading)
    return <div className="text-center py-10">{t("common.loading")}</div>;
  if (error)
    return <div className="text-center py-10 text-red-600">{error}</div>;

  const rangeButtons = ["daily", "weekly", "monthly"];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header & Time Range Toggle */}
      <div className="flex justify-center md:justify-between items-center mb-8 flex-wrap gap-2">
        <h1 className="text-3xl font-bold">{t("admin.metrics.title")}</h1>
        <div className="flex space-x-2">
          {rangeButtons.map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-md ${
                timeRange === range
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {t(`admin.metrics.${range}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Summary Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {["bursts", "wins", "purchases", "redemptions", "referrals"].map(
          (key) => (
            <div key={key} className="bg-white p-4 rounded-md shadow-md">
              <h3 className="text-sm text-gray-500 mb-1">
                {t(`admin.metrics.${key}`)}
              </h3>
              <p className="text-2xl font-bold">
                {metrics[key]?.toLocaleString()}
              </p>
            </div>
          )
        )}
      </div>

      {/* Metrics Chart */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {t("admin.metrics.timeRange")}: {t(`admin.metrics.${timeRange}`)}
        </h2>
        <MetricsChart data={metrics.history} />
      </div>
    </div>
  );
};

export default AdminMetrics;

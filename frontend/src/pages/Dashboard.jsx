import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logoIcon from "../assets/icon.png"; // Better than using a hardcoded path

// Dashboard navigation items
const linkItems = [
  {
    label: "Merch Store",
    path: "/merch-store",
    key: "nav.merchStore",
    title: "Browse and redeem merchandise with your credits",
  },
  {
    label: "Admin Metrics",
    path: "/admin-metrics",
    key: "nav.adminMetrics",
    title: "View platform metrics and KPIs",
  },
  {
    label: "Lane Console",
    path: "/lane-console",
    key: "nav.laneConsole",
    title: "Manage lane impact scores and states",
  },
];

const Dashboard = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col justify-center items-center w-full pt-4 pb-16 text-center">
        <div className="flex items-center gap-2 pb-2">
          <img
            src={logoIcon}
            alt="50CUBE Logo"
            className="w-14 h-14"
            aria-label="50CUBE logo"
          />
          <h1 className="text-[36px] font-bold">
            <span className="text-[#0b3b6c]">50</span>
            <span className="text-black">CUBE</span>
          </h1>
        </div>

        <h3 className="text-gray-600 max-w-xl">
          A bite-sized interactive platform with a points-based system. Explore
          merchandise redemption, admin metrics, and lane management
          capabilities.
        </h3>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {linkItems.map(({ path, key, title }) => (
          <Link
            to={path}
            key={key}
            className="bg-white p-6 rounded-md shadow-md hover:shadow-lg hover:scale-[120%] transition-all duration-300"
          >
            <h2 className="text-xl font-semibold mb-2">{t(key)}</h2>
            <p className="text-gray-600">{title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

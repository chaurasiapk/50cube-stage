import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import MerchStore from "./pages/MerchStore";
import AdminMetrics from "./pages/AdminMetrics";
import LaneConsole from "./pages/LaneConsole";
import { Login } from "./pages/Login";
import { useUser } from "./context/UserContext";

function App() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          {user?.isLoggedIn ? (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/merch-store" element={<MerchStore />} />
              <Route
                path="/admin-metrics"
                element={user?.isAdmin ? <AdminMetrics /> : <Navigate to="/" />}
              />
              <Route path="/lane-console" element={<LaneConsole />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<Login />} />
            </>
          )}
        </Routes>
      </main>
    </div>
  );
}

export default App;

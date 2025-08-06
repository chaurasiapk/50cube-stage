import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getLanesImpact, updateLaneState } from "../api";

// -------------------------------------
// Reusable Chip Component for Lane State
// -------------------------------------
const StateChip = ({ state, onClick, active }) => {
  const stateColors = {
    ok: "bg-green-100 text-green-800",
    watchlist: "bg-yellow-100 text-yellow-800",
    save: "bg-red-100 text-red-800",
    archive: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full w-20 justify-center text-sm flex font-medium cursor-pointer capitalize ${
        stateColors[state]
      } ${active ? "ring-2 ring-offset-2 ring-blue-500" : ""}`}
      onClick={onClick}
    >
      {state}
    </span>
  );
};

// -------------------------------------
// Main Component: LaneConsole
// -------------------------------------
const LaneConsole = () => {
  const { t } = useTranslation();

  // -------------------------
  // State Variables
  // -------------------------
  const [lanes, setLanes] = useState([]); // all lanes
  const [filteredLanes, setFilteredLanes] = useState([]); // filtered lanes based on state + search
  const [loading, setLoading] = useState(true); // loading state
  const [error, setError] = useState(null); // error state
  const [selectedLane, setSelectedLane] = useState(null); // currently selected lane for details
  const [stateFilter, setStateFilter] = useState("all"); // dropdown filter
  const [searchQuery, setSearchQuery] = useState(""); // search input

  // -------------------------
  // Fetch lanes from API
  // -------------------------
  useEffect(() => {
    const fetchLanes = async () => {
      try {
        setLoading(true);
        const response = await getLanesImpact();
        setLanes(response.data);
        setFilteredLanes(response.data);
      } catch (err) {
        setError("Failed to load lanes data");
      } finally {
        setLoading(false);
      }
    };

    fetchLanes();
  }, []);

  // -------------------------
  // Filter lanes based on state + search
  // -------------------------
  useEffect(() => {
    let result = [...lanes];

    // Filter by selected state
    if (stateFilter !== "all") {
      result = result.filter((lane) => lane.state === stateFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (lane) =>
          lane.name.toLowerCase().includes(query) ||
          lane.description.toLowerCase().includes(query)
      );
    }

    setFilteredLanes(result);
  }, [lanes, stateFilter, searchQuery]);

  // -------------------------
  // Select or deselect a lane
  // -------------------------
  const handleSelectLane = (lane) => {
    setSelectedLane((prev) => (prev?._id === lane._id ? null : lane));
  };

  // -------------------------
  // Update lane state via API
  // -------------------------
  const handleUpdateState = async (laneId, newState) => {
    try {
      await updateLaneState(laneId, newState);

      const updatedLanes = lanes.map((lane) =>
        lane._id === laneId
          ? { ...lane, state: newState, updatedAt: new Date().toISOString() }
          : lane
      );

      setLanes(updatedLanes);

      if (selectedLane && selectedLane._id === laneId) {
        setSelectedLane({
          ...selectedLane,
          state: newState,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      setError("Failed to update lane state");
    }
  };

  // -------------------------
  // UI: Loading / Error States
  // -------------------------
  if (loading) {
    return <div className="text-center py-10">{t("common.loading")}</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  // -------------------------
  // Main Render
  // -------------------------
  return (
    <div className="max-w-6xl mx-auto">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-8 text-center md:text-left">
        {t("admin.lanes.title")}
      </h1>

      {/* Filters: Search & State */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search lanes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />

        {/* State Filter Dropdown */}
        <div className="relative w-full md:w-48">
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="appearance-none w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="ok">OK</option>
            <option value="watchlist">Watchlist</option>
            <option value="save">Save</option>
            <option value="archive">Archive</option>
          </select>

          {/* Dropdown Icon */}
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg
              className="w-4 h-4 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 14a1 1 0 01-.7-.29l-4-4a1 1 0 011.4-1.42L10 11.58l3.3-3.29a1 1 0 011.4 1.42l-4 4A1 1 0 0110 14z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Lanes Table */}
      <div className="bg-white rounded-md shadow-md overflow-hidden overflow-x-auto mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Name", t("admin.lanes.impact"), t("admin.lanes.state"), "Last Updated", "Actions"].map(
                (title, i) => (
                  <th
                    key={i}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {title}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLanes.map((lane) => (
              <React.Fragment key={lane._id}>
                {/* Lane Row */}
                <tr
                  className={`hover:bg-gray-50 cursor-pointer ${
                    selectedLane?._id === lane._id ? "bg-blue-50" : ""
                  }`}
                  onClick={() => handleSelectLane(lane)}
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {lane.name}
                    </div>
                    <div className="text-sm text-gray-500">{lane.description}</div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div
                        className={`h-2.5 w-2.5 rounded-full mr-2 ${
                          lane.impactScore >= 70
                            ? "bg-green-500"
                            : lane.impactScore >= 40
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      />
                      <span>{lane.impactScore}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 capitalize">
                    <StateChip state={lane.state} />
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(lane.updatedAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button
                      className="text-blue-600 hover:text-blue-900"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectLane(lane);
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>

                {/* Lane Detail Row (Expanded) */}
                {selectedLane && selectedLane._id === lane._id && (
                  <tr>
                    <td colSpan="5">
                      <div className="bg-white p-6 rounded-md shadow-md">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h2 className="text-2xl font-bold">{selectedLane.name}</h2>
                            <p className="text-gray-600">{selectedLane.description}</p>
                          </div>
                          <button
                            className="text-gray-500 hover:text-gray-700"
                            onClick={() => setSelectedLane(null)}
                          >
                            ×
                          </button>
                        </div>

                        {/* Metrics Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-2">
                              {t("admin.lanes.impact")}
                            </h3>
                            <div className="flex items-center">
                              <div
                                className={`h-3 w-3 rounded-full mr-2 ${
                                  selectedLane.impactScore >= 70
                                    ? "bg-green-500"
                                    : selectedLane.impactScore >= 40
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }`}
                              />
                              <span className="text-2xl font-bold">
                                {selectedLane.impactScore}
                              </span>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-2">
                              Users
                            </h3>
                            <p className="text-2xl font-bold">
                              {selectedLane.metrics.users.toLocaleString()}
                            </p>
                          </div>

                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-2">
                              Engagement
                            </h3>
                            <p className="text-2xl font-bold">
                              {selectedLane.metrics.engagement}%
                            </p>
                          </div>
                        </div>

                        {/* State Management Section */}
                        <div className="mb-6">
                          <h3 className="text-sm font-medium text-gray-500 mb-2">
                            {t("admin.lanes.state")}
                          </h3>
                          <div className="flex space-x-2">
                            {["ok", "watchlist", "save", "archive"].map((state) => (
                              <StateChip
                                key={state}
                                state={state}
                                active={selectedLane.state === state}
                                onClick={() => handleUpdateState(selectedLane._id, state)}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t pt-4">
                          <p className="text-sm text-gray-500">
                            Last updated:{" "}
                            {new Date(selectedLane.updatedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LaneConsole;

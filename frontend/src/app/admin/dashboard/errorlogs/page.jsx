"use client";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getErrorLogs } from "@/app/store/ErrorLog/errorLogApi";
import { resetErrorLogs } from "@/app/store/ErrorLog/errorLog.slice";
import { FiRefreshCw } from "react-icons/fi";

export default function ErrorLogsPage() {
  const dispatch = useDispatch();
  const { logList, loading, error } = useSelector(
    (state) => state.errorLogData
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedLogs, setExpandedLogs] = useState({}); // Track expanded logs

  useEffect(() => {
    dispatch(getErrorLogs());
    return () => {
      dispatch(resetErrorLogs());
    };
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(getErrorLogs());
    setExpandedLogs({}); // Reset expanded state
  };

  const toggleStackTrace = (index) => {
    setExpandedLogs((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const filterLogs = (logs) =>
    logs.filter((log) =>
      JSON.stringify(log).toLowerCase().includes(searchTerm.toLowerCase())
    );

  const getErrorColor = (level) => {
    switch (level) {
      case "error":
        return "bg-red-100 border-red-500";
      case "warn":
        return "bg-yellow-100 border-yellow-500";
      case "info":
        return "bg-blue-100 border-blue-500";
      default:
        return "bg-gray-100 border-gray-300";
    }
  };

  const renderLogs = (logs) =>
    logs.map((log, index) => (
      <div
        key={index}
        className={`p-4 rounded-lg min-h-[16vh] h-fit shadow-md border ${getErrorColor(
          log.level
        )}`}
      >
        <p className="text-sm">
          <span className="font-bold">Message:</span> {log.message}
        </p>
        {log.route && (
          <p className="text-sm">
            <span className="font-bold">Route:</span> {log.route}
          </p>
        )}
        {log.method && (
          <p className="text-sm">
            <span className="font-bold">Method:</span> {log.method}
          </p>
        )}
        <p className="text-sm">
          <span className="font-bold">Timestamp:</span>{" "}
          {new Date(log.timestamp).toLocaleString()}
        </p>
        {log.stack && (
          <div className="mt-2">
            <button
              onClick={() => toggleStackTrace(index)}
              className="text-blue-600 underline focus:outline-none"
            >
              {expandedLogs[index] ? "Hide Stack Trace" : "View Stack Trace"}
            </button>
            {expandedLogs[index] && (
              <pre className="mt-2 p-2 bg-gray-200 rounded text-sm overflow-x-auto">
                {log.stack}
              </pre>
            )}
          </div>
        )}
      </div>
    ));

  return (
    <div className="container  min-h-screen mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Error Logs</h1>
        <button
          onClick={handleRefresh}
          className="text-blue-600 hover:text-blue-800 text-center focus:outline-none"
        >
          <FiRefreshCw size={24} /> <span className="text-center">Refresh</span>
        </button>
      </div>

      {/* Loading and Error Messages */}
      {loading && <p className="text-center text-blue-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Search Bar */}
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search logs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>

      {/* Logs Content */}
      <div className="grid grid-cols-1  h-auto sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {renderLogs(filterLogs(logList || []))}
      </div>
    </div>
  );
}

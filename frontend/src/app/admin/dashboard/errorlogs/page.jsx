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

  const renderLogs = (logs) => {
    // Helper to format date as "Today", "Yesterday", or actual date
    const formatLogDate = (timestamp) => {
      const logDate = new Date(timestamp);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      if (logDate.toDateString() === today.toDateString()) {
        return "Today";
      } else if (logDate.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
      } else {
        return logDate.toLocaleDateString();
      }
    };

    // Check if the log occurred within the last hour
    const isLatest = (timestamp) => {
      const logDate = new Date(timestamp);
      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);
      return logDate > oneHourAgo;
    };

    return logs.map((log, index) => (
      <div
        key={index}
        className={`p-4 rounded-lg min-h-[16vh] h-fit shadow-md border-l-4 ${getErrorColor(
          log.level
        )} bg-white dark:bg-gray-800`}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {formatLogDate(log.timestamp)}{" "}
            {/* Display 'Latest' label if within the last hour */}
            {isLatest(log.timestamp) && (
              <div className="inline-block bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full mt-2">
                Latest
              </div>
            )}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(log.timestamp).toLocaleTimeString()}
          </p>
        </div>

        <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">
          <span className="font-bold ">Message: </span>
          {log.message}
        </p>

        {log.route && (
          <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
            <span className="font-bold ">Route:</span> {log.route}
          </p>
        )}

        {log.method && (
          <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
            <span className="font-bold ">Method:</span> {log.method}
          </p>
        )}

        {log.stack && (
          <div className="mt-4">
            <button
              onClick={() => toggleStackTrace(index)}
              className="text-blue-600 underline hover:text-blue-800 focus:outline-none dark:text-blue-400 dark:hover:text-blue-500"
            >
              {expandedLogs[index] ? "Hide Stack Trace" : "View Stack Trace"}
            </button>
            {expandedLogs[index] && (
              <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-sm overflow-x-auto text-gray-700 dark:text-gray-300">
                {log.stack}
              </pre>
            )}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="container  min-h-screen mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-gray-300">Error Logs</h1>
        <button
          onClick={handleRefresh}
          className="text-blue-600 dark:text-gray-300 hover:text-blue-800 text-center flex focus:outline-none"
        >
          <FiRefreshCw size={24} />{" "}
          <span className="text-center ml-2">Refresh</span>
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
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
        />
      </div>

      {/* Logs Content */}
      <div className="grid grid-cols-1  h-auto sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {renderLogs(filterLogs(logList || []))}
      </div>
    </div>
  );
}

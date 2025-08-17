import React, { createContext, useState } from "react";

export const ReportContext = createContext();

export const ReportProvider = ({ children }) => {
  const [reports, setReports] = useState([]);

  const addReport = (report) => {
    setReports((prev) => [...prev, report]);
  };

  const updateReport = (id, updatedReport) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updatedReport } : r))
    );
  };

  const deleteReport = (id) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  // Tandai otomatis laporan kadaluarsa >2 menit
  setTimeout(() => {
    setReports((prev) =>
      prev.map((r) => {
        if (!r.expired && Date.now() - r.timestamp > 2 * 60 * 1000) {
          return { ...r, expired: true };
        }
        return r;
      })
    );
  }, 1000);

  return (
    <ReportContext.Provider
      value={{ reports, addReport, updateReport, deleteReport }}
    >
      {children}
    </ReportContext.Provider>
  );
};

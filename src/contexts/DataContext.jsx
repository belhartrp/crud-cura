// src/context/DataContext.jsx
import React, { createContext, useState, useEffect } from 'react';

// Buat context
export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // State profil user
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : null;
  });

  // State laporan
  const [reports, setReports] = useState(() => {
    const saved = localStorage.getItem('reports');
    return saved ? JSON.parse(saved) : [];
  });

  // Simpan ke LocalStorage saat berubah
  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('reports', JSON.stringify(reports));
  }, [reports]);

  return (
    <DataContext.Provider value={{ userProfile, setUserProfile, reports, setReports }}>
      {children}
    </DataContext.Provider>
  );
};

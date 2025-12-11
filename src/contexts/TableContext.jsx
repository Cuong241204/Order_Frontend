import React, { createContext, useContext, useState, useEffect } from 'react';

const TableContext = createContext();

export const useTable = () => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('useTable must be used within a TableProvider');
  }
  return context;
};

export const TableProvider = ({ children }) => {
  const [currentTable, setCurrentTable] = useState(null);

  useEffect(() => {
    // Load table from localStorage or URL params
    const storedTable = localStorage.getItem('currentTable');
    if (storedTable) {
      setCurrentTable(JSON.parse(storedTable));
    } else {
      // Check URL for table parameter
      const urlParams = new URLSearchParams(window.location.search);
      const tableId = urlParams.get('table');
      if (tableId) {
        const table = { id: tableId, number: `Bàn ${tableId}` };
        setCurrentTable(table);
        localStorage.setItem('currentTable', JSON.stringify(table));
      }
    }
  }, []);

  const setTable = (table) => {
    setCurrentTable(table);
    if (table) {
      localStorage.setItem('currentTable', JSON.stringify(table));
    } else {
      localStorage.removeItem('currentTable');
    }
  };

  const clearTable = () => {
    setCurrentTable(null);
    localStorage.removeItem('currentTable');
  };

  const value = {
    currentTable,
    setTable,
    clearTable
  };

  return <TableContext.Provider value={value}>{children}</TableContext.Provider>;
};




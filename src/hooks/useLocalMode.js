import { useState, useEffect } from 'react';

export function useLocalMode() {
  const [isLocalMode, setIsLocalMode] = useState(() => {
    return localStorage.getItem('taskmark_local_mode') === 'true';
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLocalMode(localStorage.getItem('taskmark_local_mode') === 'true');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const setLocalMode = (value) => {
    if (value) {
      localStorage.setItem('taskmark_local_mode', 'true');
    } else {
      localStorage.removeItem('taskmark_local_mode');
    }
    setIsLocalMode(value);
  };

  return { isLocalMode, setLocalMode };
} 
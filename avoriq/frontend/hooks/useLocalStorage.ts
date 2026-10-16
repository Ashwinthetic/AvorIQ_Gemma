"use client";

import { useState, useEffect, useCallback } from "react";

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Initialize state lazily
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Once the component is mounted, read from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        // Use a timeout or handle it properly to avoid synchronous setState in effect warning if needed, 
        // but normally setting state in effect after mount is fine. The warning often happens when we set state directly.
        // Let's use requestAnimationFrame or just set it.
        const parsed = JSON.parse(item);
        setStoredValue(parsed);
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      setStoredValue((prev) => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
        return valueToStore;
      });
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setValue];
}

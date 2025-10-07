"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";

// Define the shape of the context
interface ThemeContextType {
  SwitchTheme: "light" | "dark";
  handleTheme: () => void;
}


export const Theme = createContext<ThemeContextType>({
  SwitchTheme: "light",
  handleTheme: () => {},
});


interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [SwitchTheme, setSwitchTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    if (savedTheme) {
      setSwitchTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  const handleTheme = () => {
    const newTheme = SwitchTheme === "light" ? "dark" : "light";
    setSwitchTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <Theme.Provider value={{ SwitchTheme, handleTheme }}>
      {children}
    </Theme.Provider>
  );
};

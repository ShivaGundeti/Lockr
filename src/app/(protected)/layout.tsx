"use client";
import React from "react";
import Navbar from "../components/Navbar";
import { ThemeProvider } from "../Context/ThemeContext/ThemeContext";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <Navbar />
      {children}
    </ThemeProvider>
  );
}

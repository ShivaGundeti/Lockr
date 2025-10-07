"use client";

import React from "react";
import { Lock, UserPlus } from "lucide-react";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex flex-col items-center justify-center px-4">
    
      <div className="text-center mb-12">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-4">
          LOCKR
        </h1>
        <p className="text-gray-300 text-lg sm:text-xl max-w-lg mx-auto">
          Securely store and manage your passwords and sensitive data. Fast, safe, and reliable.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href="/auth/login"
          className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg transition"
        >
          <Lock className="w-5 h-5" />
          Login
        </a>
        <a
          href="/auth/register"
          className="flex items-center justify-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg transition"
        >
          <UserPlus className="w-5 h-5" />
          Register
        </a>
      </div>

      <p className="text-gray-400 text-sm mt-12">
        &copy; {new Date().getFullYear()} LOCKR. All rights reserved.
      </p>
    </div>
  );
};

export default HomePage;

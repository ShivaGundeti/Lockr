"use client";

import React, { useState } from "react";
import CryptoJS from "crypto-js";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Lock, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Please fill in all fields ⚠️");
      return;
    }

    setLoading(true);
    try {
      const UserDetails = { name, email, password };
      const secretKey = process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY!;

      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(UserDetails),
        secretKey
      ).toString();

      const res = await axios.post("/api/register", { data: encryptedData });

      if (res.data.Message === "User already exists") {
        toast.error("User already exists 🚫");
      } else if (res.data.Message === "Registered successfully") {
        toast.success("Registered Successfully 🎉");
        setName("");
        setEmail("");
        setPassword("");
        router.push('/auth/login')
      } else {
        toast(res.data.Message || "Something went wrong ⚠️");
      }
    } catch (error) {
      toast.error("Server error. Please try again ❌");
    
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 px-4 sm:px-6 lg:px-8 py-8">

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#1f2937",
            color: "#fff",
            borderRadius: "10px",
            border: "1px solid #374151",
          },
        }}
      />

      <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-700 p-8 sm:p-10">
    
        <div className="flex flex-col items-center mb-6 sm:mb-8 text-center">
          <div className="flex items-center justify-center space-x-2">
            <Lock className="w-10 h-10 text-blue-500" />
            <h1 className="text-3xl font-extrabold text-white tracking-wide">
              LOCKR
            </h1>
          </div>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">
            Secure your world — Register to get started.
          </p>
        </div>

       
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-300 mb-1 text-sm font-medium">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-500/40 outline-none transition"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1 text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-500/40 outline-none transition"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="relative">
            <label className="block text-gray-300 mb-1 text-sm font-medium">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-500/40 outline-none transition pr-10"
              placeholder="••••••••"
              required
            />
            <span
              className="absolute right-3 top-[38px] cursor-pointer text-gray-400 hover:text-gray-200 transition"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center space-x-2 py-2 rounded-lg text-white font-semibold transition ${
              loading
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
            <span>{loading ? "Registering..." : "Register Securely"}</span>
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs sm:text-sm mt-6">
          Already have an account?{" "}
          <a href="/auth/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;

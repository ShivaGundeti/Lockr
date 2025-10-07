"use client";

import React, { useState, useContext, useEffect } from "react";
import { Theme } from "@/app/Context/ThemeContext/ThemeContext";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff, Copy } from "lucide-react";
import CryptoJS from "crypto-js";

interface VaultData {
  title: string;
  username: string;
  password: string;
  url: string;
  notes: string;
}

const VaultItemPage: React.FC = () => {
  const { SwitchTheme } = useContext(Theme);
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [vault, setVault] = useState<VaultData>({
    title: "",
    username: "",
    password: "",
    url: "",
    notes: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch vault details
  useEffect(() => {
    if (!id) return;
    const fetchVault = async () => {
      try {
        const res = await axios.get(`/api/vault/UserVault`, {
          params: { vaultid: id },
        });
        setVault(res.data.vault);
      } catch (err) {
        toast.error("Failed to fetch vault details");
      }
    };
    fetchVault();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setVault((prev) => ({ ...prev, [name]: value }));
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(vault.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 10000);
  };

  const handleEdit = async () => {
    setIsEditing(true);
    try {
      const secretKey = process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY!;
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(vault),
        secretKey
      ).toString();

      const res = await axios.put(
        `/api/vault/UserVault`,
        { data: encryptedData },
        {
          params: { vaultid: id },
        }
      );

      if (res.data.success) {
        toast.success("Vault updated successfully ✅");
        router.push("/Dashboard");
      } else {
        toast.error("Failed to update vault ❌");
      }
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to update vault ❌");
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`/api/vault/UserVault`, {
        params: { vaultid: id },
      });
      if (res.data.success) {
        toast.success("Vault deleted successfully ✅");
        router.push("/Dashboard");
      } else {
        toast.error("Failed to delete vault ❌");
      }
    } catch (err) {
      toast.error("Failed to delete vault ❌");
    }
  };

  return (
    <div
      className={`flex justify-center items-center min-h-screen px-3 py-6 transition-colors duration-300 ${
        SwitchTheme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <Toaster position="top-center" />
      <div
        className={`w-full max-w-lg rounded-xl shadow-lg p-6 border transition-colors duration-300 relative ${
          SwitchTheme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-300"
        }`}
      >
        {/* Vault Details: 2 columns layout */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium text-sm">Title</label>
            <input
              type="text"
              name="title"
              value={vault.title}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-md outline-none border text-sm transition-colors duration-300 ${
                SwitchTheme === "dark"
                  ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                  : "bg-gray-50 border-gray-300 focus:border-blue-500"
              }`}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">Username</label>
            <input
              type="text"
              name="username"
              value={vault.username}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-md outline-none border text-sm transition-colors duration-300 ${
                SwitchTheme === "dark"
                  ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                  : "bg-gray-50 border-gray-300 focus:border-blue-500"
              }`}
            />
          </div>

          <div className="relative">
            <label className="block mb-1 font-medium text-sm">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={vault.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-md outline-none border text-sm pr-10 transition-colors duration-300 ${
                SwitchTheme === "dark"
                  ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                  : "bg-gray-50 border-gray-300 focus:border-blue-500"
              }`}
            />
            <div className="absolute right-2 top-8 flex gap-2">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <button type="button" onClick={handleCopyPassword}>
                <Copy size={18} />
              </button>
            </div>
            {copied && (
              <p className="text-xs text-green-500 mt-1">
                Copied to clipboard!
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">URL</label>
            <input
              type="text"
              name="url"
              value={vault.url}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-md outline-none border text-sm transition-colors duration-300 ${
                SwitchTheme === "dark"
                  ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                  : "bg-gray-50 border-gray-300 focus:border-blue-500"
              }`}
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-1 font-medium text-sm">Notes</label>
            <textarea
              name="notes"
              value={vault.notes}
              onChange={handleChange}
              rows={4}
              className={`w-full px-3 py-2 rounded-md outline-none border text-sm transition-colors duration-300 ${
                SwitchTheme === "dark"
                  ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                  : "bg-gray-50 border-gray-300 focus:border-blue-500"
              }`}
            />
          </div>
        </div>

        {/* Edit/Delete buttons at bottom right */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={handleEdit}
            disabled={isEditing}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition"
          >
            {isEditing ? "Saving..." : "Edit"}
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default VaultItemPage;

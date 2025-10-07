"use client";
import React, { useState, useContext, useEffect } from "react";
import { Theme } from "../../Context/ThemeContext/ThemeContext";
import CryptoJS from "crypto-js";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff, Copy, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface VaultFormData {
  title: string;
  username: string;
  password: string;
  url: string;
  notes: string;
  ownerid: string;
}

const AddVault: React.FC = () => {
  const { SwitchTheme } = useContext(Theme);
  const { data: session } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState<VaultFormData>({
    title: "",
    username: "",
    password: "",
    url: "",
    notes: "",
    ownerid: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  // Password generator settings
  const [length, setLength] = useState(12);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      setFormData((prev) => ({ ...prev, ownerid: session?.user?.id }));
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Password generator logic
  const generatePassword = () => {
    let chars = "abcdefghijklmnopqrstuvwxyz";
    if (includeUppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) chars += "0123456789";
    if (includeSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (excludeSimilar) chars = chars.replace(/[O0Il1]/g, "");

    let password = "";
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setFormData((prev) => ({ ...prev, password }));
    toast.success("Password generated 🔐");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formData.password);
    setCopied(true);
    toast.success("Copied to clipboard 📋");
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.password) {
      toast.error("Title and password are required ⚠️");
      return;
    }

    try {
      const secretKey = process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY!;
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(formData),
        secretKey
      ).toString();

      const res = await axios.post("/api/vault", { data: encryptedData });
      if (res.data.success) {
        router.push("/Dashboard");
        setFormData({
          title: "",
          username: "",
          password: "",
          url: "",
          notes: "",
          ownerid: session?.user?.id || "",
        });
        toast.success("Vault saved successfully ✅");
      }
    } catch {
      toast.error("Something went wrong ❌");
    }
  };

  return (
    <div
      className={`flex justify-center items-center min-h-screen px-3 transition-colors duration-300 ${
        SwitchTheme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <Toaster position="top-center" />
      <div
        className={`w-full max-w-md rounded-xl shadow-lg p-6 border transition-colors duration-300 ${
          SwitchTheme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-300"
        }`}
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Input fields */}
          {[
            { label: "Title", name: "title", placeholder: "Enter title..." },
            {
              label: "Username",
              name: "username",
              placeholder: "Enter username...",
            },
            { label: "URL", name: "url", placeholder: "Enter website URL..." },
            {
              label: "Notes",
              name: "notes",
              placeholder: "Additional notes...",
            },
          ].map((field) => (
            <div key={field.name}>
              <label className="block mb-1 font-medium text-sm">
                {field.label}
              </label>
              <input
                name={field.name}
                value={formData[field.name as keyof VaultFormData]}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-md outline-none border text-sm transition-colors duration-300 ${
                  SwitchTheme === "dark"
                    ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                    : "bg-gray-50 border-gray-300 focus:border-blue-500"
                }`}
                placeholder={field.placeholder}
                required={field.name === "title"}
              />
            </div>
          ))}

          {/* Password Section */}
          <div>
            <label className="block mb-1 font-medium text-sm">Password</label>
            <div className="flex items-center gap-2">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                readOnly
                className={`w-full px-3 py-2 rounded-md outline-none border text-sm transition-colors duration-300 pr-10 ${
                  SwitchTheme === "dark"
                    ? "bg-gray-700 border-gray-600"
                    : "bg-gray-50 border-gray-300"
                }`}
                placeholder="Generate password..."
              />
              <button
                type="button"
                onClick={generatePassword}
                className={`p-2 rounded-lg ${
                  SwitchTheme === "dark"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                <RefreshCcw size={16} />
              </button>
              <button
                type="button"
                onClick={copyToClipboard}
                className={`p-2 rounded-lg ${
                  copied
                    ? "bg-green-600"
                    : SwitchTheme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                <Copy size={16} />
              </button>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-2 rounded-lg bg-transparent"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Generator Settings */}
          <div className="mt-3 border-t border-gray-500/30 pt-3 space-y-2 text-sm">
            <label className="font-medium text-sm">Password Settings</label>

            <div className="flex items-center justify-between">
              <span>Length: {length}</span>
              <input
                type="range"
                min="8"
                max="32"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={() => setIncludeNumbers(!includeNumbers)}
                />
                Include Numbers
              </label>
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={() => setIncludeSymbols(!includeSymbols)}
                />
                Include Symbols
              </label>
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={includeUppercase}
                  onChange={() => setIncludeUppercase(!includeUppercase)}
                />
                Include Uppercase
              </label>
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={excludeSimilar}
                  onChange={() => setExcludeSimilar(!excludeSimilar)}
                />
                Exclude Similar (O/0/I/l)
              </label>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`w-full mt-4 py-2.5 rounded-md font-semibold text-sm transition-colors duration-300 ${
              SwitchTheme === "dark"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            Save Vault
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddVault;

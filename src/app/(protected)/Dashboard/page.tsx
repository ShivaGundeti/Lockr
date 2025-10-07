"use client";

import { Theme } from "@/app/Context/ThemeContext/ThemeContext";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

interface VaultItem {
  _id?: string;
  title: string;
  username: string;
  password: string;
  url: string;
  notes: string;
  ownerid: string;
}

export default function Dashboard() {
  const [error, setError] = useState(true);
  const [uservaults, setUserVaults] = useState<VaultItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session } = useSession();
  const { SwitchTheme } = useContext(Theme);
  const router = useRouter();

  const VaultData = async (userid: string) => {
    try {
      const GetVaults = await axios.get("/api/vault", { params: { userid } });
      if (GetVaults?.data?.Vaults?.length === 0) {
        setUserVaults([]);
        setError(true);
      } else {
        setUserVaults(GetVaults.data.Vaults);
        setError(false);
      }
    } catch {
      setUserVaults([]);
      setError(true);
    }
  };

  const handleAddButton = () => {
    router.push("/AddVault");
  };

  useEffect(() => {
    const userid = session?.user?.id;
    if (userid) VaultData(userid);
  }, [session]);

 
  const filteredVaults = uservaults.filter((vault) => {
    const q = searchQuery.toLowerCase();
    return (
      vault.title?.toLowerCase().includes(q) ||
      vault.username?.toLowerCase().includes(q) ||
      vault.url?.toLowerCase().includes(q)
    );
  });

  return (
    <div
      className={`min-h-screen flex justify-center items-start px-4 py-6 sm:py-8 md:py-10 lg:py-12 transition-colors duration-300 ${
        SwitchTheme === "dark"
          ? "text-white bg-gray-900"
          : "text-black bg-white"
      }`}
    >
      <div className="w-full max-w-4xl">
      
        <div
          className={`flex flex-col sm:flex-row ${
            error
              ? "sm:justify-end sm:items-center"
              : "sm:justify-between sm:items-center"
          } gap-4 px-4 w-full mt-4`}
        >
          {!error && (
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${
                SwitchTheme === "dark"
                  ? "text-white bg-gray-800 border-gray-700"
                  : "text-black bg-white border-gray-300"
              } w-full sm:w-2/3 md:w-3/4 lg:w-4/5 px-4 py-2 rounded border focus:ring-2 focus:ring-blue-500 transition`}
              placeholder="Search vaults by title, username, or URL..."
            />
          )}
          <button
            className="bg-blue-800 px-4 py-2 rounded text-white hover:bg-blue-900 transition w-full sm:w-auto"
            onClick={handleAddButton}
          >
            Add Vault
          </button>
        </div>

        {error ? (
          <h1
            className={`text-center text-lg sm:text-xl md:text-2xl font-medium opacity-50 px-6 py-16 sm:px-10 rounded ${
              SwitchTheme === "dark"
                ? "text-white bg-gray-800"
                : "text-black bg-gray-100"
            } mt-10`}
          >
            No Secret Vaults are found! Create One
          </h1>
        ) : filteredVaults.length === 0 ? (
          <h1
            className={`text-center text-lg sm:text-xl md:text-2xl font-medium opacity-50 px-6 py-16 sm:px-10 rounded ${
              SwitchTheme === "dark"
                ? "text-white bg-gray-800"
                : "text-black bg-gray-100"
            } mt-10`}
          >
            No results found for “{searchQuery}”
          </h1>
        ) : (
          <div className="mt-8">
            {filteredVaults.map((item, index) => {
              let hostname = "";
              if (item?.url) {
                try {
                  hostname = new URL(item.url.trim()).hostname;
                } catch {
                  hostname = item.url;
                }
              }

              return (
                <div
                  key={index}
                  className={`${
                    SwitchTheme === "dark"
                      ? "text-white bg-gray-800 hover:bg-gray-700"
                      : "text-black bg-white hover:bg-gray-100 ring"
                  } shadow-lg h-16 sm:h-18 md:h-20 m-3 sm:m-4 rounded flex items-center px-4 sm:px-6 cursor-pointer transition`}
                  onClick={() => router.push(`/AddVault/${item._id}`)}
                >
                  <div className="flex justify-between w-full">
                    <div className="flex gap-4 sm:gap-6 text-sm sm:text-base md:text-lg items-center">
                      <span className="text-xl">🌐</span>
                      <div>
                        <h1 className="font-semibold">
                          {hostname || item.title}
                        </h1>
                        <p className="text-xs opacity-60 truncate max-w-[200px] sm:max-w-xs">
                          {item.username}
                        </p>
                      </div>
                    </div>
                    <div className="text-xl opacity-50">▸</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

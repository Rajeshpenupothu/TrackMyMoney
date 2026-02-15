import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Shield, Camera } from "lucide-react";

function Profile() {
  const { user } = useAuth();
  const [name, setName] = useState("");

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-8 text-zinc-800 dark:text-white">Account Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Summary */}
        <div className="md:col-span-1 space-y-6">
          <div className="card p-6 flex flex-col items-center border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center border-4 border-white dark:border-zinc-800 shadow-md">
                <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <button className="absolute bottom-0 right-0 p-1.5 bg-white dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={14} className="text-zinc-600 dark:text-zinc-400" />
              </button>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-zinc-800 dark:text-zinc-100">{user?.name}</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 break-all text-center">{user?.email}</p>

            <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800 w-full">
              <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                <Shield size={16} className="text-emerald-500" />
                <span>Account Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Details form */}
        <div className="md:col-span-2 space-y-6">
          <div className="card p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-6">
              Personal Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                  <input
                    type="text"
                    value={name}
                    readOnly
                    className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none opacity-80"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                  <input
                    type="email"
                    value={user?.email || ""}
                    readOnly
                    className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none opacity-80"
                  />
                </div>
                <p className="mt-1.5 text-[10px] text-zinc-400 ml-1 italic">Email cannot be changed for security reasons.</p>
              </div>
            </div>
          </div>

          <div className="card p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm opacity-60">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-6">
              Security
            </h3>
            <button className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline">
              Change Password
            </button>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Manage your access and security preferences.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

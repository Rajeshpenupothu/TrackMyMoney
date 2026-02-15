import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Shield, Camera, Edit2, Check, X, Key, Info } from "lucide-react";
import api from "../api/api";

function Profile() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" }); // {text, type: 'success' | 'error'}

  const [passData, setPassData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });

  const isDemo = user?.email === "demo@gmail.com";

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  const handleUpdateName = async () => {
    if (isDemo) return;
    setLoading(true);
    try {
      await api.put("/users/profile/name", { name });
      setMsg({ text: "Name updated successfully!", type: "success" });
      setIsEditingName(false);
      // Optional: Refresh local user context if needed, but here name is enough for UI
    } catch (err) {
      setMsg({ text: "Failed to update name.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (isDemo) return;
    if (passData.newPassword !== passData.confirmPassword) {
      setMsg({ text: "Passwords do not match!", type: "error" });
      return;
    }
    setLoading(true);
    try {
      await api.put("/users/profile/password", {
        oldPassword: passData.oldPassword,
        newPassword: passData.newPassword
      });
      setMsg({ text: "Password changed successfully!", type: "success" });
      setShowPassModal(false);
      setPassData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setMsg({ text: err.response?.data || "Failed to change password.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (msg.text) {
      const timer = setTimeout(() => setMsg({ text: "", type: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">Account Settings</h1>
        {msg.text && (
          <div className={`px-4 py-2 rounded-lg text-sm border ${msg.type === "success" ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800" : "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800"}`}>
            {msg.text}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Summary */}
        <div className="md:col-span-1 space-y-6">
          <div className="card p-6 flex flex-col items-center border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm relative overflow-hidden">
            {isDemo && (
              <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
                DEMO
              </div>
            )}
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
            <h2 className="mt-4 text-lg font-semibold text-zinc-800 dark:text-zinc-100 uppercase tracking-tight">{user?.name}</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 break-all text-center">{user?.email}</p>

            <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800 w-full">
              <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                <Shield size={16} className="text-emerald-500" />
                <span>Account Verified</span>
              </div>
            </div>
          </div>

          {isDemo && (
            <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl flex gap-3">
              <Info size={18} className="text-amber-600 flex-shrink-0" />
              <p className="text-xs text-amber-700 dark:text-amber-500 leading-relaxed">
                You are using a shared <strong>Demo Account</strong>. Sensitive profile changes are restricted.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Details form */}
        <div className="md:col-span-2 space-y-6">
          <div className="card p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-6 flex items-center justify-between">
              Personal Information
              {!isEditingName && !isDemo && (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors text-indigo-500"
                >
                  <Edit2 size={14} />
                </button>
              )}
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
                    onChange={(e) => setName(e.target.value)}
                    readOnly={!isEditingName}
                    className={`w-full pl-10 pr-12 py-2 bg-zinc-50 dark:bg-zinc-950 border rounded-lg text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none transition-all
                      ${isEditingName ? "border-indigo-500 dark:border-indigo-500/50 ring-2 ring-indigo-500/10" : "border-zinc-200 dark:border-zinc-800 opacity-80"}`}
                  />
                  {isEditingName && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <button
                        onClick={handleUpdateName}
                        disabled={loading}
                        className="p-1.5 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => { setIsEditingName(false); setName(user?.name); }}
                        className="p-1.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-md"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
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

          <div className="card p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-6">
              Security
            </h3>
            <button
              disabled={isDemo}
              onClick={() => setShowPassModal(true)}
              className={`flex items-center gap-2 text-sm font-medium transition-colors
                ${isDemo ? "text-zinc-400 cursor-not-allowed" : "text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"}`}
            >
              <Key size={16} /> Change Password
            </button>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Regularly update your password for better account safety.</p>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPassModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="card w-full max-w-sm p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">Update Password</h2>
              <button onClick={() => setShowPassModal(false)} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
                <X size={20} className="text-zinc-400" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-500">Old Password</label>
                <input
                  type="password"
                  required
                  value={passData.oldPassword}
                  onChange={(e) => setPassData({ ...passData, oldPassword: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-800 dark:text-zinc-100 focus:border-indigo-500 outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-500">New Password</label>
                <input
                  type="password"
                  required
                  value={passData.newPassword}
                  onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-800 dark:text-zinc-100 focus:border-indigo-500 outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-500">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={passData.confirmPassword}
                  onChange={(e) => setPassData({ ...passData, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-800 dark:text-zinc-100 focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPassModal(false)}
                  className="flex-1 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-lg text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;

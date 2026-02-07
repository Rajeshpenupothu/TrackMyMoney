import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user } = useAuth();

  const [name, setName] = useState("");

  // load name when user is available
  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  const handleSave = () => {
    // later: API call to update name
    alert("Profile updated (demo)");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#1f1f1f]
                    flex justify-center items-start py-10">
      <div className="bg-white dark:bg-[#2f2f2f]
                      w-full max-w-lg p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Profile
        </h1>

        {/* NAME */}
        <div className="mb-4">
          <label className="text-sm text-gray-600 dark:text-gray-300">
            Name
          </label>
          <input
  type="text"
  value={name}
  readOnly
  className="w-full mt-1 border border-gray-300 dark:border-gray-600
             rounded-md px-3 py-2 outline-none
             text-black dark:text-white
             bg-white dark:bg-[#3a3a3a]"
/>
        </div>

        {/* EMAIL (READ ONLY) */}
        <div className="mb-6">
          <label className="text-sm text-gray-600 dark:text-gray-300">
            Email
          </label>
          <input
  type="email"
  value={user?.email || ""}
  readOnly
  className="w-full mt-1 border border-gray-300 dark:border-gray-600
             rounded-md px-3 py-2 outline-none
             text-black dark:text-white
             bg-white dark:bg-[#3a3a3a]"
/>

        </div>

        {/* <button
          onClick={handleSave}
          className="bg-indigo-600 text-white px-6 py-2 rounded-full
                     font-medium hover:bg-indigo-700 transition"
        >
          Save Changes
        </button> */}
      </div>
    </div>
  );
}

export default Profile;

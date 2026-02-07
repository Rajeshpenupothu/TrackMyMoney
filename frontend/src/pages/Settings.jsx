function Settings({ dark, setDark }) {
  return (
    <div className="card max-w-xl">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>

      {/* ===== APPEARANCE ===== */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Appearance</h2>

        <div className="flex items-center justify-between">
          <span className="text-sm">Dark Mode</span>

          <button
            onClick={() => setDark(!dark)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition
              ${dark ? "bg-green-500" : "bg-zinc-300"}`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition
                ${dark ? "translate-x-6" : ""}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;

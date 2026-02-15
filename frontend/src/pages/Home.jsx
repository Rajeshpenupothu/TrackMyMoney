import { useState, useEffect } from "react";
import api from "../api/api";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function Home({
  selectedYear,
  selectedMonth,
  setSelectedYear,
  setSelectedMonth,
  incomes,
  expenses,
  borrowings,
  lendings,
}) {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    totalBorrowed: 0,
    totalLent: 0,
    overdueBorrowed: 0,
    overdueLent: 0
  });

  useEffect(() => {
    // Calculate totals locally for the selected month/year
    const mIncome = incomes
      .filter(i => i.year === selectedYear && i.month === selectedMonth)
      .reduce((s, i) => s + i.amount, 0);

    const mExpense = expenses
      .filter(e => e.year === selectedYear && e.month === selectedMonth)
      .reduce((s, e) => s + e.amount, 0);

    const mBorrowed = borrowings
      .filter(b => b.year === selectedYear && b.month === selectedMonth)
      .reduce((s, b) => s + b.amount, 0);

    const mLent = lendings
      .filter(l => l.year === selectedYear && l.month === selectedMonth)
      .reduce((s, l) => s + l.amount, 0);

    const overdueB = borrowings
      .filter(b => !b.settled && b.dueDateObj && b.dueDateObj < new Date())
      .reduce((s, b) => s + b.amount, 0);

    const overdueL = lendings
      .filter(l => !l.settled && l.dueDateObj && l.dueDateObj < new Date())
      .reduce((s, l) => s + l.amount, 0);

    setSummary({
      totalIncome: mIncome,
      totalExpense: mExpense,
      totalBorrowed: mBorrowed,
      totalLent: mLent,
      overdueBorrowed: overdueB,
      overdueLent: overdueL
    });
  }, [selectedYear, selectedMonth, incomes, expenses, borrowings, lendings]);

  const availableBalance =
    summary.totalIncome - summary.totalExpense - summary.totalBorrowed + summary.totalLent;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold mb-6 text-black dark:text-white">Overview</h1>

      {/* Filters - Keep your existing UI */}
      <div className="flex gap-4 mb-8">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="input w-32"
        >
          {[2024, 2025, 2026].map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="input w-40"
        >
          {MONTHS.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Cards using summary data */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-7 mb-6">
        <Card title="Total Income" value={summary.totalIncome} />
        <Card title="Total Expenses" value={summary.totalExpense} />
        <Card title="Total Borrowed" value={summary.totalBorrowed} />
        <Card title="Total Lent" value={summary.totalLent} />
      </div>

      {/* Overdue borrowed / lent - conditionally rendered */}
      {JSON.parse(localStorage.getItem("alertsEnabled") ?? "true") && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mb-6">
          <div className="card p-6">
            <h2 className="text-sm text-gray-600 dark:text-gray-200">Overdue Borrowed</h2>
            <p className="text-2xl font-semibold mt-3 text-black dark:text-white">₹{summary.overdueBorrowed || 0}</p>
          </div>

          <div className="card p-6">
            <h2 className="text-sm text-gray-600 dark:text-gray-200">Overdue Lent</h2>
            <p className="text-2xl font-semibold mt-3 text-black dark:text-white">₹{summary.overdueLent || 0}</p>
          </div>
        </div>
      )}

      {/* Budget Alert - Conditionally rendered */}
      {JSON.parse(localStorage.getItem("budgetAlerts") ?? "false") &&
        summary.totalIncome > 0 &&
        (summary.totalExpense / summary.totalIncome) > 0.9 && (
          <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-700 dark:text-red-400 mb-6 animate-pulse">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-bold text-sm">Budget Warning!</p>
              <p className="text-xs">Your expenses have exceeded 90% of your monthly income.</p>
            </div>
          </div>
        )}

      <div className="card p-6 mb-8">
        <h2 className="text-sm text-gray-600 dark:text-gray-200">Available Balance</h2>
        <p className="text-3xl font-semibold mt-3 text-black dark:text-white">₹{availableBalance}</p>
      </div>
    </div>
  );
}

// Keep your Card component as it is
function Card({ title, value }) {
  return (
    <div className="card p-7">
      <h2 className="text-sm text-gray-600 dark:text-gray-200">{title}</h2>
      <p className="text-2xl font-semibold mt-3 text-black dark:text-white">₹{value}</p>
    </div>
  );
}

export default Home;
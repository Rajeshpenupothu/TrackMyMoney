const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function Home({
  incomes,
  expenses,
  borrowings,
  lendings,
  selectedYear,
  selectedMonth,
  setSelectedYear,
  setSelectedMonth,
}) {
  const today = new Date();

  const filteredIncomes = incomes.filter(
    (i) => i.year === selectedYear && i.month === selectedMonth
  );

  const filteredExpenses = expenses.filter(
    (e) => e.year === selectedYear && e.month === selectedMonth
  );

  const filteredBorrowings = borrowings.filter(
    (b) => b.year === selectedYear && b.month === selectedMonth
  );

  const filteredLendings = lendings.filter(
    (l) => l.year === selectedYear && l.month === selectedMonth
  );

  const totalIncome = filteredIncomes.reduce((s, i) => s + Number(i.amount), 0);
  const totalExpenses = filteredExpenses.reduce((s, e) => s + Number(e.amount), 0);
  const totalBorrowed = filteredBorrowings.reduce((s, b) => s + Number(b.amount), 0);
  const totalLent = filteredLendings.reduce((s, l) => s + Number(l.amount), 0);

 const overdueBorrowed = borrowings.reduce((sum, b) => {
  if (b.settled) return sum;
  return b.dueDateObj < today
    ? sum + Number(b.amount)
    : sum;
}, 0);

const overdueLent = lendings.reduce((sum, l) => {
  if (l.settled) return sum;
  return l.dueDateObj < today
    ? sum + Number(l.amount)
    : sum;
}, 0);


  const availableBalance =
    totalIncome - totalExpenses - totalBorrowed + totalLent;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold mb-6 text-black dark:text-white">
Overview</h1>


      {/* Filters */}
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

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-7 mb-6">
        <Card title="Total Income" value={totalIncome} />
        <Card title="Total Expenses" value={totalExpenses} />
        <Card title="Total Borrowed" value={totalBorrowed} />
        <Card title="Total Lent" value={totalLent} />
      </div>

      {/* Overdue */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mb-6">
  <div className="card p-6">
    <h2 className="text-sm text-gray-600 dark:text-gray-200
">Overdue Borrowed</h2>
    <p className="text-2xl font-semibold mt-3 text-black dark:text-white">
₹{overdueBorrowed}</p>
  </div>

  <div className="card p-6">
    <h2 className="text-sm text-gray-600 dark:text-gray-200
">Overdue Lent</h2>
    <p className="text-2xl font-semibold mt-3 text-black dark:text-white">
₹{overdueLent}</p>
  </div>
</div>


      {/* Balance */}
      <div className="card p-6 mb-8">
  <h2 className="text-sm text-gray-600 dark:text-gray-200
">Available Balance</h2>
  <p className="text-3xl font-semibold mt-3 text-black dark:text-white">
₹{availableBalance}</p>
</div>

    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="card p-7">
      <h2 className="text-sm text-gray-600 dark:text-gray-200">{title}</h2>
      <p className="text-2xl font-semibold mt-3 text-black dark:text-white">
        ₹{value}
      </p>
    </div>
  );
}



export default Home;

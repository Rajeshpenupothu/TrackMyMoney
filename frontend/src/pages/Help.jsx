function Help() {
  return (
    <div className="max-w-xl text-zinc-800 dark:text-zinc-100">
      <h1 className="text-2xl font-semibold mb-6">Help & Feedback</h1>

      <div className="card p-6">
        <p className="text-gray-600 dark:text-zinc-400 mb-3">
          For any issues, suggestions or support, contact us:
        </p>

        <a
          href="mailto:norply.trackmymoney@gmail.com"
          className="text-blue-600 dark:text-blue-400 font-medium"
        >
          norply.trackmymoney@gmail.com
        </a>
      </div>
    </div>
  );
}

export default Help;

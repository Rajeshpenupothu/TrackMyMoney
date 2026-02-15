import { Mail, MessageSquare, Shield, HelpCircle, Star, Zap } from "lucide-react";

function Help() {
  const categories = [
    {
      icon: Mail,
      title: "Direct Support",
      description: "Get in touch with our team for any technical issues.",
      action: "norply.trackmymoney@gmail.com",
      link: "mailto:norply.trackmymoney@gmail.com",
      color: "text-blue-500"
    },
    {
      icon: MessageSquare,
      title: "Feedback",
      description: "Have ideas to improve TrackMyMoney? We'd love to hear them.",
      action: "Share Feedback",
      color: "text-indigo-500"
    },
    {
      icon: Shield,
      title: "Privacy & Safety",
      description: "Learn how we protect your financial data and privacy.",
      action: "Read Policy",
      color: "text-emerald-500"
    }
  ];

  const tips = [
    "Use the Reports page to download professional PDFs of your data.",
    "Categorize your expenses to see exactly where your money goes.",
    "Toggle Dark Mode in the sidebar for a more comfortable night view.",
    "Set due dates for Borrowings to get a clear picture of your timeline."
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
          <HelpCircle className="text-indigo-600 dark:text-indigo-400" size={24} />
        </div>
        <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">Help & Feedback</h1>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {categories.map((cat, idx) => (
          <div key={idx} className="card p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex flex-col h-full hover:border-indigo-500/50 transition-colors group">
            <cat.icon className={`${cat.color} mb-4 group-hover:scale-110 transition-transform`} size={24} />
            <h3 className="font-semibold text-zinc-800 dark:text-zinc-100 mb-2">{cat.title}</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 flex-grow">{cat.description}</p>
            {cat.link ? (
              <a href={cat.link} className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                {cat.action}
              </a>
            ) : (
              <button className="text-left text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                {cat.action}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Quick Tips Section */}
      <div className="card p-8 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Zap className="text-yellow-500" size={20} />
          <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">Quick Tips</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tips.map((tip, idx) => (
            <div key={idx} className="flex gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800/50">
              <div className="mt-1">
                <div className="w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                  <Star className="text-indigo-500 dark:text-indigo-400" size={12} />
                </div>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-12 text-center">
        <p className="text-xs text-zinc-400 dark:text-zinc-500">TrackMyMoney v1.2.0 • Made for financial clarity</p>
      </div>
    </div>
  );
}

export default Help;

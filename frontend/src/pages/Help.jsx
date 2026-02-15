import { useState } from "react";
import { Mail, MessageSquare, Shield, HelpCircle, Star, Zap, CheckCircle2, X } from "lucide-react";

function Help() {
  const [activeModal, setActiveModal] = useState(null); // 'privacy' | 'feedback'
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedback, setFeedback] = useState({ category: "Feature Request", message: "" });
  const [loading, setLoading] = useState(false);

  const categories = [
    {
      id: "support",
      icon: Mail,
      title: "Direct Support",
      description: "Get in touch with our team for any technical issues.",
      action: "norply.trackmymoney@gmail.com",
      link: "mailto:norply.trackmymoney@gmail.com",
      color: "text-blue-500"
    },
    {
      id: "feedback",
      icon: MessageSquare,
      title: "Feedback",
      description: "Have ideas to improve TrackMyMoney? We'd love to hear them.",
      action: "Share Feedback",
      color: "text-indigo-500"
    },
    {
      id: "privacy",
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

  const handleCategoryClick = (id) => {
    if (id === "privacy") setActiveModal("privacy");
    if (id === "feedback") setActiveModal("feedback");
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000));
    setFeedbackSent(true);
    setActiveModal(null);
    setFeedback({ category: "Feature Request", message: "" });
    setLoading(false);
    setTimeout(() => setFeedbackSent(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
            <HelpCircle className="text-indigo-600 dark:text-indigo-400" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">Help & Feedback</h1>
        </div>

        {feedbackSent && (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 rounded-lg text-sm animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 size={16} />
            Feedback recorded! Thank you.
          </div>
        )}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            onClick={() => handleCategoryClick(cat.id)}
            className="card p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex flex-col h-full hover:border-indigo-500/50 transition-all hover:shadow-md cursor-pointer group"
          >
            <cat.icon className={`${cat.color} mb-4 group-hover:scale-110 transition-transform`} size={24} />
            <h3 className="font-semibold text-zinc-800 dark:text-zinc-100 mb-2">{cat.title}</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 flex-grow">{cat.description}</p>
            {cat.link ? (
              <a href={cat.link} onClick={e => e.stopPropagation()} className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                {cat.action}
              </a>
            ) : (
              <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                {cat.action}
              </span>
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

      {/* Feedback Modal */}
      {activeModal === "feedback" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="card w-full max-w-md p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">Share Your Feedback</h2>
              <button onClick={() => setActiveModal(null)} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
                <X size={20} className="text-zinc-400" />
              </button>
            </div>

            <form onSubmit={submitFeedback} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-500">How can we help?</label>
                <select
                  value={feedback.category}
                  onChange={e => setFeedback({ ...feedback, category: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-800 dark:text-zinc-100 focus:border-indigo-500 outline-none"
                >
                  <option>Feature Request</option>
                  <option>Bug Report</option>
                  <option>General Support</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-500">Message</label>
                <textarea
                  required
                  rows={4}
                  value={feedback.message}
                  onChange={e => setFeedback({ ...feedback, message: e.target.value })}
                  placeholder="Describe your suggestion or issue..."
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-800 dark:text-zinc-100 focus:border-indigo-500 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !feedback.message.trim()}
                className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : <MessageSquare size={16} />}
                {loading ? "Sending..." : "Submit Feedback"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {activeModal === "privacy" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="card w-full max-w-lg p-8 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Privacy & Data Policy</h2>
                <p className="text-xs text-zinc-500 mt-1">Last updated: Feb 2024</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
                <X size={20} className="text-zinc-400" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400 overflow-y-auto max-h-[60vh] pr-2">
              <section>
                <h3 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2">1. Data Ownership</h3>
                <p>Your financial data belongs entirely to you. TrackMyMoney acts only as a secure storage and visualization layer for your personal records.</p>
              </section>
              <section>
                <h3 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2">2. Encryption</h3>
                <p>All sensitive information, including passwords, is hashed using industry-standard BCrypt. We never store plain-text passwords.</p>
              </section>
              <section>
                <h3 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2">3. No Third-Party Selling</h3>
                <p>We do not sell, rent, or trade your financial or personal data with any third parties. Your privacy is our highest priority.</p>
              </section>
              <section>
                <h3 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2">4. Secure Access</h3>
                <p>Access to your account is protected by JWT (JSON Web Tokens). Ensure you use a strong, unique password for your account security.</p>
              </section>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-12 text-center">
        <p className="text-xs text-zinc-400 dark:text-zinc-500">TrackMyMoney v1.2.0 • Made for financial clarity</p>
      </div>
    </div>
  );
}

export default Help;

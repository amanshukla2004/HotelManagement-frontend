import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Mail,
  Phone,
  ChevronRight,
  BookOpen,
  ShieldCheck,
  LifeBuoy,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import emailjs from "@emailjs/browser";
import axios from "axios";

const SupportPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: "Suggestion",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: '' }
  const [supportEmail, setSupportEmail] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Fetch support email from backend config
    const fetchConfig = async () => {
      try {
        const response = await axios.get("http://localhost:9091/public/config");
        if (response.data && response.data.supportEmail) {
          setSupportEmail(response.data.supportEmail);
        }
      } catch (err) {
        console.error("Failed to fetch support email config:", err);
        setSupportEmail("work.amanshukla2004@gmail.com"); // Fallback
      }
    };
    fetchConfig();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    // emailjs.send parameters
    const templateParams = {
      from_email: formData.email,
      to_email: supportEmail,
      message_type: formData.type,
      message:
        "EMAIL FOR ROOMLY ADMINS " +
        "EMAIL: " +
        formData.email +
        " | TYPE: " +
        formData.type +
        " | MESSAGE: " +
        formData.message,
    };

    try {
      // NOTE: User should replace these with their own EmailJS IDs
      // serviceID, templateID, publicKey
      await emailjs.send(
        "service_5d2tudo",
        "template_o2pnkth",
        templateParams,
        "iEsSoiO6qEqTwbzyx",
      );

      setStatus({
        type: "success",
        message: "Message sent successfully! We will get back to you soon.",
      });
      setFormData({ type: "Suggestion", email: "", message: "" });
    } catch (err) {
      console.error("EmailJS Error:", err);
      setStatus({
        type: "error",
        message:
          err.text ||
          "Failed to send message. Please check your credentials or try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      q: "How do I manage my booking?",
      a: "Navigate to 'Your Stays' in the dashboard to view, modify, or cancel your active reservations.",
    },
    {
      q: "When is my booking confirmed?",
      a: "Bookings are confirmed immediately after a successful payment session. You will see a 'Confirmed' status in your stay history.",
    },
    {
      q: "What is the policy for dynamic pricing?",
      a: "Prices may vary based on demand, seasonal trends, and bulk strategies applied by hotel managers.",
    },
    {
      q: "Is my payment data secure?",
      a: "Yes, all payments are handled via Stripe's encrypted secure intent system. Roomly does not store your card details.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 space-y-12">
        {/* Back Button */}
        <div className="flex justify-start">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-[#0284C7] uppercase tracking-[0.2em] transition-all group"
          >
            <ChevronRight
              size={16}
              className="rotate-180 group-hover:-translate-x-1 transition-transform"
            />
            Back to Home
          </button>
        </div>

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0284C7]/10 rounded-full text-[#0284C7] text-xs font-black uppercase tracking-[0.2em]">
            <LifeBuoy size={14} /> Help Center
          </div>
          <h1 className="text-5xl font-black text-[#0F172A] tracking-tighter uppercase leading-none">
            How can we help?
          </h1>
          <p className="text-sm font-medium text-gray-400 max-w-lg mx-auto leading-relaxed">
            Submit a suggestion, feedback, or report a problem. Our team is here
            to ensure your Roomly experience is flawless.
          </p>
        </div>

        {/* Contact Form & Support Recipient */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-[0_32px_80px_rgba(0,0,0,0.06)] border border-gray-50 overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#0284C7]/5 blur-3xl -mr-16 -mt-16" />

              <h2 className="text-2xl font-black text-[#0F172A] tracking-tighter uppercase mb-8 flex items-center gap-3">
                <MessageCircle className="text-[#0284C7]" size={24} />
                Submit a Request
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
                      Type of Request
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-[#0F172A] outline-none focus:border-[#0284C7] focus:ring-4 focus:ring-[#0284C7]/10 transition-all appearance-none"
                    >
                      <option value="Suggestion">Suggestion</option>
                      <option value="Feedback">Feedback</option>
                      <option value="Problem">Report a Problem</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
                      Your Email
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300"
                        size={18}
                      />
                      <input
                        type="email"
                        required
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-[#0F172A] outline-none focus:border-[#0284C7] focus:ring-4 focus:ring-[#0284C7]/10 transition-all placeholder:text-gray-300"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2 px-1">
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">
                        Message
                      </label>
                      <span
                        className={`text-[10px] font-black ${formData.message.length >= 500 ? "text-red-500" : "text-gray-300"}`}
                      >
                        {formData.message.length}/500
                      </span>
                    </div>
                    <textarea
                      required
                      maxLength={500}
                      rows={5}
                      placeholder="Tell us what's on your mind..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-[#0F172A] outline-none focus:border-[#0284C7] focus:ring-4 focus:ring-[#0284C7]/10 transition-all placeholder:text-gray-300 resize-none"
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {status && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`flex items-center gap-3 p-4 rounded-2xl text-xs font-bold ${
                        status.type === "success"
                          ? "bg-green-50 text-green-700 border border-green-100"
                          : "bg-red-50 text-red-700 border border-red-100"
                      }`}
                    >
                      {status.type === "success" ? (
                        <CheckCircle2 size={16} />
                      ) : (
                        <AlertCircle size={16} />
                      )}
                      {status.message}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={loading || !formData.email || !formData.message}
                  className="w-full flex items-center justify-center gap-3 bg-[#0F172A] hover:bg-[#0284C7] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2rem] transition-all shadow-xl shadow-[#0F172A]/20 disabled:opacity-30 disabled:shadow-none active:scale-[0.98]"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Send size={18} />
                  )}
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </motion.div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#0F172A] p-6 rounded-[4rem] text-white overflow-hidden relative shadow-xl">
              <div className="absolute top-0 right-0 w-100 h-44 bg-[#0284C7]/20 blur-2xl -mr-16 -mt-16" />
              <p className="text-[20px] font-black text-[#0284C7] uppercase tracking-[0.3em] mb-4">
                Direct Contact
              </p>
              <h3 className="text-xl font-black tracking-tight uppercase mb-6">
                Support Recipient
              </h3>
              <div
                onClick={() => {
                  navigator.clipboard.writeText(
                    supportEmail || "work.amanshukla2004@gmail.com",
                  );
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="flex items-center gap-4 bg-white/5 p-4 rounded-[1.5rem] border border-white/10 hover:bg-white/10 transition-all cursor-pointer group"
                title="Click to copy"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0284C7]/20 flex items-center justify-center text-[#0284C7] group-hover:scale-110 transition-transform">
                  <Mail size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                    {copied ? (
                      <span className="text-green-400">
                        Copied to clipboard!
                      </span>
                    ) : (
                      "Email Address"
                    )}
                  </p>
                  <p className="text-sm font-black text-white break-all">
                    {supportEmail || "Loading..."}
                  </p>
                </div>
              </div>
              <p className="text-[10px] font-medium text-white/30 mt-6 leading-relaxed">
                Your requests are sent directly to our support inbox. We
                typically respond within 24 business hours.
              </p>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-widest mb-6">
                Developer Status
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400">
                    Response Speed
                  </span>
                  <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-lg">
                    FAST
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400">
                    Available Mode
                  </span>
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg">
                    ACTIVE
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-8">
          <div className="flex items-center gap-3 px-1">
            <BookOpen size={20} className="text-[#0284C7]" />
            <h2 className="text-xl font-black text-[#0F172A] uppercase tracking-tighter">
              Frequent Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-[2rem] border border-gray-100 group hover:border-[#0284C7] transition-all"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-black text-[#0F172A] uppercase tracking-tight group-hover:text-[#0284C7] transition-colors">
                      {faq.q}
                    </h4>
                    <p className="text-sm font-medium text-gray-400 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-gray-200 group-hover:text-[#0284C7] group-hover:translate-x-1 transition-all"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Official Note removed */}
      </div>
    </div>
  );
};

export default SupportPage;

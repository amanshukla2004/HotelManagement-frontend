import { NavLink } from "react-router-dom";
import { Mail, MapPin, ArrowRight, Code, User, Terminal } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#0F172A] text-gray-400 py-20 border-t border-white/5 font-sans">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="space-y-6">
          <NavLink to="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white font-black text-sm">
              R
            </div>
            <span className="text-2xl font-display font-black tracking-tighter text-white">
              Roomly
            </span>
          </NavLink>
          <p className="text-sm leading-relaxed max-w-xs text-gray-500">
            Reimagining the hotel booking experience with premium aesthetics and
            lightning-fast technology. Your perfect stay is just a click away.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">
            Navigation
          </h4>
          <ul className="space-y-4">
            {[
              { name: "My Bookings", path: "/bookings" },
              { name: "Privacy", path: "/privacy" },
              { name: "Terms", path: "/terms" },
              { name: "Cookie Policy", path: "/cookie-policy" },
              { name: "Refund Policy", path: "/refund-policy" },
              { name: "Support", path: "/support" },
            ].map((link) => (
              <li key={link.name}>
                <NavLink
                  to={link.path}
                  className="text-sm font-semibold hover:text-white transition-colors flex items-center group"
                >
                  <div className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300 flex items-center">
                    <ArrowRight size={12} className="text-white" />
                  </div>
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">
            Contact
          </h4>
          <ul className="space-y-5">
            <li className="flex items-center space-x-3 group">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-white transition-colors">
                <Mail size={14} />
              </div>
              <span className="text-sm font-medium">
                work.amanshukla2004@gmail.com
              </span>
            </li>
            <li className="flex items-center space-x-3 group">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-white transition-colors">
                <MapPin size={14} />
              </div>
              <span className="text-sm font-medium">Noida Uttarpradesh</span>
            </li>
          </ul>
        </div>

        {/* Developer Section */}
        <div className="bg-white/5 rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#0284C7]/10 blur-2xl group-hover:bg-[#0284C7]/20 transition-all" />
          <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-6">
            The Developer
          </h4>

          <div className="flex flex-col gap-3">
            <a
              href="https://github.com/amanshukla2004"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-gray-400 hover:text-white"
            >
              <Code size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                GitHub
              </span>
            </a>
            <a
              href="https://www.linkedin.com/in/amanshukla-dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-gray-400 hover:text-white"
            >
              <User size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                LinkedIn
              </span>
            </a>
            <a
              href="https://leetcode.com/u/AmanShukla1408/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-gray-400 hover:text-white"
            >
              <Terminal size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                LeetCode
              </span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
        <p className="text-xs uppercase tracking-[0.3em] font-black opacity-30 text-white">
          © 2026 ROOMLY PLATFORM. ALL RIGHTS RESERVED.
        </p>
        <div className="flex flex-wrap items-center justify-end gap-x-8 gap-y-4 text-xs font-black uppercase tracking-widest text-gray-500">
          Made with Roomly Platform.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

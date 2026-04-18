import { NavLink } from 'react-router-dom';
import { Hotel, Mail, Phone, MapPin, ArrowRight, Code, User, Terminal, Cpu, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0A2540] text-gray-400 py-20 border-t border-white/5 font-sans">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* Brand Section */}
        <div className="space-y-6">
          <NavLink to="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 group-hover:bg-white/20 transition-all">
              <Hotel className="text-white" size={20} />
            </div>
            <span className="text-2xl font-display font-black tracking-tighter text-white">
              NOX
            </span>
          </NavLink>
          <p className="text-sm leading-relaxed max-w-xs text-gray-500">
            Reimagining the hotel booking experience with premium aesthetics and lightning-fast technology. Your perfect stay is just a click away.
          </p>
          <div className="flex items-center space-x-4">
            {/* Social icons removed temporarily due to library mismatch */}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">Navigation</h4>
          <ul className="space-y-4">
            {[
              { name: 'Find a Hotel', path: '/search' },
              { name: 'My Bookings', path: '/bookings' },
              { name: 'Support', path: '/support' },
              { name: 'Refund Policy', path: '/refund-policy' }
            ].map(link => (
              <li key={link.name}>
                <NavLink to={link.path} className="text-sm font-semibold hover:text-white transition-colors flex items-center group">
                  <ArrowRight size={12} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">Contact</h4>
          <ul className="space-y-5">
            <li className="flex items-center space-x-3 group">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-white transition-colors">
                <Mail size={14} />
              </div>
              <span className="text-sm font-medium">hello@noxstays.com</span>
            </li>
            <li className="flex items-center space-x-3 group">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-white transition-colors">
                <Phone size={14} />
              </div>
              <span className="text-sm font-medium">+91 98765 43210</span>
            </li>
            <li className="flex items-center space-x-3 group">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-white transition-colors">
                <MapPin size={14} />
              </div>
              <span className="text-sm font-medium">Bandra West, Mumbai</span>
            </li>
          </ul>
        </div>

        {/* Developer / Final Year ProjectSection */}
        <div className="bg-white/5 rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#635BFF]/10 blur-2xl group-hover:bg-[#635BFF]/20 transition-all" />
          <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-4">The Developer</h4>
          <p className="text-[10px] font-black text-[#635BFF] uppercase tracking-[0.3em] mb-4">Final Year Major Project</p>

          <div className="grid grid-cols-2 gap-3">
            <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-gray-400 hover:text-white">
              <Code size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">GitHub</span>
            </a>
            <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-gray-400 hover:text-white">
              <User size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">LinkedIn</span>
            </a>
            <a href="https://leetcode.com/yourusername" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-gray-400 hover:text-white">
              <Terminal size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">LeetCode</span>
            </a>
            <a href="#" className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-gray-400 hover:text-white">
              <Globe size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Portfolio</span>
            </a>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
        <p className="text-xs uppercase tracking-[0.3em] font-black opacity-30 text-white">
          © 2026 NOX PLATFORM. ALL RIGHTS RESERVED.
        </p>
        <div className="flex items-center space-x-8 text-xs font-black uppercase tracking-widest">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

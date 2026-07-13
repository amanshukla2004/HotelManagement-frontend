import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  ArrowRight,
  Star,
  Shield,
  ShieldCheck,
  Headphones,
  Zap,
  ChevronRight,
  Building2,
  Wifi,
  Utensils,
  Car,
  Waves,
  Dumbbell,
  TrendingUp,
  Trophy,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { normalizeCityName } from "../../utils/stringUtils";

const InputLabel = ({ title }) => (
  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
    {title}
  </p>
);

// ── Static Data ────────────────────────────────────────────────────────────────

const DESTINATIONS = [
  {
    city: "Mumbai",
    tagline: "City of Dreams",
    count: "1,200+ hotels",
    gradient: "from-[#0F172A] to-[#1a4270]",
    accent: "#F97316",
    image:
      "https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=600&q=80",
  },
  {
    city: "Goa",
    tagline: "Sun, Sea & Serenity",
    count: "640+ hotels",
    gradient: "from-[#0d7a5a] to-[#0F172A]",
    accent: "#F97316",
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80",
  },
  {
    city: "Delhi",
    tagline: "Where History Lives",
    count: "980+ hotels",
    gradient: "from-[#4a1259] to-[#0F172A]",
    accent: "#0284C7",
    image:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80",
  },
  {
    city: "Bangalore",
    tagline: "Silicon Valley of India",
    count: "820+ hotels",
    gradient: "from-[#1a3a1a] to-[#0F172A]",
    accent: "#22c55e",
    image:
      "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&q=80",
  },
  {
    city: "Jaipur",
    tagline: "The Pink City",
    count: "450+ hotels",
    gradient: "from-[#7c1d2a] to-[#0F172A]",
    accent: "#f87171",
    image:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80",
  },
  {
    city: "Udaipur",
    tagline: "City of Lakes",
    count: "320+ hotels",
    gradient: "from-[#4a3f35] to-[#0F172A]",
    accent: "#d97706",
    image:
      "https://images.unsplash.com/photo-1615836245337-f839dffdbac3?w=600&q=80",
  },
  {
    city: "Munnar",
    tagline: "God's Own Country",
    count: "210+ hotels",
    gradient: "from-[#1b4332] to-[#0F172A]",
    accent: "#10b981",
    image:
      "https://images.unsplash.com/photo-1593693397690-362bb9a11566?w=600&q=80",
  },
  {
    city: "Shimla",
    tagline: "Queen of Hills",
    count: "290+ hotels",
    gradient: "from-[#1f2937] to-[#0F172A]",
    accent: "#3b82f6",
    image:
      "https://images.unsplash.com/photo-1525598912003-663126343e1f?w=600&q=80",
  },
];

const WHY_US = [
  {
    icon: <Shield size={24} />,
    title: "Verified Properties",
    desc: "Every listing is manually reviewed by our team before going live.",
    color: "bg-[#0284C7]/10 text-[#0284C7]",
  },
  {
    icon: <Zap size={24} />,
    title: "Instant Confirmation",
    desc: "Get booking confirmation in seconds with real-time availability.",
    color: "bg-[#F97316]/10 text-[#F97316]",
  },
  {
    icon: <Headphones size={24} />,
    title: "24/7 Support",
    desc: "Our concierge team is available around the clock for any help.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: <Trophy size={24} />,
    title: "Best Price Guarantee",
    desc: "Found it cheaper elsewhere? We'll match it, no questions asked.",
    color: "bg-rose-50 text-rose-600",
  },
];

const STATS = [
  { value: "12K+", label: "Hotels Listed", icon: <Building2 size={18} /> },
  { value: "4.8★", label: "Average Rating", icon: <Star size={18} /> },
  { value: "850K+", label: "Happy Guests", icon: <Users size={18} /> },
  { value: "24/7", label: "Support Hours", icon: <Clock size={18} /> },
];

const AMENITY_ICONS = {
  WIFI: <Wifi size={14} />,
  POOL: <Waves size={14} />,
  GYM: <Dumbbell size={14} />,
  PARKING: <Car size={14} />,
  RESTAURANT: <Utensils size={14} />,
};

const BUILDING_TYPES = [
  { width: 55, height: 170, bg: "#0284C7" },
  { width: 75, height: 130, bg: "#F97316" },
  { width: 45, height: 210, bg: "#0F172A" },
  { width: 90, height: 110, bg: "#ffffff" },
  { width: 60, height: 190, bg: "#22c55e" },
];

// ── Hero floating orb ──────────────────────────────────────────────────────────
const FloatingOrb = ({ delay, size, x, y, color }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: size,
      height: size,
      left: x,
      top: y,
      background: color,
      filter: "blur(50px)",
      opacity: 0.35,
    }}
    animate={{ y: [0, -20, 0], scale: [1, 1.3, 1] }}
    transition={{
      duration: 3 + delay,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
  />
);

// ── Destination Card (Redesigned) ───────────────────────────────────────────
const DestCard = ({ dest, onClick, index }) => (
  <motion.button
    onClick={onClick}
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.05, duration: 0.5 }}
    whileHover={{ y: -10 }}
    className={`group relative rounded-[2.5rem] overflow-hidden text-left shadow-xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-500 bg-gray-200 ${
      index === 0 ? "md:col-span-2 md:row-span-2" : ""
    }`}
    style={{ minHeight: index === 0 ? "500px" : "240px" }}
  >
    {/* Background Image */}
    <img
      src={dest.image}
      alt={dest.city}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
      onError={(e) => {
        e.target.style.display = "none";
      }}
    />
    {/* Glass Gradient overlay */}
    <div
      className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500`}
    />

    <div className="absolute inset-x-0 bottom-0 p-8 sm:p-10 flex flex-col items-start gap-4">
      <div className="flex items-center gap-2">
        <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-black tracking-widest text-[#F97316] uppercase border border-white/20">
          {dest.count}
        </span>
        <div className="flex items-center text-amber-400">
          <Star size={10} fill="currentColor" />
          <span className="text-xs font-black ml-1">4.9</span>
        </div>
      </div>
      <h3 className="text-2xl font-bold text-white tracking-tight">
        {dest.city}
      </h3>
    </div>
  </motion.button>
);

// ── Main Component ─────────────────────────────────────────────────────────────
const HomePage = () => {
  const { role } = useAuth();
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [rooms, setRooms] = useState(1);
  const [skyline, setSkyline] = useState([]);
  const [floorY, setFloorY] = useState(0);
  const [activeTab, setActiveTab] = useState("hotels");

  useEffect(() => {
    const tabs = ["hotels", "resorts", "villas"];
    const interval = setInterval(() => {
      setActiveTab(
        (current) => tabs[(tabs.indexOf(current) + 1) % tabs.length],
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  useEffect(() => {
    const calc = () => setFloorY(window.innerHeight * 0.84);
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  const handleHeroClick = (e) => {
    if (e.target.closest("#search-box")) return;
    const type =
      BUILDING_TYPES[Math.floor(Math.random() * BUILDING_TYPES.length)];
    setSkyline((prev) => [
      ...prev.slice(-30),
      {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        type,
        targetY: floorY - type.height,
      },
    ]);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Logic updated: even if no city is provided, we navigate to discover all hotels.

    // Smart Defaults Logic
    const todayObj = new Date();
    const nextMonthObj = new Date();
    nextMonthObj.setMonth(todayObj.getMonth() + 1);

    const finalCheckIn = checkIn || todayObj.toISOString().split("T")[0];
    const finalCheckOut = checkOut || nextMonthObj.toISOString().split("T")[0];

    const normalizedCity = normalizeCityName(city);

    const paramsObj = {
      city: normalizedCity,
      roomsCount: rooms || 1,
      startDate: finalCheckIn,
      endDate: finalCheckOut,
    };

    // Persist search params for booking flow
    localStorage.setItem("lastSearch", JSON.stringify(paramsObj));

    const params = new URLSearchParams(paramsObj);
    navigate(`/search?${params.toString()}`);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="w-full bg-[#F6F9FC]">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative w-full min-h-[900px] py-32 flex flex-col items-center justify-center overflow-hidden bg-[#0F172A]"
        onClick={handleHeroClick}
      >
        {/* Parallax bg */}
        <motion.div
          style={{ y: heroY }}
          className="absolute inset-0 -top-20 h-[110%]"
        >
          {/* Radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(249,115,22,0.15),rgba(2,132,199,0.3),transparent)]" />
          {/* Grid lines */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        </motion.div>

        {/* Floating orbs */}
        <FloatingOrb
          delay={0}
          size={400}
          x="60%"
          y="10%"
          color="radial-gradient(circle,#0284C7,transparent)"
        />
        <FloatingOrb
          delay={2}
          size={300}
          x="10%"
          y="40%"
          color="radial-gradient(circle,#F97316,transparent)"
        />
        <FloatingOrb
          delay={4}
          size={250}
          x="75%"
          y="60%"
          color="radial-gradient(circle,#22c55e,transparent)"
        />
        <FloatingOrb
          delay={1.5}
          size={900}
          x="10%"
          y="0%"
          color="radial-gradient(circle,rgba(236,72,153,0.8),transparent)"
        />
        <FloatingOrb
          delay={3}
          size={700}
          x="40%"
          y="30%"
          color="radial-gradient(circle,rgba(168,85,247,0.6),transparent)"
        />

        {/* Horizon line */}
        <div
          className="absolute left-0 right-0 h-px bg-white/10 pointer-events-none"
          style={{ top: floorY }}
        />

        {/* Interactive buildings */}
        <AnimatePresence>
          {skyline.map((b) => (
            <motion.div
              key={b.id}
              initial={{
                x: b.x - b.type.width / 2,
                y: b.y,
                opacity: 0,
                scaleY: 0,
              }}
              animate={{
                x: b.x - b.type.width / 2,
                y: b.targetY,
                opacity: 0.85,
                scaleY: 1,
              }}
              exit={{ opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 90,
                damping: 14,
                mass: 1.2,
              }}
              style={{
                originY: 1,
                position: "absolute",
                width: b.type.width,
                height: b.type.height,
                backgroundColor: b.type.bg,
                boxShadow: "0 -4px 40px rgba(0,0,0,0.4)",
                borderRadius: "4px 4px 0 0",
              }}
              className="pointer-events-none overflow-hidden border-t border-l border-white/10"
            >
              <div className="w-full h-full p-1.5 grid grid-cols-2 gap-1 content-start opacity-20">
                {[...Array(30)].map((_, i) => (
                  <div key={i} className="bg-white h-2.5 rounded-sm" />
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Hero Content */}
        <motion.div
          className="relative z-30 w-full px-4 flex flex-col items-center"
          id="search-box"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-white/80 text-xs font-semibold mb-8"
          >
            <TrendingUp size={12} className="text-[#F97316]" />
            <span>Over 12,000 verified hotels across India</span>
          </motion.div>

          {/* Headline */}
          <motion.div
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              backgroundPosition: {
                duration: 8,
                ease: "linear",
                repeat: Infinity,
              },
            }}
            className="text-center mb-4 flex flex-wrap justify-center font-display font-extrabold tracking-tight leading-[1.05] text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white"
            style={{
              backgroundSize: "200% auto",
              backgroundImage:
                role === "HOTEL_MANAGER"
                  ? "linear-gradient(to right, #ffffff, #e2e8f0, #ffffff)"
                  : "linear-gradient(to right, #ffffff, #0284C7, #F97316, #ffffff)",
            }}
          >
            {role === "HOTEL_MANAGER"
              ? ["Admin", "Hub.", "Simplified."].map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.3 + i * 0.15,
                      duration: 0.6,
                      type: "spring",
                      stiffness: 120,
                    }}
                    className={`inline-block mr-3 md:mr-5 text-5xl md:text-7xl lg:text-8xl`}
                  >
                    {word}
                  </motion.span>
                ))
              : ["Find", "your", "perfect", "stay."].map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.2 + i * 0.1,
                      duration: 0.6,
                      type: "spring",
                      stiffness: 120,
                    }}
                    className={`inline-block mr-3 md:mr-5 text-5xl md:text-7xl lg:text-8xl ${word === "perfect" ? "font-black" : ""}`}
                  >
                    {word}
                  </motion.span>
                ))}
          </motion.div>

          {role !== "HOTEL_MANAGER" && (
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white/80 text-base md:text-lg font-medium mb-10 text-center"
            >
              Discover verified hotels, exclusive resorts, and luxury villas for
              your next getaway.
            </motion.p>
          )}

          {role !== "HOTEL_MANAGER" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-1 mb-8 gap-1 relative"
            >
              {["hotels", "resorts", "villas"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-colors z-10 ${
                    activeTab === tab
                      ? "text-[#0F172A]"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTabBackground"
                      className="absolute inset-0 bg-white rounded-lg shadow-md -z-10"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 25,
                      }}
                    />
                  )}
                  {tab}
                </button>
              ))}
            </motion.div>
          )}

          {/* Search Form / Manager CTA */}
          {role === "HOTEL_MANAGER" ? (
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.35 }}
              className="w-full max-w-2xl px-4"
            >
              <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[3rem] p-8 md:p-12 shadow-[0_48px_100px_rgba(0,0,0,0.5)] text-center space-y-8">
                <div className="w-20 h-20 bg-[#0284C7] rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-[#0284C7]/40">
                  <ShieldCheck size={40} className="text-white" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-white tracking-tighter uppercase">
                    Administrative Hub
                  </h2>
                  <p className="text-white/50 text-sm font-medium">
                    Welcome back. Manage your properties, monitor inventory, and
                    track performance from your dashboard.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/admin/hotels")}
                  className="w-full py-5 bg-[#0284C7] hover:bg-[#7c75ff] text-white rounded-[1.5rem] font-black text-sm uppercase tracking-[0.3em] transition-all shadow-xl shadow-[#0284C7]/20 active:scale-95 group flex items-center justify-center gap-4"
                >
                  Enter Manager Portal{" "}
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleSearch}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.35 }}
              className="w-full max-w-5xl"
            >
              <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[3rem] p-4 shadow-[0_48px_100px_rgba(0,0,0,0.5)]">
                <div className="bg-white rounded-3xl overflow-hidden flex flex-col lg:flex-row items-stretch divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
                  {/* Destination */}
                  <div
                    className="flex-[2] relative group flex flex-col justify-center px-6 py-4 hover:bg-gray-50 transition-colors cursor-text"
                    onClick={() =>
                      document.getElementById("city-input").focus()
                    }
                  >
                    <InputLabel title="Where are you going?" />
                    <div className="flex items-center gap-3">
                      <MapPin className="text-[#0284C7]" size={20} />
                      <input
                        id="city-input"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        type="text"
                        required
                        placeholder="Search destinations"
                        className="w-full text-lg font-bold text-[#0F172A] outline-none placeholder-gray-300 bg-transparent"
                      />
                    </div>
                  </div>

                  {/* Check-in */}
                  <div
                    className="flex-1 relative group flex flex-col justify-center px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() =>
                      document.getElementById("in-input").showPicker()
                    }
                  >
                    <InputLabel title="Check-in" />
                    <div className="flex items-center gap-2">
                      <Calendar
                        className="text-gray-400 group-hover:text-[#0284C7] transition-colors"
                        size={18}
                      />
                      <input
                        id="in-input"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        type="date"
                        min={today}
                        className="w-full text-sm font-bold text-[#0F172A] outline-none bg-transparent cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Check-out */}
                  <div
                    className="flex-1 relative group flex flex-col justify-center px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() =>
                      document.getElementById("out-input").showPicker()
                    }
                  >
                    <InputLabel title="Check-out" />
                    <div className="flex items-center gap-2">
                      <Calendar
                        className="text-gray-400 group-hover:text-[#0284C7] transition-colors"
                        size={18}
                      />
                      <input
                        id="out-input"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        type="date"
                        min={checkIn || today}
                        className="w-full text-sm font-bold text-[#0F172A] outline-none bg-transparent cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Status / Rooms */}
                  <div className="flex-1 flex flex-col justify-center px-6 py-4 bg-[#F8FAFC]/50">
                    <InputLabel title="Guests & Rooms" />
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setRooms((r) => Math.max(1, r - 1))}
                          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-white hover:border-[#0284C7] hover:text-[#0284C7] transition-all font-bold"
                        >
                          −
                        </button>
                        <span className="text-sm font-extrabold text-[#0F172A] min-w-[12px] text-center">
                          {rooms}
                        </span>
                        <button
                          type="button"
                          onClick={() => setRooms((r) => r + 1)}
                          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-white hover:border-[#0284C7] hover:text-[#0284C7] transition-all font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Centered Search Button */}
              <div className="mt-8 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  animate={{
                    boxShadow: [
                      "0 20px 50px rgba(249,115,22,0.3)",
                      "0 20px 70px rgba(249,115,22,0.5)",
                      "0 20px 50px rgba(249,115,22,0.3)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  type="submit"
                  className="group relative px-28 py-8 bg-[#F97316] hover:bg-[#ea580c] transition-all text-white font-black text-2xl flex items-center justify-center gap-6 rounded-[3rem] shadow-[0_20px_50px_rgba(249,115,22,0.4)] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <Search
                    size={32}
                    className="group-hover:rotate-12 transition-transform"
                  />
                  <span className="tracking-[0.2em] uppercase">
                    Find Your Hotel
                  </span>
                  <ArrowRight
                    size={28}
                    className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all font-black"
                  />
                </motion.button>
              </div>
            </motion.form>
          )}
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30"
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-5 h-8 rounded-full border border-white/20 flex justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-white/40" />
          </div>
        </motion.div>
      </section>

      {/* ── MANAGER SEARCH SECTION (ONLY FOR MANAGERS) ───────────────────────── */}
      {role === "HOTEL_MANAGER" && (
        <section className="bg-white py-24 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl font-black text-[#0F172A] tracking-tighter uppercase">
                Market Preview
              </h2>
              <p className="text-gray-400 text-sm font-medium">
                Verify your listings and preview the guest experience across the
                platform.
              </p>
            </div>

            <form
              onSubmit={handleSearch}
              className="w-full max-w-5xl mx-auto bg-gray-50 p-4 rounded-[3rem] border border-gray-100 shadow-xl"
            >
              <div className="bg-white rounded-3xl overflow-hidden flex flex-col lg:flex-row items-stretch divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
                <div className="flex-[2] relative group flex flex-col justify-center px-8 py-5 hover:bg-gray-50 transition-colors">
                  <InputLabel title="Verify Location" />
                  <div className="flex items-center gap-3">
                    <MapPin className="text-[#0284C7]" size={20} />
                    <input
                      type="text"
                      placeholder="Search city..."
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="bg-transparent text-sm font-bold text-[#0F172A] placeholder:text-gray-300 outline-none w-full"
                    />
                  </div>
                </div>

                <div className="flex-1 px-8 py-5 hover:bg-gray-50 transition-colors">
                  <InputLabel title="Date In" />
                  <div className="flex items-center gap-3">
                    <Calendar className="text-[#0284C7]" size={18} />
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="bg-transparent text-sm font-bold text-[#0F172A] outline-none w-full"
                    />
                  </div>
                </div>

                <div className="flex-1 px-8 py-5 hover:bg-gray-50 transition-colors">
                  <InputLabel title="Date Out" />
                  <div className="flex items-center gap-3">
                    <Calendar className="text-[#0284C7]" size={18} />
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="bg-transparent text-sm font-bold text-[#0F172A] outline-none w-full"
                    />
                  </div>
                </div>

                <div className="p-4 flex items-center">
                  <button
                    type="submit"
                    className="w-full lg:w-auto px-10 py-4 bg-[#0F172A] hover:bg-[#0284C7] text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                  >
                    Run Preview
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* ── STATS STRIP ──────────────────────────────────────────────────── */}
      {role !== "HOTEL_MANAGER" && (
        <section className="bg-[#0F172A] py-10 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#F97316] mb-3">
                    {stat.icon}
                  </div>
                  <p className="text-3xl font-extrabold text-white tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-xs text-white/40 font-medium mt-0.5">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── TRENDING DESTINATIONS ─────────────────────────────────────────── */}
      {role !== "HOTEL_MANAGER" && (
        <section className="max-w-7xl mx-auto px-4 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-xs font-bold text-[#0284C7] uppercase tracking-widest mb-2"
              >
                Explore
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold text-[#0F172A]"
              >
                Trending Destinations
              </motion.h2>
            </div>
          </div>

          {/* Bento grid (Redesigned) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {DESTINATIONS.slice(0, 5).map((dest, i) => {
              const today = new Date();
              const nextMonth = new Date();
              nextMonth.setMonth(today.getMonth() + 1);

              const params = new URLSearchParams({
                city: dest.city,
                startDate: today.toISOString().split("T")[0],
                endDate: nextMonth.toISOString().split("T")[0],
                roomsCount: 1,
              });

              return (
                <DestCard
                  key={dest.city}
                  dest={dest}
                  index={i}
                  onClick={() => navigate(`/search?${params.toString()}`)}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* ── WHY CHOOSE US ────────────────────────────────────────────────── */}
      {role !== "HOTEL_MANAGER" && (
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-14">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-xs font-bold text-[#0284C7] uppercase tracking-widest mb-2"
              >
                The Roomly Difference
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold text-[#0F172A]"
              >
                Built for discerning travelers
              </motion.h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {WHY_US.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="relative p-6 rounded-2xl bg-[#F6F9FC] border border-gray-100 hover:shadow-lg transition-all group"
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.color}`}
                  >
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-[#0F172A] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {item.desc}
                  </p>
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight size={16} className="text-gray-300" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── EXPERIENCE BANNER ────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#1a3556] to-[#0F172A] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          {/* BG decoration */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 80% 50%, #0284C7 0%, transparent 60%)",
            }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-1/3 opacity-5"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
              backgroundSize: "20px 20px",
            }}
          />

          <div className="relative z-10">
            <p className="text-[#F97316] font-bold text-xs uppercase tracking-widest mb-3">
              For Hotel Managers
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
              List your property.
              <br />
              Start earning today.
            </h2>
            <p className="text-white/50 text-sm max-w-md">
              Join thousands of property managers who trust Roomly to fill their
              rooms, manage their inventory, and grow their revenue.
            </p>
            <div className="relative z-10 flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={() => navigate("/login")}
                className="px-7 py-3.5 bg-[#0284C7] hover:bg-[#7c75ff] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#0284C7]/30 text-sm whitespace-nowrap"
              >
                List Your Hotel
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-7 py-3.5 border border-white/20 text-white/80 hover:bg-white/10 font-semibold rounded-xl transition-all text-sm whitespace-nowrap"
              >
                Learn More
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── THE ROOMLY JOURNEY (REPLACED AMENITIES) ─────────────────────────── */}
      {role !== "HOTEL_MANAGER" && (
        <section className="bg-white py-32 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-[#0284C7]/5 blur-[120px] rounded-full -mr-20 -mt-20" />

          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-20">
              <motion.p
                viewport={{ once: true }}
                className="text-xs font-black text-[#0284C7] uppercase tracking-[0.4em] mb-4"
              >
                How it Works
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-black text-[#0F172A] tracking-tighter uppercase"
              >
                The Roomly Journey
              </motion.h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent -z-10" />

              {[
                {
                  step: "01",
                  title: "Curated Discovery",
                  desc: "Explore a manually verified collection of the finest hotels and villas across the subcontinent.",
                  icon: <Search className="text-[#0284C7]" size={28} />,
                },
                {
                  step: "02",
                  title: "Seamless Reserve",
                  desc: "Instant confirmation with dynamic pricing. No hidden fees, no wait times, just pure efficiency.",
                  icon: <Zap className="text-[#F97316]" size={28} />,
                },
                {
                  step: "03",
                  title: "Elite Experience",
                  desc: "Arrive at your destination with 24/7 concierge support and our guaranteed quality standard.",
                  icon: <ShieldCheck className="text-emerald-500" size={28} />,
                },
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="relative mb-8">
                    <div className="w-20 h-20 rounded-[2.5rem] bg-white border border-gray-100 shadow-xl flex items-center justify-center group-hover:scale-110 group-hover:border-[#0284C7]/30 transition-all duration-500">
                      {item.icon}
                    </div>
                    <span className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-[#0F172A] text-white text-[10px] font-black flex items-center justify-center shadow-lg">
                      {item.step}
                    </span>
                  </div>
                  <h4 className="text-xl font-black text-[#0F172A] uppercase tracking-tight mb-4">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-400 font-medium leading-relaxed max-w-[280px]">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FOOTER SEARCH CTA ─────────────────────────────────────────────── */}
      {role !== "HOTEL_MANAGER" && (
        <section className="max-w-7xl mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4">
              Your next adventure awaits.
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Thousands of hotels, one seamless platform. Find your perfect stay
              in seconds.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#0F172A] hover:bg-[#0284C7] text-white font-bold rounded-2xl text-base transition-all shadow-xl hover:shadow-[#0284C7]/30"
            >
              <Search size={18} />
              Start Exploring
              <ArrowRight size={18} />
            </button>
          </motion.div>
        </section>
      )}
    </div>
  );
};

export default HomePage;

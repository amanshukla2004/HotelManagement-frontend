import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { motion, AnimatePresence } from "framer-motion";

const BaseLayout = () => {
  const { pathname } = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] selection:bg-[#0284C7]/30 selection:text-[#0284C7]">
      <Header />

      <main className="flex-1 w-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default BaseLayout;

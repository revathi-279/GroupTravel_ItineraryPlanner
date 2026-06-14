import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Premium minimalistic vectors matching our corporate design identity ✨
import { Compass, Calendar, Wallet, Image, ArrowRight, ShieldCheck, Globe, ChevronRight } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  // Staggering text motion animation configurations
  const fadeInUp = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { type: "spring", damping: 25, stiffness: 180 }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans antialiased text-gray-900 overflow-x-hidden selection:bg-[#1E4631]/10 selection:text-[#1E4631]">
      
      {/* 1. Elite Minimal Navigation Header */}
      <nav className="w-full bg-white/80 border-b border-gray-200/40 sticky top-0 z-50 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#1E4631] cursor-pointer" onClick={() => navigate("/")}>
            <Compass size={20} strokeWidth={2.5} />
            <span className="text-sm font-black uppercase tracking-widest text-gray-900">
              Voyage<span className="text-[#1E4631]">Core</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate("/login")}
              className="text-xs font-bold text-gray-500 hover:text-gray-900 px-4 py-2 transition-colors duration-150"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate("/register")}
              className="bg-[#1E4631] hover:bg-[#153122] text-white px-4 py-2 rounded-xl text-xs font-semibold tracking-wide shadow-sm transition-all duration-150 active:scale-[0.98]"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* 2. Hero Editorial Cover Display Area */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center space-y-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 bg-[#1E4631]/5 border border-[#1E4631]/10 px-3 py-1 rounded-full text-[#1E4631] text-[10px] font-bold uppercase tracking-widest select-none"
        >
          <Globe size={11} />
          <span>The Collaborative Travel Console</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 leading-[1.1] max-w-2xl mx-auto"
        >
          Group travel coordination, <span className="text-[#1E4631]">redefined for clarity.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-xs md:text-sm text-gray-400 font-medium max-w-md mx-auto leading-relaxed"
        >
          Assemble shared timelines, track ledger expenses split charts, and log collaborative photo streams seamlessly in one elegant, quiet unified workspace canvas.
        </motion.p>

        {/* Updated Center Action Buttons Layout */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="pt-4 flex flex-wrap items-center justify-center gap-3"
        >
          {/* Action 1: Portal Registration Route */}
          <button
            onClick={() => navigate("/register")}
            className="group inline-flex items-center justify-center gap-1.5 bg-[#1E4631] hover:bg-[#153122] text-white px-5 py-3 rounded-xl text-xs font-bold tracking-wide shadow-md transition-all duration-200 active:scale-[0.97]"
          >
            <span>Create New Account</span>
            <ArrowRight size={13} className="transform group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Action 2: Traditional Login Entry Route */}
          <button
            onClick={() => navigate("/login")}
            className="inline-flex items-center justify-center bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 border border-gray-200 px-5 py-3 rounded-xl text-xs font-bold tracking-wide shadow-xs transition-all duration-200 active:scale-[0.97]"
          >
            <span>Sign In to Account</span>
          </button>
        </motion.div>
      </section>

      {/* 3. Product Architecture Features Grid Panel */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card Module 1: Timeline Core */}
          <motion.div 
            {...fadeInUp}
            className="bg-white border border-gray-200/60 p-6 rounded-2xl shadow-xs flex flex-col justify-between hover:shadow-md hover:border-gray-300 transition-all duration-200 group cursor-pointer"
            onClick={() => navigate("/login")}
          >
            <div className="space-y-4">
              <div className="w-9 h-9 rounded-xl bg-[#1E4631]/5 text-[#1E4631] flex items-center justify-center transition-colors group-hover:bg-[#1E4631] group-hover:text-white duration-300">
                <Calendar size={15} />
              </div>
              <h3 className="text-sm font-bold text-gray-800 tracking-tight">Journey Timeline</h3>
              <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                Pin interactive stops, accommodation stays, or dynamic updates. Group events automatically into beautiful chronological daily lists that keep the crew aligned.
              </p>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#1E4631] pt-5 flex items-center gap-0.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Explore Schedules</span>
              <ChevronRight size={12} />
            </div>
          </motion.div>

          {/* Card Module 2: Ledgers splits */}
          <motion.div 
            {...fadeInUp}
            className="bg-white border border-gray-200/60 p-6 rounded-2xl shadow-xs flex flex-col justify-between hover:shadow-md hover:border-gray-300 transition-all duration-200 group cursor-pointer"
            onClick={() => navigate("/login")}
          >
            <div className="space-y-4">
              <div className="w-9 h-9 rounded-xl bg-[#1E4631]/5 text-[#1E4631] flex items-center justify-center transition-colors group-hover:bg-[#1E4631] group-hover:text-white duration-300">
                <Wallet size={15} />
              </div>
              <h3 className="text-sm font-bold text-gray-800 tracking-tight">Shared Expense Ledger</h3>
              <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                Balance accommodations, rental bills, or food checks cleanly. Distribute funding weights across beneficiaries with smart settlement calculation algorithms.
              </p>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#1E4631] pt-5 flex items-center gap-0.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span>View Ledgers</span>
              <ChevronRight size={12} />
            </div>
          </motion.div>

          {/* Card Module 3: Media Archives */}
          <motion.div 
            {...fadeInUp}
            className="bg-white border border-gray-200/60 p-6 rounded-2xl shadow-xs flex flex-col justify-between hover:shadow-md hover:border-gray-300 transition-all duration-200 group cursor-pointer"
            onClick={() => navigate("/login")}
          >
            <div className="space-y-4">
              <div className="w-9 h-9 rounded-xl bg-[#1E4631]/5 text-[#1E4631] flex items-center justify-center transition-colors group-hover:bg-[#1E4631] group-hover:text-white duration-300">
                <Image size={15} />
              </div>
              <h3 className="text-sm font-bold text-gray-800 tracking-tight">Trip Media Archives</h3>
              <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                Preserve high-resolution original originals inside a collaborative masonry gallery. Share live expression reactions and comment on memories together.
              </p>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#1E4631] pt-5 flex items-center gap-0.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Open Galleries</span>
              <ChevronRight size={12} />
            </div>
          </motion.div>

        </div>
      </section>

      {/* 4. Elegant Minimal Action Pitch Footer Banner */}
      <section className="max-w-5xl mx-auto px-4 mt-12">
        <div className="bg-[#1E4631] text-white rounded-3xl p-8 md:p-12 shadow-xl text-center space-y-4 relative overflow-hidden select-none">
          {/* Subtle Decorative Architectural Grid Circles */}
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-white/[0.02] rounded-full blur-xl pointer-events-none" />
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/[0.02] rounded-full blur-xl pointer-events-none" />

          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight max-w-md mx-auto leading-tight">
            Ready to arrange your next group expedition?
          </h2>
          <p className="text-[11px] md:text-xs text-white/70 max-w-xs mx-auto leading-relaxed font-medium">
            Invite your crew, deploy customized itineraries pipelines, and stay entirely in sync throughout the route.
          </p>
          <div className="pt-3">
            <button
              onClick={() => navigate("/register")}
              className="bg-white hover:bg-gray-50 text-gray-950 px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide shadow-md transition-all active:scale-[0.98]"
            >
              Initialize Workspace Free
            </button>
          </div>
        </div>
      </section>

      {/* 5. Clean Metadata Copyright Line Footer */}
      <footer className="w-full text-center py-12 text-[10px] font-bold tracking-wider text-gray-400 uppercase select-none">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200/30 pt-6">
          <div className="flex items-center gap-1.5 text-gray-400">
            <ShieldCheck size={12} />
            <span>Encrypted Ledger Framework Pipeline</span>
          </div>
          <span>© 2026 VoyageCore Console Inc. All Rights Reserved.</span>
        </div>
      </footer>

    </div>
  );
};

export default Home;
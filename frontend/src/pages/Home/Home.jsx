import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

// Premium minimalistic vectors matching our corporate design identity ✨
import { Compass, Palmtree, Calendar, Image, BarChart3, ArrowRight, Sparkles, MapPin, Globe } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Stagger animation container variations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] font-sans antialiased text-slate-900 overflow-x-hidden relative flex flex-col justify-between">
      
      {/* Dynamic Ambient Background Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#E9F5ED]/40 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-[#FAF8F5] border border-[#EFE9DC] rounded-full blur-2xl pointer-events-none -z-10" />

      {/* 1. Navigation Top Header Bar */}
      <motion.nav 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl mx-auto h-20 px-6 md:px-12 flex items-center justify-between select-none"
      >
        <div className="flex items-center gap-2 text-[#2D6A4F]">
          <Compass size={22} className="animate-spin-slow" />
          <span className="text-sm font-black uppercase tracking-widest text-slate-800">
           TripCrew
          </span>
        </div>

        <button
          onClick={() => navigate(user ? "/dashboard" : "/login")}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2D6A4F] hover:text-[#1B4332] transition-colors"
        >
          <span>{user ? "Go to Dashboard" : "Sign In"}</span>
          <ArrowRight size={13} strokeWidth={2.5} />
        </button>
      </motion.nav>

      {/* 2. Main Center Hero Stage Section */}
      <main className="w-full max-w-5xl mx-auto px-6 md:px-12 py-12 flex-1 flex flex-col justify-center">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-5 gap-12 items-center"
        >
          
          {/* Left Text Column Block (Span 3/5) */}
          <div className="md:col-span-3 space-y-6 text-left">
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 bg-[#E9F5ED] border border-[#C1E2CE] px-3 py-1 rounded-full text-[#2D6A4F] text-[10px] font-bold uppercase tracking-wider select-none shadow-2xs"
            >
              <Sparkles size={11} />
              <span>Premium Group Coordination Matrix</span>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight leading-[1.1]"
            >
              Travel planning, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2D6A4F] to-[#52B788]">
                beautifully aligned.
              </span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-sm font-medium text-stone-400 max-w-md leading-relaxed"
            >
              Coordinate itineraries, deliberate dinner arrangements with group polls, share high-res memories, and audit vacation expense metrics seamlessly inside a unified workspace.
            </motion.p>

            {/* Core CTA Actions Row */}
            <motion.div variants={itemVariants} className="pt-2 flex items-center gap-4 select-none">
              <button
                onClick={() => navigate(user ? "/dashboard" : "/register")}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2D6A4F] to-[#40916C] hover:from-[#1B4332] hover:to-[#2D6A4F] text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
              >
                <span>{user ? "Open Workspace" : "Plan Your Next Trip"}</span>
                <ArrowRight size={14} strokeWidth={2.5} />
              </button>
            </motion.div>
          </div>

          {/* Right Visual Frame Interactive Preview Element (Span 2/5) */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-2 relative flex items-center justify-center select-none"
          >
            {/* Primary Interactive Floating Mockup Module */}
            <motion.div 
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="w-full max-w-xs bg-white border border-[#EFE9DC] rounded-[32px] p-6 shadow-xl space-y-5 relative"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-[#E9F5ED] flex items-center justify-center text-[#2D6A4F] shrink-0">
                    <Palmtree size={14} />
                  </div>
                  <div className="min-w-0 leading-tight">
                    <h3 className="text-xs font-bold text-slate-800 truncate">Vrindavan Trip</h3>
                    <p className="text-[9px] font-semibold text-stone-400">Krishna Consciousness</p>
                  </div>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider bg-[#E9F5ED] text-[#2D6A4F] px-2 py-0.5 rounded-md border border-[#C1E2CE]">
                  Ongoing
                </span>
              </div>

              {/* Fake Micro Progress Tracking Item */}
              <div className="space-y-2 p-3 bg-[#FAF8F5] border border-[#EFE9DC]/60 rounded-xl">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-700">
                  <span className="flex items-center gap-1"><BarChart3 size={12} className="text-[#2D6A4F]" /> Group Dinner Poll</span>
                  <span className="text-stone-400">85% Voted</span>
                </div>
                <div className="w-full h-1 bg-stone-100 rounded-full overflow-hidden">
                  <div className="w-5/6 h-full bg-[#2D6A4F] rounded-full" />
                </div>
              </div>

              {/* Feature Horizontal Micro Tags */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-stone-500 bg-[#FAF8F5] p-2 rounded-xl border border-stone-100">
                  <Calendar size={11} className="text-stone-400" />
                  <span>Itinerary</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-stone-500 bg-[#FAF8F5] p-2 rounded-xl border border-stone-100">
                  <Image size={11} className="text-stone-400" />
                  <span>Gallery</span>
                </div>
              </div>
            </motion.div>

            {/* Small absolute offset badges floating outside main card */}
            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4000, ease: "easeInOut" }}
              className="absolute -top-4 -left-6 bg-white border border-[#EFE9DC] px-3 py-1.5 rounded-xl shadow-md flex items-center gap-2"
            >
              <MapPin size={12} className="text-[#2D6A4F]" />
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">India</span>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 4500, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-4 -right-2 bg-white border border-[#EFE9DC] px-3 py-1.5 rounded-xl shadow-md flex items-center gap-2"
            >
              <Globe size={12} className="text-[#52B788]" />
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Shared Logs</span>
            </motion.div>

          </motion.div>
        </motion.div>
      </main>

      {/* 3. Bottom Footer Credit Note Row */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="w-full text-center py-6 border-t border-[#EFE9DC]/60 select-none"
      >
        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
          © {new Date().getFullYear()} TripCrew Environment Matrix. All Rights Reserved.
        </p>
      </motion.footer>

    </div>
  );
};

export default Home;
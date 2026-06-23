import React from "react";
import AuthCard from "../../components/auth/AuthCard";
import RegisterForm from "../../components/auth/RegisterForm";
import { theme } from "../../common/common";

const Register = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-[#FAF8F5] px-6 font-sans antialiased text-slate-900 select-none">
      <AuthCard>
        
        {/* Registration Welcome Header Section */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center justify-center md:justify-start gap-2">
            <span className="text-[#2D6A4F]">🌿</span> Journey Planner
          </h1>
          <p className="text-xs font-semibold text-stone-400 mt-1.5 leading-relaxed">
            Create an account and start coordinating premium group travel experiences with your friends.
          </p>
        </div>

        {/* Core Multi-Field Identity Sign-Up Form Pipeline Component */}
        <RegisterForm />

      </AuthCard>
    </div>
  );
};

export default Register;
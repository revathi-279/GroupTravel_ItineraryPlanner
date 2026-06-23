import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { theme } from "../../common/common";
import Spinner from "../common/Spinner";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const validationErrors = {};

    // Name Validation
    if (!formData.name.trim()) {
      validationErrors.name = "Please enter your name";
    } else if (formData.name.trim().length < 2) {
      validationErrors.name = "Name must be at least 2 characters";
    }

    // Email Validation
    if (!formData.email.trim()) {
      validationErrors.email = "Please enter your email";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        validationErrors.email = "Please enter a valid email";
      }
    }

    // Password Validation
    if (!formData.password.trim()) {
      validationErrors.password = "Please enter a password";
    } else if (formData.password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters";
    }

    // Confirm Password
    if (!formData.confirmPassword.trim()) {
      validationErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }

    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      navigate("/dashboard");
    } catch (err) {
      const message = err?.response?.data?.message;
      if (message === "Email already exists") {
        setErrors({ email: "Email already registered" });
      } else {
        setErrors({ general: message || "Registration failed" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-sans text-slate-900">
      
      {/* Full Name Input wrapper */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 select-none">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          disabled={loading}
          placeholder="e.g., Krishna"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-4 py-2.5 bg-[#FAF8F5] border rounded-xl text-xs font-semibold outline-none transition-all focus:bg-white focus:border-[#2D6A4F] ${
            errors.name ? "border-rose-300 focus:border-rose-500 bg-rose-50/20" : "border-[#EFE9DC]"
          }`}
        />
        {errors.name && (
          <p className="text-rose-600 text-[10px] font-bold mt-1 select-none animate-in fade-in duration-150">
            {errors.name}
          </p>
        )}
      </div>

      {/* Email Address Input wrapper */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 select-none">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          disabled={loading}
          placeholder="e.g., krishna@gmail.com"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-2.5 bg-[#FAF8F5] border rounded-xl text-xs font-semibold outline-none transition-all focus:bg-white focus:border-[#2D6A4F] ${
            errors.email ? "border-rose-300 focus:border-rose-500 bg-rose-50/20" : "border-[#EFE9DC]"
          }`}
        />
        {errors.email && (
          <p className="text-rose-600 text-[10px] font-bold mt-1 select-none animate-in fade-in duration-150">
            {errors.email}
          </p>
        )}
      </div>

      {/* Password Input wrapper */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 select-none">
          Password
        </label>
        <input
          type="password"
          name="password"
          disabled={loading}
          placeholder="Choose security password..."
          value={formData.password}
          onChange={handleChange}
          className={`w-full px-4 py-2.5 bg-[#FAF8F5] border rounded-xl text-xs font-semibold outline-none transition-all focus:bg-white focus:border-[#2D6A4F] ${
            errors.password ? "border-rose-300 focus:border-rose-500 bg-rose-50/20" : "border-[#EFE9DC]"
          }`}
        />
        {errors.password && (
          <p className="text-rose-600 text-[10px] font-bold mt-1 select-none animate-in fade-in duration-150">
            {errors.password}
          </p>
        )}
      </div>

      {/* Confirm Password Input wrapper */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 select-none">
          Confirm Password
        </label>
        <input
          type="password"
          name="confirmPassword"
          disabled={loading}
          placeholder="Repeat security password..."
          value={formData.confirmPassword}
          onChange={handleChange}
          className={`w-full px-4 py-2.5 bg-[#FAF8F5] border rounded-xl text-xs font-semibold outline-none transition-all focus:bg-white focus:border-[#2D6A4F] ${
            errors.confirmPassword ? "border-rose-300 focus:border-rose-500 bg-rose-50/20" : "border-[#EFE9DC]"
          }`}
        />
        {errors.confirmPassword && (
          <p className="text-rose-600 text-[10px] font-bold mt-1 select-none animate-in fade-in duration-150">
            {errors.confirmPassword}
          </p>
        )}
      </div>

      {/* Global General Alert message fallback label wrapper */}
      {errors.general && (
        <p className="text-rose-600 text-xs font-bold select-none p-3 bg-rose-50 border border-rose-100 rounded-xl text-center">
          {errors.general}
        </p>
      )}

      {/* Dispatch form trigger CTA action button */}
      <div className="pt-2 select-none">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#2D6A4F] to-[#40916C] hover:from-[#1B4332] hover:to-[#2D6A4F] text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Spinner className="w-4 h-4 text-white" />
              <span>Creating Account...</span>
            </div>
          ) : (
            "Create Account"
          )}
        </button>
      </div>

      {/* Login Navigation Route shift Redirect trigger info bar */}
      <p className="text-center text-xs font-semibold text-stone-400 pt-3 select-none">
        Already have an account?{" "}
        <Link to="/login" className="text-[#2D6A4F] hover:underline font-bold">
          Login
        </Link>
      </p>

    </form>
  );
};

export default RegisterForm;
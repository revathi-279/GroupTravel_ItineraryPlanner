import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { theme } from "../../common/common";
import Spinner from "../common/Spinner";

const RegisterForm = () => {

  const navigate = useNavigate();

  const { register } = useAuth();

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

  const [errors, setErrors] =
    useState({});

  const [loading, setLoading] =
    useState(false);

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

      validationErrors.name =
        "Please enter your name";

    } else if (
      formData.name.trim().length < 2
    ) {

      validationErrors.name =
        "Name must be at least 2 characters";
    }

    // Email Validation

    if (!formData.email.trim()) {

      validationErrors.email =
        "Please enter your email";

    } else {

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailRegex.test(
          formData.email
        )
      ) {

        validationErrors.email =
          "Please enter a valid email";
      }
    }

    // Password Validation

    if (!formData.password.trim()) {

      validationErrors.password =
        "Please enter a password";

    } else if (
      formData.password.length < 6
    ) {

      validationErrors.password =
        "Password must be at least 6 characters";
    }

    // Confirm Password

    if (
      !formData.confirmPassword.trim()
    ) {

      validationErrors.confirmPassword =
        "Please confirm your password";

    } else if (
      formData.password !==
      formData.confirmPassword
    ) {

      validationErrors.confirmPassword =
        "Passwords do not match";
    }

    return validationErrors;
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    const validationErrors =
      validateForm();

    if (
      Object.keys(validationErrors)
        .length > 0
    ) {

      setErrors(validationErrors);
      return;
    }

    try {

      setLoading(true);
      setErrors({});

      await register({
        name:
          formData.name.trim(),
        email:
          formData.email.trim(),
        password:
          formData.password,
      });

      navigate("/dashboard");

    } catch (err) {

      const message =
        err?.response?.data?.message;

      if (
        message ===
        "Email already exists"
      ) {

        setErrors({
          email:
            "Email already registered",
        });

      } else {

        setErrors({
          general:
            message ||
            "Registration failed",
        });
      }

    } finally {

      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >

      {/* Name */}

      <div>

        <label
          className={
            theme.typography.formLabel
          }
        >
          Full Name
        </label>

        <input
          type="text"
          name="name"
          disabled={loading}
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
          className={`
            ${theme.inputs.primary}
            ${
              errors.name
                ? theme.inputs.error
                : ""
            }
          `}
        />

        {errors.name && (
          <p className="text-red-500 text-sm mt-1">
            {errors.name}
          </p>
        )}

      </div>

      {/* Email */}

      <div>

        <label
          className={
            theme.typography.formLabel
          }
        >
          Email
        </label>

        <input
          type="email"
          name="email"
          disabled={loading}
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          className={`
            ${theme.inputs.primary}
            ${
              errors.email
                ? theme.inputs.error
                : ""
            }
          `}
        />

        {errors.email && (
          <p className="text-red-500 text-sm mt-1">
            {errors.email}
          </p>
        )}

      </div>

      {/* Password */}

      <div>

        <label
          className={
            theme.typography.formLabel
          }
        >
          Password
        </label>

        <input
          type="password"
          name="password"
          disabled={loading}
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
          className={`
            ${theme.inputs.primary}
            ${
              errors.password
                ? theme.inputs.error
                : ""
            }
          `}
        />

        {errors.password && (
          <p className="text-red-500 text-sm mt-1">
            {errors.password}
          </p>
        )}

      </div>

      {/* Confirm Password */}

      <div>

        <label
          className={
            theme.typography.formLabel
          }
        >
          Confirm Password
        </label>

        <input
          type="password"
          name="confirmPassword"
          disabled={loading}
          placeholder="Confirm password"
          value={
            formData.confirmPassword
          }
          onChange={handleChange}
          className={`
            ${theme.inputs.primary}
            ${
              errors.confirmPassword
                ? theme.inputs.error
                : ""
            }
          `}
        />

        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">
            {
              errors.confirmPassword
            }
          </p>
        )}

      </div>

      {errors.general && (
        <p className="text-red-500 text-sm">
          {errors.general}
        </p>
      )}

      <button
  type="submit"
  disabled={loading}
  className={`
    ${theme.buttons.primaryFull}
    ${
      loading
        ? theme.buttons.loading
        : ""
    }
  `}
>
  {loading ? (
    <div className="flex items-center justify-center gap-3">

      <Spinner />

      <span>
        Creating Account...
      </span>

    </div>
  ) : (
    "Create Account"
  )}
</button>

      <p className="text-center text-sm">

        Already have an account?{" "}

        <Link
          to="/login"
          className={
            theme.links.auth
          }
        >
          Login
        </Link>

      </p>

    </form>
  );
};

export default RegisterForm;
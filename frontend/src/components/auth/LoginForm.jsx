import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { theme } from "../../common/common";
import Spinner from "../common/Spinner";

const LoginForm = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [errors, setErrors] =
useState({});

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

 const handleSubmit = async (e) => {
  e.preventDefault();

  const validationErrors = {};

  if (!formData.email.trim()) {
    validationErrors.email =
      "Please enter your email";
  }

  if (!formData.password.trim()) {
    validationErrors.password =
      "Please enter your password";
  }

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

    await login(formData);

    navigate("/dashboard");

  } catch (err) {

    const message =
      err?.response?.data?.message;

    if (
      message ===
      "Email doesn't exist"
    ) {

      setErrors({
        email:
          "No account found with this email",
      });

    } else if (
      message ===
      "Password is incorrect"
    ) {

      setErrors({
        password:
          "Incorrect password",
      });

    } else {

      setErrors({
        general:
          message ||
          "Login failed",
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
      <div>

  <input
    type="email"
    name="email"
    placeholder="Email"
    disabled={loading}
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

      <div>

  <input
    type="password"
    name="password"
    placeholder="Password"
    disabled={loading}
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
        Logging In...
      </span>

    </div>
  ) : (
    "Login"
  )}
</button>

      <p className="text-center text-sm">
        Don't have an account?{" "}
        <Link
          to="/register"
          className={
            theme.links.auth
          }
        >
          Register
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
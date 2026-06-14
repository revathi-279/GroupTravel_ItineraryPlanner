import AuthCard from "../../components/auth/AuthCard";
import LoginForm from "../../components/auth/LoginForm";
import { theme } from "../../common/common";

const Login = () => {
  return (
    <div
      className={`
      min-h-screen
      flex
      justify-center
      items-center
      ${theme.gradients.hero}
      px-6
      `}
    >
      <AuthCard>

        <div className="mb-8">

          <h1
            className={
              theme.typography.authTitle
            }
          >
            🌿 Journey Planner
          </h1>

          <p
            className={
              theme.typography.authSubtitle
            }
          >
            Continue your travel
            journey with friends
          </p>

        </div>

        <LoginForm />

      </AuthCard>
    </div>
  );
};

export default Login;
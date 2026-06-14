import AuthCard from "../../components/auth/AuthCard";
import RegisterForm from "../../components/auth/RegisterForm";

import { theme }
from "../../common/common";

const Register = () => {

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
            Start your travel
            journey with friends
          </p>

        </div>

        <RegisterForm />

      </AuthCard>

    </div>
  );
};

export default Register;
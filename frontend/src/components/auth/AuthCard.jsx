import {
  theme,
} from "../../common/common";

const AuthCard =
({
  children,
}) => {

  return (
    <div
      className={`
      ${theme.cards.authGlass}
      ${theme.layouts.authContainer}
      `}
    >
      {children}
    </div>
  );
};

export default AuthCard;
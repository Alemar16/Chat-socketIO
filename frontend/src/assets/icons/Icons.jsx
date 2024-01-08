import PropTypes from "prop-types";

export const LogoutIcon = ({ onLogout }) => {
  console.log("Logout icon clicked");
   const handleLogout = () => {
     console.log("Handle logout called");
     onLogout();
   };
  return (
    <svg
      className="h-8 w-8 text-red-500 hover:text-red-700"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      onClick={handleLogout}
    >
      <title>Logout</title>
      <path stroke="none" d="M0 0h24v24H0z" />
      <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
      <path d="M7 12h14l-3 -3m0 6l3 -3" />
    </svg>
  );
};

LogoutIcon.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

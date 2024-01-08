import React from "react";
import PropTypes from "prop-types";
// @ts-ignore
import logoutIcon from "../../assets/icons/logout-icon.svg";


export const ButtonLogout = ({ onLogout }) => {
  const handleLogout = () => {
    onLogout();
  };
  return (
    <img
      src={logoutIcon}
      alt="Logout"
      className="h-8 w-8 cursor-pointer "
      onClick={handleLogout}
    />
  );
};

ButtonLogout.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

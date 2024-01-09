// ButtonShowUsers.jsx
import { useState } from "react";
import PropTypes from "prop-types";
import usersIcon from "../../assets/icons/users-icon.svg";

export const ButtonShowUsers = ({ onShowUsers }) => {
  const [show, setShow] = useState(false);

  const handleShowUsers = () => {
    setShow(!show);
    onShowUsers(!show); 
  };

  return (
    <img
      src={usersIcon}
      alt="Show Users"
      className="h-16 w-16 cursor-pointer"
      onClick={handleShowUsers}
    />
  );
};

ButtonShowUsers.propTypes = {
  onShowUsers: PropTypes.func.isRequired,
}
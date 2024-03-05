import { useState } from "react";
import PropTypes from "prop-types";
import usersIcon from "../../assets/icons/users-icon.svg";
import usersIcon2 from "../../assets/icons/users-icon2.svg";
import closeIcon from "../../assets/icons/close-icon.svg";

export const ButtonShowUsers = ({ onShowUsers, connectedUsers }) => {
  const [show, setShow] = useState(false);

  const handleShowUsers = () => {
    setShow(!show);
    onShowUsers(!show);
  };

  return (
    <div className="relative">
      <img
        src={show ? usersIcon2 : usersIcon} // Cambio de icono según el estado 'show'
        alt="Show Users"
        className="h-16 w-16 cursor-pointer hover:scale-110"
        onClick={handleShowUsers}
      />
      {show && (
        <img
          src={closeIcon}
          alt="Close"
          className="absolute top-0 right-0 -mt-2 -mr-2 cursor-pointer"
          style={{ width: "24px", height: "24px" }}
          onClick={handleShowUsers}
        />
      )}
      {connectedUsers.length > 0 && (
        <span className="absolute bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs top-8 -right-5 animate-pulse">
          {connectedUsers.length > 99 ? "+99" : connectedUsers.length}
        </span>
      )}
    </div>
  );
};

ButtonShowUsers.propTypes = {
  onShowUsers: PropTypes.func.isRequired,
  connectedUsers: PropTypes.array.isRequired,
};

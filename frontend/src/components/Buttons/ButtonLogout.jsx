import PropTypes from "prop-types";
import logoutIcon from "../../assets/icons/logout-icon.svg";


import Swal from "sweetalert2";

export const ButtonLogout = ({ onLogout }) => {
  const handleLogout = () => {
    Swal.fire({
      title: 'Wait!',
      text: "If you leave, all data and messages will be permanently deleted. This action is irreversible.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete & exit'
    }).then((result) => {
      if (result.isConfirmed) {
        onLogout();
      }
    })
  };
  return (
    <img
      src={logoutIcon}
      alt="Logout"
      className="h-8 w-8 cursor-pointer hover:scale-110 transition-transform"
      title="Exit & Delete Data"
      onClick={handleLogout}
    />
  );
};

ButtonLogout.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

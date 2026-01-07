import PropTypes from "prop-types";
import logoutIcon from "../../assets/icons/logout-icon.svg";


import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

export const ButtonLogout = ({ onLogout }) => {
  const { t } = useTranslation();

  const handleLogout = () => {
    Swal.fire({
      title: t('logout.title'),
      text: t('logout.text'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: t('logout.confirmButton'),
      cancelButtonText: t('logout.cancelButton')
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
      title={t('logout.tooltip')}
      onClick={handleLogout}
    />
  );
};

ButtonLogout.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

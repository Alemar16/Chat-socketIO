import SendIcon from "../../assets/icons/send.svg";
import PropTypes from 'prop-types';

const ButtonSend = ({ onClick }) => {
  return (
    <img
      src={SendIcon}
      alt="Send icon"
      className="cursor-pointer dark:invert"
      onClick={onClick}
    />
  );
};

ButtonSend.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default ButtonSend;

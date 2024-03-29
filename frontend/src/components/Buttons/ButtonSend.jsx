import React from "react";
import SendIcon from "../../assets/icons/send.svg";

const ButtonSend = ({ onClick }) => {
  return (
    <img
      src={SendIcon}
      alt="Send icon"
      className="cursor-pointer"
      onClick={onClick}
    />
  );
};

export default ButtonSend;

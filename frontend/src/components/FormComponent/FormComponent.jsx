import io from "socket.io-client";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ButtonSend from "../Buttons/ButtonSend";

import ConnectedUsersList from "../ConnectedUsersList/ConnectedUsersList";
import { ButtonShowUsers } from "../Buttons/ButtonShowUsers";

import GreetingComponent from "../GreetingComponent/GreetingComponent";

const socket = io("/");

const FormComponent = ({ onSubmit, username }) => {
  const [message, setMessage] = useState("");
  const [showConnectedUsersModal, setShowConnectedUsersModal] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorVisible, setErrorVisible] = useState(false); // State para controlar la visibilidad del error

  useEffect(() => {
    socket.on("users", updateConnectedUsers);
    return () => {
      socket.off("users", updateConnectedUsers);
    };
  }, []);

  useEffect(() => {
    if (errorMessage) {
      setErrorVisible(true); 
      const timer = setTimeout(() => {
        setErrorMessage("");
        setErrorVisible(false); 
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() === "") {
      setErrorMessage("Please write your message.");
    } else {
      onSubmit(message);
      setMessage("");
      setErrorMessage("");
    }
  };

  const updateConnectedUsers = (users) => {
    setConnectedUsers(users);
  };

  return (
    <div className="max-w-md w-full relative">
      {username && (
        <div className="flex justify-between items-center mb-2 mt-2 px-5 gap-5">
          <GreetingComponent username={username} />
          <div>
            <ButtonShowUsers
              onShowUsers={setShowConnectedUsersModal}
              connectedUsers={connectedUsers} 
            />
          </div>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className={`rounded-md bg-white p-1 mb-1 ${
          errorVisible ? "border-2 border-red-500" : ""
        }`}
      >
        <div className="flex gap-2">
          <input
            placeholder="Write your message..."
            className="p-2 w-full rounded text-black bg-opacity-50 focus:bg-white focus:outline-none focus:bg-opacity-100 "
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <ButtonSend onClick={handleSubmit} />
        </div>
      </form>
        {errorMessage && (
          <div className="text-red-600 text-sm ml-2 -mt-1">{errorMessage}</div>
        )}
      {showConnectedUsersModal && (
        <div className="modal absolute top-40 left-0 z-50 w-full h-full flex items-center justify-center">
          <ConnectedUsersList users={connectedUsers} />
        </div>
      )}
    </div>
  );
};

FormComponent.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
};

export default FormComponent;

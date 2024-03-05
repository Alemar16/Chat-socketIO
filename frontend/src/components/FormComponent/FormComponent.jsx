// FormComponent.jsx

import io from "socket.io-client";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

import ConnectedUsersList from "../ConnectedUsersList/ConnectedUsersList";
import { ButtonShowUsers } from "../Buttons/ButtonShowUsers";

import GreetingComponent from "../GreetingComponent/GreetingComponent";

const socket = io("/");

const FormComponent = ({ onSubmit, username }) => {
  const [message, setMessage] = useState("");
  const [showConnectedUsersModal, setShowConnectedUsersModal] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState([]);

  useEffect(() => {
    socket.on("users", updateConnectedUsers);
    return () => {
      socket.off("users", updateConnectedUsers);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(message);
    setMessage("");
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
              connectedUsers={connectedUsers} // Pasar connectedUsers como prop
            />
          </div>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="border-2 border-zinc-600 rounded p-1"
      >
        <div className="flex gap-2">
          <input
            placeholder="Write your message..."
            className="border-2 border-zinc-600 p-2 w-full rounded text-black bg-opacity-50 focus:bg-white focus:outline-none focus:bg-opacity-100 shadow-lg focus:shadow-indigo-900 transition-all duration-300"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="btn hover:bg-blue-800 shadow-lg shadow-indigo-900/80 cursor-pointer"
            type="submit"
          >
            Send
          </button>
        </div>
      </form>
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

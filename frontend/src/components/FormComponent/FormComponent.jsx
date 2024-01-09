import io from "socket.io-client";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ButtonLogout } from "../ButtonLogout/ButtonLogout";
import ConnectedUsersList from "../ConnectedUsersList/ConnectedUsersList";
import { ButtonShowUsers } from "../ButtonLogout/ButtonShowUsers";

const socket = io("/");

// ... (importaciones y código anterior)

const FormComponent = ({ onSubmit, username, onLogout }) => {
  const [message, setMessage] = useState("");
  const [showConnectedUsersModal, setShowConnectedUsersModal] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState([]);

  useEffect(() => {
    socket.on("users", updateConnectedUsers);
    return () => {
      socket.off("users", updateConnectedUsers);
    };
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(message);
    setMessage("");
  };

  const updateConnectedUsers = (users) => {
    setConnectedUsers(users);
  };

  return (
    <div className="max-w-md w-full">
      <div className="relative">
        {/* Contenedor del logo */}
        <div className="text-center">
          <img
            src="/icons8-chat-100.png"
            alt="Logo-Chat"
            className="w-20 h-20 mx-auto mb-1"
          />
          <h1 className="text-3xl font-bold mb-5">Chat Socket.io</h1>
        </div>

        <div className="absolute top-0 right-0 m-1">
          <ButtonLogout onLogout={onLogout} />
        </div>
      </div>

      {username && (
        <div className="flex justify-between items-center mb-2 mt-2 px-5 gap-5">
          <span className="text-2xl font-bold text-white rounded-md font-mono p-2">
            Welcome, {username}!
          </span>

          <div>
            <ButtonShowUsers onShowUsers={setShowConnectedUsersModal} />
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-8 pb-4 rounded">
        <div className="flex gap-3">
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

      {/* Renderizar el modal según el estado */}
      {showConnectedUsersModal && (
        <div className="modal">
          <button
            className="absolute top-2 right-2 text-white cursor-pointer"
            onClick={() => setShowConnectedUsersModal(false)}
          >
            Close
          </button>
          <ConnectedUsersList users={connectedUsers} />
        </div>
      )}
    </div>
  );
};

FormComponent.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default FormComponent;

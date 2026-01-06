import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import ButtonSend from "../Buttons/ButtonSend";

import ConnectedUsersList from "../ConnectedUsersList/ConnectedUsersList";
import { ButtonShowUsers } from "../Buttons/ButtonShowUsers";

import GreetingComponent from "../GreetingComponent/GreetingComponent";

const FormComponent = ({ onSubmit, onImageSubmit, username, socket }) => {
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null); // Ref for file input
  const [showConnectedUsersModal, setShowConnectedUsersModal] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorVisible, setErrorVisible] = useState(false); // State para controlar la visibilidad del error

  useEffect(() => {
    socket.on("users", updateConnectedUsers);
    return () => {
      socket.off("users", updateConnectedUsers);
    };
  }, [socket]);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrorMessage("Only image files are allowed.");
        return;
      }
      if (file.size > 3000000) { // ~3MB
        setErrorMessage("Image too large (Max 3MB).");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSubmit(reader.result);
      };
      reader.readAsDataURL(file);
      e.target.value = null; // Reset input
    }
  };

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
    <div className="w-full relative">
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
        <div className="flex gap-2 items-center">
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <button
            type="button"
            className="text-gray-500 hover:text-purple-600 transition-colors p-2"
            onClick={() => fileInputRef.current.click()}
            title="Send Image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
            </svg>
          </button>
          <textarea
            rows={1}
            placeholder="Write your message..."
            className="p-2 w-full rounded text-black bg-opacity-50 focus:bg-white focus:outline-none focus:bg-opacity-100 "
            style={{ resize: "none" }}
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
  onImageSubmit: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  socket: PropTypes.object.isRequired,
};

export default FormComponent;

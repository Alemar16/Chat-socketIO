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
  const [previewImage, setPreviewImage] = useState(null); // State for image preview

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
        setPreviewImage(reader.result); // Set preview instead of sending
      };
      reader.readAsDataURL(file);
      e.target.value = null; // Reset input
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if there is anything to send
    if (message.trim() === "" && !previewImage) {
      setErrorMessage("Please write a message or select an image.");
      return;
    }

    // Send Image if exists (with optional caption)
    if (previewImage) {
      onImageSubmit(previewImage, message); // Pass message as caption
      setPreviewImage(null);
      setMessage(""); // Clear message after sending with image
    } else if (message.trim() !== "") {
      // Send Text Message only if no image
      onSubmit(message);
      setMessage("");
    }
    
    setErrorMessage("");
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
        className={`rounded-md bg-white p-2 mb-1 flex flex-col gap-2 shadow-sm ${
          errorVisible ? "border-2 border-red-500" : ""
        }`}
      >
        {previewImage && (
          <div className="w-full flex justify-start p-1 bg-gray-50 rounded-lg border border-gray-100 animate-fade-in relative">
              <div className="relative group">
                <img 
                  src={previewImage} 
                  alt="Preview" 
                  className="h-20 w-auto rounded-md object-cover shadow-sm border border-gray-200"
                />
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full p-0.5 w-5 h-5 flex items-center justify-center hover:bg-black shadow-md transition-transform transform group-hover:scale-110"
                  onClick={() => setPreviewImage(null)}
                  title="Remove Image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </button>
              </div>
          </div>
        )}
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

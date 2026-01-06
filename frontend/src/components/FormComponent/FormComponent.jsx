import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import useVoiceRecorder from "../../hooks/useVoiceRecorder";
import ButtonSend from "../Buttons/ButtonSend";

import ConnectedUsersList from "../ConnectedUsersList/ConnectedUsersList";
import { ButtonShowUsers } from "../Buttons/ButtonShowUsers";

import GreetingComponent from "../GreetingComponent/GreetingComponent";

const FormComponent = ({ onSubmit, onImageSubmit, onAudioSubmit, username, socket }) => {
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null); // Ref for file input
  const [showConnectedUsersModal, setShowConnectedUsersModal] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorVisible, setErrorVisible] = useState(false); // State para controlar la visibilidad del error
  const [previewImage, setPreviewImage] = useState(null); // State for image preview

  const {
      isRecording,
      recordingTime,
      startRecording,
      stopRecording,
      cancelRecording,
      formatTime
  } = useVoiceRecorder(onAudioSubmit);

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
        {isRecording ? (
             <div className="flex items-center justify-between w-full h-12 bg-white rounded px-2 gap-4 animate-fade-in relative">
                {/* Cancel Button (Trash) */}
                <button
                    type="button"
                    onClick={cancelRecording}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Cancel Recording"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                         <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.49 1.45 47.79 47.79 0 0 0-3.388-.475v.227c0 2.228-.016 4.39-.082 6.425a1.75 1.75 0 0 1-1.745 1.696H9.248a1.745 1.745 0 0 1-1.745-1.696c-.066-2.036-.08-4.2-.082-6.425v-.227a47.79 47.79 0 0 0-3.388.475.75.75 0 1 1-.49-1.45 48.816 48.816 0 0 1 3.878-.512v-.227c0-1.162.887-2.138 2.082-2.195a63.673 63.673 0 0 1 5.92 0c1.196.057 2.082 1.033 2.082 2.195ZM15.75 9h-7.5c.01 1.725.02 3.327.028 4.793.006.942.01 1.838.01 2.707a.245.245 0 0 0 .245.245h6.934a.245.245 0 0 0 .245-.245v-2.707c0-.285.003-.585.008-.9l.068-3.141Z" clipRule="evenodd" />
                    </svg>
                </button>

                {/* Timer and Indicator */}
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="font-mono font-bold text-gray-700 text-lg">{formatTime(recordingTime)}</span>
                     <span className="text-xs text-gray-400 animate-pulse">Recording...</span>
                </div>

                {/* Send Button */}
                <button
                    type="button"
                    onClick={stopRecording}
                    className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 hover:scale-110 transition-transform shadow-md"
                    title="Send Voice Message"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                         <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                    </svg>
                </button>
             </div>
        ) : (
             <div className="flex gap-2 items-center w-full">
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

          {/* Dynamic Buttons */}
          {message.trim() || previewImage ? (
             <ButtonSend onClick={handleSubmit} />
          ) : (
             <button
                type="button"
                onClick={startRecording}
                className="text-gray-500 hover:text-red-500 hover:bg-gray-100 p-2 rounded-full transition-colors"
                title="Record Voice Message"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
                    <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" />
                </svg>
            </button>
          )}
        </div>
        )}
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
  onAudioSubmit: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  socket: PropTypes.object.isRequired,
};

export default FormComponent;

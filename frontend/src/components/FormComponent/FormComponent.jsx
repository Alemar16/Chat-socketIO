import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { 
    PaperClipIcon, 
    MicrophoneIcon, 
    TrashIcon, 
    PaperAirplaneIcon,
    XMarkIcon,
    CameraIcon,
    PhotoIcon 
} from "@heroicons/react/24/solid";
import useVoiceRecorder from "../../hooks/useVoiceRecorder";
import ButtonSend from "../Buttons/ButtonSend";

import CameraModal from "../Modal/CameraModal";

import GreetingComponent from "../GreetingComponent/GreetingComponent";

const FormComponent = ({ onSubmit, onImageSubmit, onAudioSubmit, username }) => {
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null); // Ref for file input
  const [errorMessage, setErrorMessage] = useState("");
  const [errorVisible, setErrorVisible] = useState(false); // State para controlar la visibilidad del error
  const [previewImage, setPreviewImage] = useState(null); // State for image preview
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false); // State to toggle attachment options
  const [showCameraModal, setShowCameraModal] = useState(false); // State to toggle camera modal

  const {
      isRecording,
      recordingTime,
      startRecording,
      stopRecording,
      cancelRecording,
      formatTime
  } = useVoiceRecorder(onAudioSubmit);



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
      setShowAttachmentOptions(false); // Hide options after selection
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

  const handleCameraCapture = (imageDataUrl) => {
    setPreviewImage(imageDataUrl);
    setShowAttachmentOptions(false);
  };



  return (
    <div className="w-full relative">
      {username && (
        <div className="flex justify-between items-center mb-2 mt-2 px-5 gap-5">
          <GreetingComponent username={username} />
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className={`rounded-md bg-white p-2 mb-1 mx-2 flex flex-col gap-2 shadow-sm ${
          errorVisible ? "border-2 border-red-500" : ""
        }`}
      >

        {showAttachmentOptions && !previewImage && (
             <div className="w-full flex justify-start p-2 bg-gray-50 rounded-lg border border-gray-100 animate-fade-in relative gap-4">
               <button
                 type="button"
                 onClick={() => setShowCameraModal(true)}
                 className="flex flex-col items-center gap-1 p-2 hover:bg-gray-200 rounded-md transition-colors"
               >
                 <div className="bg-purple-100 p-2 rounded-full text-purple-600">
                    <CameraIcon className="w-6 h-6" />
                 </div>
                 <span className="text-xs text-gray-600 font-medium">Camera</span>
               </button>
               <button
                 type="button"
                 onClick={() => fileInputRef.current.click()}
                 className="flex flex-col items-center gap-1 p-2 hover:bg-gray-200 rounded-md transition-colors"
               >
                 <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                    <PhotoIcon className="w-6 h-6" />
                 </div>
                 <span className="text-xs text-gray-600 font-medium">Gallery</span>
               </button>
             </div>
        )}
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
                  <XMarkIcon className="w-3 h-3" />
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
                    <TrashIcon className="w-6 h-6" />
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
                    <PaperAirplaneIcon className="w-5 h-5" />
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
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <button
            type="button"
            className={`text-gray-500 hover:text-purple-600 transition-colors p-2 ${showAttachmentOptions ? 'text-purple-600 bg-purple-50 rounded-full' : ''}`}
            onClick={() => setShowAttachmentOptions(!showAttachmentOptions)}
            title="Attach Image"
          >
            <PaperClipIcon className="w-6 h-6" />
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
                <MicrophoneIcon className="w-6 h-6" />
            </button>
          )}
        </div>
        )}
      </form>
      {errorMessage && (
        <div className="text-red-600 text-sm ml-2 -mt-1">{errorMessage}</div>
      )}

      <CameraModal 
          isOpen={showCameraModal} 
          onClose={() => setShowCameraModal(false)} 
          onCapture={handleCameraCapture} 
      />
    </div>
  );
};

FormComponent.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onImageSubmit: PropTypes.func.isRequired,
  onAudioSubmit: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
};

export default FormComponent;

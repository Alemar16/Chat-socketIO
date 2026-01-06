import { useState } from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import AudioMessage from "../AudioMessage/AudioMessage";

const ListMessageComponent = ({ messages, onDelete }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="w-full relative flex-grow flex flex-col min-h-0">
      <div className="backdrop-blur-xl bg-white/40 rounded-lg shadow-lg shadow-slate-900/60 flex flex-col h-full">
        {messages.length > 0 ? (
          <ul className="flex-1 overflow-y-auto p-3 mb-2 custom-scrollbar">
            {messages.map((message, index) => (
              <li
                key={index}
                className={`my-2 p-2 table text-sm rounded-md shadow-lg shadow-indigo-900/80 relative group ${
                  message.from === "Me"
                    ? "bg-purple-700 ml-auto"
                    : "bg-blue-400"
                }`}
                style={{
                  paddingBottom: "1.2rem",
                  minWidth: "100px",
                  borderRadius:
                    message.from === "Me"
                      ? "18px 18px 0 18px"
                      : "18px 18px 18px 0px",
                }}
              >
                {/* Contenido del mensaje */}
                <span className="text-xs text-slate-900 block font-sans font-semibold">
                  {message.from}
                </span>{" "}
                
                {message.type === 'image' ? (
                  <div className="flex flex-col">
                      <img 
                        src={message.body} 
                        alt="Shared content" 
                        className="max-w-[200px] max-h-[200px] object-cover rounded cursor-pointer hover:opacity-90 mt-1 transition-opacity mb-1"
                        onClick={() => setSelectedImage(message.body)}
                      />
                      {message.caption && (
                          <span className="text-sm font-poppins text-justify text-zinc-50 mt-1 break-words" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>
                              {message.caption}
                          </span>
                      )}
                  </div>
                ) : message.type === 'audio' ? (
                  <div className="flex flex-col mt-1 mb-1">
                      <AudioMessage src={message.body} />
                  </div>
                ) : (
                  <span
                    className="text-sm font-poppins text-justify text-zinc-50"
                    style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
                  >
                    {message.body}
                  </span>
                )}

                {/* Marca de tiempo del mensaje */}
                {message.timestamp && (
                  <span
                    className={` ${
                      message.from === "Me"
                        ? "text-zinc-300"
                        : "text-zinc-800 px-2"
                    } absolute bottom-1 right-1`}
                    style={{
                      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                      fontSize: "9px",
                    }}
                  >
                    {format(new Date(message.timestamp), "hh:mm a", {
                      timeZone: "auto",
                    })}
                  </span>
                )}
                
                {/* Delete Button for Own Messages */}
                {message.from === "Me" && onDelete && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent bubbling (e.g. if we add click to message later)
                            onDelete(message.id);
                        }}
                        className="absolute -top-2 -left-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md transform hover:scale-110"
                        title="Delete Message"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                            <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 001.5.06l.3-7.5z" clipRule="evenodd" />
                        </svg>
                    </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-2 text-sm text-gray-800 flex items-center justify-center">
            No messages yet.
          </p>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 transition-opacity duration-300"
            onClick={() => setSelectedImage(null)}
        >
            <div className="relative max-w-4xl max-h-screen">
                 <img 
                    src={selectedImage} 
                    alt="Full size" 
                    className="max-w-full max-h-[90vh] rounded shadow-2xl" 
                />
                 <button 
                    className="absolute -top-10 right-0 text-white hover:text-gray-300 text-3xl font-bold focus:outline-none"
                    onClick={() => setSelectedImage(null)}
                 >
                    &times;
                 </button>
            </div>
        </div>
      )}
    </div>
  );
};

ListMessageComponent.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      body: PropTypes.string.isRequired,
      from: PropTypes.string.isRequired,
      type: PropTypes.string,
      timestamp: PropTypes.string.isRequired,
      id: PropTypes.string, // ID is optional for old messages but should be present
      caption: PropTypes.string, // Optional caption for images
    })
  ).isRequired,
  onDelete: PropTypes.func, // Optional callback
};

export default ListMessageComponent;

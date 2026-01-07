import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import AudioMessage from "../AudioMessage/AudioMessage";
import { TrashIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";

const ListMessageComponent = ({ messages, onDelete }) => {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="w-full relative flex-grow flex flex-col min-h-0">
      <div className="backdrop-blur-xl bg-white/40 rounded-lg shadow-lg shadow-slate-900/60 flex flex-col h-full mx-2">
        {messages.length > 0 ? (
          <ul className="flex-1 overflow-y-auto p-3 mb-2 custom-scrollbar flex flex-col">
            {messages.map((message, index) => (
              <li
                key={index}
                className={`my-2 p-2 table text-sm rounded-md shadow-lg shadow-indigo-900/80 relative group first:mt-auto ${
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
                        alt={t('messages.sharedContent')} 
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
                        className="absolute top-1 right-2 text-white/70 hover:text-white transition-colors z-10 p-1"
                        title={t('messages.deleteMessage')}
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                )}
              </li>
            ))}
            <div ref={messagesEndRef} />
          </ul>
        ) : (
          <p className="p-2 text-sm text-gray-800 flex items-center justify-center">
            {t('messages.noMessages')}
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
                    alt={t('messages.fullSize')} 
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

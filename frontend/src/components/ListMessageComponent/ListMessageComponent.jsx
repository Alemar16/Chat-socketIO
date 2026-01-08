import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import AudioMessage from "../AudioMessage/AudioMessage";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";
import ReactionComponent from "../ReactionComponent/ReactionComponent";
import MessageMenuComponent from "../MessageMenuComponent/MessageMenuComponent";

const ListMessageComponent = ({ messages, onDelete, onReact, onReply, currentUser }) => {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(null);
  const messagesEndRef = useRef(null);

  const containerRef = useRef(null); // Ref for scroll container
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(true); // Track if user is at bottom
  const [activeReactionId, setActiveReactionId] = useState(null); // Track which message has open reaction picker

  
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    // Optional: Add toast notification
  };

  const handleReply = (message) => {
    if (onReply) onReply(message);
  };

  // Robust helper to detect if message is ONLY emojis (and limit to reasonable count)
  const isBigEmoji = (text) => {
    if (!text) return false;
    const trimmed = text.trim();
    if (trimmed.length === 0) return false;

    // Check if it has at least one pictorial/emoji character
    // Using \p{Extended_Pictographic} (ES2018+) covers almost all icons/emojis
    const hasEmoji = /(\p{Extended_Pictographic}|\p{Emoji_Presentation})/u.test(trimmed);
    if (!hasEmoji) return false;

    // Strip everything that IS a valid part of an emoji sequence or whitespace
    // 1. Remove Keycap sequences (Digits/Hashes + Keycap mark)
    // 2. Remove Extended Pictographics & Emoji Presentation
    // 3. Remove ZWJ & Variation Selectors
    // 4. Remove Whitespace
    const stripped = trimmed
      .replace(/[\d*#]\ufe0f?\u20e3/g, '') // Keycaps (e.g. 1️⃣)
      .replace(/(\p{Extended_Pictographic}|\p{Emoji_Presentation})/gu, '') // Emojis
      .replace(/(\u200d|\ufe0f)/g, '') // ZWJ, Variation Selectors
      .replace(/\s/g, ''); // Whitespace (spaces, tabs)

    // If anything remains (letters, punctuation, plain numbers, symbols), it's NOT a pure emoji message
    const isPure = stripped.length === 0;

    // Count visual "graphemes" roughly (codepoints) to prevent spamming giant wall of emojis
    // Allow up to ~10 visual emojis
    return isPure && Array.from(trimmed).length <= 20;
  };

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
    setUnreadCount(0); // Clear unread on manual scroll
    setShowScrollButton(false);
  };

  // Handle Scroll Event
  const handleScroll = () => {
      if (!containerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      
      // Check if user is near bottom (within 100px)
      const isBottom = scrollHeight - scrollTop - clientHeight < 100;
      setIsAtBottom(isBottom);

      if (isBottom) {
          setShowScrollButton(false);
          setUnreadCount(0);
      } else {
          setShowScrollButton(true);
      }
  };

  useEffect(() => {
    // Only auto-scroll if user WAS at bottom before new message
    if (isAtBottom) {
        scrollToBottom();
    } else {
        // Increment unread count if not at bottom and new message added
        // (Assuming simple append, count increases by 1)
        if (messages.length > 0) {
             setUnreadCount(prev => prev + 1);
        }
    }
  }, [messages, isAtBottom]); // Note: Depend on 'messages' but use 'isAtBottom' ref logic conceptually

  return (
    <div className="w-full relative flex-grow flex flex-col min-h-0">
      <div className="backdrop-blur-xl bg-white/40 rounded-lg shadow-lg shadow-slate-900/60 flex flex-col h-full mx-2">
        {messages.length > 0 ? (
          <ul 
            ref={containerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-3 mb-2 custom-scrollbar flex flex-col relative"
          >
            {messages.map((message, index) => {
              const isBig = isBigEmoji(message.body);
              const hasReactions = message.reactions && Object.keys(message.reactions).length > 0;
              const isOwnMessage = message.from === "Me" || message.from === currentUser;
              
              const bubbleClasses = isBig 
                  ? 'bg-transparent shadow-none' 
                  : (isOwnMessage ? "bg-purple-700 ml-auto" : "bg-blue-400");
              
              return (
              <li
                key={index}
                className={`mt-2 table rounded-md shadow-lg shadow-indigo-900/80 relative group first:mt-auto max-w-[85%] md:max-w-[70%] break-words p-0 ${
                  hasReactions ? "mb-10" : "mb-2"
                } ${
                  isOwnMessage && !isBig ? "ml-auto" : "" 
                } ${bubbleClasses}`}
                style={{
                  minWidth: "160px", 
                  borderRadius:
                    isOwnMessage
                      ? "6px 6px 0 6px"
                      : "6px 6px 6px 0px",
                  backgroundColor: isBig ? 'transparent' : undefined,
                  boxShadow: isBig ? 'none' : undefined,
                }}
              >
                 {/* Header for Standard Messages (User + Menu) */}
                 {!isBig && (
                    <div className="flex justify-between items-center px-3 py-1 bg-black/10 w-full" style={{
                         borderTopLeftRadius: "6px",
                         borderTopRightRadius: "6px"
                    }}>
                        <span className="text-xs text-white/90 font-bold block truncate mr-2">
                           {message.from}
                        </span>
                        <MessageMenuComponent 
                             isOwnMessage={isOwnMessage}
                             onReply={() => handleReply(message)}
                             onCopy={() => handleCopy(message.body)}
                             onReact={() => setActiveReactionId(activeReactionId === message.id ? null : message.id)}
                             onDelete={() => {
                                 if (onDelete) onDelete(message.id);
                             }}
                        />
                    </div>
                 )}

                 {/* Content Wrapper */}
                 <div className={` ${isBig ? '' : 'px-3 pb-3 pt-2'}`}>
                    
                    {/* Quoted Message (Reply) */}
                    {message.replyTo && !isBig && (
                        <div className={`rounded-md p-1 mb-2 border-l-4 cursor-pointer text-left opacity-90 hover:opacity-100 transition-opacity w-full overflow-hidden ${
                            isOwnMessage ? 'bg-black/20 border-white/50' : 'bg-white/20 border-purple-600'
                        }`}>
                           <div className={`font-bold text-[10px] leading-tight truncate ${isOwnMessage ? 'text-purple-200' : 'text-purple-700'}`}>
                               {message.replyTo.from === currentUser ? t('messages.you') : message.replyTo.from}
                           </div>
                           <div className={`text-[10px] truncate leading-tight ${isOwnMessage ? 'text-gray-100' : 'text-slate-800'}`}>
                               {message.replyTo.body}
                           </div>
                       </div>
                    )}

                    {/* Menu for Big Emoji (Absolute) */}
                    {isBig && (
                         <div className="absolute top-0 right-0 z-10">
                            <MessageMenuComponent 
                                 isOwnMessage={isOwnMessage}
                                 onReply={() => handleReply(message)}
                                 onCopy={() => handleCopy(message.body)}
                                 onReact={() => setActiveReactionId(activeReactionId === message.id ? null : message.id)}
                                 onDelete={() => {
                                     if (onDelete) onDelete(message.id);
                                 }}
                            />
                         </div>
                    )}

                    {/* Contenido del mensaje */}
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
                        className={`font-poppins text-justify ${isBig ? 'text-6xl leading-tight block text-center' : 'text-sm text-zinc-50'}`}
                        style={{ textShadow: isBig ? "none" : "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
                      >
                        {message.body}
                      </span>
                    )}

                    {/* Placeholders for Expired Content (History) */}
                    {(message.type === 'placeholder_image' || message.type === 'placeholder_audio') && (
                        <div className="flex flex-col items-start gap-2 p-2 bg-white/20 rounded-lg border border-white/10 mt-1 mb-1 max-w-[250px]">
                            <div className="flex items-center gap-2 text-zinc-200">
                                 {message.type === 'placeholder_image' ? (
                                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 opacity-80">
                                       <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                                     </svg>
                                 ) : (
                                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 opacity-80">
                                       <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.805l-1.008 3.604a2.25 2.25 0 001.374 2.789l.334.096A9.008 9.008 0 003.55 16.29a3.756 3.756 0 003.011 3.511C8.36 20.35 10.16 21 12 21c1.315 0 2.583-.332 3.715-.923a3.75 3.75 0 001.98-2.593l.335-.096a2.25 2.25 0 001.373-2.79L18.426 11c-.342-1.14-1.518-1.805-2.66-1.805H13.5V4.06zM9.59 13.565l-1.293-1.292a1 1 0 00-1.414 1.414l1.293 1.293a1 1 0 001.414-1.414z" />
                                     </svg> 
                                 )}
                                 <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                                     {t('messages.contentExpired', 'Content Expired')}
                                 </span>
                            </div>
                            <p className="text-[10px] text-zinc-300 italic leading-snug">
                                 {message.type === 'placeholder_image' 
                                    ? t('messages.imageRemoved', 'This image was removed for privacy & performance.')
                                    : t('messages.audioRemoved', 'This audio was removed for privacy & performance.')
                                 }
                            </p>
                        </div>
                    )}

                    {/* Marca de tiempo del mensaje */}
                    {message.timestamp && (
                      <span
                        className={` ${
                          isOwnMessage
                            ? "text-zinc-300"
                            : "text-zinc-800"
                        } block text-right mt-1 opacity-80`}
                        style={{
                          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
                          fontSize: "9px",
                        }}
                      >
                        {format(new Date(message.timestamp), "hh:mm a", {
                          timeZone: "auto",
                        })}
                      </span>
                    )}

                 </div>

                {/* Reactions */}
                <div className="mt-[-8px] px-2 pb-1 relative z-20">
                    <ReactionComponent 
                        messageId={message.id} 
                        reactions={message.reactions} 
                        currentUser={currentUser} 
                        onReact={onReact} 
                        isPickerOpen={activeReactionId === message.id}
                        onTogglePicker={(isOpen) => setActiveReactionId(isOpen ? message.id : null)}
                    />
                </div>
              </li>
              );
            })}
            <div ref={messagesEndRef} />
          </ul>
        ) : (
          <p className="p-2 text-sm text-gray-800 flex items-center justify-center">
            {t('messages.noMessages')}
          </p>
        )}
        
        {/* Scroll to Bottom Button (Overlay) */}
        {showScrollButton && unreadCount > 0 && (
            <button
                onClick={() => scrollToBottom(true)}
                className="absolute bottom-4 right-4 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-all animate-bounce z-20 flex items-center justify-center"
                style={{ width: '45px', height: '45px' }}
            >
                <ChevronDownIcon className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-white text-purple-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-purple-600 shadow-sm">
                        {unreadCount}
                    </span>
                )}
            </button>
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
      id: PropTypes.string, 
      caption: PropTypes.string,
      replyTo: PropTypes.shape({
          id: PropTypes.string,
          from: PropTypes.string,
          body: PropTypes.string
      })
    })
  ).isRequired,
  onDelete: PropTypes.func, 
  onReact: PropTypes.func, 
  onReply: PropTypes.func,
  currentUser: PropTypes.string, 
};

export default ListMessageComponent;

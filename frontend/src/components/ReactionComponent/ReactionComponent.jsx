import { useState, useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { FaceSmileIcon, PlusIcon } from "@heroicons/react/24/outline";
import EmojiPicker from 'emoji-picker-react';

const REACTION_OPTIONS = ["👍", "❤️", "😂", "😮", "😢", "😡"];

const ReactionComponent = ({ messageId, reactions = {}, currentUser, onReact, isPickerOpen, onTogglePicker }) => {
  const [internalShowPicker, setInternalShowPicker] = useState(false);
  const [showFullPicker, setShowFullPicker] = useState(false);
  const pickerRef = useRef(null);

  // Use external control if provided, otherwise local state
  const showPicker = isPickerOpen !== undefined ? isPickerOpen : internalShowPicker;
  
  // Wrap in useCallback to stabilize the dependency for useEffect
  const togglePicker = useCallback((val) => {
      if (onTogglePicker) {
          onTogglePicker(val);
      } else {
          setInternalShowPicker(prev => typeof val === 'boolean' ? val : !prev);
      }
  }, [onTogglePicker]);

  // Group reactions by emoji: { '👍': 3, '❤️': 1 }
  const groupedReactions = Object.values(reactions).reduce((acc, emoji) => {
    acc[emoji] = (acc[emoji] || 0) + 1;
    return acc;
  }, {});

  // Check if current user reacted
  const myReaction = reactions[currentUser];

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
        if (pickerRef.current && !pickerRef.current.contains(event.target)) {
             if (showPicker) togglePicker(false);
             setShowFullPicker(false); // Reset full picker state
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPicker, togglePicker]);

  return (
    <div className={`absolute -bottom-5 right-0 flex items-center gap-1 z-20`}>
      {/* Display Existing Reactions (Pill) */}
      {Object.keys(groupedReactions).length > 0 && (
          <div className="bg-white rounded-full shadow-md border border-gray-200 px-1.5 py-0.5 flex items-center gap-1 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => togglePicker(!showPicker)}>
              {Object.entries(groupedReactions).map(([emoji, count]) => (
                <div key={emoji} className="flex items-center text-xs">
                    <span>{emoji}</span>
                    <span className={`ml-0.5 font-bold ${reactions[currentUser] === emoji ? 'text-purple-600' : 'text-gray-500'}`}>{count > 1 ? count : ''}</span>
                </div>
              ))}
          </div>
      )}

      {/* Add Reaction Button & Picker Container */}
      <div className="relative" ref={pickerRef}>
          {/* Toggle Button - Only visible on hover or if picker open, positioned slightly offset */}
           <button
            onClick={(e) => {
                e.stopPropagation();
                togglePicker(!showPicker);
            }}
            className={`p-1 rounded-full bg-white shadow-sm border border-gray-200 transition-all transform hover:scale-110 ${
                showPicker 
                ? "opacity-100 scale-100" 
                : "opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100"
            }`}
             style={{ marginLeft: '4px' }}
            title="Add Reaction"
          >
              <FaceSmileIcon className="w-4 h-4 text-gray-500" />
          </button>

          {/* Emoji Picker Popover */}
          {showPicker && (
              <div 
                className={`absolute bottom-full right-0 mb-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/50 p-2 flex gap-1 animate-scale-in z-50 whitespace-nowrap`}
              >
                  {!showFullPicker ? (
                    <>
                        {REACTION_OPTIONS.map(emoji => (
                            <button
                                key={emoji}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onReact(messageId, emoji);
                                    togglePicker(false); // Close after reacting
                                }}
                                className={`w-9 h-9 flex items-center justify-center rounded-full text-xl hover:bg-white hover:shadow-md transition-all hover:scale-125 ${
                                    myReaction === emoji ? "bg-purple-100 ring-2 ring-purple-200" : ""
                                }`}
                            >
                                {emoji}
                            </button>
                        ))}
                        <div className="w-[1px] h-8 bg-gray-300 mx-1"></div>
                         <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowFullPicker(true);
                            }}
                            className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:bg-white hover:shadow-md transition-all hover:scale-110 hover:text-purple-600"
                        >
                            <PlusIcon className="w-5 h-5" />
                        </button>
                    </>
                  ) : (
                      <div onClick={(e) => e.stopPropagation()}>
                        <EmojiPicker 
                            onEmojiClick={(emojiData) => {
                                onReact(messageId, emojiData.emoji);
                                togglePicker(false); // Close after reacting
                                setShowFullPicker(false);
                            }}
                            autoFocusSearch={false}
                            theme="light"
                            searchDisabled={false}
                            skinTonesDisabled
                            width={300}
                            height={400}
                            previewConfig={{ showPreview: false }}
                        />
                      </div>
                  )}
              </div>
          )}
      </div>
    </div>
  );
};

ReactionComponent.propTypes = {
  messageId: PropTypes.string.isRequired,
  reactions: PropTypes.object,
  currentUser: PropTypes.string.isRequired,
  onReact: PropTypes.func.isRequired,
  isPickerOpen: PropTypes.bool,
  onTogglePicker: PropTypes.func
};

export default ReactionComponent;

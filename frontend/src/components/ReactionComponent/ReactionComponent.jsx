import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { FaceSmileIcon } from "@heroicons/react/24/outline";

const REACTION_OPTIONS = ["👍", "❤️", "😂", "😮", "😢", "😡"];

const ReactionComponent = ({ messageId, reactions = {}, currentUser, onReact }) => {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);

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
            setShowPicker(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`absolute -bottom-3 right-0 flex items-center gap-1 z-20`}>
      {/* Display Existing Reactions (Pill) */}
      {Object.keys(groupedReactions).length > 0 && (
          <div className="bg-white rounded-full shadow-md border border-gray-200 px-1.5 py-0.5 flex items-center gap-1 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setShowPicker(!showPicker)}>
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
                setShowPicker(!showPicker);
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
                className={`absolute bottom-full right-0 mb-2 bg-white/90 backdrop-blur-sm rounded-full shadow-xl border border-white/50 p-1.5 flex gap-1 animate-scale-in z-50 whitespace-nowrap`}
              >
                  {REACTION_OPTIONS.map(emoji => (
                      <button
                          key={emoji}
                          onClick={(e) => {
                              e.stopPropagation();
                              onReact(messageId, emoji);
                              setShowPicker(false);
                          }}
                          className={`w-9 h-9 flex items-center justify-center rounded-full text-xl hover:bg-white hover:shadow-md transition-all hover:scale-125 ${
                              myReaction === emoji ? "bg-purple-100 ring-2 ring-purple-200" : ""
                          }`}
                      >
                          {emoji}
                      </button>
                  ))}
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
};

export default ReactionComponent;

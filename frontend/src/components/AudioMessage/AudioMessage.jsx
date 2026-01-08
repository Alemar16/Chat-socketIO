import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { PlayIcon, PauseIcon } from "@heroicons/react/24/solid";

const AudioMessage = ({ src }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const clickX = e.nativeEvent.offsetX;
    const width = e.target.clientWidth;
    const seekTime = (clickX / width) * duration;
    audioRef.current.currentTime = seekTime;
  };
  
  const formatTime = (time) => {
      if(isNaN(time)) return "0:00";
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  return (
    <div className="flex items-center gap-3 w-64 p-2 rounded-lg bg-black/10 dark:bg-black/20 backdrop-blur-sm border border-white/10 dark:border-white/5">
      <audio ref={audioRef} src={src} />
      
      <button
        onClick={togglePlay}
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-gray-200 text-purple-600 dark:text-purple-800 hover:scale-110 transition-transform shadow-md"
      >
        {isPlaying ? (
           <PauseIcon className="w-5 h-5" />
        ) : (
          <PlayIcon className="w-5 h-5 ml-0.5" />
        )}
      </button>

      <div className="flex-grow flex flex-col gap-1">
        <div 
            className="w-full h-1.5 bg-white/30 rounded-full cursor-pointer overflow-hidden relative"
            onClick={handleSeek}
        >
          <div
            className="h-full bg-white rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] items-center text-white/90 font-mono">
             <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
             <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

AudioMessage.propTypes = {
  src: PropTypes.string.isRequired,
};

export default AudioMessage;

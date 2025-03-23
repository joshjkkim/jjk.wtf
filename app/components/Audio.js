"use client"

import { useState, useEffect, useRef } from "react";

export default function Audio({ 
  audioSrc, 
  songTitle = "Hollow Purple Theme", 
  artistName = "JJK Collection",
  coverArt = "/album-cover.jpg",
  volume = 0.5, 
  autoplay = true, 
  loop = true 
}) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Initialize audio when component mounts
  useEffect(() => {
    const audio = audioRef.current;
    
    if (audio) {
      // Set initial volume
      audio.volume = volume;
      // Set autoplay and loop attributes
      audio.loop = loop;

      // Handle audio load
      const handleCanPlayThrough = () => {
        setAudioLoaded(true);
        setDuration(audio.duration);
        if (autoplay) {
          const playPromise = audio.play();
          
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
              })
              .catch(error => {
                console.error("Audio playback failed:", error);
                setIsPlaying(false);
              });
          }
        }
      };
      
      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
        setProgress((audio.currentTime / audio.duration) * 100);
      };
      
      audio.addEventListener('canplaythrough', handleCanPlayThrough);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      
      return () => {
        audio.removeEventListener('canplaythrough', handleCanPlayThrough);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.pause();
      };
    }
  }, [audioRef, volume, autoplay, loop]);

  // Format time in MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Function to toggle play/pause
  const togglePlay = () => {
    const audio = audioRef.current;
    
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Audio playback failed:", error);
          });
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Function to toggle mute
  const toggleMute = () => {
    const audio = audioRef.current;
    
    if (audio) {
      audio.muted = !audio.muted;
      setIsMuted(!isMuted);
    }
  };

  // Function to handle seeking
  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (audio) {
      const seekPosition = (e.nativeEvent.offsetX / e.target.clientWidth) * audio.duration;
      audio.currentTime = seekPosition;
    }
  };

  // Handle user interaction to enable audio
  useEffect(() => {
    const enableAudio = () => {
      const audio = audioRef.current;
      if (audio && audioLoaded && autoplay && !isPlaying) {
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch(error => {
              console.error("Audio playback failed:", error);
            });
        }
      }
      
      // Remove event listeners after first interaction
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('touchstart', enableAudio);
      document.removeEventListener('keydown', enableAudio);
    };
    
    // Add event listeners for user interaction
    document.addEventListener('click', enableAudio);
    document.addEventListener('touchstart', enableAudio);
    document.addEventListener('keydown', enableAudio);
    
    return () => {
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('touchstart', enableAudio);
      document.removeEventListener('keydown', enableAudio);
    };
  }, [audioLoaded, autoplay, isPlaying]);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-center bg-black/60 backdrop-blur-lg rounded-lg shadow-lg border border-purple-500/30 w-64 p-4">
      <audio ref={audioRef} src={audioSrc} preload="auto" />
      
      <div className="w-full">
        <div className="flex justify-between items-center mb-2">
          <div className="text-white text-sm font-medium">Now Playing</div>
        </div>
        
        <div className="flex items-center gap-3 mb-3">
          <div className="relative w-12 h-12 rounded-md overflow-hidden bg-purple-900/50">
            <img 
              src={coverArt} 
              alt="Album cover" 
              className={`w-full h-full object-cover ${isPlaying ? 'animate-pulse-slow' : ''}`} 
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/48?text=JJK";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 to-transparent"></div>
          </div>
          
          <div className="flex-1">
            <div className="text-white text-sm font-semibold truncate">{songTitle}</div>
            <div className="text-purple-300 text-xs truncate">{artistName}</div>
          </div>
        </div>
        
        <div 
          className="h-2 bg-gray-700/50 rounded-full mb-1 cursor-pointer relative overflow-hidden"
          onClick={handleSeek}
        >
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-xs text-gray-400 mb-3">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <button
            onClick={toggleMute}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/80 hover:bg-gray-700/80 transition-colors duration-300"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="white" viewBox="0 0 16 16">
                <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="white" viewBox="0 0 16 16">
                <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/>
                <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/>
                <path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/>
              </svg>
            )}
          </button>
          
          <button
            onClick={togglePlay}
            className="w-10 h-10 flex items-center justify-center bg-purple-600 hover:bg-purple-700 rounded-full transition-all duration-300"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16">
                <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16">
                <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
              </svg>
            )}
          </button>
          
          <button
            onClick={() => {
              const audio = audioRef.current;
              if (audio) {
                audio.currentTime = 0;
                setCurrentTime(0);
                setProgress(0);
                if (!isPlaying) {
                  audio.play();
                  setIsPlaying(true);
                }
              }
            }}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/80 hover:bg-gray-700/80 transition-colors duration-300"
            aria-label="Restart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="white" viewBox="0 0 16 16">
              <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
              <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
            </svg>
          </button>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
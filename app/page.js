"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "./components/Link";
import Audio from "./components/Audio";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const handleClick = () => {
    if (url) {
      window.open("https://github.com/joshjkkim", "_blank");
    }
  };

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    const contentTimer = setTimeout(() => {
      setContentVisible(true);
    }, 3000);

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  // Handle background image load
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-black">
      
      <div className={`absolute inset-0 w-full h-full z-0 transition-opacity duration-1500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>


        <Image
          src="/hollowpurple.gif"
          alt="Cinematic background"
          fill
          className="object-cover"
          priority
          onLoadingComplete={handleImageLoad}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"></div>
      </div>

      <div 
        className={`absolute inset-0 bg-black z-40 flex flex-col items-center justify-center transition-all duration-1500 ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 sm:w-24 sm:h-24 border-t-4 border-blue-500 border-solid rounded-full animate-spin mb-6 sm:mb-8"></div>
          <div className="text-white text-2xl sm:text-3xl font-bold tracking-widest">
            <span className="inline-block animate-pulse">jjk.wtf</span>
          </div>
          <div className="mt-3 sm:mt-4 text-gray-400 text-base sm:text-lg">
            <span className="inline-block animate-pulse">Loading Experience...</span>
          </div>
        </div>
      </div>

      <div 
        className={`relative z-10 w-full min-h-screen py-8 px-4 flex flex-col items-center justify-center transition-all duration-1000 ${contentVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <h1 
          className="relative text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-10 tracking-wider overflow-hidden"
          style={{
            position: 'relative',
            display: 'inline-block'
          }}
        >
          <span onClick={handleClick}>jjk.wtf</span>
          <span 
            className="absolute inset-0 w-full"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)',
              transform: 'translateX(-100%)',
              animation: 'shine 3s infinite linear',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              zIndex: 2
            }}
          >
            ???????
          </span>
        </h1>
        <Audio 
          audioSrc="/loveparanoia.mp3" 
          songTitle="Love/Paranoia" 
          artistName="Tame Impala"
          coverArt="/currents.png"
        />
        <div className="max-h-[70vh] bg-gradient-to-br from-gray-900/90 to-gray-800/90 p-4 sm:p-6 md:p-10 rounded-xl shadow-2xl w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl flex flex-col justify-center items-center gap-4 sm:gap-6 md:gap-8 overflow-y-auto backdrop-blur-md border border-gray-700/50 animate-float-slow transition-all duration-500 hover:shadow-purple-500/20 hover:shadow-lg">

          <div className="absolute inset-0 rounded-xl bg-purple-500/5 animate-pulse-slow"></div>
          
          <Link
            name="kimjoshua.com"
            imgSrc="/pixelartstore.png"
            url="https://kimjoshua.com"
            className="transform hover:scale-105 hover:shadow-blue-400/30 hover:shadow-lg transition-all duration-300 w-full"
          />
          <Link
            name="collegeready.me"
            imgSrc="/collegeready.png"
            url="https://collegeready.me"
            className="transform hover:scale-105 hover:shadow-blue-400/30 hover:shadow-lg transition-all duration-300 w-full"
          />
          <Link
            name="ddfh"
            imgSrc="/ddfh.png"
            url="https://ddfh.org"
            className="transform hover:scale-105 hover:shadow-blue-400/30 hover:shadow-lg transition-all duration-300 w-full"
          />
          
        </div>
        
        <div className="mt-6 sm:mt-10 text-white text-sm sm:text-lg opacity-0 animate-fadeIn animation-delay-1000">
          <p className="hover:text-blue-400 transition-colors duration-300">© 2025 • Digital Experience</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 0.8; }
        }

        /* Add these animations if they're missing from your global CSS */
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.05;
          }
          50% {
            opacity: 0.1;
          }
        }
      `}</style>
    </div>
  );
}
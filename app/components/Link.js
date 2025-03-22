"use client"
import { useState } from "react";
import Image from "next/image";

export default function Link({ name, imgSrc, className, url }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = () => {
    if (url) {
      window.open(url, "_blank");
    }
  };
  
  return (
    <div 
      className={`relative w-full rounded-lg overflow-hidden shadow-md transition-all duration-300 cursor-pointer ${isHovered ? 'transform scale-[1.02] shadow-lg' : ''} ${className || ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div 
        className={`absolute inset-0 bg-gradient-to-tr from-blue-900 to-purple-900 transition-opacity duration-300 rounded-lg ${isHovered ? 'opacity-50' : 'opacity-20'}`} 
        style={{
          backgroundSize: isHovered ? '200% 200%' : '100% 100%',
          transition: 'all 0.5s ease',
        }}
      />
      
      {isHovered && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10 rounded-lg"
          style={{
            transform: 'translateX(-100%)',
            animation: 'shine 1.5s infinite',
          }}
        />
      )}
      
      <div className="relative z-10 flex flex-col sm:flex-row p-4 sm:p-6 gap-3 sm:gap-5 justify-between items-center">
        <div className="flex flex-col text-center sm:text-left w-full sm:w-auto">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 transition-all duration-300">
            {name}
          </h1>
          <p className={`text-gray-300 mt-1 sm:mt-2 text-sm sm:text-base transition-opacity duration-300 ${isHovered ? 'opacity-80' : 'opacity-0'}`}>
            Click to view project
          </p>
        </div>
        
        <div className="relative overflow-hidden rounded-lg transition-all duration-300 w-full sm:w-auto flex justify-center">
          <img
            src={imgSrc}
            alt={name}
            className={`rounded-lg object-contain max-h-[80px] sm:max-h-[100px] max-w-full sm:max-w-[200px] transition-all duration-500 ${isHovered ? 'scale-105 brightness-110' : 'scale-95'}`}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
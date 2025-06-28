 
 export default function LoadingScreen({ pos }) {
    return (
    <div className="relative w-screen h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black overflow-hidden">
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float-${i % 3} ${3 + Math.random() * 2}s ease-in-out infinite`,
            }}
          />
        ))}
        
        <div className="absolute top-20 left-0 text-6xl opacity-30 animate-pulse">
          ☁️
        </div>
        <div className="absolute top-32 right-10 text-4xl opacity-20">
          ☁️
        </div>
        <div className="absolute top-16 left-1/3 text-5xl opacity-25">
          ☁️
        </div>
      </div>

      <div
        className="helicopter absolute"
        style={{
          left: '-15%',
          top: `${pos.y - 120}px`,
          animation: 'helicopter-approach 3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
        }}
      >
        <div className="relative">
          <div className="text-7xl transform-gpu">🚁</div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-gray-400 rounded-full"
                style={{
                  left: `${(i - 4) * 8}px`,
                  animation: `wind-particle-${i} 0.5s ease-out infinite`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div
        className="absolute"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="absolute inset-0 w-20 h-20 border-4 border-green-400 rounded-full opacity-60 -translate-x-1/2 -translate-y-1/2 animate-ping" />
        <div className="absolute inset-0 w-16 h-16 border-2 border-green-300 rounded-full opacity-80 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        
        <div className="relative text-4xl animate-bounce">📍</div>
        
        <div className="absolute -top-8 -left-8 text-yellow-400 text-2xl animate-pulse">◢</div>
        <div className="absolute -top-8 -right-8 text-yellow-400 text-2xl animate-pulse">◣</div>
        <div className="absolute -bottom-8 -left-8 text-yellow-400 text-2xl animate-pulse">◥</div>
        <div className="absolute -bottom-8 -right-8 text-yellow-400 text-2xl animate-pulse">◤</div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-10">
        <div className="text-center">
          <div className="text-green-400 text-sm font-mono mb-2 opacity-80">
            MISSION BRIEFING
          </div>
          <div className="text-white text-2xl font-bold mb-4 animate-pulse">
            🎯 INSERTION POINT CONFIRMED
          </div>
          <div className="text-gray-300 text-lg typewriter">
            Touching down at coordinates... Get ready for deployment!
          </div>
          
          <div className="mt-6 w-80 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full loading-bar" />
          </div>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full bg-gradient-radial from-transparent via-transparent to-black opacity-40" />
      </div>

      <style jsx>{`
        @keyframes helicopter-approach {
          0% {
            left: -15%;
            transform: rotate(-5deg) scale(0.8);
          }
          70% {
            left: ${pos.x - 80}px;
            transform: rotate(0deg) scale(1);
          }
          85% {
            left: ${pos.x - 60}px;
            transform: rotate(2deg) scale(1.05);
          }
          100% {
            left: ${pos.x - 70}px;
            transform: rotate(0deg) scale(1);
          }
        }

        @keyframes float-0 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }

        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-180deg); }
        }

        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(90deg); }
        }

        ${[...Array(8)].map((_, i) => `
          @keyframes wind-particle-${i} {
            0% {
              opacity: 0;
              transform: translateY(0px) scale(1);
            }
            50% {
              opacity: 1;
              transform: translateY(${10 + i * 2}px) scale(0.8);
            }
            100% {
              opacity: 0;
              transform: translateY(${20 + i * 3}px) scale(0.4);
            }
          }
        `).join('')}

        .typewriter {
          overflow: hidden;
          border-right: 2px solid #4ade80;
          white-space: nowrap;
          animation: typewriter 2s steps(40, end), blink-caret 0.75s step-end infinite;
          animation-delay: 1s;
          animation-fill-mode: both;
          width: 0;
          margin: 0 auto;
        }

        @keyframes typewriter {
          from { width: 0; }
          to { width: 100%; }
        }

        @keyframes blink-caret {
          from, to { border-color: transparent; }
          50% { border-color: #4ade80; }
        }

        .loading-bar {
          animation: loading 3s ease-out forwards;
          transform: translateX(-100%);
        }

        @keyframes loading {
          to { transform: translateX(0%); }
        }

        .bg-gradient-radial {
          background: radial-gradient(circle at center, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
 }
 
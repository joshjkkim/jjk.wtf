export default function DeathScreen() {
    return (
         <div className="w-screen h-screen bg-gradient-to-br from-red-950 via-black to-gray-900 text-white flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-white rounded-full animate-ping"></div>
                <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse delay-500"></div>
                <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-gray-400 rounded-full animate-ping delay-700"></div>
              </div>
              
              <div className="relative z-10 flex flex-col items-center justify-center space-y-8 p-8">
                <div className="relative group cursor-pointer" onClick={() => window.location.reload()}>
                  <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
                  <h1 className="text-[15vw] relative z-10 transform transition-all duration-1500 ease-out hover:rotate-360 hover:scale-200 hover:drop-shadow-[0_0_20px_rgba(239,68,68,0.5)] group-hover:animate-pulse select-none">
                    💀
                  </h1>
                </div>
                
                <h2 className="text-[5vw] font-bold bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent drop-shadow-lg animate-pulse">
                  You Died!
                </h2>
        
                <div className="text-center space-y-2 max-w-md">
                  <p className="text-xl text-gray-300 animate-fade-in opacity-0 animation-delay-500">
                    Unfortunately your player has been cleared...
                  </p>
                  <p className="text-lg text-gray-400 animate-fade-in opacity-0 animation-delay-1000">
                    Click the skull to continue
                  </p>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
              
              <style jsx>{`
                @keyframes fade-in {
                  from { opacity: 0; transform: translateY(20px); }
                  to { opacity: 1; transform: translateY(0); }
                }
                
                .animate-fade-in {
                  animation: fade-in 0.8s ease-out forwards;
                }
                
                .animation-delay-500 {
                  animation-delay: 0.5s;
                }
                
                .animation-delay-1000 {
                  animation-delay: 1s;
                }
                
                .animation-delay-1500 {
                  animation-delay: 1.5s;
                }
              `}</style>
            </div>
    )
}
import React from 'react';
import { TEXTURE_MAP } from '../utils/tables';

export function InventoryModal({ inventory, onClick, isOpen, armor, onArmorClick, character }) {
  return (
    <>
      <div
        className={`fixed inset-0 bg-gradient-to-br from-black/60 via-slate-900/40 to-black/80 backdrop-blur-md z-40 transition-all duration-500 ease-out ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      <div
        className={`fixed top-1/2 left-1/2 z-50 w-[55vw] max-w-5xl h-[70vh] bg-gradient-to-br from-slate-800/90 via-slate-900/95 to-black/90 backdrop-blur-xl text-white rounded-2xl shadow-2xl border border-slate-600/30 transform transition-all duration-500 ease-out -translate-x-1/2 -translate-y-1/2 ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
        }`}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}
      >
        <div className="relative p-6 border-b border-slate-600/30">
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            🎒 Inventory
          </h2>
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
        </div>

        <div className="flex gap-8 p-6 h-[calc(100%-100px)]">
          <div className="flex-1 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-700/20 to-slate-800/20 rounded-xl border border-slate-600/20" />
            <div className="relative grid grid-cols-7 gap-3 overflow-y-auto p-4 max-h-full custom-scrollbar">
              {Array.from(inventory.entries()).map(([item, count]) => (
                <button
                  key={item}
                  onClick={() => onClick(item)}
                  className="group relative flex flex-col items-center bg-gradient-to-br from-slate-700/50 to-slate-800/80 rounded-xl p-3 border border-slate-600/30 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 hover:border-cyan-400/50 max-h-[6vw]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div
                    className="relative w-[2.2vw] h-[2.2vw] bg-cover bg-center rounded-lg shadow-md"
                    style={{ backgroundImage: `url(${TEXTURE_MAP.get(item)})` }}
                  />
                  <p className="relative mt-2 text-[0.9vw] font-medium text-gray-200 group-hover:text-white transition-colors truncate">
                    {item}
                  </p>
                  <div className="relative bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow-md">
                    ×{count}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="w-[12vw] relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-orange-900/20 to-red-900/20 rounded-xl border border-amber-600/30" />
            <div className="relative flex flex-col items-center gap-5 p-6 max-h-full overflow-y-auto">
              <div className="text-center">
                <h3 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  ⚔️ Armor
                </h3>
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent mt-2" />
              </div>
              
              {['helmet', 'plate', 'pants', 'boots'].map((slot, index) => (
                <button
                  key={slot}
                  onClick={() => onArmorClick(slot, armor[slot])}
                  className="group relative w-[4vw] h-[4vw] bg-gradient-to-br from-slate-700/60 to-slate-800/80 rounded-xl border-2 border-slate-600/40 transition-all duration-300 ease-out hover:scale-110 hover:shadow-lg hover:shadow-amber-500/30 hover:border-amber-400/60 flex items-center justify-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {armor[slot] ? (
                    <div
                      className="relative w-full h-full bg-cover bg-center rounded-lg shadow-inner"
                      style={{ backgroundImage: `url(${TEXTURE_MAP.get(armor[slot])})` }}
                    />
                  ) : (
                    <span className="relative text-xs text-gray-400 capitalize font-medium group-hover:text-gray-300 transition-colors">
                      {slot}
                    </span>
                  )}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full border border-slate-500 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function CraftingPanel({ recipes, inventory, onCraft, isOpen }) {
  return (
    <div
      className={`fixed top-1/2 left-6 z-50 w-[22vw] max-w-80 max-h-[80vh] bg-gradient-to-br from-emerald-900/90 via-teal-900/95 to-cyan-900/90 backdrop-blur-xl border border-emerald-600/30 rounded-2xl shadow-2xl transform transition-all duration-500 ease-out -translate-y-1/2 overflow-y-auto ${
        isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'
      }`}
      style={{
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      }}
    >
      <div className="relative p-6 border-b border-emerald-600/30">
        <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
          🔨 Crafting
        </h2>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
      </div>

      <div className="overflow-y-auto p-4 custom-scrollbar max-h-[calc(100%-100px)]">
        {recipes.map((recipe, i) => {
          const hasIngredients = recipe.ingredients.every(
            ({ item, quantity }) => (inventory.get(item) || 0) >= quantity
          );
          return (
            <div
              key={i}
              className={`group relative mb-6 p-4 rounded-xl border transition-all duration-300 ${
                !hasIngredients 
                  ? 'opacity-40 border-gray-600/30 bg-gray-800/20' 
                  : 'border-emerald-600/30 bg-gradient-to-br from-emerald-800/20 to-teal-800/20 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/20'
              }`}
            >
              {hasIngredients && (
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
              
              <div className="relative flex items-center gap-4 mb-4">
                <div
                  className="w-14 h-14 bg-cover bg-center rounded-xl shadow-lg border-2 border-emerald-500/30"
                  style={{ backgroundImage: `url(${TEXTURE_MAP.get(recipe.output.item)})` }}
                />
                <div>
                  <p className="text-lg font-bold text-white">
                    {recipe.output.item}
                  </p>
                  <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm px-3 py-1 rounded-full font-bold inline-block">
                    ×{recipe.output.quantity}
                  </div>
                </div>
              </div>

              <div className="relative mb-4">
                <p className="text-sm font-semibold text-emerald-300 mb-2">Required:</p>
                <div className="space-y-1">
                  {recipe.ingredients.map((ing, j) => {
                    const hasEnough = (inventory.get(ing.item) || 0) >= ing.quantity;
                    return (
                      <div key={j} className={`text-sm flex justify-between ${hasEnough ? 'text-gray-300' : 'text-red-400'}`}>
                        <span>{ing.item}</span>
                        <span className="font-mono">×{ing.quantity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => hasIngredients && onCraft(recipe)}
                disabled={!hasIngredients}
                className={`relative w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                  hasIngredients 
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg hover:shadow-emerald-500/30 hover:scale-105' 
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {hasIngredients ? '✨ Craft Item' : '❌ Missing Materials'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Hotbar({ hotbar, equipped, onHotbarClick }) {
  return (
    <div className="fixed right-4 bottom-20 lg:bottom-4 z-50">
      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/95 backdrop-blur-xl rounded-2xl p-4 border border-slate-600/30 shadow-2xl">
        <div className="flex gap-3">
          {hotbar.map((slot, index) => (
            <button
              key={index}
              onClick={() => onHotbarClick(slot, index)}
              className={`group relative w-[3.5vw] h-[3.5vw] rounded-xl transition-all duration-300 ease-out ${
                equipped === slot.item 
                  ? 'bg-gradient-to-br from-amber-500/30 to-orange-500/30 border-2 border-amber-400 shadow-lg shadow-amber-500/30 scale-110' 
                  : 'bg-gradient-to-br from-slate-700/50 to-slate-800/80 border-2 border-slate-600/30 hover:scale-105 hover:border-slate-400/50'
              } overflow-hidden`}
            >
              <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${
                equipped === slot.item 
                  ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20' 
                  : 'bg-gradient-to-br from-slate-500/10 to-slate-600/10 opacity-0 group-hover:opacity-100'
              }`} />
              
              {slot.item && (
                <>
                  <img
                    src={TEXTURE_MAP.get(slot.item)}
                    alt={slot.item}
                    className="relative w-full h-full object-contain p-1"
                  />
                  <div className="absolute bottom-1 right-1 bg-gradient-to-br from-emerald-500 to-cyan-500 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow-md border border-white/20">
                    {slot.quantity}
                  </div>
                </>
              )}
              
              <div className="absolute top-1 left-1 w-4 h-4 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full border border-slate-500 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-300">{index + 1}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function StatusBar({ label, value, max, thresholds = [0.25, 0.75], colors = ['#ef4444','#f97316','#22c55e'] }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  let bgColor = colors[0];
  let gradientColor = colors[0];
  
  if (pct > thresholds[1] * 100) {
    bgColor = colors[2];
    gradientColor = colors[2];
  } else if (pct > thresholds[0] * 100) {
    bgColor = colors[1];
    gradientColor = colors[1];
  }

  return (
    <div className="relative w-full max-w-[32vw] group">
      <div className="relative bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm h-6 rounded-full overflow-hidden border border-slate-600/30 shadow-lg">
        <div
          className="absolute top-0 left-0 h-full transition-all duration-500 ease-out rounded-full"
          style={{ 
            width: `${pct}%`, 
            background: `linear-gradient(90deg, ${bgColor}CC, ${gradientColor}FF, ${bgColor}CC)`,
            boxShadow: `0 0 10px ${bgColor}66`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse" />
        </div>
        
        <div 
          className="absolute top-0 left-0 h-full rounded-full opacity-30 animate-pulse"
          style={{ 
            width: `${pct}%`, 
            backgroundColor: gradientColor
          }}
        />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-white drop-shadow-lg">
            {label}: {Math.floor(value)}/{max}
          </span>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/10 rounded-full pointer-events-none" />
      </div>
      
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        {Math.round(pct)}% ({Math.floor(value)}/{max})
      </div>
    </div>
  );
}

const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(51, 65, 85, 0.3);
    border-radius: 4px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #06b6d4, #0891b2);
    border-radius: 4px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #0891b2, #0e7490);
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = scrollbarStyles;
  document.head.appendChild(styleSheet);
}

  export function ChestModal({
    chestInventory,
    playerInventory,
    onTake,
    onStore,
    onClose,
    isOpen
  }) {
    const entries = chestInventory instanceof Map
  ? Array.from(chestInventory.entries())
  : Object.entries(chestInventory);
    console.log("Chest Inventory:", chestInventory);
    return (
      <>
        <div
          className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={onClose}
        />

        <div
          className={`fixed top-1/2 left-1/2 z-50 w-[50vw] max-w-4xl h-[60vh]
                      bg-gradient-to-br from-slate-800/90 via-slate-900/95 to-black/90
                      backdrop-blur-lg text-white rounded-2xl shadow-2xl border border-slate-600/30
                      transform transition-all duration-500 ease-out
                      -translate-x-1/2 -translate-y-1/2 ${
                        isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
                      }`}
        >
          <div className="flex justify-between items-center p-4 border-b border-slate-600/30">
            <h3 className="text-2xl font-bold">📦 Chest</h3>
            <button onClick={onClose} className="text-xl">✖️</button>
          </div>

          <div className="flex h-[calc(100%-56px)]">

            <div className="w-1/2 p-4 overflow-y-auto border-r border-slate-600/30 custom-scrollbar">
              <h4 className="text-lg mb-2">Chest Items</h4>
              <div className="grid grid-cols-6 gap-3">
                {entries.map(([item, count]) => (
                  <button
                    key={item}
                    onClick={() => onTake(item)}
                    className="flex flex-col items-center p-2 bg-slate-700/50 rounded hover:bg-slate-700 transition"
                  >
                    <div
                      className="w-10 h-10 bg-cover bg-center mb-1"
                      style={{ backgroundImage: `url(${TEXTURE_MAP.get(item)})` }}
                    />
                    <span className="text-xs">{item}</span>
                    <span className="text-[0.6rem]">×{count}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="w-1/2 p-4 overflow-y-auto custom-scrollbar">
              <h4 className="text-lg mb-2">Your Inventory</h4>
              <div className="grid grid-cols-6 gap-3">
                {Array.from(playerInventory.entries()).map(([item, count]) => (
                  <button
                    key={item}
                    onClick={() => onStore(item)}
                    className="flex flex-col items-center p-2 bg-slate-700/50 rounded hover:bg-slate-700 transition"
                  >
                    <div
                      className="w-10 h-10 bg-cover bg-center mb-1"
                      style={{ backgroundImage: `url(${TEXTURE_MAP.get(item)})` }}
                    />
                    <span className="text-xs">{item}</span>
                    <span className="text-[0.6rem]">×{count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

export default { InventoryModal, CraftingPanel, Hotbar, StatusBar, ChestModal };
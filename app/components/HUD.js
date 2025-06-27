import React from 'react';
import { TEXTURE_MAP } from '../utils/tables';

export function InventoryModal({ inventory, onClick, isOpen, armor, onArmorClick, character }) {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ease-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />

      <div
        className={`fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-4xl h-[70vh] bg-gray-900/90 text-white rounded-xl shadow-2xl p-6 transform transition-all duration-300 ease-out -translate-x-1/2 -translate-y-1/2 ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Inventory</h2>
        <div className="flex gap-6 h-full">
          <div className="flex-1 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4 overflow-y-auto pr-4 max-h-1/3">
            {Array.from(inventory.entries()).map(([item, count]) => (
              <button
                key={item}
                onClick={() => onClick(item)}
                className="flex flex-col items-center bg-gray-800 rounded-lg p-2 hover:bg-gray-700 transition max-h-24"
              >
                <div
                  className="w-12 h-12 bg-cover bg-center"
                  style={{ backgroundImage: `url(${TEXTURE_MAP.get(item)})` }}
                />
                <p className="mt-1 text-sm truncate">{item}</p>
                <p className="text-xs text-gray-400">×{count}</p>
              </button>
            ))}
          </div>

          <div className="w-48 flex flex-col items-center gap-4 bg-gray-600 p-5 shadow-lg max-h-4/5 rounded-lg hover:scale-102 transition-all duration-200 ease-out">
            <h2 className="text-lg font-semibold">Armor</h2>
            {['helmet', 'plate', 'pants', 'boots'].map(slot => (
              <button
                key={slot}
                onClick={() => onArmorClick(slot, armor[slot])}
                className="relative w-16 h-16 bg-gray-800 rounded-lg border-2 border-gray-600 hover:border-yellow-400 transition-colors flex items-center justify-center shadow-2xl"
              >
                {armor[slot] ? (
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${TEXTURE_MAP.get(armor[slot])})` }}
                  />
                ) : (
                  <span className="text-xs text-gray-400 capitalize">{slot}</span>
                )}
              </button>
            ))}
            <span className="text-5xl shadow-lg p-3 bg-gray-800 rounded-lg">{character}</span>
          </div>
        </div>
      </div>
    </>
  );
}

export function CraftingPanel({ recipes, inventory, onCraft, isOpen }) {
  return (
    <div
      className={`fixed top-1/2 max-h-3/4 overflow-y-auto left-4 z-50 w-72 bg-gray-900/90 p-6 text-white rounded-xl shadow-2xl transform transition-all duration-300 ease-out -translate-y-1/2 ${
        isOpen ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0 pointer-events-none'
      }`}
    >
      <h2 className="text-2xl font-semibold mb-4 text-center">Crafting</h2>
      {recipes.map((recipe, i) => {
        const hasIngredients = recipe.ingredients.every(
          ({ item, quantity }) => (inventory.get(item) || 0) >= quantity
        );
        return (
          <div
            key={i}
            className={`mb-4 border-b border-gray-600 pb-2 transform transition-colors duration-200 ease-out hover:bg-white/5 ${
              !hasIngredients ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            <div
              className="w-12 h-12 bg-cover bg-center mb-2"
              style={{ backgroundImage: `url(${TEXTURE_MAP.get(recipe.output.item)})` }}
            />
            <p className="text-sm font-bold">
              {recipe.output.item} ×{recipe.output.quantity}
            </p>
            <div className="text-xs text-gray-400 mb-2">
              {recipe.ingredients.map((ing, j) => (
                <div key={j}>{ing.item} ×{ing.quantity}</div>
              ))}
            </div>
            <button
              onClick={() => hasIngredients && onCraft(recipe)}
              disabled={!hasIngredients}
              className={`w-full text-xs px-2 py-1 rounded transition-colors duration-200 ${
                hasIngredients ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-600 cursor-not-allowed'
              }`}
            >
              Craft
            </button>
          </div>
        );
      })}
    </div>
  );
}

export function Hotbar({ hotbar, equipped, onHotbarClick }) {
  return (
    <div className="fixed bottom-2 right-2 flex gap-2 z-50">
      {hotbar.map((slot, index) => (
        <button
          key={index}
          onClick={() => onHotbarClick(slot, index)}
          className={`relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 border-2 ${
            equipped === slot.item ? 'border-yellow-400' : 'border-white'
          } bg-black/40 rounded-lg overflow-hidden transition-shadow duration-200 hover:shadow-lg`}
        >
          {slot.item && (
            <img
              src={TEXTURE_MAP.get(slot.item)}
              alt={slot.item}
              className="w-full h-full object-contain"
            />
          )}
          {slot.item && (
            <span className="absolute bottom-0 right-0 bg-black/70 text-white text-[clamp(0.6rem,1vw,1rem)] px-1 rounded-tl">
              ×{slot.quantity}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export function StatusBar({ label, value, max, thresholds = [0.25, 0.75], colors = ['red','orange','limegreen'] }) {
  const pct = (value / max) * 100;
  let bg = colors[0];
  if (pct > thresholds[1]*100)       bg = colors[2];
  else if (pct > thresholds[0]*100)  bg = colors[1];

  return (
    <div className="relative w-48 sm:w-64 bg-gray-700 h-4 rounded overflow-hidden">
      <div
        className="absolute top-0 left-0 h-full transition-all duration-200"
        style={{ width: `${pct}%`, backgroundColor: bg }}
      />
      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white select-none">
        {label}: {Math.floor(value)}/{max}
      </div>
    </div>
  );
}

export default { InventoryModal, CraftingPanel, Hotbar, StatusBar };

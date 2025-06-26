'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import GameItem from '../components/gameitem';
import CollectItem from '../components/CollectItem';
import PlaceItem from '../components/PlaceItem';

import { BIOME_TYPES, BIOME_ENEMIES, ENEMY_STATS, TOOL_EFFECTIVENESS, LOOT_TABLE, CRAFTING_RECIPES,
   CONSUMABLES, STATION_LEVELS, BIOME_SPAWN_TABLE, TYPE_STATS, TEXTURE_MAP, VIEW_DIST, CHUNK_UNLOAD_RADIUS
} from '../utils/tables.js'

import useMovement from '../hooks/useMovement';
import useAttack from '../hooks/useAttack';
import useAction from '../hooks/useAction';
import playerInventory from '../utils/inventory';
import playerCrafting from '../utils/crafting';
import worldChunks from '../utils/chunks';
import worldEnemies from '../utils/enemies';


export default function GamePage() {
  const router = useRouter();

  const frameRef = useRef(0);

  const [pos, setPos] = useState({ x: 300, y: 300 });
  const posRef = useRef(pos);

  const currentChunkRef = useRef({ x: 0, y: 0 });

  const chunkBiomes = useRef(new Map());

  const facingRef = useRef(null)

  const [enemies, setEnemies] = useState([])
  const enemiesRef = useRef(enemies)

   useEffect(() => {
    enemiesRef.current = enemies;
  }, [enemies])

  const [items, setItems] = useState([]);
  const itemsRef = useRef(items);

  const [equipped, setEquipped] = useState("hands")
  const equippedRef = useRef(equipped)

  const [selectedItem, setSelectedItem] = useState(null);

  const keys = useRef({});
  const [stamina, setStamina] = useState(1000);
  const staminaRef = useRef(stamina);

  const [character, changeCharacter] = useState("😀");
  const characterRef = useRef(character);

  const loadedChunks = useRef(new Set()) 

  const [CHUNK_SIZE, setChunkSize] = useState(() => {
    if (typeof window === 'undefined') return 500;
    return Math.max(window.innerWidth, window.innerHeight);
  });

  const chunkTiles = useRef(new Map());

  const [isLoaded, setIsLoaded] = useState(false)
  const isDeadRef = useRef(false)

  const [collectItems, setCollectItems] = useState([]);

  const [placedItems, setPlacedItems] = useState([]);

  const placedItemsRef = useRef([]);
    useEffect(() => {
      placedItemsRef.current = placedItems;
    }, [placedItems]);

  const collectItemsRef = useRef([]);
    useEffect(() => {
      collectItemsRef.current = collectItems;
    }, [collectItems]);

    useEffect(() => {
      posRef.current = pos;
    }, [pos]);

    useEffect(() => {
      itemsRef.current = items;
    }, [items]);

  const visibleItems = items.filter(item => {
  const dx = item.x - pos.x;
  const dy = item.y - pos.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  return dist < CHUNK_SIZE * VIEW_DIST
});

  const visibleCollectables = collectItems.filter(item => {
  const dx = item.x - pos.x;
  const dy = item.y - pos.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  return dist < CHUNK_SIZE * VIEW_DIST
});

const visiblePlaceables = placedItems.filter(item => {
  const dx = item.x - pos.x;
  const dy = item.y - pos.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  return dist < CHUNK_SIZE * VIEW_DIST
});

  useEffect(() => {
    characterRef.current = character;
  }, [character]);
  
  useEffect(() => {
    equippedRef.current = equipped;
  }, [equipped]);

  useEffect(() => {
    staminaRef.current = stamina;
  }, [stamina]);


  const maxHealthRef = useRef(100);
  const healthRef = useRef(100);

  const [inventory, setInventory] = useState(new Map());
  const inventoryRef = useRef(inventory)
  useEffect(() => {
    inventoryRef.current = inventory;
    console.log(inventoryRef.current, inventory)
  }, [inventory])

  const [showInventory, setShowInventory] = useState(false);

  const [hotbar, setHotbar] = useState(
    Array(9).fill(null).map(() => ({ item: null, quantity: 0 }))
  );

  const hotbarRef = useRef(hotbar)
  useEffect(() => {
    hotbarRef.current = hotbar;
  }, [hotbar])

   useEffect(() => {
    const ensureSession = async () => {
      const res = await fetch('/api/session')
      if (!res.ok) router.push('/login')
    }

    const loadGame = async () => {
      try {
        const res = await fetch('/api/load', { method: 'GET' })
        if (!res.ok) throw new Error('Failed to load')
        const {
          inventory,
          hotbar,
          health,
          maxHealth,
          stamina,

        } = await res.json()

        healthRef.current = health
        maxHealthRef.current = maxHealth

        setHotbar(hotbar)
        hotbarRef.current = hotbar
        setInventory(new Map(inventory))
        setStamina(stamina)
        staminaRef.current = stamina;

      } catch (err) {
        console.error(err)
      } finally {
        setIsLoaded(true)
      }
    }

    ensureSession().then(loadGame)
  }, [])

const { getAvailableCrafts, craftItem } = playerCrafting({ 
  placedItemsRef, posRef, inventory, setInventory
})

const { addToInventory, handleInventoryClick, handleHotbarClick } = playerInventory({ 
  inventory, hotbar, setHotbar, setInventory, selectedItem, setSelectedItem, setEquipped 
})

const { getChunkBiome, spawnChunk, unloadDistantChunks, dropLoot, processItemSet } = worldChunks({
  chunkBiomes, CHUNK_SIZE, loadedChunks, setItems, setPlacedItems, setCollectItems, equippedRef, posRef, enemiesRef, itemsRef, chunkTiles
})

const { handleEnemyMovement, handleEnemyAttacks, processEntitySet } = worldEnemies({
  itemsRef, placedItemsRef, posRef, enemiesRef, healthRef, dropLoot, setCollectItems, equippedRef, setItems, setPlacedItems
})

const { handleMovement, handleStamina, checkForDeath } = useMovement({
  keys, staminaRef, posRef, facingRef, itemsRef, placedItemsRef, currentChunkRef, spawnChunk, unloadDistantChunks, CHUNK_SIZE, healthRef, maxHealthRef, isDeadRef, setInventory, setHotbar, setStamina
})
const { handleBasicAttack, handleStrongAttack, hasBasic, hasStrong } = useAttack({
  keys, staminaRef, itemsRef, placedItemsRef, enemiesRef, setItems, setPlacedItems, processEntitySet, processItemSet, changeCharacter
})
const { consumeItem, pickupLoop, pickupPressed, saveAndRestart } = useAction({
  equippedRef, hotbarRef, setStamina, posRef, facingRef, setPlacedItems, setEquipped, setHotbar, keys, collectItemsRef, addToInventory, setCollectItems, inventoryRef, healthRef, maxHealthRef, staminaRef
})

  useEffect(() => {
  const handleKeyDown = (e) => {
    const key = e.key.toLowerCase();
      keys.current[key] = true;

      if (key >= '1' && key <= '9') {
        const index = parseInt(key) - 1;
        const selected = hotbarRef.current[index];
        if (selected?.item) {
          setEquipped(selected.item);
        } else {
          setEquipped("hands");
        }
        changeCharacter("😀");
      }

      if (key === 'g') {
        setShowInventory((prev) => prev = !prev)
      }

      if (key === 'r') {
        consumeItem();
      }

      if (key === 'p') {
        saveAndRestart();
      }
    };

    const handleKeyUp = (e) => {
      keys.current[e.key.toLowerCase()] = false;

      if (e.key.toLowerCase() === 'y') {
        pickupPressed.current = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let raf;
    function loop(ts = 0) {
      handleMovement();
      
      handleBasicAttack();
      handleStrongAttack();
      pickupLoop();

      handleEnemyMovement(ts);
      handleEnemyAttacks(ts);

      if (++frameRef.current >= 4) {
        handleStamina();
        checkForDeath();
        setPos({ ...posRef.current });
        setStamina(staminaRef.current);
        setItems([...itemsRef.current]);
        setPlacedItems([...placedItemsRef.current]);
        setCollectItems([...collectItemsRef.current]);
        setEnemies([...enemiesRef.current]);

        frameRef.current = 0;
      }

      raf = requestAnimationFrame(loop);
    }
    spawnChunk(0, 0, 0);
    raf = requestAnimationFrame(loop);

    setTimeout(() => {
    setIsLoaded(true);
    }, 1000);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!isLoaded) {
  return (
    <div className="w-screen h-screen bg-black text-white flex items-center justify-center">
      Refresh the browser to enter a new world!
    </div>
  );
}

if (isDeadRef.current) {
  return (
    <div className="w-screen h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-[250px] hover:rotate-360 hover:scale-200 transition-all duration-1000 ease-in-out" onClick={() => window.location.reload()}>💀</h1>
      <h2 className="text-[70px]">You died!</h2>
      <p>Unfortunately your progress has been cleared...</p>
      <p>Click the skull to continue</p>
    </div>
  );
}

const offsetDistance = 30;
const baseX = pos.x;
const baseY = pos.y;

let offsetX = baseX;
let offsetY = baseY;
switch (facingRef.current) {
  case 'right':
    offsetX += offsetDistance;
    break;
  case 'left':
    offsetX -= offsetDistance;
    break;
  case 'up':
    offsetY -= offsetDistance;
    break;
  case 'down':
    offsetY += offsetDistance;
    break;
  default:
    offsetX += offsetDistance; // fallback
}

  return (
  <div className="relative w-screen h-screen overflow">
    <div className="fixed bottom-0 left-0 w-full bg-black/70 text-white p-2 flex flex-col items-center z-50 gap-3">
      <div className="flex gap-4 items-center">
        
        <button
          onClick={() => setShowInventory((prev) => !prev)}
          className="bg-green-700 hover:bg-green-600 px-2 py-1 rounded text-xs"
        >
          {showInventory ? 'Close Inventory' : 'Open Inventory'}
        </button>
      </div>

      <div className="fixed bottom-2 right-2 flex gap-2 z-50">
        {hotbar.map((slot, index) => (
          <div
            key={index}
            onClick={() => {handleHotbarClick(slot, index)}}
            className={`relative w-10 h-10 border ${
              equipped === slot.item ? 'border-yellow-400' : 'border-white'
            } bg-black/40 rounded`}
          >
            {slot.item && (
              <>
                <img
                  src={TEXTURE_MAP.get(slot.item)}
                  className="w-full h-full object-contain"
                  alt={slot.item}
                />
                <div className="absolute bottom-0 right-0 bg-black/70 text-white text-[10px] px-1 rounded">
                  ×{slot.quantity}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

<div className="w-1/4 h-4 bg-gray-700 rounded justify-center items-center flex flex-row gap-3">
<span className="font-bold p-2">Stamina: </span>
<p className="p-1">{Math.floor(staminaRef.current) / 10}/100 </p>
  <div
    className="h-full rounded transition-all duration-200"
    style={{
      width: `${(staminaRef.current / 1000) * 100}%`,
      backgroundColor:
        staminaRef.current > 1000 * 0.75
          ? 'white'
          : staminaRef.current > 1000 * 0.25
          ? 'orange'
          : 'red',
    }}
  />
</div>

<div className="w-1/4 h-4 bg-gray-700 rounded justify-center items-center flex flex-row gap-3">
<span className="font-bold p-2">Health: </span>
<p className="p-1">{Math.floor(healthRef.current)}/{maxHealthRef.current} </p>
  <div
    className="h-full rounded transition-all duration-200"
    style={{
      width: `${(healthRef.current / maxHealthRef.current) * 100}%`,
      backgroundColor:
        healthRef.current > maxHealthRef.current * 0.5
          ? 'limegreen'
          : healthRef.current > maxHealthRef.current * 0.25
          ? 'orange'
          : 'red',
    }}
  />
</div>
    </div>

      {showInventory && (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-64 bg-black/80 text-white rounded shadow-lg z-50 p-4 overflow-y-auto">
        <h2 className="text-lg mb-4 text-center">Inventory</h2>
        <div className="grid grid-cols-3 gap-4">
          {Array.from(inventory.entries()).map(([item, count]) => (
            <div key={item} className="flex flex-col items-center">
              <div
                className="w-10 h-10 bg-cover bg-center"
                style={{ backgroundImage: `url(${TEXTURE_MAP.get(item)})` }}
                onClick={() => handleInventoryClick(item)}
              />
              <p className="text-sm">{item}</p>
              <p className="text-xs text-gray-400">×{count}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    {showInventory && (
      <div className="fixed top-1/2 left-4 transform -translate-y-1/2 bg-black/80 p-4 text-white rounded w-64 z-50">
        <h2 className="text-lg mb-4 text-center">Crafting</h2>
        {getAvailableCrafts().map((recipe, index) => (
          <div key={index} className="mb-2 border-b border-white pb-2">
            <p className="text-sm font-bold">{recipe.output.item} ×{recipe.output.quantity}</p>
            <div className="text-xs text-gray-300">
              {recipe.ingredients.map((ing, i) => (
                <div key={i}>{ing.item} ×{ing.quantity}</div>
              ))}
            </div>
            <button
              onClick={() => craftItem(recipe)}
              className="mt-1 text-xs bg-green-600 px-2 py-1 rounded"
            >
              Craft
            </button>
          </div>
        ))}
      </div>
    )}

     {Array.from(chunkTiles.current.entries()).map(([key, tile]) => {
      const [cx, cy] = key.split(',').map(Number);
      return (
        <div
          key={key}
          className="absolute"
          style={{
            left:            `${cx * CHUNK_SIZE}px`,
            top:             `${cy * CHUNK_SIZE}px`,
            width:           `${CHUNK_SIZE}px`,
            height:          `${CHUNK_SIZE}px`,
            backgroundImage: `url('${tile}')`,
            backgroundRepeat:'repeat',
            backgroundSize:  '128px 128px',
            zIndex:          0,
          }}
        />
      );
    })}

    <div
     
    >
      {hasBasic.current && (
        <div
          className="absolute w-[120px] h-[120px] bg-transparent rounded-full pointer-events-none"
          style={{
            backgroundImage: `url('/yellowlensflare.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            left:   `${offsetX}px`,
            top:    `${offsetY}px`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}

      {hasStrong.current && (
        <div
          className="absolute w-[250px] h-[250px] bg-transparent rounded-full pointer-events-none"
          style={{
            backgroundImage: `url('/yellowlensflare.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            left:   `${offsetX}px`,
            top:    `${offsetY}px`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}

      <div
        className={`rounded-full bg-black/20 transition-all duration-300 ease-out ${hasBasic.current && "scale-110"} ${hasStrong.current && "scale-110"}`}
        style={{
          position: 'absolute',
          width: '50px',
          height: '50px',
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          pointerEvents: 'none',
        }}
      >
        {character}
      </div>
      <div
      className={`transition-all duration-100 ease-out ${hasBasic.current && "scale-14sds0"} ${hasStrong.current && "scale-180"}`}
      style={{
        position: 'absolute',
        width: '30px',
        height: '30px',
        backgroundImage: `url(${TEXTURE_MAP.get(equippedRef.current)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '50%',
        left:   `${offsetX}px`,
        top:    `${offsetY}px`,
        transform: 'translate(-50%, -50%)',
      }}
    />

      {visibleItems.map((item) => (
        <GameItem
          key={item.id}
          id={item.id}
          x={item.x}
          y={item.y}
          size={item.size}
          type={item.type}
          image={item.image}
          playerPos={pos}
          health={item.health}
          maxHealth={item.maxHealth}
        />
      ))}

      {visibleCollectables.map((drop) => (
        <CollectItem
          key={drop.id}
          x={drop.x}
          y={drop.y}
          itemType={drop.type}
        />
      ))}

      {visiblePlaceables.map((item) => (
        <PlaceItem
          key={item.id}
          id={item.id}
          x={item.x}
          y={item.y}
          health={item.health}
          maxHealth={item.maxHealth}
          type={item.type}
          playerPos={pos}
        />
      ))}

      {enemies.map(en => (
  <GameItem
    key={en.id}
    id={en.id}
    x={en.x}
    y={en.y}
    size={en.size}
    type={en.type}
    health={en.health}
    maxHealth={en.maxHealth}
    playerPos={pos}
  />
))}
    </div>
  </div>
);

}

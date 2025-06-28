'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import GameItem from '../components/gameitem';
import CollectItem from '../components/CollectItem';
import PlaceItem from '../components/PlaceItem';

import { ARMOR_STATS, TEXTURE_MAP, VIEW_DIST
} from '../utils/tables.js'

import useMovement from '../hooks/useMovement';
import useAttack from '../hooks/useAttack';
import useAction from '../hooks/useAction';
import playerInventory from '../utils/inventory';
import playerCrafting from '../utils/crafting';
import worldChunks from '../utils/chunks';
import worldEnemies from '../utils/enemies';
import { InventoryModal, CraftingPanel, Hotbar, StatusBar } from '../components/HUD';
import LoadingScreen from '../components/loading';


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

  const [alert, setAlert] = useState("")

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

  const [armor, setArmor] = useState({
    helmet: null,
    plate:  null,
    pants:  null,
    boots:  null,
  })

  const armorRef = useRef(armor)
  useEffect(() => {
    armorRef.current = armor;
  }, [armor])


  const armorBonus = useMemo(() => {
  return Object.values(armor).reduce((sum, itemName) => {
    return sum + (ARMOR_STATS[itemName]?.bonusHealth || 0)
  }, 0)
}, [armor])

  const baseHealth = 100;
  const maxHealthRef = useRef(baseHealth + armorBonus);
  useEffect(() => {
  maxHealthRef.current = baseHealth + armorBonus
}, [armorBonus])
  const healthRef = useRef(100);

  const [inventory, setInventory] = useState(new Map());
  const inventoryRef = useRef(inventory)
  useEffect(() => {
    inventoryRef.current = inventory;
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
          armor

        } = await res.json()

        healthRef.current = health
        maxHealthRef.current = maxHealth

        setHotbar(hotbar)
        hotbarRef.current = hotbar
        setInventory(new Map(inventory))
        setStamina(stamina)
        staminaRef.current = stamina;
        setArmor(armor)

        const result = await fetch('/api/home/load', { method: 'GET'})
        const { home } = await result.json()

        setPlacedItems(home);
        placedItemsRef.current= home;

      } catch (err) {
        console.error(err)
      }
    }

    ensureSession().then(loadGame)
    setTimeout(() => {
        setIsLoaded(true);
    }, 5000);
  }, [])

const { getAvailableCrafts, craftItem } = playerCrafting({ 
  placedItemsRef, posRef, inventory, setInventory
})

const { addToInventory, handleInventoryClick, handleHotbarClick, handleArmorClick } = playerInventory({ 
  inventory, hotbar, setHotbar, setInventory, selectedItem, setSelectedItem, setEquipped, setArmor, inventory
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
  equippedRef, hotbarRef, setStamina, posRef, facingRef, setPlacedItems, setEquipped, setHotbar, keys, collectItemsRef, addToInventory, setCollectItems, inventoryRef, healthRef, maxHealthRef, staminaRef, setAlert, armorRef
})

  useEffect(() => {
        const saveHome = async () => {
        const payload = {
        placedItems:    placedItemsRef.current,
        }

        try {
        const res = await fetch('/api/home/save', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(payload),
        })
        if (!res.ok) {
            throw new Error(`Save failed: ${res.status}`)
        }
        await res.json()
        } catch (e) {
        console.error(e)
        setAlert("Save failed. Check console.")
        }
    }

  const handleKeyDown = async (e) => {
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
        await saveHome();
        saveAndRestart("Pickup", "/world");
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

      if (++frameRef.current >= 4) {
        handleStamina();
        checkForDeath();
        setPos({ ...posRef.current });
        setStamina(staminaRef.current);
        setPlacedItems([...placedItemsRef.current]);
        setCollectItems([...collectItemsRef.current]);

        frameRef.current = 0;
      }

      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!isLoaded) {
  return (
    <LoadingScreen pos={pos}ds/>
  );
}

if (isDeadRef.current) {
  return (
    <div className="w-screen h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-[15vw] hover:rotate-360 hover:scale-200 transition-all duration-1000 ease-in-out" onClick={() => window.location.reload()}>💀</h1>
      <h2 className="text-[5vw]">You died!</h2>
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
    offsetX += offsetDistance;
}

  return (
  <div className="relative w-screen h-screen overflow-hidden">
     <div className="fixed inset-0 z-50 pointer-events-none">

    <div className="w-1/3 bg-gradient-to-br from-slate-800/90 to-slate-900/95 backdrop-blur-xl rounded-2xl p-4 border border-slate-600/30 shadow-2xl space-y-3 pointer-events-auto">
      <StatusBar 
            label="Health" 
            value={healthRef.current} 
            max={maxHealthRef.current} 
            thresholds={[.25,.5]} 
            colors={['#ef4444','#f97316','#22c55e']} 
          />
          <StatusBar 
            label="Stamina" 
            value={stamina/10} 
            max={100} 
            thresholds={[.25,.75]} 
            colors={['#ef4444','#f97316','#6b7280']} 
          />
    </div>
          



      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        <button
          onClick={() => setShowInventory((prev) => !prev)}
          className="group relative px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-2xl font-bold text-white transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/30 backdrop-blur-xl border border-emerald-600/30"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative flex items-center gap-2">
            <span className="text-xl">🎒</span>
            {showInventory ? 'Close Inventory' : 'Open Inventory'}
          </span>
        </button>
      </div>

      <div className="absolute left-1/2 bottom-2 transform pointer-events-auto">
        <Hotbar
          hotbar={hotbarRef.current}
          equipped={equippedRef.current}
          onHotbarClick={handleHotbarClick}
        />
      </div>
    </div>

    <InventoryModal
        inventory={inventory}
        onClick={handleInventoryClick}
        isOpen={showInventory}
        armor={armor}
        onArmorClick={handleArmorClick}
        character={character}

      />

      <CraftingPanel
        recipes={getAvailableCrafts()}
        inventory={inventoryRef.current}
        onCraft={craftItem}
        isOpen={showInventory}
      />

    {alert && (
        <div className="fixed top-8 inset-x-0 mx-auto w-11/12 max-w-md bg-red-800/90 text-white font-mono rounded-lg shadow-lg z-50 animate-slide-down">
          <div className="px-4 py-2 flex items-center justify-center space-x-2">
            <span className="text-2xl">⚠️</span>
            <h1 className="text-lg">{alert}</h1>
          </div>
        </div>
      )}

      {/* Keyframes for slide-down */}
      <style jsx>{`
        @keyframes slide-down {
          from { transform: translateY(-100%); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
        .animate-slide-down {
          animation: slide-down 0.4s ease-out;
        }
      `}</style>

     {Array.from(chunkTiles.current.entries()).map(([key, tile]) => {
      const [cx, cy] = key.split(',').map(Number);
      return (
        <div
          key={key}
          className="absolute transition-opacity duration-500"
          style={{
            left: `${cx * CHUNK_SIZE}px`,
            top: `${cy * CHUNK_SIZE}px`,
            width: `${CHUNK_SIZE}px`,
            height: `${CHUNK_SIZE}px`,
            backgroundImage: `url('${tile}')`,
            backgroundRepeat:'repeat',
            backgroundSize:  '128px 128px',
            opacity: 0.8,
          }}
        />
      );
    })}
    <div
          className="absolute w-screen h-screen"
          style={{
            backgroundImage: `url('/grass1.png')`,
            backgroundRepeat:'repeat',
            backgroundSize:  '128px 128px',
            zIndex:          0,
          }}
    />

    <div>
      {hasBasic.current && (
        <div
          className="absolute w-[5vw] h-[5vw] bg-transparent rounded-full pointer-events-none"
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
          className="absolute w-[10vw] h-[10vw] bg-transparent rounded-full pointer-events-none"
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
          fontSize: '1.7vw',
          pointerEvents: 'none',
        }}
      >
        {character}
      </div>
      <div
      className={`transition-all duration-100 ease-out ${hasBasic.current && "scale-140 rotate-90"} ${hasStrong.current && "scale-180"}`}
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

    </div>
  </div>
);

}

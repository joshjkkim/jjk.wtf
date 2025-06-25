'use client';

import { useEffect, useRef, useState } from 'react';
import GameItem from '../components/gameitem';
import CollectItem from '../components/CollectItem';
import PlaceItem from '../components/PlaceItem';


const BIOME_TYPES = [
  { name: 'forest', weight: 5, gradient: 'from-green-800 via-green-900 to-green-700' },
  { name: 'desert', weight: 2, gradient: 'from-yellow-600 via-orange-800 to-yellow-400' },
  // { name: 'snow',   weight: 1, gradient: 'from-blue-300 via-white to-blue-200' },
];

const TOOL_EFFECTIVENESS = new Map([
  ['stone pickaxe', new Map([
    ['stone', 2],
    ['tree', 0.2],
    ['bush', 0.1],
    ['wood', 2],
    ['workbench', 2],
    ['rock', 6],
    ['cactus', 3],
    ['dead bush', 2],
  ])],
  ['stone axe', new Map([
    ['tree', 2],
    ['bush', 1],
    ['stone', 0.3],
    ['wood', 3],
    ['workbench', 3],
    ['rock', 3],
    ['cactus', 4],
    ['dead bush', 2],
  ])],
   ['stick', new Map([
    ['tree', 0.5],
    ['bush', 1],
    ['stone', 0.2],
    ['wood', 2],
    ['workbench', 2],
    ['rock', 1],
    ['cactus', 2],
    ['dead bush', 1.3],
  ])],
  ['hands', new Map([
    ['bush', 0.3],
    ['stone', 0.05],
    ['tree', 0.05],
    ['wood', 0.5],
    ['rock', 0],
    ['workbench', 0.5],
    ['cactus', 0.5],
    ['dead bush', 0.8],
  ])],
]);

const LOOT_TABLE = new Map([
  ['tree', [
    { item: 'wood', chance: 1.0, min: 2, max: 4 },
    { item: 'leaf', chance: 0.5, min: 1, max: 2 },
    { item: 'apple', chance: 0.7, min: 1, max: 2 },
  ]],
  ['stone', [
    { item: 'rock', chance: 1.0, min: 1, max: 2 },
    { item: 'coal', chance: 0.2, min: 1, max: 1 }
  ]],
  ['bush', [
    { item: 'berry', chance: 0.7, min: 2, max: 3 },
    { item: 'wood', chance: 0.9, min: 1, max: 1 },
  ]],
  ['wood', [
    { item: 'wood', chance: 1, min: 1, max: 1 },
  ]],
  ['rock', [
    { item: 'rock', chance: 1, min: 1, max: 1 },
  ]],
  ['workbench', [
    { item: 'workbench', chance: 1, min: 1, max: 1 },
  ]],
  ['dead bush', [
    { item: 'wood', chance: 0.8, min: 1, max: 2 },
    { item: 'nut', chance: 0.8, min: 1, max: 2 },
  ]],
  ['cactus', [
    { item: 'wood', chance: 0.9, min: 2, max: 4 },
    { item: 'thorn', chance: 0.5, min: 1, max: 2 },
    { item: 'prickly pear', chance: 0.7, min: 1, max: 2 },
  ]],
]);

const CRAFTING_RECIPES = [
  {
    output: { item: 'stick', quantity: 1 },
    ingredients: [
      { item: 'wood', quantity: 2 },
    ],
    level: 0,
  },
  {
    output: { item: 'workbench', quantity: 1 },
    ingredients: [
      { item: 'wood', quantity: 2 },
      { item: 'stick', quantity: 2 },
    ],
    level: 0,
  },
  {
    output: { item: 'stone axe', quantity: 1 },
    ingredients: [
      { item: 'wood', quantity: 3 },
      { item: 'rock', quantity: 1 },
    ],
    level: 1,
  },
  {
    output: { item: 'stone pickaxe', quantity: 1 },
    ingredients: [
      { item: 'wood', quantity: 2 },
      { item: 'rock', quantity: 3 },
    ],
    level: 1,
  },
];

const CONSUMABLES = [
  { item: 'berry', ability: 'STAMINA', amount: 100 },
  { item: 'nut', ability: 'STAMINA', amount: 100 },
  { item: 'apple', ability: 'STAMINA', amount: 250 },
  { item: 'prickly pear', ability: 'STAMINA', amount: 250 },
  { item: 'wood', ability: 'PLACEABLE', amount: 10 },
  { item: 'rock', ability: 'PLACEABLE', amount: 25 },
  { item: 'workbench', ability: 'PLACEABLE', amount: 10 },
]

const STATION_LEVELS = new Map([
  ['workbench', 1],
  ['furnace', 2],
  ['anvil', 3],
]);

const BIOME_SPAWN_TABLE = {
  forest: [
    { type: 'bush', weight: 5 },
    { type: 'stone', weight: 3 },
    { type: 'tree', weight: 2 },
  ],
  desert: [
    { type: 'dead bush', weight: 6 },
    { type: 'cactus', weight: 4 },
    { type: 'stone',   weight: 2 }
  ],
  snow: [
    { type: 'ice',      weight: 3 },
    { type: 'snowBush', weight: 2 }
  ],
};

const TYPE_STATS = new Map([
  ['tree',   { size: 130, healthRange: [5, 14] }],
  ['stone',  { size: 40,  healthRange: [3, 7] }],
  ['cactus',   { size: 80,  healthRange: [6, 12] }],
  ['bush',   { size: 30,  healthRange: [1, 3] }],
  ['dead bush',   { size: 50,  healthRange: [1, 2] }],
]);

const TEXTURE_MAP = new Map([
  ['hands', '/fist.png'],
  ['stone pickaxe', '/pickaxe.png'],
  ['stone axe', '/axe.png'],
  ['wood', '/wood.png'],
  ['berry', '/berry.png'],
  ['coal', '/coal.png'],
  ['apple', '/apple.png'],
  ['rock', '/stone.png'],
  ['leaf', '/leaf.png'],
  ['stick', '/stick.png'],
  ['workbench', '/workbench.png'],
  ['nut', '/nut.png'],
  ['thorn', '/thorn.png'],
  ['prickly pear', '/pricklypear.png'],
]);

const VIEW_DIST = 0.45

export default function GamePage() {
  const [pos, setPos] = useState({ x: 300, y: 300 });
  const posRef = useRef(pos);

  const currentChunkRef = useRef({ x: 0, y: 0 });

  const chunkBiomes = useRef(new Map());

  const facingRef = useRef(null)

  const [inventory, setInventory] = useState(new Map());
  const [showInventory, setShowInventory] = useState(false);

  const [items, setItems] = useState([]);
  const itemsRef = useRef(items);

  const [equipped, setEquipped] = useState("hands")
  const equippedRef = useRef(equipped)

  const [selectedItem, setSelectedItem] = useState(null);
  const [hotbar, setHotbar] = useState(
    Array(9).fill(null).map(() => ({ item: null, quantity: 0 }))
  );

  const hotbarRef = useRef(hotbar)

  useEffect(() => {
    hotbarRef.current = hotbar;
  }, [hotbar])


  const keys = useRef({});
  const [stamina, setStamina] = useState(1000);
  const staminaRef = useRef(stamina);

  const basicPressed = useRef(false);
    const strongPressed = useRef(false);
    const pickupPressed = useRef(false);

  const [character, changeCharacter] = useState("😀");
  const characterRef = useRef(character);
  const hasBasic = useRef(false);
  const hasStrong = useRef(false);

  const loadedChunks = useRef(new Set()) 

  const [CHUNK_SIZE, setChunkSize] = useState(() => {
    if (typeof window === 'undefined') return 500;
    return Math.max(window.innerWidth, window.innerHeight);
  });

  const [isLoaded, setIsLoaded] = useState(false)

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

  const dropLoot = (type, x, y) => {
    const drops = LOOT_TABLE.get(type);
    if (!drops) return [];

    return drops.flatMap(({ item, chance, min, max }) => {
      if (Math.random() > chance) return [];

      const amount = Math.floor(Math.random() * (max - min + 1)) + min;

      return Array.from({ length: amount }, () => ({
        id: crypto.randomUUID(),
        type: item,
        x: x + Math.random() * 20,
        y: y + Math.random() * 20,
      }));
    });
  };

  function getChunkBiome(cx, cy) {
    const key = `${cx},${cy}`;
    if (chunkBiomes.current.has(key)) return chunkBiomes.current.get(key);
    let r = Math.random() * BIOME_TYPES.reduce((s, b) => s + b.weight, 0);
    for (const b of BIOME_TYPES) {
      if (r < b.weight) { chunkBiomes.current.set(key, b); return b; }
      r -= b.weight;
    }
    const fallback = BIOME_TYPES[0];
    chunkBiomes.current.set(key, fallback);
    return fallback;
  }


const addToInventory = (item, quantity = 1) => {
  setInventory((prev) => {
    const next = new Map(prev);
    next.set(item, (next.get(item) || 0) + quantity);
    return next;
  });
};

const processItemSet = (sourceItems, multi) => {
  return sourceItems.filter((item) => {
    const dx = posRef.current.x - item.x;
    const dy = posRef.current.y - item.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const toolMap = TOOL_EFFECTIVENESS.get(equippedRef.current);
    const damage = toolMap?.get(item.type) ?? 0;

    if (dist < item.size) {
      item.health -= damage * multi;

      if (item.health <= 0) {
        const drops = dropLoot(item.type, item.x, item.y);
        setCollectItems((prev) => [...prev, ...drops]);
        return false;
      }

      return true;
    }

    return true;
  });
};

const handleInventoryClick = (item) => {
  const newInventory = new Map(inventory);
  const currentCount = newInventory.get(item) || 0;
  if (currentCount <= 0) return;

  const updatedHotbar = [...hotbar];

  let targetIndex = updatedHotbar.findIndex(slot => slot.item === item);

  if (targetIndex === -1) {
    targetIndex = updatedHotbar.findIndex(slot => !slot.item);
  }

  if (targetIndex === -1) return;

  if (updatedHotbar[targetIndex].item === item) {
    updatedHotbar[targetIndex].quantity += 1;
  } else {
    updatedHotbar[targetIndex] = { item, quantity: 1 };
  }

  if (currentCount === 1) {
    newInventory.delete(item);
  } else {
    newInventory.set(item, currentCount - 1);
  }
  setHotbar(updatedHotbar);
  setInventory(newInventory);
};


const handleHotbarClick = (slot, index) => {
  if (selectedItem) {
    const updated = [...hotbar];
    if (updated[index].item === selectedItem.type) {
      updated[index].quantity += 1;
    } else {
      updated[index] = { item: selectedItem.type, quantity: 1 };
    }
    setHotbar(updated);
    setSelectedItem(null);
  } else if (slot.item) {
    const updated = [...hotbar];
    updated[index].quantity -= 1;
    addToInventory(slot.item, 1);
    if (updated[index].quantity <= 0) {
      updated[index] = { item: null, quantity: 0 };
      setEquipped('hands')
    }
    setHotbar(updated);
  }
}

const canCraftLevel = (requiredLevel) => {
  if (requiredLevel === 0) return true;

  for (const item of placedItemsRef.current) {
    const stationLevel = STATION_LEVELS.get(item.type);
    if (stationLevel >= requiredLevel) {
      const dx = posRef.current.x - item.x;
      const dy = posRef.current.y - item.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) return true;
    }
  }

  return false;
};

const getAvailableCrafts = () => {
  return CRAFTING_RECIPES.filter(recipe => {
    if (!canCraftLevel(recipe.level)) return false;

    return recipe.ingredients.every(({ item, quantity }) => {
      return (inventory.get(item) || 0) >= quantity;
    });
  });
};

const consumeItem = () => {
  const held = equippedRef.current;
  const consumable = CONSUMABLES.find(c => c.item === held);
  if (!consumable) return;

  const slotIndex = hotbarRef.current.findIndex(slot => slot.item === held && slot.quantity > 0);
  if (slotIndex === -1) return;

  if (consumable.ability === 'STAMINA') {
    setStamina(prev => Math.min(1000, prev + consumable.amount));
  }

   if (consumable.ability === 'PLACEABLE') {
    const offset = 40;
    const pos = posRef.current;
    const facing = facingRef.current;

    const newX =
      facing === 'right' ? pos.x + offset :
      facing === 'left' ? pos.x - offset : pos.x;
    const newY =
      facing === 'down' ? pos.y + offset :
      facing === 'up' ? pos.y - offset : pos.y;

    const placed = {
      id: crypto.randomUUID(),
      size: 40,
      type: held,
      x: newX,
      y: newY,
      health: consumable.amount,
      maxHealth: consumable.amount,
    };

    setPlacedItems(prev => [...prev, placed]);
  }

  const updatedHotbar = [...hotbarRef.current]
  if (updatedHotbar[slotIndex].quantity === 1) {
    updatedHotbar[slotIndex] = { item: null, quantity: 0 };
    setEquipped("hands");
  } else {
    updatedHotbar[slotIndex].quantity -= 1;
  }

  setHotbar(updatedHotbar);
};



const craftItem = (recipe) => {
  const newInventory = new Map(inventory);
  for (const { item, quantity } of recipe.ingredients) {
    newInventory.set(item, newInventory.get(item) - quantity);
    if (newInventory.get(item) <= 0) newInventory.delete(item);
  }

  const current = newInventory.get(recipe.output.item) || 0;
  newInventory.set(recipe.output.item, current + recipe.output.quantity);
  setInventory(newInventory);
};

const CHUNK_UNLOAD_RADIUS = 1;

function unloadDistantChunks(playerX, playerY) {
  const cx = Math.floor(playerX / CHUNK_SIZE);
  const cy = Math.floor(playerY / CHUNK_SIZE);

  loadedChunks.current.forEach(key => {
    const [chunkX, chunkY] = key.split(',').map(Number);

    if (
      Math.abs(chunkX - cx) > CHUNK_UNLOAD_RADIUS ||
      Math.abs(chunkY - cy) > CHUNK_UNLOAD_RADIUS
    ) {
      loadedChunks.current.delete(key);

      setItems(items =>
        items.filter(item => {
          const icx = Math.floor(item.x / CHUNK_SIZE);
          const icy = Math.floor(item.y / CHUNK_SIZE);
          return !(icx === chunkX && icy === chunkY);
        })
      );

      setPlacedItems(p =>
        p.filter(i => {
          const icx = Math.floor(i.x / CHUNK_SIZE);
          const icy = Math.floor(i.y / CHUNK_SIZE);
          return !(icx === chunkX && icy === chunkY);
        })
      );
      setCollectItems(c =>
        c.filter(i => {
          const icx = Math.floor(i.x / CHUNK_SIZE);
          const icy = Math.floor(i.y / CHUNK_SIZE);
          return !(icx === chunkX && icy === chunkY);
        })
      );
    }
  });
}


useEffect(() => {
  const handleKeyUp = (e) => {
    if (e.key.toLowerCase() === 'y') {
      pickupPressed.current = false;
    }
  };
  window.addEventListener('keyup', handleKeyUp);
  return () => window.removeEventListener('keyup', handleKeyUp);
}, []);

function spawnItems(count, cx, cy, biomeName) {
    const table = BIOME_SPAWN_TABLE[biomeName];
    const totalW = table.reduce((s, e) => s + e.weight, 0);
    return Array.from({ length: count }, () => {
      let r = Math.random() * totalW;
      let type;
      for (const e of table) {
        if (r < e.weight) { type = e.type; break; }
        r -= e.weight;
      }
      const stats = TYPE_STATS.get(type) || TYPE_STATS.get('bush');
      const size = stats.size;
      const health = Math.floor(
        Math.random() * (stats.healthRange[1] - stats.healthRange[0] + 1)
      ) + stats.healthRange[0];
      return { id: crypto.randomUUID(), type, size, health, maxHealth: health,
        x: cx * CHUNK_SIZE + Math.random() * CHUNK_SIZE,
        y: cy * CHUNK_SIZE + Math.random() * CHUNK_SIZE
      };
    });
  }

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
};

    const handleKeyUp = (e) => {
      keys.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);


  function spawnChunk(cx, cy) {
    const key = `${cx},${cy}`;
    if (loadedChunks.current.has(key)) return;
    const biome = getChunkBiome(cx, cy).name;
    const newItems = spawnItems(40, cx, cy, biome);
    setItems(prev => { const next = [...prev, ...newItems]; itemsRef.current = next; return next; });
    loadedChunks.current.add(key);
  }

const handleMovement = () => {
    const speed = keys.current['shift'] && staminaRef.current > 50 ? 2 : 1.3;
    let nextX = posRef.current.x;
    let nextY = posRef.current.y;

    if (keys.current['shift'] && staminaRef.current >= 0) {
        setStamina((prev) => Math.max(0, prev - 1.6));
    }

    setStamina((prev) => Math.min(1000, prev + 0.06))
  
    if (keys.current['w']) {
      nextY -= speed;
      facingRef.current = 'up';
    }
    if (keys.current['s']) {
      nextY += speed;
      facingRef.current = 'down';
    }
    if (keys.current['a']) {
      nextX -= speed;
      facingRef.current = 'left';
    }
    if (keys.current['d']) {
      nextX += speed;
      facingRef.current = 'right';
    }
  
    let blocked = false;
  
    for (const item of [...itemsRef.current, ...placedItemsRef.current]) {
      const dx = nextX - item.x;
      const dy = nextY - item.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < (item.size || 40) * 0.6) {
        blocked = true;
        break;
      }
    }
  
    if (!blocked) {
      const newPos = { x: nextX, y: nextY };
      setPos(newPos);
      posRef.current = newPos;

      const newCx = Math.floor(newPos.x / CHUNK_SIZE);
      const newCy = Math.floor(newPos.y / CHUNK_SIZE);
      const { x: oldCx, y: oldCy } = currentChunkRef.current;
      if (newCx !== oldCx || newCy !== oldCy) {
        currentChunkRef.current = { x: newCx, y: newCy };

        spawnChunk(newCx, newCy);
        unloadDistantChunks(newPos.x, newPos.y);
      }
    }
  };

setInterval(() => {
  console.log(currentChunkRef.current)
  console.log(itemsRef.current.length)
  console.log(loadedChunks.current)
}, 3000)

  const handleBasicAttack = () => {
    const isKeyDown = keys.current['k'];
  
    if (isKeyDown && !hasBasic.current && !basicPressed.current && staminaRef.current > 50) {
      hasBasic.current = true;
      basicPressed.current = true;

      setStamina((prev) => Math.max(0, prev - 25))
  
      const newItems = processItemSet(itemsRef.current, 1);
      const newPlaced = processItemSet(placedItemsRef.current, 1);
  
      setItems(newItems);
      itemsRef.current = newItems;

      setPlacedItems(newPlaced);
      placedItemsRef.current = newPlaced;
  
      changeCharacter("😆");
  
      setTimeout(() => {
        changeCharacter("😀")
        hasBasic.current = false;
      }, 100);
    }
  
    if (!isKeyDown) {
      basicPressed.current = false;
    }
  };
  
  const handleStrongAttack = () => {
    const isKeyDown = keys.current['j'];
  
    if (isKeyDown && !hasStrong.current && !strongPressed.current && staminaRef.current > 100) {
      hasStrong.current = true;
      strongPressed.current = true;

      setStamina((prev) => Math.max(0, prev - 60))
  
      const newItems = processItemSet(itemsRef.current, 3);
      const newPlaced = processItemSet(placedItemsRef.current, 3);
  
      setItems(newItems);
      itemsRef.current = newItems;

      setPlacedItems(newPlaced);
      placedItemsRef.current = newPlaced;
  
      changeCharacter("😅");
  
      setTimeout(() => {
        changeCharacter("😀");
        hasStrong.current = false;
      }, 600);
    }
  
    if (!isKeyDown) {
      strongPressed.current = false;
    }
  };


const pickupLoop = () => {
  const isKeyDown = keys.current['e'];

  if (isKeyDown && !pickupPressed.current) {
  pickupPressed.current = true;

  const playerX = posRef.current.x;
  const playerY = posRef.current.y;

  const pickedUp = [];
  const kept = [];

  for (const drop of collectItemsRef.current) {
    const dx = drop.x - playerX;
    const dy = drop.y - playerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 20) {
      pickedUp.push(drop);
    } else {
      kept.push(drop);
    }
  }

  for (const drop of pickedUp) {
    addToInventory(drop.type, drop.quantity || 1);
  }

  setCollectItems(kept);

  setTimeout(() => {
    pickupPressed.current = false;
  }, 200);
}

  requestAnimationFrame(pickupLoop);
};

    let raf;
    function loop() {
      handleMovement();
      handleBasicAttack();
      handleStrongAttack();
      pickupLoop();
      raf = requestAnimationFrame(loop);
    }
    spawnChunk(0, 0);
    raf = requestAnimationFrame(loop);

    setTimeout(() => {
    setIsLoaded(true);
    }, 1000);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  if (!isLoaded) {
  return (
    <div className="w-screen h-screen bg-black text-white flex items-center justify-center">
      Refresh the browser to enter a new world!
    </div>
  );
}

const center = currentChunkRef.current;
const bg = getChunkBiome(center.x, center.y).gradient;

  return (
  <div className="relative w-screen h-screen overflow">
<div className="fixed bottom-0 left-0 w-full bg-black/70 text-white p-2 flex flex-col items-center z-50">
  <div className="flex gap-4 items-center">
    <p>Stamina: {Math.floor(stamina / 10)}%</p>
    <p>{facingRef.current}</p>
    <button
      onClick={() => setShowInventory((prev) => !prev)}
      className="bg-green-700 hover:bg-green-600 px-2 py-1 rounded text-xs"
    >
      {showInventory ? 'Close Inventory' : 'Open Inventory'}
    </button>
  </div>
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

    <div
      className={`absolute bg-gradient-to-t ${bg}`}
      style={{
        minWidth: `${CHUNK_SIZE * (currentChunkRef.current.x + 1)}px`,
        minHeight: `${CHUNK_SIZE * (currentChunkRef.current.y + 1)}px`,
      }}
    >
      {hasBasic.current && (
        <div
          className="absolute w-[120px] h-[120px] bg-transparent rounded-full pointer-events-none"
          style={{
            backgroundImage: `url('/yellowlensflare.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            left: `${pos.x}px`,
            top: `${pos.y}px`,
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
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}

      <div
        style={{
          position: 'absolute',
          width: '40px',
          height: '40px',
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
        style={{
          position: 'absolute',
          width: '30px',
          height: '30px',
          backgroundImage: `url(${TEXTURE_MAP.get(equippedRef.current)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '50%',
          left: `${pos.x + 30}px`,
          top: `${pos.y}px`,
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

    </div>
  </div>
);

}

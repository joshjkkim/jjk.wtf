'use client';

import { useEffect, useRef, useState } from 'react';
import GameItem from '../components/gameitem';

const TOOL_EFFECTIVENESS = new Map([
    ['pickaxe', new Set(['stone'])],
    ['axe', new Set(['bush', 'tree'])],
    ['hands', new Set(['bush'])],
  ]);

const TOOL_PHOTO = new Map([
    ['pickaxe', '/pickaxe.png'],
    ['axe', '/axe.png'],
    ['hands', '/fist.png'],
])

export default function GamePage() {
  const [pos, setPos] = useState({ x: 300, y: 300 });
  const posRef = useRef(pos);
  const [items, setItems] = useState([]);
  const itemsRef = useRef(items);

  const [equipped, setEquipped] = useState("hands")
  const equippedRef = useRef(equipped)

  const keys = useRef({});
  const [stamina, setStamina] = useState(1000);
  const staminaRef = useRef(stamina);

  const basicPressed = useRef(false);
    const strongPressed = useRef(false);

  const [color, changeColor] = useState("white");
  const colorRef = useRef(color);
  const hasBasic = useRef(false);
  const hasStrong = useRef(false);

  const loadedChunks = useRef(new Set()) 

  const [greatestXChunk, setGreatestXChunk] = useState(0);
  const [greatestYChunk, setGreatestYChunk] = useState(0);

  const [CHUNK_SIZE, setChunkSize] = useState(typeof window !== 'undefined' ? window.innerWidth : 500);

  // Keep refs synced with state
  useEffect(() => {
    posRef.current = pos;
  }, [pos]);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    colorRef.current = color;
  }, [color]);
  
  useEffect(() => {
    equippedRef.current = equipped;
  }, [equipped]);

  useEffect(() => {
    staminaRef.current = stamina;
  }, [stamina]);

  useEffect(() => {
    // Spawn initial items
    const spawnItems = (count, cx, cy) => {
      const types = ['stone', 'bush', 'tree'];
      const newItems = Array.from({ length: count }, () => {
        const type = types[Math.floor(Math.random() * types.length)];
        const size = type === 'tree' ? 130 : type === 'stone' ? 40 : 30;
        const health = type === 'tree'
          ? Math.floor(Math.random() * 10 + 5)
          : type === 'stone'
          ? Math.floor(Math.random() * 5 + 3)
          : Math.floor(Math.random() * 3 + 1);
        return {
          x: cx * CHUNK_SIZE + Math.random() * (CHUNK_SIZE - 60) + 30,
          y: cy * CHUNK_SIZE + Math.random() * (CHUNK_SIZE - 60) + 30,
          id: crypto.randomUUID(),
          type,
          size,
          health,
          maxHealth: health,
        };
      });

      setItems((prev) => [...prev, ...newItems]);
      itemsRef.current = [...itemsRef.current, ...newItems];
    };


    // Key listeners
    const handleKeyDown = (e) => {
      keys.current[e.key.toLowerCase()] = true;
      if (e.key === '1') {
        changeColor("white");
        setEquipped("hands")
      }  else if (e.key === '2') {
        changeColor("white");
        setEquipped("pickaxe")
      }  else if (e.key === '3') {
        changeColor("white");
        setEquipped("axe")
      }
    };

    const handleKeyUp = (e) => {
      keys.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);


const spawnChunk = (cx, cy) => {
  const key = `${cx},${cy}`;
if (!loadedChunks.current.has(key)) {
  spawnItems(50, cx, cy); // pass coordinates to offset properly
  loadedChunks.current.add(key);
  setGreatestXChunk((prev) => Math.max(cx, prev));
  setGreatestYChunk((prev) => Math.max(cy, prev));
  console.log(loadedChunks.current);
}
}

spawnChunk(0, 0)
    // Movement loop
   // Movement loop
const moveLoop = () => {
    const speed = keys.current['shift'] && staminaRef.current > 0 ? 3 : 1.5;
    let nextX = posRef.current.x;
    let nextY = posRef.current.y;

    if (keys.current['shift'] && staminaRef.current >= 0) {
        setStamina((prev) => Math.max(0, prev - 2));
    }

    setStamina((prev) => Math.min(1000, prev + 0.1))
  
    if (keys.current['w']) nextY -= speed;
    if (keys.current['s']) nextY += speed;
    if (keys.current['a']) nextX -= speed;
    if (keys.current['d']) nextX += speed;
  
    let blocked = false;
  
    for (const item of itemsRef.current) {
      const dx = nextX - item.x;
      const dy = nextY - item.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
  
      if (dist < item.size * 0.6) {
        blocked = true;
        break;
      }
    }
  
    if (!blocked) {
      const currPos = {
        x: nextX,
        y: nextY,
      };
      setPos(currPos);
      posRef.current = currPos;

      if(Math.floor(currPos.x / CHUNK_SIZE) > greatestXChunk || Math.floor(currPos.y / CHUNK_SIZE) > greatestYChunk) {
        let cx = Math.floor(currPos.x / CHUNK_SIZE)
        let cy = Math.floor(currPos.y / CHUNK_SIZE)
        spawnChunk(cx, cy)
      }
    }
  
    requestAnimationFrame(moveLoop);
  };
  
  // Activate loop (pickup nearby items of matching color)
  const basicLoop = () => {
    const isKeyDown = keys.current['k'];
  
    if (isKeyDown && !hasBasic.current && !basicPressed.current) {
      hasBasic.current = true;
      basicPressed.current = true; // mark as pressed
  
      const newItems = itemsRef.current.filter((item) => {
        const dx = posRef.current.x - item.x;
        const dy = posRef.current.y - item.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
  
        if (
          dist < item.size &&
          TOOL_EFFECTIVENESS.get(equippedRef.current)?.has(item.type)
        ) {
          item.health--;
          return item.health > 0;
        }
  
        return true;
      });
  
      setItems(newItems);
      itemsRef.current = newItems;
  
      let prev = colorRef.current;
      changeColor("yellow");
  
      setTimeout(() => {
        changeColor(prev);
        hasBasic.current = false;
      }, 100);
    }
  
    if (!isKeyDown) {
      basicPressed.current = false;
    }
  
    requestAnimationFrame(basicLoop);
  };
  
  const strongLoop = () => {
    const isKeyDown = keys.current['j'];
  
    if (isKeyDown && !hasStrong.current && !strongPressed.current) {
      hasStrong.current = true;
      strongPressed.current = true;
  
      const newItems = itemsRef.current.filter((item) => {
        const dx = posRef.current.x - item.x;
        const dy = posRef.current.y - item.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
  
        if (
          dist < item.size + 30 &&
          TOOL_EFFECTIVENESS.get(equippedRef.current)?.has(item.type)
        ) {
          item.health -= 3;
          return item.health > 0;
        }
  
        return true;
      });
  
      setItems(newItems);
      itemsRef.current = newItems;
  
      let prev = colorRef.current;
      changeColor("red");
  
      setTimeout(() => {
        changeColor(prev);
        setTimeout(() => {
          hasStrong.current = false;
        }, 500);
      }, 100);
    }
  
    if (!isKeyDown) {
      strongPressed.current = false;
    }
  
    requestAnimationFrame(strongLoop);
  };
  

    requestAnimationFrame(moveLoop);
    requestAnimationFrame(basicLoop);
    requestAnimationFrame(strongLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="min-w-[100000px] min-h-[100000px] bg-gradient-to-t from-green-800 via-green-900 to-green-700">
      <div className="flex flex-col min-h-1/12 justify-center items-center">
        <p>Stamina: {Math.floor(stamina / 10)}%</p>
        <span className="flex flex-row gap-4">
            <p className={`${!hasBasic.current ? "text-green-300" : "text-sred-800"}`}>
            {!hasBasic.current ? "Basic" : "COOLDOWN"}
            </p>

            <p className={`${!hasStrong.current ? "text-green-300" : "text-red-800"}`}>
            {!hasStrong.current ? "Strong" : "COOLDOWN"}
            </p>
        </span>
        
        <p>{equipped}</p>
      </div>

      {hasBasic.current && (
        <div
          className="absolute w-[120px] h-[120px] bg-transparent rounded-full"
          style={{
            backgroundImage: `url('/yellowlensflare.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        />
      )}

      <div
        style={{
          position: 'absolute',
          width: '40px',
          height: '40px',
          backgroundColor: `${color}`,
          borderRadius: '50%',
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          transform: `translate(-50%, -50%)`,
        }}
      />

<div
  style={{
    position: 'absolute',
    width: '60px',
    height: '60px',
    backgroundImage: `url(${TOOL_PHOTO.get(equippedRef.current)})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: '50%',
    left: `${pos.x + 30}px`,
    top: `${pos.y}px`,
    transform: `translate(-50%, -50%)`,
  }}
/>

      {items.map((item) => (
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
    </div>
  );
}

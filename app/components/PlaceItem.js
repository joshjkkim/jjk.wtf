import React, { useEffect, useRef } from 'react';
import { PLANTS_TEXTURES, TEXTURE_MAP } from '../utils/tables';

export default function PlaceItem({
  id,
  x,
  y,
  health,
  maxHealth,
  type,
  size = 40,
  playerPos = null,
  growthStage = null,
  onCollideChange = () => {},
}) {
  const wasColliding = useRef(false);
  const hitboxRadius = size / 2;
  let texture = TEXTURE_MAP.get(type);

  if (growthStage) {
    texture = PLANTS_TEXTURES[type]?.texture?.[growthStage]
  }

  useEffect(() => {
    if (!playerPos) return;

    const dx = x - playerPos.x;
    const dy = y - playerPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const isColliding = dist < hitboxRadius;

    if (isColliding !== wasColliding.current) {
      wasColliding.current = isColliding;
      onCollideChange(id, isColliding);
    }
  }, [playerPos, x, y, hitboxRadius, id, onCollideChange]);

  if (!texture) return null;

  return (

        <div
        className={`absolute ${wasColliding.current ? 'border-yellow-400 border-2' : 'border-transparent'} rounded`}
        style={{
            left: `${x}px`,
            top: `${y}px`,
            width: `${size}px`,
            height: `${size}px`,
            backgroundImage: `url(${texture})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            transition: 'border 0.2s',
        }}
        >

        {health < maxHealth &&
        <div className="absolute -top-3 left-1/2 w-full transform -translate-x-1/2 h-1.5 bg-white/20 rounded">
            <div
                className={`h-full rounded transition-all duration-200`}
                style={{
                width: `${(health / maxHealth) * 100}%`,
                backgroundColor:
                    health > maxHealth * 0.5
                    ? 'limegreen'
                    : health > maxHealth * 0.25
                    ? 'orange'
                    : 'red',
                }}
            />
            </div>
        }
    </div>
  );
}

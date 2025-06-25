import { useEffect, useRef } from 'react';

export default function GameItem({
  id,
  x,
  y,
  size = 40,
  image,
  health,
  maxHealth,
  type = 'solid', // 'solid' or 'collectible'
  hitboxRadius = size / 2,
  playerPos = null,
  onCollideChange = () => {},
}) {
  const wasColliding = useRef(false);

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

 const resolvedImage =
    image ??
    (type === 'stone'
      ? '/rock.png'
      : type === 'bush'
      ? '/bush.gif'
      : type === 'tree'
      ? '/tree.gif'
      : type === 'cactus'
      ? '/cactus.png'
      : type === 'dead bush'
      ? '/dead_bush.png'
      : type === 'wolf'
      ? '/wolf.gif'
      : type === 'boar'
      ? '/boar.gif'
      : type === 'scorpion'
      ? '/scorpion.gif'
      : undefined);

const typeZIndex = {
  stone: 1,
  bush: 2,
  tree: 3,
};

const zIndex = typeZIndex[type] ?? 0;

  return (
    <div
      className={`absolute text-xs text-white flex justify-center items-center font-mono ${
        wasColliding.current ? 'border-yellow-400 border-2' : 'border-transparent'
      }`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundImage: resolvedImage ? `url('${resolvedImage}')` : undefined,
        backgroundColor: 'transparent',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        transform: 'translate(-50%, -50%)',
        borderRadius: '8px',
        transition: 'border 0.2s',
        zIndex: zIndex,
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

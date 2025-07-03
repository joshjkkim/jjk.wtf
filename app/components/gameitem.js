import React, { useEffect, useRef, useMemo } from 'react';

// Default images for item types
const IMAGE_MAP = {
  stone: '/rock.png',
  bush: '/bush.gif',
  tree: '/tree.gif',
  cactus: '/cactus.png',
  'dead bush': '/dead_bush.png',
  ironNode: '/iron_node.png',
  goldNode: '/gold_node.gif',
  chest: '/chest.png',

  wolf: '/wolf.gif',
  boar: '/boar.gif',
  deer: '/deer.gif',

  scorpion: '/scorpion.gif',
  snake: '/snake.gif',
  camel: '/camel.gif',
  
  bat: '/bat.gif',
  spider: '/spider.gif',
  rock_monster: '/rock_monster.gif',
};

const Z_INDEX_MAP = {
  collectible: 5,
  stone: 10,
  bush: 20,
  tree: 30,
};

function useCollision({ x, y, hitboxRadius, playerPos, onCollideChange, id }) {
  const wasColliding = useRef(false);

  useEffect(() => {
    if (!playerPos) return;
    const dx = x - playerPos.x;
    const dy = y - playerPos.y;
    const dist = Math.hypot(dx, dy);
    const isColliding = dist < hitboxRadius;

    if (isColliding !== wasColliding.current) {
      wasColliding.current = isColliding;
      onCollideChange(id, isColliding);
    }
  }, [x, y, hitboxRadius, playerPos, onCollideChange, id]);

  return wasColliding.current;
}

const GameItem = React.memo(function GameItem({
  id,
  x,
  y,
  size = 40,
  image,
  health = 0,
  maxHealth = 0,
  type = 'solid',
  hitboxRadius,
  playerPos = null,
  onCollideChange = () => {},
}) {
  const colliding = useCollision({
    id,
    x,
    y,
    hitboxRadius: hitboxRadius || size / 2,
    playerPos,
    onCollideChange,
  });

  const resolvedImage = useMemo(() => {
    return image || IMAGE_MAP[type] || undefined;
  }, [image, type]);

  const containerStyle = useMemo(() => ({
    left: `${x}px`,
    top: `${y}px`,
    width: `${size}px`,
    height: `${size}px`,
    backgroundImage: resolvedImage ? `url('${resolvedImage}')` : undefined,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    transform: 'translate(-50%, -50%)',
    zIndex: Z_INDEX_MAP[type] || 0,
  }), [x, y, size, resolvedImage, type]);

  const hp = useMemo(() => (maxHealth > 0 ? (health / maxHealth) * 100 : 0), [health, maxHealth]);
  const barColor = hp > 50 ? 'limegreen' : hp > 25 ? 'orange' : 'red';

  return (
    <div
      className={`absolute flex items-center justify-center font-mono text-xs text-white rounded-full shadow-lg bg-black/20 p-5 transition-border duration-200 ${
        colliding ? 'border-yellow-400 border-2' : 'border-transparent'
      }`}
      style={containerStyle}
    >
      {maxHealth > 0 && health < maxHealth && (
        <div className="absolute bottom-full mb-1 w-full h-1 bg-white/30 rounded overflow-hidden">
          <div
            className="h-full transition-all duration-200"
            style={{ width: `${hp}%`, backgroundColor: barColor }}
          />
        </div>
      )}
    </div>
  );
});

export default GameItem;

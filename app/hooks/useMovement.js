import { useCallback } from "react";

export default function useMovement({keys, staminaRef, posRef, facingRef, itemsRef, placedItemsRef, currentChunkRef, spawnChunk, unloadDistantChunks, CHUNK_SIZE, healthRef, maxHealthRef, isDeadRef, setInventory, setHotbar, setStamina}) {
    const handleMovement = useCallback(() => {
    const speed = keys.current['shift'] && staminaRef.current > 50 ? 1.7 : 1;
    let nextX = posRef.current.x;
    let nextY = posRef.current.y;

    if (keys.current['shift'] && staminaRef.current >= 0) {
        staminaRef.current = Math.max(0, staminaRef.current - 1.6);
    }

    staminaRef.current = Math.min(1000, staminaRef.current + 0.06);
  
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
  }, [keys, staminaRef, posRef, facingRef, itemsRef, placedItemsRef, currentChunkRef, spawnChunk, unloadDistantChunks]);

  const handleStamina = useCallback(() => {
    if(staminaRef.current >= 750) {
      healthRef.current = Math.min(maxHealthRef.current, healthRef.current += 0.03)
    } 
  }, [staminaRef, healthRef, maxHealthRef])

  function saveDefaultState() {
    const payload = {
      health:    100,
      maxHealth: 100,
      inventory: [],
      hotbar:    Array(9).fill({ item: null, quantity: 0 }),
      stamina:   1000,
    }

    fetch('/api/save', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload)
    }).catch(console.error)
  }

  function checkForDeath() {
    if (healthRef.current < 1 && !isDeadRef.current) {
      isDeadRef.current = true
      healthRef.current = 100
      saveDefaultState()

      setInventory(new Map())
      setHotbar(Array(9).fill({ item: null, quantity: 0 }))
      setStamina(1000)
    }
  }

  return { handleMovement, handleStamina, checkForDeath }
}

import { useCallback } from "react";
import { TOOL_EFFECTIVENESS } from "./tables";

export default function worldEnemies({ itemsRef, placedItemsRef, posRef, enemiesRef, healthRef, dropLoot, setCollectItems, equippedRef, setItems, setPlacedItems }) {
    const handleEnemyMovement = useCallback((now) => {
        const worldObstacles = [...itemsRef.current, ...placedItemsRef.current];
        for (const en of enemiesRef.current) {
            const dx   = posRef.current.x - en.x;
            const dy   = posRef.current.y - en.y;
            const dist = Math.hypot(dx, dy);

            if (dist > en.attackRange * 0.8) {
            const dirX  = dx / dist;
            const dirY  = dy / dist;
            const nextX = en.x + dirX * en.speed;
            const nextY = en.y + dirY * en.speed;

            let blocked = false;
            let targetObstacle = null;

            for (const w of worldObstacles) {
                const ddx  = nextX - w.x;
                const ddy  = nextY - w.y;
                if (Math.hypot(ddx, ddy) < (en.size * 0.5 + (w.size || 40) * 0.5)) {
                blocked = true;
                targetObstacle = w;
                break;
                }
            }

            if (!blocked) {

                en.x = nextX;
                en.y = nextY;
            } else if (targetObstacle && now - en.lastAttack > en.cooldown * 3) {

                const toolDamage = en.attack;
                targetObstacle.health -= (toolDamage * 0.1);
                en.lastAttack = now;

                if (targetObstacle.health <= 0) {
                const drops = dropLoot(targetObstacle.type, targetObstacle.x, targetObstacle.y);
                setCollectItems(c => [...c, ...drops]);

                setItems(prev =>
                    prev.filter(i => i.id !== targetObstacle.id)
                );
                setPlacedItems(prev =>
                    prev.filter(i => i.id !== targetObstacle.id)
                );
                }
            }
            }
        }
    }, [itemsRef, placedItemsRef, posRef, enemiesRef, dropLoot, setCollectItems, setItems, setPlacedItems]);


    const handleEnemyAttacks = useCallback((now) => {
        for (const en of enemiesRef.current) {
            const dx = posRef.current.x - en.x;
            const dy = posRef.current.y - en.y;
            const dist = Math.hypot(dx,dy);
            if (dist < en.attackRange && now - en.lastAttack > en.cooldown) {
                en.lastAttack = now;
                healthRef.current = Math.max(0, healthRef.current - en.attack);
            }
        }
    }, [posRef, enemiesRef, healthRef])

    const processEntitySet = useCallback((sourceArray, damageMult) => {
        return sourceArray.filter(ent => {
            const dx = posRef.current.x - ent.x;
            const dy = posRef.current.y - ent.y;
            const toolMap = TOOL_EFFECTIVENESS.get(equippedRef.current);
            const damage = toolMap?.get(ent.type) ?? 0;
            if (Math.hypot(dx,dy) < ent.size * 1.3) {
                ent.health -= damageMult * (damage || 1);
                if (ent.health <= 0) {
                const drops = dropLoot(ent.type, ent.x, ent.y);
                setCollectItems((prev) => [...prev, ...drops]);
                return false;
                }
            }
            return true;
        });
    }, [posRef, equippedRef, dropLoot, setCollectItems])

    return { handleEnemyMovement, handleEnemyAttacks, processEntitySet }
}

    
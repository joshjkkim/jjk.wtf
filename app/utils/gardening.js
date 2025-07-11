import { PLANTS_STATS, PLANTS_TEXTURES } from "./tables";

export default function playerGardening({ posRef, facingRef, placedItemsRef, setPlacedItems }) {
    function placeSeed(held, consumable) {
        const offset = 40;
        const pos = posRef.current;
        const facing = facingRef.current;

        const newX =
        facing === 'right' ? pos.x + offset :
        facing === 'left' ? pos.x - offset : pos.x;
        const newY =
        facing === 'down' ? pos.y + offset :
        facing === 'up' ? pos.y - offset : pos.y;

        let minDist = Infinity;
        let closest = null;
        let loc = { x: 0, y: 0}
        for (const item of placedItemsRef.current) {
            if (!item.type.includes("soil")) continue;

            const dx = newX - item.x;
            const dy = newY - item.y;
            const dist = Math.hypot(dx, dy);

            if (dist < 30 && dist < minDist) {
            minDist = dist;
            closest = item;
            loc = { x: item.x, y: item.y };
            }
        }

        if (closest) {

            const placed = {
                id: crypto.randomUUID(),
                size: 20,
                type: PLANTS_STATS[held]?.name,
                x: loc.x,
                y: loc.y,
                health: consumable.amount,
                maxHealth: consumable.amount,
                growthStage: 1,
                growthChance: PLANTS_STATS[held]?.growthChance,
                maxGrowthStage: PLANTS_STATS[held]?.maxGrowth,
                growthSizeInc: PLANTS_STATS[held]?.growthSizeInc,
            };

            setPlacedItems(prev =>
                prev.map(item =>
                    item.id === closest.id
                    ? placed
                    : item
                )
            );

            return true;
        } else {
            return false;
        }
        
    }

    function handlePlantGrowth() {
        setPlacedItems(prev => {
            const next = prev.map(item => {
            if (
                item.growthStage != null &&
                item.growthStage < item.maxGrowthStage &&
                Math.random() < item.growthChance
            ) {
                const newStage = item.growthStage + 1;
                return {
                ...item,
                growthStage: newStage,
                size:        item.size + item.growthSizeInc,
                };
            }
            return item;
            });
            placedItemsRef.current = next;
            return next;
        });
    }

    return { placeSeed, handlePlantGrowth }
}
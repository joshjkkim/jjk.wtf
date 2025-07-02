export default function playerStorage({ placedItemsRef, posRef,}) {
    const getNearbyChest = () => {
        let closest = null;
        let minDist = Infinity;
        const px = posRef.current.x;
        const py = posRef.current.y;

        for (const item of placedItemsRef.current) {
            if (!item.invAmount) continue;

            const dx = px - item.x;
            const dy = py - item.y;
            const dist = Math.hypot(dx, dy);

            if (dist < 75 && dist < minDist) {
            minDist = dist;
            closest = item;
            }
        }

        return closest ? closest.inventory : null;
    };
    
        return { getNearbyChest }
}


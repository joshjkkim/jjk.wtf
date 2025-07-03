import { MAX_SLOTS, MAX_STACK, STORAGE_STATS } from "./tables";

export default function playerStorage({ placedItemsRef, posRef, inventoryRef, setInventory, setPlacedItems, setCollectItems, setAlert}) {
    const getNearbyChest = () => {
        let closest = null;
        let minDist = Infinity;
        const px = posRef.current.x;
        const py = posRef.current.y;
        console.log("HI", placedItemsRef.current)

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

        return closest ? { inventory: closest.inventory, id: closest.id } : false;
    };

    function putInStorage(chestId, item) {
        const chest = placedItemsRef.current.find(c => c.id === chestId);
        if (!chest || !chest.invAmount) return false;
        const chestInv = chest.inventory;

        if (chestInv.size >= chest.invAmount && !chestInv.has(item)) {
            setAlert("Chest inventory is full!");
            setTimeout(() => {
                setAlert("");  
            }, 3000);
            return false;
        }
        const currentChestCount = chestInv.get(item) || 0;
        const isNewChestStack = currentChestCount === 0;
        const stats = STORAGE_STATS.find(s => s.item === chest.type);
        const chestSlots = stats ? stats.inventory : MAX_SLOTS;

        if (isNewChestStack && chestInv.size >= chestSlots) return false;
        if (currentChestCount + 1 > MAX_STACK) return false;

        const playerCount = inventoryRef.current.get(item) || 0;
        if (playerCount <= 0) return false;
        setInventory(inv => {
        const next = new Map(inv);
        if (playerCount === 1) next.delete(item);
        else next.set(item, playerCount - 1);
        return next;
        });

        chestInv.set(item, currentChestCount + 1);
        setPlacedItems([...placedItemsRef.current]);
        return true;
    }

    function takeFromStorage(chestId, item) {
        const chest = placedItemsRef.current.find(c => c.id === chestId);
        if (!chest || !chest.invAmount) return false;
        const chestInv = chest.inventory;
        const currentChestCount = chestInv.get(item) || 0;
        if (currentChestCount <= 0) return false;

        const playerInv = inventoryRef.current;
        const playerCount = playerInv.get(item) || 0;
        const isNewPlayerStack = playerCount === 0;
        if (isNewPlayerStack && playerInv.size >= MAX_SLOTS) return false;
        if (playerCount + 1 > MAX_STACK) return false;

        if (currentChestCount === 1) chestInv.delete(item);
        else chestInv.set(item, currentChestCount - 1);
        setPlacedItems([...placedItemsRef.current]);

        setInventory(inv => {
        const next = new Map(inv);
        next.set(item, playerCount + 1);
        return next;
        });
        return true;
    }
    
        return { getNearbyChest, putInStorage, takeFromStorage }
}


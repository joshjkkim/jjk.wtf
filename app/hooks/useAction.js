import { useState, useCallback, useRef } from "react";
import { CONSUMABLES, MAX_SLOTS, MAX_STACK, STORAGE_STATS } from "../utils/tables";
import playerGardening from "../utils/gardening";
import { useRouter } from "next/navigation";
import playerStorage from "../utils/storage";



export default function useAction({equippedRef, hotbarRef, setStamina, posRef, facingRef, setPlacedItems, setEquipped, setHotbar, keys, collectItemsRef, addToInventory, setCollectItems, inventoryRef, healthRef, maxHealthRef, staminaRef, setAlert, armorRef, placedItemsRef}) {
    const router = useRouter()
    const countdownRef = useRef()
    const pickupPressed = useRef(false);
    const [openChestId, setOpenChestId] = useState(null);
    const [openChestInv, setOpenChestInv] = useState(null);
    const { placeSeed } = playerGardening({ posRef, facingRef, placedItemsRef, setPlacedItems });
    
    const consumeItem = useCallback(() => {
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

            const stats = STORAGE_STATS.find(c => c.item === held);
            const invAmt = stats ? stats.inventory : 0;


            const placed = {
                id: crypto.randomUUID(),
                size: 40,
                type: held,
                x: newX,
                y: newY,
                health: consumable.amount,
                maxHealth: consumable.amount,
                invAmount: invAmt,
                inventory: invAmt ? new Map() : null,
            };

            setPlacedItems(prev => [...prev, placed]);
        }

        if (consumable.ability === "PLANT") {
            placeSeed(held, consumable);
        }

        const updatedHotbar = [...hotbarRef.current]
        if (updatedHotbar[slotIndex].quantity === 1) {
            updatedHotbar[slotIndex] = { item: null, quantity: 0 };
            setEquipped("hands");
        } else {
            updatedHotbar[slotIndex].quantity -= 1;
        }

        setHotbar(updatedHotbar);
    }, [equippedRef, hotbarRef, setStamina, posRef, facingRef, setPlacedItems, setEquipped, setHotbar]);

    const prevERef = useRef(false);

    const pickupLoop = useCallback(() => {
        const isDown = !!keys.current['e'];

        if (isDown && !prevERef.current) {
            doPickup();
        }
        prevERef.current = isDown;
        }, [keys, posRef, collectItemsRef, addToInventory, setCollectItems]);

    function doPickup() {
        const playerX = posRef.current.x;
        const playerY = posRef.current.y;

        const newKept = [];
        const toAdd   = [];

        for (const drop of collectItemsRef.current) {
            const dx = drop.x - playerX;
            const dy = drop.y - playerY;
            if (Math.hypot(dx, dy) < 50) {
            toAdd.push(drop);
            } else {
            newKept.push(drop);
            }
        }

        for (const { type, quantity = 1 } of toAdd) {
            const inv     = inventoryRef.current;
            const current = inv.get(type) || 0;
            const hasSlot = inv.has(type) || inv.size < MAX_SLOTS;

            if (!hasSlot) {
            setAlert('Inventory is full!');
            newKept.push({ id: crypto.randomUUID(), type , x: playerX, y: playerY });
            continue;
            }
            if (current + quantity > MAX_STACK) {
            setAlert(`${type} stack is full! (max ${MAX_STACK})`);
            newKept.push({ id: crypto.randomUUID(), type , x: playerX, y: playerY });
            continue;
            }

            addToInventory(type, quantity);
        }

        collectItemsRef.current = newKept;
        setCollectItems(newKept);
    }

    const saveAndRestart = useCallback(async (message, destination) => {
        setEquipped("walkietalkie")
        
        let count = 10
        setAlert(`${message} in ${count}`)
        console.log(armorRef.current)
        const id = window.setInterval(async () => {
        count -= 1
        if (count > 1) {
            setAlert(`${message} in ${count}`)
        } else {
            clearInterval(id)

            setAlert("Saving…")
            const serializableInventory = Array.from(inventoryRef.current.entries())
            const payload = {
            health:    healthRef.current,
            maxHealth: maxHealthRef.current,
            inventory: serializableInventory,
            hotbar:    hotbarRef.current,
            stamina:   Math.floor(staminaRef.current),
            armor:  armorRef.current
            }

            try {
            const res = await fetch('/api/save', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(payload),
            })
            if (!res.ok) {
                throw new Error(`Save failed: ${res.status}`)
            }
            await res.json()
            setAlert(`${message} landed! Restarting…`)
            router.push(destination)
            } catch (e) {
            console.error(e)
            setAlert("Save failed. Check console.")
            }
        }
        }, 1100)

        countdownRef.current = id
  }, [
    healthRef, maxHealthRef,
    inventoryRef, hotbarRef,
    staminaRef, router,
  ])

    const openChestLoop = useCallback(() => {
        const isDown = keys.current['e'];

        if (isDown) {
            console.log("Meow")
            const {inventory, id} = playerStorage({ placedItemsRef, posRef }).getNearbyChest();
            if (id) {
            setOpenChestId(id);
            setOpenChestInv(inventory)
            }
        }
        prevERef.current = isDown;
    }, [keys, prevERef, placedItemsRef, posRef]);

    const saveHome = useCallback(async () => {
        const payload = {
            health:    placedItemsRef.current,
        }

        try {
        const res = await fetch('/api/home', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(payload),
        })
        if (!res.ok) {
            throw new Error(`Save failed: ${res.status}`)
        }
        await res.json()
        setAlert("Rescue landed! Restarting…")
        router.push('/login')
        } catch (e) {
        console.error(e)
        setAlert("Save failed. Check console.")
        }
    })

    return { consumeItem, pickupLoop, pickupPressed, saveHome, saveAndRestart, openChestLoop, openChestId, openChestInv, setOpenChestId }
}




import { useCallback, useRef } from "react";
import { CONSUMABLES } from "../utils/tables";
import { useRouter } from "next/navigation";

export default function useAction({equippedRef, hotbarRef, setStamina, posRef, facingRef, setPlacedItems, setEquipped, setHotbar, keys, collectItemsRef, addToInventory, setCollectItems, inventoryRef, healthRef, maxHealthRef, staminaRef, setAlert, armorRef, placedItemsRef}) {
    const router = useRouter()
    const countdownRef = useRef()
    const pickupPressed = useRef(false);
    
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

            const placed = {
            id: crypto.randomUUID(),
            size: 40,
            type: held,
            x: newX,
            y: newY,
            health: consumable.amount,
            maxHealth: consumable.amount,
            };

            setPlacedItems(prev => [...prev, placed]);
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

        const kept = [];
        const picked = [];

        for (const drop of collectItemsRef.current) {
            const dx = drop.x - playerX;
            const dy = drop.y - playerY;
            if (Math.hypot(dx, dy) < 50) picked.push(drop);
            else kept.push(drop);
        }

        collectItemsRef.current = kept;
        setCollectItems(kept);

        for (const { type, quantity = 1 } of picked) {
            addToInventory(type, quantity);
        }}

    const saveAndRestart = useCallback(async (message) => {
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
            router.push('/login')
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

    return { consumeItem, pickupLoop, pickupPressed, saveAndRestart }
}




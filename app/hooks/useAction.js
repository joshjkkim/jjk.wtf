import { useCallback, useRef } from "react";
import { CONSUMABLES } from "../utils/tables";
import { useRouter } from "next/navigation";

export default function useAction({equippedRef, hotbarRef, setStamina, posRef, facingRef, setPlacedItems, setEquipped, setHotbar, keys, collectItemsRef, addToInventory, setCollectItems, inventoryRef, healthRef, maxHealthRef, staminaRef}) {
    const router = useRouter()
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

    const pickupLoop = useCallback(() => {
        const isKeyDown = keys.current['e'];

        if (isKeyDown && !pickupPressed.current) {
            pickupPressed.current = true;

            const playerX = posRef.current.x;
            const playerY = posRef.current.y;

            const pickedUp = [];
            const kept = [];

            for (const drop of collectItemsRef.current) {
                const dx = drop.x - playerX;
                const dy = drop.y - playerY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 50) {
                pickedUp.push(drop);
                } else {
                kept.push(drop);
                }
            }

            for (const drop of pickedUp) {
                addToInventory(drop.type, drop.quantity || 1);
            }

            setCollectItems(kept);

            setTimeout(() => {
                pickupPressed.current = false;
            }, 200);
        }
    }, [keys, pickupPressed, posRef, collectItemsRef, addToInventory, setCollectItems]);

    const saveAndRestart  = useCallback(async () => {
        const serializableInventory = Array.from(inventoryRef.current.entries())

        const payload = {
            health:    healthRef.current,
            maxHealth: maxHealthRef.current,
            inventory: serializableInventory,
            hotbar: hotbarRef.current,
            stamina: Math.floor(staminaRef.current)
            }

            const res = await fetch('/api/save', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(payload),
            })

            if (!res.ok) {
            const text = await res.text()
            throw new Error(`Save failed: ${res.status} ${text}`)
            }

            router.push('/login')
            return await res.json()
    }, [healthRef, maxHealthRef, inventoryRef, hotbarRef, staminaRef])

    return { consumeItem, pickupLoop, pickupPressed, saveAndRestart }
}




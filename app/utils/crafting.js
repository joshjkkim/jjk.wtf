import { useCallback } from "react";
import { STATION_LEVELS, CRAFTING_RECIPES } from "./tables";

export default function playerCrafting({ placedItemsRef, posRef, inventory, setInventory }) {
    const canCraftLevel = useCallback((requiredLevel) => {
        if (requiredLevel === 0) return true;

        for (const item of placedItemsRef.current) {
            const stationLevel = STATION_LEVELS.get(item.type);
            if (stationLevel >= requiredLevel) {
            const dx = posRef.current.x - item.x;
            const dy = posRef.current.y - item.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) return true;
            }
        }

        return false;
    }, [placedItemsRef, posRef]);

    const getAvailableCrafts = useCallback(() => {
        return CRAFTING_RECIPES.filter(recipe => {
            if (!canCraftLevel(recipe.level)) return false;

            return recipe.ingredients.every(({ item, quantity }) => {
            return (inventory.get(item) || 0) >= quantity;
            });
        });
    }, [inventory]);

    const craftItem = useCallback((recipe) => {
        const newInventory = new Map(inventory);
        for (const { item, quantity } of recipe.ingredients) {
            newInventory.set(item, newInventory.get(item) - quantity);
            if (newInventory.get(item) <= 0) newInventory.delete(item);
        }

        const current = newInventory.get(recipe.output.item) || 0;
        newInventory.set(recipe.output.item, current + recipe.output.quantity);
        setInventory(newInventory);
    }, [inventory, setInventory]);

    return { getAvailableCrafts, craftItem }
}


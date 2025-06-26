import { useCallback, useRef } from "react";

export default function useAttack({keys, staminaRef, itemsRef, placedItemsRef, enemiesRef, setItems, setPlacedItems, processEntitySet, processItemSet, changeCharacter}) {
    const hasBasic = useRef(false);
    const hasStrong = useRef(false);
    const basicPressed = useRef(false);
    const strongPressed = useRef(false);

    const handleBasicAttack = useCallback(() => {
        const isKeyDown = keys.current['k'];

        if (isKeyDown && !hasBasic.current && !basicPressed.current && staminaRef.current > 50) {
            hasBasic.current = true;
            basicPressed.current = true;

            staminaRef.current = Math.max(0, staminaRef.current - 25);

            const newItems = processItemSet(itemsRef.current, 1);
            const newPlaced = processItemSet(placedItemsRef.current, 1);

            setItems(newItems);
            itemsRef.current = newItems;

            setPlacedItems(newPlaced);
            placedItemsRef.current = newPlaced;

            enemiesRef.current = processEntitySet(enemiesRef.current, 1);

            changeCharacter("😆");

            setTimeout(() => {
                changeCharacter("😀")
                hasBasic.current = false;
            }, 100);
        }

        if (!isKeyDown) {
            basicPressed.current = false;
        }
    }, [keys, hasBasic, hasStrong, basicPressed, strongPressed, staminaRef, itemsRef, placedItemsRef, enemiesRef, setItems, setPlacedItems, processEntitySet, processItemSet, changeCharacter]);

    const handleStrongAttack = useCallback(() => {
        const isKeyDown = keys.current['j'];

        if (isKeyDown && !hasStrong.current && !strongPressed.current && staminaRef.current > 100) {
            hasStrong.current = true;
            strongPressed.current = true;

            staminaRef.current = Math.max(0, staminaRef.current - 60);

            const newItems = processItemSet(itemsRef.current, 3);
            const newPlaced = processItemSet(placedItemsRef.current, 3);

            setItems(newItems);
            itemsRef.current = newItems;

            setPlacedItems(newPlaced);
            placedItemsRef.current = newPlaced;

            enemiesRef.current = processEntitySet(enemiesRef.current, 3);

            changeCharacter("😅");

            setTimeout(() => {
                changeCharacter("😀");
                hasStrong.current = false;
            }, 600);
        }

        if (!isKeyDown) {
            strongPressed.current = false;
        }
    }, [keys, hasBasic, hasStrong, basicPressed, strongPressed, staminaRef, itemsRef, placedItemsRef, enemiesRef, setItems, setPlacedItems, processEntitySet, processItemSet, changeCharacter]);

    return { handleBasicAttack, handleStrongAttack, hasBasic, hasStrong }
}


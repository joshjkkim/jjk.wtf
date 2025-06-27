import { ARMOR_STATS } from "./tables";

export default function playerInventory({hotbar, setHotbar, setInventory, selectedItem, setSelectedItem, setEquipped, setArmor, inventory}) {
    const addToInventory = (item, quantity = 1) => {
        setInventory((prev) => {
            const next = new Map(prev);
            next.set(item, (next.get(item) || 0) + quantity);
            return next;
        });
    }

    const handleInventoryClick = (item) => {

        const armorInfo = ARMOR_STATS[item];
        if (armorInfo) {
            const { slot } = armorInfo;

            setInventory(inv => {
            const next = new Map(inv);
            const cnt = next.get(item);
            if (cnt <= 1) next.delete(item);
            else next.set(item, cnt - 1);
            return next;
            });

            setArmor(prev => {
            const oldItem = prev[slot];
            if (oldItem) {
                setInventory(inv => {
                const next = new Map(inv);
                next.set(oldItem, (next.get(oldItem) || 0) + 1);
                return next;
                });
            }
            return { ...prev, [slot]: item };
            });
            return;
        }

         const newInventory = new Map(inventory);
            const currentCount = newInventory.get(item) || 0;
            if (currentCount <= 0) return;

            const updatedHotbar = [...hotbar];

            let targetIndex = updatedHotbar.findIndex(slot => slot.item === item);

            if (targetIndex === -1) {
                targetIndex = updatedHotbar.findIndex(slot => !slot.item);
            }

            if (targetIndex === -1) return;

            if (updatedHotbar[targetIndex].item === item) {
                updatedHotbar[targetIndex].quantity += 1;
            } else {
                updatedHotbar[targetIndex] = { item, quantity: 1 };
            }

            if (currentCount === 1) {
                newInventory.delete(item);
            } else {
                newInventory.set(item, currentCount - 1);
            }
            setHotbar(updatedHotbar);
            setInventory(newInventory);
    };


    const handleHotbarClick = (slot, index) => {
        if (selectedItem) {
            const updated = [...hotbar];
            if (updated[index].item === selectedItem.type) {
                updated[index].quantity += 1;
            } else {
                updated[index] = { item: selectedItem.type, quantity: 1 };
            }
            setHotbar(updated);+
            setSelectedItem(null);
        } else if (slot.item) {
            const updated = [...hotbar];
            updated[index].quantity -= 1;
            addToInventory(slot.item, 1);
            if (updated[index].quantity <= 0) {
                updated[index] = { item: null, quantity: 0 };
                setEquipped('hands')
            }
            setHotbar(updated);
        }
    }

    function handleArmorClick(slotKey, equippedItem) {
    if (!equippedItem) return
    // remove from armor
    setArmor(prev => ({ ...prev, [slotKey]: null }))
    // add back to inventory
    setInventory(inv => {
      const next = new Map(inv)
      next.set(equippedItem, (next.get(equippedItem) || 0) + 1)
      return next
    })
  }

    return { addToInventory,  handleInventoryClick, handleHotbarClick, handleArmorClick }
}


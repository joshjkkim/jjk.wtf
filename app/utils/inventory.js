import { ARMOR_STATS, MAX_SLOTS, MAX_STACK } from "./tables";

export default function playerInventory({hotbar, setHotbar, setInventory, selectedItem, setSelectedItem, setEquipped, setArmor, inventory, setAlert}) {
    const addToInventory = (item, quantity = 1) => {
        setInventory(prev => {
            const next = new Map(prev);
            const current = next.get(item) || 0;
            const hasItem = current > 0;

            if (!hasItem && next.size >= MAX_SLOTS) {
            setAlert("Inventory is full!");
            setTimeout(() => {
                setAlert("");
            }, 3000)
            return prev;
            }

            if (current + quantity > MAX_STACK) {
            setAlert(`${item} stack is full! (max ${MAX_STACK})`);
            setTimeout(() => {
                setAlert("");
            }, 3000)
            return prev;
            }

            next.set(item, current + quantity);
            return next;
        });
        };

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

        const currentHotbar = hotbar;
        const currentInv = inventory;

        const nextHotbar = [...currentHotbar];
        const nextInv    = new Map(currentInv);

        let idx = nextHotbar.findIndex(s => s.item === item);
        if (idx === -1) {
            idx = nextHotbar.findIndex(s => !s.item);
            if (idx === -1) {

            setAlert('Hotbar is full!');
            setTimeout(() => setAlert(''), 3000);
            return;
            }
        }

        const existingQty = nextHotbar[idx].item === item
            ? nextHotbar[idx].quantity
            : 0;
        if (existingQty + 1 > MAX_STACK) {
            setAlert(`${item} stack is full! (max ${MAX_STACK})`);
            setTimeout(() => setAlert(''), 3000);
            return;
        }

        const invCount = nextInv.get(item) || 0;
        if (invCount <= 0) {
            return;
        }
        if (invCount === 1) nextInv.delete(item);
        else nextInv.set(item, invCount - 1);

        nextHotbar[idx] = {
            item,
            quantity: existingQty + 1
        };
        setHotbar(nextHotbar);
        setInventory(nextInv);
    };


    const handleHotbarClick = (slot, index) => {
    if (selectedItem) {
        const updated = [...hotbar];
        if (updated[index].item === selectedItem.type) {
        updated[index].quantity += 1;
        } else {
        updated[index] = { item: selectedItem.type, quantity: 1 };
        }
        setHotbar(updated);
        setSelectedItem(null);
        return;
    }

    if (!slot.item) return;
    const item = slot.item;

    const currentInv  = inventory.get(item) || 0;
    const hasStackInInv = currentInv > 0;

    if (!hasStackInInv && inventory.size >= MAX_SLOTS) {
        setAlert('Inventory is full!');
        setTimeout(() => {
            setAlert("");
        }, 3000)
        return;
    }

    if (currentInv + 1 > MAX_STACK) {
        setAlert(`${item} stack is full! (max ${MAX_STACK})`);
        setTimeout(() => {
            setAlert("");
        }, 3000)
        return;
    }

    setInventory(inv => {
        const next = new Map(inv);
        next.set(item, currentInv + 1);
        return next;
    });

    const updatedHB = [...hotbar];
    updatedHB[index].quantity -= 1;
    if (updatedHB[index].quantity <= 0) {
        updatedHB[index] = { item: null, quantity: 0 };
        setEquipped('hands');
    }
    setHotbar(updatedHB);
    };

    function handleArmorClick(slotKey, equippedItem) {
    if (!equippedItem) return
    setArmor(prev => ({ ...prev, [slotKey]: null }))
    setInventory(inv => {
      const next = new Map(inv)
      next.set(equippedItem, (next.get(equippedItem) || 0) + 1)
      return next
    })
  }

    return { addToInventory,  handleInventoryClick, handleHotbarClick, handleArmorClick }
}


import { BIOME_TYPES, BIOME_SPAWN_TABLE, TYPE_STATS, BIOME_ENEMIES, ENEMY_STATS, CHUNK_UNLOAD_RADIUS, LOOT_TABLE, TOOL_EFFECTIVENESS, TILE_VARIANTS } from "./tables";

export default function worldChunks({ chunkBiomes, CHUNK_SIZE, loadedChunks, setItems, setPlacedItems, setCollectItems, equippedRef, posRef, enemiesRef, itemsRef, chunkTiles }) {

    const spawnItems = (count, cx, cy, biomeName) => {
        const table = BIOME_SPAWN_TABLE[biomeName];
        const totalW = table.reduce((s, e) => s + e.weight, 0);

        return Array.from({ length: count }, () => {
            let r = Math.random() * totalW;
            let type;
            for (const e of table) {
                if (r < e.weight) { type = e.type; break; }
                r -= e.weight;
            }
            const stats = TYPE_STATS.get(type) || TYPE_STATS.get('bush');
            const size = stats.size;
            const health = Math.floor(
                Math.random() * (stats.healthRange[1] - stats.healthRange[0] + 1)
            ) + stats.healthRange[0];
            return { id: crypto.randomUUID(), type, size, health, maxHealth: health,
                x: cx * CHUNK_SIZE + Math.random() * CHUNK_SIZE,
                y: cy * CHUNK_SIZE + Math.random() * CHUNK_SIZE
            };
        });
    }

    const spawnEnemies = (cx, cy, biomeName, count) => {
        const table = BIOME_ENEMIES[biomeName] || [];
        const totalW = table.reduce((s,e)=>s+e.weight,0);3
        const newEn = [];
        for (let i=0; i<count; i++) {
            let r = Math.random()*totalW, type;
            for (const e of table) {
                if (r < e.weight) { type = e.type; break; }
                r -= e.weight;
            }
            const stats = ENEMY_STATS[type];
            newEn.push({
                id: crypto.randomUUID(),
                type,
                x: cx*CHUNK_SIZE + Math.random()*CHUNK_SIZE,
                y: cy*CHUNK_SIZE + Math.random()*CHUNK_SIZE,
                size: stats.size,
                speed: stats.speed,
                health: stats.health,
                maxHealth: stats.health,
                attack: stats.attack,
                attackRange: stats.attackRange,
                cooldown: stats.attackCooldown,
                knockback: stats.knockback,
                lastAttack: 0,
                isCharging: false,
                warningDuration: stats.warningDuration,          
            });
        }
        enemiesRef.current.push(...newEn);
    }

    const getChunkBiome = (cx, cy) => {
        const key = `${cx},${cy}`;
        if (chunkBiomes.current.has(key)) return chunkBiomes.current.get(key);

        let r = Math.random() * BIOME_TYPES.reduce((s, b) => s + b.weight, 0);
        for (const b of BIOME_TYPES) {
            if (r < b.weight) { chunkBiomes.current.set(key, b); return b; }
            r -= b.weight;
        }
        const fallback = BIOME_TYPES[0];
        chunkBiomes.current.set(key, fallback);
        return fallback;
    }

    const spawnChunk = (cx, cy, count = Math.ceil(Math.random() * 5)) => {
        const key = `${cx},${cy}`
        if (loadedChunks.current.has(key)) return

        const biome = getChunkBiome(cx, cy).name  

        const variants = TILE_VARIANTS[biome] ?? TILE_VARIANTS.forest  
        const tile     = variants[Math.floor(Math.random() * variants.length)]  
        chunkTiles.current.set(key, tile)  

        const newItems = spawnItems(40, cx, cy, biome)
        setItems(prev => { const next = [...prev, ...newItems]; itemsRef.current = next; return next })

        
        spawnEnemies(cx, cy, biome, count)

        loadedChunks.current.add(key)
        }

    const unloadDistantChunks = (playerX, playerY) => {
        const cx = Math.floor(playerX / CHUNK_SIZE);
        const cy = Math.floor(playerY / CHUNK_SIZE);
    
        loadedChunks.current.forEach(key => {
        const [chunkX, chunkY] = key.split(',').map(Number);
    
        if (
            Math.abs(chunkX - cx) > CHUNK_UNLOAD_RADIUS ||
            Math.abs(chunkY - cy) > CHUNK_UNLOAD_RADIUS
        ) {
            loadedChunks.current.delete(key);
    
            setItems(items =>
            items.filter(item => {
                const icx = Math.floor(item.x / CHUNK_SIZE);
                const icy = Math.floor(item.y / CHUNK_SIZE);
                return !(icx === chunkX && icy === chunkY);
            })
            );
    
            setPlacedItems(p =>
            p.filter(i => {
                const icx = Math.floor(i.x / CHUNK_SIZE);
                const icy = Math.floor(i.y / CHUNK_SIZE);
                return !(icx === chunkX && icy === chunkY);
            })
            );
            setCollectItems(c =>
            c.filter(i => {
                const icx = Math.floor(i.x / CHUNK_SIZE);
                const icy = Math.floor(i.y / CHUNK_SIZE);
                return !(icx === chunkX && icy === chunkY);
            })
            );
        }
        });
    }

    const dropLoot = (type, x, y) => {
    const key = String(type).trim().toLowerCase();

    const drops = LOOT_TABLE.get(key);
    if (!drops) {
        console.warn(`No loot table for type "${type}" (normalized "${key}")`);
        return [];
    }

    return drops.flatMap(({ item, chance, min, max }) => {
        if (Math.random() > chance) return [];

        const amount = Math.floor(Math.random() * (max - min + 1)) + min;

        return Array.from({ length: amount }, () => ({
        id:   crypto.randomUUID(),
        type: item,
        x:    x + Math.random() * 20 - 10,
        y:    y + Math.random() * 20 - 10,
        }));
    });
    };

    const processItemSet = (sourceItems, multi) => {
        return sourceItems.filter((item) => {
            if (item?.growthStage < item?.maxGrowthStage) {
                return true;
            }

            const dx = posRef.current.x - item.x;
            const dy = posRef.current.y - item.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
        
            const toolMap = TOOL_EFFECTIVENESS.get(equippedRef.current);
            const damage = toolMap?.get(item.type) ?? 0;
        
            if (dist < item.size + 15 * multi) {
                if (item.inventory?.size) return true;
            item.health -= damage * multi;
        
            if (item.health <= 0) {
                const drops = dropLoot(item.type, item.x, item.y);
                setCollectItems((prev) => [...prev, ...drops]);
                return false;
            }
        
            return true;
            }
        
            return true;
        });
    }

    return { getChunkBiome, spawnChunk, unloadDistantChunks, dropLoot, processItemSet }
}


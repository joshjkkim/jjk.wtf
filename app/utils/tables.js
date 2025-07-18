export const BIOME_TYPES = [
  { name: 'forest', weight: 13 },
  { name: 'desert', weight: 6 },
  { name: 'shallowCave', weight: 2 },
];

export const BIOME_ENEMIES = {
  forest: [ { type: 'wolf', weight: 4 }, { type: 'boar', weight: 1 }, { type: 'deer', weight: 6 } ],
  desert: [ { type: 'scorpion', weight: 8 }, { type: 'snake', weight: 4 }, { type: 'camel', weight: 2 } ],
  shallowCave: [
    { type: 'bat',  weight: 10 },
    { type: 'spider', weight: 6 },
    { type: 'rock_monster', weight: 1 },
  ],
};

export const ENEMY_STATS = {
  wolf:      { size: 50, speed: 0.6, health: 90, attack: 8, attackRange: 25, attackCooldown: 1000, knockback: 10, warningDuration: 500 },
  boar:      { size: 60, speed: 0.4, health: 170, attack: 20, attackRange: 30, attackCooldown: 1000, knockback: 15, warningDuration: 600 },
  deer:  { size: 55, speed: 0.5, health: 90, attack: 1,  attackRange: 30, attackCooldown: 1000, knockback: 5, warningDuration: 400 },
  scorpion:  { size: 40, speed: 0.8, health: 80, attack: 5,  attackRange: 20, attackCooldown: 600, knockback: 8, warningDuration: 300 },
  camel:  { size: 70, speed: 0.3, health: 200, attack: 2,  attackRange: 30, attackCooldown: 1000, knockback: 12, warningDuration: 700 },
  snake:  { size: 60, speed: 0.8, health: 90, attack: 12,  attackRange: 40, attackCooldown: 1200, knockback: 10, warningDuration: 500 },
  bat:  { size: 40, speed: 0.9, health: 80, attack: 7,  attackRange: 20, attackCooldown: 600, knockback: 5, warningDuration: 300 },
  spider:  { size: 60, speed: 0.8, health: 100, attack: 13,  attackRange: 40, attackCooldown: 700, knockback: 8, warningDuration: 400 },
  rock_monster:  { size: 150, speed: 0.4, health: 250, attack: 40,  attackRange: 50, attackCooldown: 1500, knockback: 20, warningDuration: 800 },
};

export const TOOL_EFFECTIVENESS = new Map([
  ['stone sword', new Map([
    ['wolf', 5],
    ['boar', 5],
    ['deer', 5],
    ['camel', 5],
    ['snake', 5],
    ['scorpion', 5],
    ['bat', 5],
    ['spider', 5],
    ['rock_monster', 5],
  ])],
  ['stone pickaxe', new Map([
    ['ironNode', 0.5],
    ['goldNode', 0.5],
    ['stone', 1],
    ['tree', 0.2],
    ['soil', 2],
    ['bush', 0.1],
    ['wood', 2],
    ['workbench', 2],
    ['chest', 2],
    ['rock', 2],
    ['cactus', 1],
    ['dead bush', 2],
    ['wolf', 3],
    ['boar', 3],
    ['deer', 3],
    ['camel', 3],
    ['snake', 3],
    ['scorpion', 3],
    ['bat', 3],
    ['spider', 3],
    ['rock_monster', 6],
  ])],
  ['stone axe', new Map([
    ['tree', 2],
    ['bush', 1],
    ['strawberry bush', 1],
    ['stone', 0.3],
    ['wood', 3],
    ['workbench', 3],
    ['soil', 2],
    ['chest', 2],
    ['rock', 3],
    ['cactus', 4],
    ['dead bush', 2],
    ['wolf', 4],
    ['boar', 4],
    ['deer', 4],
    ['camel', 4],
    ['snake', 4],
    ['scorpion', 4],
    ['bat', 4],
    ['spider', 4],
    ['rock_monster', 4],
  ])],
   ['stick', new Map([
    ['tree', 0.5],
    ['bush', 1],
    ['strawberry bush', 1],
    ['stone', 0.2],
    ['wood', 2],
    ['workbench', 2],
    ['soil', 2],
    ['chest', 2],
    ['rock', 1],
    ['cactus', 2],
    ['dead bush', 1.3],
    ['wolf', 2],
    ['boar', 2],
    ['deer', 2],
    ['camel', 2],
    ['snake', 2],
    ['scorpion', 2],
    ['bat', 2],
    ['spider', 2],
    ['rock_monster', 2],
  ])],
  ['hands', new Map([
    ['bush', 0.3],
    ['strawberry bush', 0.3],
    ['stone', 0.05],
    ['tree', 0.05],
    ['wood', 0.5],
    ['chest', 2],
    ['soil', 2],
    ['rock', 0],
    ['workbench', 0.5],
    ['cactus', 0.5],
    ['dead bush', 0.8],
    ['wolf', 1],
    ['boar', 1],
    ['deer', ],
    ['camel', 1],
    ['snake', 1],
    ['scorpion', 1],
    ['bat', 1],
    ['spider', 1],
    ['rock_monster', 1],
  ])],
]);

export const LOOT_TABLE = new Map([
  ['tree', [
    { item: 'wood', chance: 1.0, min: 2, max: 4 },
    { item: 'leaf', chance: 0.5, min: 1, max: 2 },
    { item: 'apple', chance: 0.7, min: 1, max: 2 },
  ]],
  ['stone', [
    { item: 'rock', chance: 1, min: 1, max: 2 },
    { item: 'coal', chance: 0.2, min: 1, max: 1 }
  ]],
  ['bush', [
    { item: 'strawberry', chance: 0.7, min: 2, max: 3 },
    { item: 'wood', chance: 0.9, min: 1, max: 1 },
  ]],
  ['wood', [
    { item: 'wood', chance: 1, min: 1, max: 1 },
  ]],
  ['rock', [
    { item: 'rock', chance: 1, min: 1, max: 1 },
  ]],
  ['workbench', [
    { item: 'workbench', chance: 1, min: 1, max: 1 },
  ]],
  ['chest', [
    { item: 'chest', chance: 1, min: 1, max: 1 },
  ]],
  ['soil', [
    { item: 'soil', chance: 1, min: 1, max: 1 },
  ]],
  ['dead bush', [
    { item: 'wood', chance: 0.8, min: 1, max: 2 },
    { item: 'nut', chance: 0.8, min: 1, max: 2 },
  ]],
  ['cactus', [
    { item: 'wood', chance: 0.9, min: 2, max: 4 },
    { item: 'thorn', chance: 0.5, min: 1, max: 2 },
    { item: 'prickly pear', chance: 0.7, min: 1, max: 2 },
  ]],
  ['ironNode', [
    { item: 'rock', chance: 1, min: 2, max: 4 },
    { item: 'coal', chance: 0.8, min: 2, max: 3 },
    { item: 'iron ore', chance: 0.8, min: 1, max: 3 },
  ]],
  ['goldnode', [
    { item: 'rock', chance: 1, min: 2, max: 5 },
    { item: 'coal', chance: 0.9, min: 3, max: 4 },
    { item: 'gold ore', chance: 0.9, min: 1, max: 2 },
  ]],


  //Mobs
  ['wolf', [
    { item: 'meat', chance: 1, min: 1, max: 3 },
    { item: 'hide', chance: 0.5, min: 1, max: 2 },
  ]],
  ['boar', [
    { item: 'meat', chance: 1, min: 2, max: 4 },
    { item: 'hide', chance: 0.5, min: 1, max: 3 },
  ]],
  ['deer', [
    { item: 'meat', chance: 1, min: 1, max: 2 },
    { item: 'hide', chance: 0.5, min: 1, max: 1 },
  ]],
  ['scorpion', [
    { item: 'meat', chance: 1, min: 1, max: 2 },
    { item: 'fang', chance: 0.5, min: 1, max: 1 },
  ]],
  ['snake', [
    { item: 'meat', chance: 1, min: 2, max: 3 },
    { item: 'fang', chance: 0.8, min: 1, max: 2 },
  ]],
  ['camel', [
    { item: 'meat', chance: 1, min: 4, max: 5 },
    { item: 'hide', chance: 1, min: 3, max: 5 },
  ]],
  ['bat', [
    { item: 'meat', chance: 1, min: 1, max: 2 },
    { item: 'bat wing', chance: 0.5, min: 1, max: 1 },
  ]],
  ['spider', [
    { item: 'meat', chance: 1, min: 2, max: 3 },
    { item: 'fang', chance: 0.5, min: 1, max: 1 },
  ]],
  ['rock_monster', [
    { item: 'rock', chance: 1, min: 10, max: 20 },
    { item: 'gold ore', chance: 1, min: 1, max: 5 },
    { item: 'iron ore', chance: 1, min: 5, max: 10 },
  ]],
]);

export const CRAFTING_RECIPES = [
  {
    output: { item: 'stick', quantity: 1 },
    ingredients: [
      { item: 'wood', quantity: 3 },
    ],
    level: 0,
  },
  {
    output: { item: 'bone', quantity: 1 },
    ingredients: [
      { item: 'meat', quantity: 1 },
      { item: 'rock', quantity: 1 },
    ],
    level: 0,
  },
  {
    output: { item: 'soil', quantity: 1 },
    ingredients: [
      { item: 'wood', quantity: 1 },
    ],
    level: 0,
  },
  {
    output: { item: 'strawberry seed', quantity: 1 },
    ingredients: [
      { item: 'strawberry', quantity: 3 },
    ],
    level: 0,
  },
  {
    output: { item: 'workbench', quantity: 1 },
    ingredients: [
      { item: 'wood', quantity: 8 },
      { item: 'stick', quantity: 4 },
    ],
    level: 0,
  },
  {
    output: { item: 'leaf boots', quantity: 1 },
    ingredients: [
      { item: 'leaf', quantity: 5 },
      { item: 'thorn', quantity: 5 },
      { item: 'stick', quantity: 3 },
    ],
    level: 1,
  },
  {
    output: { item: 'leaf helmet', quantity: 1 },
    ingredients: [
      { item: 'leaf', quantity: 6 },
      { item: 'thorn', quantity: 7 },
      { item: 'stick', quantity: 5 },
    ],
    level: 1,
  },
  {
    output: { item: 'leaf plate', quantity: 1 },
    ingredients: [
      { item: 'leaf', quantity: 10 },
      { item: 'apple', quantity: 3 },
      { item: 'thorn', quantity: 8 },
      { item: 'stick', quantity: 3 },
    ],
    level: 1,
  },
  {
    output: { item: 'leaf pants', quantity: 1 },
    ingredients: [
      { item: 'leaf', quantity: 12 },
      { item: 'thorn', quantity: 1 },
      { item: 'stick', quantity: 2 },
    ],
    level: 1,
  },
  {
    output: { item: 'stone sword', quantity: 1 },
    ingredients: [
      { item: 'stick', quantity: 3 },
      { item: 'bone', quantity: 2 },
      { item: 'rock', quantity: 8 },
      { item: 'fang', quantity: 1 },
      { item: 'thorn', quantity: 1 },
    ],
    level: 1,
  },
  {
    output: { item: 'stone axe', quantity: 1 },
    ingredients: [
      { item: 'stick', quantity: 8 },
      { item: 'bone', quantity: 2 },
      { item: 'rock', quantity: 3 },
    ],
    level: 1,
  },
  {
    output: { item: 'stone pickaxe', quantity: 1 },
    ingredients: [
      { item: 'stick', quantity: 6 },
      { item: 'bone', quantity: 2 },
      { item: 'rock', quantity: 6 },
    ],
    level: 1,
  },
  {
    output: { item: 'chest', quantity: 1 },
    ingredients: [
      { item: 'stick', quantity: 10 },
      { item: 'rock', quantity: 5 },
    ],
    level: 1,
  },
];

export const CONSUMABLES = [
  { item: 'strawberry', ability: 'STAMINA', amount: 50 },
  { item: 'nut', ability: 'STAMINA', amount: 50 },
  { item: 'apple', ability: 'STAMINA', amount: 100 },
  { item: 'prickly pear', ability: 'STAMINA', amount: 100 },
  { item: 'wood', ability: 'PLACEABLE', amount: 10 },
  { item: 'rock', ability: 'PLACEABLE', amount: 25 },
  { item: 'workbench', ability: 'PLACEABLE', amount: 10 },
  { item: 'chest', ability: 'PLACEABLE', amount: 10 },
  { item: 'meat', ability: 'STAMINA', amount: 150 },
  { item: 'soil', ability: 'PLACEABLE', amount: 10 },
  { item: 'strawberry seed', ability: 'PLANT', amount: 10 },
]

export const STATION_LEVELS = new Map([
  ['workbench', 1],
  ['furnace', 2],
  ['anvil', 3],
]);

export const BIOME_SPAWN_TABLE = {
  forest: [
    { type: 'bush', weight: 5 },
    { type: 'stone', weight: 3 },
    { type: 'tree', weight: 2 },
  ],
  desert: [
    { type: 'dead bush', weight: 6 },
    { type: 'cactus', weight: 4 },
    { type: 'stone',   weight: 2 }
  ],
  shallowCave: [
    { type: 'stone',      weight: 40 },
    { type: 'ironNode', weight: 4 },
    { type: 'goldNode', weight: 2 }
  ],
};

export const TYPE_STATS = new Map([
  ['tree',   { size: 130, healthRange: [14, 20] }],
  ['stone',  { size: 40,  healthRange: [7, 10] }],
  ['cactus',   { size: 80,  healthRange: [10, 16] }],
  ['bush',   { size: 30,  healthRange: [3, 5] }],
  ['dead bush',   { size: 50,  healthRange: [2, 6] }],
  ['ironNode',   { size: 70,  healthRange: [20, 30] }],
  ['goldNode',   { size: 90,  healthRange: [60, 80] }],
]);

export const TEXTURE_MAP = new Map([
  ['hands', '/item/fist.png'],
  ['stone pickaxe', '/item/pickaxe.png'],
  ['stone axe', '/item/axe.png'],
  ['stone sword', '/item/stone_sword.png'],
  ['bone', '/item/bone.png'],
  ['wood', '/item/wood.png'],
  ['strawberry', '/item/berry.png'],
  ['strawberry seed', '/item/strawberry_seed.png'],
  ['coal', '/item/coal.png'],
  ['apple', '/item/apple.png'],
  ['rock', '/item/stone.png'],
  ['leaf', '/item/leaf.png'],
  ['stick', '/item/stick.png'],
  ['workbench', '/place/workbench.png'],
  ['nut', '/item/nut.png'],
  ['thorn', '/item/thorn.png'],
  ['prickly pear', '/item/pricklypear.png'],
  ['meat', '/item/meat.png'],
  ['hide', '/item/hide.png'],
  ['walkietalkie', '/item/walkietalkie.gif'],
  ['bat wing', '/item/bat_wing.png'],
  ['fang', '/item/stinger.png'],
  ['gold ore', '/item/gold_ore.png'],
  ['iron ore', '/item/iron_ore.png'],
  ['raw gold', '/item/raw_gold.png'],
  ['raw iron', '/item/raw_iron.png'],
  ['leaf boots', '/item/leaf_boots.png'],
  ['leaf helmet', '/item/leaf_helmet.png'],
  ['leaf plate', '/item/leaf_plate.png'],
  ['leaf pants', '/item/leaf_pants.png'],
  ['chest', '/place/chest.png'],
  ['soil', '/item/soil.png'],
]);

export const ALL_TEXTURES = Array.from(TEXTURE_MAP.values());

export const VIEW_DIST = 0.5

export const CHUNK_UNLOAD_RADIUS = 1;

export const MAX_SLOTS = 7;

export const MAX_STACK = 50;

export const  TILE_VARIANTS = {
  forest: ['/bg/grass1.png','/bg/grass2.png','/bg/grass3.png'],
  desert: ['/bg/sand1.png','/bg/sand2.png'],
  shallowCave: ['/bg/rock1.png'],
}

export const ARMOR_STATS = {
  'leaf helmet': { slot: 'helmet', bonusHealth: 10 },
  'leaf plate':  { slot: 'plate',  bonusHealth: 15 },
  'leaf pants':  { slot: 'pants',  bonusHealth: 10 },
  'leaf boots':  { slot: 'boots',  bonusHealth: 5 },
};

export const STORAGE_STATS = [
  { item: 'chest', inventory: 5 },
]

export const PLANTS_STATS = {
  'strawberry seed': { name: 'strawberry bush', growthChance: 0.00008, maxGrowth: 4, growthSizeInc: 10 },
};

export const PLANTS_TEXTURES = {
  'strawberry bush' : { texture: { 1 : '/plants/sprout.png', 2 : '/plants/youngbush.png', 3 : '/plants/basicbush.png', 4: '/plants/strawberry_bush.png'}}
}

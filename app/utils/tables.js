export const BIOME_TYPES = [
  { name: 'forest', weight: 5, gradient: 'from-green-800 via-green-900 to-green-700' },
  { name: 'desert', weight: 2, gradient: 'from-yellow-600 via-orange-800 to-yellow-400' },
  // { name: 'snow',   weight: 1, gradient: 'from-blue-300 via-white to-blue-200' },
];

export const BIOME_ENEMIES = {
  forest: [ { type: 'wolf', weight: 3 }, { type: 'boar', weight: 1 } ],
  desert: [ { type: 'scorpion', weight: 4 } ],
};

export const ENEMY_STATS = {
  wolf:      { size: 50, speed: 0.6, health: 80, attack: 8, attackRange: 25, attackCooldown: 500 },
  boar:      { size: 60, speed: 0.4, health: 170, attack: 20, attackRange: 30, attackCooldown: 1000 },
  scorpion:  { size: 40, speed: 0.8, health: 60, attack: 5,  attackRange: 20, attackCooldown: 700 },
};

export const TOOL_EFFECTIVENESS = new Map([
  ['stone pickaxe', new Map([
    ['stone', 2],
    ['tree', 0.2],
    ['bush', 0.1],
    ['wood', 2],
    ['workbench', 2],
    ['rock', 2],
    ['cactus', 1],
    ['dead bush', 2],
    ['wolf', 6],
    ['boar', 6],
    ['scorpion', 6],
  ])],
  ['stone axe', new Map([
    ['tree', 2],
    ['bush', 1],
    ['stone', 0.3],
    ['wood', 3],
    ['workbench', 3],
    ['rock', 3],
    ['cactus', 4],
    ['dead bush', 2],
    ['wolf', 8],
    ['boar', 8],
    ['scorpion', 8],
  ])],
   ['stick', new Map([
    ['tree', 0.5],
    ['bush', 1],
    ['stone', 0.2],
    ['wood', 2],
    ['workbench', 2],
    ['rock', 1],
    ['cactus', 2],
    ['dead bush', 1.3],
    ['wolf', 3],
    ['boar', 3],
    ['scorpion', 3],
  ])],
  ['hands', new Map([
    ['bush', 0.3],
    ['stone', 0.05],
    ['tree', 0.05],
    ['wood', 0.5],
    ['rock', 0],
    ['workbench', 0.5],
    ['cactus', 0.5],
    ['dead bush', 0.8],
    ['wolf', 1],
    ['boar', 1],
    ['scorpion', 1],
  ])],
]);

export const LOOT_TABLE = new Map([
  ['tree', [
    { item: 'wood', chance: 1.0, min: 2, max: 4 },
    { item: 'leaf', chance: 0.5, min: 1, max: 2 },
    { item: 'apple', chance: 0.7, min: 1, max: 2 },
  ]],
  ['stone', [
    { item: 'rock', chance: 1.0, min: 1, max: 2 },
    { item: 'coal', chance: 0.2, min: 1, max: 1 }
  ]],
  ['bush', [
    { item: 'berry', chance: 0.7, min: 2, max: 3 },
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
  ['dead bush', [
    { item: 'wood', chance: 0.8, min: 1, max: 2 },
    { item: 'nut', chance: 0.8, min: 1, max: 2 },
  ]],
  ['cactus', [
    { item: 'wood', chance: 0.9, min: 2, max: 4 },
    { item: 'thorn', chance: 0.5, min: 1, max: 2 },
    { item: 'prickly pear', chance: 0.7, min: 1, max: 2 },
  ]],
  ['wolf', [
    { item: 'meat', chance: 1, min: 1, max: 3 },
    { item: 'hide', chance: 0.5, min: 1, max: 2 },
  ]],
  ['boar', [
    { item: 'meat', chance: 1, min: 2, max: 4 },
    { item: 'hide', chance: 0.5, min: 1, max: 3 },
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
    output: { item: 'workbench', quantity: 1 },
    ingredients: [
      { item: 'wood', quantity: 8 },
      { item: 'stick', quantity: 4 },
    ],
    level: 0,
  },
  {
    output: { item: 'stone axe', quantity: 1 },
    ingredients: [
      { item: 'stick', quantity: 10 },
      { item: 'rock', quantity: 3 },
    ],
    level: 1,
  },
  {
    output: { item: 'stone pickaxe', quantity: 1 },
    ingredients: [
      { item: 'stick', quantity: 8 },
      { item: 'rock', quantity: 6 },
    ],
    level: 1,
  },
];

export const CONSUMABLES = [
  { item: 'berry', ability: 'STAMINA', amount: 50 },
  { item: 'nut', ability: 'STAMINA', amount: 50 },
  { item: 'apple', ability: 'STAMINA', amount: 100 },
  { item: 'prickly pear', ability: 'STAMINA', amount: 100 },
  { item: 'wood', ability: 'PLACEABLE', amount: 10 },
  { item: 'rock', ability: 'PLACEABLE', amount: 25 },
  { item: 'workbench', ability: 'PLACEABLE', amount: 10 },
  { item: 'meat', ability: 'STAMINA', amount: 150 },
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
  snow: [
    { type: 'ice',      weight: 3 },
    { type: 'snowBush', weight: 2 }
  ],
};

export const TYPE_STATS = new Map([
  ['tree',   { size: 130, healthRange: [14, 20] }],
  ['stone',  { size: 40,  healthRange: [7, 10] }],
  ['cactus',   { size: 80,  healthRange: [10, 16] }],
  ['bush',   { size: 30,  healthRange: [3, 5] }],
  ['dead bush',   { size: 50,  healthRange: [2, 6] }],
]);

export const TEXTURE_MAP = new Map([
  ['hands', '/fist.png'],
  ['stone pickaxe', '/pickaxe.png'],
  ['stone axe', '/axe.png'],
  ['wood', '/wood.png'],
  ['berry', '/berry.png'],
  ['coal', '/coal.png'],
  ['apple', '/apple.png'],
  ['rock', '/stone.png'],
  ['leaf', '/leaf.png'],
  ['stick', '/stick.png'],
  ['workbench', '/workbench.png'],
  ['nut', '/nut.png'],
  ['thorn', '/thorn.png'],
  ['prickly pear', '/pricklypear.png'],
  ['meat', '/meat.png'],
    ['hide', '/hide.png'],
]);

export const VIEW_DIST = 0.5

export const CHUNK_UNLOAD_RADIUS = 1;

export const  TILE_VARIANTS = {
  forest: ['/grass1.png','/grass2.png','/grass3.png'],
  desert: ['/sand1.png','/sand2.png'],
}
const COLLECTABLES_PHOTO = new Map([
    ['leaf', '/leaf.png'],
    ['wood', '/wood.png'],
    ['rock', '/stone.png'],
    ['coal', '/coal.png'],
    ['berry', '/berry.png'],
    ['apple', '/apple.png'],
    ['workbench', '/workbench.png'],
    ['nut', '/nut.png'],
    ['thorn', '/thorn.png'],
    ['prickly pear', '/pricklypear.png'],
])

export default function CollectItem({ x, y, itemType }) {
  return (
    <div
      className="absolute text-white text-xs bg-black/20 rounded px-1 flex items-center gap-1"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        padding: '4px 6px',
      }}
    >
      <div
        style={{
          width: '16px',
          height: '16px',
          backgroundImage: `url(${COLLECTABLES_PHOTO.get(itemType)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          flexShrink: 0,
        }}
      />
    </div>
  );
}


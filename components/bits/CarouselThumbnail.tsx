import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";

 
// import './CarouselThumbnail.css';

export interface CarouselItem {
  title: string;
  description: string;
  id: number;
  icon?: React.ReactElement;
  thumbnail: string; // ✅ thumbnail image
}

export interface CarouselProps {
  items?: CarouselItem[];
  baseWidth?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
  round?: boolean;
}

const DEFAULT_ITEMS: CarouselItem[] = [
  {
    id: 1,
    title: 'Text Animations',
    description: 'Cool text animations for your projects.',
 
    thumbnail: 'https://picsum.photos/seed/800/600'
  },
  {
    id: 2,
    title: 'Animations',
    description: 'Smooth animations for your projects.',
 
    thumbnail: 'https://picsum.photos/seed/800/700'
  },
  {
    id: 3,
    title: 'Components',
    description: 'Reusable components for your projects.',
 
    thumbnail: 'https://picsum.photos/seed/800/800'
  },
];

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: 'spring' as const, stiffness: 300, damping: 30 };

interface CarouselItemProps {
  item: CarouselItem;
  index: number;
  itemWidth: number;
  round: boolean;
  trackItemOffset: number;
  x: any;
  transition: any;
}

function CarouselItem({
  item,
  index,
  itemWidth,
  round,
  trackItemOffset,
  x,
  transition
}: CarouselItemProps) {
  const range = [
    -(index + 1) * trackItemOffset,
    -index * trackItemOffset,
    -(index - 1) * trackItemOffset
  ];
  const rotateY = useTransform(x, range, [90, 0, -90], { clamp: false });

  return (
    <motion.div
      className={`carousel-item ${round ? 'round' : ''}`}
      style={{
        width: itemWidth,
        height: round ? itemWidth : '100%',
        rotateY,
        ...(round && { borderRadius: '50%' })
      }}
      transition={transition}
    >
      <div className="carousel-item-content">
        <img src={item.thumbnail} />
      </div>
    </motion.div>
  );
}

export default function CarouselThumbnail({
  items = DEFAULT_ITEMS,
  baseWidth = 300,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  loop = true,
  round = false
}: CarouselProps) {
  const containerPadding = 16;
  const itemWidth = baseWidth - containerPadding * 2;
  const trackItemOffset = itemWidth + GAP;

  const itemsForRender = useMemo(() => {
    if (!loop) return items;
    return [items[items.length - 1], ...items, items[0]];
  }, [items, loop]);

  const [position, setPosition] = useState(loop ? 1 : 0);
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeIndex = loop
    ? (position - 1 + items.length) % items.length
    : Math.min(position, items.length - 1);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const { offset, velocity } = info;
    const dir =
      offset.x < -DRAG_BUFFER || velocity.x < -VELOCITY_THRESHOLD
        ? 1
        : offset.x > DRAG_BUFFER || velocity.x > VELOCITY_THRESHOLD
        ? -1
        : 0;

    if (dir !== 0) {
      setPosition(p =>
        Math.max(0, Math.min(p + dir, itemsForRender.length - 1))
      );
    }
  };

  return (
    <div
      ref={containerRef}
      className="carousel-container"
      style={{ width: baseWidth }}
    >
      <motion.div
        className="carousel-track"
        drag="x"
        style={{
          x,
          gap: GAP,
          perspective: 1000,
          perspectiveOrigin: `${position * trackItemOffset}px 50%`
        }}
        animate={{ x: -position * trackItemOffset }}
        transition={SPRING_OPTIONS}
        onDragEnd={handleDragEnd}
      >
        {itemsForRender.map((item, index) => (
          <CarouselItem
            key={`${item.id}-${index}`}
            item={item}
            index={index}
            itemWidth={itemWidth}
            round={round}
            trackItemOffset={trackItemOffset}
            x={x}
            transition={SPRING_OPTIONS}
          />
        ))}
      </motion.div>

      {/* 🔥 THUMBNAIL NAVIGATION */}
      <div className="carousel-thumbnails">
        {items.map((item, index) => (
          <motion.button
            key={item.id}
            className={`carousel-thumbnail ${
              activeIndex === index ? 'active' : ''
            }`}
            onClick={() => setPosition(loop ? index + 1 : index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img src={item.thumbnail} alt={item.title} />
          </motion.button>
        ))}
      </div>
    </div>
  );
}

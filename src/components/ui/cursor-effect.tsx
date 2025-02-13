import { useEffect, useState } from 'react';

interface CursorPosition {
  x: number;
  y: number;
  isHovering: boolean;
  elementColor?: string;
}

export const CursorEffect = () => {
  const [cursor, setCursor] = useState<CursorPosition>({ 
    x: 0, 
    y: 0, 
    isHovering: false 
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Kiểm tra element dưới con trỏ
      const element = document.elementFromPoint(e.clientX, e.clientY);
      const computedStyle = element ? getComputedStyle(element) : null;
      const color = computedStyle?.color || computedStyle?.backgroundColor;
      
      setCursor({
        x: e.clientX,
        y: e.clientY,
        isHovering: element?.matches('[data-hoverable]') || false,
        elementColor: color
      });
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <>
      {/* Main cursor */}
      <div
        className={`pointer-events-none fixed left-0 top-0 z-50 mix-blend-difference transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          transform: `translate(${cursor.x}px, ${cursor.y}px)`,
        }}
      >
        <div className={`relative -ml-2 -mt-2 h-4 w-4 rounded-full bg-white transition-all duration-200 ease-out ${
          cursor.isHovering ? 'scale-150' : 'scale-100'
        }`} />
      </div>

      {/* Cursor trail effect */}
      <div
        className="pointer-events-none fixed left-0 top-0 z-40 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-300"
        style={{
          transform: `translate(${cursor.x}px, ${cursor.y}px)`,
          background: cursor.isHovering
            ? `radial-gradient(circle at center, ${cursor.elementColor || 'rgba(255,255,255,0.3)'}, transparent 60%)`
            : 'radial-gradient(circle at center, rgba(255,255,255,0.1), transparent 60%)',
          opacity: isVisible ? 1 : 0,
          backdropFilter: 'blur(2px)',
        }}
      />
    </>
  );
}; 
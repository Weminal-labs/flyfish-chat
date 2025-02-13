import { useEffect, useState } from 'react';

interface MousePosition {
  x: number;
  y: number;
}

export const AnimatedBackground = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed left-0 top-0 -z-10 h-full w-full overflow-hidden">
      {/* Main Gradient Background */}
      <div 
        className="absolute inset-0 bg-gray dark:bg-gray-950
          bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(94,2,237,0.3),rgba(255,255,255,0))]
          dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(94,2,237,0.15),rgba(255,255,255,0))]
          animate-gradient"
      >
        {/* Secondary Gradient Layer */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_600px,rgba(42,116,225,0.2),rgba(255,255,255,0))]" />
      </div>
      
      {/* Mouse Follow Effect */}
      <div
        className="absolute blur-[100px] opacity-50 dark:opacity-40 animate-blob transition-all duration-500 ease-in-out"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(94,2,237,0.15), rgba(42,116,225,0.15), transparent 50%)`,
        }}
      />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px] dark:bg-grid-white/[0.05]
          [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_40%,transparent_100%)]"
      />
      
      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              background: i % 2 === 0 ? 'rgba(94,2,237,0.3)' : 'rgba(42,116,225,0.3)',
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}; 
import React from 'react';

interface WithCursorInteractionProps {
  color?: string;
  scale?: number;
  blur?: boolean;
}

export const withCursorInteraction = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithCursorInteractionProps = {}
) => {
  return function WithCursorInteractionComponent(props: P) {
    const { color, scale = 1.5, blur = true } = options;
    
    return (
      <div 
        data-hoverable 
        style={{ 
          '--hover-color': color,
          '--hover-scale': scale,
          '--hover-blur': blur ? '2px' : '0px'
        } as React.CSSProperties}
      >
        <WrappedComponent {...props} />
      </div>
    );
  };
}; 
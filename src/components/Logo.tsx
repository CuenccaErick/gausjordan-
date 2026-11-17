import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon';
}

export function Logo({ className = '', variant = 'full' }: LogoProps) {
  // Renders the exact image file saved by the user in the public directory
  return (
    <img
      src="/{}-Photoroom.png"
      alt="Gauss-Jordan Academy Logo"
      className={`${className} object-contain`}
      style={{ display: 'inline-block', maxWidth: '100%', maxHeight: '100%' }}
    />
  );
}

'use client';

import { useEffect, useState } from 'react';

interface HydrationSafeIconProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

export function HydrationSafeIcon({ children, fallback, className }: HydrationSafeIconProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return fallback || <div className={className} />;
  }

  return <>{children}</>;
}

// Specific wrapper for SVG icons that might be affected by Dark Reader
interface SafeSVGProps {
  className?: string;
  fill?: string;
  stroke?: string;
  viewBox?: string;
  children: React.ReactNode;
  fallbackClassName?: string;
}

export function SafeSVG({
  className,
  fill = 'none',
  stroke = 'currentColor',
  viewBox = '0 0 24 24',
  children,
  fallbackClassName
}: SafeSVGProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className={fallbackClassName || className?.replace('text-', 'bg-').replace('w-6 h-6', 'w-6 h-6 rounded animate-pulse')} />;
  }

  return (
    <svg
      className={className}
      fill={fill}
      stroke={stroke}
      viewBox={viewBox}
      suppressHydrationWarning
    >
      {children}
    </svg>
  );
}

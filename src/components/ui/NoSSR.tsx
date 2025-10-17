'use client';

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// Higher-order component to disable SSR for components that might have hydration issues
export function withNoSSR<P extends object>(Component: ComponentType<P>) {
  return dynamic(() => Promise.resolve(Component), {
    ssr: false,
    loading: () => <div className="w-16 h-16" />, // Placeholder with same dimensions as logo
  });
}

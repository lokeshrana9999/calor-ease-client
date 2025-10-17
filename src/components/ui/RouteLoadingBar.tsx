'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function RouteLoadingBar() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let timeoutId: NodeJS.Timeout;

    const startLoading = () => {
      setIsLoading(true);
      setProgress(0);

      // Simulate progress
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 100);

      // Auto-complete after 5 seconds if route hasn't loaded
      timeoutId = setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setIsLoading(false);
          setProgress(0);
        }, 200);
      }, 5000);
    };

    const stopLoading = () => {
      clearInterval(progressInterval);
      clearTimeout(timeoutId);
      setProgress(100);

      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 200);
    };

    // Listen for route changes
    const handleRouteStart = () => startLoading();

    // Custom event listeners for manual navigation
    window.addEventListener('routeChangeStart', handleRouteStart);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timeoutId);
      window.removeEventListener('routeChangeStart', handleRouteStart);
    };
  }, []);

  // Stop loading when pathname changes
  useEffect(() => {
    if (isLoading) {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 200);
    }
  }, [pathname, isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[10000]">
      <div
        className="h-1 bg-blue-600 transition-all duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// Helper function to trigger loading manually
export const triggerRouteLoading = () => {
  window.dispatchEvent(new Event('routeChangeStart'));
};

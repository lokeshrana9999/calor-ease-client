'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface RouteLoaderProps {
  children: React.ReactNode;
}

export function RouteLoader({ children }: RouteLoaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleStart = () => {
      // Add a small delay to prevent flash for very fast navigations
      timeoutId = setTimeout(() => {
        setIsLoading(true);
      }, 100);
    };

    const handleComplete = () => {
      clearTimeout(timeoutId);
      setIsLoading(false);
    };

    // Listen for route changes
    const originalPush = router.push;
    const originalReplace = router.replace;
    const originalBack = router.back;
    const originalForward = router.forward;

    router.push = (...args) => {
      handleStart();
      return originalPush.apply(router, args);
    };

    router.replace = (...args) => {
      handleStart();
      return originalReplace.apply(router, args);
    };

    router.back = () => {
      handleStart();
      return originalBack.apply(router);
    };

    router.forward = () => {
      handleStart();
      return originalForward.apply(router);
    };

    return () => {
      clearTimeout(timeoutId);
      // Restore original methods
      router.push = originalPush;
      router.replace = originalReplace;
      router.back = originalBack;
      router.forward = originalForward;
    };
  }, [router]);

  // Clear loading when pathname changes (route completed)
  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  return (
    <>
      {children}
      {isLoading && <LoadingOverlay />}
    </>
  );
}

function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm z-[9999] flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        {/* Spinner */}
        <div className="relative">
          <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin">
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Loading text */}
        <div className="text-center">
          <p className="text-gray-700 font-medium">Loading...</p>
          <p className="text-gray-500 text-sm mt-1">Please wait while we load the page</p>
        </div>
      </div>
    </div>
  );
}

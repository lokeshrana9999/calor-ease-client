'use client';

import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface LoadingContextType {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isNavigatingRef = useRef(false);

  const startLoading = () => {
    // Clear any existing timeout
    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
    }

    isNavigatingRef.current = true;

    // Add a small delay to prevent flash for very fast navigations
    const timeout = setTimeout(() => {
      if (isNavigatingRef.current) {
        setIsLoading(true);
      }
    }, 50); // Reduced delay for better responsiveness

    setLoadingTimeout(timeout);
  };

  const stopLoading = () => {
    isNavigatingRef.current = false;

    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
      setLoadingTimeout(null);
    }
    setIsLoading(false);
  };

  // Stop loading when pathname changes (route completed)
  useEffect(() => {
    stopLoading();
  }, [pathname]);

  // Intercept router methods to automatically trigger loading
  useEffect(() => {
    const originalPush = router.push;
    const originalReplace = router.replace;
    const originalBack = router.back;
    const originalForward = router.forward;

    router.push = (href: string, options?: any) => {
      startLoading();
      return originalPush(href, options);
    };

    router.replace = (href: string, options?: any) => {
      startLoading();
      return originalReplace(href, options);
    };

    router.back = () => {
      startLoading();
      return originalBack();
    };

    router.forward = () => {
      startLoading();
      return originalForward();
    };

    // Handle browser back/forward buttons
    const handlePopState = () => {
      startLoading();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      // Restore original methods
      router.push = originalPush;
      router.replace = originalReplace;
      router.back = originalBack;
      router.forward = originalForward;

      window.removeEventListener('popstate', handlePopState);

      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
    };
  }, [router, loadingTimeout]);

  const value: LoadingContextType = {
    isLoading,
    startLoading,
    stopLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {isLoading && <LoadingOverlay />}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

function LoadingOverlay() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm z-[9999] flex items-center justify-center">
      <div className="flex flex-col items-center space-y-6">
        {/* CalorEase Logo/Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-gray-900">CalorEase</span>
        </div>

        {/* Animated Spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-100 rounded-full animate-spin">
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Loading text with animated dots */}
        <div className="text-center">
          <p className="text-gray-700 font-medium text-lg">
            Loading{dots}
          </p>
          <p className="text-gray-500 text-sm mt-1">Please wait while we prepare your page</p>
        </div>

        {/* Progress bar animation */}
        <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLoading } from '@/components/providers/LoadingProvider';

export function useRouteLoading() {
  const router = useRouter();
  const pathname = usePathname();
  const { startLoading } = useLoading();

  useEffect(() => {
    // Store original router methods
    const originalPush = router.push;
    const originalReplace = router.replace;

    // Override router methods
    router.push = (href: string, options?: any) => {
      // Only show loading for different routes
      if (href !== pathname) {
        startLoading();
      }
      return originalPush(href, options);
    };

    router.replace = (href: string, options?: any) => {
      if (href !== pathname) {
        startLoading();
      }
      return originalReplace(href, options);
    };

    // Intercept link clicks
    const handleLinkClick = (event: Event) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a');

      if (link && link.href) {
        const url = new URL(link.href);
        const isInternal = url.origin === window.location.origin;
        const isDifferentRoute = url.pathname !== pathname;

        if (isInternal && isDifferentRoute && !link.target) {
          startLoading();
        }
      }
    };

    // Add global click listener
    document.addEventListener('click', handleLinkClick, true);

    return () => {
      // Restore original methods
      router.push = originalPush;
      router.replace = originalReplace;

      // Remove event listener
      document.removeEventListener('click', handleLinkClick, true);
    };
  }, [router, pathname, startLoading]);
}
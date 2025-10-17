'use client';

import { useRouteLoading } from '@/hooks/useRouteLoading';

interface RouteLoadingWrapperProps {
  children: React.ReactNode;
}

export function RouteLoadingWrapper({ children }: RouteLoadingWrapperProps) {
  // This hook automatically intercepts all router navigation
  useRouteLoading();

  return <>{children}</>;
}

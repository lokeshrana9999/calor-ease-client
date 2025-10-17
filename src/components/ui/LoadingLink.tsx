'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/components/providers/LoadingProvider';

interface LoadingLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  replace?: boolean;
  scroll?: boolean;
  onClick?: () => void;
}

export function LoadingLink({
  href,
  children,
  className,
  replace = false,
  scroll = true,
  onClick
}: LoadingLinkProps) {
  const router = useRouter();
  const { startLoading } = useLoading();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Don't trigger loading for external links or same page links
    if (href.startsWith('http') || href.startsWith('#')) {
      onClick?.();
      return;
    }

    // Don't trigger loading if it's the current page
    if (typeof window !== 'undefined' && window.location.pathname === href) {
      e.preventDefault();
      onClick?.();
      return;
    }

    // Start loading animation
    startLoading();
    onClick?.();

    // Let Next.js handle the navigation
  };

  return (
    <Link
      href={href}
      className={className}
      replace={replace}
      scroll={scroll}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { useLoading } from '@/components/providers/LoadingProvider';
import Button from '@/components/buttons/Button';

interface LoadingButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'ghost' | 'light' | 'dark';
  size?: 'sm' | 'base';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  replace?: boolean;
}

export function LoadingButton({
  href,
  onClick,
  children,
  variant = 'primary',
  size = 'base',
  className,
  disabled = false,
  type = 'button',
  replace = false
}: LoadingButtonProps) {
  const router = useRouter();
  const { startLoading } = useLoading();

  const handleClick = () => {
    onClick?.();

    if (href && !disabled) {
      // Don't trigger loading for external links
      if (href.startsWith('http')) {
        window.open(href, '_blank');
        return;
      }

      // Don't trigger loading if it's the current page
      if (typeof window !== 'undefined' && window.location.pathname === href) {
        return;
      }

      // Start loading animation
      startLoading();

      // Navigate to the new route
      if (replace) {
        router.replace(href);
      } else {
        router.push(href);
      }
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      className={className}
      disabled={disabled}
      type={type}
    >
      {children}
    </Button>
  );
}

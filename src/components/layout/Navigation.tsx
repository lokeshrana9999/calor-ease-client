'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Button from '@/components/buttons/Button';
import ButtonLink from '@/components/links/ButtonLink';

export function Navigation() {
  const { isAuthenticated, logout, user } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <ButtonLink href="/" variant="ghost" className="text-xl font-bold text-gray-900">
                CalorEase
              </ButtonLink>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center space-x-4">
              <ButtonLink href="/auth/login" variant="ghost">
                Sign In
              </ButtonLink>
              <ButtonLink href="/auth/register" variant="primary">
                Get Started
              </ButtonLink>
            </div>

            {/* Mobile Menu Button */}
            <div className="sm:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!isMobileMenuOpen ? (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="sm:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
                <ButtonLink
                  href="/auth/login"
                  variant="ghost"
                  className="block w-full text-left"
                  onClick={closeMobileMenu}
                >
                  Sign In
                </ButtonLink>
                <ButtonLink
                  href="/auth/register"
                  variant="primary"
                  className="block w-full text-center mt-2"
                  onClick={closeMobileMenu}
                >
                  Get Started
                </ButtonLink>
              </div>
            </div>
          )}
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <ButtonLink href="/dashboard" variant="ghost" className="text-xl font-bold text-gray-900">
              CalorEase
            </ButtonLink>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-4">
              <ButtonLink href="/dashboard" variant="ghost">
                Dashboard
              </ButtonLink>
              <ButtonLink href="/calories" variant="ghost">
                Track Calories
              </ButtonLink>
              <ButtonLink href="/meal-plans" variant="ghost">
                Meal Plans
              </ButtonLink>
              <ButtonLink href="/history" variant="ghost">
                History
              </ButtonLink>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Desktop User Info */}
            {user && (
              <span className="text-sm text-gray-600 hidden md:block">
                Welcome, {user.firstName}!
              </span>
            )}

            {/* Desktop Logout */}
            <div className="hidden md:block">
              <Button onClick={handleLogout} variant="outline" size="sm">
                Logout
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!isMobileMenuOpen ? (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              {user && (
                <div className="px-3 py-2 text-sm text-gray-600 border-b border-gray-100 mb-2">
                  Welcome, {user.firstName}!
                </div>
              )}

              <ButtonLink
                href="/dashboard"
                variant="ghost"
                className="block w-full text-left px-3 py-2"
                onClick={closeMobileMenu}
              >
                Dashboard
              </ButtonLink>

              <ButtonLink
                href="/calories"
                variant="ghost"
                className="block w-full text-left px-3 py-2"
                onClick={closeMobileMenu}
              >
                Track Calories
              </ButtonLink>

              <ButtonLink
                href="/meal-plans"
                variant="ghost"
                className="block w-full text-left px-3 py-2"
                onClick={closeMobileMenu}
              >
                Meal Plans
              </ButtonLink>

              <ButtonLink
                href="/history"
                variant="ghost"
                className="block w-full text-left px-3 py-2"
                onClick={closeMobileMenu}
              >
                History
              </ButtonLink>

              <div className="pt-2 border-t border-gray-100">
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full"
                  size="sm"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

'use client';

import * as React from 'react';
import '@/lib/env';

import ButtonLink from '@/components/links/ButtonLink';
import { useAuth } from '@/context/AuthContext';
import { ClientOnly } from '@/components/ui/ClientOnly';
import { SafeSVG } from '@/components/ui/HydrationSafeIcon';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */
import Logo from '~/svg/Logo.svg';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <section className='bg-white'>
      <div className='layout relative flex min-h-screen flex-col items-center justify-center py-12 text-center'>
        <ClientOnly fallback={<div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse" />}>
          <Logo className='w-16' />
        </ClientOnly>
        <h1 className='mt-4 text-4xl font-bold text-gray-900'>CalorEase</h1>
        <p className='mt-2 text-lg text-gray-600 max-w-2xl'>
          Track your calories effortlessly with our intelligent food database.
          Get accurate nutritional information for any dish.
        </p>

        <div className='mt-8 flex flex-col sm:flex-row gap-4'>
          {isAuthenticated ? (
            <ButtonLink href='/dashboard' variant='primary'>
              Go to Dashboard
            </ButtonLink>
          ) : (
            <>
              <ButtonLink href='/auth/register' variant='primary'>
                Get Started
              </ButtonLink>
              <ButtonLink href='/auth/login' variant='outline'>
                Sign In
              </ButtonLink>
            </>
          )}
        </div>

        <div className='mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-4xl'>
          <div className='text-center p-4'>
            <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4'>
              <SafeSVG className='w-6 h-6 text-blue-600' fallbackClassName="w-6 h-6 bg-blue-300 rounded animate-pulse">
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
              </SafeSVG>
            </div>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>Smart Search</h3>
            <p className='text-gray-600 text-sm leading-relaxed'>
              Find calorie information for any dish using our intelligent search powered by USDA data.
            </p>
          </div>

          <div className='text-center p-4'>
            <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4'>
              <SafeSVG className='w-6 h-6 text-green-600' fallbackClassName="w-6 h-6 bg-green-300 rounded animate-pulse">
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
              </SafeSVG>
            </div>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>Accurate Data</h3>
            <p className='text-gray-600 text-sm leading-relaxed'>
              Get precise calorie counts and nutritional information from trusted USDA FoodData Central.
            </p>
          </div>

          <div className='text-center p-4 sm:col-span-2 lg:col-span-1'>
            <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4'>
              <SafeSVG className='w-6 h-6 text-purple-600' fallbackClassName="w-6 h-6 bg-purple-300 rounded animate-pulse">
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4' />
              </SafeSVG>
            </div>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>Serving Control</h3>
            <p className='text-gray-600 text-sm leading-relaxed'>
              Calculate calories for any number of servings with our flexible portion calculator.
            </p>
          </div>
        </div>

        <footer className='absolute bottom-2 text-gray-500 text-xs sm:text-sm text-center px-4'>
          © {new Date().getFullYear()} CalorEase - Your Smart Calorie Tracker
        </footer>
      </div>
    </section>
  );
}

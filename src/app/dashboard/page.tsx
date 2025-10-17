'use client';

import { useAuth } from '@/context/AuthContext';
import { authUtils } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/buttons/Button';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function DashboardPageContent() {
  const { token, user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [tokenExpiration, setTokenExpiration] = useState<Date | null>(null);

  useEffect(() => {
    // Get token expiration
    const expiration = authUtils.getTokenExpiration();
    setTokenExpiration(expiration);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Alternative logout with confirmation - maybe add later
  // const handleLogoutWithConfirm = () => {
  //   if (confirm('Are you sure you want to logout?')) {
  //     logout();
  //     router.push('/');
  //   }
  // };

  // Debug function for token inspection
  // const debugToken = () => {
  //   console.log('Current token:', token);
  //   console.log('Token expiration:', tokenExpiration);
  //   console.log('Is authenticated:', isAuthenticated);
  // };


  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Your CalorEase control center
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* User Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Name:</label>
                    <p className="text-gray-900 break-words">{user.firstName} {user.lastName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email:</label>
                    <p className="text-gray-900 break-all">{user.email}</p>
                  </div>
                </>
              ) : (
                <p className="text-gray-600">User information not available</p>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700">Status:</label>
                <p className="text-green-600 font-medium">Authenticated</p>
              </div>

              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full"
              >
                Logout
              </Button>
            </CardContent>
          </Card>

          {/* Token Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Authentication Token</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Token:</label>
                <div className="mt-1 p-3 bg-gray-100 rounded-md">
                  <code className="text-xs text-gray-800 break-all">
                    {token ? token.substring(0, 50) + '...' : 'No token available'}
                  </code>
                </div>
              </div>

              {tokenExpiration && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Expires:</label>
                  <p className="text-gray-900 text-sm">{tokenExpiration.toLocaleString()}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700">Full Token:</label>
                <textarea
                  readOnly
                  value={token || 'No token available'}
                  className="mt-1 w-full h-24 sm:h-32 p-3 bg-gray-100 rounded-md text-xs font-mono resize-none"
                />
              </div>

              <Button
                onClick={() => navigator.clipboard.writeText(token || '')}
                variant="outline"
                className="w-full"
                disabled={!token}>
                Copy Token to Clipboard
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-6">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/calories')}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Track Calories
              </h3>
              <p className="text-sm text-gray-600">
                Search for dishes and get nutritional information
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/meal-plans')}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Meal Plans</h3>
              <p className="text-sm text-gray-600">Create and manage your meal plans</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/history')}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Search History</h3>
              <p className="text-sm text-gray-600">View and manage your calorie search history</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Profile</h3>
              <p className="text-sm text-gray-600">Manage your account settings</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardPageContent />
    </ProtectedRoute>
  );
}

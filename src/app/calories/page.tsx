'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { CalorieResponse } from '@/lib/types';
import { searchHistoryService } from '@/lib/searchHistory';
import { CalorieSearchForm } from '@/components/calorie/CalorieSearchForm';
import { CalorieResults } from '@/components/calorie/CalorieResults';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/buttons/Button';

function CaloriesPageContent() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [result, setResult] = useState<CalorieResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [recentSearches, setRecentSearches] = useState(searchHistoryService.getRecentSearches(5));
  const [initialDish, setInitialDish] = useState<string>('');
  const [initialServings, setInitialServings] = useState<number>(1);

  useEffect(() => {
    // Get URL parameters for pre-filling form
    const dish = searchParams.get('dish');
    const servings = searchParams.get('servings');

    if (dish) {
      setInitialDish(dish);
    }
    if (servings) {
      const parsedServings = parseFloat(servings);
      if (!isNaN(parsedServings) && parsedServings > 0) {
        setInitialServings(parsedServings);
      }
    }

    // Load recent searches
    setRecentSearches(searchHistoryService.getRecentSearches(5));
  }, [searchParams]);

  const handleResult = (newResult: CalorieResponse) => {
    setResult(newResult);
    setError('');

    // Refresh recent searches
    setRecentSearches(searchHistoryService.getRecentSearches(5));
  };

  // Previous approach - was causing too many re-renders
  // const handleResult = useCallback((newResult: CalorieResponse) => {
  //   setResult(newResult);
  //   setError('');
  //   const updatedHistory = [newResult, ...recentSearches.slice(0, 4)];
  //   setRecentSearches(updatedHistory);
  // }, [recentSearches]);

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setResult(null);
  };

  const clearRecentHistory = () => {
    searchHistoryService.clearHistory();
    setRecentSearches([]);
  };

  const loadFromHistory = (historicalResult: any) => {
    setResult(historicalResult);
    setError('');
  };


  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Calorie Tracker
          </h1>
          <p className="mt-2 text-gray-600">
            Get accurate nutritional information for any dish
          </p>
          <div className="mt-4">
            <Button
              onClick={() => router.push('/dashboard')}
              variant="outline"
            >
              ← Back to Dashboard
            </Button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2 xl:gap-8">
          {/* Left Column - Search Form */}
          <div className="space-y-6">
            <CalorieSearchForm
              onResult={handleResult}
              onError={handleError}
              initialDish={initialDish}
              initialServings={initialServings}
            />

            {/* Recent Search History */}
            {recentSearches.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <CardTitle className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Recent Searches
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => router.push('/history')}
                        variant="ghost"
                        size="sm"
                      >
                        View All
                      </Button>
                      <Button
                        onClick={clearRecentHistory}
                        variant="ghost"
                        size="sm"
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {recentSearches.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => loadFromHistory(item)}
                        className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{item.dish_name}</p>
                            <p className="text-sm text-gray-600">
                              {item.servings} serving{item.servings !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <div className="text-left sm:text-right flex-shrink-0">
                            <p className="font-semibold text-green-600">
                              {item.total_calories} cal
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.calories_per_serving}/serving
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Results */}
          <div className="xl:sticky xl:top-6 xl:self-start">
            <CalorieResults result={result} error={error} />
          </div>
        </div>

        {/* Tips Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Tips for Better Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Search Tips</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Use common dish names like "chicken breast" or "caesar salad"</li>
                  <li>• Try different variations if not found (e.g., "grilled chicken")</li>
                  <li>• Include cooking method when relevant (e.g., "baked potato")</li>
                  <li>• Use simple, descriptive terms</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Serving Sizes</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 1 serving = standard portion size</li>
                  <li>• Use decimals for partial servings (e.g., 0.5)</li>
                  <li>• Maximum 1000 servings allowed</li>
                  <li>• Minimum 0.1 servings required</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function CaloriesPage() {
  return (
    <ProtectedRoute>
      <CaloriesPageContent />
    </ProtectedRoute>
  );
}

'use client';

import { CalorieResponse } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface CalorieResultsProps {
  result: CalorieResponse | null;
  error: string;
}

export function CalorieResults({ result, error }: CalorieResultsProps) {
  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-700">{error}</p>
          <div className="mt-3 text-sm text-red-600">
            <p><strong>Common issues:</strong></p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Dish not found in database - try a more common name</li>
              <li>Invalid serving size - must be between 0.1 and 1000</li>
              <li>Network connection issues</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="py-12">
          <div className="text-center text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-lg font-medium">No results yet</p>
            <p className="text-sm">Enter a dish name above to get calorie information</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Nutritional Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dish Info */}
        <div className="bg-white rounded-lg p-4 border">
          <h3 className="font-semibold text-gray-900 mb-2">
            {result.dish_name}
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Servings:</span>
              <span className="ml-2 font-medium">{result.servings}</span>
            </div>
            <div>
              <span className="text-gray-600">Data Source:</span>
              <span className="ml-2 font-medium text-blue-600">
                {result.source}
              </span>
            </div>
          </div>
        </div>

        {/* Calorie Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-6 border text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {result.calories_per_serving}
            </div>
            <div className="text-sm text-gray-600">Calories per serving</div>
          </div>

          <div className="bg-white rounded-lg p-6 border text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {result.total_calories}
            </div>
            <div className="text-sm text-gray-600">Total calories</div>
          </div>
        </div>

        {/* Calculation Breakdown */}
        <div className="bg-white rounded-lg p-4 border">
          <h4 className="font-medium text-gray-900 mb-3">Calculation Breakdown</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <span className="font-medium">{result.calories_per_serving}</span> calories per serving
              × <span className="font-medium">{result.servings}</span> servings
              = <span className="font-medium text-green-600">{result.total_calories}</span> total calories
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">About this data</p>
              <p>
                Nutritional information is sourced from {result.source} and represents approximate values.
                Actual calorie content may vary based on preparation methods, ingredients, and portion sizes.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


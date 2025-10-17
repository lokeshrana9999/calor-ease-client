'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { calorieApi } from '@/lib/api';
import { CalorieResponse } from '@/lib/types';
import { searchHistoryService } from '@/lib/searchHistory';
import { Input } from '@/components/ui/Input';
import Button from '@/components/buttons/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const calorieSearchSchema = z.object({
  dish_name: z
    .string()
    .min(1, 'Dish name is required')
    .max(100, 'Dish name must be less than 100 characters')
    .regex(
      /^[a-zA-Z0-9\s\-,\']+$/,
      'Dish name can only contain letters, numbers, spaces, hyphens, commas, and apostrophes'
    ),
  servings: z
    .number()
    .min(0.1, 'Servings must be at least 0.1')
    .max(1000, 'Servings cannot exceed 1000'),
});

type CalorieSearchData = z.infer<typeof calorieSearchSchema>;

interface CalorieSearchFormProps {
  onResult: (result: CalorieResponse) => void;
  onError: (error: string) => void;
  initialDish?: string;
  initialServings?: number;
}

export function CalorieSearchForm({ onResult, onError, initialDish, initialServings }: CalorieSearchFormProps) {
  const [isSearching, setIsSearching] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CalorieSearchData>({
    resolver: zodResolver(calorieSearchSchema),
    defaultValues: {
      dish_name: initialDish || '',
      servings: initialServings || 1,
    },
  });

  // Set initial values from props
  useEffect(() => {
    if (initialDish) {
      setValue('dish_name', initialDish);
    }
    if (initialServings) {
      setValue('servings', initialServings);
    }
  }, [initialDish, initialServings, setValue]);

  const onSubmit = async (data: CalorieSearchData) => {
    try {
      setIsSearching(true);
      const result = await calorieApi.getCalories(data);

      // Add to search history
      searchHistoryService.addSearch(result, data.dish_name);

      onResult(result);
      toast.success('Calorie information found!');
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to get calorie information';
      onError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    reset();
    onError('');
  };

  // Alternative clear approach - might be better?
  // const handleClear = useCallback(() => {
  //   reset({ dish_name: '', servings: 1 });
  //   onError('');
  //   setResult(null);
  // }, [reset, onError]);

  // Debug function - remove before production
  // const debugFormState = () => {
  //   console.log('Form errors:', errors);
  //   console.log('Form values:', getValues());
  // };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search Calories
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Dish Name"
            placeholder="e.g., chicken salad, pasta, pizza"
            error={errors.dish_name?.message}
            {...register('dish_name')}
          />

          <Input
            label="Number of Servings"
            type="number"
            step="0.1"
            min="0.1"
            max="1000"
            placeholder="1"
            error={errors.servings?.message}
            {...register('servings', { valueAsNumber: true })}
          />

          <div className="flex gap-3">
            <Button
              type="submit"
              className="flex-1"
              disabled={isSearching}
              isLoading={isSearching}
            >
              {isSearching ? 'Searching...' : 'Get Calories'}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              disabled={isSearching}
            >
              Clear
            </Button>
          </div>
        </form>

        <div className="mt-4 text-xs text-gray-500">
          <p>
            <strong>Tip:</strong> Use common dish names like "chicken breast", "apple pie", or "caesar salad" for best results.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

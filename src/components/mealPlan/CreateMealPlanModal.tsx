'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { mealPlanService } from '@/lib/mealPlan';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import Button from '@/components/buttons/Button';

const createMealPlanSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  description: z.string().max(200, 'Description must be less than 200 characters').optional(),
  calorieTarget: z.number().min(100, 'Calorie target must be at least 100').max(10000, 'Calorie target must be less than 10,000').optional(),
});

type CreateMealPlanData = z.infer<typeof createMealPlanSchema>;

interface CreateMealPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (mealPlanId: string) => void;
}

export function CreateMealPlanModal({ isOpen, onClose, onSuccess }: CreateMealPlanModalProps) {
  let [isCreating, setIsCreating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateMealPlanData>({
    resolver: zodResolver(createMealPlanSchema),
  });

  const onSubmit = async (data: CreateMealPlanData) => {
    try {
      setIsCreating(true);

      let mealPlan = mealPlanService.createMealPlan(
        data.name,
        data.description,
        data.calorieTarget
      );

      toast.success('Meal plan created successfully!');
      reset();
      onSuccess(mealPlan.id);
      onClose();
    } catch (error) {
      console.log('Create error:', error); // Different style
      toast.error('Failed to create meal plan');
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      reset();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Create New Meal Plan
            <Button
              onClick={handleClose}
              variant="ghost"
              size="sm"
              disabled={isCreating}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Plan Name *"
              placeholder="e.g., Weekly Meal Plan, Keto Diet"
              error={errors.name?.message}
              {...register('name')}
            />

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Description
              </label>
              <textarea
                placeholder="Optional description for your meal plan..."
                className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
              )}
            </div>

            <Input
              label="Daily Calorie Target"
              type="number"
              placeholder="e.g., 2000"
              error={errors.calorieTarget?.message}
              {...register('calorieTarget', { valueAsNumber: true })}
            />

            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">Getting Started</p>
                  <p>After creating your meal plan, you can add meals from your search history or track new calories to build your plan.</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                className="flex-1"
                disabled={isCreating}
                isLoading={isCreating}
              >
                {isCreating ? 'Creating...' : 'Create Meal Plan'}
              </Button>
              <Button
                type="button"
                onClick={handleClose}
                variant="outline"
                disabled={isCreating}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


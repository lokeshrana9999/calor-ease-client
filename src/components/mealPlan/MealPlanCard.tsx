'use client';

import { useState } from 'react';
import { MealPlan, mealPlanService } from '@/lib/mealPlan';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/buttons/Button';
import { toast } from 'sonner';

interface MealPlanCardProps {
  mealPlan: MealPlan;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onSetActive: (id: string) => void;
}

export function MealPlanCard({
  mealPlan,
  onEdit,
  onDelete,
  onDuplicate,
  onSetActive
}: MealPlanCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const success = mealPlanService.deleteMealPlan(mealPlan.id);
      if (success) {
        toast.success('Meal plan deleted successfully');
        onDelete(mealPlan.id);
      } else {
        toast.error('Failed to delete meal plan');
      }
    } catch (error) {
      console.error('Failed to delete meal plan:', error);
      toast.error('Failed to delete meal plan');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleDuplicate = () => {
    try {
      const duplicated = mealPlanService.duplicateMealPlan(mealPlan.id);
      if (duplicated) {
        toast.success('Meal plan duplicated successfully');
        onDuplicate(duplicated.id);
      } else {
        toast.error('Failed to duplicate meal plan');
      }
    } catch (error) {
      // TODO: better error handling here
      console.log('Duplicate failed:', error);
      toast.error('Failed to duplicate meal plan');
    }
  };

  const handleSetActive = () => {
    try {
      const success = mealPlanService.setActiveMealPlan(mealPlan.id);
      if (success) {
        toast.success(`"${mealPlan.name}" is now your active meal plan`);
        onSetActive(mealPlan.id);
      } else {
        toast.error('Failed to set active meal plan');
      }
    } catch (error) {
      console.error('Failed to set active meal plan:', error);
      toast.error('Failed to set active meal plan');
    }
  };

  const totalMeals = mealPlan.meals.breakfast.length +
    mealPlan.meals.lunch.length +
    mealPlan.meals.dinner.length;

  // Could optimize these calculations by caching
  const breakfastCalories = mealPlanService.getMealCalories(mealPlan, 'breakfast');
  const lunchCalories = mealPlanService.getMealCalories(mealPlan, 'lunch');
  const dinnerCalories = mealPlanService.getMealCalories(mealPlan, 'dinner');

  // Old way of calculating - keeping for backup
  // const totalMeals = Object.values(mealPlan.meals).reduce((sum, meals) => sum + meals.length, 0);
  // const breakfastCalories = mealPlan.meals.breakfast.reduce((sum, item) => {
  //   const servings = item.servingsOverride || item.servings;
  //   return sum + (servings * item.calories_per_serving);
  // }, 0);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <>
      <Card className={`transition-all duration-200 hover:shadow-lg ${mealPlan.isActive ? 'ring-2 ring-blue-500 bg-blue-50' : ''
        }`}>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="flex-1 min-w-0">
              <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="truncate">{mealPlan.name}</span>
                {mealPlan.isActive && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 self-start">
                    Active
                  </span>
                )}
              </CardTitle>
              {mealPlan.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{mealPlan.description}</p>
              )}
            </div>

            <div className="flex gap-1 flex-shrink-0">
              <Button
                onClick={() => onEdit(mealPlan.id)}
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </Button>

              <Button
                onClick={handleDuplicate}
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </Button>

              <Button
                onClick={() => setShowDeleteConfirm(true)}
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Meal Overview */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-orange-600">
                {breakfastCalories}
              </div>
              <div className="text-xs text-gray-500">
                Breakfast ({mealPlan.meals.breakfast.length})
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">
                {lunchCalories}
              </div>
              <div className="text-xs text-gray-500">
                Lunch ({mealPlan.meals.lunch.length})
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-purple-600">
                {dinnerCalories}
              </div>
              <div className="text-xs text-gray-500">
                Dinner ({mealPlan.meals.dinner.length})
              </div>
            </div>
          </div>

          {/* Total Calories */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Total Calories</span>
              <span className="text-xl font-bold text-gray-900">{mealPlan.totalCalories}</span>
            </div>
            {mealPlan.calorieTarget && (
              <div className="mt-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Target: {mealPlan.calorieTarget}</span>
                  <span>
                    {mealPlan.totalCalories > mealPlan.calorieTarget ? '+' : ''}
                    {mealPlan.totalCalories - mealPlan.calorieTarget}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className={`h-2 rounded-full ${mealPlan.totalCalories <= mealPlan.calorieTarget
                      ? 'bg-green-500'
                      : 'bg-red-500'
                      }`}
                    style={{
                      width: `${Math.min(100, (mealPlan.totalCalories / mealPlan.calorieTarget) * 100)}%`
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
            <span>{totalMeals} meal{totalMeals !== 1 ? 's' : ''}</span>
            <span>Created {formatDate(mealPlan.createdAt)}</span>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={() => onEdit(mealPlan.id)}
              className="flex-1"
              size="sm"
            >
              View & Edit
            </Button>
            {!mealPlan.isActive && (
              <Button
                onClick={handleSetActive}
                variant="outline"
                size="sm"
                className="sm:w-auto"
              >
                Set Active
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-red-700">Delete Meal Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "<strong className="break-words">{mealPlan.name}</strong>"?
                This action cannot be undone.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 order-2 sm:order-1"
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                </Button>
                <Button
                  onClick={() => setShowDeleteConfirm(false)}
                  variant="outline"
                  className="flex-1 order-1 sm:order-2"
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}


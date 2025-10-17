'use client';

import { useState, useEffect } from 'react';
import { SearchHistoryItem } from '@/lib/searchHistory';
import { mealPlanService, MealPlan, MealType } from '@/lib/mealPlan';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import Button from '@/components/buttons/Button';
import { toast } from 'sonner';

interface AddToMealPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  historyItem: SearchHistoryItem | null;
  onSuccess: () => void;
}

export function AddToMealPlanModal({ isOpen, onClose, historyItem, onSuccess }: AddToMealPlanModalProps) {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [selectedMealType, setSelectedMealType] = useState<MealType>('breakfast');
  const [customServings, setCustomServings] = useState<number>(1);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadMealPlans();
      if (historyItem) {
        setCustomServings(historyItem.servings);
      }
    }
  }, [isOpen, historyItem]);

  const loadMealPlans = () => {
    const plans = mealPlanService.getAllMealPlans();
    setMealPlans(plans);

    // Auto-select active plan if available
    const activePlan = plans.find(plan => plan.isActive);
    if (activePlan) {
      setSelectedPlanId(activePlan.id);
    } else if (plans.length > 0) {
      setSelectedPlanId(plans[0].id);
    }
  };

  const handleAddToMealPlan = async () => {
    if (!historyItem || !selectedPlanId) {
      toast.error('Please select a meal plan');
      return;
    }

    setIsAdding(true);
    try {
      const success = mealPlanService.addItemToMeal(
        selectedPlanId,
        selectedMealType,
        historyItem,
        customServings
      );

      if (success) {
        const plan = mealPlanService.getMealPlan(selectedPlanId);
        const mealTypeNames = {
          breakfast: 'breakfast',
          lunch: 'lunch',
          dinner: 'dinner'
        };

        toast.success(`Added "${historyItem.dish_name}" to ${mealTypeNames[selectedMealType]} in "${plan?.name}"`);
        onSuccess();
        onClose();
      } else {
        toast.error('Failed to add item to meal plan');
      }
    } catch (error) {
      console.error('Failed to add item to meal plan:', error);
      toast.error('Failed to add item to meal plan');
    } finally {
      setIsAdding(false);
    }
  };

  const handleClose = () => {
    if (!isAdding) {
      setSelectedPlanId('');
      setSelectedMealType('breakfast');
      setCustomServings(1);
      onClose();
    }
  };

  if (!isOpen || !historyItem) return null;

  const totalCalories = customServings * historyItem.calories_per_serving;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Add to Meal Plan
            <Button
              onClick={handleClose}
              variant="ghost"
              size="sm"
              disabled={isAdding}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Item Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900">{historyItem.dish_name}</h4>
            <div className="text-sm text-gray-600 mt-1">
              {historyItem.calories_per_serving} calories per serving • {historyItem.source}
            </div>
            <div className="text-lg font-semibold text-green-600 mt-2">
              {Math.round(totalCalories)} total calories
            </div>
          </div>

          {/* Servings Input */}
          <Input
            label="Servings"
            type="number"
            min="0.1"
            max="1000"
            step="0.1"
            value={customServings}
            onChange={(e) => setCustomServings(parseFloat(e.target.value) || 1)}
          />

          {/* Meal Plan Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Select Meal Plan
            </label>
            {mealPlans.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <p className="text-sm">No meal plans available</p>
                <Button
                  onClick={() => window.open('/meal-plans', '_blank')}
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                >
                  Create Meal Plan
                </Button>
              </div>
            ) : (
              <select
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a meal plan...</option>
                {mealPlans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} {plan.isActive ? '(Active)' : ''}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Meal Type Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Meal Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['breakfast', 'lunch', 'dinner'] as MealType[]).map((mealType) => (
                <button
                  key={mealType}
                  onClick={() => setSelectedMealType(mealType)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${selectedMealType === mealType
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                    }`}
                >
                  {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleAddToMealPlan}
              className="flex-1"
              disabled={!selectedPlanId || isAdding}
              isLoading={isAdding}
            >
              {isAdding ? 'Adding...' : 'Add to Meal Plan'}
            </Button>
            <Button
              onClick={handleClose}
              variant="outline"
              disabled={isAdding}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


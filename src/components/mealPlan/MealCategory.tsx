'use client';

import { useState } from 'react';
import { MealType, MealPlanItem, mealPlanService } from '@/lib/mealPlan';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/buttons/Button';
import { toast } from 'sonner';

interface MealCategoryProps {
  mealType: MealType;
  items: MealPlanItem[];
  planId: string;
  onUpdate: () => void;
  onAddItems: (mealType: MealType) => void;
}

export function MealCategory({ mealType, items, planId, onUpdate, onAddItems }: MealCategoryProps) {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [newServings, setNewServings] = useState<number>(1);

  // TODO: move this config somewhere else maybe?
  const mealTypeConfig = {
    breakfast: {
      title: 'Breakfast',
      icon: (
        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: 'orange',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
    lunch: {
      title: 'Lunch',
      icon: (
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: 'green',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    dinner: {
      title: 'Dinner',
      icon: (
        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ),
      color: 'purple',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
  };

  const config = mealTypeConfig[mealType];
  const totalCalories = items.reduce((sum, item) => {
    const servings = item.servingsOverride || item.servings;
    return sum + (servings * item.calories_per_serving);
  }, 0);

  const handleRemoveItem = async (itemId: string) => {
    try {
      let success = mealPlanService.removeItemFromMeal(planId, mealType, itemId);
      if (success) {
        toast.success('Item removed from meal');
        onUpdate();
      } else {
        toast.error('Failed to remove item');
      }
    } catch (error) {
      // FIXME: this error handling is pretty basic
      console.error('Failed to remove item:', error);
      toast.error('Failed to remove item');
    }
  };

  const handleUpdateServings = async (itemId: string) => {
    try {
      const success = mealPlanService.updateItemServings(planId, mealType, itemId, newServings);
      if (success) {
        toast.success('Servings updated');
        onUpdate();
        setEditingItem(null);
      } else {
        toast.error('Failed to update servings');
      }
    } catch (error) {
      console.error('Failed to update servings:', error);
      toast.error('Failed to update servings');
    }
  };

  const startEditingServings = (item: MealPlanItem) => {
    setEditingItem(item.mealPlanItemId);
    setNewServings(item.servingsOverride || item.servings);
  };

  const cancelEditing = () => {
    setEditingItem(null);
    setNewServings(1);
  };

  return (
    <Card className={`${config.bgColor} ${config.borderColor} border-l-4`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {config.icon}
            {config.title}
            <span className="text-sm font-normal text-gray-600">
              ({items.length} item{items.length !== 1 ? 's' : ''})
            </span>
          </div>
          <div className="text-right">
            <div className={`text-lg font-semibold text-${config.color}-600`}>
              {Math.round(totalCalories)} cal
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <p className="text-sm">No items in {config.title.toLowerCase()}</p>
            <Button
              onClick={() => onAddItems(mealType)}
              variant="ghost"
              size="sm"
              className="mt-2"
            >
              Add Items
            </Button>
          </div>
        ) : (
          <>
            {items.map((item) => {
              const servings = item.servingsOverride || item.servings;
              const itemCalories = servings * item.calories_per_serving;
              const isEditing = editingItem === item.mealPlanItemId;

              return (
                <div
                  key={item.mealPlanItemId}
                  className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {item.dish_name}
                      </h4>

                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0.1"
                              max="1000"
                              step="0.1"
                              value={newServings}
                              onChange={(e) => setNewServings(parseFloat(e.target.value) || 1)}
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                            <span>servings</span>
                            <Button
                              onClick={() => handleUpdateServings(item.mealPlanItemId)}
                              size="sm"
                              className="px-2 py-1 text-xs"
                            >
                              Save
                            </Button>
                            <Button
                              onClick={cancelEditing}
                              variant="ghost"
                              size="sm"
                              className="px-2 py-1 text-xs"
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditingServings(item)}
                              className="hover:text-blue-600 underline"
                            >
                              {servings} serving{servings !== 1 ? 's' : ''}
                            </button>
                            <span>•</span>
                            <span>{item.calories_per_serving} cal/serving</span>
                          </>
                        )}
                      </div>

                      <div className="text-xs text-gray-500 mt-1">
                        From: {item.source}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <div className="text-right">
                        <div className={`font-semibold text-${config.color}-600`}>
                          {Math.round(itemCalories)} cal
                        </div>
                      </div>

                      <Button
                        onClick={() => handleRemoveItem(item.mealPlanItemId)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}

            <Button
              onClick={() => onAddItems(mealType)}
              variant="outline"
              className="w-full"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add More Items
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}


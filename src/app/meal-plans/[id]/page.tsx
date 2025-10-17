'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { mealPlanService, MealPlan, MealType } from '@/lib/mealPlan';
import { MealCategory } from '@/components/mealPlan/MealCategory';
import { AddItemsModal } from '@/components/mealPlan/AddItemsModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import Button from '@/components/buttons/Button';
import { toast } from 'sonner';

function MealPlanDetailPageContent() {
  const router = useRouter();
  const params = useParams();
  const planId = params.id as string;

  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedCalorieTarget, setEditedCalorieTarget] = useState<number | undefined>();
  const [showAddItemsModal, setShowAddItemsModal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<MealType>('breakfast');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMealPlan();
  }, [planId]);

  const loadMealPlan = () => {
    setIsLoading(true);
    try {
      const plan = mealPlanService.getMealPlan(planId);
      if (plan) {
        setMealPlan(plan);
        setEditedName(plan.name);
        setEditedDescription(plan.description || '');
        setEditedCalorieTarget(plan.calorieTarget);
      } else {
        toast.error('Meal plan not found');
        router.push('/meal-plans');
      }
    } catch (error) {
      console.error('Failed to load meal plan:', error);
      toast.error('Failed to load meal plan');
      router.push('/meal-plans');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!mealPlan) return;

    try {
      const updatedPlan = mealPlanService.updateMealPlan(planId, {
        name: editedName.trim(),
        description: editedDescription.trim() || undefined,
        calorieTarget: editedCalorieTarget,
      });

      if (updatedPlan) {
        setMealPlan(updatedPlan);
        setIsEditing(false);
        toast.success('Meal plan updated successfully');
      } else {
        toast.error('Failed to update meal plan');
      }
    } catch (error) {
      console.error('Failed to update meal plan:', error);
      toast.error('Failed to update meal plan');
    }
  };

  const handleCancelEdit = () => {
    if (mealPlan) {
      setEditedName(mealPlan.name);
      setEditedDescription(mealPlan.description || '');
      setEditedCalorieTarget(mealPlan.calorieTarget);
    }
    setIsEditing(false);
  };

  const handleAddItems = (mealType: MealType) => {
    setSelectedMealType(mealType);
    setShowAddItemsModal(true);
  };

  const handleItemsAdded = () => {
    loadMealPlan();
  };

  const handleSetActive = () => {
    if (!mealPlan) return;

    try {
      const success = mealPlanService.setActiveMealPlan(planId);
      if (success) {
        toast.success(`"${mealPlan.name}" is now your active meal plan`);
        loadMealPlan();
      } else {
        toast.error('Failed to set active meal plan');
      }
    } catch (error) {
      console.error('Failed to set active meal plan:', error);
      toast.error('Failed to set active meal plan');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading meal plan...</p>
        </div>
      </div>
    );
  }

  if (!mealPlan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="py-12 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Meal Plan Not Found</h2>
            <p className="text-gray-600 mb-6">The meal plan you're looking for doesn't exist.</p>
            <Button onClick={() => router.push('/meal-plans')}>
              Back to Meal Plans
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const breakfastCalories = mealPlanService.getMealCalories(mealPlan, 'breakfast');
  const lunchCalories = mealPlanService.getMealCalories(mealPlan, 'lunch');
  const dinnerCalories = mealPlanService.getMealCalories(mealPlan, 'dinner');

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              onClick={() => router.push('/meal-plans')}
              variant="outline"
            >
              ← Back to Meal Plans
            </Button>
            {!mealPlan.isActive && (
              <Button onClick={handleSetActive} variant="outline">
                Set as Active Plan
              </Button>
            )}
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-4">
                      <Input
                        label="Plan Name"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        placeholder="Enter plan name"
                      />
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          Description
                        </label>
                        <textarea
                          value={editedDescription}
                          onChange={(e) => setEditedDescription(e.target.value)}
                          placeholder="Optional description"
                          className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <Input
                        label="Daily Calorie Target"
                        type="number"
                        value={editedCalorieTarget || ''}
                        onChange={(e) => setEditedCalorieTarget(e.target.value ? parseInt(e.target.value) : undefined)}
                        placeholder="e.g., 2000"
                      />
                    </div>
                  ) : (
                    <>
                      <CardTitle className="flex items-center gap-2">
                        {mealPlan.name}
                        {mealPlan.isActive && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Active Plan
                          </span>
                        )}
                      </CardTitle>
                      {mealPlan.description && (
                        <p className="text-gray-600 mt-2">{mealPlan.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>Created {new Date(mealPlan.createdAt).toLocaleDateString()}</span>
                        {mealPlan.updatedAt !== mealPlan.createdAt && (
                          <>
                            <span>•</span>
                            <span>Updated {new Date(mealPlan.updatedAt).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSaveChanges} size="sm">
                        Save
                      </Button>
                      <Button onClick={handleCancelEdit} variant="outline" size="sm">
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Nutrition Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Daily Nutrition Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(breakfastCalories)}
                </div>
                <div className="text-sm text-gray-600">Breakfast Calories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{Math.round(lunchCalories)}</div>
                <div className="text-sm text-gray-600">Lunch Calories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(dinnerCalories)}
                </div>
                <div className="text-sm text-gray-600">
                  Dinner Calories
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {mealPlan.totalCalories}
                </div>
                <div className="text-sm text-gray-600">
                  Total Calories
                </div>
                {mealPlan.calorieTarget && (
                  <div className="mt-2">
                    <div className="text-xs text-gray-500">
                      Target: {mealPlan.calorieTarget} cal
                    </div>
                    <div className={`text-xs font-medium ${mealPlan.totalCalories <= mealPlan.calorieTarget ? 'text-green-600' : 'text-red-600'
                      }`}>
                      {mealPlan.totalCalories > mealPlan.calorieTarget ? '+' : ''}
                      {mealPlan.totalCalories - mealPlan.calorieTarget} cal
                    </div>
                  </div>
                )}
              </div>
            </div>

            {mealPlan.calorieTarget && (
              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress to Target</span>
                  <span>{Math.round((mealPlan.totalCalories / mealPlan.calorieTarget) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${mealPlan.totalCalories <= mealPlan.calorieTarget
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
          </CardContent>
        </Card>

        {/* Meal Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <MealCategory
            mealType="breakfast"
            items={mealPlan.meals.breakfast}
            planId={planId}
            onUpdate={loadMealPlan}
            onAddItems={handleAddItems}
          />

          <MealCategory
            mealType="lunch"
            items={mealPlan.meals.lunch}
            planId={planId}
            onUpdate={loadMealPlan}
            onAddItems={handleAddItems}
          />

          <MealCategory
            mealType="dinner"
            items={mealPlan.meals.dinner}
            planId={planId}
            onUpdate={loadMealPlan}
            onAddItems={handleAddItems}
          />
        </div>

        {/* Add Items Modal */}
        <AddItemsModal
          isOpen={showAddItemsModal}
          onClose={() => setShowAddItemsModal(false)}
          planId={planId}
          mealType={selectedMealType}
          onSuccess={handleItemsAdded}
        />
      </div>
    </div>
  );
}

export default function MealPlanDetailPage() {
  return (
    <ProtectedRoute>
      <MealPlanDetailPageContent />
    </ProtectedRoute>
  );
}


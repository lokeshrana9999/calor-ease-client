'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { mealPlanService, MealPlan } from '@/lib/mealPlan';
import { searchHistoryService } from '@/lib/searchHistory';
import { MealPlanCard } from '@/components/mealPlan/MealPlanCard';
import { CreateMealPlanModal } from '@/components/mealPlan/CreateMealPlanModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import Button from '@/components/buttons/Button';
import { toast } from 'sonner';

function MealPlansPageContent() {
  const router = useRouter();
  let [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<MealPlan[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  let [showCreateModal, setShowCreateModal] = useState(false);
  const [stats, setStats] = useState(mealPlanService.getStatistics());
  const [hasSearchHistory, setHasSearchHistory] = useState(false);

  useEffect(() => {
    loadMealPlans();
    checkSearchHistory();
  }, []);

  useEffect(() => {
    filterPlans();
  }, [mealPlans, searchQuery]);

  const loadMealPlans = () => {
    const plans = mealPlanService.getAllMealPlans();
    setMealPlans(plans);
    setStats(mealPlanService.getStatistics());
  };

  const checkSearchHistory = () => {
    const history = searchHistoryService.getHistory();
    setHasSearchHistory(history.length > 0);
  };

  const filterPlans = () => {
    if (!searchQuery.trim()) {
      setFilteredPlans(mealPlans);
      return;
    }

    let query = searchQuery.toLowerCase();
    let filtered = mealPlans.filter(plan =>
      plan.name.toLowerCase().includes(query) ||
      plan.description?.toLowerCase().includes(query)
    );
    setFilteredPlans(filtered);
  };

  const handleCreateSuccess = (mealPlanId: string) => {
    loadMealPlans();
    router.push(`/meal-plans/${mealPlanId}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/meal-plans/${id}`);
  };

  const handleDelete = (id: string) => {
    loadMealPlans();
  };

  const handleDuplicate = (id: string) => {
    loadMealPlans();
  };

  const handleSetActive = (id: string) => {
    loadMealPlans();
  };

  const handleExportPlans = () => {
    try {
      const exportData = mealPlanService.exportMealPlans();
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `calor-ease-meal-plans-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Meal plans exported successfully');
    } catch (error) {
      console.error('Failed to export meal plans:', error);
      toast.error('Failed to export meal plans');
    }
  };

  // Empty state when no search history
  if (!hasSearchHistory) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">Meal Plans</h1>
            <p className="mt-2 text-gray-600">Plan your meals with tracked calories</p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Start Building Your Meal Plans</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                To create meal plans, you first need to track some calories. Search for dishes to build your history,
                then come back to organize them into meal plans.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => router.push('/calories')}
                  className="px-8"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Track Calories Now
                </Button>
                <Button
                  onClick={() => router.push('/dashboard')}
                  variant="outline"
                >
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Meal Plans</h1>
          <p className="mt-2 text-gray-600">Plan and organize your meals</p>
          <div className="mt-4">
            <Button
              onClick={() => router.push('/dashboard')}
              variant="outline"
            >
              ← Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Statistics */}
        {stats.totalPlans > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="text-xl sm:text-2xl font-bold text-blue-600">{stats.totalPlans}</div>
                <div className="text-xs sm:text-sm text-gray-600">Total Plans</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="text-xl sm:text-2xl font-bold text-green-600">{stats.totalMeals}</div>
                <div className="text-xs sm:text-sm text-gray-600">Total Meals</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="text-xl sm:text-2xl font-bold text-purple-600">{stats.averageCaloriesPerPlan}</div>
                <div className="text-xs sm:text-sm text-gray-600">Avg Calories/Plan</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="text-xl sm:text-2xl font-bold text-orange-600">{stats.activePlans}</div>
                <div className="text-xs sm:text-sm text-gray-600">Active Plans</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Actions Bar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <Input
                  label="Search Meal Plans"
                  placeholder="Search by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="whitespace-nowrap"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  New Plan
                </Button>

                {stats.totalPlans > 0 && (
                  <Button
                    onClick={handleExportPlans}
                    variant="outline"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Results Info */}
        {searchQuery && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              {filteredPlans.length > 0 ? (
                <>
                  Found <span className="font-medium">{filteredPlans.length}</span> meal plan
                  {filteredPlans.length !== 1 ? 's' : ''} matching "
                  <span className="font-medium">{searchQuery}</span>"
                </>
              ) : (
                <>
                  No meal plans found matching "<span className="font-medium">{searchQuery}</span>"
                </>
              )}
              <button
                onClick={() => setSearchQuery('')}
                className="ml-2 text-blue-600 hover:text-blue-500 underline"
              >
                Clear search
              </button>
            </p>
          </div>
        )}

        {/* Meal Plans Grid */}
        {filteredPlans.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {filteredPlans.map((plan) => (
              <MealPlanCard
                key={plan.id}
                mealPlan={plan}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                onSetActive={handleSetActive}
              />
            ))}
          </div>
        ) : !searchQuery && mealPlans.length === 0 ? (
          /* Empty state for no meal plans */
          <Card>
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Meal Plans Yet</h2>
              <p className="text-gray-600 mb-6">Create your first meal plan to start organizing your meals</p>
              <Button onClick={() => setShowCreateModal(true)}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create First Meal Plan
              </Button>
            </CardContent>
          </Card>
        ) : null}

        {/* Create Modal */}
        <CreateMealPlanModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      </div>
    </div>
  );
}

export default function MealPlansPage() {
  return (
    <ProtectedRoute>
      <MealPlansPageContent />
    </ProtectedRoute>
  );
}


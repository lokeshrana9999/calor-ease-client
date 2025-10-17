'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { searchHistoryService, SearchHistoryItem } from '@/lib/searchHistory';
import { SearchHistoryList } from '@/components/history/SearchHistoryList';
import { SearchHistoryStatsComponent } from '@/components/history/SearchHistoryStats';
import { AddToMealPlanModal } from '@/components/history/AddToMealPlanModal';
import { Pagination } from '@/components/ui/Pagination';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/buttons/Button';

const ITEMS_PER_PAGE = 10;

function SearchHistoryPageContent() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setPaginationData] = useState({
    items: [] as SearchHistoryItem[],
    totalItems: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  });
  const [stats, setStats] = useState(searchHistoryService.getStatistics());
  const [isLoading, setIsLoading] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showAddToMealPlan, setShowAddToMealPlan] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<SearchHistoryItem | null>(null);

  // Load history data
  const loadHistoryData = useCallback(() => {
    setIsLoading(true);

    try {
      const data = searchQuery.trim()
        ? searchHistoryService.searchHistory(searchQuery, currentPage, ITEMS_PER_PAGE)
        : searchHistoryService.getPaginatedHistory(currentPage, ITEMS_PER_PAGE);

      setPaginationData(data);
      setStats(searchHistoryService.getStatistics());
    } catch (error) {
      console.error('Failed to load history:', error);
      toast.error('Failed to load search history');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, currentPage]);

  // Load data on mount and when dependencies change
  useEffect(() => {
    loadHistoryData();
  }, [loadHistoryData]);

  // Reset to first page when search query changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemClick = (item: SearchHistoryItem) => {
    // Navigate to calories page and pre-fill the form
    const searchParams = new URLSearchParams({
      dish: item.dish_name,
      servings: item.servings.toString(),
    });
    router.push(`/calories?${searchParams.toString()}`);
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const success = searchHistoryService.deleteSearch(id);
      if (success) {
        toast.success('Search deleted successfully');
        loadHistoryData();
      } else {
        toast.error('Failed to delete search');
      }
    } catch (error) {
      console.log('Delete error:', error); // Different logging style
      toast.error('Failed to delete search');
    }
  };

  const handleClearHistory = () => {
    try {
      searchHistoryService.clearHistory();
      toast.success('Search history cleared successfully');
      setShowClearConfirm(false);
      loadHistoryData();
    } catch (error) {
      // Just log it, not critical
      console.warn('Clear history issue:', error);
      toast.error('Failed to clear search history');
    }
  };

  const handleAddToMealPlan = (item: SearchHistoryItem) => {
    setSelectedHistoryItem(item);
    setShowAddToMealPlan(true);
  };

  const handleMealPlanSuccess = () => {
    // Optionally refresh data or show success message
    // The toast is already shown in the modal
  };

  const handleExportHistory = () => {
    try {
      const exportData = searchHistoryService.exportHistory();
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `calor-ease-history-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('History exported successfully');
    } catch (error) {
      console.error('Failed to export history:', error);
      toast.error('Failed to export search history');
    }
  };

  // Simpler export approach - might switch back to this
  // const handleExportHistory = () => {
  //   const data = JSON.stringify(searchHistoryService.getHistory(), null, 2);
  //   const element = document.createElement('a');
  //   element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(data));
  //   element.setAttribute('download', 'history.json');
  //   element.click();
  // };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Search History
          </h1>
          <p className="mt-2 text-gray-600">
            View and manage your calorie search history
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

        {/* Statistics */}
        <SearchHistoryStatsComponent stats={stats} />

        {/* Search and Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search & Manage History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <Input
                  label="Search History"
                  placeholder="Search by dish name, query, or source..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleExportHistory}
                  variant="outline"
                  disabled={stats.totalSearches === 0}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export
                </Button>

                <Button
                  onClick={() => setShowClearConfirm(true)}
                  variant="outline"
                  disabled={stats.totalSearches === 0}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clear Confirmation Modal */}
        {showClearConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle className="text-red-700">Clear Search History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to clear all search history? This action cannot be undone.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleClearHistory}
                    variant="primary"
                    className="flex-1 bg-red-600 hover:bg-red-700 order-2 sm:order-1"
                  >
                    Yes, Clear All
                  </Button>
                  <Button
                    onClick={() => setShowClearConfirm(false)}
                    variant="outline"
                    className="flex-1 order-1 sm:order-2"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading search history...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Results */}
        {!isLoading && (
          <>
            {searchQuery && (
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  {paginationData.totalItems > 0 ? (
                    <>
                      Found <span className="font-medium">{paginationData.totalItems}</span> result
                      {paginationData.totalItems !== 1 ? 's' : ''} for "
                      <span className="font-medium">{searchQuery}</span>"
                    </>
                  ) : (
                    <>
                      No results found for "<span className="font-medium">{searchQuery}</span>"
                    </>
                  )}
                  <button
                    onClick={() => handleSearch('')}
                    className="ml-2 text-blue-600 hover:text-blue-500 underline"
                  >
                    Clear search
                  </button>
                </p>
              </div>
            )}

            <SearchHistoryList
              items={paginationData.items}
              onItemClick={handleItemClick}
              onDeleteItem={handleDeleteItem}
              onAddToMealPlan={handleAddToMealPlan}
            />

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={paginationData.totalPages}
              totalItems={paginationData.totalItems}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
            />
          </>
        )}

        {/* Add to Meal Plan Modal */}
        <AddToMealPlanModal
          isOpen={showAddToMealPlan}
          onClose={() => setShowAddToMealPlan(false)}
          historyItem={selectedHistoryItem}
          onSuccess={handleMealPlanSuccess}
        />
      </div>
    </div>
  );
}

export default function SearchHistoryPage() {
  return (
    <ProtectedRoute>
      <SearchHistoryPageContent />
    </ProtectedRoute>
  );
}

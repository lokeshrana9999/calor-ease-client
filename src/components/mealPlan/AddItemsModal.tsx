'use client';

import { useState, useEffect } from 'react';
import { SearchHistoryItem, searchHistoryService } from '@/lib/searchHistory';
import { MealType, mealPlanService } from '@/lib/mealPlan';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import Button from '@/components/buttons/Button';
import { toast } from 'sonner';

interface AddItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string;
  mealType: MealType;
  onSuccess: () => void;
}

export function AddItemsModal({ isOpen, onClose, planId, mealType, onSuccess }: AddItemsModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [historyItems, setHistoryItems] = useState<SearchHistoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<SearchHistoryItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [customServings, setCustomServings] = useState<Record<string, number>>({});
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadHistoryItems();
    }
  }, [isOpen]);

  useEffect(() => {
    filterItems();
  }, [historyItems, searchQuery]);

  const loadHistoryItems = () => {
    const items = searchHistoryService.getHistory();
    setHistoryItems(items);
    setSelectedItems(new Set());
    setCustomServings({});
  };

  const filterItems = () => {
    if (!searchQuery.trim()) {
      setFilteredItems(historyItems);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = historyItems.filter(item =>
      item.dish_name.toLowerCase().includes(query) ||
      item.searchQuery.includes(query)
    );
    setFilteredItems(filtered);
  };

  const toggleItemSelection = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
      const newCustomServings = { ...customServings };
      delete newCustomServings[itemId];
      setCustomServings(newCustomServings);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const updateCustomServings = (itemId: string, servings: number) => {
    setCustomServings(prev => ({
      ...prev,
      [itemId]: servings
    }));
  };

  const handleAddItems = async () => {
    if (selectedItems.size === 0) {
      toast.error('Please select at least one item');
      return;
    }

    setIsAdding(true);
    try {
      let addedCount = 0;

      for (const itemId of Array.from(selectedItems)) {
        const item = historyItems.find(h => h.id === itemId);
        if (item) {
          const servings = customServings[itemId];
          const success = mealPlanService.addItemToMeal(planId, mealType, item, servings);
          if (success) {
            addedCount++;
          }
        }
      }

      if (addedCount > 0) {
        toast.success(`Added ${addedCount} item${addedCount !== 1 ? 's' : ''} to ${mealType}`);
        onSuccess();
        onClose();
      } else {
        toast.error('Failed to add items');
      }
    } catch (error) {
      console.error('Failed to add items:', error);
      toast.error('Failed to add items');
    } finally {
      setIsAdding(false);
    }
  };

  const handleClose = () => {
    if (!isAdding) {
      setSearchQuery('');
      setSelectedItems(new Set());
      setCustomServings({});
      onClose();
    }
  };

  const mealTypeNames = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Add Items to {mealTypeNames[mealType]}
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

        <CardContent className="flex flex-col h-full max-h-[calc(90vh-120px)]">
          {/* Search */}
          <div className="mb-4">
            <Input
              placeholder="Search your calorie history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto mb-4">
            {filteredItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {historyItems.length === 0 ? (
                  <>
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p>No search history found</p>
                    <p className="text-sm mt-1">Track some calories first to add items to meal plans</p>
                  </>
                ) : (
                  <>
                    <p>No items found matching "{searchQuery}"</p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-blue-600 hover:text-blue-500 underline text-sm mt-1"
                    >
                      Clear search
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredItems.map((item) => {
                  const isSelected = selectedItems.has(item.id);
                  const customServing = customServings[item.id];
                  const displayServings = customServing || item.servings;
                  const totalCalories = displayServings * item.calories_per_serving;

                  return (
                    <div
                      key={item.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                      onClick={() => toggleItemSelection(item.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleItemSelection(item.id)}
                            className="mt-1"
                          />

                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900">{item.dish_name}</h4>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                              <span>{item.calories_per_serving} cal/serving</span>
                              <span>•</span>
                              <span>From: {item.source}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 ml-4">
                          {isSelected && (
                            <div className="flex items-center gap-2">
                              <label className="text-sm text-gray-600">Servings:</label>
                              <input
                                type="number"
                                min="0.1"
                                max="1000"
                                step="0.1"
                                value={displayServings}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  updateCustomServings(item.id, parseFloat(e.target.value) || item.servings);
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                            </div>
                          )}

                          <div className="text-right">
                            <div className="font-semibold text-green-600">
                              {Math.round(totalCalories)} cal
                            </div>
                            <div className="text-xs text-gray-500">
                              {displayServings} serving{displayServings !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-gray-600">
              {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleClose}
                variant="outline"
                disabled={isAdding}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddItems}
                disabled={selectedItems.size === 0 || isAdding}
                isLoading={isAdding}
              >
                {isAdding ? 'Adding...' : `Add to ${mealTypeNames[mealType]}`}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


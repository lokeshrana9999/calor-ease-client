'use client';

import { useState } from 'react';
import { SearchHistoryItem } from '@/lib/searchHistory';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/buttons/Button';

interface SearchHistoryListProps {
  items: SearchHistoryItem[];
  onItemClick?: (item: SearchHistoryItem) => void;
  onDeleteItem?: (id: string) => void;
  onAddToMealPlan?: (item: SearchHistoryItem) => void;
  showActions?: boolean;
}

export function SearchHistoryList({
  items,
  onItemClick,
  onDeleteItem,
  onAddToMealPlan,
  showActions = true
}: SearchHistoryListProps) {
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const handleDelete = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setDeletingIds(prev => new Set(prev).add(id));

    try {
      await onDeleteItem?.(id);
    } finally {
      setDeletingIds(prev => {
        let newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 168) { // 7 days
      const days = Math.floor(diffInHours / 24);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (items.length === 0) {
    return (
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="py-12">
          <div className="text-center text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-medium">No search history found</p>
            <p className="text-sm">Start searching for dishes to build your history</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Card
          key={item.id}
          className={`transition-all duration-200 hover:shadow-md border-l-4 border-l-blue-500 ${onItemClick ? 'cursor-pointer hover:bg-gray-50' : ''
            }`}
          onClick={() => onItemClick?.(item)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {item.dish_name}
                  </h3>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {item.servings} serving{item.servings !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-sm text-gray-600 mb-2">
                  <div>
                    <span className="font-medium text-green-600">
                      {item.total_calories}
                    </span>
                    <span className="ml-1 text-xs sm:text-sm">total cal</span>
                  </div>
                  <div>
                    <span className="font-medium">
                      {item.calories_per_serving}
                    </span>
                    <span className="ml-1 text-xs sm:text-sm">per serving</span>
                  </div>
                  <div className="hidden lg:block">
                    <span className="font-medium">Source:</span>
                    <span className="ml-1">{item.source}</span>
                  </div>
                  <div className="hidden lg:block">
                    <span className="font-medium">Query:</span>
                    <span className="ml-1 italic truncate">"{item.searchQuery}"</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {formatDate(item.timestamp)}
                  </span>

                  {showActions && (
                    <div className="flex gap-1">
                      {onAddToMealPlan && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToMealPlan(item);
                          }}
                          variant="ghost"
                          size="sm"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </Button>
                      )}

                      {onDeleteItem && (
                        <Button
                          onClick={(e) => handleDelete(item.id, e)}
                          variant="ghost"
                          size="sm"
                          disabled={deletingIds.has(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          {deletingIds.has(item.id) ? (
                            <div className="w-4 h-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

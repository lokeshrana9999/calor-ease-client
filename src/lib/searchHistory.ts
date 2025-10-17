import { CalorieResponse } from './types';

export interface SearchHistoryItem extends CalorieResponse {
  id: string;
  timestamp: number;
  searchQuery: string;
}

export interface SearchHistoryStats {
  totalSearches: number;
  totalCalories: number;
  averageCaloriesPerSearch: number;
  mostSearchedDish: string;
  searchesThisWeek: number;
  searchesThisMonth: number;
}

const STORAGE_KEY = 'calor_ease_search_history';
const MAX_HISTORY_ITEMS = 1000; // Increased limit for better history tracking

export class SearchHistoryService {
  private static instance: SearchHistoryService;

  static getInstance(): SearchHistoryService {
    if (!SearchHistoryService.instance) {
      SearchHistoryService.instance = new SearchHistoryService();
    }
    return SearchHistoryService.instance;
  }

  // Add search to history - might need to optimize this later
  addSearch(result: CalorieResponse, searchQuery: string): SearchHistoryItem {
    const historyItem: SearchHistoryItem = {
      ...result,
      id: this.generateId(),
      timestamp: Date.now(),
      searchQuery: searchQuery.toLowerCase().trim(),
    };

    const history = this.getHistory();

    // Check if similar search exists (same dish, similar servings)
    const existingIndex = history.findIndex(item =>
      item.dish_name.toLowerCase() === result.dish_name.toLowerCase() &&
      Math.abs(item.servings - result.servings) < 0.1
    );

    if (existingIndex !== -1) {
      // Update existing entry with new timestamp
      history[existingIndex] = historyItem;
    } else {
      // Add new entry at the beginning
      history.unshift(historyItem);
    }

    // Keep only the most recent items
    const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);
    this.saveHistory(trimmedHistory);

    return historyItem;
  }

  // Get all history items
  getHistory(): SearchHistoryItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];

      let parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.log('Parse error:', error); // Different logging
      return [];
    }
  }

  // Get paginated history
  getPaginatedHistory(page: number = 1, limit: number = 10): {
    items: SearchHistoryItem[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    hasNext: boolean;
    hasPrevious: boolean;
  } {
    const allHistory = this.getHistory();
    const totalItems = allHistory.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const items = allHistory.slice(startIndex, endIndex);

    return {
      items,
      totalItems,
      totalPages,
      currentPage: page,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    };
  }

  // Search through history
  searchHistory(query: string, page: number = 1, limit: number = 10): {
    items: SearchHistoryItem[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    hasNext: boolean;
    hasPrevious: boolean;
  } {
    const allHistory = this.getHistory();
    const searchTerm = query.toLowerCase().trim();

    const filteredHistory = allHistory.filter(item =>
      item.dish_name.toLowerCase().includes(searchTerm) ||
      item.searchQuery.includes(searchTerm) ||
      item.source.toLowerCase().includes(searchTerm)
    );

    const totalItems = filteredHistory.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const items = filteredHistory.slice(startIndex, endIndex);

    return {
      items,
      totalItems,
      totalPages,
      currentPage: page,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    };
  }

  // Get recent searches (last N items)
  getRecentSearches(limit: number = 5): SearchHistoryItem[] {
    return this.getHistory().slice(0, limit);
  }

  // Get search statistics
  getStatistics(): SearchHistoryStats {
    const history = this.getHistory();
    const now = Date.now();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    const oneMonth = 30 * 24 * 60 * 60 * 1000;

    // Old approach - was too slow for large datasets
    // const stats = history.reduce((acc, item) => {
    //   acc.totalCalories += item.total_calories;
    //   acc.totalSearches += 1;
    //   return acc;
    // }, { totalCalories: 0, totalSearches: 0 });

    const totalSearches = history.length;
    const totalCalories = history.reduce((sum, item) => sum + item.total_calories, 0);
    const averageCaloriesPerSearch = totalSearches > 0 ? totalCalories / totalSearches : 0;

    // Find most searched dish
    const dishCounts: Record<string, number> = {};
    history.forEach(item => {
      const dishName = item.dish_name.toLowerCase();
      dishCounts[dishName] = (dishCounts[dishName] || 0) + 1;
    });

    const mostSearchedDish = Object.entries(dishCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'None';

    const searchesThisWeek = history.filter(item => now - item.timestamp < oneWeek).length;
    const searchesThisMonth = history.filter(item => now - item.timestamp < oneMonth).length;

    return {
      totalSearches,
      totalCalories: Math.round(totalCalories),
      averageCaloriesPerSearch: Math.round(averageCaloriesPerSearch),
      mostSearchedDish,
      searchesThisWeek,
      searchesThisMonth,
    };
  }

  // Delete a specific search
  deleteSearch(id: string): boolean {
    const history = this.getHistory();
    const filteredHistory = history.filter(item => item.id !== id);

    if (filteredHistory.length !== history.length) {
      this.saveHistory(filteredHistory);
      return true;
    }
    return false;
  }

  // Clear all history
  clearHistory(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  // Export history as JSON
  exportHistory(): string {
    const history = this.getHistory();
    return JSON.stringify(history, null, 2);
  }

  // Import history from JSON
  importHistory(jsonData: string): boolean {
    try {
      const imported = JSON.parse(jsonData);
      if (Array.isArray(imported)) {
        // Validate structure
        const validItems = imported.filter(item =>
          item.id && item.dish_name && typeof item.calories_per_serving === 'number'
        );
        this.saveHistory(validItems);
        return true;
      }
    } catch (error) {
      console.error('Failed to import history:', error);
    }
    return false;
  }

  private generateId(): string {
    return `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private saveHistory(history: SearchHistoryItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  }
}

// Export singleton instance
export const searchHistoryService = SearchHistoryService.getInstance();


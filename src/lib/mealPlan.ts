import { SearchHistoryItem } from './searchHistory';

export type MealType = 'breakfast' | 'lunch' | 'dinner';

export interface MealPlanItem extends SearchHistoryItem {
  mealPlanItemId: string;
  addedAt: number;
  servingsOverride?: number; // Allow users to adjust servings for meal plan
}

export interface MealPlan {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
  meals: {
    breakfast: MealPlanItem[];
    lunch: MealPlanItem[];
    dinner: MealPlanItem[];
  };
  totalCalories: number;
  isActive: boolean;
  calorieTarget?: number;
}

export interface MealPlanStats {
  totalPlans: number;
  totalMeals: number;
  averageCaloriesPerPlan: number;
  mostUsedDish: string;
  activePlans: number;
  totalCaloriesAcrossPlans: number;
}

const STORAGE_KEY = 'calor_ease_meal_plans';
const MAX_MEAL_PLANS = 50;

export class MealPlanService {
  private static instance: MealPlanService;

  static getInstance(): MealPlanService {
    if (!MealPlanService.instance) {
      MealPlanService.instance = new MealPlanService();
    }
    return MealPlanService.instance;
  }

  // TODO: maybe add validation here later
  createMealPlan(name: string, description?: string, calorieTarget?: number): MealPlan {
    const mealPlan: MealPlan = {
      id: this.generateId(),
      name: name.trim(),
      description: description?.trim(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      meals: {
        breakfast: [],
        lunch: [],
        dinner: [],
      },
      totalCalories: 0,
      isActive: false,
      calorieTarget,
    };

    const plans = this.getAllMealPlans();
    plans.unshift(mealPlan);

    // Keep only the most recent plans
    const trimmedPlans = plans.slice(0, MAX_MEAL_PLANS);
    this.saveMealPlans(trimmedPlans);

    return mealPlan;
  }

  // Get all meal plans
  getAllMealPlans(): MealPlan[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];

      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Failed to parse meal plans:', error);
      return [];
    }
  }

  // Get a specific meal plan by ID
  getMealPlan(id: string): MealPlan | null {
    const plans = this.getAllMealPlans();
    return plans.find(plan => plan.id === id) || null;
  }

  // Update a meal plan
  updateMealPlan(id: string, updates: Partial<MealPlan>): MealPlan | null {
    const plans = this.getAllMealPlans();
    const planIndex = plans.findIndex(plan => plan.id === id);

    if (planIndex === -1) return null;

    const updatedPlan = {
      ...plans[planIndex],
      ...updates,
      updatedAt: Date.now(),
    };

    // Recalculate total calories
    updatedPlan.totalCalories = this.calculateTotalCalories(updatedPlan);

    plans[planIndex] = updatedPlan;
    this.saveMealPlans(plans);

    return updatedPlan;
  }

  // Delete a meal plan
  deleteMealPlan(id: string): boolean {
    const plans = this.getAllMealPlans();
    const filteredPlans = plans.filter(plan => plan.id !== id);

    if (filteredPlans.length !== plans.length) {
      this.saveMealPlans(filteredPlans);
      return true;
    }
    return false;
  }

  // Add item to meal - this could probably be cleaner
  addItemToMeal(planId: string, mealType: MealType, historyItem: SearchHistoryItem, servingsOverride?: number): MealPlan | null {
    const plan = this.getMealPlan(planId);
    if (!plan) return null;

    const mealPlanItem: MealPlanItem = {
      ...historyItem,
      mealPlanItemId: this.generateId(),
      addedAt: Date.now(),
      servingsOverride,
    };

    // Check if item already exists in this meal
    const existingItemIndex = plan.meals[mealType].findIndex(
      item => item.dish_name.toLowerCase() === historyItem.dish_name.toLowerCase()
    );

    if (existingItemIndex !== -1) {
      // Update existing item
      plan.meals[mealType][existingItemIndex] = mealPlanItem;
    } else {
      // Add new item
      plan.meals[mealType].push(mealPlanItem);
    }

    return this.updateMealPlan(planId, { meals: plan.meals });
  }

  // Remove item from a meal
  removeItemFromMeal(planId: string, mealType: MealType, mealPlanItemId: string): MealPlan | null {
    const plan = this.getMealPlan(planId);
    if (!plan) return null;

    plan.meals[mealType] = plan.meals[mealType].filter(
      item => item.mealPlanItemId !== mealPlanItemId
    );

    return this.updateMealPlan(planId, { meals: plan.meals });
  }

  // Move item between meals
  moveItemBetweenMeals(planId: string, fromMeal: MealType, toMeal: MealType, mealPlanItemId: string): MealPlan | null {
    const plan = this.getMealPlan(planId);
    if (!plan) return null;

    const itemIndex = plan.meals[fromMeal].findIndex(item => item.mealPlanItemId === mealPlanItemId);
    if (itemIndex === -1) return null;

    const item = plan.meals[fromMeal][itemIndex];
    plan.meals[fromMeal].splice(itemIndex, 1);
    plan.meals[toMeal].push(item);

    return this.updateMealPlan(planId, { meals: plan.meals });
  }

  // Update item servings in meal plan
  updateItemServings(planId: string, mealType: MealType, mealPlanItemId: string, newServings: number): MealPlan | null {
    const plan = this.getMealPlan(planId);
    if (!plan) return null;

    const itemIndex = plan.meals[mealType].findIndex(item => item.mealPlanItemId === mealPlanItemId);
    if (itemIndex === -1) return null;

    plan.meals[mealType][itemIndex].servingsOverride = newServings;
    return this.updateMealPlan(planId, { meals: plan.meals });
  }

  // Set active meal plan
  setActiveMealPlan(id: string): boolean {
    const plans = this.getAllMealPlans();
    let found = false;

    const updatedPlans = plans.map(plan => {
      if (plan.id === id) {
        found = true;
        return { ...plan, isActive: true, updatedAt: Date.now() };
      } else {
        return { ...plan, isActive: false };
      }
    });

    if (found) {
      this.saveMealPlans(updatedPlans);
    }
    return found;
  }

  // Get active meal plan
  getActiveMealPlan(): MealPlan | null {
    const plans = this.getAllMealPlans();
    return plans.find(plan => plan.isActive) || null;
  }

  // Duplicate a meal plan
  duplicateMealPlan(id: string, newName?: string): MealPlan | null {
    const originalPlan = this.getMealPlan(id);
    if (!originalPlan) return null;

    const duplicatedPlan: MealPlan = {
      ...originalPlan,
      id: this.generateId(),
      name: newName || `${originalPlan.name} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isActive: false,
      // Generate new IDs for all meal items
      meals: {
        breakfast: originalPlan.meals.breakfast.map(item => ({
          ...item,
          mealPlanItemId: this.generateId(),
          addedAt: Date.now(),
        })),
        lunch: originalPlan.meals.lunch.map(item => ({
          ...item,
          mealPlanItemId: this.generateId(),
          addedAt: Date.now(),
        })),
        dinner: originalPlan.meals.dinner.map(item => ({
          ...item,
          mealPlanItemId: this.generateId(),
          addedAt: Date.now(),
        })),
      },
    };

    const plans = this.getAllMealPlans();
    plans.unshift(duplicatedPlan);
    this.saveMealPlans(plans.slice(0, MAX_MEAL_PLANS));

    return duplicatedPlan;
  }

  // Get meal plan statistics
  getStatistics(): MealPlanStats {
    const plans = this.getAllMealPlans();

    const totalPlans = plans.length;
    const activePlans = plans.filter(plan => plan.isActive).length;
    const totalMeals = plans.reduce((sum, plan) =>
      sum + plan.meals.breakfast.length + plan.meals.lunch.length + plan.meals.dinner.length, 0
    );

    const totalCaloriesAcrossPlans = plans.reduce((sum, plan) => sum + plan.totalCalories, 0);
    const averageCaloriesPerPlan = totalPlans > 0 ? totalCaloriesAcrossPlans / totalPlans : 0;

    // Find most used dish
    const dishCounts: Record<string, number> = {};
    plans.forEach(plan => {
      Object.values(plan.meals).flat().forEach(item => {
        const dishName = item.dish_name.toLowerCase();
        dishCounts[dishName] = (dishCounts[dishName] || 0) + 1;
      });
    });

    const mostUsedDish = Object.entries(dishCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'None';

    return {
      totalPlans,
      totalMeals,
      averageCaloriesPerPlan: Math.round(averageCaloriesPerPlan),
      mostUsedDish,
      activePlans,
      totalCaloriesAcrossPlans: Math.round(totalCaloriesAcrossPlans),
    };
  }

  // Clear all meal plans
  clearAllMealPlans(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  // Export meal plans as JSON
  exportMealPlans(): string {
    const plans = this.getAllMealPlans();
    return JSON.stringify(plans, null, 2);
  }

  // Import meal plans from JSON
  importMealPlans(jsonData: string): boolean {
    try {
      const imported = JSON.parse(jsonData);
      if (Array.isArray(imported)) {
        // Validate structure
        const validPlans = imported.filter(plan =>
          plan.id && plan.name && plan.meals &&
          typeof plan.totalCalories === 'number'
        );
        this.saveMealPlans(validPlans);
        return true;
      }
    } catch (error) {
      console.error('Failed to import meal plans:', error);
    }
    return false;
  }

  // Calculate total calories for a meal plan
  private calculateTotalCalories(plan: MealPlan): number {
    let total = 0;

    Object.values(plan.meals).forEach(mealItems => {
      mealItems.forEach(item => {
        const servings = item.servingsOverride || item.servings;
        const caloriesPerServing = item.calories_per_serving;
        total += servings * caloriesPerServing;
      });
    });

    return Math.round(total);
  }

  // Functional approach - cleaner but maybe overkill?
  // private calculateTotalCalories(plan: MealPlan): number {
  //   return Math.round(
  //     Object.values(plan.meals)
  //       .flat()
  //       .reduce((total, item) => {
  //         const servings = item.servingsOverride || item.servings;
  //         return total + (servings * item.calories_per_serving);
  //       }, 0)
  //   );
  // }

  // Calculate calories for a specific meal
  getMealCalories(plan: MealPlan, mealType: MealType): number {
    return plan.meals[mealType].reduce((total, item) => {
      const servings = item.servingsOverride || item.servings;
      return total + (servings * item.calories_per_serving);
    }, 0);
  }

  private generateId(): string {
    return `meal_plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private saveMealPlans(plans: MealPlan[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
    } catch (error) {
      console.error('Failed to save meal plans:', error);
    }
  }
}

// Export singleton instance
export const mealPlanService = MealPlanService.getInstance();


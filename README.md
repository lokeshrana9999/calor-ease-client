# CalorEase - Smart Calorie Tracker

<div align="center">
  <img src="public/svg/Logo.svg" alt="CalorEase Logo" width="80" height="80">
  
  <h3>🥗 Track your calories effortlessly with intelligent food database</h3>
  
  <p>
    <strong>CalorEase</strong> is a modern web application that helps users track calories, manage meal plans, and maintain a comprehensive search history using USDA FoodData Central for accurate nutritional information.
  </p>

  <p>
    <a href="https://calor-ease-client.vercel.app/">🌐 Live Demo</a>
  </p>
</div>

---

## 📋 Brief Summary

CalorEase is a comprehensive calorie tracking application built with **Next.js 15**, **React 19**, and **TypeScript**. The application provides users with accurate nutritional information through an intelligent search system powered by USDA data, comprehensive meal planning capabilities, and detailed search history management.

### Key Highlights:
- 🔍 **Smart Calorie Search** - Find nutritional information for any dish
- 📊 **Meal Planning** - Create and manage personalized meal plans
- 📈 **Search History** - Track and analyze your calorie searches
- 🔐 **Secure Authentication** - JWT-based user authentication
- 📱 **Responsive Design** - Works seamlessly on all devices
- 💾 **Local Storage** - Client-side data persistence
- 🎨 **Modern UI** - Clean, intuitive interface with Tailwind CSS

---

- ## 🔧 Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React, React Icons
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Notifications**: Sonner (Toast)
- **Authentication**: JWT with js-cookie

### Development Tools
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint + Prettier
- **Git Hooks**: Husky + Lint Staged
- **Package Manager**: pnpm
- **Build Tool**: Next.js built-in bundler

### Backend Integration
- **API Base**: https://flybackend-misty-feather-6458.fly.dev
- **Authentication**: JWT Bearer tokens
- **Data Source**: USDA FoodData Central

---

## 🌟 Features

### 🔍 Calorie Tracking
- Search for any dish and get accurate calorie information
- Flexible serving size calculations (0.1 - 1000 servings)
- Real-time calorie calculations
- Integration with USDA FoodData Central

### 📊 Meal Planning
- Create unlimited meal plans
- Organize meals by breakfast, lunch, and dinner
- Set daily calorie targets
- Duplicate and modify existing plans
- Set active meal plans for daily tracking

### 📈 Search History
- Automatic search history tracking
- Advanced search and filtering
- Pagination for large datasets
- Export/import functionality
- Comprehensive statistics and analytics

### 🔐 User Management
- Secure user registration and login
- JWT-based authentication
- Protected routes and API calls
- Automatic token refresh handling

### 📱 User Experience
- Fully responsive design
- Loading states and error handling
- Toast notifications
- Route loading indicators
- Client-side data persistence

---

## 📖 Detailed Specifications

### 🏠 Home Page (`/`)

**Purpose**: Landing page and application entry point

**Features**:
- Dynamic authentication-based navigation
- Feature showcase with interactive icons
- Responsive hero section
- Call-to-action buttons based on auth state

**Components**:
- Authentication-aware navigation
- Feature highlight cards
- Responsive layout with mobile optimization

**Insert screenshot here**

---

### 🔐 Authentication Pages

#### Login Page (`/auth/login`)

**Purpose**: User authentication and session management

**Features**:
- Email and password validation
- JWT token handling
- Automatic redirect to dashboard
- Error handling and user feedback

**Form Fields**:
- Email (required, email validation)
- Password (required, minimum length)

**Insert screenshot here**

#### Register Page (`/auth/register`)

**Purpose**: New user account creation

**Features**:
- Multi-field registration form
- Real-time validation
- Automatic login after registration
- User data collection

**Form Fields**:
- First Name (required)
- Last Name (required)
- Email (required, email validation)
- Password (required, strength validation)

**Insert screenshot here**

---

### 🏠 Dashboard Page (`/dashboard`)

**Purpose**: Central hub for authenticated users

**Features**:
- User information display
- JWT token management
- Quick action cards
- Navigation to main features

**Sections**:
1. **User Information Card**
   - Display user name and email
   - Authentication status
   - Logout functionality

2. **Token Information Card**
   - JWT token display (truncated and full)
   - Token expiration time
   - Copy to clipboard functionality

3. **Quick Actions Grid**
   - Track Calories (→ `/calories`)
   - Meal Plans (→ `/meal-plans`)
   - Search History (→ `/history`)
   - Profile (placeholder)

**Insert screenshot here**

---

### 🔍 Calorie Tracking Page (`/calories`)

**Purpose**: Search and track calorie information for dishes

**Features**:
- Intelligent dish search
- Flexible serving size input
- Real-time calorie calculations
- Recent search history sidebar
- Search tips and guidelines

**Main Components**:
1. **Search Form**
   - Dish name input (required)
   - Serving size input (0.1-1000, default: 1)
   - Submit button with loading state

2. **Results Display**
   - Dish name and source
   - Calories per serving
   - Total calories calculation
   - Add to meal plan option

3. **Recent Searches**
   - Last 5 searches
   - Quick reload functionality
   - Clear history option

4. **Tips Section**
   - Search optimization tips
   - Serving size guidelines

**API Integration**:
- POST `/get-calories` endpoint
- Automatic search history saving
- Error handling for failed requests

**Insert screenshot here**

---

### 📈 Search History Page (`/history`)

**Purpose**: Comprehensive search history management and analytics

**Features**:
- Paginated search history (10 items per page)
- Advanced search and filtering
- Export/import functionality
- Detailed statistics dashboard
- Individual item management

**Main Sections**:
1. **Statistics Dashboard**
   - Total searches count
   - Total calories tracked
   - Average calories per search
   - Most searched dish
   - Weekly/monthly search counts

2. **Search and Management**
   - Search by dish name, query, or source
   - Export history as JSON
   - Clear all history (with confirmation)

3. **History List**
   - Chronological item display
   - Click to re-search functionality
   - Delete individual items
   - Add to meal plan option

4. **Pagination**
   - Page navigation
   - Items per page: 10
   - Total items and pages display

**Data Management**:
- Local storage persistence
- Maximum 1000 items
- Duplicate prevention
- JSON export/import

**Insert screenshot here**

---

### 🍽️ Meal Plans Page (`/meal-plans`)

**Purpose**: Create and manage personalized meal plans

**Features**:
- Create unlimited meal plans
- Search and filter existing plans
- Export meal plans
- Comprehensive statistics
- Empty state handling

**Main Components**:
1. **Statistics Grid** (when plans exist)
   - Total plans count
   - Total meals count
   - Average calories per plan
   - Active plans count

2. **Actions Bar**
   - Search meal plans input
   - Create new plan button
   - Export plans button

3. **Meal Plans Grid**
   - Card-based plan display
   - Plan name and description
   - Total calories and meal counts
   - Active plan indicator
   - Action buttons (Edit, Delete, Duplicate, Set Active)

4. **Empty States**
   - No search history: Prompt to track calories first
   - No meal plans: Create first meal plan prompt

**Plan Management**:
- Create with name, description, calorie target
- Set active plan (only one active at a time)
- Duplicate existing plans
- Delete with confirmation

**Insert screenshot here**

---

### 🍽️ Meal Plan Detail Page (`/meal-plans/[id]`)

**Purpose**: Detailed meal plan management and editing

**Features**:
- Edit plan information
- Manage meals by category
- Real-time calorie calculations
- Progress tracking against targets
- Add items from search history

**Main Sections**:
1. **Plan Header**
   - Editable plan name and description
   - Calorie target setting
   - Active plan indicator
   - Edit/save controls

2. **Nutrition Summary**
   - Breakfast, lunch, dinner calories
   - Total daily calories
   - Progress bar to target
   - Target comparison (+/- calories)

3. **Meal Categories** (3 columns)
   - **Breakfast Items**
   - **Lunch Items** 
   - **Dinner Items**

Each category includes:
- Add items button
- List of current items
- Individual item controls (edit servings, remove, move)
- Category calorie totals

4. **Item Management**
   - Add from search history modal
   - Adjust serving sizes
   - Move between meal categories
   - Remove items

**Real-time Updates**:
- Automatic calorie recalculation
- Progress bar updates
- Target achievement indicators

**Insert screenshot here**

---

## 🏗️ Architecture & Data Flow

### Component Architecture
```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard page
│   ├── calories/          # Calorie tracking
│   ├── history/           # Search history
│   └── meal-plans/        # Meal planning
├── components/            # Reusable components
│   ├── auth/             # Authentication forms
│   ├── calorie/          # Calorie tracking components
│   ├── history/          # History management
│   ├── mealPlan/         # Meal planning components
│   ├── ui/               # UI primitives
│   └── layout/           # Layout components
├── context/              # React Context providers
├── lib/                  # Business logic & utilities
├── hooks/                # Custom React hooks
└── styles/               # Global styles
```

### Data Management
- **Authentication**: JWT tokens stored in cookies
- **Search History**: Local storage with 1000 item limit
- **Meal Plans**: Local storage with 50 plan limit
- **API Integration**: Axios with interceptors for auth

### State Management
- **Global State**: React Context API
- **Local State**: React useState/useEffect
- **Form State**: Controlled components
- **Loading States**: Context-based loading provider

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd calor-ease-client
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm format           # Format with Prettier
pnpm typecheck        # TypeScript type checking

# Testing
pnpm test             # Run tests
pnpm test:watch       # Run tests in watch mode
```

### Environment Setup

The application connects to a remote backend API. No additional environment variables are required for basic functionality.

**API Endpoint**: `https://flybackend-misty-feather-6458.fly.dev`

---

## 📊 Data Models

### User Authentication
```typescript
interface User {
  firstName: string;
  lastName: string;
  email: string;
}

interface AuthResponse {
  message?: string;
  token: string;
}
```

### Calorie Data
```typescript
interface CalorieResponse {
  dish_name: string;
  servings: number;
  calories_per_serving: number;
  total_calories: number;
  source: string;
}
```

### Search History
```typescript
interface SearchHistoryItem extends CalorieResponse {
  id: string;
  timestamp: number;
  searchQuery: string;
}
```

### Meal Planning
```typescript
interface MealPlan {
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
```

---

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Client-side route protection
- **API Security**: Automatic token attachment to requests
- **Token Management**: Automatic logout on token expiration
- **Input Validation**: Form validation and sanitization
- **XSS Protection**: React's built-in XSS protection

---

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience with multi-column layouts
- **Tablet**: Adapted layouts with touch-friendly interactions
- **Mobile**: Single-column layouts with optimized navigation

### Breakpoints
- `sm`: 640px+ (Mobile landscape)
- `md`: 768px+ (Tablet)
- `lg`: 1024px+ (Desktop)
- `xl`: 1280px+ (Large desktop)

---

## 🧪 Testing Strategy

### Current Testing Setup
- **Framework**: Jest + React Testing Library
- **Environment**: jsdom for DOM testing
- **Coverage**: Component and utility function testing
- **Mocking**: SVG and API mocking configured

### Testing Priorities
1. **Critical Business Logic**: Search history, meal planning
2. **User Interactions**: Form submissions, navigation
3. **API Integration**: Authentication, calorie search
4. **Error Handling**: Network failures, validation errors

---

## 🚀 Deployment

### Production Build
```bash
pnpm build
pnpm start
```

### Deployment Platforms
- **Vercel**: Optimized for Next.js applications
- **Netlify**: Static site deployment
- **Docker**: Containerized deployment

### Build Optimization
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Built-in bundle analyzer
- **Static Generation**: Pre-rendered pages where possible

---

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Airbnb configuration with custom rules
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Standardized commit messages

---

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## 🙏 Acknowledgments

- **USDA FoodData Central**: Nutritional data source
- **Next.js Team**: Framework and tooling
- **Tailwind CSS**: Utility-first CSS framework
- **React Team**: UI library and ecosystem

---

<div align="center">
  <p>Made with ❤️ for healthy living</p>
  <p>
    <a href="https://calor-ease-client.vercel.app/">🌐 Visit CalorEase</a> •
  </p>
</div>

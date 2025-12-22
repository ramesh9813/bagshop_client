# Project Context: Frontend E-commerce Application

## 1. Project Overview
- **Type:** Single Page Application (SPA) E-commerce site.
- **Tech Stack:** React (Vite), Redux (Legacy), React Router v6, Bootstrap 5.
- **State Management:** Redux (partially setup), Local Component State, LocalStorage (for Cart).
- **Data Source:** FakeStoreAPI (for products), Local Mock Data (for Users).

## 2. Recent Changes & Fixes (Dec 18, 2025)
- **Environment Fixes:**
    - Removed duplicate entry files (`src/index.js`, `src/App.js`) that were causing build conflicts.
    - Renamed files to `.jsx` extension where JSX was used (`MyRoute.jsx`, `GlobalContext.jsx`).
    - Installed missing dependencies: `react-router-dom`, `redux`, `react-redux`, `formik`, `axios`, `react-icons`, `yup`, `react-toastify`.
- **Styling:**
    - Installed `bootstrap` and `bootstrap-icons`.
    - Imported Bootstrap CSS in `src/index.jsx` to fix the unstyled "pure HTML" appearance.
- **Cleanup:**
    - Removed unused/tutorial Redux files: `Student.jsx`, `StudentForm.jsx`, `StudentReducer.jsx`.
    - Updated `src/Store.js` and `src/redux/CartItems.jsx` to remove references to the deleted files.

## 3. Recent Changes & Fixes (Dec 22, 2025)
### **New Features & Logic**
- **Cash on Delivery (COD):** 
    - Implemented COD option in the Checkout process.
    - Added side-by-side buttons for eSewa and COD with icons.
    - COD orders now bypass payment redirection and clear the cart immediately upon successful placement.
- **Cart Badge System:**
    - Integrated Redux with LocalStorage for real-time cart tracking.
    - Added a high-contrast emerald green badge on the header cart icon.
    - Logic updated to track **unique items** (product count) rather than total quantity.
- **Enhanced Search:**
    - Implemented prioritized search: Title matches are shown first; Description matches only if no titles match.
    - Integrated search from the header into the main products page.

### **UI/UX Improvements**
- **Header Refresh:**
    - Migrated from standard black to a clean White Theme with high-contrast text and a light grey search bar.
    - Improved professional aesthetic and visibility of navigation elements.
- **Homepage Expansion:**
    - Added a "Weekly Trending Bags" section to increase landing page depth.
    - Mocked trending logic by slicing available product data for the prototype.
- **Advanced Filtering Sidebar:**
    - Built a collapsible sidebar with a "sliding door" animation (0.5s ease-in-out).
    - Implemented multi-criteria filtering: Category (Men/Women/Children), Size (dynamic dropdown), Price Range, and Ratings.
    - Grid density automatically adjusts from 4 columns to 3 when the sidebar is open.
- **Toast Notifications:**
    - Fixed missing styles by importing `ReactToastify.css` in the Card component.
    - Adjusted `autoClose` duration to 3000ms for better visibility.
    - Implemented semantic colors: Green for increases, Red for decreases.

## 4. Notes for Next Session
- **Redux Refactoring:** The application currently has a split personality regarding the Cart. `Cart.jsx` uses `localStorage` directly, while a Redux structure (`CartReducer`) exists but isn't fully utilized. A key next step would be deciding whether to fully migrate the Cart to Redux or stick with Context/LocalStorage.
- **Unused Files:** The `src/redux/CartItems.jsx` and `src/redux/ChangeItems.jsx` files appear to be test components and not part of the main UI. They can likely be removed in future cleanups.

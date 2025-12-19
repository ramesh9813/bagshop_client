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

## 3. Current Application Status
- **Routing:** Functional (`/`, `/products`, `/cart`, `/login`, etc.).
- **Homepage:** Displays Carousel and static content.
- **Products Page:** Fetches real data from `https://fakestoreapi.com/products`.
- **Cart:** Currently uses `localStorage` for persistence (implemented in `Cart.jsx`).
    - *Note:* The Redux `CartReducer` exists but is not currently connected to the main `Cart` page logic.
- **Authentication:** UI exists (Login/Register) but logic is mocked/incomplete.

## 4. Notes for Next Session
- **Redux Refactoring:** The application currently has a split personality regarding the Cart. `Cart.jsx` uses `localStorage` directly, while a Redux structure (`CartReducer`) exists but isn't fully utilized. A key next step would be deciding whether to fully migrate the Cart to Redux or stick with Context/LocalStorage.
- **Unused Files:** The `src/redux/CartItems.jsx` and `src/redux/ChangeItems.jsx` files appear to be test components and not part of the main UI. They can likely be removed in future cleanups.

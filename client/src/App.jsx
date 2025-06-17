import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import AddRecipePage from './pages/AddRecipePage';
import ViewRecipesPage from './pages/ViewRecipesPage';
import EditRecipePage from './pages/EditRecipePage';
import RecipeDetailsPage from './pages/RecipeDetailsPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthContext } from './context/AuthContext';

export default function App() {
  const { token, logout } = useContext(AuthContext);
  const nav = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    nav('/');
  };

  const hideNav = location.pathname === '/';

  return (
    <>

      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route
          path="/add-recipe"
          element={<ProtectedRoute><AddRecipePage /></ProtectedRoute>}
        />
        <Route
          path="/recipes"
          element={<ProtectedRoute><ViewRecipesPage /></ProtectedRoute>}
        />
        <Route
          path="/recipes/:id"
          element={<ProtectedRoute><RecipeDetailsPage /></ProtectedRoute>}
        />
        <Route
          path="/recipes/:id/edit"
          element={<ProtectedRoute><EditRecipePage /></ProtectedRoute>}
        />
      </Routes>
    </>
  );
}

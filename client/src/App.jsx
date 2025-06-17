import React, { useContext } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthPage         from './pages/AuthPage';
import AddRecipePage    from './pages/AddRecipePage';
import ViewRecipesPage  from './pages/ViewRecipesPage';
import EditRecipePage   from './pages/EditRecipePage';
import RecipeDetailsPage from './pages/RecipeDetailsPage';

export default function App() {
  const { token, logout } = useContext(AuthContext);
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav('/');
  };

  return (
    <>
      <nav className="bg-navy p-4 text-pastelPink flex justify-between">
        <div className="space-x-4">
          <Link to="/">Home</Link>
          {token && <Link to="/add-recipe">Add Recipe</Link>}
          {token && <Link to="/recipes">My Recipes</Link>}
        </div>
        {token && (
          <button onClick={handleLogout} className="hover:underline">
            Logout
          </button>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route
          path="/add-recipe"
          element={
            <ProtectedRoute>
              <AddRecipePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipes"
          element={
            <ProtectedRoute>
              <ViewRecipesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipes/:id"
          element={
            <ProtectedRoute>
              <RecipeDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipes/:id/edit"
          element={
            <ProtectedRoute>
              <EditRecipePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

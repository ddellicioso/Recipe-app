import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import AddRecipePage from "./pages/AddRecipePage";
import ViewRecipesPage from "./pages/ViewRecipesPage";
import EditRecipePage from "./pages/EditRecipePage";

export default function App() {
  return (
    <Router>
      <nav className="flex gap-4 bg-navy p-4 text-pastelPink">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <Link to="/add-recipe" className="hover:underline">
          Add Recipe
        </Link>
        <Link to="/recipes" className="hover:underline">
          My Recipes
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/add-recipe" element={<AddRecipePage />} />
        <Route path="/recipes" element={<ViewRecipesPage />} />
        <Route path="/recipes/:id/edit" element={<EditRecipePage />} />
      </Routes>
    </Router>
  );
}

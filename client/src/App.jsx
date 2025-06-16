import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import AddRecipePage from './pages/AddRecipePage';

export default function App() {
  return (
    <Router>
      <nav className="bg-navy p-4 text-pastelPink">
        <Link to="/" className="mr-4">Home</Link>
        <Link to="/add-recipe">Add Recipe</Link>
      </nav>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/add-recipe" element={<AddRecipePage />} />
      </Routes>
    </Router>
  );
}

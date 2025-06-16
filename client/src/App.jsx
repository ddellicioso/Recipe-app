import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import AddRecipePage from "./pages/AddRecipePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/add-recipe" element={<AddRecipePage />} />
        {/* More routes coming later */}
      </Routes>
    </Router>
  );
}

export default App;

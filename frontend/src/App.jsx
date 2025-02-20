import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RecipeDetail from './pages/RecipeDetail';
import AddRecipe from './pages/AddRecipe';
import EditRecipe from './pages/EditRecipe';
import AllRecipes from './pages/AllRecipes';
import { AuthProvider } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container mt-4">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/recipes" element={
              <ProtectedRoute>
                <AllRecipes />
              </ProtectedRoute>
            } />
            <Route path="/recipe/:id" element={
              <ProtectedRoute>
                <RecipeDetail />
              </ProtectedRoute>
            } />
            <Route path="/add-recipe" element={
              <ProtectedRoute>
                <AddRecipe />
              </ProtectedRoute>
            } />
            <Route path="/edit-recipe/:id" element={
              <ProtectedRoute>
                <EditRecipe />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </AuthProvider>
  );
}

export default App;
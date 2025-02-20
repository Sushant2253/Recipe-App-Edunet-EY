import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { toast } from 'react-toastify';

function RecipeDetail() {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const fetchRecipe = useCallback(async () => {
    try {
      const response = await api.getRecipe(id);
      if (response.success) {
        setRecipe(response.recipe);
      } else {
        setError('Recipe not found');
      }
    } catch (error) {
      console.error('Error fetching recipe:', error);
      setError(error.message || 'Error fetching recipe');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRecipe();
  }, [fetchRecipe]);

  const handleDelete = () => {
    toast.warn(
      <div>
        <p>Are you sure you want to delete this recipe?</p>
        <div className="d-flex justify-content-end mt-2">
          <button 
            className="btn btn-secondary me-2" 
            onClick={() => toast.dismiss()}
          >
            Cancel
          </button>
          <button 
            className="btn btn-danger" 
            onClick={async () => {
              toast.dismiss();
              try {
                await api.deleteRecipe(id);
                toast.success('Recipe deleted successfully');
                navigate('/');
              } catch (error) {
                console.error('Error deleting recipe:', error);
                toast.error('Failed to delete recipe');
              }
            }}
          >
            Delete
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false
      }
    );
  };

  const formatIngredient = (ingredient) => {
    const parts = [];
    if (ingredient.quantity && ingredient.quantity !== '1') {
      parts.push(ingredient.quantity);
    }
    if (ingredient.unit && ingredient.unit !== '1') {
      parts.push(ingredient.unit);
    }
    parts.push(ingredient.name);
    return parts.join(' ');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!recipe) return <div>Recipe not found</div>;

  return (
    <div className="recipe-detail">
      <h2>{recipe.name}</h2>
      <p className="text-muted">Cuisine: {recipe.cuisine}</p>

      <div className="row mt-4">
        <div className="col-md-6">
          <h3>Ingredients</h3>
          <ul className="list-group">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="list-group-item">
                {formatIngredient(ingredient)}
              </li>
            ))}
          </ul>
        </div>

        <div className="col-md-6">
          <h3>Instructions</h3>
          <ol className="list-group list-group-numbered">
            {recipe.instructions.map((step, index) => (
              <li key={index} className="list-group-item">
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {isAuthenticated && user.id === recipe.userId && (
        <div className="mt-4">
          <button
            className="btn btn-primary me-2"
            onClick={() => navigate(`/edit-recipe/${id}`)}
          >
            Edit Recipe
          </button>
          <button
            className="btn btn-danger"
            onClick={handleDelete}
          >
            Delete Recipe
          </button>
        </div>
      )}
    </div>
  );
}

export default RecipeDetail;
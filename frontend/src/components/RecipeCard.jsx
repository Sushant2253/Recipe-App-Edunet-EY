import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function RecipeCard({ recipe }) {
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

  return (
    <div className="card recipe-card h-100">
      <div className="card-body">
        <h5 className="card-title fw-bold mb-3">{recipe.name}</h5>
        <div className="mb-3">
          <span className="badge bg-light text-dark me-2">
            <i className="bi bi-globe2 me-1"></i>
            {recipe.cuisine}
          </span>
          <span className="badge bg-light text-dark">
            <i className="bi bi-clock me-1"></i>
            {recipe.instructions.length} steps
          </span>
        </div>
        <div className="ingredients-preview mb-3">
          <small className="text-muted">
            <i className="bi bi-card-list me-1"></i>
            {recipe.ingredients.slice(0, 3).map(formatIngredient).join(', ')}
            {recipe.ingredients.length > 3 && '...'}
          </small>
        </div>
        <Link 
          to={`/recipe/${recipe._id}`} 
          className="btn btn-recipe btn-sm w-100"
        >
          View Recipe
        </Link>
      </div>
    </div>
  );
}

RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string,
    cuisine: PropTypes.string.isRequired,
    ingredients: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      quantity: PropTypes.string,
      unit: PropTypes.string
    })).isRequired,
    instructions: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired
};

export default RecipeCard;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { toast } from 'react-toastify';

function AddRecipe() {
  const [recipe, setRecipe] = useState({
    name: '',
    cuisine: '',
    ingredients: [{ name: '', amount: '', unit: '' }],
    instructions: ['']
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
        console.log('Submitting recipe:', recipe); // Debug log
        const response = await api.createRecipe(recipe);
        console.log('Recipe created:', response); // Debug log
        
        if (response.success && response._id) {
            toast.success('Recipe created successfully!');
            navigate('/');
        } else {
            setError('Failed to create recipe: ' + (response.message || 'No ID returned'));
        }
    } catch (error) {
        console.error('Error creating recipe:', error);
        setError(`Error creating recipe: ${error.message}`);
    }
  };

  const addIngredient = () => {
    setRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, { name: '', amount: '', unit: '' }]
    });
  };

  const addInstruction = () => {
    setRecipe({
      ...recipe,
      instructions: [...recipe.instructions, '']
    });
  };

  return (
    <div>
      <h2>Add New Recipe</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Recipe Name</label>
          <input
            type="text"
            className="form-control"
            value={recipe.name}
            onChange={(e) => setRecipe({ ...recipe, name: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Cuisine</label>
          <input
            type="text"
            className="form-control"
            value={recipe.cuisine}
            onChange={(e) => setRecipe({ ...recipe, cuisine: e.target.value })}
            required
          />
        </div>

        <h3>Ingredients</h3>
        {recipe.ingredients.map((ingredient, index) => (
          <div key={index} className="row mb-2">
            <div className="col">
              <input
                type="text"
                className="form-control"
                placeholder="Ingredient"
                value={ingredient.name}
                onChange={(e) => {
                  const newIngredients = [...recipe.ingredients];
                  newIngredients[index].name = e.target.value;
                  setRecipe({ ...recipe, ingredients: newIngredients });
                }}
              />
            </div>
            <div className="col">
              <input
                type="text"
                className="form-control"
                placeholder="Amount"
                value={ingredient.amount}
                onChange={(e) => {
                  const newIngredients = [...recipe.ingredients];
                  newIngredients[index].amount = e.target.value;
                  setRecipe({ ...recipe, ingredients: newIngredients });
                }}
              />
            </div>
            <div className="col">
              <input
                type="text"
                className="form-control"
                placeholder="Unit"
                value={ingredient.unit}
                onChange={(e) => {
                  const newIngredients = [...recipe.ingredients];
                  newIngredients[index].unit = e.target.value;
                  setRecipe({ ...recipe, ingredients: newIngredients });
                }}
              />
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-secondary mb-3" onClick={addIngredient}>
          Add Ingredient
        </button>

        <h3>Instructions</h3>
        {recipe.instructions.map((instruction, index) => (
          <div key={index} className="mb-2">
            <textarea
              className="form-control"
              value={instruction}
              onChange={(e) => {
                const newInstructions = [...recipe.instructions];
                newInstructions[index] = e.target.value;
                setRecipe({ ...recipe, instructions: newInstructions });
              }}
            />
          </div>
        ))}
        <button type="button" className="btn btn-secondary mb-3" onClick={addInstruction}>
          Add Instruction
        </button>

        <div>
          <button type="submit" className="btn btn-primary">Create Recipe</button>
        </div>
      </form>
    </div>
  );
}

export default AddRecipe;
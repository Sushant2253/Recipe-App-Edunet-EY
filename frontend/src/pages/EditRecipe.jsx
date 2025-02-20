import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { toast } from 'react-toastify';

function EditRecipe() {
    const [recipe, setRecipe] = useState({
        name: '',
        cuisine: '',
        ingredients: [{ name: '', quantity: '', unit: '' }],
        instructions: ['']
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    const fetchRecipe = useCallback(async () => {
        try {
            const response = await api.getRecipe(id);
            if (response.success) {
                const formattedIngredients = response.recipe.ingredients.map(ing => ({
                    name: ing.name || '',
                    quantity: ing.amount || ing.quantity || '',
                    unit: ing.unit || ''
                }));
                
                setRecipe({
                    ...response.recipe,
                    ingredients: formattedIngredients
                });
            } else {
                setError('Recipe not found');
            }
        } catch (error) {
            setError('Error fetching recipe');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchRecipe();
    }, [fetchRecipe]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const cleanedRecipe = {
                ...recipe,
                ingredients: recipe.ingredients.filter(ing => ing.name.trim() !== '').map(ing => ({
                    name: ing.name,
                    quantity: ing.quantity,
                    unit: ing.unit
                })),
                instructions: recipe.instructions.filter(inst => inst.trim() !== '')
            };

            const response = await api.updateRecipe(id, cleanedRecipe);
            
            if (response.success) {
                toast.success('Recipe updated successfully!');
                navigate('/');
            } else {
                toast.error(response.message || 'Failed to update recipe');
            }
        } catch (error) {
            console.error('Update error:', error);
            toast.error(error.message || 'Failed to update recipe');
        }
    };

    const addIngredient = () => {
        setRecipe({
            ...recipe,
            ingredients: [...recipe.ingredients, { name: '', quantity: '', unit: '' }]
        });
    };

    const deleteIngredient = (index) => {
        const newIngredients = recipe.ingredients.filter((_, i) => i !== index);
        setRecipe({ ...recipe, ingredients: newIngredients });
    };

    const moveInstruction = (index, direction) => {
        const newInstructions = [...recipe.instructions];
        const temp = newInstructions[index];
        newInstructions[index] = newInstructions[index + direction];
        newInstructions[index + direction] = temp;
        setRecipe({ ...recipe, instructions: newInstructions });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div>
            <h2>Edit Recipe</h2>
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
                    <div key={index} className="row mb-2 align-items-center">
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
                                required
                            />
                        </div>
                        <div className="col">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Quantity"
                                value={ingredient.quantity}
                                onChange={(e) => {
                                    const newIngredients = [...recipe.ingredients];
                                    newIngredients[index].quantity = e.target.value;
                                    setRecipe({ ...recipe, ingredients: newIngredients });
                                }}
                                required
                            />
                        </div>
                        <div className="col">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Unit (optional)"
                                value={ingredient.unit}
                                onChange={(e) => {
                                    const newIngredients = [...recipe.ingredients];
                                    newIngredients[index].unit = e.target.value;
                                    setRecipe({ ...recipe, ingredients: newIngredients });
                                }}
                            />
                        </div>
                        <div className="col-auto">
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => deleteIngredient(index)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
                <button type="button" className="btn btn-secondary mb-3" onClick={addIngredient}>
                    Add Ingredient
                </button>

                <h3>Instructions</h3>
                {recipe.instructions.map((instruction, index) => (
                    <div key={index} className="mb-3">
                        <div className="d-flex align-items-start">
                            <div className="me-2 mt-2">
                                <div className="btn-group-vertical">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => moveInstruction(index, -1)}
                                        disabled={index === 0}
                                    >
                                        ↑
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => moveInstruction(index, 1)}
                                        disabled={index === recipe.instructions.length - 1}
                                    >
                                        ↓
                                    </button>
                                </div>
                            </div>
                            <div className="flex-grow-1">
                                <div className="input-group">
                                    <textarea
                                        className="form-control"
                                        value={instruction}
                                        onChange={(e) => {
                                            const newInstructions = [...recipe.instructions];
                                            newInstructions[index] = e.target.value;
                                            setRecipe({ ...recipe, instructions: newInstructions });
                                        }}
                                        rows="2"
                                        style={{ resize: 'none' }}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger"
                                        onClick={() => {
                                            const newInstructions = recipe.instructions.filter((_, i) => i !== index);
                                            setRecipe({ ...recipe, instructions: newInstructions });
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <button
                    type="button"
                    className="btn btn-outline-secondary mb-3"
                    onClick={() => setRecipe({
                        ...recipe,
                        instructions: [...recipe.instructions, '']
                    })}
                >
                    Add Instruction
                </button>

                <div>
                    <button type="submit" className="btn btn-primary">Update Recipe</button>
                </div>
            </form>
        </div>
    );
}

export default EditRecipe;
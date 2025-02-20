import { useState, useEffect } from 'react';
import { api } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import SearchBar from '../components/SearchBar';
import { toast } from 'react-toastify';

function AllRecipes() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRecipes = async (searchTerm = '', searchType = '') => {
        try {
            setLoading(true);
            const response = await api.getRecipes(1, searchTerm, searchType);
            
            if (response.success) {
                setRecipes(response.recipes || []);
                setError(null);
            } else {
                setError('Failed to fetch recipes');
                toast.error('Failed to fetch recipes');
            }
        } catch (error) {
            setError('Error loading recipes');
            toast.error('Error loading recipes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipes();
    }, []);

    const handleSearch = (searchTerm, searchType) => {
        fetchRecipes(searchTerm, searchType);
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="row mb-4">
                <div className="col">
                    <h2 className="mb-4">Browse Recipes</h2>
                    <SearchBar onSearch={handleSearch} />
                </div>
            </div>

            {recipes.length === 0 ? (
                <div className="text-center mt-5">
                    <h3>No recipes found</h3>
                    <p className="text-muted">Try adjusting your search criteria</p>
                </div>
            ) : (
                <div className="row g-4">
                    {recipes.map(recipe => (
                        <div key={recipe._id} className="col-md-4">
                            <RecipeCard recipe={recipe} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AllRecipes;
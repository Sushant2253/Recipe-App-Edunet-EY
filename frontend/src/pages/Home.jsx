import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

function Home() {
    const [recentRecipes, setRecentRecipes] = useState([]);
    const [popularRecipes, setPopularRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRecipes = async (searchTerm = '', searchType = '') => {
        try {
            setLoading(true);
            const response = await api.getRecipes(1, searchTerm, searchType);

            if (response.success) {
                const recipes = response.recipes || [];
                setRecentRecipes(recipes.slice(-6).reverse());
                setPopularRecipes(recipes.slice(0, 6));
            } else {
                setError('Failed to fetch recipes');
            }
        } catch (error) {
            console.error('Error fetching recipes:', error);
            setError('Error fetching recipes');
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div>
            <div className="hero-section text-center py-5 mb-5"
                style={{
                    background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("/hero-bg.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: 'white'
                }}>
                <div className="container py-5">
                    <h1 className="display-4 fw-bold mb-4">Discover Delicious Recipes</h1>
                    <p className="lead mb-4">Find and share your favorite recipes with our community</p>
                    <SearchBar onSearch={handleSearch} />
                </div>
            </div>

            <div className="container">
                <section className="mb-5">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-bold">Recent Recipes</h2>
                        <Link to="/recipes" className="btn btn-outline-primary">View All</Link>
                    </div>
                    <div className="row g-4">
                        {recentRecipes.map(recipe => (
                            <div key={recipe._id} className="col-md-4">
                                <RecipeCard recipe={recipe} />
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mb-5">
                    <h2 className="fw-bold mb-4">Popular Recipes</h2>
                    <div className="row g-4">
                        {popularRecipes.map(recipe => (
                            <div key={recipe._id} className="col-md-4">
                                <RecipeCard recipe={recipe} />
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Home;
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { isAuthenticated, logout } = useAuth();

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white">
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <i className="bi bi-book-half me-2"></i>
                    <span className="fw-bold" style={{ color: 'var(--primary-color)' }}>Recipe Book</span>
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/recipes">Browse</Link>
                        </li>
                        {isAuthenticated && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/add-recipe">
                                    <i className="bi bi-plus-circle me-1"></i>
                                    Add Recipe
                                </Link>
                            </li>
                        )}
                    </ul>
                    <div className="d-flex">
                        {isAuthenticated ? (
                            <button 
                                onClick={logout} 
                                className="btn btn-outline-danger"
                            >
                                <i className="bi bi-box-arrow-right me-1"></i>
                                Logout
                            </button>
                        ) : (
                            <Link to="/login" className="btn btn-recipe">
                                <i className="bi bi-person me-1"></i>
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
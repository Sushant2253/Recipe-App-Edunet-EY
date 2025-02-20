import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../services/auth';
import { toast } from 'react-toastify';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const from = location.state?.from || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await auth.login(formData);

            if (response.success && response.token) {
                login({
                    user: response.user,
                    token: response.token
                });
                toast.success('Login successful! Welcome back!');
                navigate(from);
            } else {
                toast.error(response.message || 'Login failed');
                setError(response.message || 'Login failed');
            }
        } catch (error) {
            toast.error(error.message || 'Failed to connect to the server');
            setError(error.message || 'Failed to connect to the server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow">
                        <div className="card-body p-5">
                            <h2 className="text-center mb-4">Login</h2>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={formData.email}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            email: e.target.value
                                        })}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={formData.password}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            password: e.target.value
                                        })}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-recipe w-100 mb-3"
                                    disabled={loading}
                                >
                                    {loading ? 'Logging in...' : 'Login'}
                                </button>
                                <div className="text-center">
                                    <p className="mb-0">Don't have an account?</p>
                                    <Link to="/register" className="btn btn-outline-primary mt-2">
                                        Register Now
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
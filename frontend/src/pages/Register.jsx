import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../services/auth';
import { toast } from 'react-toastify';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword: _, ...registrationData } = formData;
      const response = await auth.register(registrationData);
  
      if (response.success) {
          toast.success('Registration successful! Please login.');
          navigate('/login');
      } else {
          toast.error(response.message || 'Registration failed');
          setError(response.message || 'Registration failed');
      }
  } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed');
      setError(error.message || 'Registration failed. Please try again.');
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
              <h2 className="text-center mb-4">Register</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-recipe w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>
                <div className="text-center">
                  <p className="mb-0">Already have an account?</p>
                  <Link to="/login" className="btn btn-outline-primary mt-2">
                    Login Here
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

export default Register;
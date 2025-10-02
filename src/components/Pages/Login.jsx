import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useAuth } from './AuthContext'; // ✅ import AuthContext

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ get login function from context

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(
        `http://localhost:3001/users?email=${formData.email}&password=${formData.password}`
      );

      if (res.data.length > 0) {
        const userData = res.data[0]; // ✅ get the logged-in user
        login(userData); // ✅ save user in context & localStorage
        alert('Login Successful');
        navigate('/home');
      } else {
        alert('Invalid email or password');
      }
    } catch (err) {
      console.log(err);
      alert('Error while logging in');
    }
  };

  const handleSkip = () => {
    navigate('/home');
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow rounded-3">
            <div className="card-body p-4">
              <h3 className="card-title text-center text-success mb-4">Login</h3>
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email address</label>
                  <input
                    type="email"
                    className="form-control border-success"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control border-success"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-success w-100 mb-2">
                  Login
                </button>
                <button
                  type="button"
                  className="btn btn-outline-success w-100"
                  onClick={handleSkip}
                >
                  Skip for now
                </button>
              </form>
              <p className="text-center mt-3">
                Don't have an account?{' '}
                <span
                  className="text-success"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate('/register')}
                >
                  Sign Up
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

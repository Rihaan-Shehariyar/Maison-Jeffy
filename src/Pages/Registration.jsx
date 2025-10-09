import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaLock, FaEnvelope, FaMailchimp, FaFacebookMessenger } from 'react-icons/fa';

const Registration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });

  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.get(`http://localhost:5000/users?email=${formData.email}`);
      if (res.data.length > 0) {
        alert("User already exists");
        return;
      }
      await axios.post("http://localhost:5000/users", formData);
      alert("SignUp Successful");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Error while registering");
    }
  };

  const handleSkip = () => navigate('/home');

   return (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="relative z-10 w-full max-w-lg h-[550px] bg-gray-900/80 backdrop-blur-md shadow-2xl p-12 flex flex-col items-center justify-center">
    <h2 className="text-4xl font-extrabold text-white mb-8 ">SignUp</h2>
    
    {/* Input Fields */}
    <form className="w-full flex flex-col items-center" onSubmit={handleSubmit}>
      <FaUser className="relative left-30 top-10 transform -translate-y-1/2 text-gray-400" />
  <input
    type="name"
    placeholder="Name"
    value={formData.name}
    onChange={handleChange}
    id="name"
    name="name"
    required
    className="w-48 py-2 px-3 mb-6 bg-gray-800 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 rounded" style={{width: "300px"}}
  />

   <FaEnvelope className="relative left-30 top-10 transform -translate-y-1/2 text-gray-400" />
  <input
    type="email"
    placeholder="Email"
    value={formData.email}
    onChange={handleChange}
    id="email"
    name="email"
    required
    className="w-48 py-2 px-3 mb-6 bg-gray-800 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 rounded" style={{width: "300px"}}
  />
  <FaLock className="relative left-30 top-10 transform -translate-y-1/2 text-gray-400" />
  <input
    type="password"
    placeholder="Password"
     id="password"
    name="password"
    value={formData.password}
    onChange={handleChange}
    required
    className="w-64 py-2 px-3 mb-6 bg-gray-800 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 rounded " style={{width: "300px"}}
  />
  <br></br>
    {/* Login Button */}
    <button className="w-full py-3 hover:scale-105 transition-transform duration-300 shadow-lg" style={{width: "300px"}} type='submit'
    >
      SignUp
    </button>
  
    <button
        onClick={() => navigate('/home')}
        className="w-72 py-3 bg-gray-700 text-white rounded shadow-md hover:bg-gray-600 transition-colors duration-300 mt-2" style={{width: "300px"}}
      >
        Skip for now
      </button>
      <br></br>
  
    
    </form>
  </div>
  
  
      </div>
    ) 
};

export default Registration;

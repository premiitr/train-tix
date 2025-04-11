import React, { useRef, useState, useEffect } from 'react';
import { API_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { login } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const modalRef = useRef(null);

  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [message, setMessage] = useState('');

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        navigate(-1); // Go back
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [navigate]);

  const toggleForm = () => {
    setIsSignup(prev => !prev);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setMessage('');
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (isSignup) {
      if (!name || !email || !password || !confirmPassword) {
        setMessage('error:Please fill all fields');
        return;
      }
      if (password !== confirmPassword) {
        setMessage("error:Passwords don't match");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/register/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();
        if (res.ok) {
          dispatch(login({name: data.name,email: data.email,user_id: data.user_id,bookedSeats: data.booked_seats}));          
          setMessage('success:Registered successfully. Logging you in...');
          setTimeout(() => navigate('/'), 500);
        } else {
          setMessage(`error:${data.error || 'Registration failed'}`);
        }
      } catch (err) {
        console.error(err);
        setMessage("error:Server error");
      }

    } else {
      if (!email || !password) {
        setMessage('error:Enter email and password');
        return;
      }

      try {
        const res = await fetch(`${API_URL}/login/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (res.ok) {
          dispatch(login({name: data.name,email: email,user_id: data.user_id,bookedSeats: data.booked_seats}));
          
          setMessage('success:Login successful');
          setTimeout(() => navigate('/'), 500);
        } else {
          setMessage(`error:${data.error || 'Login failed'}`);
        }
      } catch (err) {
        console.error(err);
        setMessage("error:Server error");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div ref={modalRef} className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <input type="text" name="name" placeholder="Full Name"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.name}
              onChange={handleChange}
            />
          )}

          <input type="email" name="email" placeholder="Email"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.email}
            onChange={handleChange}
          />

          <input type="password" name="password" placeholder="Password"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.password}
            onChange={handleChange}
          />

          {isSignup && (
            <input type="password" name="confirmPassword" placeholder="Confirm Password"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          )}

          <button type="submit"
            className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-lg hover:from-green-600 hover:to-blue-600 transition">
            {isSignup ? 'Sign Up' : 'Login'}
          </button>
        </form>
        {message && (() => {
          const [type, content] = message.split(':');
          return (
            <div className={`mt-4 text-sm px-4 py-2 rounded-md font-medium text-center border
              ${type === 'success'
                ? 'bg-green-100 text-green-800 border-green-300'
                : 'bg-red-100 text-red-800 border-red-300'
              }`}>
              {content}
            </div>
          );
        })()}

        <div className="mt-6 text-center text-sm text-gray-600">
          {isSignup ? (
            <>
              Already have an account?{' '}
              <span className="text-blue-600 font-semibold cursor-pointer" onClick={toggleForm}>
                Login
              </span>
            </>
          ) : (
            <>
              New here?{' '}
              <span className="text-blue-600 font-semibold cursor-pointer" onClick={toggleForm}>
                Create an account
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;

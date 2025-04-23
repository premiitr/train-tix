import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../redux/userSlice';

const Header = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getFirstName = (name) => name?.split(' ')[0] || '';

  return (
    <header className="sticky top-0 z-20 bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[70px]">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <img src="../logo192.png" alt="Logo" className="w-[50px] rounded-full p-1" />
            </Link>
            <span className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 text-transparent bg-clip-text tracking-wide">
              TrainTix
            </span>
          </div>
          
          <nav className="hidden md:flex items-center gap-4 text-gray-700 font-medium">
            <Link to="/" className="px-3 py-2 text-xl rounded-md hover:bg-gray-100 transition">
              Home
            </Link>
            {!user.isLoggedIn ? (
              <Link to="/login" className="px-3 py-2 text-xl rounded-md hover:bg-gray-100 transition">
                Login
              </Link>
            ) : (
              <>
                {user.name && <span className="px-3 py-2 text-gray-700 text-lg">{getFirstName(user.name)}</span>}
                <button onClick={handleLogout} className="px-3 py-2 rounded-md hover:bg-gray-100 transition text-lg">
                  Logout
                </button>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setMobileOpen(!mobileOpen)} className="text-2xl focus:outline-none">
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-200 py-3 space-y-2">
            <Link to="/" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
              Home
            </Link>
            {!user.isLoggedIn ? (
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                Login
              </Link>
            ) : (
              <>
                <div className="px-4 py-2 text-gray-700">👤 {getFirstName(user.name)}</div>
                <button
                  onClick={() => {handleLogout(); setMobileOpen(false);}}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200">
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

import { useState, useEffect } from 'react';
import { Bell, User, ChevronDown, LogOut, Menu, X } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check authentication status - runs on mount and when route changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };
    
    // Check immediately
    checkAuth();
    
    // Listen for storage changes (cross-tab updates)
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === null) {
        checkAuth();
      }
    };
    
    // Listen for custom auth change event (same-tab updates)
    const handleAuthChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChange', handleAuthChange);
    
    // Also check on focus (in case of same-tab updates)
    window.addEventListener('focus', checkAuth);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('focus', checkAuth);
    };
  }, [location.pathname]); // Re-check when route changes

  const handleLogin = () => {
    // For testing purposes - simulate login
    localStorage.setItem('token', 'test-token');
    setIsLoggedIn(true);
    // navigate('/login');
  };

  const handleLogout = () => {
    // Clear authentication token
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setProfileOpen(false);
    // Dispatch custom event to notify of auth change
    window.dispatchEvent(new Event('authChange'));
    navigate('/login');
  };

  const navigateToProfile = () => {
    navigate('/profile');
    setProfileOpen(false);
  };

  const clearNotifications = () => {
    setNotifications(0);
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-gray-900/95 backdrop-blur-sm shadow-lg py-2' 
          : 'bg-gray-900 py-4 shadow-md shadow-black/20'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="BrainVerse Logo" width="80" height="80" className='rounded-full'/>
          <span className="text-xl font-semibold text-white">
            Br<span className="text-blue-400">ai</span>n<span className="text-blue-400">Verse</span>
          </span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {isLoggedIn && (
            <Link to="/dashboard" className="text-gray-300 hover:text-blue-400 font-medium">Dashboard</Link>
          )}
          
          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {/* Profile Icon Only */}
                <button 
                  onClick={navigateToProfile}
                  className="text-gray-300 hover:text-blue-400 p-2 rounded-full hover:bg-gray-800 transition-colors"
                  title="Profile"
                >
                  <User className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-blue-400 font-medium px-4 py-2">Log In</Link>
                <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium">Get Started</Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 rounded-md hover:bg-gray-800" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6 text-gray-300" /> : <Menu className="h-6 w-6 text-gray-300" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 p-4">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="block py-2 text-gray-300 hover:text-blue-400">Dashboard</Link>
              <button onClick={navigateToProfile} className="block w-full text-left py-2 text-gray-300 hover:text-blue-400 flex items-center">
                <User className="h-4 w-4 mr-2" /> Profile
              </button>
              <button onClick={handleLogout} className="block w-full text-left py-2 text-red-400 hover:text-red-300 flex items-center">
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block py-2 text-gray-300 hover:text-blue-400">Log In</Link>
              <Link to="/signup" className="block py-2 text-gray-300 hover:text-blue-400">Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
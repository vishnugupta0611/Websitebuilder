import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { Search, User, Menu, X, ChevronDown, LogOut, Settings } from 'lucide-react';

function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const navItems = [
    {
      name: 'My Websites',
      path: '/my-websites',
      subItems: [
        { name: 'Dashboard', path: '/my-websites/dashboard' },
        { name: 'Analytics', path: '/my-websites/analytics' },
        { name: 'Settings', path: '/my-websites/settings' }
      ]
    },
    {
      name: 'My Products',
      path: '/my-products',
      subItems: [
        { name: 'Inventory', path: '/my-products/inventory' },
        { name: 'Performance', path: '/my-products/performance' }
      ]
    },
    {
      name: 'Orders',
      path: '/orders',
      subItems: [
        { name: 'All Orders', path: '/orders' },
        { name: 'Analytics', path: '/orders/analytics' },
        { name: 'Reports', path: '/orders/reports' }
      ]
    },
    {
      name: 'Blogs',
      path: '/blog-manager',
      subItems: [
        { name: 'Blog Manager', path: '/blog-manager' },
        { name: 'Content Editor', path: '/content-editor' },
        { name: 'Statistics', path: '/content-editor/stats' }
      ]
    }
  ];

  return (
    <header className={` w-full  transition-all duration-300 z-50 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-1 border-b border-gray-100' : 'bg-white/90 backdrop-blur-sm py-2'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo with subtle hover effect */}
          <Link 
            to="/" 
            className="flex items-center group"
            onMouseEnter={() => setActiveNav(null)}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <span className="text-white font-bold text-lg">CP</span>
            </div>
            <div className="ml-3 h-6 w-px bg-gray-200"></div>
          </Link>

          {/* Desktop Navigation with dropdowns */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <div 
                key={item.path}
                className="relative"
                onMouseEnter={() => setActiveNav(index)}
                onMouseLeave={() => setActiveNav(null)}
              >
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 ${activeNav === index ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
                >
                  <span className="font-medium">{item.name}</span>
                  <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-200 ${activeNav === index ? 'rotate-180 text-blue-600' : 'text-gray-400'}`} />
                </Link>

                {/* Dropdown menu */}
                {activeNav === index && (
                  <div className="absolute left-0 mt-1 w-56 origin-top-right bg-white rounded-xl shadow-lg ring-1 ring-black/5 overflow-hidden transition-all duration-200">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-0"
                        onClick={() => setActiveNav(null)}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Search and User Area */}
          <div className="flex items-center space-x-4">
            {/* Search Bar with expand effect */}
            <div className="hidden md:block relative">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-48 focus:w-64 pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </form>
            </div>

            {/* User Profile with dropdown */}
            <div className="relative user-menu-container">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-xl shadow-lg ring-1 ring-black/5 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="h-4 w-4 mr-3 text-gray-400" />
                    Account Settings
                  </Link>
                  
                  <button
                    onClick={() => {
                      logout()
                      setShowUserMenu(false)
                      navigate('/login')
                    }}
                    className="flex items-center w-full px-4 py-3 text-sm text-red-700 hover:bg-red-50 transition-colors duration-150"
                  >
                    <LogOut className="h-4 w-4 mr-3 text-red-400" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 text-gray-600" />
              ) : (
                <Menu className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 animate-slideDown">
            <div className="px-4 mb-4">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  />
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </form>
            </div>

            <nav className="space-y-1 px-4">
              {navItems.map((item) => (
                <div key={item.path} className="border-b border-gray-100 last:border-0">
                  <Link
                    to={item.path}
                    className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors duration-200 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  <div className="pl-4 py-2 space-y-1">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        className="block px-4 py-2 text-sm text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.25s ease-out;
        }
      `}</style>
    </header>
  );
}

export default Header;
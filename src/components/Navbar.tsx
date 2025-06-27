import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, BarChart3 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Track', href: '/track' },
    { name: 'Predict', href: '/predict' },
    { name: 'Watchlist', href: '/watchlist' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="backdrop-blur-xl bg-white/10 dark:bg-white/5 border-b border-white/20 dark:border-blue-300/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 group-hover:from-blue-500 group-hover:to-blue-600 transition-all duration-300">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                MarketAI
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
                    ${isActive(item.href)
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-400/30'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-white/10 dark:hover:bg-white/5'
                    }
                  `}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Theme Toggle & Mobile Menu */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-white/10 dark:hover:bg-white/5 transition-all duration-300"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-white/10 dark:hover:bg-white/5 transition-all duration-300"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden py-4 border-t border-white/20 dark:border-blue-300/20">
              <div className="flex flex-col space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
                      ${isActive(item.href)
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-400/30'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-white/10 dark:hover:bg-white/5'
                      }
                    `}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
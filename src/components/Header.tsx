import { Sun, Moon, Bell, LogOut } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { format } from 'date-fns';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import '../styles/theme-animations.css';

interface HeaderProps {}

export default function Header({}: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const currentDate = format(new Date(), 'EEEE, MMMM d, yyyy');
  const [isThemeAnimating, setIsThemeAnimating] = useState(false);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return {
          title: 'Business Dashboard',
          subtitle: "Welcome back! Here's what's happening with your business today."
        };
      case '/stores':
        return {
          title: 'Manage Stores',
          subtitle: 'Add, edit, and view your business locations'
        };
      case '/sales':
        return {
          title: 'Sales & Billing',
          subtitle: 'Manage your sales and generate professional bills'
        };
      case '/payroll':
        return {
          title: 'Payroll Management',
          subtitle: 'Manage employee information and payroll records'
        };
      case '/expenses':
        return {
          title: 'Expense Tracking',
          subtitle: 'Track and manage your business expenses'
        };
      case '/inventory':
        return {
          title: 'Inventory Management',
          subtitle: 'Track products and stock levels across all stores'
        };
      case '/reports':
        return {
          title: 'Business Analytics',
          subtitle: 'Comprehensive insights and performance metrics'
        };
      case '/settings':
        return {
          title: 'Settings',
          subtitle: 'Manage your account settings and preferences'
        };
      default:
        return {
          title: 'Business Dashboard',
          subtitle: "Welcome back! Here's what's happening with your business today."
        };
    }
  };

  const pageInfo = getPageTitle();


  const handleThemeToggle = () => {
    setIsThemeAnimating(true);
    toggleTheme();
    
    // Reset animation after a longer delay for more complex animation
    setTimeout(() => {
      setIsThemeAnimating(false);
    }, 600);
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 py-6 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
              {pageInfo.title}
            </h1>
            <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
              {pageInfo.subtitle}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 lg:space-x-4">
          <span className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
            {currentDate}
          </span>
          
          <button
            onClick={handleThemeToggle}
            className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 ${
              isThemeAnimating ? 'scale-110' : 'scale-100'
            }`}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className={`h-4 w-4 lg:h-5 lg:w-5 text-gray-600 dark:text-gray-300 theme-icon-hover ${
                isThemeAnimating 
                  ? 'moon-animate' 
                  : 'moon-hover'
              }`} />
            ) : (
              <Sun className={`h-4 w-4 lg:h-5 lg:w-5 text-gray-600 dark:text-gray-300 theme-icon-hover ${
                isThemeAnimating 
                  ? 'sun-animate' 
                  : 'sun-hover'
              }`} />
            )}
          </button>
          
          <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 hover:scale-105 group">
            <Bell className="h-4 w-4 lg:h-5 lg:w-5 text-gray-600 dark:text-gray-300 group-hover:animate-bounce transition-all duration-200" />
          </button>
          
          <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 hover:scale-105 group">
            <LogOut className="h-4 w-4 lg:h-5 lg:w-5 text-gray-600 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-400 transition-all duration-200" />
          </button>
          
        </div>
      </div>
    </header>
  );
}
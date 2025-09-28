import { Sun, Moon, Bell, LogOut } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { format } from 'date-fns';
import { useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const currentDate = format(new Date(), 'EEEE, MMMM d, yyyy');

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

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Navigate to sign-in page after logout
      navigate('/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {pageInfo.title}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {pageInfo.subtitle}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {currentDate}
          </span>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
          
          <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          
          <button
            onClick={handleSignOut}
            className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors duration-200"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="h-5 w-5 text-red-600 dark:text-red-400" />
          </button>
        </div>
      </div>
    </header>
  );
}
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (error: any) {
      setError(error.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-600 via-indigo-500 to-indigo-900 flex items-center justify-center px-4 py-8">
      {/* Background blur circles */}
      <div className="absolute top-10 left-16 w-80 h-80 bg-purple-300/30 rounded-full blur-2xl -z-10 opacity-70 animate-float"></div>
      <div className="absolute bottom-10 right-20 w-72 h-72 bg-indigo-400/30 rounded-full blur-xl -z-10 opacity-60 animate-float2"></div>
      
      <div className="relative w-full max-w-md rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl px-8 py-10 shadow-xl border border-gray-100 dark:border-gray-800 animate-in fade-in duration-600 transition-all">
        
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-14 w-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg scale-110 animate-bounce">
            <LogIn className="h-7 w-7 text-white" />
          </div>
          <h2 className="mt-5 text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-2 text-md text-gray-600 dark:text-gray-300">
            Sign in to continue your journey
          </p>
        </div>

        {/* Form */}
        <form className="space-y-7 mt-8" onSubmit={handleSubmit} autoComplete="off" data-form-type="login">
          {/* Email Input */}
          <div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-indigo-400" />
              </span>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                autoComplete="username"
                className="block w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/75 dark:bg-gray-800/75 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-300"
                placeholder="Email Address"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-indigo-400" />
              </span>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleInputChange}
                autoComplete="current-password"
                className="block w-full pl-12 pr-14 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/75 dark:bg-gray-800/75 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-300"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300" />
                ) : (
                  <Eye className="h-5 w-5 text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300" />
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-xl flex items-center space-x-2 animate-in slide-in-from-top-2 duration-300 shadow">
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <p className="text-md text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 text-md font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 animate-in slide-in-from-bottom-2"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Signing In...</span>
              </div>
            ) : (
              <span>Sign In</span>
            )}
          </button>

          {/* Signup Link */}
          <p className="text-center text-md text-gray-600 dark:text-gray-400 mt-3">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-semibold text-indigo-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;

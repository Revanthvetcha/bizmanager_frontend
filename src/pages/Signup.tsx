import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    try {
      await signup(formData.name, formData.email, formData.password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (error: any) {
      setError(error.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-600 via-indigo-500 to-indigo-900 flex items-center justify-center px-4 py-8">
      {/* Animated Background Bubbles */}
      <div className="absolute -top-24 -left-24 w-[26rem] h-[26rem] bg-purple-400/30 rounded-full blur-3xl opacity-70 animate-float-slow -z-10"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-400/30 rounded-full blur-xl -z-10 opacity-60 animate-float"></div>

      {/* Glassmorphic Card */}
      <div className="relative w-full max-w-md rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl px-8 py-10 shadow-xl border border-gray-100 dark:border-gray-800 ring-1 ring-indigo-300 dark:ring-purple-900 animate-in fade-in duration-600 transition-all flex flex-col justify-center min-h-[34rem]">
        {/* Animated Icon */}
        <div className="text-center">
          <div className="mx-auto h-14 w-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg relative">
            <span className="absolute w-5 h-5 bg-white/70 rounded-full blur-[4px] left-0 top-0 animate-pulse" />
            <UserPlus className={`h-7 w-7 text-white drop-shadow-lg transition-transform duration-700 ${
              success ? 'animate-bounce-once' : 'animate-grow-pulse'
            }`} />
          </div>
          <h2 className="mt-5 text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Create Your Account
          </h2>
          <p className="mt-2 text-md text-gray-600 dark:text-gray-300">
            Join us and start exploring today
          </p>
        </div>

        <form className="space-y-7 mt-8" onSubmit={handleSubmit} autoComplete="off" data-form-type="signup">
          {/* Name Input */}
          <div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-indigo-400" />
              </span>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                autoComplete="name"
                className="block w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/75 dark:bg-gray-800/75 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Full Name"
              />
            </div>
          </div>
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
                className="block w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/75 dark:bg-gray-800/75 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                autoComplete="new-password"
                className="block w-full pl-12 pr-14 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/75 dark:bg-gray-800/75 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300" />
                ) : (
                  <Eye className="h-5 w-5 text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300" />
                )}
              </button>
            </div>
          </div>
          {/* Confirm Password Input */}
          <div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-indigo-400" />
              </span>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                autoComplete="new-password"
                className="block w-full pl-12 pr-14 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/75 dark:bg-gray-800/75 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Confirm Password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300" />
                ) : (
                  <Eye className="h-5 w-5 text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300" />
                )}
              </button>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-xl flex items-center space-x-2 animate-in slide-in-from-top-2 duration-300 shadow">
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <p className="text-md text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-xl flex items-center space-x-2 animate-in slide-in-from-top-2 duration-300 shadow">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <p className="text-md text-green-600 dark:text-green-400">
                Account created! Redirecting to login...
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={success || isLoading}
            className="w-full py-3 px-4 text-md font-extrabold tracking-wide text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl hover:from-indigo-600 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-purple-500/60 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
          >
            {success ? (
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Account Created</span>
              </div>
            ) : isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Creating Account...</span>
              </div>
            ) : (
              <span>Create Account</span>
            )}
          </button>
          {/* Login Link */}
          <p className="text-center text-md text-gray-600 dark:text-gray-400 mt-3">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-indigo-500 hover:text-purple-500 dark:hover:text-purple-400 transition-colors duration-200"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
      {/* Custom CSS animations (add these to your global CSS or Tailwind config) */}
      <style>
        {`
        @keyframes grow-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.18) rotate(-6deg); }
        }
        .animate-grow-pulse { animation: grow-pulse 2.5s ease-in-out infinite; }
        @keyframes bounce-once {
          20% { transform: translateY(-10px) scale(1.10); }
          40% { transform: translateY(0) scale(1); }
          80% { transform: translateY(-3px) scale(1.08);}
          100% { transform: translateY(0);}
        }
        .animate-bounce-once { animation: bounce-once 0.8s cubic-bezier(.31,1.35,.49,1.01) 1; }
        @keyframes float-slow {
          0%, 100% { transform: translateY(-6px);}
          50% { transform: translateY(18px);}
        }
        .animate-float-slow { animation: float-slow 7s ease-in-out infinite; }
        @keyframes float {
          0%, 100% { transform: translateY(4px);}
          50% { transform: translateY(-10px);}
        }
        .animate-float { animation: float 5.5s ease-in-out infinite; }
        `}
      </style>
    </div>
  );
};

export default Signup;

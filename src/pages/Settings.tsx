import React, { useState, useRef } from 'react';
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, storage } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { User, Camera, Save, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

const Settings: React.FC = () => {
  const [user] = useAuthState(auth);
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  
  // Profile form data
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || '',
    photoURL: user?.photoURL || ''
  });
  
  // Password form data
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // UI states
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-dismiss messages after 3 seconds
  React.useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // Monitor network status
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    // Check if user is authenticated
    if (!user?.uid) {
      setError('You must be logged in to upload images');
      return;
    }

    setIsUploading(true);
    setError('');
    setSuccess('');

    // Set a timeout to prevent infinite loading
    const uploadTimeout = setTimeout(() => {
      if (isUploading) {
        setError('Upload is taking too long. Please try again.');
        setIsUploading(false);
      }
    }, 30000); // 30 seconds timeout

    // First try Firebase Storage upload
    try {
      // Create a unique filename
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop() || 'jpg';
      const fileName = `profile-${timestamp}.${fileExtension}`;
      
      // Upload image to Firebase Storage
      const imageRef = ref(storage, `profile-images/${user.uid}/${fileName}`);
      
      console.log('Starting upload...', { fileName, fileSize: file.size });
      
      await uploadBytes(imageRef, file);
      console.log('Upload completed, getting download URL...');
      
      const downloadURL = await getDownloadURL(imageRef);
      console.log('Download URL obtained:', downloadURL);
      
      setProfileData({
        ...profileData,
        photoURL: downloadURL
      });
      setSuccess('Image uploaded successfully!');
      
      // Clear the timeout since upload succeeded
      clearTimeout(uploadTimeout);
      
    } catch (error: any) {
      console.error('Firebase Storage upload error:', error);
      
      // Check if it's a CORS error
      if (error.message?.includes('CORS') || error.message?.includes('blocked by CORS policy')) {
        console.log('CORS error detected, using base64 fallback...');
        setError('CORS configuration issue detected. Using local storage fallback.');
      }
      
      // Try fallback method with base64 if Firebase Storage fails
      try {
        console.log('Firebase Storage failed, trying base64 fallback...');
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64String = e.target?.result as string;
          setProfileData({
            ...profileData,
            photoURL: base64String
          });
          setSuccess('Image uploaded successfully (stored locally)! Note: Image will be lost on page refresh. Please configure Firebase Storage CORS for permanent storage.');
          setIsUploading(false);
        };
        reader.onerror = () => {
          setError('Failed to process image file');
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
        clearTimeout(uploadTimeout);
        return;
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
      
      // Provide more specific error messages
      let errorMessage = 'Failed to upload image';
      if (error.code === 'storage/unauthorized') {
        errorMessage = 'You do not have permission to upload images';
      } else if (error.code === 'storage/canceled') {
        errorMessage = 'Upload was canceled';
      } else if (error.code === 'storage/unknown') {
        errorMessage = 'An unknown error occurred during upload';
      } else if (error.message?.includes('CORS')) {
        errorMessage = 'CORS configuration issue. Please configure Firebase Storage CORS rules for localhost:5173';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsUploading(false);
      clearTimeout(uploadTimeout);
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      if (!auth.currentUser) {
        setError('You must be logged in to update your profile');
        return;
      }

      // Check network connectivity
      if (!navigator.onLine) {
        setError('No internet connection. Please check your network and try again.');
        return;
      }

      // Retry logic for network failures
      let retryCount = 0;
      const maxRetries = 3;
      let lastError;

      while (retryCount < maxRetries) {
        try {
          await updateProfile(auth.currentUser, {
            displayName: profileData.displayName,
            photoURL: profileData.photoURL
          });
          setSuccess('Profile updated successfully!');
          return; // Success, exit the function
        } catch (retryError: any) {
          lastError = retryError;
          retryCount++;
          
          // If it's a network error and we have retries left, wait and try again
          if (retryError.code === 'auth/network-request-failed' && retryCount < maxRetries) {
            console.log(`Network error, retrying... (${retryCount}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)); // Exponential backoff
            continue;
          }
          
          // If it's not a network error or we've exhausted retries, throw the error
          throw retryError;
        }
      }
      
      // If we get here, all retries failed
      throw lastError;
      
    } catch (error: any) {
      console.error('Profile update error:', error);
      
      let errorMessage = 'Failed to update profile';
      
      if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network connection failed. Please check your internet connection and try again.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please wait a moment and try again.';
      } else if (error.code === 'auth/user-token-expired') {
        errorMessage = 'Your session has expired. Please sign in again.';
      } else if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'Please sign in again to update your profile.';
      } else if (error.message) {
        errorMessage = `Failed to update profile: ${error.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setIsSaving(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      setIsSaving(false);
      return;
    }

    try {
      // Re-authenticate user with current password
      const credential = EmailAuthProvider.credential(
        user?.email || '',
        passwordData.currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser!, credential);

      // Update password
      await updatePassword(auth.currentUser!, passwordData.newPassword);
      
      setSuccess('Password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      if (error.code === 'auth/wrong-password') {
        setError('Current password is incorrect');
      } else if (error.code === 'auth/weak-password') {
        setError('New password is too weak');
      } else {
        setError('Failed to update password: ' + error.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field]
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
        {/* Network Status Indicator */}
        {!isOnline && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-center animate-in slide-in-from-top-2 duration-300">
            <AlertCircle className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0" />
            <span className="text-yellow-700 dark:text-yellow-300">
              You're currently offline. Some features may not work properly.
            </span>
          </div>
        )}

        {/* Success/Error Messages at Top */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center animate-in slide-in-from-top-2 duration-300">
            <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
            <span className="text-green-700 dark:text-green-300">{success}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center animate-in slide-in-from-top-2 duration-300">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
            <span className="text-red-700 dark:text-red-300">{error}</span>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your account settings and preferences</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Profile Settings
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'security'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Security
              </button>
            </nav>
          </div>
        </div>

        {/* Profile Settings Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Profile Information</h2>
              <p className="text-gray-600 dark:text-gray-400">Update your profile information and photo</p>
            </div>

            <form onSubmit={handleProfileSave} className="space-y-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden">
                  {profileData.photoURL ? (
                    <img 
                      src={profileData.photoURL} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-white" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors duration-200 disabled:opacity-50"
                >
                  {isUploading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Camera className="h-5 w-5" />
                  )}
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click the camera icon to upload a new profile picture
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  JPG, PNG or GIF. Max size 5MB.
                </p>
              </div>
            </div>

            {/* Display Name */}
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Display Name
              </label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={profileData.displayName}
                onChange={handleProfileInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                placeholder="Enter your display name"
              />
            </div>

            {/* Email (Read-only) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Email cannot be changed. Contact support if needed.
              </p>
            </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={isSaving || !isOnline}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : !isOnline ? (
                    <>
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Offline - Cannot Save
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Change Password</h2>
              <p className="text-gray-600 dark:text-gray-400">Update your password to keep your account secure</p>
            </div>

            <form onSubmit={handlePasswordSave} className="space-y-5">
            {/* Current Password */}
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordInputChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                  placeholder="Enter your current password"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordInputChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                  placeholder="Enter your new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPasswords.new ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordInputChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                  placeholder="Confirm your new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={isSaving || !isOnline}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : !isOnline ? (
                    <>
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Offline - Cannot Update
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Update Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

    </div>
  );
};

export default Settings;

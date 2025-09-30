import React, { useState } from 'react';
import { Save, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import apiService from '../services/api';
// import { useAuth } from '../contexts/AuthContext'; // Commented out since profile functionality is disabled

const Settings: React.FC = () => {
  // const { user } = useAuth(); // Commented out since profile functionality is disabled
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('security');
  
  // Profile form data - COMMENTED OUT
  // const [profileData, setProfileData] = useState({
  //   displayName: user?.name || '',
  //   photoURL: user?.photoURL || ''
  // });

  // // Load profile data from localStorage as fallback
  // React.useEffect(() => {
  //   const savedProfileData = localStorage.getItem('profileData');
  //   if (savedProfileData) {
  //     try {
  //       const parsed = JSON.parse(savedProfileData);
  //       setProfileData(prev => ({
  //         ...prev,
  //         ...parsed
  //       }));
  //     } catch (error) {
  //       console.error('Failed to parse saved profile data:', error);
  //     }
  //   }
  // }, []);

  // // Save profile data to localStorage when it changes
  // React.useEffect(() => {
  //   localStorage.setItem('profileData', JSON.stringify(profileData));
  // }, [profileData]);
  
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
  // const [isUploading, setIsUploading] = useState(false); // COMMENTED OUT - Profile functionality
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  // const fileInputRef = useRef<HTMLInputElement>(null); // COMMENTED OUT - Profile functionality

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

  // const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setProfileData({
  //     ...profileData,
  //     [e.target.name]: e.target.value
  //   });
  // }; // COMMENTED OUT - Profile functionality

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  // const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   // Validate file type
  //   if (!file.type.startsWith('image/')) {
  //     setError('Please select a valid image file');
  //     return;
  //   }

  //   // Validate file size (max 5MB)
  //   if (file.size > 5 * 1024 * 1024) {
  //     setError('Image size must be less than 5MB');
  //     return;
  //   }

  //   setIsUploading(true);
  //   setError('');
  //   setSuccess('');

  //   try {
  //     // Compress and resize image before converting to base64
  //     const compressedBase64 = await compressImage(file);
      
  //     // Update local state immediately for preview
  //     setProfileData({
  //       ...profileData,
  //       photoURL: compressedBase64
  //     });

  //     // Try to save to backend, but don't fail the upload if backend fails
  //     try {
  //       await updateUser({
  //         name: profileData.displayName,
  //         photoURL: compressedBase64
  //       });
  //       setSuccess('Image uploaded and saved successfully!');
  //     } catch (error: any) {
  //       console.error('Backend save failed, but image is available locally:', error);
  //       if (error.message?.includes('Image too large')) {
  //         setError('Image is still too large. Please try a smaller image.');
  //       } else {
  //         setSuccess('Image uploaded successfully! (Note: Backend save failed - image will be saved when you click "Save Changes")');
  //       }
  //     }
      
  //     setIsUploading(false);
  //   } catch (error: any) {
  //     setError('Failed to upload image');
  //     setIsUploading(false);
  //   }
  // }; // COMMENTED OUT - Profile functionality

  // // Function to compress and resize image - COMMENTED OUT - Profile functionality
  // const compressImage = (file: File): Promise<string> => {
  //   return new Promise((resolve, reject) => {
  //     const canvas = document.createElement('canvas');
  //     const ctx = canvas.getContext('2d');
  //     const img = new Image();

  //     img.onload = () => {
  //       // Calculate new dimensions (max 300x300 while maintaining aspect ratio)
  //       const maxSize = 300;
  //       let { width, height } = img;
        
  //       if (width > height) {
  //         if (width > maxSize) {
  //           height = (height * maxSize) / width;
  //           width = maxSize;
  //         }
  //       } else {
  //         if (height > maxSize) {
  //           width = (width * maxSize) / height;
  //           height = maxSize;
  //         }
  //       }

  //       // Set canvas dimensions
  //       canvas.width = width;
  //       canvas.height = height;

  //       // Draw and compress
  //       ctx?.drawImage(img, 0, 0, width, height);
        
  //       // Convert to base64 with quality compression (0.8 = 80% quality)
  //       const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        
  //       // Check if compressed image is still too large (limit to ~50KB base64)
  //       if (compressedBase64.length > 50000) {
  //         // Further compress with lower quality
  //         const furtherCompressed = canvas.toDataURL('image/jpeg', 0.6);
  //         resolve(furtherCompressed);
  //       } else {
  //         resolve(compressedBase64);
  //       }
  //     };

  //     img.onerror = () => reject(new Error('Failed to load image'));
  //     img.src = URL.createObjectURL(file);
  //   });
  // };

  // const handleProfileSave = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsSaving(true);
  //   setError('');
  //   setSuccess('');

  //   try {
  //     // Update user profile
  //     await updateUser({
  //       name: profileData.displayName,
  //       photoURL: profileData.photoURL
  //     });
      
  //     setSuccess('Profile updated successfully!');
  //   } catch (error: any) {
  //     console.error('Profile save error:', error);
  //     if (error.message?.includes('Image too large')) {
  //       setError('Image is too large. Please try uploading a smaller image.');
  //     } else {
  //       setError(`Failed to update profile: ${error.message || 'Server error. Please try again.'}`);
  //     }
  //   } finally {
  //     setIsSaving(false);
  //   }
  // }; // COMMENTED OUT - Profile functionality

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
      // Call the real API to change password
      await apiService.changePassword(passwordData.currentPassword, passwordData.newPassword);
      setSuccess('Password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      console.error('Password change error:', error);
      setError(error.message || 'Failed to update password. Please check your current password.');
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
    <div className="max-w-6xl mx-auto">

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center animate-in slide-in-from-top-2 duration-300">
          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
          <span className="text-sm text-green-700 dark:text-green-300">{success}</span>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center animate-in slide-in-from-top-2 duration-300">
          <AlertCircle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
          <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
        </div>
      )}

      {/* Network Status Indicator */}
      {!isOnline && (
        <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-center animate-in slide-in-from-top-2 duration-300">
          <AlertCircle className="h-4 w-4 text-yellow-500 mr-2 flex-shrink-0" />
          <span className="text-sm text-yellow-700 dark:text-yellow-300">
            You're currently offline. Some features may not work properly.
          </span>
        </div>
      )}

      {/* Modern Tab Navigation - Profile Settings Tab Commented Out */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          {/* Profile Settings Tab - COMMENTED OUT */}
          {/* <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-all duration-200 ${
              activeTab === 'profile'
                ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Profile Settings
          </button> */}
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full py-2 px-4 rounded-md font-medium text-sm transition-all duration-200 ${
              activeTab === 'security'
                ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Security
          </button>
        </div>
      </div>

      {/* Profile Settings Tab - COMMENTED OUT */}
      {/* {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Picture</h3>
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden shadow-lg">
                    {profileData.photoURL ? (
                      <img 
                        src={profileData.photoURL} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-white" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="absolute -bottom-1 -right-1 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors duration-200 disabled:opacity-50"
                  >
                    {isUploading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Camera className="h-4 w-4" />
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
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    JPG, PNG or GIF. Max 5MB
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Information</h3>
              <form onSubmit={handleProfileSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                      placeholder="Enter your display name"
                    />
                  </div>

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
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={isSaving || !isOnline}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : !isOnline ? (
                      <>
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Offline
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
          </div>
        </div>
      )} */}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Change Password</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Update your password to keep your account secure</p>
          </div>

          <form onSubmit={handlePasswordSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                    placeholder="Current password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPasswords.current ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
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
                    className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                    placeholder="New password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPasswords.new ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordInputChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                    placeholder="Confirm password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isSaving || !isOnline}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : !isOnline ? (
                  <>
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Offline
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
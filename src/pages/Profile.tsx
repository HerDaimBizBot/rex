import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Settings, Moon, Sun, Save, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    theme: user?.theme || 'light'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    // In a real app, you would verify the current password
    // For demo purposes, we'll just update the stored password
    const users = JSON.parse(localStorage.getItem('medireminder_users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === user?.id);
    
    if (userIndex !== -1) {
      users[userIndex].password = passwordData.newPassword;
      localStorage.setItem('medireminder_users', JSON.stringify(users));
    }

    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowPasswordForm(false);
    toast.success('Password updated successfully');
  };

  const toggleTheme = () => {
    const newTheme = user?.theme === 'light' ? 'dark' : 'light';
    updateProfile({ theme: newTheme });
    setFormData(prev => ({ ...prev, theme: newTheme }));
    toast.success(`Switched to ${newTheme} theme`);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account preferences and settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">{user.username}</h2>
              <p className="text-gray-600 mb-4">{user.email || 'No email set'}</p>
              
              <div className="space-y-3">
                <div className="text-sm text-gray-500">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </div>
                
                {user.isAdmin && (
                  <div className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                    Admin
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                    >
                      Edit
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditing(false)}
                      className="text-gray-600 hover:text-gray-700 font-medium text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                {isEditing ? (
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                      </label>
                      <p className="text-gray-900">{user.username}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <p className="text-gray-900">{user.email || 'Not set'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Theme Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Appearance</h3>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Theme</h4>
                    <p className="text-sm text-gray-600">Choose your preferred theme</p>
                  </div>
                  
                  <button
                    onClick={toggleTheme}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      user.theme === 'dark' ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        user.theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                    <span className="sr-only">Toggle theme</span>
                  </button>
                </div>
                
                <div className="mt-4 flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Sun className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Light</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Moon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Dark</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Security</h3>
                  {!showPasswordForm && (
                    <button
                      onClick={() => setShowPasswordForm(true)}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                    >
                      Change Password
                    </button>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                {showPasswordForm ? (
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowPasswordForm(false);
                          setPasswordData({
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: ''
                          });
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      >
                        <Save className="h-4 w-4" />
                        <span>Update Password</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Password</h4>
                    <p className="text-sm text-gray-600">Last updated: Never</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
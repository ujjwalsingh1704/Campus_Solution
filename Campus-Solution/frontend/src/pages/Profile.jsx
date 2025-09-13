import React, { useState, useEffect } from 'react';
import { useAuth, useRole } from '../contexts/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Building, 
  Edit3, 
  Save, 
  X,
  Camera,
  Shield,
  Key,
  Bell,
  Palette,
  Globe
} from 'lucide-react';
import { studentAPI, facultyAPI } from '../utils/api';

const Profile = () => {
  const { user, logout } = useAuth();
  const { isStudent, isFaculty, isAdmin } = useRole();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+91 9876543210',
    address: '123 Campus Street, Mumbai, Maharashtra',
    dateOfBirth: '1999-05-15',
    department: user?.department || 'Computer Science',
    studentId: user?.studentId || '',
    employeeId: user?.employeeId || '',
    bio: 'Passionate about technology and learning new things.',
    interests: ['Programming', 'AI/ML', 'Web Development'],
    emergencyContact: '+91 9876543211',
    bloodGroup: 'O+',
    avatar: null
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [preferences, setPreferences] = useState({
    theme: 'dark',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    privacy: {
      showProfile: true,
      showEmail: false,
      showPhone: false
    }
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'preferences', name: 'Preferences', icon: Bell },
    { id: 'privacy', name: 'Privacy', icon: Key }
  ];

  const handleSaveProfile = async () => {
    try {
      // await studentAPI.updateProfile(profileData);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      alert('Password must be at least 8 characters long!');
      return;
    }

    try {
      // await authAPI.changePassword(passwordData);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('Password changed successfully!');
    } catch (error) {
      console.error('Failed to change password:', error);
      alert('Failed to change password. Please try again.');
    }
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData({ ...profileData, avatar: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            {profileData.avatar ? (
              <img src={profileData.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-white">{profileData.name.charAt(0)}</span>
            )}
          </div>
          {isEditing && (
            <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 p-2 rounded-full cursor-pointer transition-colors">
              <Camera size={16} className="text-white" />
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </label>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{profileData.name}</h2>
          <p className="text-gray-400">{user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}</p>
          <p className="text-blue-400">{profileData.department}</p>
        </div>
      </div>

      {/* Profile Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
          <input
            type="text"
            value={profileData.name}
            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
            disabled={!isEditing}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white disabled:opacity-50 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
          <input
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            disabled={!isEditing}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white disabled:opacity-50 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
          <input
            type="tel"
            value={profileData.phone}
            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
            disabled={!isEditing}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white disabled:opacity-50 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Date of Birth</label>
          <input
            type="date"
            value={profileData.dateOfBirth}
            onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
            disabled={!isEditing}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white disabled:opacity-50 focus:outline-none focus:border-blue-500"
          />
        </div>

        {isStudent && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Student ID</label>
            <input
              type="text"
              value={profileData.studentId}
              disabled
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white opacity-50"
            />
          </div>
        )}

        {(isFaculty || isAdmin) && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Employee ID</label>
            <input
              type="text"
              value={profileData.employeeId}
              disabled
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white opacity-50"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Department</label>
          <input
            type="text"
            value={profileData.department}
            disabled
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Blood Group</label>
          <select
            value={profileData.bloodGroup}
            onChange={(e) => setProfileData({ ...profileData, bloodGroup: e.target.value })}
            disabled={!isEditing}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white disabled:opacity-50 focus:outline-none focus:border-blue-500"
          >
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
        <textarea
          value={profileData.address}
          onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
          disabled={!isEditing}
          rows={3}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white disabled:opacity-50 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
        <textarea
          value={profileData.bio}
          onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
          disabled={!isEditing}
          rows={3}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white disabled:opacity-50 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Emergency Contact</label>
        <input
          type="tel"
          value={profileData.emergencyContact}
          onChange={(e) => setProfileData({ ...profileData, emergencyContact: e.target.value })}
          disabled={!isEditing}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white disabled:opacity-50 focus:outline-none focus:border-blue-500"
        />
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            onClick={handlePasswordChange}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Change Password
          </button>
        </div>
      </div>

      <div className="bg-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Two-Factor Authentication</h3>
        <p className="text-gray-300 mb-4">Add an extra layer of security to your account.</p>
        <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium transition-colors">
          Enable 2FA
        </button>
      </div>

      <div className="bg-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Active Sessions</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
            <div>
              <p className="text-white font-medium">Current Session</p>
              <p className="text-gray-400 text-sm">Chrome on Windows • Mumbai, India</p>
            </div>
            <span className="text-green-400 text-sm">Active</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
            <div>
              <p className="text-white font-medium">Mobile App</p>
              <p className="text-gray-400 text-sm">Android • Last seen 2 hours ago</p>
            </div>
            <button className="text-red-400 hover:text-red-300 text-sm">Revoke</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Appearance</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
            <select
              value={preferences.theme}
              onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
            <select
              value={preferences.language}
              onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="mr">Marathi</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Notifications</h3>
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.notifications.email}
              onChange={(e) => setPreferences({
                ...preferences,
                notifications: { ...preferences.notifications, email: e.target.checked }
              })}
              className="rounded border-gray-600 bg-gray-800 text-blue-600"
            />
            <span className="text-gray-300">Email notifications</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.notifications.push}
              onChange={(e) => setPreferences({
                ...preferences,
                notifications: { ...preferences.notifications, push: e.target.checked }
              })}
              className="rounded border-gray-600 bg-gray-800 text-blue-600"
            />
            <span className="text-gray-300">Push notifications</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.notifications.sms}
              onChange={(e) => setPreferences({
                ...preferences,
                notifications: { ...preferences.notifications, sms: e.target.checked }
              })}
              className="rounded border-gray-600 bg-gray-800 text-blue-600"
            />
            <span className="text-gray-300">SMS notifications</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Profile Visibility</h3>
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.privacy.showProfile}
              onChange={(e) => setPreferences({
                ...preferences,
                privacy: { ...preferences.privacy, showProfile: e.target.checked }
              })}
              className="rounded border-gray-600 bg-gray-800 text-blue-600"
            />
            <span className="text-gray-300">Show profile to other users</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.privacy.showEmail}
              onChange={(e) => setPreferences({
                ...preferences,
                privacy: { ...preferences.privacy, showEmail: e.target.checked }
              })}
              className="rounded border-gray-600 bg-gray-800 text-blue-600"
            />
            <span className="text-gray-300">Show email address</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.privacy.showPhone}
              onChange={(e) => setPreferences({
                ...preferences,
                privacy: { ...preferences.privacy, showPhone: e.target.checked }
              })}
              className="rounded border-gray-600 bg-gray-800 text-blue-600"
            />
            <span className="text-gray-300">Show phone number</span>
          </label>
        </div>
      </div>

      <div className="bg-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Data & Privacy</h3>
        <div className="space-y-3">
          <button className="w-full text-left bg-gray-800 hover:bg-gray-600 p-3 rounded-lg transition-colors">
            <p className="text-white font-medium">Download my data</p>
            <p className="text-gray-400 text-sm">Get a copy of your data</p>
          </button>
          <button className="w-full text-left bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 p-3 rounded-lg transition-colors">
            <p className="text-red-400 font-medium">Delete my account</p>
            <p className="text-red-300 text-sm">Permanently delete your account and data</p>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
              <p className="text-purple-100">Manage your account information and preferences</p>
            </div>
            <div className="flex space-x-2">
              {activeTab === 'profile' && (
                <>
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSaveProfile}
                        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                      >
                        <Save size={16} className="mr-2" />
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                      >
                        <X size={16} className="mr-2" />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                    >
                      <Edit3 size={16} className="mr-2" />
                      Edit Profile
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="flex border-b border-gray-700">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <Icon size={20} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>

          <div className="p-6">
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'security' && renderSecurityTab()}
            {activeTab === 'preferences' && renderPreferencesTab()}
            {activeTab === 'privacy' && renderPrivacyTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

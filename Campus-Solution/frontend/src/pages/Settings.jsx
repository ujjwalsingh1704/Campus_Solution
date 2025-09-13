import React, { useState } from 'react';
import { useAuth, useRole } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { 
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
  Database,
  Mail,
  Palette,
  Globe,
  Lock,
  Save,
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const { isAdmin } = useRole();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'Campus Solutions',
    siteDescription: 'Complete campus management platform',
    timezone: 'Asia/Kolkata',
    language: 'en',
    
    // Security Settings
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    },
    sessionTimeout: 30,
    twoFactorAuth: false,
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    maintenanceAlerts: true,
    
    // System Settings
    maxFileSize: 10,
    allowedFileTypes: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
    backupFrequency: 'daily',
    logRetention: 30,
    
    // Appearance Settings
    theme: 'dark',
    primaryColor: '#6366f1',
    logoUrl: '',
    faviconUrl: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  if (!isAdmin) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <Shield className="mx-auto mb-4 text-red-400" size={48} />
            <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
            <p className="text-gray-400">You don't have permission to access settings.</p>
          </div>
        </div>
      </Layout>
    );
  }

  const tabs = [
    { id: 'general', name: 'General', icon: SettingsIcon },
    { id: 'security', name: 'Security', icon: Lock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'system', name: 'System', icon: Database },
    { id: 'appearance', name: 'Appearance', icon: Palette }
  ];

  const handleSave = () => {
    // In a real app, this would save to backend
    console.log('Saving settings:', settings);
    alert('Settings saved successfully!');
  };

  const updateSetting = (category, key, value) => {
    if (category) {
      setSettings(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [key]: value
        }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Site Name</label>
        <input
          type="text"
          value={settings.siteName}
          onChange={(e) => updateSetting(null, 'siteName', e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Site Description</label>
        <textarea
          value={settings.siteDescription}
          onChange={(e) => updateSetting(null, 'siteDescription', e.target.value)}
          rows={3}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Timezone</label>
          <select
            value={settings.timezone}
            onChange={(e) => updateSetting(null, 'timezone', e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
          >
            <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
            <option value="UTC">UTC</option>
            <option value="America/New_York">America/New_York (EST)</option>
            <option value="Europe/London">Europe/London (GMT)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
          <select
            value={settings.language}
            onChange={(e) => updateSetting(null, 'language', e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Password Policy</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Minimum Password Length</label>
            <input
              type="number"
              value={settings.passwordPolicy.minLength}
              onChange={(e) => updateSetting('passwordPolicy', 'minLength', parseInt(e.target.value))}
              min="6"
              max="20"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.passwordPolicy.requireUppercase}
                onChange={(e) => updateSetting('passwordPolicy', 'requireUppercase', e.target.checked)}
                className="mr-3 rounded bg-gray-700 border-gray-600 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-gray-300">Require uppercase letters</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.passwordPolicy.requireNumbers}
                onChange={(e) => updateSetting('passwordPolicy', 'requireNumbers', e.target.checked)}
                className="mr-3 rounded bg-gray-700 border-gray-600 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-gray-300">Require numbers</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.passwordPolicy.requireSpecialChars}
                onChange={(e) => updateSetting('passwordPolicy', 'requireSpecialChars', e.target.checked)}
                className="mr-3 rounded bg-gray-700 border-gray-600 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-gray-300">Require special characters</span>
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Session Timeout (minutes)</label>
          <input
            type="number"
            value={settings.sessionTimeout}
            onChange={(e) => updateSetting(null, 'sessionTimeout', parseInt(e.target.value))}
            min="5"
            max="480"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="flex items-center mt-8">
            <input
              type="checkbox"
              checked={settings.twoFactorAuth}
              onChange={(e) => updateSetting(null, 'twoFactorAuth', e.target.checked)}
              className="mr-3 rounded bg-gray-700 border-gray-600 text-purple-600 focus:ring-purple-500"
            />
            <span className="text-gray-300">Enable Two-Factor Authentication</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.emailNotifications}
            onChange={(e) => updateSetting(null, 'emailNotifications', e.target.checked)}
            className="mr-3 rounded bg-gray-700 border-gray-600 text-purple-600 focus:ring-purple-500"
          />
          <span className="text-gray-300">Email Notifications</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.pushNotifications}
            onChange={(e) => updateSetting(null, 'pushNotifications', e.target.checked)}
            className="mr-3 rounded bg-gray-700 border-gray-600 text-purple-600 focus:ring-purple-500"
          />
          <span className="text-gray-300">Push Notifications</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.smsNotifications}
            onChange={(e) => updateSetting(null, 'smsNotifications', e.target.checked)}
            className="mr-3 rounded bg-gray-700 border-gray-600 text-purple-600 focus:ring-purple-500"
          />
          <span className="text-gray-300">SMS Notifications</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.maintenanceAlerts}
            onChange={(e) => updateSetting(null, 'maintenanceAlerts', e.target.checked)}
            className="mr-3 rounded bg-gray-700 border-gray-600 text-purple-600 focus:ring-purple-500"
          />
          <span className="text-gray-300">Maintenance Alerts</span>
        </label>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Max File Size (MB)</label>
          <input
            type="number"
            value={settings.maxFileSize}
            onChange={(e) => updateSetting(null, 'maxFileSize', parseInt(e.target.value))}
            min="1"
            max="100"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Backup Frequency</label>
          <select
            value={settings.backupFrequency}
            onChange={(e) => updateSetting(null, 'backupFrequency', e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Allowed File Types</label>
        <input
          type="text"
          value={settings.allowedFileTypes.join(', ')}
          onChange={(e) => updateSetting(null, 'allowedFileTypes', e.target.value.split(', '))}
          placeholder="jpg, png, pdf, doc"
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
        />
        <p className="text-gray-400 text-sm mt-1">Separate file extensions with commas</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Log Retention (days)</label>
        <input
          type="number"
          value={settings.logRetention}
          onChange={(e) => updateSetting(null, 'logRetention', parseInt(e.target.value))}
          min="1"
          max="365"
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
        />
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
          <select
            value={settings.theme}
            onChange={(e) => updateSetting(null, 'theme', e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="auto">Auto</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Primary Color</label>
          <input
            type="color"
            value={settings.primaryColor}
            onChange={(e) => updateSetting(null, 'primaryColor', e.target.value)}
            className="w-full h-10 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Logo URL</label>
        <input
          type="url"
          value={settings.logoUrl}
          onChange={(e) => updateSetting(null, 'logoUrl', e.target.value)}
          placeholder="https://example.com/logo.png"
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Favicon URL</label>
        <input
          type="url"
          value={settings.faviconUrl}
          onChange={(e) => updateSetting(null, 'faviconUrl', e.target.value)}
          placeholder="https://example.com/favicon.ico"
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
        />
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'security':
        return renderSecuritySettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'system':
        return renderSystemSettings();
      case 'appearance':
        return renderAppearanceSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="mr-3 p-2 rounded-lg bg-purple-700 hover:bg-purple-800 transition-colors"
                >
                  <ArrowLeft size={20} className="text-white" />
                </button>
                <h1 className="text-3xl font-bold">System Settings</h1>
              </div>
              <p className="text-purple-100">Configure system preferences and security settings</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-left ${
                        activeTab === tab.id
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      <Icon size={20} />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  {tabs.find(tab => tab.id === activeTab)?.name} Settings
                </h2>
                <button
                  onClick={handleSave}
                  className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white font-medium transition-colors flex items-center"
                >
                  <Save size={16} className="mr-2" />
                  Save Changes
                </button>
              </div>

              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;

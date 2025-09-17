/**
 * Settings Component - Application Settings and User Preferences
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @created 2024-01-20
 */
import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  CreditCard,
  Save
} from 'lucide-react';

export const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [settings, setSettings] = useState({
    profile: {
      name: 'Alex Morgan',
      email: 'alex@fintech.com',
      company: 'FinTech Pro',
      timezone: 'America/New_York',
      language: 'en'
    },
    notifications: {
      emailAlerts: true,
      smsAlerts: false,
      webhookFailures: true,
      securityEvents: true,
      apiUpdates: true,
      billing: true
    },
    security: {
      twoFactorAuth: false,
      apiKeyRotation: true,
      sessionTimeout: 30,
      ipWhitelist: ''
    },
    api: {
      defaultRateLimit: 1000,
      webhookRetries: 3,
      requestTimeout: 30,
      enableCors: true
    },
    billing: {
      plan: 'Professional',
      billingCycle: 'monthly',
      autoRenewal: true,
      invoiceEmail: 'billing@fintech.com'
    }
  });

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'api', label: 'API Settings', icon: SettingsIcon },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  const handleSave = () => {
    // Simulate saving settings
    alert('Settings saved successfully!');
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white">Profile Settings</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
          <input
            type="text"
            value={settings.profile.name}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              profile: { ...prev.profile, name: e.target.value }
            }))}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
          <input
            type="email"
            value={settings.profile.email}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              profile: { ...prev.profile, email: e.target.value }
            }))}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
          <input
            type="text"
            value={settings.profile.company}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              profile: { ...prev.profile, company: e.target.value }
            }))}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Timezone</label>
          <select
            value={settings.profile.timezone}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              profile: { ...prev.profile, timezone: e.target.value }
            }))}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
            <option value="Europe/London">London</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white">Notification Preferences</h3>
      <div className="space-y-4">
        {Object.entries(settings.notifications).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <h4 className="text-white font-medium">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </h4>
              <p className="text-gray-400 text-sm">
                {key === 'emailAlerts' && 'Receive important updates via email'}
                {key === 'smsAlerts' && 'Get critical alerts via SMS'}
                {key === 'webhookFailures' && 'Notifications for webhook delivery failures'}
                {key === 'securityEvents' && 'Security-related notifications'}
                {key === 'apiUpdates' && 'API version updates and changes'}
                {key === 'billing' && 'Billing and payment notifications'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={value as boolean}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, [key]: e.target.checked }
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:ring-2 peer-focus:ring-cyan-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white">Security Settings</h3>
      <div className="space-y-6">
        <div className="p-4 bg-white/5 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-white font-medium">Two-Factor Authentication</h4>
              <p className="text-gray-400 text-sm">Add an extra layer of security to your account</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.security.twoFactorAuth}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  security: { ...prev.security, twoFactorAuth: e.target.checked }
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:ring-2 peer-focus:ring-cyan-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Session Timeout (minutes)</label>
            <input
              type="number"
              value={settings.security.sessionTimeout}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                security: { ...prev.security, sessionTimeout: parseInt(e.target.value) }
              }))}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">IP Whitelist (comma-separated)</label>
            <input
              type="text"
              value={settings.security.ipWhitelist}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                security: { ...prev.security, ipWhitelist: e.target.value }
              }))}
              placeholder="192.168.1.1, 10.0.0.1"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'profile': return renderProfileSettings();
      case 'notifications': return renderNotificationSettings();
      case 'security': return renderSecuritySettings();
      case 'appearance':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Appearance Settings</h3>
            <div className="p-8 text-center text-gray-400">
              <Palette className="w-12 h-12 mx-auto mb-4 text-gray-500" />
              <p>Appearance customization options coming soon!</p>
            </div>
          </div>
        );
      case 'api':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">API Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Default Rate Limit (req/min)</label>
                <input
                  type="number"
                  value={settings.api.defaultRateLimit}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    api: { ...prev.api, defaultRateLimit: parseInt(e.target.value) }
                  }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Request Timeout (seconds)</label>
                <input
                  type="number"
                  value={settings.api.requestTimeout}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    api: { ...prev.api, requestTimeout: parseInt(e.target.value) }
                  }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
            </div>
          </div>
        );
      case 'billing':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Billing Settings</h3>
            <div className="bg-white/5 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-white font-medium">Current Plan</h4>
                  <p className="text-gray-400">{settings.billing.plan}</p>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all">
                  Upgrade Plan
                </button>
              </div>
              <div className="text-gray-400 text-sm">
                Next billing date: February 20, 2024
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage your account and application preferences</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="flex space-x-6">
        <div className="w-1/4">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
            <nav className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/30'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};
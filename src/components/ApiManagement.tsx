/**
 * API Management Component - API Keys and Endpoint Management
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @created 2024-01-20
 */
import React, { useState } from 'react';
import { Plus, Key, Globe, Clock, Shield, Zap, Copy, Eye, Settings } from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  environment: 'production' | 'sandbox';
  permissions: string[];
  created: string;
  lastUsed: string;
  requests: number;
}

export const ApiManagement: React.FC = () => {
  const [showCreateKey, setShowCreateKey] = useState(false);
  const [apiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'Production Key',
      key: 'ft_live_sk_1234567890abcdef',
      environment: 'production',
      permissions: ['payments', 'users', 'analytics'],
      created: '2024-01-15',
      lastUsed: '2 hours ago',
      requests: 1250000
    },
    {
      id: '2',
      name: 'Development Key',
      key: 'ft_test_sk_0987654321fedcba',
      environment: 'sandbox',
      permissions: ['payments', 'users'],
      created: '2024-01-10',
      lastUsed: '5 minutes ago',
      requests: 45000
    }
  ]);

  const endpoints = [
    { method: 'POST', path: '/v1/payments/create', description: 'Process a new payment', status: 'active' },
    { method: 'GET', path: '/v1/payments/{id}', description: 'Retrieve payment details', status: 'active' },
    { method: 'POST', path: '/v1/users/create', description: 'Create a new user account', status: 'active' },
    { method: 'GET', path: '/v1/users/{id}', description: 'Get user information', status: 'active' },
    { method: 'POST', path: '/v1/webhooks/register', description: 'Register webhook endpoint', status: 'active' },
    { method: 'GET', path: '/v1/analytics/transactions', description: 'Get transaction analytics', status: 'beta' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">API Management</h1>
          <p className="text-gray-400">Manage your API keys, endpoints, and documentation</p>
        </div>
        <button
          onClick={() => setShowCreateKey(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Generate API Key</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Key className="w-6 h-6 text-cyan-400" />
            <h3 className="text-xl font-semibold text-white">Active Keys</h3>
          </div>
          <p className="text-3xl font-bold text-white mb-2">{apiKeys.length}</p>
          <p className="text-gray-400 text-sm">API keys in use</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Globe className="w-6 h-6 text-green-400" />
            <h3 className="text-xl font-semibold text-white">Endpoints</h3>
          </div>
          <p className="text-3xl font-bold text-white mb-2">{endpoints.length}</p>
          <p className="text-gray-400 text-sm">Available endpoints</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Zap className="w-6 h-6 text-yellow-400" />
            <h3 className="text-xl font-semibold text-white">Requests Today</h3>
          </div>
          <p className="text-3xl font-bold text-white mb-2">2.1M</p>
          <p className="text-gray-400 text-sm">+8.2% from yesterday</p>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">API Keys</h3>
        <div className="space-y-4">
          {apiKeys.map((key) => (
            <div key={key.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    key.environment === 'production' 
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}>
                    {key.environment}
                  </div>
                  <h4 className="text-white font-medium">{key.name}</h4>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="font-mono text-sm bg-black/30 p-3 rounded border border-white/10 mb-4">
                <span className="text-gray-400">{key.key}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-400 mb-1">Created</p>
                  <p className="text-white">{key.created}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Last Used</p>
                  <p className="text-white">{key.lastUsed}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Total Requests</p>
                  <p className="text-white">{key.requests.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {key.permissions.map((permission) => (
                  <span key={permission} className="px-2 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded">
                    {permission}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">API Endpoints</h3>
        <div className="space-y-3">
          {endpoints.map((endpoint, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
              <div className="flex items-center space-x-4">
                <span className={`px-2 py-1 text-xs font-mono font-medium rounded ${
                  endpoint.method === 'GET' ? 'bg-blue-500/20 text-blue-300' :
                  endpoint.method === 'POST' ? 'bg-green-500/20 text-green-300' :
                  'bg-yellow-500/20 text-yellow-300'
                }`}>
                  {endpoint.method}
                </span>
                <code className="text-gray-300 font-mono">{endpoint.path}</code>
                <span className="text-gray-400">{endpoint.description}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 text-xs rounded ${
                  endpoint.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-orange-500/20 text-orange-300'
                }`}>
                  {endpoint.status}
                </span>
                <button className="text-gray-400 hover:text-white">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
/**
 * Developer Portal Component - API Documentation and Developer Tools
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @created 2024-01-20
 */
import React, { useState } from 'react';
import { Book, Code, Play, Download, ExternalLink, Copy, Terminal } from 'lucide-react';

export const DeveloperPortal: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState('payments');
  const [activeTab, setActiveTab] = useState('overview');

  const endpoints = {
    payments: {
      name: 'Payments API',
      description: 'Process payments securely with our comprehensive payments API',
      baseUrl: 'https://api.fintech.com/v1/payments',
      methods: [
        {
          method: 'POST',
          path: '/create',
          description: 'Create a new payment',
          params: [
            { name: 'amount', type: 'number', required: true, description: 'Payment amount in cents' },
            { name: 'currency', type: 'string', required: true, description: 'Currency code (USD, EUR, GBP)' },
            { name: 'customer_id', type: 'string', required: true, description: 'Customer identifier' },
            { name: 'description', type: 'string', required: false, description: 'Payment description' },
          ]
        },
        {
          method: 'GET',
          path: '/{id}',
          description: 'Retrieve payment details',
          params: [
            { name: 'id', type: 'string', required: true, description: 'Payment ID' },
          ]
        }
      ]
    },
    users: {
      name: 'Users API',
      description: 'Manage user accounts and authentication',
      baseUrl: 'https://api.fintech.com/v1/users',
      methods: [
        {
          method: 'POST',
          path: '/create',
          description: 'Create a new user',
          params: [
            { name: 'email', type: 'string', required: true, description: 'User email address' },
            { name: 'name', type: 'string', required: true, description: 'Full name' },
            { name: 'role', type: 'string', required: false, description: 'User role (admin, developer, viewer)' },
          ]
        }
      ]
    }
  };

  const codeExamples = {
    curl: `curl -X POST https://api.fintech.com/v1/payments/create \\
  -H "Authorization: Bearer ft_live_sk_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 2000,
    "currency": "USD",
    "customer_id": "cust_12345",
    "description": "Invoice #1234"
  }'`,
    javascript: `const response = await fetch('https://api.fintech.com/v1/payments/create', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ft_live_sk_...',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    amount: 2000,
    currency: 'USD',
    customer_id: 'cust_12345',
    description: 'Invoice #1234'
  })
});

const payment = await response.json();`,
    python: `import requests

response = requests.post(
    'https://api.fintech.com/v1/payments/create',
    headers={
        'Authorization': 'Bearer ft_live_sk_...',
        'Content-Type': 'application/json',
    },
    json={
        'amount': 2000,
        'currency': 'USD',
        'customer_id': 'cust_12345',
        'description': 'Invoice #1234'
    }
)

payment = response.json()`
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Developer Portal</h1>
          <p className="text-gray-400">Documentation, SDKs, and tools for developers</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
            <Download className="w-4 h-4" />
            <span>Download SDK</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all">
            <ExternalLink className="w-4 h-4" />
            <span>Open Sandbox</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Book className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Documentation</h3>
          </div>
          <p className="text-2xl font-bold text-white mb-2">45</p>
          <p className="text-gray-400 text-sm">API endpoints documented</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Code className="w-6 h-6 text-green-400" />
            <h3 className="text-lg font-semibold text-white">SDKs</h3>
          </div>
          <p className="text-2xl font-bold text-white mb-2">8</p>
          <p className="text-gray-400 text-sm">Programming languages</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Play className="w-6 h-6 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Sandbox</h3>
          </div>
          <p className="text-2xl font-bold text-white mb-2">24/7</p>
          <p className="text-gray-400 text-sm">Test environment available</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Terminal className="w-6 h-6 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">Examples</h3>
          </div>
          <p className="text-2xl font-bold text-white mb-2">120+</p>
          <p className="text-gray-400 text-sm">Code examples</p>
        </div>
      </div>

      <div className="flex space-x-6">
        <div className="w-1/4">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4">API Reference</h3>
            <nav className="space-y-2">
              {Object.entries(endpoints).map(([key, endpoint]) => (
                <button
                  key={key}
                  onClick={() => setSelectedEndpoint(key)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedEndpoint === key
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {endpoint.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl">
            <div className="border-b border-white/10 p-4">
              <div className="flex space-x-4">
                {['overview', 'reference', 'examples'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === tab
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {endpoints[selectedEndpoint as keyof typeof endpoints].name}
                    </h2>
                    <p className="text-gray-400 mb-4">
                      {endpoints[selectedEndpoint as keyof typeof endpoints].description}
                    </p>
                    <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                      <span className="text-gray-400">Base URL: </span>
                      <code className="text-cyan-400 font-mono">
                        {endpoints[selectedEndpoint as keyof typeof endpoints].baseUrl}
                      </code>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Available Methods</h3>
                    <div className="space-y-3">
                      {endpoints[selectedEndpoint as keyof typeof endpoints].methods.map((method, index) => (
                        <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className={`px-2 py-1 text-xs font-mono font-medium rounded ${
                              method.method === 'GET' ? 'bg-blue-500/20 text-blue-300' :
                              method.method === 'POST' ? 'bg-green-500/20 text-green-300' :
                              'bg-yellow-500/20 text-yellow-300'
                            }`}>
                              {method.method}
                            </span>
                            <code className="text-gray-300">{method.path}</code>
                          </div>
                          <p className="text-gray-400 text-sm">{method.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reference' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">API Reference</h2>
                  {endpoints[selectedEndpoint as keyof typeof endpoints].methods.map((method, index) => (
                    <div key={index} className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 text-sm font-mono font-medium rounded ${
                          method.method === 'GET' ? 'bg-blue-500/20 text-blue-300' :
                          method.method === 'POST' ? 'bg-green-500/20 text-green-300' :
                          'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {method.method}
                        </span>
                        <code className="text-white font-mono text-lg">{method.path}</code>
                      </div>
                      
                      <p className="text-gray-300">{method.description}</p>

                      <div>
                        <h4 className="text-lg font-semibold text-white mb-3">Parameters</h4>
                        <div className="overflow-hidden border border-white/10 rounded-lg">
                          <table className="w-full">
                            <thead className="bg-white/5">
                              <tr>
                                <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
                                <th className="text-left py-3 px-4 text-gray-400 font-medium">Type</th>
                                <th className="text-left py-3 px-4 text-gray-400 font-medium">Required</th>
                                <th className="text-left py-3 px-4 text-gray-400 font-medium">Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              {method.params.map((param, paramIndex) => (
                                <tr key={paramIndex} className="border-t border-white/10">
                                  <td className="py-3 px-4 font-mono text-cyan-400">{param.name}</td>
                                  <td className="py-3 px-4 text-gray-300">{param.type}</td>
                                  <td className="py-3 px-4">
                                    <span className={`px-2 py-1 text-xs rounded ${
                                      param.required ? 'bg-red-500/20 text-red-300' : 'bg-gray-500/20 text-gray-300'
                                    }`}>
                                      {param.required ? 'Required' : 'Optional'}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-gray-300">{param.description}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'examples' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">Code Examples</h2>
                  
                  {Object.entries(codeExamples).map(([language, code]) => (
                    <div key={language} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white capitalize">{language}</h3>
                        <button className="flex items-center space-x-2 px-3 py-1 bg-white/10 text-gray-300 rounded-lg hover:text-white hover:bg-white/20 transition-colors text-sm">
                          <Copy className="w-4 h-4" />
                          <span>Copy</span>
                        </button>
                      </div>
                      <div className="bg-black/40 rounded-lg p-4 border border-white/10 overflow-x-auto">
                        <pre className="text-sm text-gray-300">
                          <code>{code}</code>
                        </pre>
                      </div>
                    </div>
                  ))}

                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <h4 className="text-green-300 font-medium mb-2">Response Example</h4>
                    <div className="bg-black/40 rounded p-3">
                      <pre className="text-sm text-gray-300">
{`{
  "id": "pay_1234567890",
  "amount": 2000,
  "currency": "USD",
  "status": "succeeded",
  "customer_id": "cust_12345",
  "description": "Invoice #1234",
  "created": "2024-01-20T14:30:25Z"
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
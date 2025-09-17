/**
 * Security Component - Security Center and Compliance Monitoring
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @created 2024-01-20
 */
import React from 'react';
import { Shield, Lock, AlertTriangle, CheckCircle, Eye, Key, Globe, Server } from 'lucide-react';

export const Security: React.FC = () => {
  const securityMetrics = [
    { label: 'Threat Detection', value: '99.9%', status: 'excellent', icon: Shield },
    { label: 'SSL Certificate', value: 'Valid', status: 'good', icon: Lock },
    { label: 'Failed Logins', value: '12', status: 'warning', icon: AlertTriangle },
    { label: 'Active Sessions', value: '847', status: 'good', icon: Eye },
  ];

  const securityEvents = [
    { type: 'info', message: 'SSL certificate renewed successfully', time: '5 minutes ago', severity: 'low' },
    { type: 'warning', message: 'Multiple failed login attempts detected', time: '12 minutes ago', severity: 'medium' },
    { type: 'success', message: 'Security scan completed - no threats found', time: '1 hour ago', severity: 'low' },
    { type: 'info', message: 'New API key generated', time: '2 hours ago', severity: 'low' },
    { type: 'warning', message: 'Rate limit exceeded for IP 192.168.1.100', time: '3 hours ago', severity: 'medium' },
  ];

  const complianceChecks = [
    { name: 'PCI DSS Compliance', status: 'compliant', lastCheck: '2024-01-20' },
    { name: 'SOX Compliance', status: 'compliant', lastCheck: '2024-01-19' },
    { name: 'GDPR Compliance', status: 'compliant', lastCheck: '2024-01-18' },
    { name: 'HIPAA Compliance', status: 'partial', lastCheck: '2024-01-17' },
    { name: 'ISO 27001', status: 'compliant', lastCheck: '2024-01-16' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Security Center</h1>
          <p className="text-gray-400">Monitor system security and compliance status</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
            Run Security Scan
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all">
            Generate Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {securityMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-3 rounded-lg ${
                  metric.status === 'excellent' ? 'bg-green-500/20' :
                  metric.status === 'good' ? 'bg-blue-500/20' : 'bg-yellow-500/20'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    metric.status === 'excellent' ? 'text-green-400' :
                    metric.status === 'good' ? 'text-blue-400' : 'text-yellow-400'
                  }`} />
                </div>
                <h3 className="text-lg font-semibold text-white">{metric.label}</h3>
              </div>
              <p className={`text-2xl font-bold mb-2 ${
                metric.status === 'excellent' ? 'text-green-400' :
                metric.status === 'good' ? 'text-blue-400' : 'text-yellow-400'
              }`}>{metric.value}</p>
              <p className="text-gray-400 text-sm capitalize">{metric.status} status</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Security Events</h3>
          <div className="space-y-4">
            {securityEvents.map((event, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg">
                <div className={`p-2 rounded-full ${
                  event.type === 'success' ? 'bg-green-500/20' :
                  event.type === 'warning' ? 'bg-yellow-500/20' : 'bg-blue-500/20'
                }`}>
                  {event.type === 'success' && <CheckCircle className="w-4 h-4 text-green-400" />}
                  {event.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-400" />}
                  {event.type === 'info' && <Shield className="w-4 h-4 text-blue-400" />}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm">{event.message}</p>
                  <p className="text-gray-400 text-xs">{event.time}</p>
                </div>
                <div className={`px-2 py-1 rounded text-xs ${
                  event.severity === 'high' ? 'bg-red-500/20 text-red-300' :
                  event.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-green-500/20 text-green-300'
                }`}>
                  {event.severity}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Compliance Status</h3>
          <div className="space-y-4">
            {complianceChecks.map((check, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">{check.name}</p>
                  <p className="text-gray-400 text-sm">Last check: {check.lastCheck}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    check.status === 'compliant' ? 'bg-green-400' :
                    check.status === 'partial' ? 'bg-yellow-400' : 'bg-red-400'
                  }`} />
                  <span className={`text-sm font-medium capitalize ${
                    check.status === 'compliant' ? 'text-green-400' :
                    check.status === 'partial' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {check.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Key className="w-6 h-6 text-cyan-400" />
            <h3 className="text-xl font-semibold text-white">API Security</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Rate Limiting</span>
              <span className="text-green-400">Enabled</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">API Key Rotation</span>
              <span className="text-green-400">Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Request Signing</span>
              <span className="text-green-400">Enforced</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">IP Whitelist</span>
              <span className="text-yellow-400">Partial</span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Globe className="w-6 h-6 text-green-400" />
            <h3 className="text-xl font-semibold text-white">Network Security</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">DDoS Protection</span>
              <span className="text-green-400">Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Firewall</span>
              <span className="text-green-400">Enabled</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">VPN Access</span>
              <span className="text-blue-400">Configured</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Intrusion Detection</span>
              <span className="text-green-400">Running</span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Server className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-semibold text-white">Infrastructure</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Encryption at Rest</span>
              <span className="text-green-400">AES-256</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Backup Encryption</span>
              <span className="text-green-400">Enabled</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Access Logs</span>
              <span className="text-green-400">Monitored</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Vulnerability Scan</span>
              <span className="text-green-400">Daily</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Security Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-300 font-medium">Medium Priority</span>
            </div>
            <p className="text-gray-300 text-sm">Enable two-factor authentication for all admin accounts</p>
          </div>
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-5 h-5 text-blue-400" />
              <span className="text-blue-300 font-medium">Low Priority</span>
            </div>
            <p className="text-gray-300 text-sm">Update API documentation to include security best practices</p>
          </div>
        </div>
      </div>
    </div>
  );
};
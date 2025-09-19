/**
 * Fraud Alerts Component - Basic Fraud Detection & Notifications
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @created 2024-01-20
 */
import React, { useState } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  MapPin, 
  Clock,
  CreditCard,
  Smartphone,
  Globe,
  Eye,
  Ban,
  Bell
} from 'lucide-react';

interface FraudAlert {
  id: string;
  type: 'suspicious_location' | 'unusual_amount' | 'new_device' | 'velocity_check' | 'merchant_risk';
  title: string;
  description: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'resolved' | 'false_positive';
  transactionId?: string;
  location?: string;
  amount?: number;
  merchantName?: string;
}

interface SecurityMetric {
  label: string;
  value: string;
  status: 'good' | 'warning' | 'critical';
  icon: React.ComponentType<any>;
}

export const FraudAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<FraudAlert[]>([
    {
      id: '1',
      type: 'suspicious_location',
      title: 'Unusual Location Detected',
      description: 'Transaction attempted from New York, NY - 2,847 miles from your usual location',
      timestamp: '15 minutes ago',
      severity: 'high',
      status: 'active',
      transactionId: 'txn_suspicious_001',
      location: 'New York, NY',
      amount: 1250.00,
      merchantName: 'Electronics Store NYC'
    },
    {
      id: '2',
      type: 'unusual_amount',
      title: 'Large Transaction Alert',
      description: 'Transaction amount is 340% higher than your typical spending pattern',
      timestamp: '2 hours ago',
      severity: 'medium',
      status: 'resolved',
      transactionId: 'txn_large_002',
      amount: 2500.00,
      merchantName: 'Premium Electronics'
    },
    {
      id: '3',
      type: 'new_device',
      title: 'New Device Login',
      description: 'Account accessed from unrecognized device: iPhone 15 Pro',
      timestamp: '1 day ago',
      severity: 'low',
      status: 'resolved',
      location: 'San Francisco, CA'
    },
    {
      id: '4',
      type: 'velocity_check',
      title: 'Rapid Transaction Pattern',
      description: '5 transactions within 10 minutes - unusual for your account',
      timestamp: '2 days ago',
      severity: 'medium',
      status: 'false_positive'
    }
  ]);

  const securityMetrics: SecurityMetric[] = [
    {
      label: 'Fraud Detection',
      value: '99.8%',
      status: 'good',
      icon: Shield
    },
    {
      label: 'Active Alerts',
      value: alerts.filter(a => a.status === 'active').length.toString(),
      status: alerts.filter(a => a.status === 'active').length > 0 ? 'warning' : 'good',
      icon: AlertTriangle
    },
    {
      label: 'Blocked Attempts',
      value: '23',
      status: 'good',
      icon: Ban
    },
    {
      label: 'Response Time',
      value: '< 1s',
      status: 'good',
      icon: Clock
    }
  ];

  const handleAlertAction = (alertId: string, action: 'approve' | 'block' | 'false_positive') => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { 
            ...alert, 
            status: action === 'approve' ? 'resolved' : 
                   action === 'block' ? 'resolved' : 'false_positive'
          }
        : alert
    ));
    
    console.log(`Alert ${alertId} marked as ${action}`);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'suspicious_location': return <MapPin className="w-5 h-5" />;
      case 'unusual_amount': return <CreditCard className="w-5 h-5" />;
      case 'new_device': return <Smartphone className="w-5 h-5" />;
      case 'velocity_check': return <Clock className="w-5 h-5" />;
      case 'merchant_risk': return <Globe className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      case 'low': return 'blue';
      default: return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'red';
      case 'resolved': return 'emerald';
      case 'false_positive': return 'gray';
      default: return 'gray';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Fraud Protection</h1>
          <p className="text-gray-400">AI-powered fraud detection and real-time alerts</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
            <Bell className="w-4 h-4" />
            <span>Alert Settings</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all">
            <Eye className="w-4 h-4" />
            <span>Security Report</span>
          </button>
        </div>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {securityMetrics.map((metric) => {
          const Icon = metric.icon;
          const statusColor = metric.status === 'good' ? 'emerald' : 
                           metric.status === 'warning' ? 'yellow' : 'red';
          
          return (
            <div key={metric.label} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-3 rounded-xl bg-${statusColor}-500/20`}>
                  <Icon className={`w-6 h-6 text-${statusColor}-400`} />
                </div>
                <h3 className="text-lg font-semibold text-white">{metric.label}</h3>
              </div>
              <p className="text-2xl font-bold text-white mb-2">{metric.value}</p>
              <p className={`text-${statusColor}-400 text-sm capitalize`}>{metric.status} status</p>
            </div>
          );
        })}
      </div>

      {/* Active Alerts */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Fraud Alerts</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            <span className="text-red-400 text-sm">
              {alerts.filter(a => a.status === 'active').length} active alerts
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {alerts.map((alert) => {
            const severityColor = getSeverityColor(alert.severity);
            const statusColor = getStatusColor(alert.status);
            
            return (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  alert.status === 'active' 
                    ? `bg-${severityColor}-500/10 border-${severityColor}-500/30` 
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl bg-${severityColor}-500/20`}>
                      {getAlertIcon(alert.type)}
                      <span className={`text-${severityColor}-400`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-white font-semibold">{alert.title}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium border bg-${severityColor}-500/20 text-${severityColor}-300 border-${severityColor}-500/30`}>
                          {alert.severity}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium border bg-${statusColor}-500/20 text-${statusColor}-300 border-${statusColor}-500/30`}>
                          {alert.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-3">{alert.description}</p>
                      
                      {/* Alert Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                        {alert.amount && (
                          <div>
                            <p className="text-gray-400">Amount</p>
                            <p className="text-white font-medium">${alert.amount.toFixed(2)}</p>
                          </div>
                        )}
                        {alert.location && (
                          <div>
                            <p className="text-gray-400">Location</p>
                            <p className="text-white font-medium">{alert.location}</p>
                          </div>
                        )}
                        {alert.merchantName && (
                          <div>
                            <p className="text-gray-400">Merchant</p>
                            <p className="text-white font-medium">{alert.merchantName}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-gray-400">Time</p>
                          <p className="text-white font-medium">{alert.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {alert.status === 'active' && (
                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => handleAlertAction(alert.id, 'approve')}
                        className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded text-xs hover:bg-emerald-500/30 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAlertAction(alert.id, 'block')}
                        className="px-3 py-1 bg-red-500/20 text-red-300 rounded text-xs hover:bg-red-500/30 transition-colors"
                      >
                        Block
                      </button>
                      <button
                        onClick={() => handleAlertAction(alert.id, 'false_positive')}
                        className="px-3 py-1 bg-gray-500/20 text-gray-300 rounded text-xs hover:bg-gray-500/30 transition-colors"
                      >
                        Not Fraud
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fraud Protection Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Protection Settings</h3>
          <div className="space-y-4">
            {[
              { setting: 'Location-based alerts', enabled: true, description: 'Alert for transactions from new locations' },
              { setting: 'Amount threshold alerts', enabled: true, description: 'Alert for transactions over $500' },
              { setting: 'Velocity monitoring', enabled: true, description: 'Alert for rapid transaction patterns' },
              { setting: 'Device fingerprinting', enabled: true, description: 'Track and verify device signatures' },
              { setting: 'Merchant risk scoring', enabled: false, description: 'Evaluate merchant reputation and risk' }
            ].map((setting, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">{setting.setting}</p>
                  <p className="text-gray-400 text-sm">{setting.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={setting.enabled}
                    className="sr-only peer"
                    onChange={() => {}}
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:ring-2 peer-focus:ring-cyan-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Risk Assessment</h3>
          <div className="space-y-4">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-300 font-medium">Account Security: Excellent</span>
              </div>
              <p className="text-emerald-200 text-sm">Your account shows no signs of compromise</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Transaction Risk Score</span>
                <span className="text-emerald-400 font-medium">Low (2.1/10)</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600" style={{ width: '21%' }} />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Device Trust Level</span>
                <span className="text-blue-400 font-medium">High (8.7/10)</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600" style={{ width: '87%' }} />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Behavioral Pattern</span>
                <span className="text-purple-400 font-medium">Normal (9.2/10)</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600" style={{ width: '92%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
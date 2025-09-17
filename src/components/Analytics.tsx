/**
 * Analytics Component - Performance Metrics and Business Insights
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @created 2024-01-20
 */
import React from 'react';
import { TrendingUp, DollarSign, Activity, Users, Calendar, Download } from 'lucide-react';

export const Analytics: React.FC = () => {
  const metrics = [
    { label: 'Total Revenue', value: '$2,847,293', change: '+15.3%', trend: 'up' },
    { label: 'API Calls', value: '45.2M', change: '+23.1%', trend: 'up' },
    { label: 'Active Users', value: '18,429', change: '+8.7%', trend: 'up' },
    { label: 'Conversion Rate', value: '4.2%', change: '-0.3%', trend: 'down' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-gray-400">Monitor performance metrics and business insights</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
            <Calendar className="w-4 h-4" />
            <span>Last 30 days</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all">
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-lg">
                {index === 0 && <DollarSign className="w-6 h-6 text-green-400" />}
                {index === 1 && <Activity className="w-6 h-6 text-cyan-400" />}
                {index === 2 && <Users className="w-6 h-6 text-blue-400" />}
                {index === 3 && <TrendingUp className="w-6 h-6 text-purple-400" />}
              </div>
              <span className={`text-sm font-medium ${
                metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
              }`}>
                {metric.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{metric.value}</h3>
            <p className="text-gray-400 text-sm">{metric.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Revenue Trend</h3>
          <div className="h-64 flex items-end space-x-2">
            {[45, 52, 38, 67, 73, 82, 95, 87, 92, 108, 125, 134].map((height, index) => (
              <div key={index} className="flex-1 bg-gradient-to-t from-cyan-500 to-blue-600 rounded-t" style={{ height: `${height}px` }}>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>Jan</span>
            <span>Dec</span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Top Endpoints</h3>
          <div className="space-y-4">
            {[
              { endpoint: '/v1/payments/create', calls: '2.1M', percentage: 85 },
              { endpoint: '/v1/users/authenticate', calls: '1.8M', percentage: 72 },
              { endpoint: '/v1/transactions/list', calls: '1.2M', percentage: 48 },
              { endpoint: '/v1/webhooks/process', calls: '890K', percentage: 36 },
              { endpoint: '/v1/analytics/query', calls: '456K', percentage: 18 },
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white font-mono text-sm">{item.endpoint}</span>
                  <span className="text-gray-400 text-sm">{item.calls}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Geographic Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-white">Top Countries</h4>
            {[
              { country: 'United States', percentage: 45.2, flag: '🇺🇸' },
              { country: 'United Kingdom', percentage: 18.7, flag: '🇬🇧' },
              { country: 'Germany', percentage: 12.3, flag: '🇩🇪' },
              { country: 'Canada', percentage: 8.9, flag: '🇨🇦' },
              { country: 'Australia', percentage: 6.1, flag: '🇦🇺' },
            ].map((country, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{country.flag}</span>
                  <span className="text-white">{country.country}</span>
                </div>
                <span className="text-cyan-400 font-medium">{country.percentage}%</span>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-medium text-white">Response Times</h4>
            {[
              { region: 'North America', time: '23ms', status: 'excellent' },
              { region: 'Europe', time: '45ms', status: 'good' },
              { region: 'Asia Pacific', time: '67ms', status: 'good' },
              { region: 'South America', time: '123ms', status: 'warning' },
              { region: 'Africa', time: '187ms', status: 'warning' },
            ].map((region, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-white">{region.region}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">{region.time}</span>
                  <div className={`w-2 h-2 rounded-full ${
                    region.status === 'excellent' ? 'bg-green-400' :
                    region.status === 'good' ? 'bg-blue-400' : 'bg-yellow-400'
                  }`} />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-medium text-white">Error Rates</h4>
            {[
              { code: '200 OK', percentage: 96.8, color: 'bg-green-500' },
              { code: '400 Bad Request', percentage: 2.1, color: 'bg-yellow-500' },
              { code: '401 Unauthorized', percentage: 0.8, color: 'bg-orange-500' },
              { code: '500 Internal Error', percentage: 0.2, color: 'bg-red-500' },
              { code: '503 Service Unavailable', percentage: 0.1, color: 'bg-red-600' },
            ].map((status, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white">{status.code}</span>
                  <span className="text-gray-400">{status.percentage}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${status.color}`}
                    style={{ width: `${Math.max(status.percentage * 3, 2)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
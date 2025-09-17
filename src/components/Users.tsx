/**
 * Users Component - User Management and Administration
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @created 2024-01-20
 */
import React, { useState } from 'react';
import { Users as UsersIcon, UserPlus, Search, Filter, MoreHorizontal, Shield, Mail } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'developer' | 'viewer';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  apiCalls: number;
  joinedDate: string;
  avatar?: string;
}

export const Users: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [users] = useState<User[]>([
    {
      id: '1',
      name: 'Alex Morgan',
      email: 'alex@fintech.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2 hours ago',
      apiCalls: 12450,
      joinedDate: '2024-01-15',
      avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@company.com',
      role: 'developer',
      status: 'active',
      lastLogin: '1 day ago',
      apiCalls: 8920,
      joinedDate: '2024-01-12',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    },
    {
      id: '3',
      name: 'Michael Chen',
      email: 'mike@startup.io',
      role: 'developer',
      status: 'inactive',
      lastLogin: '3 days ago',
      apiCalls: 2340,
      joinedDate: '2024-01-08',
    },
    {
      id: '4',
      name: 'Enterprise Corp',
      email: 'admin@enterprise.com',
      role: 'admin',
      status: 'active',
      lastLogin: '5 minutes ago',
      apiCalls: 45200,
      joinedDate: '2024-01-01',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    },
    {
      id: '5',
      name: 'Jessica Williams',
      email: 'jessica@agency.com',
      role: 'viewer',
      status: 'suspended',
      lastLogin: '1 week ago',
      apiCalls: 150,
      joinedDate: '2024-01-05',
    }
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'developer': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'viewer': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'inactive': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'suspended': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-gray-400">Manage user accounts, roles, and permissions</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all">
          <UserPlus className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <UsersIcon className="w-6 h-6 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">Total Users</h3>
          </div>
          <p className="text-2xl font-bold text-white mb-2">{users.length}</p>
          <p className="text-cyan-400 text-sm">All registered users</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <h3 className="text-lg font-semibold text-white">Active Users</h3>
          </div>
          <p className="text-2xl font-bold text-white mb-2">
            {users.filter(u => u.status === 'active').length}
          </p>
          <p className="text-green-400 text-sm">Currently online</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Developers</h3>
          </div>
          <p className="text-2xl font-bold text-white mb-2">
            {users.filter(u => u.role === 'developer').length}
          </p>
          <p className="text-blue-400 text-sm">API developers</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Mail className="w-6 h-6 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Admins</h3>
          </div>
          <p className="text-2xl font-bold text-white mb-2">
            {users.filter(u => u.role === 'admin').length}
          </p>
          <p className="text-purple-400 text-sm">System administrators</p>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">User Directory</h3>
          <div className="flex space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 w-64"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="developer">Developer</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
        </div>

        <div className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">User</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Role</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">API Calls</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Last Login</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
                            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-white">{user.apiCalls.toLocaleString()}</td>
                  <td className="py-3 px-4 text-gray-400">{user.lastLogin}</td>
                  <td className="py-3 px-4">
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">User Registration Trend</h3>
          <div className="h-48 flex items-end space-x-2">
            {[12, 19, 15, 28, 34, 42, 35, 48, 39, 52, 47, 61].map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-cyan-500 to-blue-600 rounded-t"
                  style={{ height: `${height * 2}px` }}
                />
                <span className="text-xs text-gray-400 mt-1">
                  {new Date(2024, index, 1).toLocaleDateString('en', { month: 'short' })}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Role Distribution</h3>
          <div className="space-y-4">
            {[
              { role: 'Developers', count: users.filter(u => u.role === 'developer').length, percentage: (users.filter(u => u.role === 'developer').length / users.length) * 100, color: 'from-blue-500 to-blue-600' },
              { role: 'Admins', count: users.filter(u => u.role === 'admin').length, percentage: (users.filter(u => u.role === 'admin').length / users.length) * 100, color: 'from-red-500 to-red-600' },
              { role: 'Viewers', count: users.filter(u => u.role === 'viewer').length, percentage: (users.filter(u => u.role === 'viewer').length / users.length) * 100, color: 'from-green-500 to-green-600' },
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">{item.role}</span>
                  <div className="text-right">
                    <span className="text-white">{item.count}</span>
                    <span className="text-gray-400 text-sm ml-2">({item.percentage.toFixed(1)}%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
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
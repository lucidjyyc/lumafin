/**
 * P2P Transfers Component - Send Money Instantly to Friends
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @created 2024-01-20
 */
import React, { useState } from 'react';
import { 
  Send, 
  Users, 
  Clock, 
  CheckCircle,
  Search,
  Plus,
  ArrowRight,
  Smartphone,
  Mail,
  Hash,
  AlertCircle
} from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
  phone?: string;
  username?: string;
  lastTransfer?: string;
  isFrequent: boolean;
}

interface Transfer {
  id: string;
  recipient: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  note?: string;
}

export const P2PTransfers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [sendMethod, setSendMethod] = useState<'email' | 'phone' | 'username'>('email');

  const [contacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1234567890',
      username: '@sarahj',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      lastTransfer: '2 days ago',
      isFrequent: true
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike@startup.io',
      phone: '+1987654321',
      username: '@mikec',
      lastTransfer: '1 week ago',
      isFrequent: true
    },
    {
      id: '3',
      name: 'Alex Rivera',
      email: 'alex@company.com',
      username: '@alexr',
      lastTransfer: '3 days ago',
      isFrequent: false
    },
    {
      id: '4',
      name: 'Jessica Williams',
      email: 'jessica@agency.com',
      phone: '+1122334455',
      username: '@jessw',
      isFrequent: false
    }
  ]);

  const [recentTransfers] = useState<Transfer[]>([
    {
      id: '1',
      recipient: 'Sarah Johnson',
      amount: 50.00,
      status: 'completed',
      timestamp: '2 hours ago',
      note: 'Lunch split'
    },
    {
      id: '2',
      recipient: 'Mike Chen',
      amount: 125.00,
      status: 'completed',
      timestamp: '1 day ago',
      note: 'Project payment'
    },
    {
      id: '3',
      recipient: 'Alex Rivera',
      amount: 25.00,
      status: 'pending',
      timestamp: '3 hours ago',
      note: 'Coffee money'
    }
  ]);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMoney = async () => {
    if (!selectedContact || !amount) return;
    
    // Simulate instant transfer
    console.log('Sending money:', {
      to: selectedContact,
      amount: parseFloat(amount),
      note,
      method: sendMethod
    });
    
    // Reset form
    setSelectedContact(null);
    setAmount('');
    setNote('');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-400" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Send Money</h1>
          <p className="text-gray-400">Send money instantly to friends and family</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all">
          <Plus className="w-4 h-4" />
          <span>Add Contact</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Send Money Form */}
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Send Money</h3>
            
            {/* Contact Selection */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Send to</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search contacts or enter email/phone"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
              </div>

              {/* Contact List */}
              {searchTerm && (
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {filteredContacts.map((contact) => (
                    <button
                      key={contact.id}
                      onClick={() => {
                        setSelectedContact(contact);
                        setSearchTerm('');
                      }}
                      className="w-full flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-left"
                    >
                      {contact.avatar ? (
                        <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
                            {contact.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="text-white font-medium">{contact.name}</p>
                        <p className="text-gray-400 text-sm">{contact.email || contact.phone}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Selected Contact */}
              {selectedContact && (
                <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {selectedContact.avatar ? (
                      <img src={selectedContact.avatar} alt={selectedContact.name} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {selectedContact.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-white font-semibold">{selectedContact.name}</p>
                      <p className="text-cyan-300 text-sm">{selectedContact.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Note (optional)</label>
                <input
                  type="text"
                  placeholder="What's this for?"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              {/* Send Button */}
              <button
                onClick={handleSendMoney}
                disabled={!selectedContact || !amount}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
              >
                <Send className="w-5 h-5" />
                <span>Send ${amount || '0.00'} Instantly</span>
              </button>
            </div>
          </div>
        </div>

        {/* Contacts & Recent Transfers */}
        <div className="space-y-6">
          {/* Frequent Contacts */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Frequent Contacts</h3>
            <div className="grid grid-cols-2 gap-3">
              {contacts.filter(c => c.isFrequent).map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className="flex flex-col items-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
                >
                  {contact.avatar ? (
                    <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full object-cover mb-2" />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mb-2">
                      <span className="text-white font-medium">
                        {contact.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                  <span className="text-white text-sm font-medium group-hover:text-cyan-300 transition-colors">
                    {contact.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Transfers */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Recent Transfers</h3>
            <div className="space-y-3">
              {recentTransfers.map((transfer) => (
                <div key={transfer.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full flex items-center justify-center">
                      {getStatusIcon(transfer.status)}
                    </div>
                    <div>
                      <p className="text-white font-medium">{transfer.recipient}</p>
                      <p className="text-gray-400 text-sm">{transfer.note || 'No note'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">${transfer.amount.toFixed(2)}</p>
                    <p className="text-gray-400 text-xs">{transfer.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Send Methods */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Send Methods</h3>
            <div className="space-y-3">
              <button
                onClick={() => setSendMethod('email')}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  sendMethod === 'email' 
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                <Mail className="w-5 h-5" />
                <div className="text-left">
                  <p className="font-medium">Email Address</p>
                  <p className="text-xs opacity-75">Send to any email address</p>
                </div>
              </button>
              
              <button
                onClick={() => setSendMethod('phone')}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  sendMethod === 'phone' 
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                <Smartphone className="w-5 h-5" />
                <div className="text-left">
                  <p className="font-medium">Phone Number</p>
                  <p className="text-xs opacity-75">Send via SMS link</p>
                </div>
              </button>
              
              <button
                onClick={() => setSendMethod('username')}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  sendMethod === 'username' 
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                <Hash className="w-5 h-5" />
                <div className="text-left">
                  <p className="font-medium">Username</p>
                  <p className="text-xs opacity-75">Send to @username</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Send Amounts */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Send</h3>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {[5, 10, 20, 25, 50, 100, 200, 500].map((quickAmount) => (
            <button
              key={quickAmount}
              onClick={() => setAmount(quickAmount.toString())}
              className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-center group"
            >
              <p className="text-white font-semibold group-hover:text-cyan-300 transition-colors">
                ${quickAmount}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
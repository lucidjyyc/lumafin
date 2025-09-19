/**
 * AI Financial Advisor Component - Intelligent Financial Guidance
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @created 2024-01-20
 */
import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  TrendingUp, 
  DollarSign, 
  Target, 
  Lightbulb,
  MessageCircle,
  Zap,
  Shield,
  PieChart
} from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  suggestions?: string[];
}

interface FinancialInsight {
  type: 'spending' | 'saving' | 'investment' | 'security';
  title: string;
  description: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
  icon: React.ComponentType<any>;
}

export const AIFinancialAdvisor: React.FC = () => {
  const { data: accounts } = useAccounts();
  const { data: analytics } = useTransactionAnalytics();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI Financial Advisor. I can help you with budgeting, saving strategies, investment advice, and virtual card security. What would you like to discuss today?",
      timestamp: new Date().toLocaleTimeString(),
      suggestions: [
        "Help me create a budget",
        "Explain virtual card benefits",
        "Investment advice for beginners",
        "How to improve my credit score"
      ]
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiStatus, setApiStatus] = useState<'connected' | 'connecting' | 'error'>('connected');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const financialInsights: FinancialInsight[] = [
    {
      type: 'spending',
      title: 'Optimize Dining Budget',
      description: 'You\'ve spent 23% more on dining this month. Consider meal planning to save $150.',
      action: 'Create meal budget',
      priority: 'medium',
      icon: TrendingUp
    },
    {
      type: 'security',
      title: 'Use Virtual Cards',
      description: 'Protect your online purchases with virtual card numbers for better security.',
      action: 'Create virtual card',
      priority: 'high',
      icon: Shield
    },
    {
      type: 'saving',
      title: 'Emergency Fund Goal',
      description: 'You\'re 67% towards your $10,000 emergency fund goal. Great progress!',
      action: 'Increase savings',
      priority: 'low',
      icon: Target
    },
    {
      type: 'investment',
      title: 'Investment Opportunity',
      description: 'Consider diversifying with index funds based on your risk profile.',
      action: 'Learn more',
      priority: 'medium',
      icon: PieChart
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Get real user data for personalized responses
    const totalBalance = accounts?.reduce((sum, acc) => 
      sum + parseFloat(acc.available_balance || '0'), 0
    ) || 0;
    
    const accountCount = accounts?.length || 0;
    const monthlyTransactions = analytics?.total_transactions || 0;
    
    // Virtual card responses
    if (lowerMessage.includes('virtual card') || lowerMessage.includes('online security')) {
      return "Virtual cards are excellent for online security! Here's why I recommend them:\n\n• **Data Breach Protection**: If a merchant gets hacked, only your virtual card number is compromised, not your real card\n• **Spending Control**: Set custom limits to prevent overcharges\n• **Subscription Management**: Create cards that auto-expire to avoid unwanted renewals\n• **Privacy**: Keep your real card details private from merchants\n\nWould you like me to walk you through creating your first virtual card?";
    }
    
    // Budget responses
    if (lowerMessage.includes('budget') || lowerMessage.includes('spending')) {
      return `I'd love to help you create a budget! Based on your account data, here's what I see:\n\n• **Total Balance**: $${totalBalance.toLocaleString()}\n• **Active Accounts**: ${accountCount}\n• **Monthly Transactions**: ${monthlyTransactions}\n• **Account Types**: ${accounts?.map(acc => acc.account_type).join(', ') || 'None'}\n\n**My Recommendation**: With your current balance, consider:\n• Emergency fund: 3-6 months expenses\n• High-yield savings for better returns\n• Virtual cards for secure online spending\n• Investment accounts for long-term growth\n\nWould you like me to help you optimize your account structure?`;
    }
    
    // Investment responses
    if (lowerMessage.includes('invest') || lowerMessage.includes('portfolio')) {
      return "Great question about investing! Based on your profile, here's my advice:\n\n**Your Situation**: Stable income, good emergency fund progress\n**Risk Tolerance**: Appears moderate based on spending patterns\n\n**Beginner Strategy**:\n• Start with low-cost index funds (VTI, VTIAX)\n• Consider target-date funds for simplicity\n• Begin with $200-500/month\n• Use tax-advantaged accounts (401k, IRA) first\n\n**Next Steps**:\n1. Max out any employer 401k match\n2. Build 3-6 month emergency fund\n3. Then invest in diversified portfolio\n\nWould you like specific fund recommendations based on your age and goals?";
    }
    
    // Savings responses
    if (lowerMessage.includes('save') || lowerMessage.includes('emergency fund')) {
      const savingsAccounts = accounts?.filter(acc => acc.account_type === 'savings') || [];
      const savingsBalance = savingsAccounts.reduce((sum, acc) => sum + parseFloat(acc.available_balance || '0'), 0);
      
      return `Excellent focus on saving! Here's your current situation:\n\n**Savings Accounts**: ${savingsAccounts.length}\n**Total Savings**: $${savingsBalance.toLocaleString()}\n**Total Assets**: $${totalBalance.toLocaleString()}\n**Savings Rate**: ${((savingsBalance / totalBalance) * 100).toFixed(1)}%\n\n**Recommendations**:\n• Target emergency fund: $${(totalBalance * 0.25).toLocaleString()} (3 months expenses)\n• Use virtual cards with spending limits to control impulse purchases\n• Consider high-yield savings accounts for better returns\n• Automate transfers to build consistent saving habits\n\nWould you like me to help you set up automatic savings transfers?`;
    }
    
    // Default helpful response
    return "I'm here to help with all your financial questions! I can assist with:\n\n• **Budgeting**: Create personalized spending plans\n• **Virtual Cards**: Secure online shopping strategies\n• **Saving Goals**: Emergency funds, major purchases\n• **Investment Basics**: Getting started with investing\n• **Spending Analysis**: Understanding your money habits\n• **Security Tips**: Protecting your financial accounts\n\nWhat specific area would you like to explore? I can provide personalized advice based on your actual account data.";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(inputMessage),
        timestamp: new Date().toLocaleTimeString(),
        suggestions: [
          "Tell me more about this",
          "What are the next steps?",
          "Show me examples",
          "How do I get started?"
        ]
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500/30 bg-red-500/10';
      case 'medium': return 'border-yellow-500/30 bg-yellow-500/10';
      case 'low': return 'border-emerald-500/30 bg-emerald-500/10';
      default: return 'border-gray-500/30 bg-gray-500/10';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">AI Financial Advisor</h1>
          <p className="text-gray-400">Get personalized financial guidance and smart recommendations</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
            apiStatus === 'connected' ? 'bg-emerald-500/20 text-emerald-300' :
            apiStatus === 'connecting' ? 'bg-yellow-500/20 text-yellow-300' :
            'bg-red-500/20 text-red-300'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              apiStatus === 'connected' ? 'bg-emerald-400 animate-pulse' :
              apiStatus === 'connecting' ? 'bg-yellow-400 animate-pulse' :
              'bg-red-400'
            }`} />
            <span className="text-sm font-medium capitalize">{apiStatus}</span>
          </div>
          <span className="text-gray-400 text-sm">API: vcard_demo_12345abcdef67890</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl flex flex-col h-[600px]">
          {/* Chat Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-lg">
                <Bot className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">AI Financial Advisor</h3>
                <p className="text-gray-400 text-sm">Powered by advanced financial intelligence</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                    : 'bg-white/10 text-gray-100'
                } rounded-lg p-4`}>
                  <div className="flex items-start space-x-3">
                    {message.type === 'ai' && (
                      <div className="p-1 bg-cyan-500/20 rounded">
                        <Bot className="w-4 h-4 text-cyan-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="whitespace-pre-line">{message.content}</p>
                      <p className="text-xs opacity-75 mt-2">{message.timestamp}</p>
                      
                      {message.suggestions && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-xs transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-1 bg-cyan-500/20 rounded">
                      <Bot className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/10">
            <div className="flex space-x-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about budgeting, virtual cards, investments..."
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Insights Sidebar */}
        <div className="space-y-6">
          {/* AI Status */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Zap className="w-6 h-6 text-cyan-400" />
              <h3 className="text-lg font-semibold text-white">AI Status</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Connection</span>
                <span className="text-emerald-400 text-sm">Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Response Time</span>
                <span className="text-cyan-400 text-sm">1.2s avg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">API Key</span>
                <span className="text-gray-400 text-sm font-mono">vcard_demo_***</span>
              </div>
            </div>
          </div>

          {/* Financial Insights */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Smart Insights</h3>
            <div className="space-y-4">
              {financialInsights.map((insight, index) => {
                const Icon = insight.icon;
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${getPriorityColor(insight.priority)}`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${
                        insight.priority === 'high' ? 'bg-red-500/20' :
                        insight.priority === 'medium' ? 'bg-yellow-500/20' :
                        'bg-emerald-500/20'
                      }`}>
                        <Icon className={`w-4 h-4 ${
                          insight.priority === 'high' ? 'text-red-400' :
                          insight.priority === 'medium' ? 'text-yellow-400' :
                          'text-emerald-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium mb-1">{insight.title}</h4>
                        <p className="text-gray-300 text-sm mb-3">{insight.description}</p>
                        <button
                          onClick={() => handleSuggestionClick(insight.action)}
                          className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
                        >
                          {insight.action} →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {[
                { label: 'Create Budget Plan', icon: Target },
                { label: 'Virtual Card Guide', icon: Shield },
                { label: 'Investment Basics', icon: TrendingUp },
                { label: 'Savings Calculator', icon: DollarSign }
              ].map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(action.label)}
                    className="w-full flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-left"
                  >
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <span className="text-white">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Financial Health Score */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Financial Health Score</h3>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-emerald-400 rounded-full" />
            <span className="text-emerald-400 font-semibold">
              {totalBalance > 10000 ? 'Excellent' : totalBalance > 5000 ? 'Good' : 'Fair'} 
              ({accountCount > 2 ? '8.5' : accountCount > 1 ? '7.2' : '6.1'}/10)
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { 
              category: 'Account Diversity', 
              score: Math.min(accountCount * 2.5, 10), 
              color: 'emerald' 
            },
            { 
              category: 'Balance Health', 
              score: Math.min((totalBalance / 1000) * 0.5, 10), 
              color: 'blue' 
            },
            { 
              category: 'Transaction Activity', 
              score: Math.min((monthlyTransactions / 10) * 2, 10), 
              color: 'purple' 
            },
            { 
              category: 'Security Score', 
              score: accounts?.some(acc => acc.account_type === 'crypto') ? 8.5 : 7.2, 
              color: 'orange' 
            }
          ].map((metric, index) => (
            <div key={index} className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-3">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={`rgb(var(--color-${metric.color}-400))`}
                    strokeWidth="2"
                    strokeDasharray={`${metric.score * 10}, 100`}
                    className={`text-${metric.color}-400`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{metric.score}</span>
                </div>
              </div>
              <p className="text-gray-300 text-sm font-medium">{metric.category}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
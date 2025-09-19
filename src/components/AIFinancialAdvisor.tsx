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
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  TrendingUp, 
  DollarSign,
  Target,
  Shield,
  Lightbulb,
  CreditCard,
  PiggyBank,
  AlertCircle
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  suggestions?: string[];
}

interface FinancialInsight {
  type: 'spending' | 'saving' | 'investment' | 'security' | 'goal';
  title: string;
  description: string;
  action?: string;
  priority: 'high' | 'medium' | 'low';
  icon: React.ComponentType<any>;
}

export const AIFinancialAdvisor: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI Financial Advisor. I can help you with budgeting, saving strategies, virtual card security, and personalized financial advice. What would you like to discuss today?",
      timestamp: new Date().toLocaleTimeString(),
      suggestions: [
        "Help me create a budget",
        "Explain virtual card benefits",
        "Review my spending patterns",
        "Investment advice for beginners"
      ]
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Demo API configuration
  const API_CONFIG = {
    API_KEY: "vcard_demo_12345abcdef67890",
    BASE_URL: "https://api.virtualcards.demo/v1/",
    AI_ENDPOINT: "https://api.aifinance.demo/v1/chat"
  };

  const financialInsights: FinancialInsight[] = [
    {
      type: 'spending',
      title: 'Optimize Your Subscriptions',
      description: 'You have 8 active subscriptions totaling $127/month. Consider reviewing Netflix, Spotify, and Adobe subscriptions.',
      action: 'Review Subscriptions',
      priority: 'medium',
      icon: CreditCard
    },
    {
      type: 'saving',
      title: 'Emergency Fund Goal',
      description: 'You\'re 67% towards your $10,000 emergency fund goal. Consider increasing your monthly savings by $200.',
      action: 'Adjust Savings Plan',
      priority: 'high',
      icon: PiggyBank
    },
    {
      type: 'security',
      title: 'Virtual Card Opportunity',
      description: 'Use virtual cards for your online subscriptions to enhance security and prevent unwanted charges.',
      action: 'Create Virtual Card',
      priority: 'medium',
      icon: Shield
    },
    {
      type: 'investment',
      title: 'Investment Diversification',
      description: 'Your portfolio is 80% tech stocks. Consider diversifying with bonds or international funds.',
      action: 'Explore Options',
      priority: 'low',
      icon: TrendingUp
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI processing with demo responses
    const responses: Record<string, string> = {
      'budget': "I'd be happy to help you create a budget! Based on your transaction history, I see you spend about $2,847 monthly. Here's what I recommend:\n\n• **Housing**: 30% ($854) - You're currently at 28%, which is great!\n• **Food**: 15% ($427) - Consider meal planning to optimize this\n• **Transportation**: 10% ($285) - Right on target\n• **Savings**: 20% ($569) - Try to increase this to $600\n• **Entertainment**: 10% ($285) - You're slightly over at 12%\n\nWould you like me to set up automatic budget alerts for these categories?",
      
      'virtual card': "Virtual cards are fantastic for online security! Here's why I recommend them:\n\n**Security Benefits:**\n• Your real card details stay protected\n• Each virtual card can have spending limits\n• Instant cancellation if compromised\n• Perfect for subscriptions and trials\n\n**Best Practices:**\n• Use single-use cards for one-time purchases\n• Create merchant-locked cards for regular shopping\n• Set low limits for subscription services\n• Use them for any unfamiliar websites\n\nWould you like me to help you create a virtual card for a specific purpose?",
      
      'spending': "I've analyzed your spending patterns and found some interesting insights:\n\n**This Month:**\n• Food & Dining: $456 (32% of budget) - Slightly high\n• Transportation: $289 (20%) - Normal range\n• Shopping: $634 (45%) - **Alert**: 27% over budget!\n• Entertainment: $157 (11%) - Good control\n\n**Recommendations:**\n• Consider using virtual cards for online shopping to set strict limits\n• Your dining spending increased 40% - maybe try meal prep?\n• Great job staying within entertainment budget!\n\nShall I create spending alerts to help you stay on track?",
      
      'investment': "Great question about investing! Based on your profile, here's my advice:\n\n**For Beginners:**\n• Start with index funds (low risk, diversified)\n• Consider dollar-cost averaging ($200-500/month)\n• Emergency fund first (3-6 months expenses)\n• Use tax-advantaged accounts (401k, IRA)\n\n**Your Situation:**\n• You have $6,700 in savings - perfect for starting!\n• Your spending is stable, good foundation\n• Consider starting with $300/month investment\n\n**Next Steps:**\n1. Build emergency fund to $10,000\n2. Open investment account\n3. Start with broad market index fund\n\nWould you like help setting up an investment goal?"
    };

    // Simple keyword matching for demo
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('budget') || lowerMessage.includes('budgeting')) {
      return responses.budget;
    } else if (lowerMessage.includes('virtual card') || lowerMessage.includes('card security')) {
      return responses['virtual card'];
    } else if (lowerMessage.includes('spending') || lowerMessage.includes('expense')) {
      return responses.spending;
    } else if (lowerMessage.includes('invest') || lowerMessage.includes('investment')) {
      return responses.investment;
    } else {
      return "I understand you're asking about financial planning. I can help with:\n\n• **Budgeting** - Create and manage spending plans\n• **Virtual Cards** - Secure online shopping strategies\n• **Spending Analysis** - Review your transaction patterns\n• **Investment Guidance** - Basic investment strategies\n• **Savings Goals** - Plan for major purchases\n• **Security Tips** - Protect your financial accounts\n\nWhat specific area would you like to explore?";
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(async () => {
      const aiResponse = await generateAIResponse(inputMessage);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date().toLocaleTimeString(),
        suggestions: [
          "Tell me more",
          "Set up alerts",
          "Create a plan",
          "Show me examples"
        ]
      };

      setMessages(prev => [...prev, aiMessage]);
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
      case 'low': return 'border-blue-500/30 bg-blue-500/10';
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
        <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
          <Bot className="w-5 h-5 text-emerald-400" />
          <span className="text-emerald-300 font-medium">AI Assistant Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl flex flex-col h-[600px]">
          {/* Chat Header */}
          <div className="p-4 border-b border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Financial Advisor AI</h3>
                <p className="text-gray-400 text-sm">Powered by advanced financial intelligence</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
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
                      <Bot className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="whitespace-pre-line">{message.content}</p>
                      <p className="text-xs opacity-70 mt-2">{message.timestamp}</p>
                      
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
                <div className="bg-white/10 rounded-lg p-4 max-w-[80%]">
                  <div className="flex items-center space-x-3">
                    <Bot className="w-5 h-5 text-cyan-400" />
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

          {/* Message Input */}
          <div className="p-4 border-t border-white/20">
            <div className="flex space-x-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about budgeting, virtual cards, or financial planning..."
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Financial Insights Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Financial Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => handleSuggestionClick("Help me create a monthly budget")}
                className="w-full flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-left"
              >
                <Target className="w-5 h-5 text-blue-400" />
                <span className="text-white">Create Budget</span>
              </button>
              
              <button
                onClick={() => handleSuggestionClick("Explain virtual card security benefits")}
                className="w-full flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-left"
              >
                <Shield className="w-5 h-5 text-emerald-400" />
                <span className="text-white">Virtual Card Guide</span>
              </button>
              
              <button
                onClick={() => handleSuggestionClick("Analyze my spending patterns")}
                className="w-full flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-left"
              >
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <span className="text-white">Spending Analysis</span>
              </button>
              
              <button
                onClick={() => handleSuggestionClick("Help me save for a house down payment")}
                className="w-full flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-left"
              >
                <PiggyBank className="w-5 h-5 text-orange-400" />
                <span className="text-white">Savings Goals</span>
              </button>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">AI Insights</h3>
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
                        'bg-blue-500/20'
                      }`}>
                        <Icon className={`w-4 h-4 ${
                          insight.priority === 'high' ? 'text-red-400' :
                          insight.priority === 'medium' ? 'text-yellow-400' :
                          'text-blue-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-sm mb-1">{insight.title}</h4>
                        <p className="text-gray-300 text-xs mb-2">{insight.description}</p>
                        {insight.action && (
                          <button
                            onClick={() => handleSuggestionClick(`Help me with: ${insight.title}`)}
                            className="text-cyan-400 hover:text-cyan-300 text-xs font-medium transition-colors"
                          >
                            {insight.action} →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* API Integration Status */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">AI Service Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Financial AI Engine</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-emerald-400 text-sm">Online</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Virtual Card API</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-emerald-400 text-sm">Connected</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Response Time</span>
                <span className="text-gray-400 text-sm">~1.2s</span>
              </div>
              
              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-blue-300 text-xs">
                  <strong>Demo Mode:</strong> Using API key {API_CONFIG.API_KEY.substring(0, 15)}...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
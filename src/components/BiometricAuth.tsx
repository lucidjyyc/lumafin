/**
 * Biometric Authentication Component - Face ID & Fingerprint Login
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @created 2024-01-20
 */
import React, { useState, useEffect } from 'react';
import { 
  Fingerprint, 
  Eye, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Smartphone,
  Lock,
  Unlock,
  Settings
} from 'lucide-react';

interface BiometricCapability {
  type: 'fingerprint' | 'face' | 'voice';
  available: boolean;
  enrolled: boolean;
  lastUsed?: string;
}

export const BiometricAuth: React.FC = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authResult, setAuthResult] = useState<'success' | 'failed' | null>(null);
  const [biometricSupport, setBiometricSupport] = useState<BiometricCapability[]>([
    { type: 'fingerprint', available: true, enrolled: true, lastUsed: '2 hours ago' },
    { type: 'face', available: true, enrolled: false },
    { type: 'voice', available: false, enrolled: false }
  ]);

  // Check for Web Authentication API support
  useEffect(() => {
    const checkBiometricSupport = async () => {
      if (window.PublicKeyCredential) {
        try {
          const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          console.log('Biometric authentication available:', available);
        } catch (error) {
          console.log('Biometric check failed:', error);
        }
      }
    };

    checkBiometricSupport();
  }, []);

  const handleBiometricAuth = async (type: string) => {
    setIsAuthenticating(true);
    setAuthResult(null);

    try {
      // Simulate biometric authentication
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success/failure (90% success rate)
      const success = Math.random() > 0.1;
      
      if (success) {
        setAuthResult('success');
        console.log(`${type} authentication successful`);
      } else {
        setAuthResult('failed');
        console.log(`${type} authentication failed`);
      }
    } catch (error) {
      setAuthResult('failed');
      console.error('Biometric authentication error:', error);
    } finally {
      setIsAuthenticating(false);
      setTimeout(() => setAuthResult(null), 3000);
    }
  };

  const handleEnrollBiometric = async (type: string) => {
    console.log(`Enrolling ${type} biometric`);
    
    // Simulate enrollment process
    setBiometricSupport(prev => prev.map(bio => 
      bio.type === type 
        ? { ...bio, enrolled: true, lastUsed: 'Just enrolled' }
        : bio
    ));
  };

  const getBiometricIcon = (type: string) => {
    switch (type) {
      case 'fingerprint': return <Fingerprint className="w-8 h-8" />;
      case 'face': return <Eye className="w-8 h-8" />;
      case 'voice': return <Smartphone className="w-8 h-8" />;
      default: return <Shield className="w-8 h-8" />;
    }
  };

  const getBiometricColor = (type: string) => {
    switch (type) {
      case 'fingerprint': return 'emerald';
      case 'face': return 'blue';
      case 'voice': return 'purple';
      default: return 'gray';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Biometric Security</h1>
          <p className="text-gray-400">Secure, passwordless authentication for the modern age</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
          <Settings className="w-4 h-4" />
          <span>Security Settings</span>
        </button>
      </div>

      {/* Authentication Status */}
      {authResult && (
        <div className={`p-4 rounded-lg border ${
          authResult === 'success' 
            ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' 
            : 'bg-red-500/20 border-red-500/30 text-red-300'
        }`}>
          <div className="flex items-center space-x-3">
            {authResult === 'success' ? (
              <CheckCircle className="w-6 h-6" />
            ) : (
              <AlertCircle className="w-6 h-6" />
            )}
            <div>
              <p className="font-semibold">
                {authResult === 'success' ? 'Authentication Successful' : 'Authentication Failed'}
              </p>
              <p className="text-sm opacity-90">
                {authResult === 'success' 
                  ? 'You have been securely authenticated' 
                  : 'Please try again or use an alternative method'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Biometric Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {biometricSupport.map((biometric) => {
          const color = getBiometricColor(biometric.type);
          const isAvailable = biometric.available && biometric.enrolled;
          
          return (
            <div
              key={biometric.type}
              className={`bg-white/10 backdrop-blur-xl border rounded-xl p-6 transition-all duration-200 ${
                isAvailable 
                  ? 'border-white/20 hover:border-cyan-500/30 cursor-pointer' 
                  : 'border-gray-600/20 opacity-60'
              }`}
            >
              <div className="text-center space-y-4">
                <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center ${
                  isAvailable 
                    ? `bg-${color}-500/20 text-${color}-400` 
                    : 'bg-gray-500/20 text-gray-500'
                }`}>
                  {getBiometricIcon(biometric.type)}
                </div>
                
                <div>
                  <h3 className="text-white font-semibold capitalize mb-1">
                    {biometric.type} {biometric.type === 'face' ? 'ID' : ''}
                  </h3>
                  <p className={`text-sm ${
                    isAvailable ? 'text-emerald-400' : 
                    biometric.available ? 'text-yellow-400' : 'text-gray-500'
                  }`}>
                    {!biometric.available ? 'Not Available' :
                     !biometric.enrolled ? 'Not Enrolled' :
                     'Ready'}
                  </p>
                  {biometric.lastUsed && (
                    <p className="text-gray-400 text-xs mt-1">Last used: {biometric.lastUsed}</p>
                  )}
                </div>

                {biometric.available && (
                  <div className="space-y-2">
                    {biometric.enrolled ? (
                      <button
                        onClick={() => handleBiometricAuth(biometric.type)}
                        disabled={isAuthenticating}
                        className={`w-full py-2 px-4 bg-gradient-to-r from-${color}-500 to-${color}-600 text-white rounded-lg hover:from-${color}-600 hover:to-${color}-700 disabled:opacity-50 transition-all font-medium`}
                      >
                        {isAuthenticating ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                            <span>Authenticating...</span>
                          </div>
                        ) : (
                          'Authenticate'
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEnrollBiometric(biometric.type)}
                        className="w-full py-2 px-4 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-medium"
                      >
                        Set Up
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Security Features */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Security Features</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <Lock className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-white font-medium">Biometric Login</p>
                  <p className="text-gray-400 text-sm">Replace passwords with biometrics</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                <span className="text-emerald-400 text-sm">Active</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-white font-medium">Device Trust</p>
                  <p className="text-gray-400 text-sm">Remember trusted devices</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <span className="text-blue-400 text-sm">Enabled</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-white font-medium">Fallback Authentication</p>
                  <p className="text-gray-400 text-sm">Backup methods available</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                <span className="text-yellow-400 text-sm">Configured</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-semibold">Authentication History</h4>
            <div className="space-y-3">
              {[
                { method: 'Fingerprint', time: '2 hours ago', device: 'iPhone 15 Pro', success: true },
                { method: 'Face ID', time: '1 day ago', device: 'MacBook Pro', success: true },
                { method: 'Fingerprint', time: '2 days ago', device: 'iPhone 15 Pro', success: false },
                { method: 'Face ID', time: '3 days ago', device: 'iPad Pro', success: true }
              ].map((auth, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      auth.success ? 'bg-emerald-500/20' : 'bg-red-500/20'
                    }`}>
                      {auth.success ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{auth.method}</p>
                      <p className="text-gray-400 text-xs">{auth.device}</p>
                    </div>
                  </div>
                  <span className="text-gray-400 text-xs">{auth.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
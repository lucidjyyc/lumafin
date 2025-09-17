/**
 * Footer Component with Comprehensive Internal Linking
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @version 1.0.0
 * @created 2025-07-20
 */

import React from 'react';
import { Shield, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { FooterLink, InternalLink } from './InternalLink';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Banking Services',
      links: [
        { label: 'Personal Banking', href: '/accounts', description: 'Individual banking solutions' },
        { label: 'Business Banking', href: '/business', description: 'Corporate banking services' },
        { label: 'Investment Accounts', href: '/investments', description: 'Grow your wealth' },
        { label: 'Digital Cards', href: '/cards', description: 'Virtual and physical cards' },
        { label: 'Loan Services', href: '/loans', description: 'Personal and business loans' }
      ]
    },
    {
      title: 'Web3 & Crypto',
      links: [
        { label: 'Wallet Integration', href: '/wallet', description: 'Connect your crypto wallets' },
        { label: 'DeFi Protocols', href: '/defi', description: 'Decentralized finance access' },
        { label: 'Token Trading', href: '/trading', description: 'Cryptocurrency trading' },
        { label: 'NFT Marketplace', href: '/nfts', description: 'Buy and sell NFTs' },
        { label: 'Staking Rewards', href: '/staking', description: 'Earn rewards on your crypto' }
      ]
    },
    {
      title: 'Platform',
      links: [
        { label: 'API Documentation', href: '/docs', description: 'Developer resources' },
        { label: 'Security Center', href: '/security', description: 'Account security features' },
        { label: 'Analytics Dashboard', href: '/analytics', description: 'Financial insights' },
        { label: 'Mobile App', href: '/mobile', description: 'Download our mobile app' },
        { label: 'System Status', href: '/status', description: 'Platform status and uptime' }
      ]
    },
    {
      title: 'Support & Legal',
      links: [
        { label: 'Help Center', href: '/help', description: 'Get help and support' },
        { label: 'Contact Support', href: '/support', description: 'Reach our support team' },
        { label: 'Privacy Policy', href: '/privacy', description: 'How we protect your data' },
        { label: 'Terms of Service', href: '/terms', description: 'Platform terms and conditions' },
        { label: 'Compliance', href: '/compliance', description: 'Regulatory compliance' }
      ]
    }
  ];

  const socialLinks = [
    { label: 'Twitter', href: 'https://twitter.com/fintechbank', icon: '𝕏' },
    { label: 'LinkedIn', href: 'https://linkedin.com/company/fintechbank', icon: 'in' },
    { label: 'GitHub', href: 'https://github.com/fintechbank', icon: 'gh' },
    { label: 'Discord', href: 'https://discord.gg/fintechbank', icon: '💬' }
  ];

  return (
    <footer className="bg-black/40 backdrop-blur-xl border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <FooterLink
                      href={link.href}
                      className="text-gray-400 hover:text-cyan-300 transition-colors block"
                      title={link.description}
                    >
                      {link.label}
                    </FooterLink>
                    {link.description && (
                      <p className="text-gray-500 text-xs mt-1">{link.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Company information and quick links */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">FinTech Bank</h3>
            </div>
            <p className="text-gray-400 mb-4 leading-relaxed">
              The future of banking. Seamlessly blend traditional finance with Web3 technology 
              for a complete digital banking experience.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-all"
                  aria-label={`Follow us on ${social.label}`}
                >
                  <span className="text-sm font-bold">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Access</h3>
            <div className="grid grid-cols-2 gap-2">
              <InternalLink
                href="/dashboard"
                className="flex items-center space-x-2 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                priority="high"
                context="footer-quick-access"
              >
                <span className="text-sm text-gray-300 hover:text-white">Dashboard</span>
              </InternalLink>
              <InternalLink
                href="/payments"
                className="flex items-center space-x-2 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                priority="high"
                context="footer-quick-access"
              >
                <span className="text-sm text-gray-300 hover:text-white">Payments</span>
              </InternalLink>
              <InternalLink
                href="/wallet"
                className="flex items-center space-x-2 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                priority="high"
                context="footer-quick-access"
              >
                <span className="text-sm text-gray-300 hover:text-white">Wallet</span>
              </InternalLink>
              <InternalLink
                href="/security"
                className="flex items-center space-x-2 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                priority="high"
                context="footer-quick-access"
              >
                <span className="text-sm text-gray-300 hover:text-white">Security</span>
              </InternalLink>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a 
                  href="mailto:support@fintechbank.com"
                  className="hover:text-cyan-300 transition-colors"
                >
                  support@fintechbank.com
                </a>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a 
                  href="tel:+1-800-FINTECH"
                  className="hover:text-cyan-300 transition-colors"
                >
                  +1 (800) FINTECH
                </a>
              </div>
              <div className="flex items-start space-x-3 text-gray-400">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <address className="not-italic">
                  123 Financial District<br />
                  New York, NY 10004<br />
                  United States
                </address>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex flex-wrap items-center space-x-6 text-sm text-gray-400">
            <p>&copy; {currentYear} NOIR9 FOUNDATION INC. All rights reserved.</p>
            <FooterLink href="/privacy" className="hover:text-cyan-300">
              Privacy Policy
            </FooterLink>
            <FooterLink href="/terms" className="hover:text-cyan-300">
              Terms of Service
            </FooterLink>
            <FooterLink href="/cookies" className="hover:text-cyan-300">
              Cookie Policy
            </FooterLink>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>Developed by Adam J Smith</span>
            <div className="w-px h-4 bg-gray-600" />
            <FooterLink 
              href="/docs" 
              className="flex items-center space-x-1 hover:text-cyan-300"
            >
              <span>API Docs</span>
              <ExternalLink className="w-3 h-3" />
            </FooterLink>
          </div>
        </div>

        {/* SEO-optimized sitemap links */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <details className="group">
            <summary className="text-gray-400 cursor-pointer hover:text-white transition-colors">
              <span className="text-sm">Sitemap & All Pages</span>
            </summary>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 text-xs">
              {footerSections.flatMap(section => section.links).map((link) => (
                <FooterLink
                  key={link.href}
                  href={link.href}
                  className="text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {link.label}
                </FooterLink>
              ))}
            </div>
          </details>
        </div>
      </div>
    </footer>
  );
};
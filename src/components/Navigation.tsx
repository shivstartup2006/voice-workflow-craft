import React from 'react';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';

export const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', label: '🏠 Home', emoji: '🏠' },
    { path: '/create', label: '✨ Create', emoji: '✨' },
    { path: '/explore', label: '🌍 Explore', emoji: '🌍' },
    { path: '/workflows', label: '⚡ My Workflows', emoji: '⚡' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">VeloKinetiq</h1>
              <p className="text-xs text-muted-foreground">Voice Automation</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? 'gradient' : 'ghost'}
                size="sm"
                onClick={() => navigate(item.path)}
                className="gap-2"
              >
                <span>{item.emoji}</span>
                {item.label.split(' ')[1]}
              </Button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              ☰
            </Button>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="outline" size="sm">
              👤 Sign In
            </Button>
            <Button variant="gradient" size="sm">
              🚀 Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
import React from 'react';
import { Button } from '@/components/ui/button';

export const Footer: React.FC = () => {
  return (
    <footer className="glass-card border-t border-white/10 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <div>
                <h3 className="text-xl font-bold gradient-text">VeloKinetiq</h3>
                <p className="text-xs text-muted-foreground">Voice Automation</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Transform your ideas into automated workflows with just your voice. 
              The future of automation is here.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="font-semibold">🚀 Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/create" className="hover:text-primary transition-colors">Voice Builder</a></li>
              <li><a href="/explore" className="hover:text-primary transition-colors">Template Library</a></li>
              <li><a href="/workflows" className="hover:text-primary transition-colors">My Workflows</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">API Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Integrations</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-semibold">📚 Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Getting Started</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Video Tutorials</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Best Practices</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Community Forum</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-semibold">🏢 Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 mt-8 border-t border-white/10">
          <p className="text-sm text-muted-foreground">
            © 2024 VeloKinetiq. All rights reserved. Built with ❤️ for automation enthusiasts.
          </p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Button variant="ghost" size="sm">
              🐦 Twitter
            </Button>
            <Button variant="ghost" size="sm">
              💼 LinkedIn
            </Button>
            <Button variant="ghost" size="sm">
              🐙 GitHub
            </Button>
            <Button variant="ghost" size="sm">
              💬 Discord
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};
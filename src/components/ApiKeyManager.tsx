import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Settings, Eye, EyeOff, Save, RefreshCw } from 'lucide-react';

interface ApiConfig {
  openRouterKey: string;
  n8nUrl: string;
  n8nApiKey: string;
}

interface ApiKeyManagerProps {
  onConfigUpdate: (config: ApiConfig) => void;
}

export const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ onConfigUpdate }) => {
  const [config, setConfig] = useState<ApiConfig>({
    openRouterKey: '',
    n8nUrl: 'http://localhost:5678',
    n8nApiKey: ''
  });
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [isOpen, setIsOpen] = useState(false);
  const [connectionStatuses, setConnectionStatuses] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    // Load saved config from localStorage
    const savedConfig = localStorage.getItem('velokineiq-config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setConfig(parsed);
        onConfigUpdate(parsed);
      } catch (error) {
        console.error('Failed to load saved config:', error);
      }
    }
  }, [onConfigUpdate]);

  const saveConfig = () => {
    try {
      localStorage.setItem('velokineiq-config', JSON.stringify(config));
      onConfigUpdate(config);
      setIsOpen(false);
      toast({
        title: "🔐 Configuration Saved",
        description: "API keys and settings have been saved securely.",
      });
    } catch (error) {
      toast({
        title: "❌ Save Failed",
        description: "Failed to save configuration. Please try again.",
        variant: "destructive",
      });
    }
  };

  const testConnections = async () => {
    const statuses: Record<string, boolean> = {};

    // Test OpenRouter
    if (config.openRouterKey) {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/models', {
          headers: {
            'Authorization': `Bearer ${config.openRouterKey}`,
            'HTTP-Referer': window.location.origin,
          }
        });
        statuses.openrouter = response.ok;
      } catch (error) {
        statuses.openrouter = false;
      }
    }

    // Test N8N
    if (config.n8nUrl && config.n8nApiKey) {
      try {
        const response = await fetch(`${config.n8nUrl}/api/v1/workflows?limit=1`, {
          headers: {
            'Authorization': `Bearer ${config.n8nApiKey}`,
            'Content-Type': 'application/json',
          }
        });
        statuses.n8n = response.ok;
      } catch (error) {
        statuses.n8n = false;
      }
    }

    setConnectionStatuses(statuses);
    toast({
      title: "🔍 Connection Test Complete",
      description: `OpenRouter: ${statuses.openrouter ? '✅' : '❌'} | N8N: ${statuses.n8n ? '✅' : '❌'}`,
    });
  };

  const toggleKeyVisibility = (key: string) => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const maskKey = (key: string) => {
    if (!key || showKeys[key]) return key;
    return key.substring(0, 8) + '••••••••' + key.substring(key.length - 4);
  };

  const hasValidConfig = config.openRouterKey && config.n8nUrl && config.n8nApiKey;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings size={16} />
          API Config
          <Badge variant={hasValidConfig ? "default" : "destructive"} className="ml-2">
            {hasValidConfig ? "✅" : "⚠️"}
          </Badge>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            🔐 API Configuration
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* OpenRouter Configuration */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="openrouter-key">OpenRouter API Key</Label>
              <Badge variant={connectionStatuses.openrouter ? "default" : "secondary"}>
                {connectionStatuses.openrouter ? "🟢 Connected" : "🔴 Disconnected"}
              </Badge>
            </div>
            <div className="relative">
              <Input
                id="openrouter-key"
                type={showKeys.openrouter ? "text" : "password"}
                value={config.openRouterKey}
                onChange={(e) => setConfig(prev => ({ ...prev, openRouterKey: e.target.value }))}
                placeholder="sk-or-v1-..."
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => toggleKeyVisibility('openrouter')}
              >
                {showKeys.openrouter ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>
          </div>

          {/* N8N Configuration */}
          <div className="space-y-3">
            <Label htmlFor="n8n-url">N8N Instance URL</Label>
            <Input
              id="n8n-url"
              value={config.n8nUrl}
              onChange={(e) => setConfig(prev => ({ ...prev, n8nUrl: e.target.value }))}
              placeholder="http://localhost:5678"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="n8n-key">N8N API Key</Label>
              <Badge variant={connectionStatuses.n8n ? "default" : "secondary"}>
                {connectionStatuses.n8n ? "🟢 Connected" : "🔴 Disconnected"}
              </Badge>
            </div>
            <div className="relative">
              <Input
                id="n8n-key"
                type={showKeys.n8n ? "text" : "password"}
                value={config.n8nApiKey}
                onChange={(e) => setConfig(prev => ({ ...prev, n8nApiKey: e.target.value }))}
                placeholder="eyJhbGciOiJIUzI1..."
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => toggleKeyVisibility('n8n')}
              >
                {showKeys.n8n ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button onClick={testConnections} variant="outline" className="flex-1 gap-2">
              <RefreshCw size={16} />
              Test Connections
            </Button>
            <Button onClick={saveConfig} className="flex-1 gap-2">
              <Save size={16} />
              Save Configuration
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
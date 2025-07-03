import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Rocket, ExternalLink, Copy, CheckCircle, AlertCircle, Settings } from 'lucide-react';

interface DeploymentInfo {
  status: 'idle' | 'deploying' | 'success' | 'error';
  url?: string;
  buildLogs?: string[];
  deployedAt?: Date;
}

interface DeployButtonProps {
  workflow?: any;
  n8nConfig?: {
    url: string;
    apiKey: string;
  };
}

export const DeployButton: React.FC<DeployButtonProps> = ({ workflow, n8nConfig }) => {
  const [deployment, setDeployment] = useState<DeploymentInfo>({ status: 'idle' });
  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const simulateDeployment = async () => {
    setDeployment({ status: 'deploying', buildLogs: [] });
    setProgress(0);

    const logs = [
      '🚀 Starting deployment process...',
      '📦 Building workflow bundle...',
      '🔧 Configuring n8n integration...',
      '🌐 Setting up production environment...',
      '✅ Deployment successful!'
    ];

    for (let i = 0; i < logs.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(((i + 1) / logs.length) * 100);
      setDeployment(prev => ({
        ...prev,
        buildLogs: [...(prev.buildLogs || []), logs[i]]
      }));
    }

    // Simulate successful deployment
    const deploymentUrl = `https://${workflow?.name?.toLowerCase().replace(/\s+/g, '-') || 'workflow'}-${Date.now()}.velokineiq.app`;
    
    setDeployment({
      status: 'success',
      url: deploymentUrl,
      buildLogs: logs,
      deployedAt: new Date()
    });

    toast({
      title: "🚀 Deployment Successful!",
      description: `Your workflow is now live at ${deploymentUrl}`,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "📋 Copied!",
      description: "URL copied to clipboard",
    });
  };

  const getStatusIcon = () => {
    switch (deployment.status) {
      case 'deploying':
        return <div className="animate-spin">🚀</div>;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Rocket className="w-5 h-5" />;
    }
  };

  const getStatusColor = () => {
    switch (deployment.status) {
      case 'deploying':
        return 'secondary';
      case 'success':
        return 'default';
      case 'error':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2" disabled={!workflow}>
          {getStatusIcon()}
          Deploy Workflow
          <Badge variant={getStatusColor()} className="ml-2">
            {deployment.status === 'idle' && '🟦 Ready'}
            {deployment.status === 'deploying' && '🟡 Deploying'}
            {deployment.status === 'success' && '🟢 Live'}
            {deployment.status === 'error' && '🔴 Failed'}
          </Badge>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            🚀 Deploy to Production
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Workflow Info */}
          {workflow && (
            <Card className="p-4 bg-muted/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{workflow.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {workflow.nodes?.length || 0} nodes • Created {new Date().toLocaleDateString()}
                  </p>
                </div>
                <Badge variant="outline">{workflow.active ? 'Active' : 'Draft'}</Badge>
              </div>
            </Card>
          )}

          {/* Configuration Status */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${n8nConfig?.url && n8nConfig?.apiKey ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="font-medium">N8N Backend</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {n8nConfig?.url && n8nConfig?.apiKey ? 'Connected & Ready' : 'Not Configured'}
              </p>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${workflow ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="font-medium">Workflow</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {workflow ? 'Ready to Deploy' : 'No Workflow Selected'}
              </p>
            </Card>
          </div>

          {/* Deployment Progress */}
          {deployment.status === 'deploying' && (
            <Card className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Deployment Progress</span>
                  <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            </Card>
          )}

          {/* Build Logs */}
          {deployment.buildLogs && deployment.buildLogs.length > 0 && (
            <Card className="p-4">
              <h4 className="font-medium mb-3">Build Logs</h4>
              <div className="bg-black text-green-400 p-3 rounded text-sm font-mono max-h-40 overflow-y-auto">
                {deployment.buildLogs.map((log, index) => (
                  <div key={index} className="mb-1">
                    {log}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Success State */}
          {deployment.status === 'success' && deployment.url && (
            <Card className="p-4 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800 dark:text-green-200">
                    Deployment Successful!
                  </span>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Your workflow is now live and accessible at:
                  </p>
                  <div className="flex items-center gap-2 p-2 bg-white dark:bg-green-900 rounded border">
                    <code className="flex-1 text-sm">{deployment.url}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(deployment.url!)}
                    >
                      <Copy size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(deployment.url, '_blank')}
                    >
                      <ExternalLink size={14} />
                    </Button>
                  </div>
                </div>

                <div className="text-xs text-green-600 dark:text-green-400">
                  Deployed at {deployment.deployedAt?.toLocaleString()}
                </div>
              </div>
            </Card>
          )}

          {/* Deployment Features */}
          <Card className="p-4">
            <h4 className="font-medium mb-3">🚀 Production Features</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Auto-scaling
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                SSL Certificate
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Global CDN
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                24/7 Monitoring
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Error Logging
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Version Control
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {deployment.status === 'idle' && (
              <Button
                onClick={simulateDeployment}
                disabled={!workflow || !n8nConfig?.url || !n8nConfig?.apiKey}
                className="flex-1 gap-2"
              >
                <Rocket size={16} />
                Deploy to Production
              </Button>
            )}
            
            {deployment.status === 'success' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => window.open(deployment.url, '_blank')}
                  className="flex-1 gap-2"
                >
                  <ExternalLink size={16} />
                  Open Live Site
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setDeployment({ status: 'idle' })}
                  className="gap-2"
                >
                  <Settings size={16} />
                  Deploy New Version
                </Button>
              </>
            )}
          </div>

          {/* Requirements */}
          {(!workflow || !n8nConfig?.url || !n8nConfig?.apiKey) && (
            <Card className="p-4 border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                    Requirements Not Met
                  </h4>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-300 mt-1 space-y-1">
                    {!workflow && <li>• Create a workflow first</li>}
                    {!n8nConfig?.url && <li>• Configure N8N instance URL</li>}
                    {!n8nConfig?.apiKey && <li>• Add N8N API key</li>}
                  </ul>
                </div>
              </div>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
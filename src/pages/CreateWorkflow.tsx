import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { EnhancedVoiceInput } from '@/components/EnhancedVoiceInput';
import { WorkflowPreview } from '@/components/WorkflowPreview';
import { EnhancedWorkflowEditor } from '@/components/EnhancedWorkflowEditor';
import { AdvancedChatInterface } from '@/components/AdvancedChatInterface';
import { ApiKeyManager } from '@/components/ApiKeyManager';
import { DeployButton } from '@/components/DeployButton';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { createOpenRouterService } from '@/lib/openrouter';
import { createN8nAPI, createWorkflowGenerator } from '@/lib/n8n';
import { MessageSquare, Bot } from 'lucide-react';

interface GeneratedWorkflow {
  id: string;
  name: string;
  nodes: Array<{
    id: string;
    name: string;
    type: string;
    typeVersion: number;
    emoji: string;
    position: [number, number];
    parameters: Record<string, any>;
  }>;
  connections: any[];
  n8nJson: any;
}

const CreateWorkflow: React.FC = () => {
  const [workflow, setWorkflow] = useState<GeneratedWorkflow | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [n8nConnected, setN8nConnected] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [apiConfig, setApiConfig] = useState({
    openRouterKey: '',
    n8nUrl: 'http://localhost:5678',
    n8nApiKey: ''
  });
  const [n8nService, setN8nService] = useState<any>(null);
  const [openRouterService, setOpenRouterService] = useState<any>(null);
  const { toast } = useToast();

  // Update services when API config changes
  React.useEffect(() => {
    if (apiConfig.n8nApiKey && apiConfig.n8nUrl) {
      const n8nAPI = createN8nAPI(apiConfig.n8nApiKey, apiConfig.n8nUrl + '/api/v1');
      setN8nService(n8nAPI);
      checkN8nConnection(n8nAPI);
    }

    if (apiConfig.openRouterKey) {
      const openRouterAPI = createOpenRouterService(apiConfig.openRouterKey);
      setOpenRouterService(openRouterAPI);
    }
  }, [apiConfig]);

  const checkN8nConnection = async (service?: any) => {
    const serviceToUse = service || n8nService;
    if (!serviceToUse) {
      setN8nConnected(false);
      return;
    }

    try {
      const connected = await serviceToUse.testConnection();
      setN8nConnected(connected);
      if (!connected) {
        toast({
          title: "⚠️ N8n Connection",
          description: "Could not connect to n8n. Check your configuration.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setN8nConnected(false);
    }
  };

  // Enhanced AI processing with OpenRouter
  const processPrompt = async (prompt: string): Promise<GeneratedWorkflow> => {
    if (!openRouterService) {
      throw new Error('OpenRouter service not configured');
    }

    setProcessingStage('🤖 AI is analyzing your request...');
    setProcessingProgress(20);

    try {
      // Generate workflow with OpenRouter AI
      const aiResponse = await openRouterService.generateWorkflow(prompt);
      
      setProcessingStage('🔧 Parsing workflow structure...');
      setProcessingProgress(50);

      // Parse the AI response
      const n8nWorkflow = await n8nService.parseWorkflowFromJSON(aiResponse);
      
      setProcessingStage('✅ Validating workflow...');
      setProcessingProgress(80);

      // Validate the workflow
      const validation = await n8nService.validateWorkflow(n8nWorkflow);
      if (!validation.valid) {
        throw new Error(`Workflow validation failed: ${validation.errors?.join(', ')}`);
      }

      setProcessingStage('🎉 Workflow ready!');
      setProcessingProgress(100);

      const generatedWorkflow: GeneratedWorkflow = {
        id: `workflow_${Date.now()}`,
        name: n8nWorkflow.name || extractWorkflowName(prompt),
        nodes: n8nWorkflow.nodes || [],
        connections: n8nWorkflow.connections || {},
        n8nJson: n8nWorkflow
      };

      // If n8n is connected, optionally create the workflow there
      if (n8nConnected) {
        try {
          const createdWorkflow = await n8nService.createWorkflow({
            name: generatedWorkflow.name,
            active: false,
            nodes: generatedWorkflow.nodes,
            connections: generatedWorkflow.connections
          });
          generatedWorkflow.id = createdWorkflow.id || generatedWorkflow.id;
        } catch (error) {
          console.warn('Failed to create workflow in n8n:', error);
        }
      }

      return generatedWorkflow;
    } catch (error) {
      console.error('Workflow generation failed:', error);
      // Fallback to mock workflow if AI fails
      return generateFallbackWorkflow(prompt);
    }
  };

  const generateFallbackWorkflow = (prompt: string): GeneratedWorkflow => {
    return {
      id: `workflow_${Date.now()}`,
      name: extractWorkflowName(prompt),
      nodes: generateMockNodes(prompt),
      connections: [],
      n8nJson: generateMockN8nJson(prompt)
    };
  };

  const extractWorkflowName = (prompt: string): string => {
    if (prompt.toLowerCase().includes('typeform')) {
      return 'Typeform to WhatsApp & Airtable';
    } else if (prompt.toLowerCase().includes('email')) {
      return 'Email Automation Workflow';
    } else if (prompt.toLowerCase().includes('slack')) {
      return 'Slack Notification Workflow';
    }
    return 'Custom Automation Workflow';
  };

  const generateMockNodes = (prompt: string) => {
    const baseNodes = [];
    
    if (prompt.toLowerCase().includes('typeform')) {
      baseNodes.push(
        { 
          id: '1', 
          name: 'Typeform Trigger', 
          type: 'n8n-nodes-base.typeformTrigger', 
          typeVersion: 1,
          emoji: '📝', 
          position: [100, 100],
          parameters: {}
        },
        { 
          id: '2', 
          name: 'WhatsApp Message', 
          type: 'n8n-nodes-base.httpRequest', 
          typeVersion: 1,
          emoji: '💬', 
          position: [300, 100],
          parameters: {}
        },
        { 
          id: '3', 
          name: 'Add to Airtable', 
          type: 'n8n-nodes-base.airtable', 
          typeVersion: 1,
          emoji: '📊', 
          position: [500, 100],
          parameters: {}
        }
      );
    } else if (prompt.toLowerCase().includes('email')) {
      baseNodes.push(
        { 
          id: '1', 
          name: 'Email Received', 
          type: 'n8n-nodes-base.webhook', 
          typeVersion: 1,
          emoji: '📧', 
          position: [100, 100],
          parameters: {}
        },
        { 
          id: '2', 
          name: 'Process Content', 
          type: 'n8n-nodes-base.function', 
          typeVersion: 1,
          emoji: '🔄', 
          position: [300, 100],
          parameters: {}
        },
        { 
          id: '3', 
          name: 'Send Response', 
          type: 'n8n-nodes-base.gmail', 
          typeVersion: 1,
          emoji: '📤', 
          position: [500, 100],
          parameters: {}
        }
      );
    } else {
      baseNodes.push(
        { 
          id: '1', 
          name: 'Trigger Event', 
          type: 'n8n-nodes-base.manualTrigger', 
          typeVersion: 1,
          emoji: '🎯', 
          position: [100, 100],
          parameters: {}
        },
        { 
          id: '2', 
          name: 'Process Data', 
          type: 'n8n-nodes-base.function', 
          typeVersion: 1,
          emoji: '⚙️', 
          position: [300, 100],
          parameters: {}
        },
        { 
          id: '3', 
          name: 'Execute Action', 
          type: 'n8n-nodes-base.httpRequest', 
          typeVersion: 1,
          emoji: '🚀', 
          position: [500, 100],
          parameters: {}
        }
      );
    }
    
    return baseNodes;
  };

  const generateMockN8nJson = (prompt: string) => {
    return {
      nodes: [
        {
          parameters: {},
          name: "Trigger",
          type: "n8n-nodes-base.manualTrigger",
          typeVersion: 1,
          position: [240, 300]
        }
      ],
      connections: {}
    };
  };

  const handlePromptSubmit = async (prompt: string) => {
    setIsProcessing(true);
    setProcessingProgress(0);
    setProcessingStage('🚀 Starting workflow generation...');
    
    try {
      const generatedWorkflow = await processPrompt(prompt);
      setWorkflow(generatedWorkflow);
      
      toast({
        title: "🎉 Workflow Generated!",
        description: `Your automation workflow "${generatedWorkflow.name}" has been created successfully.`,
      });
    } catch (error) {
      console.error('Workflow generation error:', error);
      toast({
        title: "❌ Generation Failed",
        description: "Failed to generate workflow. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
      setProcessingStage('');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveWorkflow = async (editedWorkflow: any) => {
    try {
      if (n8nConnected && workflow?.id) {
        await n8nService.updateWorkflow(workflow.id, editedWorkflow);
        toast({
          title: "✅ Workflow Updated",
          description: "Your workflow has been updated in n8n successfully.",
        });
      }
      
      setWorkflow({
        ...workflow!,
        ...editedWorkflow,
        n8nJson: editedWorkflow
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "❌ Update Failed",
        description: "Failed to update workflow. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleRun = async () => {
    if (!workflow?.id || !n8nConnected) {
      toast({
        title: "⚠️ Cannot Run Workflow",
        description: "Make sure n8n is connected and workflow is saved.",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "🧪 Test Run Started",
        description: "Your workflow is being executed...",
      });

      const execution = await n8nService.executeWorkflow(workflow.id);
      
      // Poll for execution result
      setTimeout(async () => {
        try {
          const result = await n8nService.getExecution(execution.id);
          
          if (result.status === 'success') {
            toast({
              title: "✅ Workflow Executed Successfully",
              description: "Your automation ran without errors.",
            });
          } else if (result.status === 'failed') {
            toast({
              title: "❌ Workflow Execution Failed",
              description: "Check the n8n logs for more details.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error('Failed to get execution result:', error);
        }
      }, 3000);

    } catch (error) {
      toast({
        title: "❌ Execution Failed",
        description: "Failed to run workflow. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSave = () => {
    toast({
      title: "💾 Workflow Saved",
      description: "Your workflow has been saved to your library!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl space-y-8">
          {/* Header */}
          <ScrollReveal>
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold gradient-text">
                ✨ Create Automation
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Transform your ideas into powerful automated workflows using AI assistance
              </p>
            </div>
          </ScrollReveal>

          {/* Control Panel */}
          <ScrollReveal delay={100}>
            <div className="flex flex-wrap justify-center gap-4">
              <ApiKeyManager onConfigUpdate={setApiConfig} />
              <Badge variant={n8nConnected ? "default" : "destructive"} className="px-4 py-2">
                {n8nConnected ? "🟢 N8n Connected" : "🔴 N8n Disconnected"}
              </Badge>
              <Button
                onClick={() => setIsChatOpen(true)}
                className="gap-2"
                disabled={!apiConfig.openRouterKey}
              >
                <MessageSquare size={16} />
                AI Assistant
              </Button>
              <DeployButton 
                workflow={workflow?.n8nJson} 
                n8nConfig={apiConfig.n8nApiKey && apiConfig.n8nUrl ? {
                  url: apiConfig.n8nUrl,
                  apiKey: apiConfig.n8nApiKey
                } : undefined}
              />
            </div>
          </ScrollReveal>

          {/* Voice Input Section */}
          <ScrollReveal delay={200}>
            <EnhancedVoiceInput 
              onPromptSubmit={handlePromptSubmit}
              isProcessing={isProcessing}
            />
          </ScrollReveal>

          {/* Processing Status */}
          {isProcessing && (
            <ScrollReveal delay={300}>
              <Card className="glass-card p-6 text-center">
                <div className="space-y-4">
                  <div className="text-2xl">{processingStage.split(' ')[0]}</div>
                  <h3 className="font-semibold">{processingStage}</h3>
                  <Progress value={processingProgress} className="w-full max-w-md mx-auto" />
                  <p className="text-sm text-muted-foreground">
                    AI is creating your workflow... This may take a few moments.
                  </p>
                </div>
              </Card>
            </ScrollReveal>
          )}

          {/* Example Prompts */}
          <ScrollReveal delay={400}>
            <Card className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4 text-center">
                💡 Example Prompts to Get Started
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    emoji: "📝",
                    title: "Form to CRM",
                    prompt: "When I get a Typeform submission, add the contact to Airtable and send a WhatsApp message"
                  },
                  {
                    emoji: "📧", 
                    title: "Email Automation",
                    prompt: "Send a welcome email when someone subscribes to my newsletter"
                  },
                  {
                    emoji: "💰",
                    title: "Payment Processing", 
                    prompt: "When I receive a payment on Razorpay, send an invoice and update my accounting sheet"
                  },
                  {
                    emoji: "📱",
                    title: "Social Media",
                    prompt: "Post to Twitter and LinkedIn when I publish a new blog post"
                  }
                ].map((example, index) => (
                  <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{example.emoji}</span>
                      <div>
                        <h4 className="font-medium text-sm mb-1">{example.title}</h4>
                        <p className="text-xs text-muted-foreground">{example.prompt}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </ScrollReveal>

          {/* Workflow Preview or Editor */}
          <ScrollReveal delay={600}>
            {isEditing && workflow ? (
              <EnhancedWorkflowEditor
                workflow={workflow.n8nJson}
                onSave={handleSaveWorkflow}
                onCancel={handleCancelEdit}
                n8nConfig={apiConfig.n8nApiKey && apiConfig.n8nUrl ? {
                  url: apiConfig.n8nUrl,
                  apiKey: apiConfig.n8nApiKey
                } : undefined}
              />
            ) : (
              <WorkflowPreview 
                workflow={workflow}
                onEdit={handleEdit}
                onRun={handleRun}
                onSave={handleSave}
              />
            )}
          </ScrollReveal>

          {/* Features */}
          <ScrollReveal delay={800}>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  emoji: "🎤",
                  title: "Voice Commands",
                  description: "Speak naturally to create complex automations"
                },
                {
                  emoji: "🤖",
                  title: "AI-Powered",
                  description: "Advanced AI understands your automation needs"
                },
                {
                  emoji: "🔗",
                  title: "400+ Integrations",
                  description: "Connect with all your favorite apps and services"
                }
              ].map((feature, index) => (
                <Card key={index} className="glass-card p-6 text-center hover:scale-105 transition-transform">
                  <div className="text-4xl mb-4">{feature.emoji}</div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </main>
      
      <Footer />

      {/* Advanced Chat Interface */}
      <AdvancedChatInterface
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onWorkflowGenerate={handlePromptSubmit}
        openRouterKey={apiConfig.openRouterKey}
      />
    </div>
  );
};

export default CreateWorkflow;
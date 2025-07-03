import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { VoiceInput } from '@/components/VoiceInput';
import { WorkflowPreview } from '@/components/WorkflowPreview';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface GeneratedWorkflow {
  id: string;
  name: string;
  nodes: Array<{
    id: string;
    name: string;
    type: string;
    emoji: string;
    position: [number, number];
  }>;
  connections: any[];
  n8nJson: any;
}

const CreateWorkflow: React.FC = () => {
  const [workflow, setWorkflow] = useState<GeneratedWorkflow | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Mock AI processing - in real app, this would call your AI API
  const processPrompt = async (prompt: string): Promise<GeneratedWorkflow> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock workflow generation based on prompt
    const mockWorkflow: GeneratedWorkflow = {
      id: `workflow_${Date.now()}`,
      name: extractWorkflowName(prompt),
      nodes: generateMockNodes(prompt),
      connections: [],
      n8nJson: generateMockN8nJson(prompt)
    };

    return mockWorkflow;
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
        { id: '1', name: 'Typeform Trigger', type: 'trigger', emoji: '📝', position: [100, 100] },
        { id: '2', name: 'WhatsApp Message', type: 'action', emoji: '💬', position: [300, 100] },
        { id: '3', name: 'Add to Airtable', type: 'action', emoji: '📊', position: [500, 100] }
      );
    } else if (prompt.toLowerCase().includes('email')) {
      baseNodes.push(
        { id: '1', name: 'Email Received', type: 'trigger', emoji: '📧', position: [100, 100] },
        { id: '2', name: 'Process Content', type: 'action', emoji: '🔄', position: [300, 100] },
        { id: '3', name: 'Send Response', type: 'action', emoji: '📤', position: [500, 100] }
      );
    } else {
      baseNodes.push(
        { id: '1', name: 'Trigger Event', type: 'trigger', emoji: '🎯', position: [100, 100] },
        { id: '2', name: 'Process Data', type: 'action', emoji: '⚙️', position: [300, 100] },
        { id: '3', name: 'Execute Action', type: 'action', emoji: '🚀', position: [500, 100] }
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
    
    try {
      const generatedWorkflow = await processPrompt(prompt);
      setWorkflow(generatedWorkflow);
      
      toast({
        title: "🎉 Workflow Generated!",
        description: "Your automation workflow has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "❌ Generation Failed",
        description: "Failed to generate workflow. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEdit = () => {
    toast({
      title: "✏️ Editor Coming Soon",
      description: "Visual workflow editor will be available soon!",
    });
  };

  const handleRun = () => {
    toast({
      title: "🧪 Test Run Started",
      description: "Your workflow is being tested...",
    });
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
                Transform your ideas into powerful automated workflows using voice commands or text prompts
              </p>
            </div>
          </ScrollReveal>

          {/* Voice Input Section */}
          <ScrollReveal delay={200}>
            <VoiceInput 
              onPromptSubmit={handlePromptSubmit}
              isProcessing={isProcessing}
            />
          </ScrollReveal>

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

          {/* Workflow Preview */}
          <ScrollReveal delay={600}>
            <WorkflowPreview 
              workflow={workflow}
              onEdit={handleEdit}
              onRun={handleRun}
              onSave={handleSave}
            />
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
    </div>
  );
};

export default CreateWorkflow;
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Send, Mic, MicOff, Bot, User, Zap, MessageSquare } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  emotion?: string;
  metadata?: {
    model?: string;
    tokens?: number;
    processingTime?: number;
  };
}

interface AdvancedChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  onWorkflowGenerate: (prompt: string) => void;
  openRouterKey?: string;
}

export const AdvancedChatInterface: React.FC<AdvancedChatInterfaceProps> = ({
  isOpen,
  onClose,
  onWorkflowGenerate,
  openRouterKey
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'system',
      content: 'Welcome to VeloKinetiq! I\'m your AI automation assistant. I can help you create powerful workflows using natural language. Just describe what you want to automate!',
      timestamp: new Date(),
      emotion: 'friendly'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedModel, setSelectedModel] = useState('anthropic/claude-3.5-sonnet');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const models = [
    { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', description: 'Best for complex workflows' },
    { id: 'mistralai/mistral-7b-instruct', name: 'Mistral 7B', description: 'Fast and efficient' },
    { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', description: 'Balanced performance' },
    { id: 'meta-llama/llama-3.1-8b-instruct', name: 'Llama 3.1 8B', description: 'Open source power' }
  ];

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (content: string, isWorkflowRequest = false) => {
    if (!content.trim() || !openRouterKey) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsProcessing(true);

    try {
      const startTime = Date.now();
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openRouterKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'VeloKinetiq AI Assistant'
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            {
              role: 'system',
              content: isWorkflowRequest 
                ? `You are an expert automation consultant for VeloKinetiq. Help users design and optimize workflows. When they describe an automation need, provide detailed guidance and ask clarifying questions. If they confirm they want to create the workflow, respond with "GENERATE_WORKFLOW:" followed by a detailed prompt for workflow generation.`
                : `You are a helpful AI assistant for VeloKinetiq, a workflow automation platform. Provide concise, helpful responses about automation, integrations, and workflow optimization. Keep responses under 200 words unless detailed explanation is needed.`
            },
            ...messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content }
          ],
          temperature: 0.7,
          max_tokens: 1000,
          top_p: 0.9
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const processingTime = Date.now() - startTime;
      const assistantContent = data.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response.';

      // Check if this is a workflow generation request
      if (assistantContent.startsWith('GENERATE_WORKFLOW:')) {
        const workflowPrompt = assistantContent.replace('GENERATE_WORKFLOW:', '').trim();
        onWorkflowGenerate(workflowPrompt);
        onClose();
        return;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date(),
        metadata: {
          model: selectedModel,
          tokens: data.usage?.total_tokens,
          processingTime
        }
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please check your API configuration and try again.',
        timestamp: new Date(),
        emotion: 'apologetic'
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "❌ Chat Error",
        description: "Failed to get AI response. Check your OpenRouter API key.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const startVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
        toast({
          title: "🎤 Voice Input Error",
          description: "Could not access microphone. Please check permissions.",
          variant: "destructive",
        });
      };
      
      recognition.start();
    } else {
      toast({
        title: "🎤 Not Supported",
        description: "Voice input is not supported in this browser.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  const createWorkflow = () => {
    const workflowPrompt = `Based on our conversation, I want to create an automation workflow. Please generate a detailed n8n workflow configuration.`;
    sendMessage(workflowPrompt, true);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-primary" />
              <span className="gradient-text">AI Assistant</span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="text-sm bg-background border border-border rounded px-2 py-1"
              >
                {models.map(model => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
              {!openRouterKey && (
                <Badge variant="destructive">No API Key</Badge>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Chat Messages */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role !== 'user' && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot size={16} className="text-primary" />
                  </div>
                </div>
              )}
              
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground ml-12'
                    : message.role === 'system'
                    ? 'bg-muted text-muted-foreground'
                    : 'bg-card border'
                }`}
              >
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </div>
                
                <div className="flex items-center gap-2 mt-2 text-xs opacity-70">
                  <span>{message.timestamp.toLocaleTimeString()}</span>
                  {message.metadata?.tokens && (
                    <Badge variant="outline" className="text-xs">
                      {message.metadata.tokens} tokens
                    </Badge>
                  )}
                  {message.metadata?.processingTime && (
                    <Badge variant="outline" className="text-xs">
                      {message.metadata.processingTime}ms
                    </Badge>
                  )}
                </div>
              </div>

              {message.role === 'user' && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <User size={16} className="text-secondary-foreground" />
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot size={16} className="text-primary animate-pulse" />
              </div>
              <div className="bg-card border rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-200"></div>
                  <span className="ml-2">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="flex-shrink-0 p-4 border-t space-y-3">
          <div className="flex gap-2">
            <Button
              onClick={createWorkflow}
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={!openRouterKey}
            >
              <Zap size={16} />
              Create Workflow
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="flex-1 relative">
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={openRouterKey ? "Ask me anything about automation..." : "Please configure your OpenRouter API key first"}
                className="min-h-[60px] pr-12 resize-none"
                disabled={!openRouterKey || isProcessing}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2"
                onClick={startVoiceInput}
                disabled={!openRouterKey || isListening || isProcessing}
              >
                {isListening ? (
                  <MicOff size={16} className="text-destructive" />
                ) : (
                  <Mic size={16} />
                )}
              </Button>
            </div>
            <Button
              type="submit"
              disabled={!inputMessage.trim() || !openRouterKey || isProcessing}
              className="gap-2"
            >
              <Send size={16} />
              {isProcessing ? 'Sending...' : 'Send'}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
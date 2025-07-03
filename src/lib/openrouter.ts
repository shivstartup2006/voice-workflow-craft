// OpenRouter API integration for LLM functionality
export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class OpenRouterService {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateWorkflow(prompt: string): Promise<string> {
    const messages: OpenRouterMessage[] = [
      {
        role: 'system',
        content: `You are an expert n8n workflow generator. Convert user prompts into valid n8n JSON workflows.
        
Rules:
1. Generate complete n8n workflow JSON with nodes, connections, and proper parameters
2. Use common n8n node types: n8n-nodes-base.manualTrigger, n8n-nodes-base.webhook, n8n-nodes-base.httpRequest, etc.
3. Include proper node positioning [x, y] coordinates
4. Add realistic parameters for each node type
5. Create proper connections between nodes
6. Return ONLY the JSON workflow, no extra text

Example node types to use:
- n8n-nodes-base.manualTrigger
- n8n-nodes-base.webhook  
- n8n-nodes-base.httpRequest
- n8n-nodes-base.set
- n8n-nodes-base.if
- n8n-nodes-base.gmail
- n8n-nodes-base.slack
- n8n-nodes-base.airtable
- n8n-nodes-base.typeform`
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'VeloKinetiq Workflow Builder'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet',
          messages,
          temperature: 0.3,
          max_tokens: 2000,
          top_p: 0.9
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data: OpenRouterResponse = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenRouter API error:', error);
      throw new Error('Failed to generate workflow with AI');
    }
  }

  async improveWorkflow(currentWorkflow: string, improvements: string): Promise<string> {
    const messages: OpenRouterMessage[] = [
      {
        role: 'system',
        content: 'You are an n8n workflow optimizer. Improve existing workflows based on user feedback. Return only the improved JSON workflow.'
      },
      {
        role: 'user',
        content: `Current workflow: ${currentWorkflow}\n\nImprovement request: ${improvements}`
      }
    ];

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'VeloKinetiq Workflow Builder'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet',
          messages,
          temperature: 0.2,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data: OpenRouterResponse = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenRouter API error:', error);
      throw new Error('Failed to improve workflow with AI');
    }
  }
}

// Default instance with API key
export const openRouterService = new OpenRouterService('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');
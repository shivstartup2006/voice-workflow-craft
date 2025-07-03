// n8n API Integration for VeloKinetiq
// This file handles all n8n API interactions

const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYjA0NzllMC0wMjIzLTQ3MTQtODZlMS1jNDRhOTAzY2I1ZTIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzUxNTM4NTIyfQ.0I3WcwUlpM7eyhp067ZLzAZNMCkanBOOOBDbYEIjaM4';
const N8N_BASE_URL = 'https://your-n8n-instance.com/api/v1'; // Replace with your n8n instance URL

interface N8nWorkflow {
  id?: string;
  name: string;
  nodes: N8nNode[];
  connections: Record<string, any>;
  active?: boolean;
  tags?: string[];
}

interface N8nNode {
  id: string;
  name: string;
  type: string;
  typeVersion: number;
  position: [number, number];
  parameters: Record<string, any>;
  credentials?: Record<string, any>;
}

export class N8nAPI {
  private headers: Record<string, string>;

  constructor() {
    this.headers = {
      'Authorization': `Bearer ${N8N_API_KEY}`,
      'Content-Type': 'application/json',
    };
  }

  // Create a new workflow in n8n
  async createWorkflow(workflow: N8nWorkflow): Promise<N8nWorkflow> {
    try {
      const response = await fetch(`${N8N_BASE_URL}/workflows`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(workflow),
      });

      if (!response.ok) {
        throw new Error(`Failed to create workflow: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating workflow:', error);
      throw error;
    }
  }

  // Get all workflows
  async getWorkflows(): Promise<N8nWorkflow[]> {
    try {
      const response = await fetch(`${N8N_BASE_URL}/workflows`, {
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch workflows: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching workflows:', error);
      throw error;
    }
  }

  // Get a specific workflow
  async getWorkflow(workflowId: string): Promise<N8nWorkflow> {
    try {
      const response = await fetch(`${N8N_BASE_URL}/workflows/${workflowId}`, {
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch workflow: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching workflow:', error);
      throw error;
    }
  }

  // Update a workflow
  async updateWorkflow(workflowId: string, workflow: Partial<N8nWorkflow>): Promise<N8nWorkflow> {
    try {
      const response = await fetch(`${N8N_BASE_URL}/workflows/${workflowId}`, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify(workflow),
      });

      if (!response.ok) {
        throw new Error(`Failed to update workflow: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating workflow:', error);
      throw error;
    }
  }

  // Delete a workflow
  async deleteWorkflow(workflowId: string): Promise<void> {
    try {
      const response = await fetch(`${N8N_BASE_URL}/workflows/${workflowId}`, {
        method: 'DELETE',
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to delete workflow: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting workflow:', error);
      throw error;
    }
  }

  // Activate/Deactivate a workflow
  async toggleWorkflow(workflowId: string, active: boolean): Promise<N8nWorkflow> {
    try {
      const response = await fetch(`${N8N_BASE_URL}/workflows/${workflowId}/${active ? 'activate' : 'deactivate'}`, {
        method: 'POST',
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to ${active ? 'activate' : 'deactivate'} workflow: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error ${active ? 'activating' : 'deactivating'} workflow:`, error);
      throw error;
    }
  }

  // Execute a workflow manually
  async executeWorkflow(workflowId: string, data?: Record<string, any>): Promise<any> {
    try {
      const response = await fetch(`${N8N_BASE_URL}/workflows/${workflowId}/execute`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ data }),
      });

      if (!response.ok) {
        throw new Error(`Failed to execute workflow: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error executing workflow:', error);
      throw error;
    }
  }

  // Get workflow execution history
  async getExecutions(workflowId: string, limit: number = 20): Promise<any[]> {
    try {
      const response = await fetch(`${N8N_BASE_URL}/executions?workflowId=${workflowId}&limit=${limit}`, {
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch executions: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching executions:', error);
      throw error;
    }
  }
}

// AI Prompt to n8n Workflow Converter
export class WorkflowGenerator {
  private n8nAPI: N8nAPI;

  constructor() {
    this.n8nAPI = new N8nAPI();
  }

  // Generate n8n workflow from natural language prompt
  async generateFromPrompt(prompt: string): Promise<N8nWorkflow> {
    // This would typically call an AI API (OpenAI, Anthropic, etc.)
    // For demo purposes, we'll use pattern matching

    const workflow = this.parsePromptToWorkflow(prompt);
    return workflow;
  }

  private parsePromptToWorkflow(prompt: string): N8nWorkflow {
    const lowerPrompt = prompt.toLowerCase();
    
    // Extract trigger and actions from prompt
    const nodes: N8nNode[] = [];
    const connections: Record<string, any> = {};

    // Common trigger patterns
    if (lowerPrompt.includes('typeform')) {
      nodes.push({
        id: 'trigger',
        name: 'Typeform Trigger',
        type: 'n8n-nodes-base.typeformTrigger',
        typeVersion: 1,
        position: [100, 200],
        parameters: {
          formId: 'YOUR_FORM_ID',
          webhookUrl: 'https://your-webhook-url.com'
        }
      });
    } else if (lowerPrompt.includes('razorpay') || lowerPrompt.includes('payment')) {
      nodes.push({
        id: 'trigger',
        name: 'Razorpay Webhook',
        type: 'n8n-nodes-base.webhook',
        typeVersion: 1,
        position: [100, 200],
        parameters: {
          path: 'razorpay-webhook',
          httpMethod: 'POST'
        }
      });
    } else {
      nodes.push({
        id: 'trigger',
        name: 'Manual Trigger',
        type: 'n8n-nodes-base.manualTrigger',
        typeVersion: 1,
        position: [100, 200],
        parameters: {}
      });
    }

    // Common action patterns
    let nodeIndex = 1;
    
    if (lowerPrompt.includes('whatsapp')) {
      nodes.push({
        id: `action_${nodeIndex}`,
        name: 'Send WhatsApp',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 1,
        position: [300, 200],
        parameters: {
          url: 'https://api.whatsapp.com/send',
          method: 'POST',
          sendBody: true,
          bodyParameters: {
            phone: '={{ $json.phone }}',
            message: 'New submission received!'
          }
        }
      });
      nodeIndex++;
    }

    if (lowerPrompt.includes('airtable')) {
      nodes.push({
        id: `action_${nodeIndex}`,
        name: 'Add to Airtable',
        type: 'n8n-nodes-base.airtable',
        typeVersion: 1,
        position: [500, 200],
        parameters: {
          operation: 'append',
          baseId: 'YOUR_BASE_ID',
          table: 'Contacts',
          fields: {
            Name: '={{ $json.name }}',
            Email: '={{ $json.email }}'
          }
        }
      });
      nodeIndex++;
    }

    if (lowerPrompt.includes('email') || lowerPrompt.includes('gmail')) {
      nodes.push({
        id: `action_${nodeIndex}`,
        name: 'Send Email',
        type: 'n8n-nodes-base.gmail',
        typeVersion: 1,
        position: [400, 200],
        parameters: {
          operation: 'send',
          to: '={{ $json.email }}',
          subject: 'Thank you for your submission',
          body: 'We have received your submission and will get back to you soon.'
        }
      });
      nodeIndex++;
    }

    // Create connections between nodes
    if (nodes.length > 1) {
      for (let i = 0; i < nodes.length - 1; i++) {
        const currentNode = nodes[i];
        const nextNode = nodes[i + 1];
        
        connections[currentNode.id] = {
          main: [[{
            node: nextNode.id,
            type: 'main',
            index: 0
          }]]
        };
      }
    }

    return {
      name: this.generateWorkflowName(prompt),
      nodes,
      connections,
      active: false,
      tags: ['voice-generated', 'velokinetiq']
    };
  }

  private generateWorkflowName(prompt: string): string {
    if (prompt.toLowerCase().includes('typeform') && prompt.toLowerCase().includes('airtable')) {
      return 'Typeform to Airtable Automation';
    } else if (prompt.toLowerCase().includes('razorpay')) {
      return 'Razorpay Payment Automation';
    } else if (prompt.toLowerCase().includes('email')) {
      return 'Email Automation Workflow';
    }
    return 'Voice Generated Workflow';
  }

  // Deploy workflow to n8n
  async deployWorkflow(workflow: N8nWorkflow): Promise<N8nWorkflow> {
    try {
      const createdWorkflow = await this.n8nAPI.createWorkflow(workflow);
      console.log('Workflow deployed successfully:', createdWorkflow);
      return createdWorkflow;
    } catch (error) {
      console.error('Failed to deploy workflow:', error);
      throw error;
    }
  }
}

// Export singleton instances
export const n8nAPI = new N8nAPI();
export const workflowGenerator = new WorkflowGenerator();
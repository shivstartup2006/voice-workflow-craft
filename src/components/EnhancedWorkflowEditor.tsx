import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MermaidDiagram, generateWorkflowMermaid } from './MermaidDiagram';
import { useToast } from '@/hooks/use-toast';
import { Save, X, Plus, Trash2, Copy, Play, Pause, RotateCcw, Download, Upload } from 'lucide-react';

interface EnhancedWorkflowEditorProps {
  workflow: any;
  onSave: (workflow: any) => void;
  onCancel: () => void;
  onDeploy?: (workflow: any) => void;
  n8nConfig?: {
    url: string;
    apiKey: string;
  };
}

export const EnhancedWorkflowEditor: React.FC<EnhancedWorkflowEditorProps> = ({
  workflow,
  onSave,
  onCancel,
  onDeploy,
  n8nConfig
}) => {
  const [editedWorkflow, setEditedWorkflow] = useState(workflow);
  const [jsonString, setJsonString] = useState(JSON.stringify(workflow, null, 2));
  const [activeTab, setActiveTab] = useState('visual');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const nodeTypes = [
    { value: 'n8n-nodes-base.manualTrigger', label: '🎯 Manual Trigger', category: 'trigger' },
    { value: 'n8n-nodes-base.webhook', label: '🌐 Webhook', category: 'trigger' },
    { value: 'n8n-nodes-base.typeformTrigger', label: '📝 Typeform', category: 'trigger' },
    { value: 'n8n-nodes-base.httpRequest', label: '🌍 HTTP Request', category: 'action' },
    { value: 'n8n-nodes-base.gmail', label: '📧 Gmail', category: 'action' },
    { value: 'n8n-nodes-base.slack', label: '💬 Slack', category: 'action' },
    { value: 'n8n-nodes-base.airtable', label: '📊 Airtable', category: 'action' },
    { value: 'n8n-nodes-base.set', label: '⚙️ Set Data', category: 'data' },
    { value: 'n8n-nodes-base.if', label: '🔀 IF Condition', category: 'logic' },
    { value: 'n8n-nodes-base.function', label: '🔧 Function', category: 'code' },
  ];

  const updateWorkflowName = useCallback((name: string) => {
    const updated = { ...editedWorkflow, name };
    setEditedWorkflow(updated);
    setJsonString(JSON.stringify(updated, null, 2));
  }, [editedWorkflow]);

  const updateWorkflowJson = useCallback((json: string) => {
    setJsonString(json);
    try {
      const parsed = JSON.parse(json);
      setEditedWorkflow(parsed);
      setValidationErrors([]);
    } catch (error) {
      setValidationErrors(['Invalid JSON format']);
    }
  }, []);

  const addNode = () => {
    const newNode = {
      id: `node_${Date.now()}`,
      name: 'New Node',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 1,
      position: [400 + (editedWorkflow.nodes?.length || 0) * 200, 200],
      parameters: {},
      credentials: {}
    };

    const updated = {
      ...editedWorkflow,
      nodes: [...(editedWorkflow.nodes || []), newNode]
    };

    setEditedWorkflow(updated);
    setJsonString(JSON.stringify(updated, null, 2));
  };

  const removeNode = (nodeIndex: number) => {
    const updated = {
      ...editedWorkflow,
      nodes: editedWorkflow.nodes?.filter((_: any, index: number) => index !== nodeIndex) || []
    };

    setEditedWorkflow(updated);
    setJsonString(JSON.stringify(updated, null, 2));
  };

  const duplicateNode = (nodeIndex: number) => {
    const nodeToClone = editedWorkflow.nodes[nodeIndex];
    const duplicatedNode = {
      ...nodeToClone,
      id: `${nodeToClone.id}_copy_${Date.now()}`,
      name: `${nodeToClone.name} (Copy)`,
      position: [nodeToClone.position[0] + 100, nodeToClone.position[1] + 100]
    };

    const updated = {
      ...editedWorkflow,
      nodes: [...editedWorkflow.nodes, duplicatedNode]
    };

    setEditedWorkflow(updated);
    setJsonString(JSON.stringify(updated, null, 2));
  };

  const updateNode = (nodeIndex: number, field: string, value: any) => {
    const updated = {
      ...editedWorkflow,
      nodes: editedWorkflow.nodes?.map((node: any, index: number) => 
        index === nodeIndex ? { ...node, [field]: value } : node
      ) || []
    };

    setEditedWorkflow(updated);
    setJsonString(JSON.stringify(updated, null, 2));
  };

  const validateWorkflow = async () => {
    setIsValidating(true);
    const errors: string[] = [];

    try {
      // Basic validation
      if (!editedWorkflow.name) {
        errors.push('Workflow name is required');
      }

      if (!editedWorkflow.nodes || editedWorkflow.nodes.length === 0) {
        errors.push('Workflow must have at least one node');
      }

      // Check for trigger node
      const hasTrigger = editedWorkflow.nodes?.some((node: any) => 
        node.type.includes('Trigger') || node.type.includes('trigger')
      );
      
      if (!hasTrigger) {
        errors.push('Workflow must have at least one trigger node');
      }

      // Validate node structure
      editedWorkflow.nodes?.forEach((node: any, index: number) => {
        if (!node.id) errors.push(`Node ${index + 1}: Missing ID`);
        if (!node.name) errors.push(`Node ${index + 1}: Missing name`);
        if (!node.type) errors.push(`Node ${index + 1}: Missing type`);
        if (!node.typeVersion) errors.push(`Node ${index + 1}: Missing typeVersion`);
        if (!node.position || !Array.isArray(node.position)) {
          errors.push(`Node ${index + 1}: Invalid position`);
        }
      });

      // Test with n8n if configured
      if (n8nConfig?.url && n8nConfig?.apiKey && errors.length === 0) {
        try {
          const response = await fetch(`${n8nConfig.url}/api/v1/workflows/validate`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${n8nConfig.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(editedWorkflow)
          });

          if (!response.ok) {
            errors.push('N8N validation failed - check node configurations');
          }
        } catch (error) {
          errors.push('Could not validate with N8N instance');
        }
      }

      setValidationErrors(errors);
      
      if (errors.length === 0) {
        toast({
          title: "✅ Validation Passed",
          description: "Workflow is valid and ready to deploy",
        });
      } else {
        toast({
          title: "❌ Validation Failed",
          description: `Found ${errors.length} error(s)`,
          variant: "destructive",
        });
      }
    } catch (error) {
      errors.push('Validation process failed');
      setValidationErrors(errors);
    } finally {
      setIsValidating(false);
    }
  };

  const handleSave = () => {
    try {
      if (activeTab === 'json') {
        JSON.parse(jsonString);
      }

      onSave(editedWorkflow);
      toast({
        title: "✅ Workflow Saved",
        description: "Your workflow has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "❌ Invalid JSON",
        description: "Please fix the JSON syntax errors before saving.",
        variant: "destructive",
      });
    }
  };

  const exportWorkflow = () => {
    const dataStr = JSON.stringify(editedWorkflow, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${editedWorkflow.name?.replace(/\s+/g, '_') || 'workflow'}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importWorkflow = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        setEditedWorkflow(imported);
        setJsonString(JSON.stringify(imported, null, 2));
        toast({
          title: "📥 Workflow Imported",
          description: "Workflow has been loaded successfully",
        });
      } catch (error) {
        toast({
          title: "❌ Import Failed",
          description: "Invalid workflow file format",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const mermaidChart = generateWorkflowMermaid(editedWorkflow);

  return (
    <Card className="glass-card p-6 w-full">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold gradient-text">
              ✏️ Enhanced Workflow Editor
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Design, validate, and deploy your automation workflows
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel} className="gap-2">
              <X size={16} />
              Cancel
            </Button>
            <Button onClick={validateWorkflow} disabled={isValidating} className="gap-2">
              {isValidating ? '⏳' : '✅'}
              Validate
            </Button>
            <Button variant="default" onClick={handleSave} className="gap-2">
              <Save size={16} />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <Card className="p-4 border-destructive bg-destructive/5">
            <div className="flex items-start gap-2">
              <div className="text-destructive">⚠️</div>
              <div className="flex-1">
                <h4 className="font-medium text-destructive">Validation Errors</h4>
                <ul className="text-sm text-destructive mt-1 space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        )}

        {/* Workflow Meta */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="workflow-name">Workflow Name</Label>
            <Input
              id="workflow-name"
              value={editedWorkflow.name || ''}
              onChange={(e) => updateWorkflowName(e.target.value)}
              placeholder="Enter workflow name..."
            />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={editedWorkflow.active ? 'active' : 'inactive'}
              onValueChange={(value) => setEditedWorkflow(prev => ({ ...prev, active: value === 'active' }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">🟢 Active</SelectItem>
                <SelectItem value="inactive">⏸️ Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Nodes</Label>
            <div className="flex items-center justify-between h-10 px-3 border rounded-md bg-muted">
              <span className="text-sm">{editedWorkflow.nodes?.length || 0} nodes</span>
              <Badge variant="outline">{validationErrors.length === 0 ? '✅ Valid' : '❌ Errors'}</Badge>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="visual">🎨 Visual Editor</TabsTrigger>
            <TabsTrigger value="json">📝 JSON Editor</TabsTrigger>
            <TabsTrigger value="diagram">📊 Flow Diagram</TabsTrigger>
            <TabsTrigger value="settings">⚙️ Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="visual" className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">Workflow Nodes</h4>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={addNode} className="gap-2">
                  <Plus size={16} />
                  Add Node
                </Button>
              </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {editedWorkflow.nodes?.map((node: any, index: number) => (
                <Card key={index} className="p-4 bg-card/50 hover:bg-card/80 transition-colors">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium flex items-center gap-2">
                        <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs">
                          {index + 1}
                        </span>
                        Node {index + 1}
                      </h5>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => duplicateNode(index)}
                          className="gap-1"
                        >
                          <Copy size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeNode(index)}
                          className="text-destructive hover:text-destructive gap-1"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`node-name-${index}`}>Name</Label>
                        <Input
                          id={`node-name-${index}`}
                          value={node.name || ''}
                          onChange={(e) => updateNode(index, 'name', e.target.value)}
                          placeholder="Node name..."
                        />
                      </div>
                      <div>
                        <Label htmlFor={`node-type-${index}`}>Type</Label>
                        <Select
                          value={node.type || ''}
                          onValueChange={(value) => updateNode(index, 'type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select node type..." />
                          </SelectTrigger>
                          <SelectContent>
                            {nodeTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Position X</Label>
                        <Input
                          type="number"
                          value={node.position?.[0] || 0}
                          onChange={(e) => updateNode(index, 'position', [Number(e.target.value), node.position?.[1] || 0])}
                        />
                      </div>
                      <div>
                        <Label>Position Y</Label>
                        <Input
                          type="number"
                          value={node.position?.[1] || 0}
                          onChange={(e) => updateNode(index, 'position', [node.position?.[0] || 0, Number(e.target.value)])}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {(!editedWorkflow.nodes || editedWorkflow.nodes.length === 0) && (
                <Card className="p-8 text-center border-dashed">
                  <div className="text-4xl mb-4">🎯</div>
                  <h4 className="font-medium mb-2">No Nodes Yet</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start building your workflow by adding your first node
                  </p>
                  <Button onClick={addNode} className="gap-2">
                    <Plus size={16} />
                    Add First Node
                  </Button>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="json" className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="workflow-json">Workflow JSON Configuration</Label>
              <div className="flex gap-2">
                <input
                  type="file"
                  accept=".json"
                  onChange={importWorkflow}
                  className="hidden"
                  id="import-workflow"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('import-workflow')?.click()}
                  className="gap-2"
                >
                  <Upload size={16} />
                  Import
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportWorkflow}
                  className="gap-2"
                >
                  <Download size={16} />
                  Export
                </Button>
              </div>
            </div>
            <Textarea
              id="workflow-json"
              value={jsonString}
              onChange={(e) => updateWorkflowJson(e.target.value)}
              className="min-h-[500px] font-mono text-sm"
              placeholder="Workflow JSON..."
            />
          </TabsContent>

          <TabsContent value="diagram" className="space-y-4">
            <div className="bg-card/50 rounded-lg p-4 min-h-[500px]">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold">Workflow Flow Diagram</h4>
                <Badge variant="outline">
                  {editedWorkflow.nodes?.length || 0} nodes
                </Badge>
              </div>
              
              {mermaidChart ? (
                <MermaidDiagram chart={mermaidChart} className="w-full" />
              ) : (
                <div className="text-center text-muted-foreground py-20">
                  <div className="text-4xl mb-4">📊</div>
                  <p>No valid workflow structure found for diagram generation.</p>
                  <p className="text-sm mt-2">Add some nodes to see the flow diagram.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="grid gap-6">
              <Card className="p-4">
                <h4 className="font-medium mb-3">⚡ Execution Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Auto-activate on save</Label>
                    <input
                      type="checkbox"
                      checked={editedWorkflow.active || false}
                      onChange={(e) => setEditedWorkflow(prev => ({ ...prev, active: e.target.checked }))}
                      className="w-4 h-4"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Error workflow</Label>
                    <Input
                      value={editedWorkflow.errorWorkflow || ''}
                      onChange={(e) => setEditedWorkflow(prev => ({ ...prev, errorWorkflow: e.target.value }))}
                      placeholder="Error handling workflow ID"
                      className="w-48"
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-medium mb-3">🏷️ Metadata</h4>
                <div className="space-y-3">
                  <div>
                    <Label>Tags</Label>
                    <Input
                      value={editedWorkflow.tags?.join(', ') || ''}
                      onChange={(e) => setEditedWorkflow(prev => ({ 
                        ...prev, 
                        tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                      }))}
                      placeholder="automation, production, important"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={editedWorkflow.description || ''}
                      onChange={(e) => setEditedWorkflow(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what this workflow does..."
                      rows={3}
                    />
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-4 border-t border-border/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => updateWorkflowName(`${editedWorkflow.name} (Copy)`)}
            className="gap-2"
          >
            <Copy size={16} />
            Duplicate
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditedWorkflow({ ...editedWorkflow, active: !editedWorkflow.active })}
            className="gap-2"
          >
            {editedWorkflow.active ? <Pause size={16} /> : <Play size={16} />}
            {editedWorkflow.active ? 'Deactivate' : 'Activate'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditedWorkflow(workflow);
              setJsonString(JSON.stringify(workflow, null, 2));
              toast({ title: "🔄 Reset", description: "Workflow reset to last saved version." });
            }}
            className="gap-2"
          >
            <RotateCcw size={16} />
            Reset
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(jsonString);
              toast({ title: "📋 Copied", description: "Workflow JSON copied to clipboard." });
            }}
            className="gap-2"
          >
            <Copy size={16} />
            Copy JSON
          </Button>
        </div>
      </div>
    </Card>
  );
};
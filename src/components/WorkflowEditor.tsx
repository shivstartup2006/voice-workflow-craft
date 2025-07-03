import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MermaidDiagram, generateWorkflowMermaid } from './MermaidDiagram';
import { useToast } from '@/hooks/use-toast';

interface WorkflowEditorProps {
  workflow: any;
  onSave: (workflow: any) => void;
  onCancel: () => void;
}

export const WorkflowEditor: React.FC<WorkflowEditorProps> = ({
  workflow,
  onSave,
  onCancel
}) => {
  const [editedWorkflow, setEditedWorkflow] = useState(workflow);
  const [jsonString, setJsonString] = useState(JSON.stringify(workflow, null, 2));
  const [activeTab, setActiveTab] = useState('visual');
  const { toast } = useToast();

  const updateWorkflowName = (name: string) => {
    const updated = { ...editedWorkflow, name };
    setEditedWorkflow(updated);
    setJsonString(JSON.stringify(updated, null, 2));
  };

  const updateWorkflowJson = (json: string) => {
    setJsonString(json);
    try {
      const parsed = JSON.parse(json);
      setEditedWorkflow(parsed);
    } catch (error) {
      // Invalid JSON, don't update the workflow object
    }
  };

  const addNode = () => {
    const newNode = {
      id: `node_${Date.now()}`,
      name: 'New Node',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 1,
      position: [400, 200],
      parameters: {}
    };

    const updated = {
      ...editedWorkflow,
      nodes: [...editedWorkflow.nodes, newNode]
    };

    setEditedWorkflow(updated);
    setJsonString(JSON.stringify(updated, null, 2));
  };

  const removeNode = (nodeIndex: number) => {
    const updated = {
      ...editedWorkflow,
      nodes: editedWorkflow.nodes.filter((_: any, index: number) => index !== nodeIndex)
    };

    setEditedWorkflow(updated);
    setJsonString(JSON.stringify(updated, null, 2));
  };

  const updateNode = (nodeIndex: number, field: string, value: any) => {
    const updated = {
      ...editedWorkflow,
      nodes: editedWorkflow.nodes.map((node: any, index: number) => 
        index === nodeIndex ? { ...node, [field]: value } : node
      )
    };

    setEditedWorkflow(updated);
    setJsonString(JSON.stringify(updated, null, 2));
  };

  const handleSave = () => {
    try {
      // Validate JSON if on JSON tab
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

  const mermaidChart = generateWorkflowMermaid(editedWorkflow);

  return (
    <Card className="glass-card p-6 w-full">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold gradient-text">
              ✏️ Workflow Editor
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Customize your automation workflow
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="gradient" onClick={handleSave}>
              💾 Save Changes
            </Button>
          </div>
        </div>

        {/* Workflow Name */}
        <div className="space-y-2">
          <Label htmlFor="workflow-name">Workflow Name</Label>
          <Input
            id="workflow-name"
            value={editedWorkflow.name || ''}
            onChange={(e) => updateWorkflowName(e.target.value)}
            placeholder="Enter workflow name..."
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="visual">🎨 Visual</TabsTrigger>
            <TabsTrigger value="json">📝 JSON</TabsTrigger>
            <TabsTrigger value="diagram">📊 Diagram</TabsTrigger>
          </TabsList>

          <TabsContent value="visual" className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">Workflow Nodes</h4>
              <Button variant="outline" size="sm" onClick={addNode}>
                ➕ Add Node
              </Button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {editedWorkflow.nodes?.map((node: any, index: number) => (
                <Card key={index} className="p-4 bg-card/50">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium">Node {index + 1}</h5>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeNode(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        🗑️
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
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
                        <Input
                          id={`node-type-${index}`}
                          value={node.type || ''}
                          onChange={(e) => updateNode(index, 'type', e.target.value)}
                          placeholder="n8n-nodes-base..."
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="json" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workflow-json">Workflow JSON</Label>
              <Textarea
                id="workflow-json"
                value={jsonString}
                onChange={(e) => updateWorkflowJson(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
                placeholder="Workflow JSON..."
              />
            </div>
          </TabsContent>

          <TabsContent value="diagram" className="space-y-4">
            <div className="bg-card/50 rounded-lg p-4 min-h-[400px]">
              <h4 className="font-semibold mb-4">Workflow Diagram</h4>
              {mermaidChart ? (
                <MermaidDiagram chart={mermaidChart} className="w-full" />
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  <div className="text-4xl mb-4">📊</div>
                  <p>No valid workflow structure found for diagram generation.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => updateWorkflowName(`${editedWorkflow.name} (Copy)`)}
            className="gap-2"
          >
            📋 Duplicate
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditedWorkflow({ ...editedWorkflow, active: !editedWorkflow.active })}
            className="gap-2"
          >
            {editedWorkflow.active ? '⏸️ Deactivate' : '▶️ Activate'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const validated = { ...editedWorkflow };
              setEditedWorkflow(validated);
              toast({ title: "✅ Workflow Validated", description: "No errors found." });
            }}
            className="gap-2"
          >
            ✅ Validate
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
            📋 Copy JSON
          </Button>
        </div>
      </div>
    </Card>
  );
};
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface WorkflowNode {
  id: string;
  name: string;
  type: string;
  emoji: string;
  position: [number, number];
}

interface WorkflowPreviewProps {
  workflow: {
    id: string;
    name: string;
    nodes: WorkflowNode[];
    connections: any[];
  } | null;
  onEdit?: () => void;
  onRun?: () => void;
  onSave?: () => void;
}

export const WorkflowPreview: React.FC<WorkflowPreviewProps> = ({
  workflow,
  onEdit,
  onRun,
  onSave
}) => {
  if (!workflow) {
    return (
      <Card className="glass-card p-8 text-center">
        <div className="text-6xl mb-4">🤖</div>
        <h3 className="text-xl font-semibold mb-2">No Workflow Generated Yet</h3>
        <p className="text-muted-foreground">
          Use the voice input or text prompt above to create your first automation
        </p>
      </Card>
    );
  }

  return (
    <Card className="glass-card p-6 w-full">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold gradient-text">
              ⚡ {workflow.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Generated workflow with {workflow.nodes.length} steps
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              ✏️ Edit
            </Button>
            <Button variant="hero" size="sm" onClick={onRun}>
              ▶️ Test Run
            </Button>
            <Button variant="gradient" size="sm" onClick={onSave}>
              💾 Save
            </Button>
          </div>
        </div>

        {/* Workflow Visualization */}
        <div className="relative overflow-x-auto">
          <div className="flex items-center gap-4 min-w-max pb-4">
            {workflow.nodes.map((node, index) => (
              <React.Fragment key={node.id}>
                <div className="workflow-node min-w-[200px] text-center">
                  <div className="text-3xl mb-2">{node.emoji}</div>
                  <h4 className="font-semibold text-sm mb-1">{node.name}</h4>
                  <p className="text-xs text-muted-foreground capitalize">
                    {node.type.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                </div>
                
                {index < workflow.nodes.length - 1 && (
                  <div className="flex items-center">
                    <div className="w-8 h-0.5 bg-gradient-to-r from-primary to-primary-glow"></div>
                    <div className="text-primary">➤</div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Workflow Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border/50">
          <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <div className="text-2xl mb-2">✅</div>
            <p className="text-sm font-medium text-green-700 dark:text-green-400">
              Ready to Deploy
            </p>
          </div>
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <div className="text-2xl mb-2">🔗</div>
            <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
              Auto-Connected
            </p>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
            <div className="text-2xl mb-2">🚀</div>
            <p className="text-sm font-medium text-purple-700 dark:text-purple-400">
              Cloud Hosted
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
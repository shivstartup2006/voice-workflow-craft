import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart, className = '' }) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'dark',
      themeVariables: {
        primaryColor: '#8b5cf6',
        primaryTextColor: '#ffffff',
        primaryBorderColor: '#7c3aed',
        lineColor: '#a78bfa',
        sectionBkgColor: '#1f2937',
        altSectionBkgColor: '#374151',
        gridColor: '#374151',
        secondaryColor: '#06b6d4',
        tertiaryColor: '#10b981',
      },
    });
  }, []);

  useEffect(() => {
    if (elementRef.current && chart) {
      elementRef.current.innerHTML = chart;
      mermaid.init(undefined, elementRef.current);
    }
  }, [chart]);

  return (
    <div 
      ref={elementRef} 
      className={`mermaid ${className}`}
      style={{ backgroundColor: 'transparent' }}
    />
  );
};

export const generateWorkflowMermaid = (workflow: any): string => {
  if (!workflow?.nodes) return '';

  let mermaidCode = 'graph TD\n';
  
  // Add nodes
  workflow.nodes.forEach((node: any) => {
    const nodeId = node.name.replace(/\s+/g, '_');
    const nodeType = node.type.split('.').pop() || 'node';
    const emoji = getNodeEmoji(nodeType);
    
    mermaidCode += `  ${nodeId}["${emoji} ${node.name}"]\n`;
  });

  // Add connections
  if (workflow.connections) {
    Object.entries(workflow.connections).forEach(([sourceNode, connections]: [string, any]) => {
      const sourceId = sourceNode.replace(/\s+/g, '_');
      
      if (connections.main && connections.main[0]) {
        connections.main[0].forEach((connection: any) => {
          const targetId = connection.node.replace(/\s+/g, '_');
          mermaidCode += `  ${sourceId} --> ${targetId}\n`;
        });
      }
    });
  }

  // Add styling
  mermaidCode += `
  classDef default fill:#1f2937,stroke:#8b5cf6,stroke-width:2px,color:#ffffff
  classDef trigger fill:#059669,stroke:#10b981,stroke-width:2px,color:#ffffff
  classDef action fill:#0369a1,stroke:#0ea5e9,stroke-width:2px,color:#ffffff
  `;

  return mermaidCode;
};

const getNodeEmoji = (nodeType: string): string => {
  const emojiMap: { [key: string]: string } = {
    manualTrigger: '▶️',
    webhook: '🔗',
    httpRequest: '🌐',
    gmail: '📧',
    slack: '💬',
    airtable: '📊',
    typeform: '📝',
    set: '⚙️',
    if: '🔀',
    function: '⚡',
    default: '📦'
  };
  
  return emojiMap[nodeType] || emojiMap.default;
};
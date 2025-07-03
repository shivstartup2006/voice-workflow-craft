import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: string;
  author: string;
  downloads: number;
  rating: number;
  apps: string[];
}

const Explore: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', emoji: '🌟' },
    { id: 'marketing', name: 'Marketing', emoji: '📢' },
    { id: 'sales', name: 'Sales', emoji: '💰' },
    { id: 'productivity', name: 'Productivity', emoji: '⚡' },
    { id: 'ecommerce', name: 'E-commerce', emoji: '🛒' },
    { id: 'social', name: 'Social Media', emoji: '📱' },
  ];

  const mockWorkflows: WorkflowTemplate[] = [
    {
      id: '1',
      name: 'Typeform to Airtable & WhatsApp',
      description: 'Automatically add form submissions to Airtable and send WhatsApp notifications',
      emoji: '📝',
      category: 'marketing',
      author: 'Sarah Chen',
      downloads: 1234,
      rating: 4.8,
      apps: ['Typeform', 'Airtable', 'WhatsApp']
    },
    {
      id: '2',
      name: 'E-commerce Order Processing',
      description: 'Process new orders, update inventory, and send customer notifications',
      emoji: '🛒',
      category: 'ecommerce',
      author: 'Mike Johnson',
      downloads: 987,
      rating: 4.9,
      apps: ['Shopify', 'Slack', 'Gmail']
    },
    {
      id: '3',
      name: 'Social Media Auto-Poster',
      description: 'Cross-post content to multiple social media platforms automatically',
      emoji: '📱',
      category: 'social',
      author: 'Alex Rivera',
      downloads: 2156,
      rating: 4.7,
      apps: ['Twitter', 'LinkedIn', 'Facebook']
    },
    {
      id: '4',
      name: 'Lead Scoring & CRM Sync',
      description: 'Score leads based on behavior and sync with your CRM automatically',
      emoji: '🎯',
      category: 'sales',
      author: 'Emma Davis',
      downloads: 743,
      rating: 4.6,
      apps: ['HubSpot', 'Google Analytics', 'Slack']
    },
    {
      id: '5',
      name: 'Invoice & Payment Automation',
      description: 'Generate invoices and track payments with Razorpay integration',
      emoji: '💰',
      category: 'sales',
      author: 'Raj Patel',
      downloads: 1456,
      rating: 4.8,
      apps: ['Razorpay', 'Google Sheets', 'Gmail']
    },
    {
      id: '6',
      name: 'Content Publishing Pipeline',
      description: 'Automate blog publishing workflow from draft to social media',
      emoji: '📚',
      category: 'marketing',
      author: 'Lisa Wang',
      downloads: 892,
      rating: 4.5,
      apps: ['WordPress', 'Buffer', 'Analytics']
    }
  ];

  const filteredWorkflows = mockWorkflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || workflow.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = (workflowId: string) => {
    navigate(`/create?template=${workflowId}`);
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
                🌍 Explore Workflows
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover and use automation workflows created by our community
              </p>
            </div>
          </ScrollReveal>

          {/* Search and Filters */}
          <ScrollReveal delay={200}>
            <Card className="glass-card p-6">
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="🔍 Search workflows..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="text-base"
                    />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? 'gradient' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className="gap-2"
                    >
                      <span>{category.emoji}</span>
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          </ScrollReveal>

          {/* Stats */}
          <ScrollReveal delay={300}>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { label: 'Total Workflows', value: '2,456', emoji: '⚡' },
                { label: 'Active Users', value: '12.3K', emoji: '👥' },
                { label: 'Apps Connected', value: '400+', emoji: '🔗' },
                { label: 'Automations Run', value: '1.2M', emoji: '🚀' }
              ].map((stat, index) => (
                <Card key={index} className="glass-card p-4 text-center">
                  <div className="text-2xl mb-2">{stat.emoji}</div>
                  <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              ))}
            </div>
          </ScrollReveal>

          {/* Workflow Grid */}
          <ScrollReveal delay={400}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkflows.map((workflow, index) => (
                <ScrollReveal key={workflow.id} delay={index * 100}>
                  <Card className="workflow-node p-6 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-3xl">{workflow.emoji}</div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <span>⭐</span>
                        {workflow.rating}
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2">{workflow.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-1">
                      {workflow.description}
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-1">
                        {workflow.apps.map((app) => (
                          <span key={app} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {app}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>👤 {workflow.author}</span>
                        <span>📥 {workflow.downloads.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                        >
                          👁️ Preview
                        </Button>
                        <Button 
                          variant="gradient" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleUseTemplate(workflow.id)}
                        >
                          🚀 Use Template
                        </Button>
                      </div>
                    </div>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </ScrollReveal>

          {/* No Results */}
          {filteredWorkflows.length === 0 && (
            <ScrollReveal>
              <Card className="glass-card p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No workflows found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or browse different categories
                </p>
                <Button variant="gradient" onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}>
                  🔄 Reset Filters
                </Button>
              </Card>
            </ScrollReveal>
          )}

          {/* CTA Section */}
          <ScrollReveal delay={600}>
            <Card className="glass-card p-8 text-center bg-gradient-card">
              <div className="space-y-4">
                <div className="text-4xl">✨</div>
                <h3 className="text-2xl font-bold gradient-text">
                  Create Your Own Workflow
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Don't see what you need? Create a custom automation workflow with our AI-powered builder
                </p>
                <Button 
                  variant="gradient" 
                  size="lg"
                  onClick={() => navigate('/create')}
                  className="px-8"
                >
                  🎤 Start Creating
                </Button>
              </div>
            </Card>
          </ScrollReveal>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Explore;
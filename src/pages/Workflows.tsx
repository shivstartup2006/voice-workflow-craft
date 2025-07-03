import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface UserWorkflow {
  id: string;
  name: string;
  description: string;
  emoji: string;
  status: 'active' | 'paused' | 'draft';
  lastRun: string;
  totalRuns: number;
  createdAt: string;
}

const Workflows: React.FC = () => {
  const navigate = useNavigate();
  const [workflows] = useState<UserWorkflow[]>([
    {
      id: '1',
      name: 'Razorpay to Invoice',
      description: 'Generate and send invoices automatically when payments are received',
      emoji: '💰',
      status: 'active',
      lastRun: '2 hours ago',
      totalRuns: 47,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Typeform to Airtable',
      description: 'Add form submissions to Airtable and send WhatsApp notifications',
      emoji: '📝',
      status: 'active',
      lastRun: '1 day ago',
      totalRuns: 123,
      createdAt: '2024-01-10'
    },
    {
      id: '3',
      name: 'Social Media Scheduler',
      description: 'Post to Twitter and LinkedIn when blog articles are published',
      emoji: '📱',
      status: 'paused',
      lastRun: '1 week ago',
      totalRuns: 28,
      createdAt: '2024-01-05'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'draft': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'active': return '✅';
      case 'paused': return '⏸️';
      case 'draft': return '📝';
      default: return '❓';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl space-y-8">
          {/* Header */}
          <ScrollReveal>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold gradient-text">
                  ⚡ My Workflows
                </h1>
                <p className="text-lg text-muted-foreground mt-2">
                  Manage and monitor your automation workflows
                </p>
              </div>
              <Button 
                variant="gradient" 
                size="lg"
                onClick={() => navigate('/create')}
                className="gap-2"
              >
                ✨ Create New
              </Button>
            </div>
          </ScrollReveal>

          {/* Quick Stats */}
          <ScrollReveal delay={200}>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { label: 'Active Workflows', value: '2', emoji: '⚡', color: 'text-green-500' },
                { label: 'Total Runs', value: '198', emoji: '🚀', color: 'text-blue-500' },
                { label: 'This Month', value: '47', emoji: '📈', color: 'text-purple-500' },
                { label: 'Time Saved', value: '12h', emoji: '⏰', color: 'text-orange-500' }
              ].map((stat, index) => (
                <Card key={index} className="glass-card p-4 text-center">
                  <div className="text-2xl mb-2">{stat.emoji}</div>
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              ))}
            </div>
          </ScrollReveal>

          {/* Workflows List */}
          <ScrollReveal delay={400}>
            <div className="space-y-4">
              {workflows.map((workflow, index) => (
                <ScrollReveal key={workflow.id} delay={index * 100}>
                  <Card className="workflow-node p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{workflow.emoji}</div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold">{workflow.name}</h3>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(workflow.status)}`}></div>
                              <span className="text-sm capitalize text-muted-foreground">
                                {getStatusEmoji(workflow.status)} {workflow.status}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {workflow.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>📅 Created {workflow.createdAt}</span>
                            <span>🏃 {workflow.totalRuns} total runs</span>
                            <span>⏰ Last run {workflow.lastRun}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          📊 Analytics
                        </Button>
                        <Button variant="outline" size="sm">
                          ✏️ Edit
                        </Button>
                        <Button 
                          variant={workflow.status === 'active' ? 'destructive' : 'gradient'} 
                          size="sm"
                        >
                          {workflow.status === 'active' ? '⏸️ Pause' : '▶️ Start'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </ScrollReveal>

          {/* Empty State */}
          {workflows.length === 0 && (
            <ScrollReveal>
              <Card className="glass-card p-12 text-center">
                <div className="text-6xl mb-4">🤖</div>
                <h3 className="text-xl font-semibold mb-2">No workflows yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first automation workflow to get started
                </p>
                <Button 
                  variant="gradient" 
                  size="lg"
                  onClick={() => navigate('/create')}
                >
                  🎤 Create Your First Workflow
                </Button>
              </Card>
            </ScrollReveal>
          )}

          {/* Recent Activity */}
          <ScrollReveal delay={600}>
            <Card className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-4">📈 Recent Activity</h3>
              <div className="space-y-3">
                {[
                  { time: '2 hours ago', action: 'Razorpay workflow executed successfully', status: 'success' },
                  { time: '5 hours ago', action: 'Typeform webhook received new submission', status: 'info' },
                  { time: '1 day ago', action: 'Social Media workflow paused by user', status: 'warning' },
                  { time: '2 days ago', action: 'New workflow "Email Marketing" created', status: 'success' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <div className="text-lg">
                      {activity.status === 'success' && '✅'}
                      {activity.status === 'info' && 'ℹ️'}
                      {activity.status === 'warning' && '⚠️'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </ScrollReveal>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Workflows;
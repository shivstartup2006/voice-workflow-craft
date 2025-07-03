import React, { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import heroImage from '@/assets/hero-automation.jpg';

const Index = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      emoji: "🎤",
      title: "Voice-First Design",
      description: "Speak naturally to create complex automations. No technical knowledge required."
    },
    {
      emoji: "🤖",
      title: "AI-Powered Intelligence",
      description: "Advanced AI understands context and creates perfect workflows from your descriptions."
    },
    {
      emoji: "🔗",
      title: "400+ Integrations",
      description: "Connect with all your favorite tools: Razorpay, Typeform, WhatsApp, Airtable, and more."
    },
    {
      emoji: "⚡",
      title: "Instant Deployment",
      description: "Your automations go live immediately with cloud hosting and real-time monitoring."
    },
    {
      emoji: "🌍",
      title: "Collaborative Workflows",
      description: "Share and edit workflows with your team. Build upon community templates."
    },
    {
      emoji: "🚀",
      title: "Scale Infinitely",
      description: "From simple tasks to complex enterprise workflows. Built for growth."
    }
  ];

  const useCases = [
    {
      title: "💰 Payment to Invoice",
      description: "\"When I receive a payment on Razorpay, generate an invoice and email it to the customer\"",
      time: "2 minutes to setup"
    },
    {
      title: "📝 Form to CRM",
      description: "\"Add Typeform submissions to Airtable and send a WhatsApp notification\"",
      time: "1 minute to setup"
    },
    {
      title: "📧 Email Marketing",
      description: "\"Send welcome emails to new subscribers and add them to my marketing list\"",
      time: "3 minutes to setup"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Animated background elements */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(124, 101, 161, 0.3) 0%, transparent 50%)`
        }}
      />
      
      <Navigation />
      
      <main className="pt-24 pb-12 px-4 relative">
        <div className="container mx-auto max-w-6xl space-y-16">
          {/* Hero Section */}
          <section className="text-center space-y-8">
            <ScrollReveal>
              <div className="inline-block p-4 bg-white/10 rounded-full mb-6 float">
                <span className="text-6xl">⚡</span>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={200}>
              <h1 className="text-5xl md:text-7xl font-bold gradient-text leading-tight">
                Speak. Automate.<br />
                <span className="text-4xl md:text-6xl">Transform Your Work.</span>
              </h1>
            </ScrollReveal>
            
            <ScrollReveal delay={400}>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Transform your ideas into powerful automated workflows using just your voice. 
                No coding, no complexity—just speak and watch magic happen.
              </p>
            </ScrollReveal>
            
            <ScrollReveal delay={600}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  variant="gradient" 
                  size="lg" 
                  className="px-8 py-6 text-lg"
                  onClick={() => navigate('/create')}
                >
                  🎤 Start Speaking
                </Button>
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="px-8 py-6 text-lg"
                  onClick={() => navigate('/explore')}
                >
                  🌍 Explore Templates
                </Button>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={800}>
              <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span>✅</span>
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>⚡</span>
                  <span>Setup in seconds</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🔒</span>
                  <span>Enterprise secure</span>
                </div>
              </div>
            </ScrollReveal>
          </section>

          {/* Live Demo Section */}
          <ScrollReveal delay={1000}>
            <section className="relative">
              <Card className="glass-card p-8 text-center max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 gradient-text">
                  🎯 See It In Action
                </h2>
                
                <div className="bg-black/20 rounded-lg p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-muted-foreground ml-2">VeloKinetiq Demo</span>
                  </div>
                  
                  <div className="text-left space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="text-primary">👤</span>
                      <div className="bg-primary/10 rounded-lg p-3 max-w-md">
                        <p className="text-sm">"When I get a payment on Razorpay, send me a WhatsApp message and add the customer to my Airtable"</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 justify-end">
                      <div className="bg-green-500/10 rounded-lg p-3 max-w-md">
                        <p className="text-sm">🤖 Perfect! I've created a 3-step automation:</p>
                        <div className="mt-2 space-y-1 text-xs">
                          <div className="flex items-center gap-2">
                            <span>💰</span>
                            <span>Razorpay Payment Trigger</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>💬</span>
                            <span>WhatsApp Notification</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>📊</span>
                            <span>Airtable Customer Record</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-green-500">🤖</span>
                    </div>
                  </div>
                </div>
                
                <Button variant="gradient" onClick={() => navigate('/create')}>
                  🚀 Try It Yourself
                </Button>
              </Card>
            </section>
          </ScrollReveal>

          {/* Use Cases */}
          <section className="space-y-8">
            <ScrollReveal>
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
                  💡 Popular Use Cases
                </h2>
                <p className="text-lg text-muted-foreground">
                  See how others are automating their workflows
                </p>
              </div>
            </ScrollReveal>
            
            <div className="grid md:grid-cols-3 gap-6">
              {useCases.map((useCase, index) => (
                <ScrollReveal key={index} delay={index * 200}>
                  <Card className="workflow-node p-6 h-full">
                    <h3 className="font-semibold text-lg mb-3">{useCase.title}</h3>
                    <p className="text-muted-foreground mb-4 italic text-sm">
                      {useCase.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-green-600 font-medium">
                        ⚡ {useCase.time}
                      </span>
                      <Button variant="outline" size="sm">
                        📋 Use Template
                      </Button>
                    </div>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </section>

          {/* Features Grid */}
          <section className="space-y-8">
            <ScrollReveal>
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
                  🚀 Why VeloKinetiq?
                </h2>
                <p className="text-lg text-muted-foreground">
                  The future of automation is here
                </p>
              </div>
            </ScrollReveal>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <ScrollReveal key={index} delay={index * 150} direction={index % 2 === 0 ? 'left' : 'right'}>
                  <Card className="workflow-node p-6 h-full text-center">
                    <div className="text-4xl mb-4">{feature.emoji}</div>
                    <h3 className="font-semibold text-lg mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </section>

          {/* Stats Section */}
          <ScrollReveal>
            <section className="text-center space-y-8">
              <h2 className="text-3xl font-bold gradient-text">
                📊 Trusted by Automation Enthusiasts
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { value: '10K+', label: 'Active Users', emoji: '👥' },
                  { value: '50K+', label: 'Workflows Created', emoji: '⚡' },
                  { value: '1M+', label: 'Tasks Automated', emoji: '🚀' },
                  { value: '99.9%', label: 'Uptime', emoji: '💪' }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl mb-2">{stat.emoji}</div>
                    <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>

          {/* CTA Section */}
          <ScrollReveal>
            <section className="text-center space-y-6">
              <Card className="glass-card p-12 bg-gradient-card">
                <div className="space-y-6">
                  <div className="text-5xl float">✨</div>
                  <h2 className="text-3xl md:text-4xl font-bold gradient-text">
                    Ready to Transform Your Workflow?
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Join thousands of professionals who have automated their repetitive tasks. 
                    Start speaking your automations into existence today.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      variant="gradient" 
                      size="lg" 
                      className="px-12 py-6 text-lg"
                      onClick={() => navigate('/create')}
                    >
                      🎤 Start Free Today
                    </Button>
                    <Button 
                      variant="hero" 
                      size="lg" 
                      className="px-12 py-6 text-lg"
                      onClick={() => navigate('/explore')}
                    >
                      📚 View Documentation
                    </Button>
                  </div>
                </div>
              </Card>
            </section>
          </ScrollReveal>

          {/* Hero Visual */}
          <ScrollReveal delay={1200}>
            <section className="relative">
              <div className="max-w-4xl mx-auto">
                <div className="relative overflow-hidden rounded-2xl glass-card p-2">
                  <img 
                    src={heroImage} 
                    alt="Voice-driven automation platform" 
                    className="w-full h-auto rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-overlay rounded-xl"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="glass-card p-4 text-center">
                      <p className="text-sm font-medium text-white">
                        🎤 "Send an invoice when I receive a payment on Razorpay"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </ScrollReveal>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
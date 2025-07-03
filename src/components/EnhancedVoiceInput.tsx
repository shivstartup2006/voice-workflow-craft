import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface EnhancedVoiceInputProps {
  onPromptSubmit: (prompt: string) => void;
  isProcessing?: boolean;
}

export const EnhancedVoiceInput: React.FC<EnhancedVoiceInputProps> = ({ 
  onPromptSubmit, 
  isProcessing = false 
}) => {
  const [prompt, setPrompt] = useState('');
  const [emotion, setEmotion] = useState<'neutral' | 'excited' | 'focused' | 'confident'>('neutral');
  const [confidence, setConfidence] = useState(0);
  const [isListening, setIsListening] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setPrompt(transcript);
      analyzeEmotion(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    setIsListening(listening);
  }, [listening]);

  const analyzeEmotion = (text: string) => {
    const excitedWords = ['awesome', 'amazing', 'excited', 'love', 'fantastic', 'great'];
    const focusedWords = ['need', 'want', 'create', 'build', 'implement', 'develop'];
    const confidentWords = ['will', 'can', 'should', 'must', 'definitely', 'absolutely'];

    const words = text.toLowerCase().split(' ');
    
    let excitedScore = 0;
    let focusedScore = 0;
    let confidentScore = 0;

    words.forEach(word => {
      if (excitedWords.includes(word)) excitedScore++;
      if (focusedWords.includes(word)) focusedScore++;
      if (confidentWords.includes(word)) confidentScore++;
    });

    const maxScore = Math.max(excitedScore, focusedScore, confidentScore);
    
    if (maxScore === 0) {
      setEmotion('neutral');
      setConfidence(50);
    } else if (excitedScore === maxScore) {
      setEmotion('excited');
      setConfidence(Math.min(90, 60 + excitedScore * 10));
    } else if (focusedScore === maxScore) {
      setEmotion('focused');
      setConfidence(Math.min(85, 55 + focusedScore * 10));
    } else {
      setEmotion('confident');
      setConfidence(Math.min(95, 65 + confidentScore * 10));
    }
  };

  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const handleSubmit = () => {
    if (prompt.trim()) {
      onPromptSubmit(prompt.trim());
      setPrompt('');
      resetTranscript();
      setEmotion('neutral');
      setConfidence(0);
    }
  };

  const getEmotionEmoji = () => {
    switch (emotion) {
      case 'excited': return '🤩';
      case 'focused': return '🎯';
      case 'confident': return '😎';
      default: return '🤖';
    }
  };

  const getEmotionColor = () => {
    switch (emotion) {
      case 'excited': return 'text-yellow-400';
      case 'focused': return 'text-blue-400';
      case 'confident': return 'text-green-400';
      default: return 'text-muted-foreground';
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <Card className="glass-card p-6 w-full max-w-2xl mx-auto">
        <div className="text-center">
          <h2 className="text-2xl font-bold gradient-text mb-2">
            🎤 Voice Command Center
          </h2>
          <p className="text-muted-foreground mb-4">
            Your browser doesn't support speech recognition. Please use text input.
          </p>
          
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your automation idea here..."
            className="min-h-[120px] resize-none text-base mb-4"
            disabled={isProcessing}
          />
          
          <Button
            onClick={handleSubmit}
            variant="magic"
            size="lg"
            disabled={!prompt.trim() || isProcessing}
            className="px-8"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ✨ Creating Magic...
              </>
            ) : (
              '🚀 Generate Workflow'
            )}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass-card p-6 w-full max-w-2xl mx-auto">
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold gradient-text mb-2">
            🎤 Enhanced Voice Command Center
          </h2>
          <p className="text-muted-foreground">
            Speak or type your automation idea with emotional intelligence
          </p>
        </div>

        {/* Emotion and Confidence Display */}
        {(isListening || confidence > 0) && (
          <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getEmotionEmoji()}</span>
                <span className={`font-medium ${getEmotionColor()}`}>
                  {emotion.charAt(0).toUpperCase() + emotion.slice(1)} Tone Detected
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {confidence}% confidence
              </span>
            </div>
            <Progress value={confidence} className="h-2" />
          </div>
        )}

        <div className="relative">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., 'I want to automatically send a welcome email when someone signs up and add them to my CRM'"
            className="min-h-[120px] resize-none text-base"
            disabled={isProcessing}
          />
          
          {isListening && (
            <div className="absolute top-2 right-2">
              <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-primary font-medium">Listening...</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-4">
          {!isListening ? (
            <Button
              onClick={startListening}
              variant="voice"
              size="lg"
              disabled={isProcessing}
              className="px-8"
            >
              🎙️ Start Voice Input
            </Button>
          ) : (
            <Button
              onClick={stopListening}
              variant="destructive"
              size="lg"
              className="px-8"
            >
              ⏹️ Stop Listening
            </Button>
          )}

          <Button
            onClick={handleSubmit}
            variant="magic"
            size="lg"
            disabled={!prompt.trim() || isProcessing}
            className="px-8"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ✨ Creating Magic...
              </>
            ) : (
              '🚀 Generate Workflow'
            )}
          </Button>
        </div>

        {/* Advanced Features */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPrompt("Send me a Slack notification when someone fills out my contact form")}
            className="text-left p-2 h-auto"
          >
            <div>
              <div className="font-medium text-sm">💬 Slack Integration</div>
              <div className="text-xs text-muted-foreground">Form → Slack notification</div>
            </div>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPrompt("Create a customer onboarding sequence with email automation")}
            className="text-left p-2 h-auto"
          >
            <div>
              <div className="font-medium text-sm">📧 Email Automation</div>
              <div className="text-xs text-muted-foreground">Customer onboarding flow</div>
            </div>
          </Button>
        </div>

        {transcript && (
          <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <h4 className="font-medium text-primary mb-2 flex items-center gap-2">
              🎯 Live Transcript:
              <span className={`text-xs ${getEmotionColor()}`}>
                ({emotion} tone)
              </span>
            </h4>
            <p className="text-sm text-muted-foreground">{transcript}</p>
          </div>
        )}
      </div>
    </Card>
  );
};
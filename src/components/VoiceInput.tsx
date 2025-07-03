import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

// Extend the Window interface to include speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface VoiceInputProps {
  onPromptSubmit: (prompt: string) => void;
  isProcessing?: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onPromptSubmit, isProcessing = false }) => {
  const [prompt, setPrompt] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript + interimTranscript);
        setPrompt(finalTranscript + interimTranscript);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const handleSubmit = () => {
    if (prompt.trim()) {
      onPromptSubmit(prompt.trim());
      setPrompt('');
      setTranscript('');
    }
  };

  return (
    <Card className="glass-card p-6 w-full max-w-2xl mx-auto">
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold gradient-text mb-2">
            🎤 Voice Command Center
          </h2>
          <p className="text-muted-foreground">
            Speak or type your automation idea
          </p>
        </div>

        <div className="relative">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., 'When I get a form submission on Typeform, send me a WhatsApp message and add the contact to Airtable'"
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

        {transcript && (
          <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <h4 className="font-medium text-primary mb-2">🎯 Voice Transcript:</h4>
            <p className="text-sm text-muted-foreground">{transcript}</p>
          </div>
        )}
      </div>
    </Card>
  );
};
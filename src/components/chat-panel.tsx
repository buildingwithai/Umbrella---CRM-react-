import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Mic, Square, Loader2 } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

export function ChatPanel() {
  const [isCalling, setIsCalling] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextPlayTimeRef = useRef<number>(0);

  const startCall = async () => {
    setIsConnecting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const context = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = context;
      nextPlayTimeRef.current = context.currentTime;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsCalling(true);
            
            const source = context.createMediaStreamSource(stream);
            const processor = context.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;
            
            source.connect(processor);
            processor.connect(context.destination);
            
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcm16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                let s = Math.max(-1, Math.min(1, inputData[i]));
                pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
              }
              const base64 = btoa(String.fromCharCode(...new Uint8Array(pcm16.buffer)));
              sessionPromise.then(session => {
                session.sendRealtimeInput({ audio: { data: base64, mimeType: 'audio/pcm;rate=16000' } });
              });
            };
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
              const ctx = audioContextRef.current;
              const binaryString = atob(base64Audio);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              const pcm16 = new Int16Array(bytes.buffer);
              const float32 = new Float32Array(pcm16.length);
              for (let i = 0; i < pcm16.length; i++) {
                float32[i] = pcm16[i] / (pcm16[i] < 0 ? 0x8000 : 0x7FFF);
              }
              
              const buffer = ctx.createBuffer(1, float32.length, 24000);
              buffer.getChannelData(0).set(float32);
              
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              
              if (nextPlayTimeRef.current < ctx.currentTime) {
                nextPlayTimeRef.current = ctx.currentTime;
              }
              source.start(nextPlayTimeRef.current);
              nextPlayTimeRef.current += buffer.duration;
            }
            
            if (message.serverContent?.interrupted) {
              if (audioContextRef.current) {
                nextPlayTimeRef.current = audioContextRef.current.currentTime;
              }
            }
          },
          onclose: () => {
            endCall();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } }
          },
          systemInstruction: "You are Umbrella, a helpful AI assistant in a workspace environment. Keep your answers concise and conversational."
        }
      });
    } catch (err) {
      console.error("Failed to start call:", err);
      setIsConnecting(false);
      endCall();
    }
  };

  const endCall = () => {
    setIsCalling(false);
    setIsConnecting(false);
    
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  useEffect(() => {
    return () => endCall();
  }, []);

  return (
    <div className="w-80 flex flex-col bg-zinc-950 border-l border-zinc-800 flex-shrink-0">
      <div className="h-12 flex items-center px-4 border-b border-zinc-800 font-medium text-sm">
        AI Assistant
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        <ChatMessage role="assistant" content="Hello! I'm your Umbrella assistant. How can I help you with your workspace today?" />
        <ChatMessage role="user" content="Can you help me draft an email to a new contact?" />
        <ChatMessage role="assistant" content="Absolutely. Please open the Contacts table and select the person you'd like to email, or just tell me their name and some context." />
      </div>
      
      <div className="p-4 border-t border-zinc-800">
        <div className="relative flex items-end gap-2">
          <textarea 
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 resize-none min-h-[40px] max-h-[120px]"
            placeholder="Ask anything..."
            rows={1}
          />
          <div className="flex flex-col gap-2">
            <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors flex items-center justify-center shadow-sm">
              <Send size={16} />
            </button>
            <button 
              onClick={isCalling || isConnecting ? endCall : startCall}
              className={`p-2 rounded-lg transition-colors flex items-center justify-center shadow-sm ${
                isCalling 
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                  : isConnecting 
                    ? 'bg-zinc-800 text-blue-400' 
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
              title={isCalling ? "End Voice Call" : "Start Voice Call"}
            >
              {isConnecting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : isCalling ? (
                <Square size={16} className="fill-current" />
              ) : (
                <Mic size={16} />
              )}
            </button>
          </div>
        </div>
        {(isCalling || isConnecting) && (
          <div className="mt-3 flex items-center gap-2 text-xs text-blue-400 bg-blue-950/30 p-2 rounded-md border border-blue-900/50">
            <div className={`w-2 h-2 rounded-full ${isCalling ? 'bg-blue-500 animate-pulse' : 'bg-blue-500/50'}`} />
            {isConnecting ? 'Connecting to Umbrella Voice...' : 'Umbrella Voice is listening...'}
          </div>
        )}
      </div>
    </div>
  );
}

function ChatMessage({ role, content }: { role: 'user' | 'assistant', content: string }) {
  const isUser = role === 'user';
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser ? 'bg-zinc-800' : 'bg-blue-900/50 text-blue-400'}`}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <span className="text-xs text-zinc-500 mb-1">{isUser ? 'You' : 'Umbrella AI'}</span>
        <div className={`px-3 py-2 rounded-lg text-sm ${isUser ? 'bg-zinc-800 text-zinc-100' : 'bg-zinc-900 border border-zinc-800 text-zinc-300'}`}>
          {content}
        </div>
      </div>
    </div>
  );
}

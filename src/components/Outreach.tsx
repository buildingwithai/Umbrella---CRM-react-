import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Textarea, Badge } from './ui';
import { Send, Sparkles, Copy, CheckCircle2, Mail } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export function Outreach({ initialContactId }: { initialContactId?: string }) {
  const { contacts, addCampaign } = useAppStore();
  const [selectedContactId, setSelectedContactId] = useState<string>(initialContactId || '');
  const [prompt, setPrompt] = useState('');
  const [draft, setDraft] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedContact = contacts.find(c => c.id === selectedContactId);

  const handleGenerate = async () => {
    if (!selectedContact) return;
    setIsGenerating(true);
    setDraft('');
    
    try {
      const systemInstruction = `You are an expert sales outreach agent. Your goal is to write highly personalized, concise, and compelling cold emails.
      Contact Info:
      Name: ${selectedContact.name}
      Role: ${selectedContact.role}
      Company: ${selectedContact.company}
      Notes: ${selectedContact.notes}
      
      Keep the email under 150 words. Focus on value proposition. Do not include subject line in the output, just the body.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-preview",
        contents: prompt || "Write a standard introductory email pitching our AI automation services.",
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const generatedText = response.text || '';
      setDraft(generatedText);
      
      addCampaign({
        contactId: selectedContact.id,
        prompt: prompt || "Standard intro",
        draft: generatedText,
        status: 'Draft'
      });
      
    } catch (error) {
      console.error("Failed to generate email:", error);
      setDraft("Error generating email. Please check your API key and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">AI Outreach Agent</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Target Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Contact</label>
                <select 
                  className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950"
                  value={selectedContactId}
                  onChange={(e) => setSelectedContactId(e.target.value)}
                >
                  <option value="" disabled>Select a contact...</option>
                  {contacts.map(c => (
                    <option key={c.id} value={c.id}>{c.name} - {c.company}</option>
                  ))}
                </select>
              </div>

              {selectedContact && (
                <div className="rounded-lg bg-gray-50 p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Role:</span>
                    <span className="font-medium">{selectedContact.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Company:</span>
                    <span className="font-medium">{selectedContact.company}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <Badge variant="secondary">{selectedContact.status}</Badge>
                  </div>
                  {selectedContact.notes && (
                    <div className="pt-2 border-t mt-2">
                      <span className="text-gray-500 block mb-1">Notes:</span>
                      <p className="text-gray-700 italic">"{selectedContact.notes}"</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Campaign Context</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Instructions for AI</label>
                <Textarea 
                  placeholder="E.g., Mention our new product launch and ask for a 15 min call next Tuesday."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
              <Button 
                className="w-full" 
                onClick={handleGenerate} 
                disabled={!selectedContact || isGenerating}
              >
                {isGenerating ? (
                  <span className="flex items-center"><Sparkles className="mr-2 h-4 w-4 animate-pulse" /> Drafting...</span>
                ) : (
                  <span className="flex items-center"><Sparkles className="mr-2 h-4 w-4" /> Generate Draft</span>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-8">
          <Card className="h-full min-h-[500px] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <CardTitle>Email Draft</CardTitle>
              {draft && (
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  {copied ? <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> : <Copy className="mr-2 h-4 w-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              )}
            </CardHeader>
            <CardContent className="flex-1 p-0">
              {draft ? (
                <Textarea 
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  className="h-full min-h-[400px] w-full resize-none border-0 p-6 focus-visible:ring-0 text-base leading-relaxed"
                />
              ) : (
                <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-gray-400 space-y-4">
                  <Mail className="h-12 w-12 opacity-20" />
                  <p>Select a contact and generate a draft to see it here.</p>
                </div>
              )}
            </CardContent>
            {draft && (
              <div className="p-4 border-t bg-gray-50 flex justify-end">
                <Button>
                  <Send className="mr-2 h-4 w-4" /> Open in Email Client
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../../lib/workspace-context';
import { Bot, Save, Check } from 'lucide-react';

export function AgentViewer({ agentId }: { agentId: string }) {
  const { agents, updateAgent } = useWorkspace();
  const agent = agents.find(a => a.id === agentId);
  
  const [name, setName] = useState(agent?.name || '');
  const [role, setRole] = useState(agent?.role || '');
  const [instructions, setInstructions] = useState(agent?.instructions || '');
  const [isSaved, setIsSaved] = useState(true);

  useEffect(() => {
    if (agent) {
      setName(agent.name);
      setRole(agent.role);
      setInstructions(agent.instructions);
      setIsSaved(true);
    }
  }, [agentId, agent]);

  if (!agent) return null;

  const handleSave = () => {
    updateAgent(agent.id, { name, role, instructions });
    setIsSaved(true);
  };

  const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setter(e.target.value);
    setIsSaved(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-8 flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3 text-zinc-400 text-sm">
          <Bot size={24} className="text-purple-400" />
          <span>Dedicated AI Agent</span>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaved}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            isSaved 
              ? 'text-zinc-500 bg-transparent' 
              : 'bg-blue-600/10 text-blue-400 hover:bg-blue-600/20'
          }`}
        >
          {isSaved ? <Check size={14} /> : <Save size={14} />}
          {isSaved ? 'Saved' : 'Save Changes'}
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-8">
        <input 
          type="text"
          value={name}
          onChange={handleChange(setName)}
          className="bg-transparent text-4xl font-bold text-zinc-100 placeholder-zinc-700 outline-none w-full"
          placeholder="Agent Name"
        />
        
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Role / Title</label>
          <input 
            type="text" 
            value={role}
            onChange={handleChange(setRole)}
            className="bg-transparent text-xl text-zinc-300 placeholder-zinc-700 outline-none w-full border-b border-zinc-800 pb-2 focus:border-zinc-600 transition-colors"
            placeholder="e.g. Lead Generator"
          />
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <label className="text-sm font-medium text-zinc-500 uppercase tracking-wider">System Instructions</label>
          <textarea 
            value={instructions}
            onChange={handleChange(setInstructions)}
            className="flex-1 bg-transparent text-zinc-300 placeholder-zinc-700 outline-none w-full resize-none leading-relaxed"
            placeholder="You are a helpful assistant..."
          />
        </div>
      </div>
    </div>
  );
}

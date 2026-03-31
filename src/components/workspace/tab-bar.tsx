import React from 'react';
import { X, FileText, Code, Table, Bot } from 'lucide-react';
import { useWorkspace } from '../../lib/workspace-context';

export function TabBar() {
  const { files, agents, activeFileId, activeAgentId, setActiveFile, setActiveAgent } = useWorkspace();

  const activeFile = files.find(f => f.id === activeFileId);
  const activeAgent = agents.find(a => a.id === activeAgentId);

  return (
    <div className="h-10 flex items-center border-b border-zinc-800 bg-zinc-950 overflow-x-auto no-scrollbar">
      {activeFile && (
        <Tab 
          label={activeFile.title} 
          active={true} 
          type={activeFile.type}
          onClose={() => setActiveFile(null)} 
        />
      )}
      {activeAgent && (
        <Tab 
          label={activeAgent.name} 
          active={true} 
          type="agent"
          onClose={() => setActiveAgent(null)} 
        />
      )}
      {!activeFile && !activeAgent && (
        <div className="px-4 text-sm text-zinc-500">No active tabs</div>
      )}
    </div>
  );
}

function Tab({ label, active, type, onClose }: { label: string, active?: boolean, type?: string, onClose: () => void }) {
  const getIcon = () => {
    switch (type) {
      case 'markdown': return <FileText size={14} className="text-blue-400" />;
      case 'code': return <Code size={14} className="text-yellow-400" />;
      case 'spreadsheet': return <Table size={14} className="text-green-400" />;
      case 'agent': return <Bot size={14} className="text-purple-400" />;
      default: return <FileText size={14} />;
    }
  };

  return (
    <div className={`h-full flex items-center gap-2 px-4 border-r border-zinc-800 cursor-pointer min-w-[120px] max-w-[200px] group ${active ? 'bg-zinc-900/50 text-zinc-100' : 'text-zinc-500 hover:bg-zinc-900/30 hover:text-zinc-300'}`}>
      {getIcon()}
      <span className="truncate text-sm flex-1">{label}</span>
      <button 
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="opacity-0 group-hover:opacity-100 hover:bg-zinc-700 p-0.5 rounded transition-all"
      >
        <X size={14} />
      </button>
    </div>
  );
}

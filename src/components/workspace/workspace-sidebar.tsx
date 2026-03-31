import React from 'react';
import { ChevronDown, Plus, FileText, Code, Table, Bot, Trash2 } from 'lucide-react';
import { useWorkspace } from '../../lib/workspace-context';

export function WorkspaceSidebar() {
  const { files, agents, activeFileId, activeAgentId, setActiveFile, setActiveAgent, deleteFile, deleteAgent } = useWorkspace();

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'markdown': return <FileText size={14} className="text-blue-400" />;
      case 'code': return <Code size={14} className="text-yellow-400" />;
      case 'spreadsheet': return <Table size={14} className="text-green-400" />;
      default: return <FileText size={14} />;
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-zinc-950/50">
      <div className="h-12 flex items-center justify-between px-4 border-b border-zinc-800">
        <button className="flex items-center gap-2 font-medium text-sm hover:bg-zinc-800 px-2 py-1 rounded transition-colors">
          Personal Workspace
          <ChevronDown size={14} className="text-zinc-500" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-2">
        {/* Files Section */}
        <div className="px-4 py-2 flex items-center justify-between group">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Knowledge Base</span>
          <button className="text-zinc-500 hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">
            <Plus size={14} />
          </button>
        </div>
        <div className="flex flex-col gap-0.5 px-2 mb-4">
          {files.map(file => (
            <div 
              key={file.id}
              onClick={() => setActiveFile(file.id)}
              className={`flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer text-sm group ${
                activeFileId === file.id ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-300'
              }`}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                {getFileIcon(file.type)}
                <span className="truncate">{file.title}</span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); deleteFile(file.id); }}
                className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-opacity"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>

        {/* Agents Section */}
        <div className="px-4 py-2 flex items-center justify-between group">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Dedicated Agents</span>
          <button className="text-zinc-500 hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">
            <Plus size={14} />
          </button>
        </div>
        <div className="flex flex-col gap-0.5 px-2">
          {agents.map(agent => (
            <div 
              key={agent.id}
              onClick={() => setActiveAgent(agent.id)}
              className={`flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer text-sm group ${
                activeAgentId === agent.id ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-300'
              }`}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <Bot size={14} className="text-purple-400" />
                <span className="truncate">{agent.name}</span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); deleteAgent(agent.id); }}
                className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-opacity"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

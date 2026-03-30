import React from 'react';
import { FileManagerTree } from './file-manager-tree';
import { ChevronDown, Plus } from 'lucide-react';

export function WorkspaceSidebar() {
  return (
    <div className="w-64 flex flex-col border-r border-zinc-800 bg-zinc-950/50 flex-shrink-0">
      <div className="h-12 flex items-center justify-between px-4 border-b border-zinc-800">
        <button className="flex items-center gap-2 font-medium text-sm hover:bg-zinc-800 px-2 py-1 rounded transition-colors">
          Personal Workspace
          <ChevronDown size={14} className="text-zinc-500" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-2">
        <div className="px-4 py-2 flex items-center justify-between group">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Files</span>
          <button className="text-zinc-500 hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">
            <Plus size={14} />
          </button>
        </div>
        <FileManagerTree />
      </div>
    </div>
  );
}

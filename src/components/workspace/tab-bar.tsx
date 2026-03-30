import React from 'react';
import { X } from 'lucide-react';

export function TabBar() {
  return (
    <div className="h-10 flex items-center border-b border-zinc-800 bg-zinc-950 overflow-x-auto no-scrollbar">
      <Tab label="README.md" active />
      <Tab label="App.tsx" />
      <Tab label="Contacts" icon="database" />
    </div>
  );
}

function Tab({ label, active, icon }: { label: string, active?: boolean, icon?: string }) {
  return (
    <div className={`h-full flex items-center gap-2 px-4 border-r border-zinc-800 cursor-pointer min-w-[120px] max-w-[200px] group ${active ? 'bg-zinc-900/50 text-zinc-100' : 'text-zinc-500 hover:bg-zinc-900/30 hover:text-zinc-300'}`}>
      <span className="truncate text-sm flex-1">{label}</span>
      <button className="opacity-0 group-hover:opacity-100 hover:bg-zinc-700 p-0.5 rounded transition-all">
        <X size={14} />
      </button>
    </div>
  );
}

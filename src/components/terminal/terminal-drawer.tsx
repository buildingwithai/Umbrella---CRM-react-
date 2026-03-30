import React from 'react';
import { Terminal as TerminalIcon, X, ChevronUp } from 'lucide-react';

export function TerminalDrawer() {
  const [isOpen, setIsOpen] = React.useState(false);

  if (!isOpen) {
    return (
      <div 
        className="h-8 border-t border-zinc-800 bg-zinc-950 flex items-center px-4 cursor-pointer hover:bg-zinc-900 transition-colors text-zinc-400 text-xs gap-2"
        onClick={() => setIsOpen(true)}
      >
        <TerminalIcon size={14} />
        <span>Terminal</span>
        <ChevronUp size={14} className="ml-auto" />
      </div>
    );
  }

  return (
    <div className="h-64 border-t border-zinc-800 bg-zinc-950 flex flex-col">
      <div className="h-8 flex items-center justify-between px-4 border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-2 text-xs text-zinc-300">
          <TerminalIcon size={14} />
          <span>Terminal</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-zinc-300">
          <X size={14} />
        </button>
      </div>
      <div className="flex-1 p-2 font-mono text-xs text-zinc-300 overflow-y-auto">
        <div className="flex gap-2">
          <span className="text-blue-400">~/umbrella</span>
          <span className="text-zinc-500">$</span>
          <span>npm run dev</span>
        </div>
        <div className="text-zinc-400 mt-1">
          VITE v6.2.0  ready in 250 ms<br/><br/>
          ➜  Local:   http://localhost:3000/<br/>
          ➜  Network: use --host to expose<br/>
          ➜  press h to show help
        </div>
        <div className="flex gap-2 mt-2">
          <span className="text-blue-400">~/umbrella</span>
          <span className="text-zinc-500">$</span>
          <span className="animate-pulse">_</span>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { MessageSquare, FileText, Database, Settings, Terminal, Search, Umbrella } from 'lucide-react';

export function Sidebar() {
  return (
    <div className="w-14 flex flex-col items-center py-4 border-r border-zinc-800 bg-zinc-950 gap-4 flex-shrink-0">
      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mb-4 shadow-sm">
        <Umbrella size={18} className="text-white" />
      </div>
      
      <NavIcon icon={<FileText size={20} />} active />
      <NavIcon icon={<Search size={20} />} />
      <NavIcon icon={<Database size={20} />} />
      <NavIcon icon={<MessageSquare size={20} />} />
      
      <div className="mt-auto flex flex-col gap-4">
        <NavIcon icon={<Terminal size={20} />} />
        <NavIcon icon={<Settings size={20} />} />
      </div>
    </div>
  );
}

function NavIcon({ icon, active }: { icon: React.ReactNode; active?: boolean }) {
  return (
    <button className={`p-2 rounded-lg transition-colors ${active ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'}`}>
      {icon}
    </button>
  );
}

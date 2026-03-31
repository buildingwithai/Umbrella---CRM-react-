import React from 'react';
import { 
  Home, 
  Users, 
  MessageSquare, 
  Settings, 
  Search,
  Plus,
  Umbrella
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("w-16 h-full bg-zinc-950 border-r border-zinc-800 flex flex-col items-center py-4 gap-8 flex-shrink-0", className)}>
      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
        <Umbrella className="text-white" size={24} />
      </div>

      <div className="flex flex-col gap-4 w-full px-3">
        <NavItem icon={<Home size={20} />} active tooltip="Workspace" />
        <NavItem icon={<Users size={20} />} tooltip="CRM" />
        <NavItem icon={<MessageSquare size={20} />} tooltip="Outreach" />
        <NavItem icon={<Search size={20} />} tooltip="Search" />
      </div>

      <div className="mt-auto flex flex-col gap-4 w-full px-3">
        <NavItem icon={<Plus size={20} />} tooltip="New" />
        <NavItem icon={<Settings size={20} />} tooltip="Settings" />
      </div>
    </div>
  );
}

function NavItem({ icon, active, tooltip }: { icon: React.ReactNode; active?: boolean; tooltip: string }) {
  return (
    <button 
      className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group relative",
        active 
          ? "bg-zinc-800 text-white" 
          : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100"
      )}
    >
      {icon}
      
      {/* Tooltip */}
      <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-800 text-zinc-100 text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
        {tooltip}
      </div>
    </button>
  );
}

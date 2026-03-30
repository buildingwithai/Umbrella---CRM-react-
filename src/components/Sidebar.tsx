import React from 'react';
import { LayoutDashboard, Users, Mail, CheckSquare, Settings, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export function Sidebar({ currentView, onNavigate }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'outreach', label: 'AI Outreach', icon: Mail },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  ];

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-gray-50/40">
      <div className="flex h-14 items-center border-b px-6">
        <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <div className="h-6 w-6 rounded-md bg-blue-600 flex items-center justify-center text-white">
            <span className="text-xs">DC</span>
          </div>
          DenchClaw
        </div>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900",
                currentView === item.id ? "bg-gray-100 text-gray-900" : "text-gray-500"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="border-t p-4">
        <nav className="grid gap-1">
          <button className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900">
            <Settings className="h-4 w-4" />
            Settings
          </button>
          <button className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900">
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </nav>
      </div>
    </div>
  );
}

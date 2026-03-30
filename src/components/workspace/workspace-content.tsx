import React from 'react';
import { cn } from '../../lib/utils';
import { Sidebar } from '../sidebar';
import { WorkspaceSidebar } from './workspace-sidebar';
import { TabBar } from './tab-bar';
import { ChatPanel } from '../chat-panel';
import { TerminalDrawer } from '../terminal/terminal-drawer';

export function WorkspaceContent() {
  return (
    <div className="flex h-screen w-full bg-zinc-950 text-zinc-50 overflow-hidden font-sans">
      <Sidebar />
      <WorkspaceSidebar />
      
      <main className="flex-1 flex flex-col min-w-0 border-r border-zinc-800 relative">
        <TabBar />
        <div className="flex-1 overflow-auto bg-zinc-900/50 p-4">
          {/* Main Content Area - Editor/Table/etc */}
          <div className="max-w-4xl mx-auto py-8">
            <h1 className="text-3xl font-semibold tracking-tight mb-4">Welcome to Umbrella</h1>
            <p className="text-zinc-400">Select a file or object from the sidebar to begin.</p>
          </div>
        </div>
        <TerminalDrawer />
      </main>

      <ChatPanel />
    </div>
  );
}

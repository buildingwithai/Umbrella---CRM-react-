import React, { useRef } from 'react';
import { cn } from '../../lib/utils';
import { Sidebar } from '../sidebar';
import { WorkspaceSidebar } from './workspace-sidebar';
import { TabBar } from './tab-bar';
import { ChatPanel } from '../chat-panel';
import { TerminalDrawer } from '../terminal/terminal-drawer';
import { useWorkspace } from '../../lib/workspace-context';
import { FileViewer } from './file-viewer';
import { AgentViewer } from './agent-viewer';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import type { GroupImperativeHandle } from 'react-resizable-panels';

function ResizeHandle() {
  return (
    <PanelResizeHandle className="w-1 bg-zinc-800 hover:bg-blue-500/50 active:bg-blue-500 transition-colors cursor-col-resize flex flex-col justify-center items-center group z-10">
      <div className="h-8 w-0.5 bg-zinc-700 group-hover:bg-blue-400 rounded-full transition-colors" />
    </PanelResizeHandle>
  );
}

export function WorkspaceContent() {
  const { activeFileId, activeAgentId } = useWorkspace();
  const groupRef = useRef<GroupImperativeHandle>(null);

  const handleLayoutChange = (layout: Record<string, number>) => {
    // This is called continuously during resize
    // console.log('Layout changing:', layout);
  };

  const handleLayoutChanged = (layout: Record<string, number>) => {
    // This is called when the user finishes resizing
    console.log('Layout changed (drag ended):', layout);
    
    // You can also access the layout programmatically at any time:
    if (groupRef.current) {
      const currentLayout = groupRef.current.getLayout();
      console.log('Current layout from ref:', currentLayout);
    }
  };

  return (
    <div className="flex h-screen w-full bg-zinc-950 text-zinc-50 overflow-hidden font-sans">
      <Sidebar />
      
      <PanelGroup 
        groupRef={groupRef}
        orientation="horizontal" 
        className="flex-1"
        onLayoutChange={handleLayoutChange}
        onLayoutChanged={handleLayoutChanged}
      >
        <Panel id="sidebar" defaultSize={20} minSize={15} maxSize={30}>
          <WorkspaceSidebar />
        </Panel>
        
        <ResizeHandle />
        
        <Panel id="main" defaultSize={55} minSize={30}>
          <main className="h-full flex flex-col min-w-0 relative">
            <TabBar />
            <div className="flex-1 overflow-auto bg-zinc-950 flex flex-col">
              {activeFileId ? (
                <FileViewer fileId={activeFileId} />
              ) : activeAgentId ? (
                <AgentViewer agentId={activeAgentId} />
              ) : (
                <div className="max-w-4xl mx-auto py-16 px-8 w-full">
                  <h1 className="text-4xl font-semibold tracking-tight mb-4 text-zinc-100">Welcome to Umbrella</h1>
                  <p className="text-zinc-400 text-lg">Select a file or agent from the sidebar to begin.</p>
                </div>
              )}
            </div>
            <TerminalDrawer />
          </main>
        </Panel>

        <ResizeHandle />
        
        <Panel id="chat" defaultSize={25} minSize={20} maxSize={40}>
          <ChatPanel />
        </Panel>
      </PanelGroup>
    </div>
  );
}

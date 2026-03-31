import React, { createContext, useContext, useState, ReactNode } from 'react';

export type FileType = 'markdown' | 'code' | 'spreadsheet';

export interface WorkspaceFile {
  id: string;
  title: string;
  type: FileType;
  content: string;
  lastModified: number;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  instructions: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface WorkspaceContextType {
  files: WorkspaceFile[];
  agents: Agent[];
  chatHistory: ChatMessage[];
  activeFileId: string | null;
  activeAgentId: string | null;
  
  addFile: (title: string, type: FileType, content: string) => WorkspaceFile;
  updateFile: (id: string, updates: Partial<WorkspaceFile>) => void;
  deleteFile: (id: string) => void;
  
  addAgent: (name: string, role: string, instructions: string) => Agent;
  updateAgent: (id: string, updates: Partial<Agent>) => void;
  deleteAgent: (id: string) => void;
  
  addChatMessage: (role: 'user' | 'assistant', content: string) => void;
  
  setActiveFile: (id: string | null) => void;
  setActiveAgent: (id: string | null) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<WorkspaceFile[]>([
    {
      id: '1',
      title: 'Welcome.md',
      type: 'markdown',
      content: '# Welcome to Umbrella\n\nThis is your new workspace. You can create files, spreadsheets, and dedicated AI agents.',
      lastModified: Date.now()
    }
  ]);
  
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: '1',
      name: 'Research Assistant',
      role: 'Web Researcher',
      instructions: 'You are a web research assistant. Your job is to find accurate information online and summarize it.'
    }
  ]);
  
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { id: '1', role: 'assistant', content: "Hello! I'm your Umbrella assistant. I can help you manage your workspace, create files, and set up sub-agents. How can I help today?" }
  ]);
  
  const [activeFileId, setActiveFileId] = useState<string | null>('1');
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null);

  const addFile = (title: string, type: FileType, content: string) => {
    const newFile: WorkspaceFile = {
      id: Math.random().toString(36).substring(7),
      title,
      type,
      content,
      lastModified: Date.now()
    };
    setFiles(prev => [...prev, newFile]);
    return newFile;
  };

  const updateFile = (id: string, updates: Partial<WorkspaceFile>) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, ...updates, lastModified: Date.now() } : f));
  };

  const deleteFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    if (activeFileId === id) setActiveFileId(null);
  };

  const addAgent = (name: string, role: string, instructions: string) => {
    const newAgent: Agent = {
      id: Math.random().toString(36).substring(7),
      name,
      role,
      instructions
    };
    setAgents(prev => [...prev, newAgent]);
    return newAgent;
  };

  const updateAgent = (id: string, updates: Partial<Agent>) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const deleteAgent = (id: string) => {
    setAgents(prev => prev.filter(a => a.id !== id));
    if (activeAgentId === id) setActiveAgentId(null);
  };

  const addChatMessage = (role: 'user' | 'assistant', content: string) => {
    setChatHistory(prev => [...prev, { id: Math.random().toString(36).substring(7), role, content }]);
  };

  const handleSetActiveFile = (id: string | null) => {
    setActiveFileId(id);
    if (id) setActiveAgentId(null);
  };

  const handleSetActiveAgent = (id: string | null) => {
    setActiveAgentId(id);
    if (id) setActiveFileId(null);
  };

  return (
    <WorkspaceContext.Provider value={{
      files, agents, chatHistory, activeFileId, activeAgentId,
      addFile, updateFile, deleteFile,
      addAgent, updateAgent, deleteAgent,
      addChatMessage,
      setActiveFile: handleSetActiveFile,
      setActiveAgent: handleSetActiveAgent
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}

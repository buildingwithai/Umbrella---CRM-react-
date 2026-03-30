import React from 'react';
import { File, Folder, ChevronRight, ChevronDown } from 'lucide-react';

export function FileManagerTree() {
  return (
    <div className="px-2 text-sm">
      <TreeItem icon={<Folder size={16} className="text-blue-400" />} label="src" defaultOpen>
        <TreeItem icon={<Folder size={16} className="text-blue-400" />} label="components" defaultOpen>
          <TreeItem icon={<File size={16} className="text-zinc-400" />} label="App.tsx" />
          <TreeItem icon={<File size={16} className="text-zinc-400" />} label="index.css" />
        </TreeItem>
        <TreeItem icon={<File size={16} className="text-zinc-400" />} label="main.tsx" />
      </TreeItem>
      <TreeItem icon={<File size={16} className="text-zinc-400" />} label="package.json" />
      <TreeItem icon={<File size={16} className="text-zinc-400" />} label="README.md" />
    </div>
  );
}

function TreeItem({ icon, label, children, defaultOpen = false }: { icon: React.ReactNode, label: string, children?: React.ReactNode, defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const hasChildren = React.Children.count(children) > 0;

  return (
    <div>
      <div 
        className="flex items-center gap-1.5 py-1 px-2 hover:bg-zinc-800/50 rounded cursor-pointer text-zinc-300"
        onClick={() => hasChildren && setIsOpen(!isOpen)}
      >
        <div className="w-4 flex items-center justify-center">
          {hasChildren && (
            isOpen ? <ChevronDown size={14} className="text-zinc-500" /> : <ChevronRight size={14} className="text-zinc-500" />
          )}
        </div>
        {icon}
        <span className="truncate">{label}</span>
      </div>
      {hasChildren && isOpen && (
        <div className="ml-4 pl-2 border-l border-zinc-800">
          {children}
        </div>
      )}
    </div>
  );
}

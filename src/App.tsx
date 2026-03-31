import React from 'react';
import { WorkspaceContent } from './components/workspace/workspace-content';
import { WorkspaceProvider } from './lib/workspace-context';

function App() {
  return (
    <WorkspaceProvider>
      <WorkspaceContent />
    </WorkspaceProvider>
  );
}

export default App;

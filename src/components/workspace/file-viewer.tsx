import React, { useEffect, useState } from 'react';
import { useWorkspace } from '../../lib/workspace-context';
import { FileText, Code, Table, Save, Check, Heading1, Heading2, Heading3, List, ListOrdered, Quote, CodeIcon } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { SlashCommand, getSuggestionItems, renderItems } from '../tiptap/slash-command';

export function FileViewer({ fileId }: { fileId: string }) {
  const { files, updateFile } = useWorkspace();
  const file = files.find(f => f.id === fileId);
  
  const [title, setTitle] = useState(file?.title || '');
  const [isSaved, setIsSaved] = useState(true);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Press "/" for commands, or start typing...',
        emptyEditorClass: 'is-editor-empty',
      }),
      SlashCommand.configure({
        suggestion: {
          items: getSuggestionItems,
          render: renderItems,
        },
      }),
    ],
    content: file?.content || '',
    onUpdate: ({ editor }) => {
      setIsSaved(false);
      // Auto-save debounce could go here
    },
  });

  useEffect(() => {
    if (file) {
      setTitle(file.title);
      if (editor && file.content !== editor.getHTML()) {
        // Only set content if it's a completely different file to prevent cursor jumping
        editor.commands.setContent(file.content);
      }
    }
  }, [fileId, editor]);

  if (!file) return null;

  const handleSave = () => {
    if (editor) {
      updateFile(file.id, { title, content: editor.getHTML() });
      setIsSaved(true);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'markdown': return <FileText size={24} className="text-blue-400" />;
      case 'code': return <Code size={24} className="text-yellow-400" />;
      case 'spreadsheet': return <Table size={24} className="text-green-400" />;
      default: return <FileText size={24} />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-8 flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3 text-zinc-400 text-sm">
          {getFileIcon(file.type)}
          <span className="capitalize">{file.type} Document</span>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaved}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            isSaved 
              ? 'text-zinc-500 bg-transparent' 
              : 'bg-blue-600/10 text-blue-400 hover:bg-blue-600/20'
          }`}
        >
          {isSaved ? <Check size={14} /> : <Save size={14} />}
          {isSaved ? 'Saved' : 'Save Changes'}
        </button>
      </div>

      <div className="flex-1 flex flex-col">
        <input 
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setIsSaved(false);
          }}
          className="bg-transparent text-4xl font-bold text-zinc-100 placeholder-zinc-700 outline-none mb-6 w-full"
          placeholder="Untitled"
        />
        
        <div className="flex-1 cursor-text" onClick={() => editor?.commands.focus()}>
          {editor && (
            <BubbleMenu editor={editor} className="flex items-center gap-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl p-1">
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded hover:bg-zinc-700 transition-colors ${editor.isActive('bold') ? 'bg-zinc-700 text-white' : 'text-zinc-400'}`}
              >
                <span className="font-bold">B</span>
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded hover:bg-zinc-700 transition-colors ${editor.isActive('italic') ? 'bg-zinc-700 text-white' : 'text-zinc-400'}`}
              >
                <span className="italic">I</span>
              </button>
              <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`p-2 rounded hover:bg-zinc-700 transition-colors ${editor.isActive('strike') ? 'bg-zinc-700 text-white' : 'text-zinc-400'}`}
              >
                <span className="line-through">S</span>
              </button>
              <div className="w-px h-4 bg-zinc-700 mx-1" />
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded hover:bg-zinc-700 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-zinc-700 text-white' : 'text-zinc-400'}`}
              >
                <Heading2 size={16} />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={`p-2 rounded hover:bg-zinc-700 transition-colors ${editor.isActive('codeBlock') ? 'bg-zinc-700 text-white' : 'text-zinc-400'}`}
              >
                <CodeIcon size={16} />
              </button>
            </BubbleMenu>
          )}

          {editor && (
            <FloatingMenu editor={editor} className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl p-1">
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`p-2 rounded hover:bg-zinc-800 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}
                title="Heading 1"
              >
                <Heading1 size={18} />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded hover:bg-zinc-800 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}
                title="Heading 2"
              >
                <Heading2 size={18} />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded hover:bg-zinc-800 transition-colors ${editor.isActive('bulletList') ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}
                title="Bullet List"
              >
                <List size={18} />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded hover:bg-zinc-800 transition-colors ${editor.isActive('orderedList') ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}
                title="Ordered List"
              >
                <ListOrdered size={18} />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-2 rounded hover:bg-zinc-800 transition-colors ${editor.isActive('blockquote') ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}
                title="Quote"
              >
                <Quote size={18} />
              </button>
            </FloatingMenu>
          )}
          <EditorContent editor={editor} className="h-full" />
        </div>
      </div>
    </div>
  );
}

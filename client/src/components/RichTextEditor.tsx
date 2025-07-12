import React, { useEffect, useState, useRef } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Strike from '@tiptap/extension-strike';
import Code from '@tiptap/extension-code';
import CodeBlock from '@tiptap/extension-code-block';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Blockquote from '@tiptap/extension-blockquote';
import ListItem from '@tiptap/extension-list-item';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import Heading from '@tiptap/extension-heading';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Placeholder from '@tiptap/extension-placeholder';
import EmojiPicker from 'emoji-picker-react';
import { 
  Bold as BoldIcon, 
  Italic as ItalicIcon, 
  Underline as UnderlineIcon,
  Strikethrough as StrikeIcon,
  Code as CodeIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  List as ListIcon,
  ListOrdered as ListOrderedIcon,
  CheckSquare as TaskListIcon,
  Heading1 as H1Icon,
  Heading2 as H2Icon,
  Heading3 as H3Icon,
  Quote as QuoteIcon,
  Table as TableIcon,
  AlignLeft as AlignLeftIcon,
  AlignCenter as AlignCenterIcon,
  AlignRight as AlignRightIcon,
  AlignJustify as AlignJustifyIcon,
  Minus as HRIcon,
  Smile as EmojiIcon,
  Upload as UploadIcon
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Strike,
      Underline,
      Code,
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'bg-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-xs h-auto rounded-lg border border-gray-200 shadow-sm',
        },
        allowBase64: true,
      }),
      Table.configure({ 
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse border border-gray-300 w-full',
        },
      }),
      TableRow,
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 px-3 py-2',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 px-3 py-2 bg-gray-100 font-bold',
        },
      }),
      Blockquote.configure({
        HTMLAttributes: {
          class: 'border-l-4 border-gray-300 pl-4 italic bg-gray-50 py-2',
        },
      }),
      ListItem,
      BulletList.configure({
        HTMLAttributes: {
          class: 'list-disc list-inside space-y-1',
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'list-decimal list-inside space-y-1',
        },
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: 'space-y-1',
        },
      }),
      TaskItem.configure({
        HTMLAttributes: {
          class: 'flex items-center space-x-2',
        },
      }),
      Heading.configure({ 
        levels: [1, 2, 3],
        HTMLAttributes: {
          class: 'font-bold',
        },
      }),
      TextAlign.configure({ 
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      HorizontalRule.configure({
        HTMLAttributes: {
          class: 'border-t border-gray-300 my-4',
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Write here...',
        HTMLAttributes: {
          class: 'text-gray-400',
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'min-h-[200px] p-4 outline-none w-full text-sm prose prose-sm max-w-none',
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', false);
    }
  }, [value, editor]);

  // Handle emoji picker click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        editor?.chain().focus().setImage({ src: result }).run();
      };
      reader.readAsDataURL(file);
    }
  };

  const insertLink = () => {
    if (linkUrl && linkText) {
      editor?.chain().focus().setLink({ href: linkUrl }).insertContent(linkText).run();
      setLinkUrl('');
      setLinkText('');
      setShowLinkDialog(false);
    }
  };

  const insertEmoji = (emojiObject: any) => {
    editor?.chain().focus().insertContent(emojiObject.emoji).run();
    setShowEmojiPicker(false);
  };

  if (!editor) return <div className="border rounded-xl p-4 bg-gray-50 text-gray-400">Loading editor...</div>;

  return (
    <div className="border border-gray-300 rounded-xl bg-white">
      {/* Enhanced Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-xl">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <button 
            type="button" 
            onClick={() => editor.chain().focus().toggleBold().run()} 
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-blue-100 text-blue-700' : ''}`} 
            title="Bold"
          >
            <BoldIcon size={16} />
          </button>
          <button 
            type="button" 
            onClick={() => editor.chain().focus().toggleItalic().run()} 
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-blue-100 text-blue-700' : ''}`} 
            title="Italic"
          >
            <ItalicIcon size={16} />
          </button>
          <button 
            type="button" 
            onClick={() => editor.chain().focus().toggleUnderline().run()} 
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('underline') ? 'bg-blue-100 text-blue-700' : ''}`} 
            title="Underline"
          >
            <UnderlineIcon size={16} />
          </button>
          <button 
            type="button" 
            onClick={() => editor.chain().focus().toggleStrike().run()} 
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('strike') ? 'bg-blue-100 text-blue-700' : ''}`} 
            title="Strikethrough"
          >
            <StrikeIcon size={16} />
          </button>
        </div>

        {/* Code */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <button 
            type="button" 
            onClick={() => editor.chain().focus().toggleCode().run()} 
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('code') ? 'bg-blue-100 text-blue-700' : ''}`} 
            title="Inline Code"
          >
            <CodeIcon size={16} />
          </button>
          <button 
            type="button" 
            onClick={() => editor.chain().focus().toggleCodeBlock().run()} 
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('codeBlock') ? 'bg-blue-100 text-blue-700' : ''}`} 
            title="Code Block"
          >
            <span className="text-xs font-mono">{"{ }"}</span>
          </button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <button 
            type="button" 
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-100 text-blue-700' : ''}`} 
            title="Heading 1"
          >
            <H1Icon size={16} />
          </button>
          <button 
            type="button" 
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-100 text-blue-700' : ''}`} 
            title="Heading 2"
          >
            <H2Icon size={16} />
          </button>
          <button 
            type="button" 
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} 
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-100 text-blue-700' : ''}`} 
            title="Heading 3"
          >
            <H3Icon size={16} />
          </button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <button 
            type="button" 
            onClick={() => editor.chain().focus().toggleBulletList().run()} 
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-blue-100 text-blue-700' : ''}`} 
            title="Bullet List"
          >
            <ListIcon size={16} />
          </button>
          <button 
            type="button" 
            onClick={() => editor.chain().focus().toggleOrderedList().run()} 
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-blue-100 text-blue-700' : ''}`} 
            title="Numbered List"
          >
            <ListOrderedIcon size={16} />
          </button>
          <button 
            type="button" 
            onClick={() => editor.chain().focus().toggleTaskList().run()} 
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('taskList') ? 'bg-blue-100 text-blue-700' : ''}`} 
            title="Task List"
          >
            <TaskListIcon size={16} />
          </button>
        </div>

        {/* Text Alignment */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <button 
            type="button" 
            onClick={() => editor.chain().focus().setTextAlign('left').run()} 
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'left' }) ? 'bg-blue-100 text-blue-700' : ''}`} 
            title="Align Left"
          >
            <AlignLeftIcon size={16} />
          </button>
          <button 
            type="button" 
            onClick={() => editor.chain().focus().setTextAlign('center').run()} 
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'center' }) ? 'bg-blue-100 text-blue-700' : ''}`} 
            title="Align Center"
          >
            <AlignCenterIcon size={16} />
          </button>
          <button 
            type="button" 
            onClick={() => editor.chain().focus().setTextAlign('right').run()} 
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'right' }) ? 'bg-blue-100 text-blue-700' : ''}`} 
            title="Align Right"
          >
            <AlignRightIcon size={16} />
          </button>
          <button 
            type="button" 
            onClick={() => editor.chain().focus().setTextAlign('justify').run()} 
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-blue-100 text-blue-700' : ''}`} 
            title="Justify"
          >
            <AlignJustifyIcon size={16} />
          </button>
        </div>

        {/* Links and Media */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <button 
            type="button" 
            onClick={() => setShowLinkDialog(true)} 
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('link') ? 'bg-blue-100 text-blue-700' : ''}`} 
            title="Insert Link"
          >
            <LinkIcon size={16} />
          </button>
          <button 
            type="button" 
            onClick={() => document.getElementById('image-upload')?.click()} 
            className="p-2 rounded hover:bg-gray-200" 
            title="Upload Image"
          >
            <UploadIcon size={16} />
          </button>
          <button 
            type="button" 
            onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
            className="p-2 rounded hover:bg-gray-200" 
            title="Insert Emoji"
          >
            <EmojiIcon size={16} />
          </button>
        </div>

        {/* Other Elements */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <button 
            type="button" 
            onClick={() => editor.chain().focus().toggleBlockquote().run()} 
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-blue-100 text-blue-700' : ''}`} 
            title="Blockquote"
          >
            <QuoteIcon size={16} />
          </button>
          <button 
            type="button" 
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} 
            className="p-2 rounded hover:bg-gray-200" 
            title="Insert Table"
          >
            <TableIcon size={16} />
          </button>
          <button 
            type="button" 
            onClick={() => editor.chain().focus().setHorizontalRule().run()} 
            className="p-2 rounded hover:bg-gray-200" 
            title="Horizontal Rule"
          >
            <HRIcon size={16} />
          </button>
        </div>

        {/* History */}
        <div className="flex items-center gap-1">
          <button 
            type="button" 
            onClick={() => editor.chain().focus().undo().run()} 
            className="p-2 rounded hover:bg-gray-200" 
            title="Undo"
          >
            ↺
          </button>
          <button 
            type="button" 
            onClick={() => editor.chain().focus().redo().run()} 
            className="p-2 rounded hover:bg-gray-200" 
            title="Redo"
          >
            ↻
          </button>
        </div>
      </div>

      {/* Hidden file input for image upload */}
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleImageUpload(file);
            // Reset the input
            e.target.value = '';
          }
        }}
        className="hidden"
      />

      {/* Editor Content */}
      <EditorContent editor={editor} />

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div ref={emojiPickerRef} className="absolute z-50 mt-2">
          <EmojiPicker onEmojiClick={insertEmoji} />
        </div>
      )}

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Insert Link</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link Text</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Link text"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowLinkDialog(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={insertLink}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Insert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor; 
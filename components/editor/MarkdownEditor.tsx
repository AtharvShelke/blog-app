'use client';

import { useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Link as LinkIcon, 
  Image as ImageIcon,
  Code,
  Heading1,
  Heading2,
  Quote
} from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const { insertMarkdown } = useEditorStore();

  const handleInsert = useCallback((markdown: string, cursorOffset: number = 0) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let newText: string;
    let newCursorPos: number;

    if (selectedText) {
      // Wrap selected text
      newText = value.substring(0, start) + markdown.replace('text', selectedText) + value.substring(end);
      newCursorPos = start + markdown.indexOf('text') + selectedText.length;
    } else {
      // Insert at cursor
      newText = value.substring(0, start) + markdown + value.substring(end);
      newCursorPos = start + markdown.length + cursorOffset;
    }

    onChange(newText);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }, [value, onChange]);

  const toolbarButtons = [
    { icon: Heading1, label: 'H1', markdown: '# text', offset: -4 },
    { icon: Heading2, label: 'H2', markdown: '## text', offset: -4 },
    { icon: Bold, label: 'Bold', markdown: '**text**', offset: -2 },
    { icon: Italic, label: 'Italic', markdown: '*text*', offset: -1 },
    { icon: Code, label: 'Code', markdown: '`text`', offset: -1 },
    { icon: Quote, label: 'Quote', markdown: '> text', offset: -4 },
    { icon: List, label: 'List', markdown: '- text', offset: -4 },
    { icon: ListOrdered, label: 'Ordered List', markdown: '1. text', offset: -4 },
    { icon: LinkIcon, label: 'Link', markdown: '[text](url)', offset: -1 },
    { icon: ImageIcon, label: 'Image', markdown: '![alt](url)', offset: -1 },
  ];

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1 p-2 border rounded-lg bg-secondary/50">
        {toolbarButtons.map((button) => {
          const Icon = button.icon;
          return (
            <Button
              key={button.label}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleInsert(button.markdown, button.offset)}
              title={button.label}
            >
              <Icon className="w-4 h-4" />
            </Button>
          );
        })}
      </div>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Write your content in markdown...'}
        className="min-h-[500px] font-mono text-sm"
      />

      <div className="text-xs text-muted-foreground">
        Supports Markdown. Use the toolbar for quick formatting.
      </div>
    </div>
  );
}

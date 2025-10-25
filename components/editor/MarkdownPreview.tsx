'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card } from '@/components/ui/card';

interface MarkdownPreviewProps {
  content: string;
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  if (!content) {
    return (
      <Card className="p-8">
        <div className="text-center text-muted-foreground">
          <p>Preview will appear here...</p>
          <p className="text-sm mt-2">Start writing to see the live preview</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8">
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>
    </Card>
  );
}

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type PreviewMode = 'split' | 'preview' | 'edit';

interface EditorState {
  content: string;
  previewMode: PreviewMode;
  isDirty: boolean;
  lastSaved: Date | null;

  // Actions
  setContent: (content: string) => void;
  setPreviewMode: (mode: PreviewMode) => void;
  insertMarkdown: (markdown: string, cursorPosition?: number) => void;
  clearContent: () => void;
  markAsSaved: () => void;
  reset: () => void;
}

const initialState = {
  content: '',
  previewMode: 'split' as PreviewMode,
  isDirty: false,
  lastSaved: null,
};

export const useEditorStore = create<EditorState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setContent: (content) => 
        set({ 
          content, 
          isDirty: content !== get().content 
        }),

      setPreviewMode: (mode) => 
        set({ previewMode: mode }),

      insertMarkdown: (markdown, cursorPosition) => {
        const { content } = get();
        if (cursorPosition !== undefined) {
          const newContent = 
            content.slice(0, cursorPosition) + 
            markdown + 
            content.slice(cursorPosition);
          set({ content: newContent, isDirty: true });
        } else {
          set({ content: content + markdown, isDirty: true });
        }
      },

      clearContent: () => 
        set({ content: '', isDirty: false }),

      markAsSaved: () => 
        set({ isDirty: false, lastSaved: new Date() }),

      reset: () => 
        set(initialState),
    }),
    { name: 'EditorStore' }
  )
);

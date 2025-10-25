import { create } from 'zustand';

interface EditorState {
  content: string;
  previewMode: 'split' | 'preview' | 'edit';
  setContent: (content: string) => void;
  setPreviewMode: (mode: 'split' | 'preview' | 'edit') => void;
  insertMarkdown: (markdown: string) => void;
  clearContent: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  content: '',
  previewMode: 'split',
  setContent: (content) => set({ content }),
  setPreviewMode: (mode) => set({ previewMode: mode }),
  insertMarkdown: (markdown) =>
    set((state) => ({
      content: state.content + markdown,
    })),
  clearContent: () => set({ content: '' }),
}));

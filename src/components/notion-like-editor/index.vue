<template>
  <div class="notion-like-editor">
    <!-- Collaboration Status -->
    <CollaborationStatus
      :collaboration-service="collaborationService"
      v-if="collaborationService"
    />

    <div class="editor-container">
      <editor-content :editor="editor" class="editor-content" />

      <!-- Floating Menu -->
      <floating-menu
        :editor="editor"
        :tippy-options="{ duration: 100 }"
        v-if="editor"
      >
        <FloatingMenuComponent :editor="editor" />
      </floating-menu>

      <!-- Bubble Menu -->
      <bubble-menu
        :editor="editor"
        :tippy-options="{ duration: 100 }"
        v-if="editor"
      >
        <BubbleMenuComponent :editor="editor" />
      </bubble-menu>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Editor, EditorContent, FloatingMenu, BubbleMenu } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'


// Import custom extensions
import Commands from './extensions/slash-command/commands.js'
import suggestion from './extensions/slash-command/suggestion.js'
import BlockExtension from './extensions/block-extension.js'
import MarkdownShortcuts from './extensions/markdown-shortcuts.js'
import DragDrop from './extensions/drag-drop.js'

// Import menu components
import FloatingMenuComponent from './components/FloatingMenu.vue'
import BubbleMenuComponent from './components/BubbleMenu.vue'
import CollaborationStatus from './components/CollaborationStatus.vue'

// Import collaboration service
import { getCollaborationService } from './services/collaboration.js'

const editor = ref(null)
const collaborationService = ref(null)

onMounted(() => {
  // Initialize collaboration service
  collaborationService.value = getCollaborationService('notion-editor-demo')

  // Try to connect to collaboration server, fallback to mock
  const connected = collaborationService.value.connect()
  if (!connected) {
    collaborationService.value.createMockCollaboration()
  }

  editor.value = new Editor({
    content: '<p>Type "/" to see available commands...</p>',
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return `Heading ${node.attrs.level}`
          }
          return 'Type "/" for commands, or start writing...'
        },
      }),
      Typography,
      Image.configure({
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'editor-link',
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,

      Commands.configure({
        suggestion,
      }),
      BlockExtension,
      MarkdownShortcuts,
      DragDrop,
      Collaboration.configure({
        document: collaborationService.value.getYDoc(),
      }),
      CollaborationCursor.configure({
        provider: collaborationService.value.provider,
        user: {
          name: 'Current User',
          color: '#3b82f6',
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
  })
})

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
  }
  if (collaborationService.value) {
    collaborationService.value.disconnect()
  }
})
</script>

<style scoped>
/* CSS Variables for consistent theming */
:root {
  --notion-bg: #ffffff;
  --notion-text: #37352f;
  --notion-text-light: #787774;
  --notion-border: #e9e9e7;
  --notion-hover: #f7f6f3;
  --notion-selection: #2383e2;
  --notion-selection-bg: rgba(35, 131, 226, 0.15);
  --notion-shadow: 0 1px 3px rgba(15, 15, 15, 0.1);
  --notion-shadow-hover: 0 2px 8px rgba(15, 15, 15, 0.15);
  --notion-radius: 6px;
  --notion-font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.notion-like-editor {
  min-height: 100vh;
  background: var(--notion-bg);
  font-family: var(--notion-font);
  color: var(--notion-text);
  line-height: 1.5;
}

.editor-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0;
  position: relative;
}

.editor-content {
  min-height: calc(100vh - 60px);
  padding: 96px 96px 30vh 96px;
  position: relative;
}

@media (max-width: 768px) {
  .editor-content {
    padding: 48px 24px 30vh 24px;
  }
}

/* Enhanced ProseMirror editor styles */
:deep(.ProseMirror) {
  outline: none;
  padding: 0;
  line-height: 1.65;
  font-size: 16px;
  color: var(--notion-text);
  caret-color: var(--notion-selection);
  word-wrap: break-word;
  white-space: pre-wrap;
  white-space: break-spaces;
}

:deep(.ProseMirror p) {
  margin: 1px 0;
  min-height: 1.5em;
  position: relative;
}

:deep(.ProseMirror p.is-empty) {
  position: relative;
}

:deep(.ProseMirror h1) {
  font-size: 2.25em;
  font-weight: 700;
  margin: 2px 0 1px 0;
  line-height: 1.2;
  color: var(--notion-text);
  letter-spacing: -0.01em;
}

:deep(.ProseMirror h2) {
  font-size: 1.875em;
  font-weight: 600;
  margin: 2px 0 1px 0;
  line-height: 1.3;
  color: var(--notion-text);
  letter-spacing: -0.01em;
}

:deep(.ProseMirror h3) {
  font-size: 1.5em;
  font-weight: 600;
  margin: 2px 0 1px 0;
  line-height: 1.4;
  color: var(--notion-text);
  letter-spacing: -0.01em;
}

:deep(.ProseMirror h4) {
  font-size: 1.25em;
  font-weight: 600;
  margin: 2px 0 1px 0;
  line-height: 1.4;
  color: var(--notion-text);
}

:deep(.ProseMirror h5) {
  font-size: 1.125em;
  font-weight: 600;
  margin: 2px 0 1px 0;
  line-height: 1.4;
  color: var(--notion-text);
}

:deep(.ProseMirror h6) {
  font-size: 1em;
  font-weight: 600;
  margin: 2px 0 1px 0;
  line-height: 1.4;
  color: var(--notion-text);
}

:deep(.ProseMirror ul, .ProseMirror ol) {
  padding-left: 0;
  margin: 1px 0;
  list-style: none;
}

:deep(.ProseMirror ul) {
  list-style-type: none;
}

:deep(.ProseMirror ol) {
  list-style-type: none;
  counter-reset: list-counter;
}

:deep(.ProseMirror li) {
  margin: 1px 0;
  position: relative;
  padding-left: 1.75em;
  min-height: 1.5em;
}

:deep(.ProseMirror ul li::before) {
  content: '•';
  position: absolute;
  left: 0.5em;
  color: var(--notion-text-light);
  font-weight: bold;
}

:deep(.ProseMirror ol li) {
  counter-increment: list-counter;
}

:deep(.ProseMirror ol li::before) {
  content: counter(list-counter) '.';
  position: absolute;
  left: 0;
  color: var(--notion-text-light);
  font-weight: 500;
  min-width: 1.5em;
  text-align: right;
  padding-right: 0.25em;
}

:deep(.ProseMirror blockquote) {
  border-left: 3px solid var(--notion-border);
  padding-left: 16px;
  margin: 4px 0;
  color: var(--notion-text);
  font-size: 1em;
  position: relative;
}

:deep(.ProseMirror blockquote::before) {
  content: '';
  position: absolute;
  left: -3px;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--notion-text-light);
  opacity: 0.3;
}

:deep(.ProseMirror code) {
  background: rgba(135, 131, 120, 0.15);
  color: #eb5757;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: 'SFMono-Regular', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Consolas', 'Courier New', monospace;
  font-size: 0.85em;
  font-weight: 500;
  line-height: normal;
}

:deep(.ProseMirror pre) {
  background: #f7f6f3;
  border: 1px solid var(--notion-border);
  border-radius: var(--notion-radius);
  padding: 16px;
  margin: 4px 0;
  overflow-x: auto;
  font-family: 'SFMono-Regular', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Consolas', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.4;
  color: var(--notion-text);
  position: relative;
}

:deep(.ProseMirror pre code) {
  background: none;
  padding: 0;
  color: inherit;
  border-radius: 0;
  font-size: inherit;
}

:deep(.ProseMirror hr) {
  border: none;
  border-top: 1px solid var(--notion-border);
  margin: 16px 0;
  height: 1px;
}

:deep(.editor-image) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1rem 0;
  cursor: pointer;
  transition: transform 0.2s ease;
}

:deep(.editor-image:hover) {
  transform: scale(1.02);
}

:deep(.editor-link) {
  color: #3b82f6;
  text-decoration: underline;
  cursor: pointer;
}

:deep(.editor-link:hover) {
  color: #1d4ed8;
}

/* Table styles */
:deep(.ProseMirror table) {
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
  margin: 1rem 0;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

:deep(.ProseMirror table td, .ProseMirror table th) {
  min-width: 1em;
  border: 1px solid #e5e7eb;
  padding: 8px 12px;
  vertical-align: top;
  box-sizing: border-box;
  position: relative;
}

:deep(.ProseMirror table th) {
  font-weight: 600;
  background-color: #f9fafb;
}

:deep(.ProseMirror table .selectedCell:after) {
  z-index: 2;
  position: absolute;
  content: "";
  left: 0; right: 0; top: 0; bottom: 0;
  background: rgba(59, 130, 246, 0.1);
  pointer-events: none;
}

:deep(.ProseMirror table .column-resize-handle) {
  position: absolute;
  right: -2px;
  top: 0;
  bottom: -2px;
  width: 4px;
  background-color: #3b82f6;
  pointer-events: none;
}

:deep(.ProseMirror table p) {
  margin: 0;
}

/* Enhanced placeholder styles */
:deep(.ProseMirror .is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  float: left;
  color: var(--notion-text-light);
  pointer-events: none;
  height: 0;
  font-weight: 400;
}

:deep(.ProseMirror p.is-empty::before) {
  content: attr(data-placeholder);
  float: left;
  color: var(--notion-text-light);
  pointer-events: none;
  height: 0;
  position: absolute;
  opacity: 0.6;
}

/* Selection styles */
:deep(.ProseMirror ::selection) {
  background: var(--notion-selection-bg);
}

:deep(.ProseMirror ::-moz-selection) {
  background: var(--notion-selection-bg);
}

/* Enhanced block system styles */
:deep(.ProseMirror [data-block-id]) {
  position: relative;
  margin: 1px 0;
  padding: 3px 2px;
  border-radius: 3px;
  transition: all 0.1s ease;
}

:deep(.ProseMirror [data-block-id]:hover) {
  background-color: var(--notion-hover);
}

:deep(.ProseMirror [data-block-id].block-selected) {
  background-color: var(--notion-selection-bg);
  border-left: 3px solid var(--notion-selection);
  padding-left: 8px;
  margin-left: -11px;
}

/* Block spacing improvements */
:deep(.ProseMirror > * + *) {
  margin-top: 2px;
}

:deep(.ProseMirror > h1 + *,
       .ProseMirror > h2 + *,
       .ProseMirror > h3 + *) {
  margin-top: 4px;
}

:deep(.ProseMirror > * + h1,
       .ProseMirror > * + h2,
       .ProseMirror > * + h3) {
  margin-top: 16px;
}

/* Block handle styles */
:deep(.block-handle) {
  position: absolute;
  left: -30px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  color: #d1d5db;
  opacity: 0;
  transition: opacity 0.2s ease;
  font-size: 12px;
  user-select: none;
  z-index: 10;
}

:deep(.ProseMirror [data-block-id]:hover .block-handle) {
  opacity: 1;
}

:deep(.block-handle:hover) {
  color: #9ca3af;
  background-color: #f3f4f6;
  border-radius: 3px;
}

:deep(.block-handle:active) {
  cursor: grabbing;
}

:deep(.block-handle.dragging) {
  opacity: 0.5;
}

/* Enhanced drag and drop styles */
:deep(.drag-handle) {
  position: absolute;
  left: -30px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  color: #d1d5db;
  opacity: 0;
  transition: all 0.2s ease;
  border-radius: 3px;
  z-index: 10;
}

:deep(.ProseMirror [data-block-id]:hover .drag-handle),
:deep(.ProseMirror p:hover + .drag-handle),
:deep(.ProseMirror h1:hover + .drag-handle),
:deep(.ProseMirror h2:hover + .drag-handle),
:deep(.ProseMirror h3:hover + .drag-handle),
:deep(.ProseMirror ul:hover + .drag-handle),
:deep(.ProseMirror ol:hover + .drag-handle),
:deep(.ProseMirror blockquote:hover + .drag-handle) {
  opacity: 1;
}

:deep(.drag-handle:hover) {
  color: #9ca3af;
  background-color: #f3f4f6;
}

:deep(.drag-handle:active) {
  cursor: grabbing;
}

:deep(.drag-handle.dragging) {
  opacity: 0.5;
  transform: translateY(-50%) scale(1.1);
}

:deep(.drag-handle svg) {
  pointer-events: none;
}

:deep(.drop-line) {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: #3b82f6;
  z-index: 1000;
  pointer-events: none;
  border-radius: 1px;
  box-shadow: 0 0 4px rgba(59, 130, 246, 0.5);
}

:deep(.drag-preview) {
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 14px;
  color: #6b7280;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
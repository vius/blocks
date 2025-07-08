<template>
  <div class="bubble-menu" v-if="editor">
    <button
      @click="toggleBold"
      :class="{ 'is-active': editor.isActive('bold') }"
      class="menu-button"
      title="Bold"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
        <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
      </svg>
    </button>
    
    <button
      @click="toggleItalic"
      :class="{ 'is-active': editor.isActive('italic') }"
      class="menu-button"
      title="Italic"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="19" y1="4" x2="10" y2="4"/>
        <line x1="14" y1="20" x2="5" y2="20"/>
        <line x1="15" y1="4" x2="9" y2="20"/>
      </svg>
    </button>
    
    <button
      @click="toggleCode"
      :class="{ 'is-active': editor.isActive('code') }"
      class="menu-button"
      title="Code"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="16,18 22,12 16,6"/>
        <polyline points="8,6 2,12 8,18"/>
      </svg>
    </button>
    
    <div class="menu-divider"></div>
    
    <button
      @click="setLink"
      :class="{ 'is-active': editor.isActive('link') }"
      class="menu-button"
      title="Link"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
    </button>
    
    <div class="menu-divider"></div>
    
    <button
      @click="setHeading(1)"
      :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
      class="menu-button"
      title="Heading 1"
    >
      H1
    </button>
    
    <button
      @click="setHeading(2)"
      :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
      class="menu-button"
      title="Heading 2"
    >
      H2
    </button>
    
    <button
      @click="setParagraph"
      :class="{ 'is-active': editor.isActive('paragraph') }"
      class="menu-button"
      title="Paragraph"
    >
      P
    </button>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  editor: {
    type: Object,
    required: true
  }
})

const toggleBold = () => {
  props.editor.chain().focus().toggleBold().run()
}

const toggleItalic = () => {
  props.editor.chain().focus().toggleItalic().run()
}

const toggleCode = () => {
  props.editor.chain().focus().toggleCode().run()
}

const setLink = () => {
  const previousUrl = props.editor.getAttributes('link').href
  const url = window.prompt('URL', previousUrl)

  // cancelled
  if (url === null) {
    return
  }

  // empty
  if (url === '') {
    props.editor.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }

  // update link
  props.editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

const setHeading = (level) => {
  props.editor.chain().focus().toggleHeading({ level }).run()
}

const setParagraph = () => {
  props.editor.chain().focus().setParagraph().run()
}
</script>

<style scoped>
.bubble-menu {
  display: flex;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 38px -10px rgba(22, 23, 24, 0.35), 0 10px 20px -15px rgba(22, 23, 24, 0.2);
  padding: 4px;
  gap: 2px;
  z-index: 1000;
  align-items: center;
}

.menu-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  color: #374151;
  transition: all 0.1s ease;
}

.menu-button:hover {
  background-color: #f3f4f6;
}

.menu-button.is-active {
  background-color: #3b82f6;
  color: white;
}

.menu-divider {
  width: 1px;
  height: 20px;
  background-color: #e5e7eb;
  margin: 0 4px;
}
</style>

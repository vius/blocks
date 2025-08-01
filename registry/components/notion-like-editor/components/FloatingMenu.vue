<template>
  <div class="floating-menu" v-if="editor">
    <button
      @click="addHeading(1)"
      class="menu-button"
      title="Heading 1"
    >
      H1
    </button>
    <button
      @click="addHeading(2)"
      class="menu-button"
      title="Heading 2"
    >
      H2
    </button>
    <button
      @click="addParagraph"
      class="menu-button"
      title="Paragraph"
    >
      P
    </button>
    <button
      @click="addBulletList"
      class="menu-button"
      title="Bullet List"
    >
      •
    </button>
    <button
      @click="addOrderedList"
      class="menu-button"
      title="Numbered List"
    >
      1.
    </button>
    <button
      @click="addBlockquote"
      class="menu-button"
      title="Quote"
    >
      "
    </button>
    <button
      @click="addCodeBlock"
      class="menu-button"
      title="Code Block"
    >
      {}
    </button>
    <button
      @click="addImage"
      class="menu-button"
      title="Image"
    >
      🖼️
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

const addHeading = (level) => {
  props.editor.chain().focus().toggleHeading({ level }).run()
}

const addParagraph = () => {
  props.editor.chain().focus().setParagraph().run()
}

const addBulletList = () => {
  props.editor.chain().focus().toggleBulletList().run()
}

const addOrderedList = () => {
  props.editor.chain().focus().toggleOrderedList().run()
}

const addBlockquote = () => {
  props.editor.chain().focus().toggleBlockquote().run()
}

const addCodeBlock = () => {
  props.editor.chain().focus().toggleCodeBlock().run()
}

const addImage = () => {
  const url = window.prompt('Enter image URL:')
  if (url) {
    props.editor.chain().focus().setImage({ src: url }).run()
  }
}
</script>

<style scoped>
.floating-menu {
  display: flex;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 38px -10px rgba(22, 23, 24, 0.35), 0 10px 20px -15px rgba(22, 23, 24, 0.2);
  padding: 4px;
  gap: 2px;
  z-index: 1000;
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
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  transition: background-color 0.1s ease;
}

.menu-button:hover {
  background-color: #f3f4f6;
}

.menu-button:active {
  background-color: #e5e7eb;
}
</style>

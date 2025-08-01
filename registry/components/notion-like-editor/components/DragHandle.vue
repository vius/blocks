<template>
  <div 
    class="drag-handle"
    :class="{ 'visible': isVisible }"
    @mousedown="handleMouseDown"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
      <circle cx="2" cy="2" r="1" fill="currentColor"/>
      <circle cx="2" cy="6" r="1" fill="currentColor"/>
      <circle cx="2" cy="10" r="1" fill="currentColor"/>
      <circle cx="2" cy="14" r="1" fill="currentColor"/>
      <circle cx="6" cy="2" r="1" fill="currentColor"/>
      <circle cx="6" cy="6" r="1" fill="currentColor"/>
      <circle cx="6" cy="10" r="1" fill="currentColor"/>
      <circle cx="6" cy="14" r="1" fill="currentColor"/>
    </svg>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  blockId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['dragStart', 'dragEnd', 'mouseDown'])

const isDragging = ref(false)

const handleMouseDown = (event) => {
  emit('mouseDown', { event, blockId: props.blockId })
}

const handleDragStart = (event) => {
  isDragging.value = true
  event.dataTransfer.setData('text/plain', props.blockId)
  event.dataTransfer.effectAllowed = 'move'
  
  // Create a custom drag image
  const dragImage = document.createElement('div')
  dragImage.className = 'drag-preview'
  dragImage.textContent = 'Moving block...'
  dragImage.style.cssText = `
    position: absolute;
    top: -1000px;
    background: #f3f4f6;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    padding: 8px 12px;
    font-size: 14px;
    color: #6b7280;
  `
  document.body.appendChild(dragImage)
  event.dataTransfer.setDragImage(dragImage, 0, 0)
  
  setTimeout(() => {
    document.body.removeChild(dragImage)
  }, 0)
  
  emit('dragStart', { event, blockId: props.blockId })
}

const handleDragEnd = (event) => {
  isDragging.value = false
  emit('dragEnd', { event, blockId: props.blockId })
}
</script>

<style scoped>
.drag-handle {
  position: absolute;
  left: -24px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  color: #9ca3af;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 10;
}

.drag-handle:hover {
  color: #6b7280;
}

.drag-handle:active {
  cursor: grabbing;
}

.drag-handle.visible {
  opacity: 1;
}

.drag-handle svg {
  pointer-events: none;
}
</style>

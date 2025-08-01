<template>
  <div class="image-settings-content flex justify-center items-center gap-1">
    <!-- 对齐方式 -->
    <button v-for="align in alignmentOptions" :key="align.value" @click="setAlignment(align.value)"
      :class="['align-btn', { 'active': currentAlignment === align.value }]" :title="align.label">
      <component :is="align.icon" :size="14" />
    </button>
    <div class="w-px bg-gray-200 !mx-2 h-6"></div>
    <!-- 预设大小按钮 -->
    <button v-for="preset in sizePresets" :key="preset.value" @click="setPresetSize(preset.value)"
      class="h-7"
      :class="['preset-btn', { 'active': imageSize[0] === preset.value }]">
      {{ preset.label }}
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import {
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-vue-next'

const props = defineProps({
  editor: {
    type: Object,
    required: true
  },
  imageNode: {
    type: Object,
    default: null
  }
})

const imageSize = ref([50])
const currentAlignment = ref('center')

const alignmentOptions = [
  { value: 'left', label: 'Left', icon: AlignLeft },
  { value: 'center', label: 'Center', icon: AlignCenter },
  { value: 'right', label: 'Right', icon: AlignRight }
]

const sizePresets = [
  { value: 25, label: '25%' },
  { value: 50, label: '50%' },
  { value: 75, label: '75%' },
  { value: 100, label: '100%' }
]

// 监听图片节点变化，更新当前设置
watch(() => props.imageNode, (node) => {
  if (node) {
    const attrs = node.attrs || {}
    // 处理宽度值，可能是百分比字符串或数字
    let width = attrs.width
    if (typeof width === 'string' && width.includes('%')) {
      width = parseInt(width.replace('%', ''))
    } else if (typeof width !== 'number') {
      width = 50 // 默认值
    }
    imageSize.value = [width]
    currentAlignment.value = attrs.align || 'center'
  }
}, { immediate: true })

const setAlignment = (alignment) => {
  currentAlignment.value = alignment
  updateImageAttributes({ align: alignment })
}

const setPresetSize = (size) => {
  imageSize.value = [size]
  updateImageAttributes({ width: `${size}%` })
}

const updateImageAttributes = (attrs) => {
  if (!props.editor) return

  // 尝试更新 imageUpload 节点
  if (props.editor.isActive('imageUpload')) {
    props.editor.commands.updateAttributes('imageUpload', attrs)
  }
  // 如果是普通的 image 节点
  else if (props.editor.isActive('image')) {
    props.editor.commands.updateAttributes('image', attrs)
  }
}
</script>

<style scoped>
.image-settings-content {
  min-width: 240px;
}

.setting-group {
  margin-bottom: 16px;
}

.setting-group:last-child {
  margin-bottom: 0;
}

.setting-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  font-size: 12px;
  color: #374151;
}

.alignment-buttons {
  display: flex;
  gap: 4px;
}

.align-btn {
  padding: 6px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.align-btn:hover {
  background: #f3f4f6;
}

.align-btn.active {
  background: #5b48f1;
  border-color: #5b48f1;
  color: white;
}

.size-slider-container {
  margin: 6px 0;
}

.size-presets {
  display: flex;
  gap: 4px;
}

.preset-btn {
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s;
  flex: 1;
  text-align: center;
}

.preset-btn:hover {
  background: #f3f4f6;
}

.preset-btn.active {
  background: #5b48f1;
  border-color: #5b48f1;
  color: white;
}
</style>

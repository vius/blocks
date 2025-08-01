<template>
  <NodeViewWrapper class="image-node-view">
    <Popover v-if="!node.attrs.uploading && node.attrs.src">
      <PopoverTrigger as-child>
        <img :src="node.attrs.src" :alt="node.attrs.alt" :title="node.attrs.title" :style="imageStyle"
          :data-align="node.attrs.align" @load="handleImageLoad" @error="handleImageError" @click="handleImageClick" />
      </PopoverTrigger>
      <PopoverContent side="top" :side-offset="8" class="image-settings-popover">
        <ImageSettings :editor="editor" :imageNode="node" />
      </PopoverContent>
    </Popover>

    <!-- 上传进度显示 -->
    <div v-if="node.attrs.uploading" class="upload-card w-128 !mx-auto">
      <div class="upload-card-content">
        <!-- 文件图标 -->
        <div class="file-icon">
          <CloudUpload color="#6366F1"/>
        </div>

        <!-- 文件信息 -->
        <div class="file-info">
          <div class="file-name">{{ node.attrs.fileName }}</div>
          <div class="file-size">{{ node.attrs.fileSize}}</div>
        </div>

        <!-- 进度百分比 -->
        <div class="progress-percentage">{{ node.attrs.progress || 0 }}%</div>

        <!-- 关闭按钮 -->
        <button class="ghost-btn" @click="handleCancelUpload">
          <Trash2 color="red" :size="16"/>
        </button>
      </div>

      <!-- 进度条 -->
      <div class="upload-progress-bar">
        <div class="progress-fill" :style="{ width: `${node.attrs.progress || 0}%` }"></div>
      </div>
    </div>
  </NodeViewWrapper>
</template>

<script setup>
import { computed } from 'vue'
import { NodeViewWrapper } from '@tiptap/vue-3'
import { Popover, PopoverContent, PopoverTrigger } from '@registry/components/ui/popover'
import ImageSettings from './ImageSettings.vue'
import { CloudUpload, Trash2 } from 'lucide-vue-next'
const props = defineProps({
  editor: {
    type: Object,
    required: true
  },
  node: {
    type: Object,
    required: true
  },
  getPos: {
    type: Function,
    required: true
  },
  selected: {
    type: Boolean,
    default: false
  }
})

// 计算图片样式
const imageStyle = computed(() => {
  const { width, align } = props.node.attrs
  let styles = {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    display: 'block',
    transition: 'all 0.2s ease'
  }

  if (width) {
    styles.width = width
  }

  // 根据对齐方式设置 margin
  switch (align) {
    case 'left':
      styles.margin = '0'
      break
    case 'right':
      styles.margin = '0 0 0 auto'
      break
    case 'center':
    default:
      styles.margin = '0 auto'
      break
  }

  return styles
})

const handleImageClick = (event) => {
  event.preventDefault()
  event.stopPropagation()

  // 选中当前图片节点
  const pos = props.getPos()
  console.log('pos0', pos)
  if (pos !== undefined) {
    props.editor.commands.setNodeSelection(pos)
  }
}

const handleImageLoad = () => {
  // 图片加载完成后的处理
}

const handleImageError = () => {
  // 图片加载错误的处理
  const pos = props.getPos()
  if (pos !== undefined) {
    props.editor.commands.deleteRange({ from: pos, to: pos + 1 })
  }
}

const handleCancelUpload = () => {
  // 取消上传处理
  const pos = props.getPos()
  if (pos !== undefined) {
    props.editor.commands.deleteRange({ from: pos, to: pos + 1 })
  }
}
</script>

<style scoped lang="less">
.image-node-view {
  margin: 1em 0;
  position: relative;

  &.ProseMirror-selectednode {
    &>img {
      outline: 2px solid #5b48f1;
      outline-offset: 2px;
      border-radius: 8px;
    }
  }
}


.upload-card {
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 16px;
  margin: 16px 0;
  max-width: 400px;
}

.upload-card-content {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.file-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  background: #EEF2FF;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-size: 14px;
  font-weight: 500;
  color: #1E293B;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-size {
  font-size: 12px;
  color: #64748B;
}

.progress-percentage {
  font-size: 14px;
  font-weight: 500;
  color: #6366F1;
  margin-right: 8px;
}

.close-button {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.close-button:hover {
  background: #E2E8F0;
}

.upload-progress-bar {
  width: 100%;
  height: 6px;
  background: #E2E8F0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #6366F1;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(220, 38, 38, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: white;
  padding: 16px;
  text-align: center;
}

.error-message {
  font-size: 12px;
  margin-bottom: 8px;
}

.retry-button {
  background: white;
  color: #dc2626;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
  font-weight: 500;
}

.retry-button:hover {
  background: #f3f4f6;
}
</style>

<style>
.image-settings-popover {
  padding: 12px !important;
  width: auto !important;
  min-width: 240px;
}
</style>

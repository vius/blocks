<template>
  <div class="video-upload-button">
    <input ref="fileInput" type="file" accept="video/*" multiple @change="handleFileSelect" style="display: none" />

    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <button class="ghost-btn" title="Insert Video">
          <VideoIcon :size="16" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="px-2 gap-1 flex flex-col" :sideOffset="11">
        <DropdownMenuItem as-child @click="openFileDialog" class="flex cursor-pointer">
          <section>
            <Upload :size="16" class="mr-2" />
            <span>Upload from device</span>
          </section>
        </DropdownMenuItem>
        <DropdownMenuItem as-child @click="showUrlInput = true" class="flex cursor-pointer">
          <section>
            <Link :size="16" class="mr-2" />
            <span>Insert from URL</span>
          </section>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <!-- URL Input Dialog -->
    <div v-if="showUrlInput" class="url-input-overlay" @click.self="showUrlInput = false">
      <div class="url-input-dialog">
        <h3>Insert Video from URL</h3>
        <div class="input-group">
          <label>Video URL:</label>
          <input v-model="videoUrl" type="url" placeholder="https://example.com/video.mp4"
            @keyup.enter="insertVideoFromUrl" class="url-input" />
        </div>
        <div class="input-group">
          <label>Poster Image URL (optional):</label>
          <input v-model="posterUrl" type="url" placeholder="https://example.com/poster.jpg" class="url-input" />
        </div>
        <div class="input-group">
          <label class="checkbox-label">
            <input v-model="videoControls" type="checkbox" />
            <span>Show controls</span>
          </label>
          <label class="checkbox-label">
            <input v-model="videoAutoplay" type="checkbox" />
            <span>Autoplay</span>
          </label>
          <label class="checkbox-label">
            <input v-model="videoMuted" type="checkbox" />
            <span>Muted</span>
          </label>
          <label class="checkbox-label">
            <input v-model="videoLoop" type="checkbox" />
            <span>Loop</span>
          </label>
        </div>
        <div class="dialog-actions">
          <button @click="showUrlInput = false" class="cancel-btn">Cancel</button>
          <button @click="insertVideoFromUrl" :disabled="!videoUrl" class="insert-btn">Insert</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@registry/components/ui/dropdown-menu'
import { Video as VideoIcon, Upload, Link } from 'lucide-vue-next'

const props = defineProps({
  editor: {
    type: Object,
    required: true
  }
})

const fileInput = ref(null)
const showUrlInput = ref(false)
const videoUrl = ref('')
const posterUrl = ref('')
const videoControls = ref(true)
const videoAutoplay = ref(false)
const videoMuted = ref(false)
const videoLoop = ref(false)

const openFileDialog = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)

  files.forEach(file => {
    if (file.type.startsWith('video/')) {
      props.editor.commands.uploadVideo(file)
    }
  })

  // 清空文件输入
  event.target.value = ''
}

const insertVideoFromUrl = () => {
  if (!videoUrl.value) return

  props.editor.commands.setVideo({
    src: videoUrl.value,
    poster: posterUrl.value || null,
    width: '100%',
    align: 'center',
    controls: videoControls.value,
    autoplay: videoAutoplay.value,
    muted: videoMuted.value,
    loop: videoLoop.value
  })

  // 重置表单
  videoUrl.value = ''
  posterUrl.value = ''
  videoControls.value = true
  videoAutoplay.value = false
  videoMuted.value = false
  videoLoop.value = false
  showUrlInput.value = false
}
</script>

<style scoped>
.video-upload-button {
  position: relative;
}

.url-input-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.url-input-dialog {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  min-width: 400px;
  max-width: 90vw;
}

.url-input-dialog h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
}

.input-group {
  margin-bottom: 16px;
}

.input-group label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
  font-size: 14px;
}

.checkbox-label {
  display: flex !important;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px !important;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  margin: 0;
}

.url-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.url-input:focus {
  border-color: #5b48f1;
  box-shadow: 0 0 0 3px rgba(91, 72, 241, 0.1);
}

.dialog-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 20px;
}

.cancel-btn,
.insert-btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background: transparent;
  border: 1px solid #e1e5e9;
  color: #6b7280;
}

.cancel-btn:hover {
  background: #f9fafb;
}

.insert-btn {
  background: #5b48f1;
  border: 1px solid #5b48f1;
  color: white;
}

.insert-btn:hover:not(:disabled) {
  background: #4c3fd9;
  border-color: #4c3fd9;
}

.insert-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

<template>
  <div class="image-upload-button">
    <input ref="fileInput" type="file" accept="image/*" multiple @change="handleFileSelect" style="display: none" />

    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <button class="ghost-btn" title="Insert Image">
          <ImageIcon :size="16" />
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
        <h3>Insert Image from URL</h3>
        <div class="input-group">
          <label>Image URL:</label>
          <input v-model="imageUrl" type="url" placeholder="https://example.com/image.jpg"
            @keyup.enter="insertImageFromUrl" class="url-input" />
        </div>
        <div class="input-group">
          <label>Alt text (optional):</label>
          <input v-model="imageAlt" type="text" placeholder="Description of the image" class="url-input" />
        </div>
        <div class="dialog-actions">
          <button @click="showUrlInput = false" class="cancel-btn">Cancel</button>
          <button @click="insertImageFromUrl" :disabled="!imageUrl" class="insert-btn">Insert</button>
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
import { Image as ImageIcon, Upload, Link } from 'lucide-vue-next'

const props = defineProps({
  editor: {
    type: Object,
    required: true
  }
})

const fileInput = ref(null)
const showUrlInput = ref(false)
const imageUrl = ref('')
const imageAlt = ref('')

const openFileDialog = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)

  files.forEach(file => {
    if (file.type.startsWith('image/')) {
      props.editor.commands.uploadImage(file)
    }
  })

  // 清空文件输入
  event.target.value = ''
}

const insertImageFromUrl = () => {
  if (!imageUrl.value) return

  props.editor.commands.setImage({
    src: imageUrl.value,
    alt: imageAlt.value || null,
    width: '50%',
    align: 'center'
  })

  // 重置表单
  imageUrl.value = ''
  imageAlt.value = ''
  showUrlInput.value = false
}
</script>

<style scoped>
.image-upload-button {
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
  background: #4c3fd4;
}

.insert-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

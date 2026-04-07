<script setup lang="ts">
import { ref } from 'vue'
import SimpleEditor from '@registry/components/simple-editor/index.vue'

const showDialog = ref(false)
</script>

<template>
  <main>
    <button @click="showDialog = true">打开 Dialog</button>
    
    <div v-if="showDialog" class="dialog-overlay" @click.self="showDialog = false">
      <div class="dialog-content" style="width: 200px;">
        <SimpleEditor />
      </div>
    </div>
  </main>
</template>

<style scoped>
.dialog-overlay {
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

.dialog-content {
  background: white;
  border-radius: 8px;
  padding: 20px;
  max-height: 80vh;
  overflow: auto;
}
</style>
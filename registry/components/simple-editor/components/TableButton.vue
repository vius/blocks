<template>
  <button 
    class="ghost-btn" 
    @click="insertTable" 
    title="Insert Table"
    :disabled="!editor"
  >
    <Table :size="16" />
  </button>
</template>

<script setup>
import { Table } from 'lucide-vue-next'

const props = defineProps({
  editor: {
    type: Object,
    required: true
  }
})

const insertTable = () => {
  if (props.editor) {
    props.editor
      .chain()
      .focus()
      .insertTable({ 
        rows: 3, 
        cols: 3, 
        withHeaderRow: true 
      })
      .run()
  }
}
</script>

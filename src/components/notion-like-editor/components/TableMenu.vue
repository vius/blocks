<template>
  <div class="table-menu" v-if="editor && showMenu">
    <div class="menu-section">
      <h4>Table Actions</h4>
      <button @click="insertTable" class="menu-button">
        Insert Table
      </button>
      <button @click="deleteTable" class="menu-button" :disabled="!isInTable">
        Delete Table
      </button>
    </div>
    
    <div class="menu-section" v-if="isInTable">
      <h4>Rows</h4>
      <button @click="addRowBefore" class="menu-button">
        Add Row Before
      </button>
      <button @click="addRowAfter" class="menu-button">
        Add Row After
      </button>
      <button @click="deleteRow" class="menu-button">
        Delete Row
      </button>
    </div>
    
    <div class="menu-section" v-if="isInTable">
      <h4>Columns</h4>
      <button @click="addColumnBefore" class="menu-button">
        Add Column Before
      </button>
      <button @click="addColumnAfter" class="menu-button">
        Add Column After
      </button>
      <button @click="deleteColumn" class="menu-button">
        Delete Column
      </button>
    </div>
    
    <div class="menu-section" v-if="isInTable">
      <h4>Cells</h4>
      <button @click="mergeCells" class="menu-button">
        Merge Cells
      </button>
      <button @click="splitCell" class="menu-button">
        Split Cell
      </button>
      <button @click="toggleHeaderRow" class="menu-button">
        Toggle Header Row
      </button>
      <button @click="toggleHeaderColumn" class="menu-button">
        Toggle Header Column
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
  editor: {
    type: Object,
    required: true
  },
  showMenu: {
    type: Boolean,
    default: false
  }
})

const isInTable = computed(() => {
  return props.editor?.isActive('table')
})

const insertTable = () => {
  props.editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
}

const deleteTable = () => {
  props.editor.chain().focus().deleteTable().run()
}

const addRowBefore = () => {
  props.editor.chain().focus().addRowBefore().run()
}

const addRowAfter = () => {
  props.editor.chain().focus().addRowAfter().run()
}

const deleteRow = () => {
  props.editor.chain().focus().deleteRow().run()
}

const addColumnBefore = () => {
  props.editor.chain().focus().addColumnBefore().run()
}

const addColumnAfter = () => {
  props.editor.chain().focus().addColumnAfter().run()
}

const deleteColumn = () => {
  props.editor.chain().focus().deleteColumn().run()
}

const mergeCells = () => {
  props.editor.chain().focus().mergeCells().run()
}

const splitCell = () => {
  props.editor.chain().focus().splitCell().run()
}

const toggleHeaderRow = () => {
  props.editor.chain().focus().toggleHeaderRow().run()
}

const toggleHeaderColumn = () => {
  props.editor.chain().focus().toggleHeaderColumn().run()
}
</script>

<style scoped>
.table-menu {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 38px -10px rgba(22, 23, 24, 0.35), 0 10px 20px -15px rgba(22, 23, 24, 0.2);
  padding: 16px;
  min-width: 200px;
  z-index: 1000;
}

.menu-section {
  margin-bottom: 16px;
}

.menu-section:last-child {
  margin-bottom: 0;
}

.menu-section h4 {
  margin: 0 0 8px 0;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.menu-button {
  display: block;
  width: 100%;
  padding: 8px 12px;
  margin-bottom: 4px;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
  text-align: left;
  transition: background-color 0.1s ease;
}

.menu-button:hover:not(:disabled) {
  background-color: #f3f4f6;
}

.menu-button:disabled {
  color: #9ca3af;
  cursor: not-allowed;
}

.menu-button:last-child {
  margin-bottom: 0;
}
</style>

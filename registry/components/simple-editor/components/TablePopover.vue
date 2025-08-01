<template>
  <div 
    v-if="show && editor" 
    class="table-popover"
    :style="{ 
      position: 'absolute', 
      top: position.top + 'px', 
      left: position.left + 'px',
      zIndex: 1000
    }"
  >
    <div class="popover-content">
      <!-- 列操作 -->
      <div class="menu-section">
        <h4 class="section-title">列操作</h4>
        <button 
          @click="addColumnBefore" 
          class="menu-button"
          title="在前面插入列"
        >
          <Plus :size="14" />
          <span>前插列</span>
        </button>
        <button 
          @click="addColumnAfter" 
          class="menu-button"
          title="在后面插入列"
        >
          <Plus :size="14" />
          <span>后插列</span>
        </button>
        <button 
          @click="deleteColumn" 
          class="menu-button delete"
          title="删除列"
        >
          <Trash2 :size="14" />
          <span>删除列</span>
        </button>
      </div>

      <!-- 行操作 -->
      <div class="menu-section">
        <h4 class="section-title">行操作</h4>
        <button 
          @click="addRowBefore" 
          class="menu-button"
          title="在上面插入行"
        >
          <Plus :size="14" />
          <span>上插行</span>
        </button>
        <button 
          @click="addRowAfter" 
          class="menu-button"
          title="在下面插入行"
        >
          <Plus :size="14" />
          <span>下插行</span>
        </button>
        <button 
          @click="deleteRow" 
          class="menu-button delete"
          title="删除行"
        >
          <Trash2 :size="14" />
          <span>删除行</span>
        </button>
      </div>

      <!-- 单元格操作 -->
      <div class="menu-section">
        <h4 class="section-title">单元格</h4>
        <button 
          @click="mergeCells" 
          class="menu-button"
          title="合并单元格"
          :disabled="!canMergeCells"
        >
          <Combine :size="14" />
          <span>合并</span>
        </button>
        <button
          @click="splitCell"
          class="menu-button"
          title="拆分单元格"
          :disabled="!canSplitCell"
        >
          <SeparatorHorizontal :size="14" />
          <span>拆分</span>
        </button>
      </div>

      <!-- 表格操作 -->
      <div class="menu-section">
        <h4 class="section-title">表格</h4>
        <button 
          @click="deleteTable" 
          class="menu-button delete"
          title="删除表格"
        >
          <Trash2 :size="14" />
          <span>删除表格</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Plus, Trash2, Combine, SeparatorHorizontal } from 'lucide-vue-next'

const props = defineProps({
  editor: {
    type: Object,
    required: true
  },
  show: {
    type: Boolean,
    default: false
  },
  position: {
    type: Object,
    default: () => ({ top: 0, left: 0 })
  }
})

const emit = defineEmits(['close'])

// 检查是否可以合并单元格
const canMergeCells = computed(() => {
  return props.editor?.can().mergeCells()
})

// 检查是否可以拆分单元格
const canSplitCell = computed(() => {
  return props.editor?.can().splitCell()
})

// 列操作
const addColumnBefore = () => {
  props.editor?.chain().focus().addColumnBefore().run()
  emit('close')
}

const addColumnAfter = () => {
  props.editor?.chain().focus().addColumnAfter().run()
  emit('close')
}

const deleteColumn = () => {
  props.editor?.chain().focus().deleteColumn().run()
  emit('close')
}

// 行操作
const addRowBefore = () => {
  props.editor?.chain().focus().addRowBefore().run()
  emit('close')
}

const addRowAfter = () => {
  props.editor?.chain().focus().addRowAfter().run()
  emit('close')
}

const deleteRow = () => {
  props.editor?.chain().focus().deleteRow().run()
  emit('close')
}

// 单元格操作
const mergeCells = () => {
  props.editor?.chain().focus().mergeCells().run()
  emit('close')
}

const splitCell = () => {
  props.editor?.chain().focus().splitCell().run()
  emit('close')
}

// 表格操作
const deleteTable = () => {
  props.editor?.chain().focus().deleteTable().run()
  emit('close')
}
</script>

<style scoped lang="less">
.table-popover {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 38px -10px rgba(22, 23, 24, 0.35), 0 10px 20px -15px rgba(22, 23, 24, 0.2);
  padding: 8px;
  min-width: 180px;
}

.popover-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-section {
  display: flex;
  flex-direction: column;
  gap: 4px;

  &:not(:last-child) {
    border-bottom: 1px solid #f3f4f6;
    padding-bottom: 8px;
  }
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  margin: 0 0 4px 0;
  padding: 0 4px;
}

.menu-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  color: #374151;
  transition: all 0.1s ease;
  width: 100%;
  text-align: left;

  &:hover:not(:disabled) {
    background-color: #f3f4f6;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.delete {
    color: #dc2626;

    &:hover:not(:disabled) {
      background-color: #fef2f2;
    }
  }

  span {
    flex: 1;
  }
}
</style>

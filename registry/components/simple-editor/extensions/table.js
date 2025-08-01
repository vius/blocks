import { TableKit } from '@tiptap/extension-table'
// 配置Table扩展
export const TableExtension = TableKit.configure({
  table: {
    resizable: true,
    HTMLAttributes: {
      class: 'simple-editor-table',
    },
    addOptions() {
      return {
        ...this.parent?.(),
        HTMLAttributes: {
          class: 'simple-editor-table',
        },
      }
    },
    renderHTML({ HTMLAttributes }) {
      return [
        'div',
        { class: 'table-wrapper' },
        ['table', HTMLAttributes, ['tbody', 0]]
      ]
    },
  }
})


import { VueRenderer } from '@tiptap/vue-3'
import tippy from 'tippy.js'

import CommandsList from './CommandsList.vue'

export default {
  items: ({ query }) => {
    const commands = [
      {
        title: 'Text',
        description: 'Just start typing with plain text.',
        icon: '📝',
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode('paragraph')
            .run()
        },
      },
      {
        title: 'Heading 1',
        description: 'Big section heading.',
        icon: 'H1',
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode('heading', { level: 1 })
            .run()
        },
      },
      {
        title: 'Heading 2',
        description: 'Medium section heading.',
        icon: 'H2',
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode('heading', { level: 2 })
            .run()
        },
      },
      {
        title: 'Heading 3',
        description: 'Small section heading.',
        icon: 'H3',
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode('heading', { level: 3 })
            .run()
        },
      },
      {
        title: 'Bullet List',
        description: 'Create a simple bullet list.',
        icon: '•',
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .toggleBulletList()
            .run()
        },
      },
      {
        title: 'Numbered List',
        description: 'Create a list with numbering.',
        icon: '1.',
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .toggleOrderedList()
            .run()
        },
      },
      {
        title: 'Quote',
        description: 'Capture a quote.',
        icon: '❝',
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setBlockquote()
            .run()
        },
      },
      {
        title: 'Code Block',
        description: 'Capture a code snippet.',
        icon: '{}',
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setCodeBlock()
            .run()
        },
      },
      {
        title: 'Divider',
        description: 'Visually divide blocks.',
        icon: '---',
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setHorizontalRule()
            .run()
        },
      },
      {
        title: 'Table',
        description: 'Create a table.',
        icon: '⊞',
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run()
        },
      },
      {
        title: 'Image',
        description: 'Upload or embed with a link.',
        icon: '🖼️',
        command: ({ editor, range }) => {
          const url = window.prompt('Enter image URL:')
          if (url) {
            editor
              .chain()
              .focus()
              .deleteRange(range)
              .setImage({ src: url })
              .run()
          }
        },
      },
    ]

    return commands
      .filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 10)
  },

  render: () => {
    let component
    let popup

    return {
      onStart: props => {
        component = new VueRenderer(CommandsList, {
          // using vue 2:
          // parent: this,
          // propsData: props,
          props,
          editor: props.editor,
        })

        if (!props.clientRect) {
          return
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        })
      },

      onUpdate(props) {
        component.updateProps(props)

        if (!props.clientRect) {
          return
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        })
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          popup[0].hide()

          return true
        }

        return component.ref?.onKeyDown(props)
      },

      onExit() {
        popup[0].destroy()
        component.destroy()
      },
    }
  },
}
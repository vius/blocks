import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

export const BlockExtension = Extension.create({
  name: 'blockExtension',

  addOptions() {
    return {
      types: ['paragraph', 'heading', 'bulletList', 'orderedList', 'blockquote', 'codeBlock'],
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('blockExtension'),
        
        props: {
          decorations: (state) => {
            const decorations = []
            const { doc, selection } = state
            
            // Add block handles and hover effects
            doc.descendants((node, pos) => {
              if (this.options.types.includes(node.type.name)) {
                // Add block handle decoration
                const decoration = Decoration.widget(pos, () => {
                  const handle = document.createElement('div')
                  handle.className = 'block-handle'
                  handle.innerHTML = '⋮⋮'
                  handle.contentEditable = false
                  handle.draggable = true
                  
                  // Add drag and drop functionality
                  handle.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', pos.toString())
                    handle.classList.add('dragging')
                  })
                  
                  handle.addEventListener('dragend', () => {
                    handle.classList.remove('dragging')
                  })
                  
                  return handle
                }, {
                  side: -1,
                  key: `block-handle-${pos}`,
                })
                
                decorations.push(decoration)
              }
            })
            
            return DecorationSet.create(doc, decorations)
          },
          
          handleDOMEvents: {
            dragover: (view, event) => {
              event.preventDefault()
              return false
            },
            
            drop: (view, event) => {
              event.preventDefault()
              const draggedPos = parseInt(event.dataTransfer.getData('text/plain'))
              const dropPos = view.posAtCoords({ left: event.clientX, top: event.clientY })
              
              if (draggedPos && dropPos) {
                const { tr } = view.state
                const draggedNode = view.state.doc.nodeAt(draggedPos)
                
                if (draggedNode) {
                  // Remove the dragged node
                  tr.delete(draggedPos, draggedPos + draggedNode.nodeSize)
                  
                  // Insert it at the drop position
                  const adjustedDropPos = dropPos.pos > draggedPos ? 
                    dropPos.pos - draggedNode.nodeSize : dropPos.pos
                  tr.insert(adjustedDropPos, draggedNode)
                  
                  view.dispatch(tr)
                }
              }
              
              return true
            }
          }
        },
        
        view: () => ({
          update: (view, prevState) => {
            // Handle block selection and highlighting
            const { state } = view
            const { selection } = state
            
            // Remove previous block highlights
            document.querySelectorAll('.block-selected').forEach(el => {
              el.classList.remove('block-selected')
            })
            
            // Add current block highlight
            if (selection.empty) {
              const pos = selection.from
              const node = state.doc.nodeAt(pos)
              if (node && this.options.types.includes(node.type.name)) {
                const dom = view.nodeDOM(pos)
                if (dom && dom.classList) {
                  dom.classList.add('block-selected')
                }
              }
            }
          }
        })
      })
    ]
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          'data-block-id': {
            default: null,
            parseHTML: element => element.getAttribute('data-block-id'),
            renderHTML: attributes => {
              if (!attributes['data-block-id']) {
                return {}
              }
              return {
                'data-block-id': attributes['data-block-id'],
              }
            },
          },
        },
      },
    ]
  },

  onCreate() {
    // Add block IDs to existing nodes
    this.editor.commands.command(({ tr, state }) => {
      state.doc.descendants((node, pos) => {
        if (this.options.types.includes(node.type.name) && !node.attrs['data-block-id']) {
          tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            'data-block-id': `block-${Math.random().toString(36).substr(2, 9)}`,
          })
        }
      })
      return true
    })
  },
})

export default BlockExtension

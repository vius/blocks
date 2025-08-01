import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

export const DragDrop = Extension.create({
  name: 'dragDrop',

  addOptions() {
    return {
      dragHandleWidth: 24,
      scrollThreshold: 50,
      scrollSpeed: 10,
    }
  },

  addProseMirrorPlugins() {
    let draggedElement = null
    let dropLine = null
    let autoScrollInterval = null

    return [
      new Plugin({
        key: new PluginKey('dragDrop'),
        
        props: {
          decorations: (state) => {
            const decorations = []
            const { doc, selection } = state
            
            doc.descendants((node, pos) => {
              // Only add drag handles to block-level nodes
              if (node.isBlock && node.type.name !== 'doc') {
                const decoration = Decoration.widget(pos, () => {
                  const handle = document.createElement('div')
                  handle.className = 'drag-handle'
                  handle.innerHTML = `
                    <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
                      <circle cx="2" cy="2" r="1" fill="currentColor"/>
                      <circle cx="2" cy="6" r="1" fill="currentColor"/>
                      <circle cx="2" cy="10" r="1" fill="currentColor"/>
                      <circle cx="2" cy="14" r="1" fill="currentColor"/>
                      <circle cx="6" cy="2" r="1" fill="currentColor"/>
                      <circle cx="6" cy="6" r="1" fill="currentColor"/>
                      <circle cx="6" cy="10" r="1" fill="currentColor"/>
                      <circle cx="6" cy="14" r="1" fill="currentColor"/>
                    </svg>
                  `
                  handle.contentEditable = false
                  handle.draggable = true
                  handle.dataset.pos = pos
                  
                  // Drag start
                  handle.addEventListener('dragstart', (e) => {
                    draggedElement = {
                      pos: parseInt(pos),
                      node: node,
                      nodeSize: node.nodeSize
                    }
                    
                    handle.classList.add('dragging')
                    
                    // Create custom drag image
                    const dragImage = document.createElement('div')
                    dragImage.className = 'drag-preview'
                    dragImage.textContent = `Moving ${node.type.name}...`
                    dragImage.style.cssText = `
                      position: absolute;
                      top: -1000px;
                      background: #f3f4f6;
                      border: 1px solid #d1d5db;
                      border-radius: 6px;
                      padding: 8px 12px;
                      font-size: 14px;
                      color: #6b7280;
                      white-space: nowrap;
                    `
                    document.body.appendChild(dragImage)
                    e.dataTransfer.setDragImage(dragImage, 0, 0)
                    
                    setTimeout(() => {
                      document.body.removeChild(dragImage)
                    }, 0)
                    
                    e.dataTransfer.effectAllowed = 'move'
                  })
                  
                  // Drag end
                  handle.addEventListener('dragend', () => {
                    handle.classList.remove('dragging')
                    draggedElement = null
                    
                    // Clear drop line
                    if (dropLine) {
                      dropLine.remove()
                      dropLine = null
                    }
                    
                    // Clear auto scroll
                    if (autoScrollInterval) {
                      clearInterval(autoScrollInterval)
                      autoScrollInterval = null
                    }
                  })
                  
                  return handle
                }, {
                  side: -1,
                  key: `drag-handle-${pos}`,
                })
                
                decorations.push(decoration)
              }
            })
            
            return DecorationSet.create(doc, decorations)
          },
          
          handleDOMEvents: {
            dragover: (view, event) => {
              event.preventDefault()
              
              if (!draggedElement) return false
              
              const editorRect = view.dom.getBoundingClientRect()
              const y = event.clientY - editorRect.top
              
              // Auto scroll
              if (y < this.options.scrollThreshold) {
                if (!autoScrollInterval) {
                  autoScrollInterval = setInterval(() => {
                    view.dom.scrollTop -= this.options.scrollSpeed
                  }, 16)
                }
              } else if (y > editorRect.height - this.options.scrollThreshold) {
                if (!autoScrollInterval) {
                  autoScrollInterval = setInterval(() => {
                    view.dom.scrollTop += this.options.scrollSpeed
                  }, 16)
                }
              } else {
                if (autoScrollInterval) {
                  clearInterval(autoScrollInterval)
                  autoScrollInterval = null
                }
              }
              
              // Show drop line
              const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })
              if (pos) {
                this.showDropLine(view, pos.pos, event.clientY)
              }
              
              return false
            },
            
            drop: (view, event) => {
              event.preventDefault()
              
              if (!draggedElement) return false
              
              const dropPos = view.posAtCoords({ left: event.clientX, top: event.clientY })
              
              if (dropPos && draggedElement.pos !== dropPos.pos) {
                const { tr } = view.state
                const { pos, node, nodeSize } = draggedElement
                
                // Calculate the actual drop position
                let actualDropPos = dropPos.pos
                
                // If dropping after the dragged element, adjust for the removal
                if (actualDropPos > pos) {
                  actualDropPos -= nodeSize
                }
                
                // Remove the dragged node
                tr.delete(pos, pos + nodeSize)
                
                // Insert at the drop position
                tr.insert(actualDropPos, node)
                
                view.dispatch(tr)
              }
              
              // Clear drop line
              if (dropLine) {
                dropLine.remove()
                dropLine = null
              }
              
              return true
            },
            
            dragleave: (view, event) => {
              // Only clear if leaving the editor entirely
              if (!view.dom.contains(event.relatedTarget)) {
                if (dropLine) {
                  dropLine.remove()
                  dropLine = null
                }
                
                if (autoScrollInterval) {
                  clearInterval(autoScrollInterval)
                  autoScrollInterval = null
                }
              }
              
              return false
            }
          }
        },
        
        view: () => ({
          destroy: () => {
            if (autoScrollInterval) {
              clearInterval(autoScrollInterval)
            }
            if (dropLine) {
              dropLine.remove()
            }
          }
        })
      })
    ]
  },

  addMethods() {
    return {
      showDropLine(view, pos, clientY) {
        // Remove existing drop line
        if (dropLine) {
          dropLine.remove()
        }
        
        // Create new drop line
        dropLine = document.createElement('div')
        dropLine.className = 'drop-line'
        dropLine.style.cssText = `
          position: absolute;
          left: 0;
          right: 0;
          height: 2px;
          background: #3b82f6;
          z-index: 1000;
          pointer-events: none;
        `
        
        // Position the drop line
        const editorRect = view.dom.getBoundingClientRect()
        dropLine.style.top = `${clientY - editorRect.top}px`
        
        view.dom.appendChild(dropLine)
      }
    }
  }
})

export default DragDrop

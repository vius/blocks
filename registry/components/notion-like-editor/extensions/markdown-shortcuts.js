import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

export const MarkdownShortcuts = Extension.create({
  name: 'markdownShortcuts',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('markdownShortcuts'),
        
        props: {
          handleTextInput: (view, from, to, text) => {
            const { state } = view
            const { tr, selection } = state
            const { $from } = selection
            
            // Get the text before the cursor
            const textBefore = $from.parent.textBetween(0, $from.parentOffset, null, '\ufffc')
            const fullText = textBefore + text
            
            // Heading shortcuts
            const headingMatch = fullText.match(/^(#{1,6})\s$/)
            if (headingMatch) {
              const level = headingMatch[1].length
              const start = from - headingMatch[0].length + 1
              
              tr.delete(start, to)
              tr.setBlockType(start, start, state.schema.nodes.heading, { level })
              view.dispatch(tr)
              return true
            }
            
            // Bullet list shortcut
            if (fullText.match(/^[-*+]\s$/)) {
              const start = from - 2
              tr.delete(start, to)
              tr.wrapIn(state.schema.nodes.bulletList)
              view.dispatch(tr)
              return true
            }
            
            // Ordered list shortcut
            if (fullText.match(/^1\.\s$/)) {
              const start = from - 3
              tr.delete(start, to)
              tr.wrapIn(state.schema.nodes.orderedList)
              view.dispatch(tr)
              return true
            }
            
            // Blockquote shortcut
            if (fullText.match(/^>\s$/)) {
              const start = from - 2
              tr.delete(start, to)
              tr.setBlockType(start, start, state.schema.nodes.blockquote)
              view.dispatch(tr)
              return true
            }
            
            // Code block shortcut
            if (fullText.match(/^```\s$/)) {
              const start = from - 4
              tr.delete(start, to)
              tr.setBlockType(start, start, state.schema.nodes.codeBlock)
              view.dispatch(tr)
              return true
            }
            
            // Horizontal rule shortcut
            if (fullText.match(/^---\s$/)) {
              const start = from - 4
              tr.delete(start, to)
              tr.replaceWith(start, start, state.schema.nodes.horizontalRule.create())
              view.dispatch(tr)
              return true
            }
            
            return false
          },
          
          handleKeyDown: (view, event) => {
            const { state } = view
            const { tr, selection } = state
            const { $from } = selection
            
            // Handle space key for inline formatting
            if (event.key === ' ') {
              const textBefore = $from.parent.textBetween(0, $from.parentOffset, null, '\ufffc')
              
              // Bold shortcut **text**
              const boldMatch = textBefore.match(/\*\*([^*]+)\*\*$/)
              if (boldMatch) {
                const start = $from.pos - boldMatch[0].length
                const end = $from.pos
                const text = boldMatch[1]
                
                tr.delete(start, end)
                tr.insertText(text, start)
                tr.addMark(start, start + text.length, state.schema.marks.bold.create())
                view.dispatch(tr)
                return true
              }
              
              // Italic shortcut *text*
              const italicMatch = textBefore.match(/\*([^*]+)\*$/)
              if (italicMatch) {
                const start = $from.pos - italicMatch[0].length
                const end = $from.pos
                const text = italicMatch[1]
                
                tr.delete(start, end)
                tr.insertText(text, start)
                tr.addMark(start, start + text.length, state.schema.marks.italic.create())
                view.dispatch(tr)
                return true
              }
              
              // Code shortcut `text`
              const codeMatch = textBefore.match(/`([^`]+)`$/)
              if (codeMatch) {
                const start = $from.pos - codeMatch[0].length
                const end = $from.pos
                const text = codeMatch[1]
                
                tr.delete(start, end)
                tr.insertText(text, start)
                tr.addMark(start, start + text.length, state.schema.marks.code.create())
                view.dispatch(tr)
                return true
              }
              
              // Strikethrough shortcut ~~text~~
              const strikeMatch = textBefore.match(/~~([^~]+)~~$/)
              if (strikeMatch && state.schema.marks.strike) {
                const start = $from.pos - strikeMatch[0].length
                const end = $from.pos
                const text = strikeMatch[1]
                
                tr.delete(start, end)
                tr.insertText(text, start)
                tr.addMark(start, start + text.length, state.schema.marks.strike.create())
                view.dispatch(tr)
                return true
              }
            }
            
            // Handle Enter key for continuing lists
            if (event.key === 'Enter') {
              const { $from } = selection
              const parent = $from.parent
              
              // If we're in an empty list item, exit the list
              if (parent.type.name === 'listItem' && parent.textContent === '') {
                const grandParent = $from.node(-1)
                if (grandParent.type.name === 'bulletList' || grandParent.type.name === 'orderedList') {
                  tr.lift($from.pos, $from.pos)
                  tr.setBlockType($from.pos, $from.pos, state.schema.nodes.paragraph)
                  view.dispatch(tr)
                  return true
                }
              }
            }
            
            return false
          }
        }
      })
    ]
  }
})

export default MarkdownShortcuts

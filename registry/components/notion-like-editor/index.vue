<template>
  <div v-if="editor" class="container">
    <div class="control-group">
      <div class="button-group">
        <button @click="editor.chain().focus().toggleBold().run()"
          :disabled="!editor.can().chain().focus().toggleBold().run()"
          :class="{ 'is-active': editor.isActive('bold') }">
          Bold
        </button>
        <button @click="editor.chain().focus().toggleItalic().run()"
          :disabled="!editor.can().chain().focus().toggleItalic().run()"
          :class="{ 'is-active': editor.isActive('italic') }">
          Italic
        </button>
        <button @click="editor.chain().focus().toggleStrike().run()"
          :disabled="!editor.can().chain().focus().toggleStrike().run()"
          :class="{ 'is-active': editor.isActive('strike') }">
          Strike
        </button>
        <button @click="editor.chain().focus().toggleCode().run()"
          :disabled="!editor.can().chain().focus().toggleCode().run()"
          :class="{ 'is-active': editor.isActive('code') }">
          Code
        </button>
        <button @click="editor.chain().focus().unsetAllMarks().run()">Clear marks</button>
        <button @click="editor.chain().focus().clearNodes().run()">Clear nodes</button>
        <button @click="editor.chain().focus().setParagraph().run()"
          :class="{ 'is-active': editor.isActive('paragraph') }">
          Paragraph
        </button>
        <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
          H1
        </button>
        <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
          H2
        </button>
        <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
          H3
        </button>
        <button @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }">
          H4
        </button>
        <button @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }">
          H5
        </button>
        <button @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }">
          H6
        </button>
        <button @click="editor.chain().focus().toggleBulletList().run()"
          :class="{ 'is-active': editor.isActive('bulletList') }">
          Bullet list
        </button>
        <button @click="editor.chain().focus().toggleOrderedList().run()"
          :class="{ 'is-active': editor.isActive('orderedList') }">
          Ordered list
        </button>
        <button @click="editor.chain().focus().toggleCodeBlock().run()"
          :class="{ 'is-active': editor.isActive('codeBlock') }">
          Code block
        </button>
        <button @click="editor.chain().focus().toggleBlockquote().run()"
          :class="{ 'is-active': editor.isActive('blockquote') }">
          Blockquote
        </button>
        <button @click="editor.chain().focus().setHorizontalRule().run()">Horizontal rule</button>
        <button @click="editor.chain().focus().setHardBreak().run()">Hard break</button>
        <button @click="editor.chain().focus().undo().run()" :disabled="!editor.can().chain().focus().undo().run()">
          Undo
        </button>
        <button @click="editor.chain().focus().redo().run()" :disabled="!editor.can().chain().focus().redo().run()">
          Redo
        </button>
        <button @click="editor.chain().focus().setColor('#958DF1').run()"
          :class="{ 'is-active': editor.isActive('textStyle', { color: '#958DF1' }) }">
          Purple
        </button>
      </div>
    </div>
    <editor-content :editor="editor" />
  </div>
</template>

<script setup>
import { ListItem } from '@tiptap/extension-list'
import { Color, TextStyle } from '@tiptap/extension-text-style'
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3'
import customComment from "@rcode-link/tiptap-comments";
import { onMounted, onUnmounted, ref } from 'vue';
import ImageResize from 'tiptap-extension-resize-image';
const editor = ref(null)
onMounted(() => {
  editor.value = new Editor({
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure({ types: [ListItem.name] }),
      StarterKit,
      customComment,
      ImageResize
    ],
    content: `
        <h2>
          Hi there,
        </h2>
        <img src="http://gips3.baidu.com/it/u=3886271102,3123389489&fm=3028&app=3028&f=JPEG&fmt=auto?w=1280&h=960" />
        <p>
          this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
        </p>
        <ul>
          <li>
            That’s a bullet list with one …
          </li>
          <li>
            … or two list items.
          </li>
        </ul>
        <p>
          Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
        </p>
        <pre><code class="language-css">body {
  display: none;
}</code></pre>
        <p>
          I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
        </p>
        <blockquote>
          Wow, that’s amazing. Good work, boy! 👏
          <br />
          — Mom
        </blockquote>
      `,
  })
  const list = editor.value.storage.comment.comments
  editor.value.commands.addComments({
    comment: '测试评论内容'
  })
})

onUnmounted(() => {
  editor.value.destroy()
}) 
</script>
<style>
:root {
  --white: #fff;
  --black: #2e2b29;
  --black-contrast: #110f0e;
  --gray-1: rgba(61, 37, 20, .05);
  --gray-2: rgba(61, 37, 20, .08);
  --gray-3: rgba(61, 37, 20, .12);
  --gray-4: rgba(53, 38, 28, .3);
  --gray-5: rgba(28, 25, 23, .6);
  --green: #22c55e;
  --purple: #6a00f5;
  --purple-contrast: #5800cc;
  --purple-light: rgba(88, 5, 255, .05);
  --yellow-contrast: #facc15;
  --yellow: rgba(250, 204, 21, .4);
  --yellow-light: #fffae5;
  --red: #ff5c33;
  --red-light: #ffebe5;
  --shadow: 0px 12px 33px 0px rgba(0, 0, 0, .06), 0px 3.618px 9.949px 0px rgba(0, 0, 0, .04)
}

*,
*:before,
*:after {
  box-sizing: border-box
}

html {
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", Segoe UI Symbol, "Noto Color Emoji";
  line-height: 1.5;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased
}

body {
  min-height: 25rem;
  margin: 0
}

:first-child {
  margin-top: 0
}

.tiptap {
  caret-color: var(--purple);
  margin: 1.5rem
}

.tiptap:focus {
  outline: none
}

::-webkit-scrollbar {
  height: 14px;
  width: 14px
}

::-webkit-scrollbar-track {
  background-clip: padding-box;
  background-color: transparent;
  border: 4px solid transparent;
  border-radius: 8px
}

::-webkit-scrollbar-thumb {
  background-clip: padding-box;
  background-color: #0000;
  border: 4px solid rgba(0, 0, 0, 0);
  border-radius: 8px
}

:hover::-webkit-scrollbar-thumb {
  background-color: #0000001a
}

::-webkit-scrollbar-thumb:hover {
  background-color: #00000026
}

::-webkit-scrollbar-button {
  display: none;
  height: 0;
  width: 0
}

::-webkit-scrollbar-corner {
  background-color: transparent
}

button,
input,
select,
textarea {
  background: var(--gray-2);
  border-radius: .5rem;
  border: none;
  color: var(--black);
  font-family: inherit;
  font-size: .875rem;
  font-weight: 500;
  line-height: 1.15;
  margin: none;
  padding: .375rem .625rem;
  transition: all .2s cubic-bezier(.65, .05, .36, 1)
}

button:hover,
input:hover,
select:hover,
textarea:hover {
  background-color: var(--gray-3);
  color: var(--black-contrast)
}

button[disabled],
input[disabled],
select[disabled],
textarea[disabled] {
  background: var(--gray-1);
  color: var(--gray-4)
}

button:checked,
input:checked,
select:checked,
textarea:checked {
  accent-color: var(--purple)
}

button.primary,
input.primary,
select.primary,
textarea.primary {
  background: var(--black);
  color: var(--white)
}

button.primary:hover,
input.primary:hover,
select.primary:hover,
textarea.primary:hover {
  background-color: var(--black-contrast)
}

button.primary[disabled],
input.primary[disabled],
select.primary[disabled],
textarea.primary[disabled] {
  background: var(--gray-1);
  color: var(--gray-4)
}

button.is-active,
input.is-active,
select.is-active,
textarea.is-active {
  background: var(--purple);
  color: var(--white)
}

button.is-active:hover,
input.is-active:hover,
select.is-active:hover,
textarea.is-active:hover {
  background-color: var(--purple-contrast);
  color: var(--white)
}

button:not([disabled]),
select:not([disabled]) {
  cursor: pointer
}

input[type=text],
textarea {
  background-color: unset;
  border: 1px solid var(--gray-3);
  border-radius: .5rem;
  color: var(--black)
}

input[type=text]::-moz-placeholder,
textarea::-moz-placeholder {
  color: var(--gray-4)
}

input[type=text]::placeholder,
textarea::placeholder {
  color: var(--gray-4)
}

input[type=text]:hover,
textarea:hover {
  background-color: unset;
  border-color: var(--gray-4)
}

input[type=text]:focus-visible,
input[type=text]:focus,
textarea:focus-visible,
textarea:focus {
  border-color: var(--purple);
  outline: none
}

select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="Gray" d="M7 10l5 5 5-5z"/></svg>');
  background-repeat: no-repeat;
  background-position: right .1rem center;
  background-size: 1.25rem 1.25rem;
  padding-right: 1.25rem
}

select:focus {
  outline: 0
}

form {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: .25rem
}

.hint {
  align-items: center;
  background-color: var(--yellow-light);
  border-radius: .5rem;
  border: 1px solid var(--gray-2);
  display: flex;
  flex-direction: row;
  font-size: .75rem;
  gap: .25rem;
  line-height: 1.15;
  padding: .3rem .5rem
}

.hint.purple-spinner,
.hint.error {
  justify-content: center;
  text-align: center;
  width: 100%
}

.hint .badge {
  background-color: var(--gray-1);
  border: 1px solid var(--gray-3);
  border-radius: 2rem;
  color: var(--gray-5);
  font-size: .625rem;
  font-weight: 700;
  line-height: 1;
  padding: .25rem .5rem
}

.hint.purple-spinner {
  background-color: var(--purple-light)
}

.hint.purple-spinner:after {
  content: "";
  background-image: url("data:image/svg+xml;utf8,<svg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='28px' height='30px' viewBox='0 0 24 30' style='enable-background:new 0 0 50 50;' xml:space='preserve'><rect x='0' y='10' width='6' height='10' fill='%236A00F5' rx='3' ry='3'><animateTransform attributeType='xml' attributeName='transform' type='translate' values='0 0; 0 5; 0 -5; 0 0' begin='0' dur='0.6s' repeatCount='indefinite'/></rect><rect x='10' y='10' width='6' height='10' fill='%236A00F5' rx='3' ry='3'><animateTransform attributeType='xml' attributeName='transform' type='translate' values='0 0; 0 5; 0 -5; 0 0' begin='0.2s' dur='0.6s' repeatCount='indefinite'/></rect><rect x='20' y='10' width='6' height='10' fill='%236A00F5' rx='3' ry='3'><animateTransform attributeType='xml' attributeName='transform' type='translate' values='0 0; 0 5; 0 -5; 0 0' begin='0.4s' dur='0.6s' repeatCount='indefinite'/></rect></svg>");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  height: 1rem;
  width: 1rem
}

.hint.error {
  background-color: var(--red-light)
}

.label,
.label-small,
.label-large {
  color: var(--black);
  font-size: .8125rem;
  font-weight: 500;
  line-height: 1.15
}

.label-small {
  color: var(--gray-5);
  font-size: .75rem;
  font-weight: 400
}

.label-large {
  font-size: .875rem;
  font-weight: 700
}

hr {
  border: none;
  border-top: 1px solid var(--gray-3);
  margin: 0;
  width: 100%
}

kbd {
  background-color: var(--gray-2);
  border: 1px solid var(--gray-2);
  border-radius: .25rem;
  font-size: .6rem;
  line-height: 1.15;
  padding: .1rem .25rem;
  text-transform: uppercase
}

#app,
.container {
  display: flex;
  flex-direction: column
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: .25rem
}

.control-group {
  align-items: flex-start;
  background-color: var(--white);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem
}

.control-group .sticky {
  position: sticky;
  top: 0
}

[data-node-view-wrapper]>.control-group {
  padding: 0
}

.flex-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
  width: 100%
}

.switch-group {
  align-items: center;
  background: var(--gray-2);
  border-radius: .5rem;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  flex: 0 1 auto;
  justify-content: flex-start;
  padding: .125rem
}

.switch-group label {
  align-items: center;
  border-radius: .375rem;
  color: var(--gray-5);
  cursor: pointer;
  display: flex;
  flex-direction: row;
  font-size: .75rem;
  font-weight: 500;
  gap: .25rem;
  line-height: 1.15;
  min-height: 1.5rem;
  padding: 0 .375rem;
  transition: all .2s cubic-bezier(.65, .05, .36, 1)
}

.switch-group label:has(input:checked) {
  background-color: var(--white);
  color: var(--black-contrast)
}

.switch-group label:hover {
  color: var(--black)
}

.switch-group label input {
  display: none;
  margin: unset
}

.output-group {
  background-color: var(--gray-1);
  display: flex;
  flex-direction: column;
  font-family: JetBrainsMono, monospace;
  font-size: .75rem;
  gap: 1rem;
  margin-top: 2.5rem;
  padding: 1.5rem
}

.output-group label {
  color: var(--black);
  font-size: .875rem;
  font-weight: 700;
  line-height: 1.15
}
</style>
<style lang="less">
/* Basic editor styles */
.tiptap {
  :first-child {
    margin-top: 0;
  }

  /* List styles */
  ul,
  ol {
    padding: 0 1rem;
    margin: 1.25rem 1rem 1.25rem 0.4rem;

    li p {
      margin-top: 0.25em;
      margin-bottom: 0.25em;
    }
  }

  /* Heading styles */
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
    margin-top: 2.5rem;
    text-wrap: pretty;
    font-weight: bolder;
  }

  h1,
  h2 {
    margin-top: 3.5rem;
    margin-bottom: 1.5rem;
  }

  h1 {
    font-size: 1.4rem;
  }

  h2 {
    font-size: 1.2rem;
  }

  h3 {
    font-size: 1.1rem;
  }

  h4,
  h5,
  h6 {
    font-size: 1rem;
  }

  /* Code and preformatted text styles */
  code {
    background-color: var(--purple-light);
    border-radius: 0.4rem;
    color: var(--black);
    font-size: 0.85rem;
    padding: 0.25em 0.3em;
  }

  pre {
    background: var(--black);
    border-radius: 0.5rem;
    color: var(--white);
    font-family: 'JetBrainsMono', monospace;
    margin: 1.5rem 0;
    padding: 0.75rem 1rem;

    code {
      background: none;
      color: inherit;
      font-size: 0.8rem;
      padding: 0;
    }
  }

  blockquote {
    border-left: 3px solid var(--gray-3);
    margin: 1.5rem 0;
    padding-left: 1rem;
  }

  hr {
    border: none;
    border-top: 1px solid var(--gray-2);
    margin: 2rem 0;
  }
}
</style>
<template>
  <div class="simple-editor" ref="el">
    <div v-if="editor" class="toolbar">
      <button class="ghost-btn" @click="editor.chain().focus().undo().run()"
        :disabled="!editor.can().chain().focus().undo().run()" title="Undo">
        <Undo2 :size="16" />
      </button>
      <button class="ghost-btn" @click="editor.chain().focus().redo().run()"
        :disabled="!editor.can().chain().focus().redo().run()" title="Redo">
        <Redo2 :size="16" />
      </button>
      <div class="divider"></div>

      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <button class="ghost-btn !gap-0 !px-1 w-9 justify-between">
            <template v-if="editor.getAttributes('heading').level">
              <span class="text-[#5b48f1] text-xs">H{{ editor.getAttributes('heading').level }}</span>
            </template>
            <template v-else>
              <Pilcrow :size="16" />
            </template>
            <ChevronDown :size="10" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="px-2 gap-1 flex flex-col" :sideOffset="11">
          <DropdownMenuItem as-child @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
            :class="{ 'bg-accent': editor.isActive('heading', { level: 1 }) }" class="flex">
            <section>
              <span class="mr-2" :class="{ 'text-[#5b48f1]': editor.isActive('heading', { level: 1 }) }">H1</span>
              <span>Heading 1</span>
            </section>
          </DropdownMenuItem>
          <DropdownMenuItem as-child @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
            :class="{ 'bg-accent': editor.isActive('heading', { level: 2 }) }" class="flex">
            <section>
              <span class="mr-2" :class="{ 'text-[#5b48f1]': editor.isActive('heading', { level: 2 }) }">H1</span>
              <span>Heading 2</span>
            </section>
          </DropdownMenuItem>
          <DropdownMenuItem as-child @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
            :class="{ 'bg-accent': editor.isActive('heading', { level: 3 }) }" class="flex">
            <section>
              <span class="mr-2" :class="{ 'text-[#5b48f1]': editor.isActive('heading', { level: 3 }) }">H1</span>
              <span>Heading 3</span>
            </section>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <button class="ghost-btn !gap-0 !px-1 w-9 justify-between">
            <List :size="16" v-if="editor.isActive('bulletList')" color="#5b48f1" />
            <ListOrdered :size="16" v-else-if="editor.isActive('orderedList')" color="#5b48f1" />
            <ListTodo :size="16" v-else-if="editor.isActive('taskList')" color="#5b48f1" />
            <List :size="16" v-else />
            <ChevronDown :size="10" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="px-2 gap-1 flex flex-col" :sideOffset="11">
          <DropdownMenuItem as-child @click="editor.chain().focus().toggleBulletList().run()"
            :class="{ 'bg-accent': editor.isActive('bulletList') }" class="flex">
            <section>
              <List :size="16" :color="editor.isActive('bulletList') ? '#5b48f1' : '#343434'" />
              <span>Bullet List</span>
            </section>
          </DropdownMenuItem>
          <DropdownMenuItem as-child @click="editor.chain().focus().toggleOrderedList().run()"
            :class="{ 'bg-accent': editor.isActive('orderedList') }" class="flex">
            <section>
              <ListOrdered :size="16" :color="editor.isActive('orderedList') ? '#5b48f1' : '#343434'" />
              <span>Ordered List</span>
            </section>
          </DropdownMenuItem>
          <DropdownMenuItem as-child @click="editor.chain().focus().toggleTaskList().run()"
            :class="{ 'bg-accent': editor.isActive('taskList') }" class="flex">
            <section>
              <ListTodo :size="16" :color="editor.isActive('taskList') ? '#5b48f1' : '#343434'" />
              <span>Task List</span>
            </section>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <button class="ghost-btn" @click="editor.chain().focus().toggleBlockquote().run()"
        :class="{ 'is-active': editor.isActive('blockquote') }" title="Blockquote">
        <Quote :size="16" />
      </button>
      <button class="ghost-btn" @click="editor.chain().focus().toggleCodeBlock().run()"
        :class="{ 'is-active': editor.isActive('codeBlock') }" title="Code block">
        <Code2 :size="16" />
      </button>
      <div class="divider"></div>

      <button class="ghost-btn" @click="editor.chain().focus().toggleBold().run()"
        :disabled="!editor.can().chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }"
        title="Bold">
        <Bold :size="16" />
      </button>
      <button class="ghost-btn" @click="editor.chain().focus().toggleItalic().run()"
        :disabled="!editor.can().chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }" title="Italic">
        <Italic :size="16" />
      </button>
      <button class="ghost-btn" @click="editor.chain().focus().toggleStrike().run()"
        :disabled="!editor.can().chain().focus().toggleStrike().run()"
        :class="{ 'is-active': editor.isActive('strike') }" title="Strike">
        <Strikethrough :size="16" />
      </button>
      <button class="ghost-btn" @click="editor.chain().focus().toggleCode().run()"
        :disabled="!editor.can().chain().focus().toggleCode().run()" :class="{ 'is-active': editor.isActive('code') }"
        title="Inline Code">
        <Code :size="16" />
      </button>
      <button class="ghost-btn" @click="editor.chain().focus().toggleUnderline().run()"
        :disabled="!editor.can().chain().focus().toggleUnderline().run()"
        :class="{ 'is-active': editor.isActive('underline') }" title="Underline">
        <Underline :size="16" />
      </button>
      <DropdownMenu v-model:open="showLink">
        <DropdownMenuTrigger as-child>
          <button class="ghost-btn" title="Link" :class="{ 'is-active': showLink }">
            <LinkIcon :size="16" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="px-2 gap-1 flex flex-col" :sideOffset="11">
          <section class="flex gap-1">
            <Input v-model="linkUrl" class="!h-7 max-h-7 box-border !ring-0"></Input>
            <button class="ghost-btn" @click="setLink">
              <CornerDownLeft :size="16" />
            </Button>
            <button class="ghost-btn" @click="openLink">
              <ExternalLink :size="16" />
            </Button>
            <button class="ghost-btn" @click="unsetLink">
              <Trash2 :size="16" />
            </Button>
          </section>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <button class="ghost-btn" title="Highlighter" :class="{ 'is-active': editor.isActive('highlight') }">
            <Highlighter :size="16" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="px-2 gap-1 flex flex-col" :sideOffset="11">
          <section class="flex gap-1">
            <button class="ghost-btn" v-for="color in hightLightColorList" :key="color"
              @click="editor.chain().focus().toggleHighlight({ color: color }).run()"
              :class="{ 'isActive': editor.isActive('highlight', { color }) }">
              <span :style="{ backgroundColor: color }" class="rounded-full w-5 h-5 inline-block"></span>
            </button>
            <div class="divider"></div>
            <button class="ghost-btn" @click="editor.commands.unsetHighlight()">
              <Ban :size="19" />
            </button>
          </section>
        </DropdownMenuContent>
      </DropdownMenu>
      <button class="ghost-btn" @click="editor.chain().focus().setHorizontalRule().run()" title="Horizontal Rule">
        <Rows2 :size="16" />
      </button>
      <div class="divider"></div>
      <button v-for="align in alignList" :key="align.value" class="ghost-btn"
        @click="editor.chain().focus().setTextAlign(align.value).run()"
        :class="{ 'is-active': editor.isActive({ textAlign: align.value }) }">
        <component :is="align.icon" :size="16"></component>
      </button>
      <div class="divider"></div>
      <ImageUploadButton :editor="editor" />
      <VideoUploadButton :editor="editor" />
      <TableButton :editor="editor" />
      <button class="ghost-btn" @click="toggle" title="Horizontal Rule">
        <Minimize :size="16" v-if="isFullscreen" />
        <Maximize :size="16" v-else />
      </button>
    </div>

    <editor-content class="tiptap" :editor="editor" @click.capture="handleClick" />

    <!-- Table Popover -->
    <TablePopover :editor="editor" :show="showTablePopover" :position="tablePopoverPosition"
      @close="hideTablePopover" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch, useTemplateRef } from 'vue'

import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import { TextStyleKit } from '@tiptap/extension-text-style'
import TextAlign from '@tiptap/extension-text-align'
import { TaskItem, TaskList } from '@tiptap/extension-list'
import { ImageUpload, VideoUpload } from './extensions/image-upload.js'
import { TableExtension } from './extensions/table.js'
import ImageUploadButton from './components/ImageUploadButton.vue'
import VideoUploadButton from './components/VideoUploadButton.vue'
import TableButton from './components/TableButton.vue'
import TablePopover from './components/TablePopover.vue'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@registry/components/ui/dropdown-menu'
import { Input } from '@registry/components/ui/input'
import {
  Pilcrow,
  ChevronDown,
  Bold,
  Italic,
  Strikethrough,
  Code,
  Code2,
  List,
  ListOrdered,
  ListTodo,
  Quote,
  Undo2,
  Redo2,
  Underline,
  Link as LinkIcon,
  Highlighter,
  Rows2,
  ExternalLink,
  Trash2,
  CornerDownLeft,
  Maximize,
  Minimize,
  Ban,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from 'lucide-vue-next'
import { useFullscreen } from '@vueuse/core'
const el = useTemplateRef('el')
const { isFullscreen, toggle } = useFullscreen(el)
const editor = ref(null)

// Table popover state
const showTablePopover = ref(false)
const tablePopoverPosition = ref({ top: 0, left: 0 })

onMounted(() => {
  editor.value = new Editor({
    extensions: [
      StarterKit.configure({
        placeholder: {
          placeholder: 'abc',
        },
        link: {
          openOnClick: false,
          enableClickSelection: true,
          autolink: false,
          HTMLAttributes: {
            rel: 'noopener noreferrer nofollow',
            target: '_blank',
            onClick: () => {
              console.log('click aaaaa=>>>')
            }
          },
        }
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({ multicolor: true }),
      TextStyleKit,
      TaskList,
      TaskItem.configure({
        nested: false,
      }),
      ImageUpload.configure({
        uploadFn: async (_file, onProgress) => {
          // 自定义上传函数
          return new Promise((resolve) => {
            // 模拟上传进度
            let progress = 0
            const interval = setInterval(() => {
              progress += Math.random() * 15 + 5
              if (progress > 100) progress = 100
              onProgress(Math.floor(progress))
              if (progress >= 100) {
                clearInterval(interval)
                // 这里应该调用真实的上传API
                setTimeout(() => {
                  resolve('https://picsum.photos/600/400?random=' + Date.now())
                }, 300)
              }
            }, 800)
          })
        },
        maxFileSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      }),
      VideoUpload.configure({
        uploadFn: async (_file, onProgress) => {
          // 自定义视频上传函数
          return new Promise((resolve) => {
            // 模拟上传进度
            let progress = 0
            const interval = setInterval(() => {
              progress += Math.random() * 10 + 3
              if (progress > 100) progress = 100
              onProgress(Math.floor(progress))
              if (progress >= 100) {
                clearInterval(interval)
                // 这里应该调用真实的视频上传API
                setTimeout(() => {
                  resolve('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4')
                }, 500)
              }
            }, 1000)
          })
        },
        maxFileSize: 100 * 1024 * 1024, // 100MB
        allowedTypes: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'],
      }),
      TableExtension
    ],
    content: `
      <h2>Welcome</h2>
      <p>This editor implements interactions similar to the Tiptap Simple template.</p>
      <p>Try <strong>bold</strong>, <em>italic</em>, lists, headings, quotes, code, links, HR, and undo/redo.</p>
    `,
    editorProps: {
      attributes: {
        class: 'content',
      },
    },
  })
})

onUnmounted(() => {
  if (editor.value) editor.value.destroy()
})

const linkUrl = ref('')
const showLink = ref(false)
const setLink = () => {
  const url = linkUrl.value
  setTimeout(() => {
    editor.value.commands.blur()
    linkUrl.value = ''
    showLink.value = false
  }, 50);
  if (url === '') {
    editor.value.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }
  editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}
const currentLink = computed(() => {
  return editor.value ? editor.value.getAttributes('link')?.href : ''
})
watch(() => currentLink.value, (val) => {
  if (val) {
    linkUrl.value = val
    showLink.value = true
  }
}, {
  immediate: true,
})
watch(() => showLink.value, (val) => {
  if (!val) {
    linkUrl.value = ''
  }
}, {
  immediate: true,
})

const unsetLink = () => {
  linkUrl.value = ''
  setLink()
}
const openLink = () => {
  window.open(linkUrl.value, '_blank')
}
const handleClick = (event) => {
  if (event.target.tagName === 'A') {
    event.preventDefault()
    const href = event.target.getAttribute('href')
    console.log('Link clicked:', href)
    if (href) {
      linkUrl.value = href
      showLink.value = true
    }
  }

  // Handle table cell clicks for popover
  if (event.target.closest('td, th') && editor.value?.isActive('table')) {
    const rect = event.target.getBoundingClientRect()
    tablePopoverPosition.value = {
      top: rect.bottom + window.scrollY + 5,
      left: rect.left + window.scrollX
    }
    showTablePopover.value = true
  } else {
    showTablePopover.value = false
  }
}

// Table popover methods
const hideTablePopover = () => {
  showTablePopover.value = false
}
const hightLightColorList = ['#ffc078', '#8ce99a', '#74c0fc', '#b197fc', '#ffa8a8']
const alignList = [{
  label: 'Left',
  value: 'left',
  icon: AlignLeft,
}, {
  label: 'Center',
  value: 'center',
  icon: AlignCenter,
}, {
  label: 'Right',
  value: 'right',
  icon: AlignRight,
}, {
  label: 'Justify',
  value: 'justify',
  icon: AlignJustify,
}]


</script>

<style scoped lang="less">
.simple-editor {
  --purple: #6a00f5;
  --purple-contrast: #5800cc;
  border: 1px solid #e8e8ef;
  border-radius: 10px;
  background: #fff;
  overflow: hidden;

  .divider {
    width: 1px;
    background: #eaeaea;
    margin: 4px 3px;
  }

  /* Toolbar */
  .toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding: 10px;
    border-bottom: 1px solid #eee;
    background: #fafafa;
    // border-radius: 10px;
    // border-
  }

  /* Content */
  :deep(.tiptap) {
    min-height: 280px;
    outline: none;

    p {
      margin: 0 0 1em 0;
    }


    h1,
    h2,
    h3 {
      margin: 1.5em 0 .5em 0;
      line-height: 1.2;
    }

    h1 {
      font-size: 1.8em;
    }

    h2 {
      font-size: 1.4em;
    }

    h3 {
      font-size: 1.2em;
    }

    ul,
    ol {
      padding-left: 1.25em;
      margin: 1em 0;
      list-style: decimal;
    }

    ul {
      list-style: disc;
    }

    li {
      margin: .25em 0;
    }

    code {
      background-color: #f1f3f4;
      padding: .2em .4em;
      border-radius: 3px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
    }

    pre {
      background-color: #0f172a;
      color: #e2e8f0;
      padding: 12px;
      border-radius: 8px;
      overflow-x: auto;
    }

    pre code {
      background: none;
      padding: 0;
    }

    blockquote {
      border-left: 3px solid #e5e7eb;
      padding-left: 12px;
      margin: 1em 0;
    }

    hr {
      border: none;
      border-top: 1px solid #e5e7eb;
      margin: 1.5em 0;
    }

    /* Placeholder style (from Placeholder ext) */
    p.is-editor-empty:first-child::before {
      color: #9ca3af;
      content: attr(data-placeholder);
      float: left;
      height: 0;
      pointer-events: none;
    }

    ul[data-type='taskList'] {
      list-style: none;
      margin-left: 0;
      padding: 0;

      li {
        align-items: flex-start;
        display: flex;

        >label {
          flex: 0 0 auto;
          margin-right: 0.5rem;
          user-select: none;
        }

        >div {
          flex: 1 1 auto;

          p {
            padding: 0;
            margin: 0;
            position: relative;
            top: -1px;
          }
        }

        &[data-checked='true'] {
          >div {
            p {
              text-decoration: line-through;
              opacity: 0.45;
            }
          }
        }
      }

      input[type='checkbox'] {
        cursor: pointer;
      }

      ul[data-type='taskList'] {
        margin: 0;
      }
    }

    a {
      color: var(--color-purple-400);
      text-decoration: underline;
      cursor: pointer;
    }

    mark {
      background-color: transparent;
      border-radius: 4px;
      -webkit-box-decoration-break: clone;
      box-decoration-break: clone;
      padding: .1rem .3rem;
    }

    /* Image paragraph styles */
    .image-paragraph {
      margin: 1em 0;

      img {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        display: block;
        transition: all 0.2s ease;
      }

      &.align-left {
        text-align: left;

        img {
          margin: 0;
        }
      }

      &.align-center {
        text-align: center;

        img {
          margin: 0 auto;
        }
      }

      &.align-right {
        text-align: right;

        img {
          margin: 0 0 0 auto;
        }
      }
    }

    /* Image upload styles */
    .image-upload-container {
      position: relative;
      display: inline-block;

      &.uploading {
        img {
          opacity: 0.5;
        }
      }

      &.error {
        padding: 16px;
        border: 2px dashed #ef4444;
        border-radius: 8px;
        background: #fef2f2;
        text-align: center;
        display: block;

        .error-message {
          color: #dc2626;
          font-size: 14px;
          margin-bottom: 8px;
          display: block;
        }

        .retry-button {
          background: #ef4444;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;

          &:hover {
            background: #dc2626;
          }
        }
      }
    }

    .upload-progress {
      position: absolute;
      bottom: 8px;
      left: 8px;
      right: 8px;
      height: 4px;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 2px;
      overflow: hidden;

      .progress-bar {
        height: 100%;
        background: #5b48f1;
        transition: width 0.3s ease;
        border-radius: 2px;
      }
    }

    .upload-text {
      position: absolute;
      bottom: 16px;
      left: 8px;
      right: 8px;
      text-align: center;
      color: white;
      font-size: 12px;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    }


    /* Selected state for image paragraphs */
    .image-paragraph.ProseMirror-selectednode {

      /* General img styles for non-paragraph images */
      &>img:not([data-type=emoji] img) {
        outline: 2px solid var(--purple-contrast);
        padding: 1px;
      }
    }

    /* Table styles */
    .tableWrapper {
      border-collapse: collapse;
      table-layout: fixed;
      width: 100%;
      margin: 1em 0;
      overflow: hidden;
      border-radius: 8px;

      /* Table-specific styling */
      table {
        border-collapse: collapse;
        margin: 0;
        overflow: hidden;
        table-layout: fixed;
        width: 100%;

        td,
        th {
          box-sizing: border-box;
          min-width: 1em;
          padding: 6px 8px;
          position: relative;
          vertical-align: top;
          border: 1px solid var(--color-gray-200);

          >* {
            margin-bottom: 0;
          }
        }

        th {
          background-color: var(--color-gray-200);
          border: 1px solid var(--color-gray-300);
          font-weight: bold;
          text-align: left;
        }

        .selectedCell:after {
          background: var(--gray-2);
          content: '';
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          pointer-events: none;
          position: absolute;
          z-index: 2;
        }

        .column-resize-handle {
          background-color: var(--purple);
          bottom: -2px;
          pointer-events: none;
          position: absolute;
          right: -2px;
          top: 0;
          width: 4px;
          cursor: move;
        }
      }

      .tableWrapper {
        margin: 1.5rem 0;
        overflow-x: auto;
      }

      &.resize-cursor {
        cursor: ew-resize;
        cursor: col-resize;
      }
    }
  }

  .tableWrapper {
    padding: 1rem 0;
    overflow-x: auto;
  }
}
</style>
<style>
.ghost-btn {
  background: transparent;
  border-radius: 10px;
  padding: 6px;
  min-width: 28px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: var(--color-gray-200);
  }

  &.isActive {
    background-color: var(--color-gray-200);
  }

  &:hover {
    background: #dadbde;
  }

  &:disabled {
    opacity: .5;
    cursor: not-allowed;
  }
}

.divider {
  width: 1px;
  background: #eaeaea;
  margin: 4px 3px;
}
</style>
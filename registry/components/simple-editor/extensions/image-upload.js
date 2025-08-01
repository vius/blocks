import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import ImageNodeView from '../components/ImageNodeView.vue'
import VideoNodeView from '../components/VideoNodeView.vue'

// 创建视频上传扩展
export const VideoUpload = Node.create({
  name: 'videoUpload',

  group: 'block',

  content: '',

  isolating: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      poster: {
        default: null,
      },
      width: {
        default: '100%',
      },
      height: {
        default: null,
      },
      align: {
        default: 'center',
      },
      uploading: {
        default: false,
      },
      progress: {
        default: 0,
      },
      error: {
        default: null,
      },
      uploadId: {
        default: null,
      },
      fileName: {
        default: null,
      },
      fileSize: {
        default: null,
      },
      controls: {
        default: true,
      },
      autoplay: {
        default: false,
      },
      muted: {
        default: false,
      },
      loop: {
        default: false,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'p.video-paragraph',
        getAttrs: (element) => {
          const video = element.querySelector('video')
          if (!video) return false

          return {
            src: video.getAttribute('src'),
            poster: video.getAttribute('poster'),
            width: video.getAttribute('width') || video.style.width,
            height: video.getAttribute('height') || video.style.height,
            align: element.getAttribute('data-align') || 'center',
            controls: video.hasAttribute('controls'),
            autoplay: video.hasAttribute('autoplay'),
            muted: video.hasAttribute('muted'),
            loop: video.hasAttribute('loop'),
          }
        },
      },
      {
        tag: 'video[src]',
        getAttrs: (element) => ({
          src: element.getAttribute('src'),
          poster: element.getAttribute('poster'),
          width: element.getAttribute('width') || element.style.width,
          height: element.getAttribute('height') || element.style.height,
          align: element.getAttribute('data-align') || 'center',
          controls: element.hasAttribute('controls'),
          autoplay: element.hasAttribute('autoplay'),
          muted: element.hasAttribute('muted'),
          loop: element.hasAttribute('loop'),
        }),
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { uploading, progress, error, align, width, uploadId: _uploadId, controls, autoplay, muted, loop, ...attrs } = HTMLAttributes

    const paragraphClass = `video-paragraph align-${align || 'center'}`
    const videoStyle = width ? `width: ${width}; max-width: 100%; height: auto;` : 'max-width: 100%; height: auto;'

    if (uploading) {
      return [
        'p',
        {
          class: paragraphClass,
          'data-align': align || 'center'
        },
        [
          'span',
          { class: 'video-upload-container uploading' },
          [
            'video',
            mergeAttributes(attrs, {
              style: `opacity: 0.5; ${videoStyle}`,
              width: width || '100%',
              controls: true
            })
          ],
          [
            'span',
            { class: 'upload-progress' },
            [
              'span',
              {
                class: 'progress-bar',
                style: `width: ${progress}%`
              }
            ]
          ],
          [
            'span',
            { class: 'upload-text' },
            `Uploading... ${progress}%`
          ]
        ]
      ]
    }

    if (error) {
      return [
        'p',
        {
          class: paragraphClass,
          'data-align': align || 'center'
        },
        [
          'span',
          { class: 'video-upload-container error' },
          [
            'span',
            { class: 'error-message' },
            `Upload failed: ${error}`
          ],
          [
            'button',
            {
              class: 'retry-button',
              onclick: 'this.closest(".video-upload-container").remove()'
            },
            'Remove'
          ]
        ]
      ]
    }

    const videoAttrs = mergeAttributes(attrs, {
      style: videoStyle,
      width: width || '100%',
      'data-align': align || 'center'
    })

    if (controls) videoAttrs.controls = true
    if (autoplay) videoAttrs.autoplay = true
    if (muted) videoAttrs.muted = true
    if (loop) videoAttrs.loop = true

    return [
      'p',
      {
        class: paragraphClass,
        'data-align': align || 'center'
      },
      [
        'video',
        videoAttrs
      ]
    ]
  },

  addNodeView() {
    return VueNodeViewRenderer(VideoNodeView)
  },

  addCommands() {
    const self = this

    const validateFile = (file) => {
      const { allowedTypes, maxFileSize } = self.options
      if (!allowedTypes.includes(file.type)) {
        console.error('File type not allowed:', file.type)
        return false
      }
      if (file.size > maxFileSize) {
        console.error('File too large:', file.name)
        return false
      }
      return true
    }

    const uploadFile = (file, view, nodeId) => {
      // 使用节点ID来查找节点，而不是依赖位置
      const findNodeByUploadId = (doc, uploadId) => {
        let foundPos = null
        doc.descendants((node, pos) => {
          if (node.type.name === self.name && node.attrs.uploadId === uploadId) {
            foundPos = pos
            return false // 停止遍历
          }
        })
        return foundPos
      }

      self.options.uploadFn(file, (progress) => {
        const nodePos = findNodeByUploadId(view.state.doc, nodeId)
        if (nodePos !== null) {
          const currentNode = view.state.doc.nodeAt(nodePos)
          if (currentNode && currentNode.type.name === self.name) {
            const newAttrs = { ...currentNode.attrs, progress }
            const tr = view.state.tr.setNodeMarkup(nodePos, null, newAttrs)
            view.dispatch(tr)
          }
        }
      }).then((url) => {
        const nodePos = findNodeByUploadId(view.state.doc, nodeId)
        if (nodePos !== null) {
          const currentNode = view.state.doc.nodeAt(nodePos)
          if (currentNode && currentNode.type.name === self.name) {
            const newAttrs = {
              ...currentNode.attrs,
              src: url,
              uploading: false,
              progress: 100,
              error: null,
              uploadId: null, // 清除上传ID
            }
            const tr = view.state.tr.setNodeMarkup(nodePos, null, newAttrs)
            view.dispatch(tr)
          }
        }
      }).catch((error) => {
        const nodePos = findNodeByUploadId(view.state.doc, nodeId)
        if (nodePos !== null) {
          const currentNode = view.state.doc.nodeAt(nodePos)
          if (currentNode && currentNode.type.name === self.name) {
            const newAttrs = {
              ...currentNode.attrs,
              uploading: false,
              error: error?.message || String(error),
            }
            const tr = view.state.tr.setNodeMarkup(nodePos, null, newAttrs)
            view.dispatch(tr)
          }
        }
      })
    }

    return {
      setVideo: (options) => ({ commands }) => {
        return commands.insertContent({
          type: self.name,
          attrs: options,
        })
      },
      uploadVideo: (file) => ({ tr, dispatch, state, view }) => {
        if (!validateFile(file)) {
          return false
        }

        // 生成唯一的上传ID
        const uploadId = `upload_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`

        // 格式化文件大小
        const formatFileSize = (bytes) => {
          if (bytes === 0) return '0 B'
          const k = 1024
          const sizes = ['B', 'KB', 'MB', 'GB']
          const i = Math.floor(Math.log(bytes) / Math.log(k))
          return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
        }

        const { schema } = state
        const node = schema.nodes[self.name].create({
          uploading: true,
          progress: 0,
          src: URL.createObjectURL(file),
          width: '100%',
          align: 'center',
          uploadId: uploadId,
          fileName: file.name,
          fileSize: formatFileSize(file.size),
          controls: true,
          autoplay: false,
          muted: false,
          loop: false,
        })

        const insertPos = state.selection.from
        const transaction = tr.insert(insertPos, node)
        dispatch(transaction)

        // 使用 nextTick 确保DOM更新后再开始上传
        setTimeout(() => {
          uploadFile(file, view, uploadId)
        }, 0)

        return true
      },
      _validateVideoFile: () => validateFile,
      _uploadVideoFile: () => uploadFile,
    }
  },

  addOptions() {
    return {
      uploadFn: async (_file, onProgress) => {
        // 默认的上传函数，需要用户自定义
        return new Promise((resolve) => {
          // 模拟上传进度
          let progress = 0
          const interval = setInterval(() => {
            progress += Math.random() * 20
            if (progress > 100) progress = 100
            onProgress(Math.floor(progress))
            if (progress >= 100) {
              clearInterval(interval)
              // 这里应该返回真实的视频URL
              setTimeout(() => {
                resolve('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4')
              }, 500)
            }
          }, 200)
        })
      },
      maxFileSize: 100 * 1024 * 1024, // 100MB
      allowedTypes: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'],
    }
  },
})

export const ImageUpload = Node.create({
  name: 'imageUpload',

  group: 'block',

  content: '',

  isolating: true,


  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: '50%',
      },
      height: {
        default: null,
      },
      align: {
        default: 'center',
      },
      uploading: {
        default: false,
      },
      progress: {
        default: 0,
      },
      error: {
        default: null,
      },
      uploadId: {
        default: null,
      },
      fileName: {
        default: null,
      },
      fileSize: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'p.image-paragraph',
        getAttrs: (element) => {
          const img = element.querySelector('img')
          if (!img) return false

          return {
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt'),
            title: img.getAttribute('title'),
            width: img.getAttribute('width') || img.style.width,
            height: img.getAttribute('height') || img.style.height,
            align: element.getAttribute('data-align') || 'center',
          }
        },
      },
      {
        tag: 'img[src]',
        getAttrs: (element) => ({
          src: element.getAttribute('src'),
          alt: element.getAttribute('alt'),
          title: element.getAttribute('title'),
          width: element.getAttribute('width') || element.style.width,
          height: element.getAttribute('height') || element.style.height,
          align: element.getAttribute('data-align') || 'center',
        }),
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { uploading, progress, error, align, width, uploadId: _uploadId, ...attrs } = HTMLAttributes

    const paragraphClass = `image-paragraph align-${align || 'center'}`
    const imgStyle = width ? `width: ${width}; max-width: 100%; height: auto;` : 'max-width: 100%; height: auto;'

    if (uploading) {
      return [
        'p',
        {
          class: paragraphClass,
          'data-align': align || 'center'
        },
        [
          'span',
          { class: 'image-upload-container uploading' },
          [
            'img',
            mergeAttributes(attrs, {
              style: `opacity: 0.5; ${imgStyle}`,
              width: width || '50%'
            })
          ],
          [
            'span',
            { class: 'upload-progress' },
            [
              'span',
              {
                class: 'progress-bar',
                style: `width: ${progress}%`
              }
            ]
          ],
          [
            'span',
            { class: 'upload-text' },
            `Uploading... ${progress}%`
          ]
        ]
      ]
    }

    if (error) {
      return [
        'p',
        {
          class: paragraphClass,
          'data-align': align || 'center'
        },
        [
          'span',
          { class: 'image-upload-container error' },
          [
            'span',
            { class: 'error-message' },
            `Upload failed: ${error}`
          ],
          [
            'button',
            {
              class: 'retry-button',
              onclick: 'this.closest(".image-upload-container").remove()'
            },
            'Remove'
          ]
        ]
      ]
    }

    return [
      'p',
      {
        class: paragraphClass,
        'data-align': align || 'center'
      },
      [
        'img',
        mergeAttributes(attrs, {
          style: imgStyle,
          width: width || '50%',
          'data-align': align || 'center'
        })
      ]
    ]
  },

  addNodeView() {
    return VueNodeViewRenderer(ImageNodeView)
  },

  addCommands() {
    const self = this

    const validateFile = (file) => {
      const { allowedTypes, maxFileSize } = self.options
      if (!allowedTypes.includes(file.type)) {
        console.error('File type not allowed:', file.type)
        return false
      }
      if (file.size > maxFileSize) {
        console.error('File too large:', file.name)
        return false
      }
      return true
    }

    const uploadFile = (file, view, nodeId) => {
      // 使用节点ID来查找节点，而不是依赖位置
      const findNodeByUploadId = (doc, uploadId) => {
        let foundPos = null
        doc.descendants((node, pos) => {
          if (node.type.name === self.name && node.attrs.uploadId === uploadId) {
            foundPos = pos
            return false // 停止遍历
          }
        })
        return foundPos
      }

      self.options.uploadFn(file, (progress) => {
        const nodePos = findNodeByUploadId(view.state.doc, nodeId)
        if (nodePos !== null) {
          const currentNode = view.state.doc.nodeAt(nodePos)
          if (currentNode && currentNode.type.name === self.name) {
            const newAttrs = { ...currentNode.attrs, progress }
            const tr = view.state.tr.setNodeMarkup(nodePos, null, newAttrs)
            view.dispatch(tr)
          }
        }
      }).then((url) => {
        const nodePos = findNodeByUploadId(view.state.doc, nodeId)
        if (nodePos !== null) {
          const currentNode = view.state.doc.nodeAt(nodePos)
          if (currentNode && currentNode.type.name === self.name) {
            const newAttrs = {
              ...currentNode.attrs,
              src: url,
              uploading: false,
              progress: 100,
              error: null,
              uploadId: null, // 清除上传ID
            }
            const tr = view.state.tr.setNodeMarkup(nodePos, null, newAttrs)
            view.dispatch(tr)
          }
        }
      }).catch((error) => {
        const nodePos = findNodeByUploadId(view.state.doc, nodeId)
        if (nodePos !== null) {
          const currentNode = view.state.doc.nodeAt(nodePos)
          if (currentNode && currentNode.type.name === self.name) {
            const newAttrs = {
              ...currentNode.attrs,
              uploading: false,
              error: error?.message || String(error),
            }
            const tr = view.state.tr.setNodeMarkup(nodePos, null, newAttrs)
            view.dispatch(tr)
          }
        }
      })
    }

    return {
      setImage: (options) => ({ commands }) => {
        return commands.insertContent({
          type: self.name,
          attrs: options,
        })
      },
      uploadImage: (file) => ({ tr, dispatch, state, view }) => {
        if (!validateFile(file)) {
          return false
        }

        // 生成唯一的上传ID
        const uploadId = `upload_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`

        // 格式化文件大小
        const formatFileSize = (bytes) => {
          if (bytes === 0) return '0 B'
          const k = 1024
          const sizes = ['B', 'KB', 'MB', 'GB']
          const i = Math.floor(Math.log(bytes) / Math.log(k))
          return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
        }

        const { schema } = state
        const node = schema.nodes[self.name].create({
          uploading: true,
          progress: 0,
          src: URL.createObjectURL(file),
          alt: file.name,
          width: '50%',
          align: 'center',
          uploadId: uploadId,
          fileName: file.name,
          fileSize: formatFileSize(file.size),
        })

        const insertPos = state.selection.from
        const transaction = tr.insert(insertPos, node)
        dispatch(transaction)

        // 使用 nextTick 确保DOM更新后再开始上传
        setTimeout(() => {
          uploadFile(file, view, uploadId)
        }, 0)

        return true
      },
      _validateImageFile: () => validateFile,
      _uploadImageFile: () => uploadFile,
    }
  },

  addOptions() {
    return {
      uploadFn: async (_file, onProgress) => {
        // 默认的上传函数，需要用户自定义
        return new Promise((resolve) => {
          // 模拟上传进度
          let progress = 0
          const interval = setInterval(() => {
            progress += Math.random() * 20
            if (progress > 100) progress = 100
            onProgress(Math.floor(progress))
            if (progress >= 100) {
              clearInterval(interval)
              // 这里应该返回真实的图片URL
              setTimeout(() => {
                resolve('https://picsum.photos/400/300?random=' + Date.now())
              }, 500)
            }
          }, 200)
        })
      },
      maxFileSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    }
  },
})

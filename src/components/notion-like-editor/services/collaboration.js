import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'

export class CollaborationService {
  constructor(documentId, websocketUrl = 'ws://localhost:1234') {
    this.documentId = documentId
    this.websocketUrl = websocketUrl
    this.ydoc = new Y.Doc()
    this.provider = null
    this.awareness = null
    this.connected = false
    this.users = new Map()
  }

  connect() {
    try {
      this.provider = new WebsocketProvider(
        this.websocketUrl,
        this.documentId,
        this.ydoc
      )

      this.awareness = this.provider.awareness

      // Set user information
      this.awareness.setLocalStateField('user', {
        name: this.generateUserName(),
        color: this.generateUserColor(),
        id: this.generateUserId(),
      })

      // Listen for connection status
      this.provider.on('status', (event) => {
        this.connected = event.status === 'connected'
        console.log('Collaboration status:', event.status)
      })

      // Listen for awareness changes (other users)
      this.awareness.on('change', () => {
        this.updateUsers()
      })

      console.log('Collaboration service connected')
      return true
    } catch (error) {
      console.warn('Failed to connect to collaboration server:', error)
      return false
    }
  }

  disconnect() {
    if (this.provider) {
      this.provider.destroy()
      this.provider = null
      this.awareness = null
      this.connected = false
      this.users.clear()
    }
  }

  updateUsers() {
    if (!this.awareness) return

    this.users.clear()
    this.awareness.getStates().forEach((state, clientId) => {
      if (state.user && clientId !== this.awareness.clientID) {
        this.users.set(clientId, state.user)
      }
    })
  }

  getUsers() {
    return Array.from(this.users.values())
  }

  isConnected() {
    return this.connected
  }

  getYDoc() {
    return this.ydoc
  }

  getAwareness() {
    return this.awareness
  }

  generateUserId() {
    return Math.random().toString(36).substr(2, 9)
  }

  generateUserName() {
    const adjectives = ['Happy', 'Creative', 'Brilliant', 'Focused', 'Energetic', 'Calm', 'Bold', 'Wise']
    const nouns = ['Writer', 'Editor', 'Thinker', 'Creator', 'Designer', 'Collaborator', 'Innovator', 'Dreamer']
    
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
    const noun = nouns[Math.floor(Math.random() * nouns.length)]
    
    return `${adjective} ${noun}`
  }

  generateUserColor() {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  // Simulate collaboration for demo purposes when no server is available
  createMockCollaboration() {
    console.log('Creating mock collaboration (no server connection)')
    
    // Create a local-only Y.Doc for demo
    this.ydoc = new Y.Doc()
    this.connected = false
    
    // Simulate some users for demo
    this.users.set('user1', {
      name: 'Demo User 1',
      color: '#FF6B6B',
      id: 'demo1'
    })
    
    this.users.set('user2', {
      name: 'Demo User 2', 
      color: '#4ECDC4',
      id: 'demo2'
    })

    return this.ydoc
  }
}

// Singleton instance
let collaborationInstance = null

export function getCollaborationService(documentId = 'default-document') {
  if (!collaborationInstance) {
    collaborationInstance = new CollaborationService(documentId)
  }
  return collaborationInstance
}

export function resetCollaborationService() {
  if (collaborationInstance) {
    collaborationInstance.disconnect()
    collaborationInstance = null
  }
}

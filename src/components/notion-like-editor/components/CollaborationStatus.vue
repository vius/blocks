<template>
  <div class="collaboration-status">
    <div class="status-indicator">
      <div 
        class="status-dot"
        :class="{ 'connected': isConnected, 'disconnected': !isConnected }"
      ></div>
      <span class="status-text">
        {{ isConnected ? 'Connected' : 'Offline' }}
      </span>
    </div>
    
    <div class="users-list" v-if="users.length > 0">
      <div class="users-label">{{ users.length }} collaborator{{ users.length > 1 ? 's' : '' }}:</div>
      <div class="user-avatars">
        <div 
          v-for="user in users" 
          :key="user.id"
          class="user-avatar"
          :style="{ backgroundColor: user.color }"
          :title="user.name"
        >
          {{ user.name.charAt(0) }}
        </div>
      </div>
    </div>
    
    <div class="demo-notice" v-if="!isConnected && users.length > 0">
      <small>Demo mode - showing simulated collaborators</small>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineProps } from 'vue'

const props = defineProps({
  collaborationService: {
    type: Object,
    required: true
  }
})

const isConnected = ref(false)
const users = ref([])

let updateInterval = null

const updateStatus = () => {
  isConnected.value = props.collaborationService.isConnected()
  users.value = props.collaborationService.getUsers()
}

onMounted(() => {
  updateStatus()
  
  // Update status periodically
  updateInterval = setInterval(updateStatus, 1000)
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})
</script>

<style scoped>
.collaboration-status {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 16px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.status-dot.connected {
  background-color: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

.status-dot.disconnected {
  background-color: #ef4444;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
}

.status-text {
  color: #374151;
  font-weight: 500;
}

.users-list {
  display: flex;
  align-items: center;
  gap: 8px;
}

.users-label {
  color: #6b7280;
  font-size: 13px;
}

.user-avatars {
  display: flex;
  gap: 4px;
}

.user-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.demo-notice {
  color: #9ca3af;
  font-style: italic;
}

.demo-notice small {
  font-size: 12px;
}
</style>

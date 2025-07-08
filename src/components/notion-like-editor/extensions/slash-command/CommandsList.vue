<template>
    <div class="dropdown-menu">
      <template v-if="items.length">
        <button
          :class="{ 'is-selected': index === selectedIndex }"
          v-for="(item, index) in items"
          :key="index"
          @click="selectItem(index)"
          class="command-item"
        >
          <div class="command-icon">{{ item.icon }}</div>
          <div class="command-content">
            <div class="command-title">{{ item.title }}</div>
            <div class="command-description">{{ item.description }}</div>
          </div>
        </button>
      </template>
      <div class="no-result" v-else>
        No commands found
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      items: {
        type: Array,
        required: true,
      },
  
      command: {
        type: Function,
        required: true,
      },
    },
  
    data() {
      return {
        selectedIndex: 0,
      }
    },
  
    watch: {
      items() {
        this.selectedIndex = 0
      },
    },
  
    methods: {
      onKeyDown({ event }) {
        if (event.key === 'ArrowUp') {
          this.upHandler()
          return true
        }
  
        if (event.key === 'ArrowDown') {
          this.downHandler()
          return true
        }
  
        if (event.key === 'Enter') {
          this.enterHandler()
          return true
        }
  
        return false
      },
  
      upHandler() {
        this.selectedIndex = ((this.selectedIndex + this.items.length) - 1) % this.items.length
      },
  
      downHandler() {
        this.selectedIndex = (this.selectedIndex + 1) % this.items.length
      },
  
      enterHandler() {
        this.selectItem(this.selectedIndex)
      },
  
      selectItem(index) {
        const item = this.items[index]
  
        if (item) {
          this.command(item)
        }
      },
    },
  }
  </script>
  
  <style scoped>
  .dropdown-menu {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow: 0 10px 38px -10px rgba(22, 23, 24, 0.35), 0 10px 20px -15px rgba(22, 23, 24, 0.2);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 8px;
    position: relative;
    min-width: 280px;
    max-height: 400px;
    overflow-y: auto;
    z-index: 1000;
  }

  .command-item {
    align-items: flex-start;
    background-color: transparent;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    gap: 12px;
    padding: 12px;
    text-align: left;
    width: 100%;
    transition: background-color 0.1s ease;
  }

  .command-item:hover,
  .command-item.is-selected {
    background-color: #f3f4f6;
  }

  .command-icon {
    font-size: 16px;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .command-content {
    flex: 1;
    min-width: 0;
  }

  .command-title {
    font-size: 14px;
    font-weight: 500;
    color: #111827;
    margin-bottom: 2px;
  }

  .command-description {
    font-size: 12px;
    color: #6b7280;
    line-height: 1.4;
  }

  .no-result {
    padding: 12px;
    text-align: center;
    color: #9ca3af;
    font-size: 14px;
  }
  </style>
<template>
  <div class="test-container">
    <h1>Simple Editor Table Test</h1>
    <p>测试table插件功能：</p>
    <ul>
      <li>点击toolbar中的table按钮插入3x3表格</li>
      <li>点击表格单元格显示popover菜单</li>
      <li>测试各种表格操作功能</li>
    </ul>
    
    <div class="editor-container">
      <SimpleEditor />
    </div>
  </div>
</template>

<script setup>
import SimpleEditor from './index.vue'
</script>

<style scoped>
.test-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.editor-container {
  margin-top: 20px;
}

h1 {
  color: #333;
  margin-bottom: 10px;
}

p {
  color: #666;
  margin-bottom: 10px;
}

ul {
  color: #666;
  margin-bottom: 20px;
}

li {
  margin-bottom: 5px;
}
</style>

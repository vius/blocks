import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import RichTextEditorDemo from '@/views/rich-text-editor-demo.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/demo',
      name: 'RichTextEditorDemo',
      component: RichTextEditorDemo,
    },

  ],
})

export default router

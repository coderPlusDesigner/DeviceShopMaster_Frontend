import { createRouter, createWebHistory } from 'vue-router'
import { useGeneralDataStore } from '@/stores/generalData'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      name: 'AdminPanel',
      component: () => import('../views/AdminPanel.vue'),
      meta: { title: 'Дом' },
      children: [
        {
          path: '',
          component: () => import('../views/Shop/ShopView.vue'),
          name: 'Shop',
          meta: { title: 'Магазин' },
          children: [
            {
              path: '',
              name: 'Products',
              component: () => import('../views/Shop/ProductsView.vue'),
              meta: { title: 'Продукты' }
            },
            {
              path: '/orders',
              component: () => import('../views/SubstituteView.vue'),
              name: 'Orders',
              meta: { title: 'Заказы' }
            },
            {
              path: '/customers',
              component: () => import('../views/SubstituteView.vue'),
              name: 'Customers',
              meta: { title: 'Клиенты' }
            },
            {
              path: '/reviews',
              component: () => import('../views/SubstituteView.vue'),
              name: 'Reviews',
              meta: { title: 'Отзывы' }
            }
          ]
        },
        {
          path: '/stats',
          component: () => import('../views/SubstituteView.vue'),
          name: 'Stats',
          meta: { title: 'Статистика' }
        },
        {
          path: '/users',
          component: () => import('../views/SubstituteView.vue'),
          name: 'Users',
          meta: { title: 'Пользователи' }
        },
        {
          path: '/notifications',
          component: () => import('../views/SubstituteView.vue'),
          name: 'Notifications',
          meta: { title: 'Уведомления' }
        },
        {
          path: '/chat',
          component: () => import('../views/SubstituteView.vue'),
          name: 'Chat',
          meta: { title: 'Чат' }
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue'),
      meta: { title: 'Login' }
    },
    {
      path: '/:pathMatch(.*)',
      name: 'PageNotFound',
      component: () => import('../views/PageNotFound.vue'),
      meta: { title: 'Page Not Found' }
    }
  ]
})

router.beforeEach(async (to, from) => {
  const generalData = useGeneralDataStore()
  if (!generalData.isAuthenticated && to.name !== 'Login') {
    return { name: 'Login' }
  }
})

export default router

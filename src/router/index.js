import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name:'home',
      component: () => import('@/view/home/index')
    },
    {
      path: '/book',
      name:'book',
      component: () => import('@/view/book/index'),
    },
    {
      path: '/book/outline',
      name:'outline',
      component: () => import('@/view/book/outline/index'),
    },
    {
      path: '/Role',
      component: () => import('@/view/list'),
      children:[
        {
          path: 'area/index',
          component: () => import('@/view/list'),
        }
      ]
    },

    {
      path: '/Login',
      component: () => import('@/view/login'),
    }
  ]
})

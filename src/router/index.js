import Vue from 'vue'
import Router from 'vue-router'
import Role from '@/view/list'
import RoleList from '@/view/role/index'
import areaList from '@/view/role/index'
import Login from '@/view/login'
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: Role,
      children:[
        {
          path: 'role/index',
          component: RoleList,
        }
        ]
    },
    {
      path: '/Role',
      component: Role,
      children:[
        {
          path: 'area/index',
          component: areaList,
        }
      ]
    },
    {
      path: '/Login',
      component: Login,
    }
  ]
})

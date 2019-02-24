import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/login.vue'
import Home from '@/components/home.vue'
import Users from '@/components/users.vue'
import Rights from '@/components/rights.vue'
import Roles from '@/components/roles.vue'
import Goodslist from '@/components/goodslist.vue'
import Goodsadd from '@/components/goodsadd.vue'
// import Params from '@/components/params.vue'
import Cateparams from '@/components/cateparams.vue'
// categories
import Categories from '@/components/categories.vue'

import {
  Message
} from 'element-ui'

Vue.use(Router)

const router = new Router({
  routes: [{
    path: '/login',
    name: 'login',
    component: Login
  }, {
    path: '/',
    name: 'home',
    component: Home,
    children: [{
      path: '/users',
      name: 'users',
      component: Users
    }, {
      path: '/rights',
      name: 'rights',
      component: Rights
    }, {
      path: '/roles',
      name: 'roles',
      component: Roles
    }, {
      path: '/goods',
      name: 'goods',
      component: Goodslist
    }, {
      // goodsadd
      path: '/goodsadd',
      name: 'goodsadd',
      component: Goodsadd
    }, {
      // params 分类列表
      path: '/params',
      name: 'params',
      component: Cateparams
    }, {
      // params 分类列表
      path: '/categories',
      name: 'categories',
      component: Categories
    }]
  }]
})


router.beforeEach((to, from, next) => {
  // ...
  if (to.name === 'login') {
    next()
  } else {


    const token = localStorage.getItem('token')

    if (!token) {
      Message.warning("请先登录")
      router.push({
        name: 'login'
      })
      return;
    }
    next()


  }




})
export default router;

import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('../views/login.vue')
const Home = () => import('../views/home.vue')
const Welcome = () => import('../components/Home/welcomePage.vue')
const User = () => import('../components/Home/user.vue')
const Roles = () => import('../components/Rights/roles.vue')
const rights = () => import('../components/Rights/rights.vue')
const Goods_cate = () => import ('../components/Goods/Goods_category/goods_cate.vue')
const Goods_params = () => import ('../components/Goods/Goods_params/goods_params.vue')
const Goods_list = () => import ('../components/Goods/goods_list.vue')
const Goods_add = () => import ('../components/Goods/goods_add.vue')

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [{
      path: '',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect:'/home/welcome',
      children: [{
        path: 'welcome',
        component:Welcome
      },
      {
        path: 'users',
        component:User
      },
      {
        path: 'roles',
        component:Roles
      },{
        path:'rights',
        component:rights
      },
      {
        path:'categories',
        component:Goods_cate
      },
      {
        path:'params',
        component:Goods_params
      },
      {
        path:'goods',
        component:Goods_list
      },
      {
        path:'goods/add',
        component:Goods_add
      }
    ]
    }
  ]
})

//调用某些api接口的时候需要用户已经登录，通过检查sessionStorage中有无token判断用户是否已经登录
//调用next函数表示放行
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next()
  }

  const tokenStr = sessionStorage.getItem('token')
  if (!tokenStr) {
    //next中直接放路径表示强制跳转
    return next('/login')
  }

  next()
})

export default router
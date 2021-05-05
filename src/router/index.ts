import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { ResponseDataType, UserProps } from '@/store/index'
import createMessage from '@/utils/createMessage'
import axios from 'axios'
import store from '@/store/index'

const Home = () => import('@/views/Home.vue')
const Login = () => import('@/views/Login.vue')
const Signup = () => import('@/views/Signup.vue')
const ColumnDetail = () => import('@/views/ColumnDetail.vue')
const CreatePost = () => import('@/views/CreatePost.vue')
const PostDetail = () => import('@/views/PostDetail.vue')
const UserInfo = () => import('@/views/UserInfo.vue')

const redirectMeta = { loginRedirect: true }
const needLoginMeta = { needToLogin: true }

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: redirectMeta
  },
  {
    path: '/signup',
    name: 'signup',
    component: Signup
  },
  {
    path: '/user',
    name: 'user',
    component: UserInfo,
    meta: needLoginMeta
  },
  {
    path: '/column/:id',
    name: 'column',
    component: ColumnDetail
  },
  {
    path: '/create/:id?',
    name: 'create',
    component: CreatePost,
    meta: needLoginMeta
  },
  {
    path: '/post/:id',
    name: 'post',
    component: PostDetail
  }
]

const router = createRouter({
  history: createWebHashHistory('/zhiye/'),
  routes
})

router.beforeEach((to, from, next) => {
  const { isLogin, token } = store.state.user
  const { loginRedirect, needToLogin } = to.meta
  if (isLogin) {
    // 如果已经登录,登录页面不宜展示给用户,此时重定向到首页
    loginRedirect ? next('/') : next()
  } else {
    if (token) {
      // 如果未登录但是用户登录过,即本地有token信息,尝试使用token登录
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      store.dispatch('fetchCurrentUser')
        .then((res: ResponseDataType<UserProps>) => {
          const { data } = res
          createMessage('info', `欢迎回来, ${data?.nickName || '您还没有昵称哦...'}`, 1200)
          loginRedirect ? next('/') : next()
        }).catch(err => {
          createMessage('warning', '用户信息已过期,请重新登录', 1000)
          store.commit('logout')
        })
    } else {
      // 如果未登录且没有登录信息,直接跳转到登录页面
      needToLogin ? next('login') : next()
    }
  }
})

export default router

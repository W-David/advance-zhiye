import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@/assets/style/index.css'
import axios from 'axios'
import animate from 'animate.css'

// axios 全局配置
const icode = 'F72E3EB456D71196'
const timeout = 5000
axios.defaults.baseURL = 'http://apis.imooc.com/api/'
axios.defaults.timeout = timeout
axios.interceptors.request.use(config => {
  config.params = { ...config.params, icode }
  //对于上传操作特殊处理
  if (config.data instanceof FormData) {
    config.data.append('icode', icode)
  } else {
    config.data = { ...config.data, icode }
  }
  //如果是上传请求就直接返回(上传组件有单独的的状态处理)
  if (config.url === 'upload') {
    return config
  }
  store.commit('setLoading', true)
  store.commit('setError', { status: false })
  config.timeout = timeout
  return config
}, (err) => {
  store.commit('setError', { status: true, message: err.message })
  store.commit('setLoading', false)
  return Promise.reject(err)
})

axios.interceptors.response.use(config => {
  store.commit('setLoading', false)
  return config
}, (err) => {
  const { error } = err.response.data
  store.commit('setError', { status: true, message: error })
  store.commit('setLoading', false)
  return Promise.reject(err)
})

const app = createApp(App)
app.use(store)
app.use(router)
app.use(animate)
app.mount('#app')

import { arr2Obj, generateFitUrl, obj2Arr } from '@/utils/helper'
import { Commit, createStore } from 'vuex'
import axios, { AxiosRequestConfig } from 'axios'

// 登录payload数据接口
export interface UploadLogin {
  email: string;
  password: string;
}
// 注册payload数据接口
export interface UploadSignup {
  email: string;
  nickName: string;
  password: string;
}
// 编辑文章payload数据接口
export interface UploadEditPost {
  pid: string;
  title: string;
  content: string;
  image?: string;
}
// 创建文章payload数据接口
export interface UploadCreatePost {
  title: string;
  content: string;
  column: string;
  author: string;
  image?: string;
}
// 更新专栏信息payload数据接口
export interface UploadColumn {
  title: string;
  description: string;
  avatar?: string;
}
// 更新用户信息payload数据接口
export interface UploadUser {
  _id: string;
  email?: string;
  nickName: string;
  description: string;
  avatar?: string;
  column?: string;
  createdAt?: string;
}
// 页面加载状态数据接口
export interface PageCacheProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
}
// 响应数据接口
export interface ResponseDataType<T> {
  code?: number;
  data?: T;
  msg?: string;
}
// 图片接口
export interface ImageProps {
  _id?: string;
  url?: string;
  createdAt?: string;
  fitUrl?: string;
}
// 全局错误接口
export interface ErrorProps {
  status?: boolean;
  message?: string;
}
// 用户数据接口
export interface UserProps {
  _id?: string;
  email?: string;
  nickName?: string;
  description?: string;
  avatar?: ImageProps;
  column?: string;
  createdAt?: string;
  isLogin?: boolean;
  // token 验证用户身份
  token?: string;
}
// 专栏数据接口
export interface ColumnProps {
  _id?: string;
  title?: string;
  description?: string;
  avatar?: ImageProps;
  author?: string;
  createdAt?: string;
}
// 文章数据接口
export interface PostProps {
  _id?: string;
  title?: string;
  excerpt?: string;
  content?: string;
  image?: ImageProps;
  author?: UserProps;
  column?: string;
  createdAt?: string;
  updatedAt?: string;
  isHTML?: boolean;
}

export type PostsProps = PostProps[]
export type ColumnsProps = ColumnProps[]

// 将数据转化为ts的可索引对象类型,以便于实现缓存
export interface indexableObj<T> {
  [key: string]: T
}
// vuex 的全局状态数据类型
export interface GlobalStateData {
  error: ErrorProps;
  user: UserProps;
  isLoading: boolean;
  // 主页专栏的页面加载状态
  columnsCache: PageCacheProps;
  currentColumn: string;
  // 每个专栏对应的文章列表的加载状态
  postsCache: indexableObj<PageCacheProps>;
  columns: indexableObj<ColumnProps>;
  posts: indexableObj<PostProps>;
}
// 发送异步请求并执行对应的 mutation
const asyncCommit = async (url: string, mutation: string, commit: Commit, config: AxiosRequestConfig = { method: 'GET' }) => {
  const { data } = await axios(url, config)
  // console.log(url, data)
  commit(mutation, data)
  return data
}

export default createStore<GlobalStateData>({
  state: {
    error: { status: true, message: 'this is test error' },
    user: { isLogin: false, token: localStorage.getItem('token') || '' },
    isLoading: false,
    columnsCache: { currentPage: 1, totalCount: 0, pageSize: 4 },
    currentColumn: '',
    postsCache: {},
    columns: {},
    posts: {}
  },
  getters: {
    getColumnById: (state) => (cid: string) => generateFitUrl(state.columns[cid]),
    getPostsByCid: (state) => (cid: string) => obj2Arr(state.posts).filter(post => post.column === cid).map(post => generateFitUrl(post)),
    getPostByPid: (state) => (pid: string) => generateFitUrl(state.posts[pid]),
    getColumns: (state) => obj2Arr(state.columns).map(column => generateFitUrl(column))
  },
  mutations: {
    login (state, { data }) {
      const { token } = data
      state.user.token = token
      localStorage.setItem('token', token)
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    logout (state) {
      state.user = { isLogin: false }
      localStorage.removeItem('token')
      delete axios.defaults.headers.common.Authorization
    },
    signup (state, { data }) {
      state.user = { isLogin: false, ...data }
    },
    fetchCurrentUser (state, { data }) {
      state.user = { isLogin: true, ...data }
    },
    updateUser (state, { data }) {
      state.user = { isLogin: true, ...data }
    },
    fetchColumns (state, { data }) {
      state.columns = { ...state.columns, ...arr2Obj(data.list) }
      // 每次缓存时都将自动将缓存页数加一,即currentPage是下次请求的页面
      state.columnsCache.currentPage = +data.currentPage + 1
      state.columnsCache.totalCount = +data.count
    },
    fetchColumn (state, { data }) {
      state.columns[data._id] = data
    },
    updateColumn (state, { data }) {
      state.columns[data._id] = data
    },
    createPost (state, { data }) {
      state.posts[data._id] = data
    },
    fetchPost (state, { data }) {
      state.posts[data._id] = data
    },
    updatePost (state, { data }) {
      state.posts[data._id] = data
    },
    deletePost (state, { data }) {
      delete state.posts[data._id]
    },
    fetchPosts (state, { data }) {
      state.posts = { ...state.posts, ...arr2Obj(data.list) }
      const curColumnId = state.currentColumn
      // 每次缓存时都将自动将缓存页数加一,即currentPage是下次请求的页面
      state.postsCache[curColumnId].currentPage = +data.currentPage + 1
      state.postsCache[curColumnId].totalCount = +data.count
    },
    setError (state, err: ErrorProps) {
      state.error = err
    },
    setLoading (state, isLoading: boolean) {
      state.isLoading = isLoading
    }
  },
  actions: {
    login ({ commit }, payload) {
      return asyncCommit('user/login', 'login', commit, {
        method: 'POST',
        data: payload
      })
    },
    fetchCurrentUser ({ commit }) {
      return asyncCommit('user/current', 'fetchCurrentUser', commit)
    },
    // 用户的登录分为登录验证和获取用户信息两步
    async userLogin ({ dispatch }, payload: UploadLogin) {
      await dispatch('login', payload)
      return await dispatch('fetchCurrentUser')
    },
    signup ({ commit }, payload: UploadSignup) {
      return asyncCommit('users', 'signup', commit, {
        method: 'POST',
        data: payload
      })
    },
    updateUser ({ commit }, payload: UploadUser) {
      return asyncCommit(`user/${payload._id}`, 'updateUser', commit, {
        method: 'PATCH',
        data: payload
      })
    },
    fetchColumns ({ state, commit }) {
      return asyncCommit(`columns?currentPage=${state.columnsCache.currentPage}&pageSize=${state.columnsCache.pageSize}`, 'fetchColumns', commit)
    },
    fetchColumn ({ state, commit }, cid: string) {
      const curColumn = state.columns[cid]
      if (curColumn) {
        return Promise.resolve({ data: curColumn })
      } else {
        return asyncCommit(`columns/${cid}`, 'fetchColumn', commit)
      }
    },
    updateColumn ({ state, commit }, payload: UploadColumn) {
      return asyncCommit(`columns/${state.user.column}`, 'updateColumn', commit, {
        method: 'PATCH',
        data: payload
      })
    },
    createPost ({ commit }, payload: UploadCreatePost) {
      return asyncCommit('posts', 'createPost', commit, {
        method: 'POST',
        data: payload
      })
    },
    fetchPost ({ state, commit }, pid: string) {
      const curPost = state.posts[pid]
      if (!curPost || !curPost.content) {
        return asyncCommit(`posts/${pid}`, 'fetchPost', commit)
      } else {
        return Promise.resolve({ data: curPost })
      }
    },
    updatePost ({ commit }, payload: UploadEditPost) {
      return asyncCommit(`posts/${payload.pid}`, 'updatePost', commit, {
        method: 'PATCH',
        data: {
          title: payload.title,
          content: payload.content,
          image: payload.image
        }
      })
    },
    deletePost ({ commit }, pid: string) {
      return asyncCommit(`posts/${pid}`, 'deletePost', commit, {
        method: 'DELETE'
      })
    },
    fetchPosts ({ state, commit }, cid: string) {
      // 保存 columnId, 在mutation中对响应的column做缓存记录
      state.currentColumn = cid
      // 如果该column没有缓存,则初始化一个缓存记录用以发起请求
      if (!state.postsCache[cid]) {
        state.postsCache[cid] = { currentPage: 1, totalCount: 0, pageSize: 3 }
      }
      const curColumnCache = state.postsCache[cid]
      return asyncCommit(`columns/${cid}/posts?currentPage=${curColumnCache.currentPage}&pageSize=${curColumnCache.pageSize}`, 'fetchPosts', commit)
    }
  }
})

<template>
  <!-- flex布局实现footer的沉底 -->
  <div class="app-container d-flex flex-column h-100">
    <header>
      <div class="header-conatainer container-fluid px-0">
        <global-header :user="user"></global-header>
      </div>
    </header>
    <main class="flex-shrink-0">
      <div class="main-container container pb-3">
        <router-back v-if="!isHomePage"></router-back>
        <loader v-if="isLoading"></loader>
        <!-- 根据meta元信息,动态确定使用的动效,过渡模式使用out-in -->
        <router-view v-slot="{ Component }">
          <transition name="fade-scale" mode="out-in">
            <component :is="Component"></component>
          </transition>
        </router-view>
      </div>
    </main>
    <footer class="mt-auto">
      <div class="footer-container container-fluid px-0">
        <global-footer></global-footer>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, watch } from 'vue'
import GlobalHeader from '@/components/global/GlobalHeader.vue'
import GlobalFooter from '@/components/global/GlobalFooter.vue'
import Loader from '@/components/teleport/Loader.vue'
import RouterBack from '@/components/teleport/RouterBack.vue'
import { useStore } from 'vuex'
import { GlobalStateData } from './store'
import axios from 'axios'
import createMessage from '@/utils/createMessage'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'app',
  components: {
    GlobalHeader,
    GlobalFooter,
    Loader,
    RouterBack
  },
  setup () {
    const store = useStore<GlobalStateData>()
    const user = computed(() => store.state.user)
    const error = computed(() => store.state.error)
    const isLoading = computed(() => store.state.isLoading)
    const token = computed(() => store.state.user.token)
    const route = useRoute()
    const isHomePage = computed(() => route.path === '/' || route.path === '/home') 
    watch(() => error.value.status, (newVal) => {
      if (newVal) {
        createMessage('danger', error.value.message || '未知错误', 1200)
      }
    })
    onMounted(() => {
      if (!user.value.isLogin && token.value) {
        axios.defaults.headers.common.Authorization = `Bearer ${token.value}`
        store.dispatch('fetchCurrentUser')
      }
    })
    return {
      user,
      isLoading,
      isHomePage
    }
  }
})
</script>

<style scoped>
  .main-container {
    margin-top: 20px;
  }
  /* 进入过渡比离开过渡更长一些,视觉效果较好 */
  .fade-scale-enter-active {
    transition: all 0.5s ease-out;
  }
  .fade-scale-leave-active {
    transition: all 0.35s ease-in;
  }
  .fade-scale-leave-to {
    transform: scale(0.95);
    opacity: 0;
  }
  .fade-scale-enter-from {
    transform: scale(1.05);
    opacity: 0;
  }
</style>

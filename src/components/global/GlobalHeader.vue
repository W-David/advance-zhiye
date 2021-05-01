<template>
  <div class="global-header-container 
              w-100 
              d-flex 
              justify-content-between
              align-items-center 
              px-3
              bg-primary
              text-white">
    <router-link class="mb-0 
                        ms-1 
                        fs-4
                        text-white 
                        text-decoration-none" 
                  to="/">知也专栏
    </router-link>
    <div class="user-area">
      <div class="not-logged-in" v-if="!user?.isLogin">
        <router-link class="btn btn-primary mr-2" to="/login">登录</router-link>
        <router-link class="btn btn-primary" to="/signup">注册</router-link>
      </div>
      <div class="logged-in" v-else>
        <drop-down :user="user">
          <drop-down-item>
            <router-link class="dropdown-item" to="/create">新建文章</router-link>
          </drop-down-item>
          <drop-down-item>
            <router-link class="dropdown-item" to="/user">修改资料</router-link>
          </drop-down-item>
          <drop-down-item>
            <router-link class="dropdown-item" :to="{ name: 'column', params: { id: user.column }}">我的专栏</router-link>
          </drop-down-item>
          <drop-down-item>
            <button class="dropdown-item" @click="logout">退出登录</button>
          </drop-down-item>
        </drop-down>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import DropDown from '@/components/widgets/DropDown.vue'
import DropDownItem from '@/components/widgets/DropDownItem.vue'
import { GlobalStateData, UserProps } from '@/store/index'
import { useStore } from 'vuex'
import createMessage from '@/utils/createMessage'

export default defineComponent({
  name: 'globalHeader',
  components: { 
    DropDown,
    DropDownItem
  },
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true
    }
  },
  setup () {
    const store = useStore<GlobalStateData>()
    const logout = () => {
      store.commit('logout')
      createMessage('info', '已退出,请重新登录...', 1200)
    }
    return {
      logout
    }
  }
})
</script>

<style scoped>
  .global-header-container {
    height: 60px;
  }
</style>
<template>
  <div class="user-info-page w-75 mx-auto">
    <div class="col-12 col-md-8 offset-md-2 col-lg-6 offset-md-3">
      <ul class="nav nav-pills pt-3">
        <li class="nav-item flex-fill" 
            v-for="tab in tabs" 
            :key="tab.id">
            <button type="button"
                    class="nav-link w-100"
                    @click="currentTab = tab"
                    :class="{'active': currentTab.id === tab.id}">
                    {{ tab.name }}
            </button>
        </li>
      </ul>
      <keep-alive>
        <component :is="currentTab.component"></component>
      </keep-alive>
    </div>
  </div>
</template>

<script lang="ts">
import { formatDateId } from '@/utils/helper'
import { defineAsyncComponent, defineComponent, shallowRef } from 'vue'

export default defineComponent({
  setup() {
    const UserProfile = defineAsyncComponent(() => import('@/components/dynamic/UserProfile.vue'))
    const UserColumn = defineAsyncComponent(() => import('@/components/dynamic/UserColumn.vue'))
    const tabs = [
      {id: formatDateId(), name: '用户信息', component: UserProfile},
      {id: formatDateId(), name: '我的专栏', component: UserColumn}
    ]
    const currentTab = shallowRef(tabs[0])
    return {
      tabs,
      currentTab
    }
  }
})
</script>

<style>

</style>
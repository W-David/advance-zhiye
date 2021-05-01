<template>
  <div class="dropdown-container dropstart" ref="dropdownRef">
    <button class="btn btn-primary dropdown-toggle" 
            type="button"
            @click.prevent="isShow = !isShow">
      {{ user.nickName }}
    </button>
    <ul class="dropdown-menu" :style="{ display: 'block' }" v-if="isShow">
      <slot></slot>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, PropType } from 'vue'
import useClickOutside from '@/hooks/useClickOutside'
import { UserProps } from '@/store/index'

export default defineComponent({
  name: 'dropDown',
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true
    }
  },
  setup () {
    const dropdownRef = ref<null | HTMLElement>(null)
    const isShow = ref(false)
    const isClickOutside = useClickOutside(dropdownRef)
    watch(isClickOutside, (newVal) => {
      isShow.value = (newVal && isShow.value)? false : isShow.value
    })
    return {
      dropdownRef,
      isShow
    }
  }
})
</script>

<style>
</style>

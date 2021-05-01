<template>
  <teleport to="#rootLoader">
    <div class="global-loader-container
                position-fixed
                top-0
                left-0
                w-100
                h-100
                d-flex"
        :style="{backgroundColor: bgColor}">
      <div class="loader m-auto text-center">
        <div class="spinner-grow text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2 text-primary">{{ loaderInfo }}</p>
      </div>      
    </div>
  </teleport>
</template>

<script lang="ts">
import useDOMCreate from '@/hooks/useDOMCreate'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'loader',
  props: {
    loaderInfo: {
      type: String,
      default: 'loading...'
    },
    bgColor: {
      type: String,
      default: 'rgba(255,255,255,.3)'
    }
  },
  setup() {
    useDOMCreate('rootLoader')
  }
})
</script>

<style>

</style>
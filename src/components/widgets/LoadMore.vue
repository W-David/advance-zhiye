<template>
  <div class="load-more-container my-4 py-2 d-flex" v-if="isShow">
    <button class="btn btn-primary mx-auto w-50" @click="onLoadMore">{{ text }}</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'loadMore',
  props: {
    text: {
      type: String,
      required: true
    },
    isShow: {
      type: Boolean,
      required: true
    }
  },
  emits: ['on-load-more'],
  setup( props, context) {
    const onLoadMore = () => {
      context.emit('on-load-more') 
    }
    return {
      onLoadMore
    }
  }
})
</script>

<style>

</style>
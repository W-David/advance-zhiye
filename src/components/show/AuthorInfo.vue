<template>
  <div class="author-info-container bg-light rounded py-2 row mx-0 shadow-sm">
    <div class="author-avatar col-sm-12 col-md-2 d-flex p-3">
      <img :src="author.avatar?.fitUrl" alt="No avatar" class="m-auto rounded-circle" height="50" width="50">
    </div>
    <div class="author-profile col-sm-12 col-md-5 py-2 text-center">
      <h5 class="my-2">{{ author.nickName }}</h5>
      <p class="text-secondary text-break text-truncate mb-2">{{ author.description }}</p>
    </div>
    <div class="author-action col-sm-12 col-md-5 py-2 text-center text-muted">
      <p class="my-2 text-truncate">created at: {{ createdAt }}</p>
      <p class="mb-2 text-truncate">last modify: {{ updatedAt }}</p>
    </div>
  </div>
</template>


<script lang="ts">
import { UserProps } from '@/store'
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'authorInfo',
  props: {
    author: {
      type: Object as PropType<UserProps>,
      required: true
    },
    createdAt: String,
    updatedAt: String
  }
})
</script>

<style>

</style>
<template>
  <div class="post-list-container">
    <div class="post-container
                p-2 
                my-3 
                rounded
                position-relative
                row"
         v-for="post in posts" 
         :class="[ hoverIndex === post._id ? 'shadow' : 'shadow-sm']"
         :key="post._id"
         @mouseenter="hoverIndex = post._id"
         @mouseleave="hoverIndex = ''">
      <div class="img-container col-12 col-md-3 d-flex" v-if="post.image">
        <img :src="post.image.fitUrl" class="img-thumbnail m-auto" alt="No image">
      </div>
      <div class="post-text-container col-12 p-2" :class="{'col-md-9': post.image}">
        <router-link class="m-2 fs-5 text-decoration-none text-primary stretched-link text-break" :to="{ name: 'post', params: {id: post._id} }">{{ post.title }}</router-link>
        <p class="lh-sm text-secondary">&nbsp;&nbsp;{{ post.excerpt }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import { PostsProps } from '@/store/index'

export default defineComponent({
  name: 'postList',
  props: {
    posts: {
      type: Array as PropType<PostsProps>,
      required: true
    }
  },
  setup () {
    const hoverIndex = ref('')
    return {
      hoverIndex
    }
  }
})
</script>


<style scoped>
.post-container {
  cursor: pointer;
}
</style>
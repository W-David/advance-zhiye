<template>
  <div class="column-list-container row">
    <div class="column-container col-12 col-md-4 col-lg-3 g-3" v-for="column in columns" :key="column._id">
      <div class="card h-100"
           :class="[ hoverIndex === column._id ?  'shadow-sm' : '']"
           @mouseenter="hoverIndex = column._id"
           @mouseleave="hoverIndex = ''"
           style="cursor: pointer;">
        <img :src="column.avatar?.fitUrl" class="card-img-top " alt="not avatar">
        <div class="card-body text-center d-flex flex-column">
          <h5 class="card-title">{{ column.title }}</h5>
          <p class="card-text limit-line">{{ column.description }}</p>
          <div class="column-link-container mt-auto">
            <router-link :to="{name: 'column', params: {id: column._id}}" class="btn btn-primary stretched-link">进入专栏</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ColumnsProps } from '@/store'
import { defineComponent, PropType, ref } from 'vue'

export default defineComponent({
  name: 'columnList',
  props: {
    columns: {
      type: Array as PropType<ColumnsProps>,
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
.limit-line {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>
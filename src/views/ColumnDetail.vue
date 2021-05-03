<template>
  <div class="column-detail-page w-75 mx-auto">
    <div class="column-profile mb-3 p-2 row border border-light border-2 rounded shadow-sm" v-if="column">
      <div class="profile-avatar-container col-sm-12 col-md-3 d-flex">
        <img :src="column.avatar?.fitUrl" class="img-thumbnail m-auto" alt="No avatar">
      </div>
      <div class="profile-text-container col-sm-12 col-md-9 text-center py-2">
        <h4 class="mt-3 mb-2">{{ column.title }}</h4>
        <p class="text-secondary text-break">{{ column.description }}</p>
      </div>
    </div> 
    <post-list v-if="posts"
               :posts="posts">
    </post-list>
    <load-more text="更多文章" noMore="俺也是有底线的" :isShow="!isEndPage"  @on-load-more="onLoadMore"></load-more>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { ColumnProps, GlobalStateData, PostsProps } from '@/store/index'
import PostList from '@/components/show/PostList.vue'
import LoadMore from '@/components/widgets/LoadMore.vue'
import useEndPage from '@/hooks/useEndPage'

export default defineComponent({
  name: 'columnDetail',
  components: {
    PostList,
    LoadMore
  },
  setup() {
    const store = useStore<GlobalStateData>()
    const route = useRoute()
    const cid = computed(() => route.params.id as string)
    const column = computed(() => store.getters.getColumnById(cid.value) as ColumnProps)
    const posts = computed(() => store.getters.getPostsByCid(cid.value) as PostsProps)
    const cache = computed(() => store.state.postsCache[cid.value] || { currentPage: 1, totalCount: 0, pageSize: 3})
    const isEndPage = useEndPage(cache)
    const onLoadMore = () => {
      store.dispatch('fetchPosts', cid.value)
    }
    const fetchPageData = (id: string) => {
      store.dispatch('fetchColumn', id)
      // 如果缓存currentPage为第一页,说明是首次加载,可以发送请求,否则说明该专栏已经加载过,直接读取缓存即可
      if (cache.value.currentPage === 1) {
        store.dispatch('fetchPosts', id)
      }
    }
    // watch监听route上的专栏Id,重新刷新页面数据,用以处理专栏详情页面的切换
    watch(cid, (newVal) => {
      if (route.name === 'column') {
        console.log('watch to fetch: ', newVal)
        fetchPageData(newVal)
      }
    })
    onMounted(() => {
      fetchPageData(cid.value)
    })
    return {
      column,
      posts,
      onLoadMore,
      isEndPage
    }
  },
})
</script>


<style>

</style>
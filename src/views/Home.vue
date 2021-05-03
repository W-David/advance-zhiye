<template>
  <div class="w-75 mx-auto">
    <column-list :columns="columns"></column-list>
    <load-more text="更多专栏" noMore="已经到底了欧" :isShow="!isEndPage" @on-load-more="onLoadMore"></load-more>
  </div>
</template>

<script lang="ts">
import ColumnList from '@/components/show/ColumnList.vue';
import { computed, defineComponent, onMounted } from 'vue';
import { useStore } from 'vuex'
import { GlobalStateData, ColumnsProps } from '@/store/index'
import LoadMore from '@/components/widgets/LoadMore.vue'
import useEndPage from '@/hooks/useEndPage';

export default defineComponent({
  name: 'Home',
  components: { 
    ColumnList,
    LoadMore
  },
  setup () {
    const store = useStore<GlobalStateData>()
    const columns = computed(() => store.getters.getColumns as ColumnsProps)
    const cache = computed(() => store.state.columnsCache)
    const isEndPage = useEndPage(cache)
    const onLoadMore = () => {
      store.dispatch('fetchColumns')
    }
    onMounted(() => {
      if (cache.value.currentPage === 1) {
        store.dispatch('fetchColumns')
      }
    })
    return {
      columns,
      onLoadMore,
      isEndPage
    }
  }
});
</script>

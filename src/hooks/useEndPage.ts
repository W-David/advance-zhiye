import { PageCacheProps } from "@/store/index";
import { computed, ComputedRef } from "vue";

const useEndPage = (cache: ComputedRef<PageCacheProps>) => {
  const isEndPage = computed(() => Math.ceil(cache.value.totalCount / cache.value.pageSize) < cache.value.currentPage)
  return isEndPage
}

export default useEndPage
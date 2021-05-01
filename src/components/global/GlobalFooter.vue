<template>
  <div class="global-footer-container d-flex bg-light text-white">
    <ul class="link-list m-auto ps-0">
      <li class="footer-links mx-2 d-inline-block" 
            v-for="link in links"
            :key="link.id">
        <a :href="link.url" target="_blank" class="text-decoration-none">
          {{ link.name }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { formatDateId } from '@/utils/helper'
export interface LinkProps {
  id: string;
  url: string;
  name: string;
}
export type LinksProps = LinkProps[]
export default defineComponent({
  setup() {
    const links: LinksProps = [
      {
        id: formatDateId(), 
        url: '#',
        name: '项目地址'
      },
      {
        id: formatDateId(),
        url: '#',
        name: '关于我'
      },
      {
        id: formatDateId(),
        url: '#',
        name: '博客'
      }
    ]
    return {
      links
    }
  }
})
</script>

<style scoped>
  .global-footer-container {
    height: 60px;
  }
  .link-list {
    list-style: none;
  }
</style>
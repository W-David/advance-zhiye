<template>
  <li class="dropdown-item-container"
      :class="{'disable': disable}">
    <slot></slot>
  </li>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'dropDownItem',
  props: {
    disable: {
      type: Boolean,
      default: false
    }
  }
})
</script>


<style scoped>
  .dropdown-item-container.disable {
    pointer-events: none;
    color: antiquewhite;
    background-color: transparent;
  }
</style>
<template>
  <teleport to="#rootMessage">
    <div class="alert alert-dismissible fade show fixed-top w-75 mx-auto d-flex mt-5"
         :class="classObj" 
         v-if="showMessage"
         role="alert">
      <span>{{ msgInfo }}</span>
      <button type="button" 
              class="btn-close-message btn-close ms-auto"
              data-bs-dismiss="alert"
              @click.prevent="closeMessage">
      </button>
    </div>
  </teleport>
</template>

<script lang="ts">
import useDOMCreate from '@/hooks/useDOMCreate'
import { defineComponent, PropType, ref } from 'vue'
export type MsgType = 'danger' | 'success' | 'warning' | 'info'
export default defineComponent({
  name: 'message',
  props: {
    msgType: {
      type: String as PropType<MsgType>,
      required: true
    },
    msgInfo: String
  },
  setup(props) {
    useDOMCreate('rootMessage')
    const showMessage = ref(true)
    const classObj = {
      'alert-danger': props.msgType === 'danger',
      'alert-success': props.msgType === 'success',
      'alert-warning': props.msgType === 'warning',
      'alert-info': props.msgType === 'info'
    }
    const closeMessage = () => showMessage.value = false
    return {
      classObj,
      showMessage,
      closeMessage
    }
  }
})
</script>

<style>
</style>
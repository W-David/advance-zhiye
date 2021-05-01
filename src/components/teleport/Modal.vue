<template>
  <teleport to="#rootModal">
    <div class="modal d-block" v-if="isShow">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
            <button type="button" class="btn-close" @click="userSelect(false)"></button>
          </div>
          <div class="modal-body d-flex align-items-center">
            <p>{{ message }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="userSelect(false)">取消</button>
            <button type="button" class="btn btn-primary" @click="userSelect(true)">确定</button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import useDOMCreate from '@/hooks/useDOMCreate'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'modal',
  props: {
    title: String,
    message: String,
    isShow: Boolean
  },
  emits: ['user-select', 'update:isShow'],
  setup(props, context) {
    useDOMCreate('rootModal')
    const userSelect = (select: boolean) => {
      context.emit('user-select', select)
      context.emit('update:isShow', false)
    }
    return {
      userSelect
    }
  }
})
</script>

<style>

</style>
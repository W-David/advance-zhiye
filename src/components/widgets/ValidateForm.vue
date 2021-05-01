<template>
  <div class="validate-form-container">
    <slot></slot>
    <div class="submit-area" @click.prevent="submitForm">
      <slot name="submit-slot"></slot>
    </div>
  </div>
</template>


<script lang="ts">
import mitt from 'mitt'
export const emitter = mitt()
import { defineComponent, onUnmounted } from 'vue'

export type Validator = (() => boolean) | undefined
export type Validators = Validator[]
export default defineComponent({
  name: 'validateForm',
  emits: ['form-submit'],
  setup (props, context) {
    // 验证函数数组
    let validators: Validators = []
    // every 判断是否每个验证函数都通过, emit 发射事件,表单提交逻辑交给父组件处理
    const submitForm = () => {
      const allPassed = validators.every(validator => validator? validator() : false)
      context.emit('form-submit', allPassed)
    }
    // form-item-mounted 事件的回调, 将输入框的验证函数加入数组
    const pushValidator = (validator: Validator) => {
      validators.push(validator)
    }
    // 监听 form-item-mounted 事件
    emitter.on('form-item-mounted', pushValidator)
    // 移除事件并清空验证数组
    onUnmounted(() => {
      emitter.off('form-item-mounted', pushValidator)
      validators = []
    })
    return {
      submitForm
    }
  }
})
</script>

<style>

</style>
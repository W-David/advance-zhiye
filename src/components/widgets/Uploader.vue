<template>
  <div class="uploader-container w-100 my-2">
    <div class="custom-uploader" @click.prevent="toggleUploader" v-bind="$attrs">
      <div class="ready-container" v-if="upStateRef === 'ready'">
        <slot name="ready-slot">
          <button class="btn btn-primary">开始上传</button>
        </slot>
      </div>
      <div class="uploading-container" v-else-if="upStateRef === 'uploading'">
        <slot name="uploading-slot">
          <button class="btn btn-info">正在上传...</button>
        </slot>
      </div>
      <div class="failed-container" v-else-if="upStateRef === 'failed'">
        <slot name="failed-slot">
          <button class="btn btn-danger">上传失败</button>
        </slot>
      </div>
      <div class="success-container" v-else>
        <slot name="success-slot" :uploadedData="uploadedData">
          <button class="btn btn-success">上传成功!</button>
        </slot>
      </div>
    </div>
    <input class="d-none" type="file" ref="nativeInputRef" @change="inputHandler">
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import { defineComponent, PropType, Ref, ref, watch } from 'vue'
export type UpState = 'ready' | 'uploading' | 'failed' | 'success'
export type Uploadcheck = (file: File) => boolean

export default defineComponent({
  namn: 'uploader',
  props: {
    uploaded: Object,
    uploadCheck: Function as PropType<Uploadcheck>
  },
  inheritAttrs: false,
  emits: ['upload-success','upload-failed'],
  setup (props, context) {
    const upStateRef: Ref<UpState> = ref(props.uploaded? 'success' : 'ready')
    const nativeInputRef: Ref<HTMLInputElement | null> = ref(null)
    // 获取上传的返回数据, 传给作用域插槽, 这样即可可从插槽获取到上传返回的数据
    const uploadedData = ref(props.uploaded)
    watch(() => props.uploaded, (newVal) => {
    // 如果父组件改变了 uploaded,说明已有上传过的数据,此时状态应为上传成功,并把上传过的数据交给插槽处理
      if (newVal) {
        upStateRef.value = 'success'
        uploadedData.value = newVal 
      }
    })
    const toggleUploader = () => {
      if (nativeInputRef.value) {
        nativeInputRef.value.click()
      }
    }
    const inputHandler = (e: Event) => {
      const target = e.target as HTMLInputElement
      const files = target.files
      const file = files?.item(0)
      // 如果没有选择文件, !file为真,函数返回,如果选择了文件, !file为假(file为真),逻辑与继续向后运算去检查文件
      if (!file || (props.uploadCheck && !props.uploadCheck(file))) {
        return
      }
      const formData = new FormData()
      formData.append(file.name, file)
      upStateRef.value = 'uploading' 
      axios.post('upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data'}
      }).then(res => {
        return res.data
      }).then((responseData) => {
        const { data }  = responseData
        uploadedData.value = data
        upStateRef.value = 'success'
        context.emit('upload-success', data)
      }).catch((err) => {
        upStateRef.value = 'failed'
        context.emit('upload-failed', err)
      })
    }
    return {
      upStateRef,
      nativeInputRef,
      toggleUploader,
      inputHandler,
      uploadedData
    }
  },
})
</script>


<style scoped>
.uploader-container {
  cursor: pointer;
}

</style>
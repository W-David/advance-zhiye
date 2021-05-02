<template>
  <div class="user-column-container">
    <uploader :uploaded="uploadedData"
              :uploadCheck="beforeCheck"
              @upload-success="uploadSuccess"
              @upload-failed="uploadFailed">
      <template #ready-slot>
        <div class="column-uploader">
          <div class="column-avatar-container bg-light">
            <p class="text-info mb-0">上传头图</p>
          </div>
        </div>
      </template>
      <template #uploading-slot>
        <div class="column-uploader">
          <div class="column-avatar-container bg-secondary">
            <div class="spinner-grow spinner-grow-sm text-warning" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </template>
      <template #failed-slot>
        <div class="column-uploader">
          <div class="column-avatar-container bg-failed">
            <p class="text-danger mb-0">上传失败</p>
          </div>
        </div>
      </template>
      <template #success-slot="slotData">
        <div class="column-uploader">
          <div class="column-avatar-container avatar-stage"
              :style="{ backgroundImage: 'url(' + slotData.uploadedData.url + ')'} ">
            <p class="text-info mb-0">重新上传</p>
          </div>
        </div>
      </template>
    </uploader>
    <validate-form @form-submit="submitColumn">
      <validate-input floating="专栏标题"
                      :rules="titleRules"
                      tagType="input"
                      v-model="titleRef"
                      type="text">
      </validate-input>
      <validate-input floating="专栏简介"
                      :rules="descriptionRules"
                      tagType="textarea"
                      v-model="descriptionRef"
                      rows="8">
      </validate-input>
      <template #submit-slot>
        <button class="btn btn-primary w-100">修改专栏信息</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { ColumnProps, GlobalStateData, ResponseDataType } from '@/store/index'
import { computed, defineComponent, onMounted, ref } from 'vue'
import { ImageProps, UploadColumn } from '@/store/index'
import Uploader from '@/components/widgets/Uploader.vue'
import ValidateInput, { RulesProps }  from '@/components/widgets/ValidateInput.vue'
import ValidateForm  from '@/components/widgets/ValidateForm.vue'
import createMessage from '@/utils/createMessage'
import { checkByCondition } from '@/utils/helper'
import { useStore } from 'vuex'


export default defineComponent({
  name: 'userColumn',
  components: {
    Uploader,
    ValidateForm,
    ValidateInput
  },
  setup () {
    const store = useStore<GlobalStateData>()
    const titleRef = ref('')
    const descriptionRef = ref('')
    const uploadedData = ref()
    const cid = computed(() => store.state.user.column)
    let avatarId = ''
    const titleRules: RulesProps = [
      { type: 'notEmpty', message: '专栏标题不能为空'}
    ]
    const descriptionRules: RulesProps = [
      { type: 'notEmpty', message: '专栏简介不能为空' }
    ]

    onMounted(() => {
      store.dispatch('fetchColumn', cid.value).then((res: ResponseDataType<ColumnProps>) => {
        const { data } = res
        const { avatar, title, description } = data as ColumnProps
        uploadedData.value = avatar || { url: require('@/assets/user.png') }
        titleRef.value = title || '' 
        descriptionRef.value = description || ''
      }).catch(err => {
        console.log('userColumn fetch failed: ', err.message)
      })
    })

    const beforeCheck = (file: File) => {
      const { error, pass} = checkByCondition(file, {
        format: ['image/jpeg', 'image/png'],
        size: 1
      })
      if (error === 'format') {
        createMessage('danger', '仅支持JPG,PNG格式', 1500)
      }
      if (error === 'size') {
        createMessage('danger', '图片需小于1M', 1500)
      }
      return pass
    }
    const uploadSuccess = (data: ImageProps) => {
      avatarId = data._id || ''
    }
    const uploadFailed = (err: Error) => {
      console.log('upload column\'s avater: ', err.message)
    }
    const submitColumn = (isAllPassed: boolean) => {
      if (!isAllPassed) {
        return
      }
      const payload: UploadColumn = {
        title: titleRef.value,
        description: descriptionRef.value,
      }
      if (avatarId) {
        payload.avatar = avatarId
      }
      store.dispatch('updateColumn',payload).then(() => {
        createMessage('success', '专栏信息修改成功', 1500)
      }).catch(err => {
        console.log('update column info: ', err.message)
        createMessage('danger', '操作失败', 1200)
      })
    }
    return {
      uploadedData,
      titleRef,
      descriptionRef,
      titleRules,
      descriptionRules,
      beforeCheck,
      uploadSuccess,
      uploadFailed,
      submitColumn
    }
  }
})
</script>

<style scoped>
.column-uploader {
  height: 200px;
  margin-top: 5px;
  margin-bottom: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.column-avatar-container {
  width: 80px;
  height: 80px;
  border-radius: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bg-failed {
  background-color: #fcaf9c;
}

.avatar-stage {
  background-position: center;
  background-size: cover;
}
</style>
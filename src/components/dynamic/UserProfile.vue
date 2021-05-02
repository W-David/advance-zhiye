<template>
  <div class="user-profile-container">
    <uploader :uploaded="uploadedData"
              :uploadCheck="beforeCheck"
              @upload-success="uploadSuccess"
              @upload-failed="uploadFailed">
      <template #ready-slot>
        <div class="profile-uploader">
          <div class="profile-avatar-container bg-light">
            <p class="text-info mb-0">上传头像</p>
          </div>
        </div>
      </template>
      <template #uploading-slot>
        <div class="profile-uploader">
          <div class="profile-avatar-container bg-secondary">
            <div class="spinner-grow spinner-grow-sm text-warning" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </template>
      <template #failed-slot>
        <div class="profile-uploader">
          <div class="profile-avatar-container bg-failed">
            <p class="text-danger mb-0">上传失败</p>
          </div>
        </div>
      </template>
      <template #success-slot="slotData">
        <div class="profile-uploader">
          <div class="profile-avatar-container avatar-stage"
              :style="{ backgroundImage: 'url(' + slotData.uploadedData.url + ')'} ">
            <p class="text-info mb-0">重新上传</p>
          </div>
        </div>
      </template>
    </uploader>
    <validate-form @form-submit="submitProfile">
      <validate-input floating="昵称"
                      :rules="nickNameRules"
                      tagType="input"
                      v-model="nickNameRef"
                      type="text">
      </validate-input>
      <validate-input floating="个人简介"
                      :rules="descriptionRules"
                      tagType="textarea"
                      v-model="descriptionRef"
                      rows="8">
      </validate-input>
      <template #submit-slot>
        <button class="btn btn-primary w-100">修改个人信息</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { GlobalStateData, ResponseDataType, UserProps } from '@/store/index'
import { defineComponent, onMounted, ref } from 'vue'
import { ImageProps, UploadUser } from '@/store/index'
import Uploader from '@/components/widgets/Uploader.vue'
import ValidateInput, { RulesProps }  from '@/components/widgets/ValidateInput.vue'
import ValidateForm  from '@/components/widgets/ValidateForm.vue'
import createMessage from '@/utils/createMessage'
import {checkByCondition } from '@/utils/helper'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'userProfile',
  components: {
    Uploader,
    ValidateForm,
    ValidateInput
  },
  setup () {
    const store = useStore<GlobalStateData>()
    const uid = ref('')
    const nickNameRef = ref('')
    const descriptionRef = ref('')
    const uploadedData = ref()
    let avatarId = ''
    const nickNameRules: RulesProps = [
      { type: 'notEmpty', message: '昵称不能为空'}
    ]
    const descriptionRules: RulesProps = [
      { type: 'notEmpty', message: '个人介绍不能为空' }
    ]

    onMounted(() => {
      store.dispatch('fetchCurrentUser').then((res: ResponseDataType<UserProps>) => {
        const { data } = res
        const { _id ,avatar ,nickName, description } = data as UserProps
        uid.value = _id || ''
        uploadedData.value = avatar || { url: require('@/assets/user.png') }
        nickNameRef.value = nickName || '' 
        descriptionRef.value = description || ''
      }).catch(err => {
        console.log('userProfile fetch failed: ', err.message)
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
      console.log('upload user\'s avatar: ', err.message)
    }
    const submitProfile = (isAllPassed: boolean) => {
      if (!isAllPassed) {
        return
      }
      const payload: UploadUser = {
        _id: uid.value,
        nickName: nickNameRef.value,
        description: descriptionRef.value,
      }
      if (avatarId) {
        payload.avatar = avatarId
      }
      store.dispatch('updateUser',payload).then(() => {
        createMessage('success', '修改成功', 1500)
      }).catch(err => {
        console.log('update user info: ', err.message)
        createMessage('danger', '操作失败', 1200)
      })
    }
    return {
      uploadedData,
      nickNameRef,
      descriptionRef,
      nickNameRules,
      descriptionRules,
      beforeCheck,
      uploadSuccess,
      uploadFailed,
      submitProfile
    }
  }
})
</script>

<style scoped>
.profile-uploader {
  height: 200px;
  margin-top: 5px;
  margin-bottom: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.profile-avatar-container {
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
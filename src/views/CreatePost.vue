<template>
  <div class="create-post-page w-75 mx-auto">
    <h3 class="mb-4 text-center" v-if="isEditMode">新建文章</h3>
    <h3 class="mb-4 text-center" v-else>编辑文章</h3>
    <div class="col-12 col-md-8 offset-md-2">
      <uploader :uploaded="responseData"
                :uploadCheck="beforeCheck"
                @upload-success="uploadSuccess"
                @upload-failed="uploadFailed">
        <template #ready-slot>
          <div class="post-uploader bg-light rounded">
            <p class="text-primary mb-0">上传文章头图</p>
          </div> 
        </template>
        <template #uploading-slot>
          <div class="post-uploader bg-light rounded">
            <div class="spinner-grow text-warning" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        </template>
        <template #failed-slot>
          <div class="post-uploader bg-failed rounded">
            <p class="text-danger mb-0">上传失败</p>
          </div>
        </template>
        <template #success-slot="slotData">
          <div class="post-uploader
                      avatar-stage
                      rounded"
               :style="{backgroundImage: 'url(' + slotData.uploadedData.url + ')'}">
            <p class="text-info mb-0">重新上传</p>
          </div>
        </template>
      </uploader>
      <validate-form @form-submit="submitForm">
        <p class="pl-2 text-start">文章标题</p>
        <validate-input :rules="titleRules"
                        tagType="input"
                        v-model="titleRef"
                        type="text"
                        placeholder="请输入文章标题">
        </validate-input>
        <p class="pl-2 text-start">文章内容</p>
        <validate-input :rules="contentRules"
                        tagType="textarea"
                        v-model="contentRef"
                        rows="10"
                        placeholder="开始写文章...">
        </validate-input>
        <template #submit-slot>
          <div class="btn-submitpost-container text-center">
            <button class="btn btn-primary w-50" v-if="isEditMode">更新文章</button>
            <button class="btn btn-primary w-50" v-else>提交文章</button>
          </div>
        </template>
      </validate-form>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { GlobalStateData, ImageProps, PostProps, ResponseDataType, UploadEditPost, UploadCreatePost } from '@/store/index'
import ValidateInput, { RulesProps } from '@/components/widgets/ValidateInput.vue'
import ValidateForm from '@/components/widgets/ValidateForm.vue'
import Uploader from '@/components/widgets/Uploader.vue'
import { useRoute, useRouter } from 'vue-router'
import createMessage from '@/utils/createMessage'
import { checkByCondition } from '@/utils/helper'
import useTimeout from '@/hooks/useTimeout'

export default defineComponent({
  name: 'createPost',
  components: {
    ValidateInput,
    ValidateForm,
    Uploader
  },
  setup() {
    const store = useStore<GlobalStateData>()
    const route = useRoute()
    const router = useRouter()
    const user = computed(() => store.state.user)
    const updatePid = route.params.id
    // 根据路由路径参数判断是否为编辑模式
    const isEditMode = !!updatePid
    let imageId = ''

    const titleRef = ref('')
    const contentRef = ref('')
    const responseData = ref()

    onMounted(() => {
      if (isEditMode) {
        store.dispatch('fetchPost',updatePid).then((res: ResponseDataType<PostProps>) => {
          const { data } = res
          // 当文章上传没有头图,responseData被赋值为undefined,此时uploader状态为ready,即不显示头图
          responseData.value = data?.image
          titleRef.value = data?.title || ''
          contentRef.value = data?.content || ''
        }).catch(err => {
          console.log('createPost fetch failed: ', err.message)
        })
      }
    })
    const titleRules: RulesProps = [
      { type: 'notEmpty', message: '文章标题不能为空' }
    ]
    const contentRules: RulesProps = [
      { type: 'notEmpty', message: '文章内容不能为空' }
    ]
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
      imageId = data._id || ''
    }
    const uploadFailed = (err: Error) => {
      console.log('upload post\'s image: ', err.message)
    }
    const routerCallback = () => {
      router.push({ name: 'column', params: { id: user.value.column as string} })
    }
    const submitForm = (isAllPassed: boolean) => {
      if (!isAllPassed) {
        return
      }
      if (isEditMode) {
        let payload: UploadEditPost = {
          pid: updatePid as string,
          title: titleRef.value,
          content: contentRef.value
        }
        if (imageId) payload.image = imageId
        store.dispatch('updatePost', payload).then(() => {
          createMessage('success', '更新成功咯(～￣▽￣)～', 1000)
          useTimeout(routerCallback, 800) 
        }).catch(err => {
          createMessage('danger', '更新失败', 800)
          console.log('updatePost failed: ', err.message)
        })
      } else {
        let payload: UploadCreatePost = {
          title: titleRef.value,
          content: contentRef.value,
          column: user.value.column as string,
          author: user.value._id as string
        }
        if (imageId) payload.image = imageId
        store.dispatch('createPost', payload).then(() => {
          createMessage('success', '创建成功啦（*＾-＾*）',1000)
          useTimeout(routerCallback, 800)
        }).catch(err => {
          createMessage('danger', '创建失败', 800)
          console.log('createPost failed: ', err.message)
        })
      }
    }
    return {
      titleRef,
      contentRef,
      submitForm,
      titleRules,
      contentRules,
      responseData,
      isEditMode,
      beforeCheck,
      uploadSuccess,
      uploadFailed,
    }
  },
})
</script>

<style scoped>

.post-uploader {
  height: 250px;
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
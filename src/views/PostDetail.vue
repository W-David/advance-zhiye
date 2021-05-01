<template>
  <div class="post-detail-page">
    <div class="col-10 offset-1 col-md-8 offset-md-2" v-if="post">
      <div class="post-detail-avatar-container mb-3 w-100" v-if="post.image">
        <img :src="post.image.fitUrl" alt="No image" class="avatar-img rounded w-100">
      </div>
      <h4 class="text-start lh-base my-3 text-break">{{ post.title }}</h4>
      <author-info v-if="post.content"
                   :author="author" 
                   :createdAt="post.createdAt" 
                   :updatedAt="post.updatedAt">
      </author-info>
      <div class="post-content-container p-2 mt-3" v-html="contentHTML">
      </div>
      <!-- modal中emits声明了update:isShow事件,这里需要显式地定义事件,无法使用v-model-->
      <modal :isShow="isShowModal"
             @update:isShow="isShowModal = $event"
             @user-select="userSelect"
             title="删除文章"
             message="确定要删除这篇文章吗?">
      </modal>
      <div class="mt-3 w-50 mx-auto" v-if="isShowEdit">
        <button class="btn btn-primary w-100 mb-3" @click="editPost">编辑文章</button>
        <button class="btn btn-danger w-100 mb-3" @click="removePost">删除文章</button>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { computed, ComputedRef, defineComponent, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { GlobalStateData, PostProps, ResponseDataType, UserProps } from '@/store/index'
import AuthorInfo from '@/components/show/AuthorInfo.vue'
import Modal from '@/components/teleport/Modal.vue'
import MarkdownIt from 'markdown-it'
import createMessage from '@/utils/createMessage'
import { generateFitUrl } from '@/utils/helper'
import useTimeout from '@/hooks/useTimeout'

export default defineComponent({
  name: 'postDetail',
  components: {
    AuthorInfo,
    Modal
  },
  setup () {
    const store = useStore<GlobalStateData>()
    const route = useRoute() 
    const router = useRouter()
    const pid = route.params.id
    const md = new MarkdownIt()
    const isShowModal = ref(false)
    const user: ComputedRef<UserProps> = computed(() => store.state.user)
    const post: ComputedRef<PostProps> = computed(() => store.getters.getPostByPid(pid))
    const author: ComputedRef<UserProps> = computed(() => generateFitUrl(post.value.author as UserProps))
    const contentHTML = computed(() => {
      if (post.value && post.value.content) {
        const {isHTML, content} = post.value
        return isHTML ? content : md.render(content)
      }
      return ''
    })

    onMounted(() => {
      store.dispatch('fetchPost', pid)
    })
    const isShowEdit = computed(() => {
      const { isLogin, _id } = user.value
      if (isLogin) {
        return post.value?.author?._id === _id
      } else {
        return false
      }
    })

    const userSelect = (select: boolean) => {
      if (!select) {
        createMessage('info', '操作已取消', 1200)
      } else {
        store.dispatch('deletePost', pid).then((data: ResponseDataType<PostProps>) => {
          createMessage('success', '删除成功,即将跳转到专栏...', 1200)
          useTimeout(() => {
            router.push({name: 'column', params: {id: data.data?.column as string}})
          }, 1200)
        }).catch(err => {
          createMessage('danger', '删除失败', 800)
          console.log('deletePost failed: ', err.message)
        })
      }
    }

    const editPost = () => {
      router.push({name: 'create', params: {id: post.value._id as string}})
    }

    const removePost = () => {
      isShowModal.value = true
    }

    return {
      post,
      isShowModal,
      isShowEdit,
      contentHTML,
      userSelect,
      editPost,
      removePost,
      author
    }
  }
})
</script>

<style scoped>
.avatar-img {
  height: 250px;
  object-fit: cover;
}

</style>
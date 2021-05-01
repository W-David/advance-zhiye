<template>
  <div class="login-page w-75 mx-auto">
    <h3 class="text-center my-5">用户登录</h3>
    <div class="col-12 col-md-6 offset-md-3 col-lg-4 offset-lg-4">
      <validate-form @form-submit="formSubmit">
        <validate-input floating="邮箱"
                        :rules="emailRules"
                        tagType="input" 
                        v-model="userEmailRef" 
                        type="email" 
                        placeholder="请输入邮箱地址">
        </validate-input>
        <validate-input floating="密码"
                        :rules="passwdRules"
                        tagType="input" 
                        v-model="userPasswdRef" 
                        type="password" 
                        placeholder="请输入密码">
        </validate-input>
        <router-link class="text-center text-decoration-none" to="/signup">还没有账号?来注册一个吧</router-link>
        <template #submit-slot>
          <div class="submit-btn-container">
            <button class="btn btn-primary w-100 mt-3">登录</button>
          </div>
        </template>
      </validate-form>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, ref } from 'vue'
import ValidateForm from '@/components/widgets/ValidateForm.vue'
import ValidateInput, { RulesProps } from '@/components/widgets/ValidateInput.vue'
import { useStore } from 'vuex'
import createMessage from '@/utils/createMessage'
import { useRouter } from 'vue-router'
import { GlobalStateData, UploadLogin } from '@/store/index'
import useTimeout from '@/hooks/useTimeout'

export default defineComponent({
  name: 'login',
  components: {
    ValidateForm,
    ValidateInput
  },
  setup() {
    const store = useStore<GlobalStateData>()
    const router = useRouter()
    const userEmailRef = ref('')
    const userPasswdRef = ref('')
    const passwdLenValidator = () => userPasswdRef.value.length >= 6 && userPasswdRef.value.length <= 16
    const user = computed(() => store.state.user)
    let timer = 0
    const emailRules: RulesProps = [
      {type: 'notEmpty', message: '邮箱不能为空'},
      {type: 'email', message: '邮箱格式错误'}
    ]
    const passwdRules: RulesProps = [
      {type: 'notEmpty', message: '密码不能为空'},
      {type: 'custom', message: '密码长度至少为6位,最多16位', customValidator: passwdLenValidator}
    ]
    const formSubmit = (allPassed: boolean) => {
      if (!allPassed) {
        return
      }
      const payload: UploadLogin = {
        email: userEmailRef.value, 
        password: userPasswdRef.value
      }
      store.dispatch('userLogin', payload).then(({ data }) => {
        createMessage('success',`欢迎你, ${data.nickName}`,1200)
        useTimeout(() => router.push('/'), 1500)
      }).catch(e => {
        createMessage('danger', '该用户不存在或密码错误',1200)
        console.log('login failed: ', e.message)
      })
    }
    onMounted(() => {
      userEmailRef.value = user.value.email || '' 
    })
    return {
      userEmailRef,
      userPasswdRef,
      emailRules,
      passwdRules,
      formSubmit
    }
  }
})
</script>

<style>

</style>
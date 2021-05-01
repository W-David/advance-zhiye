<template>
  <div class="login-page w-75 mx-auto">
    <h3 class="text-center my-5">用户注册</h3>
    <div class="col-12 col-md-6 offset-md-3 col-lg-4 offset-lg-4">
      <validate-form @form-submit="formSubmit">
        <validate-input floating="邮箱"
                        :rules="emailRules"
                        tagType="input" 
                        v-model="userEmailRef" 
                        type="email" 
                        placeholder="请输入邮箱地址">
        </validate-input>
        <validate-input floating="昵称"
                        :rules="nickNameRules"
                        tagType="input" 
                        v-model="nickNameRef" 
                        type="text" 
                        placeholder="请输入昵称">
        </validate-input>
        <validate-input floating="密码"
                        :rules="passwdRules"
                        tagType="input" 
                        v-model="userPasswdRef" 
                        type="password" 
                        placeholder="请输入密码">
        </validate-input>
        <validate-input floating="重复密码"
                        :rules="rePasswdRules"
                        tagType="input" 
                        v-model="rePasswdRef" 
                        type="password" 
                        placeholder="重复密码">
        </validate-input>
        <template #submit-slot>
          <div class="submit-btn-container">
            <button class="btn btn-primary w-100">注册</button>
          </div>
        </template>
      </validate-form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ValidateForm from '@/components/widgets/ValidateForm.vue'
import ValidateInput, { RulesProps } from '@/components/widgets/ValidateInput.vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import createMessage from '@/utils/createMessage'
import { UploadSignup } from '@/store/index'

export default defineComponent({
  name: 'login',
  components: {
    ValidateForm,
    ValidateInput
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const userEmailRef = ref('')
    const userPasswdRef = ref('')
    const nickNameRef = ref('')
    const rePasswdRef = ref('')

    const passwdLenValidator = () => userPasswdRef.value.length >= 6 && userPasswdRef.value.length <= 16
    const rePasswdValidator = () => userPasswdRef.value === rePasswdRef.value

    const emailRules: RulesProps = [
      {type: 'notEmpty', message: '邮箱不能为空'},
      {type: 'email', message: '邮箱格式错误'}
    ]
    const nickNameRules: RulesProps = [
      {type: 'notEmpty', message: '邮箱不能为空'},
      {type: 'username', message: '昵称长度最小4位,最多15位'}
    ]
    const passwdRules: RulesProps = [
      {type: 'notEmpty', message: '密码不能为空'},
      {type: 'custom', message: '密码长度至少为6位,最多16位', customValidator: passwdLenValidator}
    ]
    const rePasswdRules: RulesProps = [
      {type: 'notEmpty', message: '密码不能为空'},
      {type: 'custom', message: '两次输入不一致', customValidator: rePasswdValidator},
    ]
    const formSubmit = (isAllPassed: boolean) => {
      if (!isAllPassed) {
        return
      }
      const payload: UploadSignup = {
        email: userEmailRef.value,
        nickName: nickNameRef.value,
        password: userPasswdRef.value
      }
      store.dispatch('signup', payload).then(() => {
        createMessage('success', '注册成功,即将跳转登录...',1200)
        router.push('/login')
      }).catch(err => {
        console.log('signup failed: ', err.message)
        createMessage('danger', '注册失败', 1200)
      })
    }
    return {
      userEmailRef,
      nickNameRef,
      userPasswdRef,
      rePasswdRef,
      emailRules,
      nickNameRules,
      passwdRules,
      rePasswdRules,
      formSubmit
    }
  }
})
</script>

<style>

</style>
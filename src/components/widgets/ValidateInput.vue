<template>
  <div class="validate-input-container mb-3 mb-lg-4"
       :class="[prefix? 'input-group': '', floating? 'form-floating': '']">
    <span class="input-group-text" v-if="prefix">{{ prefix }}</span>
    <input v-if="tagType === 'input'"
            class="form-control rounded-end"
            :class="{'is-invalid': isInvalid}"
            v-model="modelVal"
            @blur="validator"
            v-bind="$attrs"/>
    <textarea v-else
              class="form-control rounded-end"
              :class="{'is-invalid': isInvalid}"
              v-model="modelVal"
              @blur="validator"
              v-bind="$attrs">
    </textarea>
    <label v-if="floating">{{ floating }}</label>
    <div class="invalid-feedback" v-show="isInvalid">
      {{ validateMessage }}
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref } from 'vue'
import { emitter } from '@/components/widgets/ValidateForm.vue'
export type RuleType = 'notEmpty' | 'username' | 'email' | 'custom'
export type TagType = 'input' | 'textarea'
export interface RuleProps {
  type: RuleType;
  message: string;
  customValidator?: () => boolean;
}
export type RulesProps = RuleProps[]
const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

export default defineComponent({
  name: 'validateInput',
  inheritAttrs: false,
  props: {
    prefix: String,
    floating: String,
    rules: Array as PropType<RulesProps>,
    tagType: {
      type: String as PropType<TagType>,
      required: true
    },
    modelValue: {
      type: String,
      required: true
    } 
  },
  setup (props, context) {
    const modelVal = computed({
      get: () => props.modelValue || '',
      set: (val) => context.emit('update:modelValue', val)
    })
    const validateMessage = ref('')
    const isInvalid = ref(false)
    const validator = () => {
      if (!props.rules) {
        return true
      }
      const isPass = props.rules.every(rule => {
        let passed = true
        validateMessage.value = rule.message
        switch (rule.type) {
          case 'notEmpty':
            passed = modelVal.value.trim() !== ''
            break
          case 'username':
            passed = modelVal.value.length >=4 && modelVal.value.length <=15
            break
          case 'email':
            passed = emailReg.test(modelVal.value)
            break
          case 'custom':
            passed = rule.customValidator? rule.customValidator() : true
            break
          default:
            break
        }
        return passed
      })
      isInvalid.value = !isPass
      if (!isPass) {
        modelVal.value = ''
      }
      return isPass
    }
    //form 中使用 slot, 无法使用原生的 emit, 使用 mitt 将 validator 发射出去, 由 form 做统一验证 
    onMounted(() => emitter.emit('form-item-mounted', validator))
    return {
      modelVal,
      validateMessage,
      isInvalid,
      validator
    }
  }
})
</script>

<style>

</style>
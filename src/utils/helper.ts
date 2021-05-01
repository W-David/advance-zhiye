import { ColumnProps, PostProps, indexableObj, UserProps } from "@/store/index"

// 生成唯一的ID
export const formatDateId = () => {
  const date = new Date()
  const y = date.getFullYear()
  let m = date.getMonth() + 1
  m = m < 10 ? +('0' + m) : m
  let d = date.getDate()
  d = d < 10 ? +('0' + d) : d
  const h = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  const res = y + m + d + h + minute + second
  return res + Math.random().toString(36).substr(2)
}

// 用is做类型判断, 并且is会将ts类型确定下来
const isUserProps = (obj: any): obj is UserProps => obj && 'email' in obj
const isPostProps = (obj: any): obj is PostProps => obj && 'excerpt' in obj
// 对专栏和文章的头图做特殊处理, 对于专栏没有头图要显示默认的图片,文章没有头图则不显示
export const generateFitUrl = (fitData: ColumnProps | PostProps | UserProps, width = 50, height = 50) => {
  // 在调用此函数时, mounted可能还未执行, 此时并未 fetch 到数据,拿到数据直接返回即可
  if (!fitData) {
    return fitData
  }
  if (isPostProps(fitData)) {
    if (fitData.image) {
      fitData.image.fitUrl = fitData.image.url
    }
    return fitData as PostProps
  } else if (isUserProps(fitData)) {
    if (fitData.avatar) {
      fitData.avatar.fitUrl = fitData.avatar.url
    } else {
      fitData.avatar = { fitUrl: require('@/assets/user.png') }
    }
    return fitData as UserProps
  } else {
    if (fitData.avatar) {
      fitData.avatar.fitUrl = fitData.avatar.url
    } else {
      fitData.avatar = { fitUrl: require('@/assets/user.png') }
    }
    return fitData as ColumnProps
  }
}

// 要检查的条件
export interface CheckedCondition {
  format?: string[],
  size?: number;
}
// 返回的错误类型
export type ErrorType = 'format' | 'size' | null
// 根据传入的条件对文件做检查, 返回布尔值,并额外返回一个错误类型用以判断哪步检查未通过
export const checkByCondition = (file: File, conditions: CheckedCondition) => {
  let errorType: ErrorType = null
  const allCheckPassed = Object.keys(conditions).every(condition => {
    let checkPassed = true
    switch (condition) {
      case 'format':
        checkPassed = (conditions.format as string[]).includes(file.type)
        errorType = checkPassed ? null : 'format'
        break
      case 'size':
        checkPassed = file.size / (1024 * 1024) <= (conditions.size as number)
        errorType = checkPassed ? null : 'size'
        break
      default:
        break
    }
    return checkPassed
  })
  return {
    error: errorType,
    pass: allCheckPassed
  }
}

export const obj2Arr = <T> (obj: indexableObj<T>) => Object.keys(obj).map(key => obj[key])
export const arr2Obj = <T extends { _id: string }> (arr: Array<T>) => {
  const obj = {} as indexableObj<T>
  arr.forEach((item) => {
    if (item._id) {
      obj[item._id] = item
    }
  })
  return obj
}

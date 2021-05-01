import { onBeforeUnmount } from "vue"

type CallbackFun = () => void
const useTimeout = (callbackFun: CallbackFun, timeout: number) => {
  let timer = -1
  timer = setTimeout(callbackFun, timeout)
  onBeforeUnmount(() => clearTimeout(timer))
}

export default useTimeout
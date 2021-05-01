import Message from '@/components/teleport/Message.vue'
import { createApp, onBeforeUnmount } from 'vue'
export type MsgType = 'danger' | 'success' | 'warning' | 'info'

const createMessage = (msgType: MsgType, msgInfo: string, timeout = 2000) => {
  const message = createApp(Message, {
    msgType,
    msgInfo
  })
  const tempNode = document.createElement('div')
  document.body.append(tempNode)
  message.mount(tempNode)
  let timer = -1
  timer = setTimeout(() => {
    message.unmount()
    tempNode.remove()
  }, timeout)
  onBeforeUnmount(() => clearTimeout(timer))
}

export default createMessage
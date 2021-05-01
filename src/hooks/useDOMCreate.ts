import { onUnmounted } from "@vue/runtime-core"

const useDOMCreate = (id: string) => {
  const rootNode = document.createElement('div')
  rootNode.id = id
  document.body.append(rootNode)
  onUnmounted(() => {
    document.body.removeChild(rootNode)
  })
}

export default useDOMCreate
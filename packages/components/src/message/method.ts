/**
 * Message 函数式 API
 */

import { createVNode, render, reactive } from 'vue'
import ZlMessage from './ZlMessage.vue'
import type {
  MessageOptions,
  MessageHandler,
  MessagePlacement,
  MessageFn,
} from './types'
import {
  MESSAGE_DEFAULT_PLACEMENT,
  placementInstances,
} from './instance'

const isClient = typeof document !== 'undefined'

let seed = 0

function getId() {
  return `zl-message-${seed++}`
}

function getContainer(appendTo: HTMLElement | string): HTMLElement | null {
  if (typeof appendTo === 'string') {
    return document.querySelector(appendTo)
  }
  return appendTo
}

let messageRoot: HTMLElement | null = null

function getMessageRoot(): HTMLElement {
  if (!messageRoot) {
    messageRoot = document.createElement('div')
    messageRoot.className = 'zl-message-root'
    document.body.appendChild(messageRoot)
  }
  return messageRoot
}

function createMessageWrapper(): HTMLElement {
  const root = getMessageRoot()
  const wrapper = document.createElement('div')
  root.appendChild(wrapper)
  return wrapper
}

const placementCounts = new Map<MessagePlacement, number>()
const MESSAGE_HEIGHT = 52
const MESSAGE_GAP = 16

function getNextOffset(placement: MessagePlacement): number {
  const count = placementCounts.get(placement) ?? 0
  return count * (MESSAGE_HEIGHT + MESSAGE_GAP) + MESSAGE_GAP
}

const MessageFn = function (options: string | MessageOptions): MessageHandler {
  if (!isClient) {
    return { close: () => {} }
  }

  const normalized: MessageOptions =
    typeof options === 'string'
      ? { message: options }
      : { ...options }

  const {
    message,
    type = 'info',
    duration = 3000,
    showClose = false,
    plain = false,
    offset = 16,
    placement = MESSAGE_DEFAULT_PLACEMENT,
    dangerouslyUseHTMLString = false,
    customClass = '',
    grouping = false,
    onClose,
    appendTo,
  } = normalized

  const id = getId()

  // 启用分组时，检查是否有相同内容的消息（合并显示重复次数）
  if (grouping) {
    const instances = placementInstances.get(placement) ?? []
    const existing = instances.find((ctx: { message?: string }) => ctx.message === message)
    if (existing) {
      const ctxAny = existing as { handler: MessageHandler; repeatState?: { repeatNum: number } }
      if (ctxAny.repeatState) {
        ctxAny.repeatState.repeatNum += 1
      }
      return ctxAny.handler
    }
  }

  const repeatState = reactive({ repeatNum: 1 })

  const container = appendTo ? getContainer(appendTo) : createMessageWrapper()

  if (!container) {
    return { close: () => {} }
  }

  const messageOffset = appendTo ? offset : getNextOffset(placement)

  const instances = placementInstances.get(placement) ?? []
  const count = instances.length
  placementCounts.set(placement, count + 1)

  const handler: MessageHandler = {
    close: () => {},
  }

  const userOnClose = onClose

  const vnode = createVNode(ZlMessage, {
    id,
    message,
    type,
    duration,
    showClose,
    plain,
    offset: messageOffset,
    placement,
    dangerouslyUseHTMLString,
    customClass,
    repeatNum: repeatState.repeatNum,
    repeatState,
    onClose: () => {
      userOnClose?.()
      removeInstance(id, placement)
      handler.close = () => {}
    },
    onDestroy: () => {
      removeInstance(id, placement)
      render(null, container)
      if (!appendTo && container.parentNode) {
        container.remove()
      }
    },
  })

  const ctx = {
    id,
    placement,
    bottom: 0,
    handler,
    message,
    repeatState,
  }
  instances.push(ctx as unknown as Parameters<typeof placementInstances.get>[0] extends (infer T)[] ? T : never)
  placementInstances.set(placement, instances)

  handler.close = () => {
    ;(vnode.component?.exposed ?? (vnode.component?.proxy as { close?: () => void }))?.close?.()
  }

  render(vnode, container)

  return handler
}

export const Message = MessageFn as MessageFn

function removeInstance(id: string, placement: MessagePlacement) {
  const instances = placementInstances.get(placement) ?? []
  const idx = instances.findIndex((i: { id: string }) => i.id === id)
  if (idx !== -1) {
    instances.splice(idx, 1)
    placementCounts.set(placement, Math.max(0, (placementCounts.get(placement) ?? 1) - 1))
  }
}

Message.closeAll = (placement?: MessagePlacement) => {
  if (placement) {
    const instances = placementInstances.get(placement) ?? []
    instances.forEach((ctx: { handler: MessageHandler }) => ctx.handler.close())
  } else {
    placementInstances.forEach((instances) => {
      instances.forEach((ctx: { handler: MessageHandler }) => ctx.handler.close())
    })
  }
}

/**
 * Message 组件类型定义
 */

export const messageTypes = [
  'primary',
  'success',
  'info',
  'warning',
  'error',
] as const

export type MessageType = (typeof messageTypes)[number]

export const messagePlacement = [
  'top',
  'top-left',
  'top-right',
  'bottom',
  'bottom-left',
  'bottom-right',
] as const

export type MessagePlacement = (typeof messagePlacement)[number]

export interface MessageOptions {
  message: string
  type?: MessageType
  duration?: number
  showClose?: boolean
  plain?: boolean
  offset?: number
  placement?: MessagePlacement
  dangerouslyUseHTMLString?: boolean
  customClass?: string
  grouping?: boolean
  onClose?: () => void
  appendTo?: HTMLElement | string
}

export interface MessageFn {
  (options: string | MessageOptions): MessageHandler
  closeAll: (placement?: MessagePlacement) => void
}

export interface MessageHandler {
  close: () => void
}

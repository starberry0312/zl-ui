/**
 * Message 实例管理
 */

import type { MessagePlacement } from './types'

export const MESSAGE_DEFAULT_PLACEMENT: MessagePlacement = 'top'

export interface MessageContext {
  id: string
  placement: MessagePlacement
  bottom: number
  el?: HTMLElement
  handler: { close: () => void }
}

export const placementInstances = new Map<MessagePlacement, MessageContext[]>()

export function getLastOffset(id: string, placement: MessagePlacement): number {
  const instances = placementInstances.get(placement)
  if (!instances) return 0
  const idx = instances.findIndex((i) => i.id === id)
  if (idx <= 0) return 0
  const prev = instances[idx - 1]
  return prev ? prev.bottom : 0
}

export function getOffsetOrSpace(
  id: string,
  offset: number,
  placement: MessagePlacement
): number {
  const instances = placementInstances.get(placement)
  if (!instances) return offset
  const idx = instances.findIndex((i) => i.id === id)
  if (idx <= 0) return offset
  return 0
}

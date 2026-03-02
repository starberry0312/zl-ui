/**
 * @zl-ui/utils - 与组件无关的通用逻辑
 * 不依赖任何组件，可被组件包引用
 */

export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | undefined
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}

export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

let fileId = 0
export function genFileId(): string {
  return `zl-upload-${Date.now()}-${++fileId}`
}

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { debounce, escapeRegex, genFileId } from './index'

describe('@zl-ui/utils', () => {
  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })
    afterEach(() => {
      vi.useRealTimers()
    })

    it('延迟执行', () => {
      const fn = vi.fn()
      const debounced = debounce(fn, 100)
      debounced()
      expect(fn).not.toHaveBeenCalled()
      vi.advanceTimersByTime(100)
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('多次调用只执行最后一次', () => {
      const fn = vi.fn()
      const debounced = debounce(fn, 100)
      debounced(1)
      debounced(2)
      debounced(3)
      vi.advanceTimersByTime(100)
      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith(3)
    })
  })

  describe('escapeRegex', () => {
    it('转义正则特殊字符', () => {
      expect(escapeRegex('a.b')).toBe('a\\.b')
      expect(escapeRegex('*')).toBe('\\*')
      expect(escapeRegex('(test)')).toBe('\\(test\\)')
    })
  })

  describe('genFileId', () => {
    it('生成唯一 id', () => {
      const id1 = genFileId()
      const id2 = genFileId()
      expect(id1).not.toBe(id2)
      expect(id1).toMatch(/^zl-upload-\d+-\d+$/)
    })
  })
})

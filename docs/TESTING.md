# 组件库单元测试

## 测试定位

组件库测试保障**对外 API 的稳定性**，将隐含的使用假设固化为可验证的契约。

- 面向多个业务项目，行为变更影响面广
- 测试的是**使用方式**，而非**代码结构**

## 技术选型

- **Vitest**：与 Vite 配置复用、原生 ESM、启动快
- **Vue Test Utils**：组件挂载与交互

## 测什么 / 不测什么

### 应测试

- Props 对渲染和行为的影响
- 用户交互触发的事件与状态变化
- 异常或边界输入下的兜底行为

### 不应测试

- 内部响应式状态、私有方法
- 与浏览器强相关的 DOM 细节
- 具体样式数值

## 行为测试而非实现测试

```ts
// ❌ 错误：依赖内部实现
expect(wrapper.vm.internalState).toBe(true)

// ✅ 正确：验证可观察结果
expect(wrapper.classes()).toContain('zl-button--primary')
expect(wrapper.emitted('click')).toBeTruthy()
```

## 运行测试

```bash
pnpm test                    # 全部
pnpm -C packages/components test   # 仅组件
pnpm -C packages/utils test       # 仅工具
pnpm -C packages/components test:watch  # 监听模式
```

## 测试文件位置

- `packages/components/src/**/*.spec.ts` - 组件测试
- `packages/utils/src/**/*.spec.ts` - 工具函数测试

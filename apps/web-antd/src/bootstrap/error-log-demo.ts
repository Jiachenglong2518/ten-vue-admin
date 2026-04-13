import type { App } from 'vue';

import { ErrorLogTypeEnum, useErrorLogDemoStore } from '#/store/error-log-demo';

/**
 * 开发环境下收集 Vue 运行时错误与未处理的 Promise 拒绝，写入错误日志示例 Store。
 * 行为参考 vben-admin-thin-next 的 errorLog 模块。
 */
export function setupErrorLogDemoCapture(app: App) {
  if (!import.meta.env.DEV) {
    return;
  }

  const store = useErrorLogDemoStore();

  app.config.errorHandler = (err: unknown, _instance, info: string) => {
    console.error(err);
    const e = err instanceof Error ? err : new Error(String(err));
    store.add({
      type: ErrorLogTypeEnum.VUE,
      url: typeof window === 'undefined' ? '' : window.location.href,
      name: e.name,
      message: e.message,
      stack: e.stack,
      file: info,
    });
  };

  const onRejection = (event: PromiseRejectionEvent) => {
    const { reason } = event;
    const message =
      reason instanceof Error ? reason.message : String(reason ?? '');
    const stack = reason instanceof Error ? reason.stack : undefined;
    store.add({
      type: ErrorLogTypeEnum.PROMISE,
      url: typeof window === 'undefined' ? '' : window.location.href,
      message,
      stack,
    });
  };
  window.addEventListener('unhandledrejection', onRejection);
}

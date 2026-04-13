import { defineStore } from 'pinia';

/** 与 vben-admin-thin-next 错误类型示例对齐 */
export enum ErrorLogTypeEnum {
  AJAX = 'ajax',
  PROMISE = 'promise',
  RESOURCE = 'resource',
  VUE = 'vue',
}

export interface ErrorLogItem {
  file?: string;
  id: string;
  message: string;
  name?: string;
  stack?: string;
  time: string;
  type: ErrorLogTypeEnum;
  url: string;
}

export const useErrorLogDemoStore = defineStore('app-error-log-demo', {
  state: () => ({
    list: [] as ErrorLogItem[],
  }),
  actions: {
    add(
      item: Omit<ErrorLogItem, 'id' | 'time'> & { id?: string; time?: string },
    ) {
      this.list.unshift({
        ...item,
        id: item.id ?? crypto.randomUUID(),
        time: item.time ?? new Date().toLocaleString(),
      });
    },
    clear() {
      this.list = [];
    },
  },
});

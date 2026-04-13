import { createError, defineEventHandler } from 'h3';

/** 故意返回 500，供前端「请求错误」示例使用（vben-admin-thin-next 中的 fireErrorApi 场景） */
export default defineEventHandler(() => {
  throw createError({
    statusCode: 500,
    statusMessage: 'Demo intentional server error',
  });
});

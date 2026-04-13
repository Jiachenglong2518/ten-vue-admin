import { requestClient } from '#/api/request';

export function demoErrorApi() {
  return requestClient.get('/demo/error');
}

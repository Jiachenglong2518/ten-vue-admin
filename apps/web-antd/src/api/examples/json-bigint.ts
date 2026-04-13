import { requestClient } from '#/api/request';

async function getBigIntData() {
  return requestClient.get('/demo/bigint');
}

export { getBigIntData };

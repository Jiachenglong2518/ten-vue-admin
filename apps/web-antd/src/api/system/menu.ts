import { requestClient } from '#/api/request';

export namespace SystemMenuApi {
  export interface SystemMenu {
    [key: string]: any;
    id: string;
    name: string;
    path: string;
    children?: SystemMenu[];
  }
}

async function getMenuList() {
  return requestClient.get<Array<SystemMenuApi.SystemMenu>>(
    '/system/menu/list',
  );
}

export { getMenuList };

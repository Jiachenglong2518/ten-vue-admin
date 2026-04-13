import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1000,
      title: $t('demos.title'),
    },
    name: 'Demos',
    path: '/demos',
    children: [
      {
        meta: {
          icon: 'mdi:shield-key-outline',
          title: $t('demos.access.frontendPermissions'),
        },
        name: 'AccessDemos',
        path: '/demos/access',
        children: [
          {
            name: 'AccessPageControlDemo',
            path: '/demos/access/page-control',
            component: () => import('#/views/demos/access/index.vue'),
            meta: {
              icon: 'mdi:page-previous-outline',
              title: $t('demos.access.pageAccess'),
              domCached: true,
            },
          },
          {
            name: 'AccessButtonControlDemo',
            path: '/demos/access/button-control',
            component: () => import('#/views/demos/access/button-control.vue'),
            meta: {
              icon: 'mdi:button-cursor',
              title: $t('demos.access.buttonControl'),
            },
          },
          {
            name: 'AccessMenuVisible403Demo',
            path: '/demos/access/menu-visible-403',
            component: () =>
              import('#/views/demos/access/menu-visible-403.vue'),
            meta: {
              authority: ['no-body'],
              icon: 'mdi:button-cursor',
              menuVisibleWithForbidden: true,
              title: $t('demos.access.menuVisible403'),
            },
          },
          {
            name: 'AccessSuperVisibleDemo',
            path: '/demos/access/super-visible',
            component: () => import('#/views/demos/access/super-visible.vue'),
            meta: {
              authority: ['super'],
              icon: 'mdi:button-cursor',
              title: $t('demos.access.superVisible'),
            },
          },
          {
            name: 'AccessAdminVisibleDemo',
            path: '/demos/access/admin-visible',
            component: () => import('#/views/demos/access/admin-visible.vue'),
            meta: {
              authority: ['admin'],
              icon: 'mdi:button-cursor',
              title: $t('demos.access.adminVisible'),
            },
          },
          {
            name: 'AccessUserVisibleDemo',
            path: '/demos/access/user-visible',
            component: () => import('#/views/demos/access/user-visible.vue'),
            meta: {
              authority: ['user'],
              icon: 'mdi:button-cursor',
              title: $t('demos.access.userVisible'),
            },
          },
        ],
      },
      {
        meta: {
          icon: 'mdi:feature-highlight',
          title: $t('demos.features.title'),
        },
        name: 'FeaturesDemos',
        path: '/demos/features',
        children: [
          {
            name: 'LoginExpiredDemo',
            path: '/demos/features/login-expired',
            component: () =>
              import('#/views/demos/features/login-expired/index.vue'),
            meta: {
              icon: 'mdi:encryption-expiration',
              title: $t('demos.features.loginExpired'),
            },
          },
          {
            name: 'IconsDemo',
            path: '/demos/features/icons',
            component: () => import('#/views/demos/features/icons/index.vue'),
            meta: {
              icon: 'lucide:annoyed',
              title: $t('demos.features.icons'),
            },
          },
          {
            name: 'WatermarkDemo',
            path: '/demos/features/watermark',
            component: () =>
              import('#/views/demos/features/watermark/index.vue'),
            meta: {
              icon: 'lucide:tags',
              title: $t('demos.features.watermark'),
            },
          },
          {
            name: 'FeatureTabsDemo',
            path: '/demos/features/tabs',
            component: () => import('#/views/demos/features/tabs/index.vue'),
            meta: {
              icon: 'lucide:app-window',
              title: $t('demos.features.tabs'),
            },
          },
          {
            name: 'FeatureTabDetailDemo',
            path: '/demos/features/tabs/detail/:id',
            component: () =>
              import('#/views/demos/features/tabs/tab-detail.vue'),
            meta: {
              activePath: '/demos/features/tabs',
              hideInMenu: true,
              maxNumOfOpenTab: 3,
              title: $t('demos.features.tabDetail'),
            },
          },
          {
            name: 'HideChildrenInMenuParentDemo',
            path: '/demos/features/hide-menu-children',
            meta: {
              hideChildrenInMenu: true,
              icon: 'ic:round-menu',
              title: $t('demos.features.hideChildrenInMenu'),
            },
            children: [
              {
                name: 'HideChildrenInMenuDemo',
                path: '',
                component: () =>
                  import('#/views/demos/features/hide-menu-children/parent.vue'),
                meta: {
                  title: $t('demos.features.hideChildrenInMenu'),
                },
              },
              {
                name: 'HideChildrenInMenuChildrenDemo',
                path: '/demos/features/hide-menu-children/children',
                component: () =>
                  import('#/views/demos/features/hide-menu-children/children.vue'),
                meta: {
                  activePath: '/demos/features/hide-menu-children',
                  title: $t('demos.features.hideChildrenInMenu'),
                },
              },
            ],
          },
          {
            name: 'FullScreenDemo',
            path: '/demos/features/full-screen',
            component: () =>
              import('#/views/demos/features/full-screen/index.vue'),
            meta: {
              icon: 'lucide:fullscreen',
              title: $t('demos.features.fullScreen'),
            },
          },
          {
            name: 'FileDownloadDemo',
            path: '/demos/features/file-download',
            component: () =>
              import('#/views/demos/features/file-download/index.vue'),
            meta: {
              icon: 'lucide:hard-drive-download',
              title: $t('demos.features.fileDownload'),
            },
          },
          {
            name: 'ClipboardDemo',
            path: '/demos/features/clipboard',
            component: () =>
              import('#/views/demos/features/clipboard/index.vue'),
            meta: {
              icon: 'lucide:copy',
              title: $t('demos.features.clipboard'),
            },
          },
          {
            name: 'MenuQueryDemo',
            path: '/demos/menu-query',
            component: () =>
              import('#/views/demos/features/menu-query/index.vue'),
            meta: {
              icon: 'lucide:curly-braces',
              query: {
                id: 1,
              },
              title: $t('demos.features.menuWithQuery'),
            },
          },
          {
            name: 'NewWindowDemo',
            path: '/demos/new-window',
            component: () =>
              import('#/views/demos/features/new-window/index.vue'),
            meta: {
              icon: 'lucide:app-window',
              openInNewWindow: true,
              title: $t('demos.features.openInNewWindow'),
            },
          },
          {
            name: 'VueQueryDemo',
            path: '/demos/features/vue-query',
            component: () =>
              import('#/views/demos/features/vue-query/index.vue'),
            meta: {
              icon: 'lucide:git-pull-request-arrow',
              title: $t('demos.features.vueQuery'),
            },
          },
          {
            name: 'RequestParamsSerializerDemo',
            path: '/demos/features/request-params-serializer',
            component: () =>
              import('#/views/demos/features/request-params-serializer/index.vue'),
            meta: {
              icon: 'lucide:git-pull-request-arrow',
              title: $t('demos.features.requestParamsSerializer'),
            },
          },
          {
            name: 'BigIntDemo',
            path: '/demos/features/json-bigint',
            component: () =>
              import('#/views/demos/features/json-bigint/index.vue'),
            meta: {
              icon: 'lucide:grape',
              title: $t('demos.features.jsonBigint'),
            },
          },
        ],
      },
      {
        meta: {
          icon: 'mdi:alpha-a-circle-outline',
          title: $t('demos.antd'),
        },
        name: 'AntDesignDemos',
        path: '/demos/ant-design',
        component: () => import('#/views/demos/antd/index.vue'),
      },
      {
        meta: {
          icon: 'mdi:bug-outline',
          title: $t('demos.errorLog.title'),
        },
        name: 'ErrorLogDemo',
        path: '/demos/error-log',
        component: () => import('#/views/demos/error-log/index.vue'),
      },
    ],
  },
];

export default routes;

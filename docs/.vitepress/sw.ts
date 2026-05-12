import { clientsClaim } from 'workbox-core';
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';
import { NetworkOnly } from 'workbox-strategies';

declare let self: ServiceWorkerGlobalScope;

const entries = self.__WB_MANIFEST;

precacheAndRoute(entries);
cleanupOutdatedCaches();

let allowlist: RegExp[] | undefined;

if (import.meta.env.DEV) {
  allowlist = [/^\/$/];
}

if (import.meta.env.PROD) {
  const swPath = self.location.pathname.lastIndexOf('/');
  const base = swPath === 0 ? '/' : self.location.pathname.slice(0, swPath + 1);

  function escapeStringRegexp(value: string) {
    return value
      .replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
      .replace(/-/g, '\\x2d');
  }

  allowlist = entries
    .filter((page) =>
      typeof page === 'string' ? page.endsWith('.html') : page.url.endsWith('.html'),
    )
    .map((page) => {
      const url = typeof page === 'string' ? page : page.url;
      const regex =
        url === 'index.html'
          ? escapeStringRegexp(base)
          : escapeStringRegexp(`${base}${url.replace(/\.html$/, '')}`);

      return new RegExp(`^${regex}(\\.html)?$`);
    });

  registerRoute(
    ({ request, sameOrigin }) => sameOrigin && request.mode === 'navigate',
    new NetworkOnly({
      plugins: [
        {
          handlerDidError: async () => Response.redirect('404', 302),
          cacheWillUpdate: async () => null,
        },
      ],
    }),
    'GET',
  );
}

registerRoute(
  new NavigationRoute(createHandlerBoundToURL('index.html'), { allowlist }),
);

self.skipWaiting();
clientsClaim();

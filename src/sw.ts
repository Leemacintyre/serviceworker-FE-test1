/// <reference lib="webworker" />
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
import { NavigationRoute, registerRoute } from 'workbox-routing'

declare let self: ServiceWorkerGlobalScope

// self.__WB_MANIFEST is the default injection point
precacheAndRoute(self.__WB_MANIFEST)

// clean old assets
cleanupOutdatedCaches()

let allowlist: RegExp[] | undefined
// in dev mode, we disable precaching to avoid caching issues
if (import.meta.env.DEV)
  allowlist = [/^\/$/]

// to allow work offline
registerRoute(new NavigationRoute(
  createHandlerBoundToURL('index.html'),
  { allowlist },
))


self.addEventListener('push', async (event) => {
  console.log('Received push event:', event);
  console.log("im a push event 2");

  const title = 'New Notification';
  const options = {
    body: 'You have a new message!',
    icon: '/favicon.svg', // Ensure this icon exists
    actions: [
      { action: 'open', title: 'Open App' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  };

  // if ('showNotification' in self.registration){
  // }
    await self.registration.showNotification(title, options);
    // new Notification(title, options);
});


self.skipWaiting()
clientsClaim()

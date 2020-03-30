/**
 * Middleware to serve the manifest.json and Service Worker (sw.js)
 *
 * @param config
 */
module.exports = pwa = (config) => {
  return (req, res, next) => {
    if (req.originalUrl === "/manifest.json") {
      res.json({
        short_name: config.pwa.shortName,
        name: config.pwa.name,
        icons: [
          {
            src: "/images/icons-192.png",
            type: "image/png",
            sizes: "192x192"
          },
          {
            src: "/images/icons-512.png",
            type: "image/png",
            sizes: "512x512"
          }
        ],
        start_url: "/?source=pwa",
        background_color: config.pwa.backgroundColor,
        display: "standalone",
        scope: "/",
        theme_color: config.pwa.themeColor
      });

      return;
    }

    if (req.originalUrl === "/sw.js") {
      res.type("application/javascript");
      res.send(`const PRECACHE = 'precache-${config.pwa.version}';
const RUNTIME = 'runtime';
const PRECACHE_URLS = [];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request).then(response => {
          return response;
        }).catch(() => new Response(\`${page}\`, {
          headers: {'Content-Type': 'text/html'}
        }));
      })
    );
  }
});`);
    } else {
      next();
    }
  };
};

const page = `
<html lang="en">
<head>
    <title>Offline</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <style>
        html, body {
            font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif;
            letter-spacing: 0;
            font-style: normal;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            color: rgba(255,255,255,.8);
            font-size: 18px;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            background: black;
            width: 100%;
        }
        .card {
            width: 400px;
            max-width: calc(100% - 96px);
            padding: 24px;
            background: gray;
            border-radius: 4px;
            line-height: 1.6em;
        }
        .divider {
            border-bottom: 1px solid #e3e3e3;
            margin: 24px 0;
        }
        .link {
            word-break: break-word;
        }
        strong {
            font-weight: 500;
        }
    </style>
</head>
<body>
<div class="card">
    <div>It seems you are offline so the page couldn't be loaded! Please go online and reload this page.</div>
    <div class="divider"></div>
    <div>
        <strong>Requested url:</strong>
        <span class="link"></span>
    </div>
</div>
<script>
    document.querySelector('.link').textContent = window.location.href;
</script>
</body>
</html>
`;

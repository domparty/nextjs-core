# DOMParty Next.JS Core

A custom Next.JS implementation with some nice extra's

[![npm](https://img.shields.io/npm/v/@domparty/nextjs-core.svg)](https://www.npmjs.com/package/@domparty/nextjs-core) ![node](https://img.shields.io/node/v/@domparty/nextjs-core.svg) [![Tests](https://github.com/domparty/nextjs-core/workflows/Tests/badge.svg?branch=master)](https://github.com/domparty/nextjs-core/actions?query=workflow%3ATests)

## Structure
- Next.JS
- Express.JS
- GraphQL
- GraphQL Playground
- JSON Schema
- Simple Node Logger
- Sitemap

## Why?

Every time you startup a new project you always end up making the same thing because you need them.
For example: a sitemap, robots.txt, api endpoints for frontend data, etc.

That's why we took Next.JS as our SSR base and implemented all sorts of useful stuff that you almost need in every project.

## How to use it?

Setting up the Core is simple and only requires 2 files, 2 folders and an npm install.

- Run `npm i --save @domparty/nextjs-core react react-dom` inside your project
- Create the following folder structure `src/pages`
- Create the following file `src/server.js` with the following content:
```javascript
const App = require('@domparty/nextjs-core');
const core = new App(__dirname, process.cwd());
core.init();
```
- Create the following file `src/pages/index.js` with the following content:
```javascript
import React from 'react';

function Home() {
  return <div>Hello World!</div>;
}

export default Home;
```
- Add the following script to your package.json:
```
"start": "node ./src/server.js"
```
- Run `npm start` and go to `http://localhost:5678/`

## Example project?
Don't want to set it up yourself? No problem we got you covered.
Below is a link to an example project that is ready to go:

https://github.com/domparty/nextjs-core-example

## What's in it?
### Config
By default we include and expose an application config.
Below you will find the default value's for this config:
```javascript
const baseConfig = {
  application: {
    name: '',
    host: '0.0.0.0',
    port: 5678,
    dompartyHeaders: true
  },
  next: {
    pagesDir: ""
  },
  logger: {
    location: './log',
    filename: 'app.log',
    level: 'trace'
  },
  pwa: {
    shortName: 'Project',
    name: 'DOMParty Project',
    version: 'v0.0.0',
    backgroundColor: '#000000',
    themeColor: '#000000'
  },
  cli: {
    maxExecutionTimeout: 30,
  },
  graphql: {
    enabled: true
  },
  robots: {
    disallowAll: true,
    disallowRules: []
  },
  sitemap: {
    urls: []
  }
};
```

To change or update the config you can do 2 things:
1. Include a `config.json` in the following location: `$PROJECT_ROOT/config/config.json`
2. Change the config after the construct of the core: `const core = new App(__dirname, process.cwd());` -> `console.log(core.config)`

### Logger
After a `new` core has been constructed a global variable will be available that contains the logger.

Using the following functions you are able to log messages to the console and log file.
Depending on the log level inside the config these messages will be printed to the console.
```javascript
global.log.trace('');
global.log.debug('');
global.log.info('');
global.log.warn('');
global.log.error('');
global.log.fatal('');
```

#### Log Level
The application default log level is set to `trace`.

You can change the log level by adding the following block to your config file:
```json
{
  "logger": {
    "level": "trace"
  }
}
```

### CLI
The CLI can be used to run one-time jobs or to implement a cron-job.
If the app detects that an extra command line argument is given the CLI mode will be used and search for the task.

```
node server.js exampleCommand
```

New CLI tasks can be created in the tasks file that can be found in the root of your project.
Below you will find and example tasks.js:

```javascript
module.exports = {
    exampleCommand: (core, args, completed) => {
        console.log('Hello World from a task!');
        completed();
    }
};
```

#### Max Execution Timeout
To make sure your CLI task won't be running forever we end tasks running longer then 30 seconds by default.
This can be changed by changing the config:

```json
{
  "cli": {
    "maxExecutionTimeout": 30
  }
}
```

### Express.JS
The web server running the whole show is Express.JS.
This allows for easy extending of custom routes, middlewares and much more.

The complete express instance and http connection are exposed after a core has been constructed and can be accessed like this:
```javascript
const core = new App(__dirname, process.cwd());
const express = core.server;
const httpSession = core.http;
```

Some express functions to add middlewares and routes have been replicated to ensure they are pushed in the right place during the initialization.
These functions are available:
```javascript
const core = new App(__dirname, process.cwd());
core.use((req, res, next) => {
    console.log('Your middleware here');
    next();
});

core.get('/test', (req, res) => {
    console.log('Route accessed!');
    res.send('Hello');
});

core.post('/test', (req, res) => {
    console.log('Route accessed!');
    res.send('Hello');
});

core.put('/test', (req, res) => {
    console.log('Route accessed!');
    res.send('Hello');
});

core.patch('/test', (req, res) => {
    console.log('Route accessed!');
    res.send('Hello');
});

core.delete('/test', (req, res) => {
    console.log('Route accessed!');
    res.send('Hello');
});
```

### Instant Listen (Next.JS)
The Next.JS compiler takes some time to boot up.
This is more noticeable in the dev version then the production build.
But to ensure that we are not waiting on Next.JS we implemented Instant Listen.
This means an alternative page (Loading Page) will be shown until Next.JS is ready to serve pages.
No need to reload this loading page since we are checking in the background if Next.JS is ready.
After Next.JS is ready we will reload the page for you.

Since we are not waiting on Next.JS this also means that routes for GraphQL and for example the Sitemap are instant ready to go and don't need to wait.

### GraphQL
Coming soon...

### PWA
PWA's are the next generation app replacements.
We implemented the 2 required parts in our core to have your app PWA ready.

#### manifest.json
The manifest is a file used to describe your application and can be updated by changing the config like this:
```json
{
  "pwa": {
    "shortName": "Project",
    "name": "DOMParty Project",
    "version": "v0.0.0",
    "backgroundColor": "#000000",
    "themeColor": "#000000"
  }
}
```

#### Service Worker
A service worker is a script that your browser runs in the background, separate from a web page, opening the door to features that don't need a web page or user interaction.
Today, they already include features like push notifications and background sync. In the future, service workers might support other things like periodic sync or geofencing.
The reason this is such an exciting API is that it allows you to support offline experiences, giving developers complete control over the experience.

We opted for a more static version of a service worker. Our service worker runs on `/sw.js` and does nothing.
Yeah you head it right nothing. No offline support, no caching, nothing. But why?
Well to get your project ready for the time you are going to implement these things.

Right now we only implemented a simple offline page. That means that when the service worker registers and a user is offline we show a basis you are offline page.

### Robots.txt
By default we include a robots.txt for search engines to find the sitemap but also to disallow some routes.
This can be changed by updating the config. An example config can be found below:
```json
{
  "robots": {
    "disallowAll": false,
    "disallowRules": [
      "/fonts",
      "/api",
      "/some/page/search/engines/dont/need/to/index"
    ]
  }
}
```

### Sitemap.xml
By default we include a sitemap.xml for search engines to index the site.
This sitemap can be updated by changing the config.
An example can be found here:
```json
{
  "sitemap": {
    "urls": [
      {
        "url": "/page/1",
        "changefreq": "daily",
        "priority": 0.3
      },
      {
        "url": "/page/2",
        "changefreq": "daily",
        "priority": 0.6
      }
    ]
  }
}
```

### Using Preact
Coming soon...

## License

MIT

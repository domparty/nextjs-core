# DOMParty Next.JS Core

A custom Next.JS implementation with some nice extra's

[![Tests](https://github.com/domparty/nextjs-core/workflows/Tests/badge.svg?branch=master)](https://github.com/domparty/nextjs-core/actions?query=workflow%3ATests)

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
```
const App = require('@domparty/nextjs-core');
const core = new App(__dirname, process.cwd());
core.init();
```
- Create the following file `src/pages/index.js` with the following content:
```
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

### Logger

### CLI

### Express.JS

#### Instant Listen (Next.JS)

### GraphQL

### PWA
#### manifest.json

#### Service Worker

### Robots.txt

### Sitemap.xml

## License

MIT

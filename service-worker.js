if(!self.define){let e,n={};const i=(i,s)=>(i=new URL(i+".js",s).href,n[i]||new Promise((n=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=n,document.head.appendChild(e)}else e=i,importScripts(i),n()})).then((()=>{let e=n[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(s,o)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(n[t])return;let r={};const l=e=>i(e,t),c={module:{uri:t},exports:r,require:l};n[t]=Promise.all(s.map((e=>c[e]||l(e)))).then((e=>(o(...e),r)))}}define(["./workbox-6c3e5c38"],(function(e){"use strict";e.setCacheNameDetails({prefix:"vector-6950d48"}),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"./6800b6e17d4c41fd6ae8.min.css",revision:null},{url:"./bc9a40dfa697b50e8a78.min.js",revision:null},{url:"./bd74319ff5e4df7d3b12.min.js",revision:null},{url:"./f760277d87fd3481e9f2.min.js",revision:null},{url:"./index.html",revision:"17c3d992f01e64fa1bacf7929ca5b4d4"}],{}),e.registerRoute(/^https:\/\/fonts\.googleapis\.com/,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[]}),"GET")}));
//# sourceMappingURL=service-worker.js.map

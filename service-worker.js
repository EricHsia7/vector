if(!self.define){let e,s={};const n=(n,o)=>(n=new URL(n+".js",o).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(o,t)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let r={};const l=e=>n(e,i),c={module:{uri:i},exports:r,require:l};s[i]=Promise.all(o.map((e=>c[e]||l(e)))).then((e=>(t(...e),r)))}}define(["./workbox-6c3e5c38"],(function(e){"use strict";e.setCacheNameDetails({prefix:"vector-8e885df"}),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"./29a59ef0d3d1761d6f90.min.css",revision:null},{url:"./9b07914e16824b7bac77.min.js",revision:null},{url:"./a8a9b1a90f3ff3d0617b.min.js",revision:null}],{}),e.registerRoute(/^https:\/\/fonts.googleapis.com/,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[]}),"GET")}));
//# sourceMappingURL=service-worker.js.map

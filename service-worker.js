if(!self.define){let e,s={};const n=(n,o)=>(n=new URL(n+".js",o).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(o,t)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let r={};const l=e=>n(e,i),c={module:{uri:i},exports:r,require:l};s[i]=Promise.all(o.map((e=>c[e]||l(e)))).then((e=>(t(...e),r)))}}define(["./workbox-6c3e5c38"],(function(e){"use strict";e.setCacheNameDetails({prefix:"vector-a011225"}),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"./9b07914e16824b7bac77.min.js",revision:null},{url:"./ace2bfe496b8e022dbd6.min.js",revision:null},{url:"./eca33d3d5462575ed3c7.min.css",revision:null}],{}),e.registerRoute(/^https:\/\/fonts.googleapis.com/,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[]}),"GET")}));
//# sourceMappingURL=service-worker.js.map

if(!self.define){let e,s={};const n=(n,o)=>(n=new URL(n+".js",o).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(o,t)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let r={};const l=e=>n(e,i),c={module:{uri:i},exports:r,require:l};s[i]=Promise.all(o.map((e=>c[e]||l(e)))).then((e=>(t(...e),r)))}}define(["./workbox-03ee9729"],(function(e){"use strict";e.setCacheNameDetails({prefix:"vector-d797d40"}),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"./73230b62ab4a54521695.min.js",revision:null},{url:"./8f72681d4bd21b902282.min.css",revision:null},{url:"./a89d7b2adcf82d2c3e1c.min.js",revision:null}],{}),e.registerRoute(/^https:\/\/fonts.googleapis.com/,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[]}),"GET")}));
//# sourceMappingURL=service-worker.js.map

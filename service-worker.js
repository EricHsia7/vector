if(!self.define){let e,t={};const o=(o,s)=>(o=new URL(o+".js",s).href,t[o]||new Promise((t=>{if("document"in self){const e=document.createElement("script");e.src=o,e.onload=t,document.head.appendChild(e)}else e=o,importScripts(o),t()})).then((()=>{let e=t[o];if(!e)throw new Error(`Module ${o} didn’t register its module`);return e})));self.define=(s,n)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(t[i])return;let r={};const l=e=>o(e,i),c={module:{uri:i},exports:r,require:l};t[i]=Promise.all(s.map((e=>c[e]||l(e)))).then((e=>(n(...e),r)))}}define(["./workbox-03ee9729"],(function(e){"use strict";e.setCacheNameDetails({prefix:"vector-vettJvYqXjoCPohx"}),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"./main.9703f5e559945bf6c3f3.min.js",revision:null}],{}),e.registerRoute(/^https:\/\/fonts.googleapis.com/,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[]}),"GET")}));
//# sourceMappingURL=service-worker.js.map

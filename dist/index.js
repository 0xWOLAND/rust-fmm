/*! For license information please see index.js.LICENSE.txt */
(()=>{"use strict";var e={m:{},u:e=>e+".index.js"};e.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),e.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var t;e.g.importScripts&&(t=e.g.location+"");var n=e.g.document;if(!t&&n&&(n.currentScript&&(t=n.currentScript.src),!t)){var r=n.getElementsByTagName("script");if(r.length)for(var a=r.length-1;a>-1&&!t;)t=r[a--].src}if(!t)throw new Error("Automatic publicPath is not supported in this browser");t=t.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),e.p=t})(),e.b=document.baseURI||self.location.href;const t=Symbol("Comlink.proxy"),n=Symbol("Comlink.endpoint"),r=Symbol("Comlink.releaseProxy"),a=Symbol("Comlink.finalizer"),i=Symbol("Comlink.thrown"),o=e=>"object"==typeof e&&null!==e||"function"==typeof e,s=new Map([["proxy",{canHandle:e=>o(e)&&e[t],serialize(e){const{port1:t,port2:n}=new MessageChannel;return c(e,t),[n,[n]]},deserialize:e=>(e.start(),l(e))}],["throw",{canHandle:e=>o(e)&&i in e,serialize({value:e}){let t;return t=e instanceof Error?{isError:!0,value:{message:e.message,name:e.name,stack:e.stack}}:{isError:!1,value:e},[t,[]]},deserialize(e){if(e.isError)throw Object.assign(new Error(e.value.message),e.value);throw e.value}}]]);function c(e,n=globalThis,r=["*"]){n.addEventListener("message",(function o(s){if(!s||!s.data)return;if(!function(e,t){for(const n of e){if(t===n||"*"===n)return!0;if(n instanceof RegExp&&n.test(t))return!0}return!1}(r,s.origin))return void console.warn(`Invalid origin '${s.origin}' for comlink proxy`);const{id:l,type:p,path:g}=Object.assign({path:[]},s.data),f=(s.data.argumentList||[]).map(w);let d;try{const n=g.slice(0,-1).reduce(((e,t)=>e[t]),e),r=g.reduce(((e,t)=>e[t]),e);switch(p){case"GET":d=r;break;case"SET":n[g.slice(-1)[0]]=w(s.data.value),d=!0;break;case"APPLY":d=r.apply(n,f);break;case"CONSTRUCT":d=function(e){return Object.assign(e,{[t]:!0})}(new r(...f));break;case"ENDPOINT":{const{port1:t,port2:n}=new MessageChannel;c(e,n),d=function(e,t){return y.set(e,t),e}(t,[t])}break;case"RELEASE":d=void 0;break;default:return}}catch(e){d={value:e,[i]:0}}Promise.resolve(d).catch((e=>({value:e,[i]:0}))).then((t=>{const[r,i]=b(t);n.postMessage(Object.assign(Object.assign({},r),{id:l}),i),"RELEASE"===p&&(n.removeEventListener("message",o),u(n),a in e&&"function"==typeof e[a]&&e[a]())})).catch((e=>{const[t,r]=b({value:new TypeError("Unserializable return value"),[i]:0});n.postMessage(Object.assign(Object.assign({},t),{id:l}),r)}))})),n.start&&n.start()}function u(e){(function(e){return"MessagePort"===e.constructor.name})(e)&&e.close()}function l(e,t){return m(e,[],t)}function p(e){if(e)throw new Error("Proxy has been released and is not useable")}function g(e){return E(e,{type:"RELEASE"}).then((()=>{u(e)}))}const f=new WeakMap,d="FinalizationRegistry"in globalThis&&new FinalizationRegistry((e=>{const t=(f.get(e)||0)-1;f.set(e,t),0===t&&g(e)}));function m(e,t=[],a=function(){}){let i=!1;const o=new Proxy(a,{get(n,a){if(p(i),a===r)return()=>{!function(e){d&&d.unregister(e)}(o),g(e),i=!0};if("then"===a){if(0===t.length)return{then:()=>o};const n=E(e,{type:"GET",path:t.map((e=>e.toString()))}).then(w);return n.then.bind(n)}return m(e,[...t,a])},set(n,r,a){p(i);const[o,s]=b(a);return E(e,{type:"SET",path:[...t,r].map((e=>e.toString())),value:o},s).then(w)},apply(r,a,o){p(i);const s=t[t.length-1];if(s===n)return E(e,{type:"ENDPOINT"}).then(w);if("bind"===s)return m(e,t.slice(0,-1));const[c,u]=h(o);return E(e,{type:"APPLY",path:t.map((e=>e.toString())),argumentList:c},u).then(w)},construct(n,r){p(i);const[a,o]=h(r);return E(e,{type:"CONSTRUCT",path:t.map((e=>e.toString())),argumentList:a},o).then(w)}});return function(e,t){const n=(f.get(t)||0)+1;f.set(t,n),d&&d.register(e,t,e)}(o,e),o}function h(e){const t=e.map(b);return[t.map((e=>e[0])),(n=t.map((e=>e[1])),Array.prototype.concat.apply([],n))];var n}const y=new WeakMap;function b(e){for(const[t,n]of s)if(n.canHandle(e)){const[r,a]=n.serialize(e);return[{type:"HANDLER",name:t,value:r},a]}return[{type:"RAW",value:e},y.get(e)||[]]}function w(e){switch(e.type){case"HANDLER":return s.get(e.name).deserialize(e.value);case"RAW":return e.value}}function E(e,t,n){return new Promise((r=>{const a=new Array(4).fill(0).map((()=>Math.floor(Math.random()*Number.MAX_SAFE_INTEGER).toString(16))).join("-");e.addEventListener("message",(function t(n){n.data&&n.data.id&&n.data.id===a&&(e.removeEventListener("message",t),r(n.data))})),e.start&&e.start(),e.postMessage(Object.assign({id:a},t),n)}))}const v=document.getElementById("canvas"),{width:S,height:T}=v,k=(v.getContext("2d"),document.getElementById("time"));!async function(){let t=await l(new Worker(new URL(e.p+e.u(204),e.b),{type:void 0})).handlers;function n(e){let n=t[e];n&&Object.assign(document.getElementById(e),{async onclick(){let{positions:e,velocity:t,time:r}=await n({width:S,height:T,maxIterations:1e3});k.value=`${r.toFixed(2)} ms`,console.log(e,t)},disabled:!1})}n("singleThread"),await t.supportsThreads&&n("multiThread")}()})();
!function(n){var r={};function o(e){if(r[e])return r[e].exports;var t=r[e]={i:e,l:!1,exports:{}};return n[e].call(t.exports,t,t.exports,o),t.l=!0,t.exports}o.m=n,o.c=r,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)o.d(n,r,function(e){return t[e]}.bind(null,r));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o(o.s=0)}([function(e,t,n){"use strict";n.r(t),n.d(t,"send",function(){return a}),n.d(t,"subscribe",function(){return u}),n.d(t,"injectExtension",function(){return c});var r=function(i,a,u,c){return new(u=u||Promise)(function(e,t){function n(e){try{o(c.next(e))}catch(e){t(e)}}function r(e){try{o(c.throw(e))}catch(e){t(e)}}function o(t){t.done?e(t.value):new u(function(e){e(t.value)}).then(n,r)}o((c=c.apply(i,a||[])).next())})},o=function(n,r){var o,i,a,e,u={label:0,sent:function(){if(1&a[0])throw a[1];return a[1]},trys:[],ops:[]};return e={next:t(0),throw:t(1),return:t(2)},"function"==typeof Symbol&&(e[Symbol.iterator]=function(){return this}),e;function t(t){return function(e){return function(t){if(o)throw new TypeError("Generator is already executing.");for(;u;)try{if(o=1,i&&(a=2&t[0]?i.return:t[0]?i.throw||((a=i.return)&&a.call(i),0):i.next)&&!(a=a.call(i,t[1])).done)return a;switch(i=0,a&&(t=[2&t[0],a.value]),t[0]){case 0:case 1:a=t;break;case 4:return u.label++,{value:t[1],done:!1};case 5:u.label++,i=t[1],t=[0];continue;case 7:t=u.ops.pop(),u.trys.pop();continue;default:if(!(a=0<(a=u.trys).length&&a[a.length-1])&&(6===t[0]||2===t[0])){u=0;continue}if(3===t[0]&&(!a||t[1]>a[0]&&t[1]<a[3])){u.label=t[1];break}if(6===t[0]&&u.label<a[1]){u.label=a[1],a=t;break}if(a&&u.label<a[2]){u.label=a[2],u.ops.push(t);break}a[2]&&u.ops.pop(),u.trys.pop();continue}t=r.call(n,u)}catch(e){t=[6,e],i=0}finally{o=a=0}if(5&t[0])throw t[1];return{value:t[0]?t[1]:void 0,done:!0}}([t,e])}}};window.ReactNativeWebView&&window.ReactNativeWebView.postMessage||(window.ReactNativeWebView={postMessage:function(e){window.webkit.messageHandlers.ReactNativeWebView.postMessage(String(e))}}),window.WebViewBridge={onMessage:function(){return null},send:function(e){window.ReactNativeWebView.postMessage(e)}};var i={},a=function(r,o){return new Promise(function(e,t){e=e||function(){},t=t||function(){};var n=function(){function e(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)}return"BITPORAL_BRIDGE_MESSAGE@"+e()+"_"+e()+"_"+e()+"_"+e()+"_"+e()+"_"+(new Date).getTime()+"@"}();i[n]={resolve:e,reject:t},WebViewBridge.send(JSON.stringify({messageId:n,type:r,payload:o}))})},u=function(){WebViewBridge.onMessage=function(t){var e;try{e=JSON.parse(t)}catch(e){var n=function(e){var t=e.match(/BITPORAL_BRIDGE_MESSAGE@(\\d|\\w)+@/g);return t&&t[0]}(t);return void(n&&(i[n].reject({message:e.message}),delete i[n]))}var r=e.messageId,o=e.payload;if(i&&i[r])switch(e.type){case"actionSucceeded":i[r].resolve(o.data),delete i[r];break;case"actionFailed":i[r].reject(o.error),delete i[r]}}};function c(t,e){var n=e.name,r=e.version,o=window;o.injectedWeb3=o.injectedWeb3||{},o.injectedWeb3[n]={enable:function(e){return t(e)},version:r}}u(),c(function(t){return r(void 0,void 0,void 0,function(){return o(this,function(e){return alert("polkadotext enable "+t),[2,{accounts:{get:function(){a("getPolkadotAccounts")}},metadata:{},provider:{},signer:{}}]})})},{name:"polkadot-js",version:"0.35.2-25"}),setTimeout(function(){alert("polkadotext injected")},1e3)}]);
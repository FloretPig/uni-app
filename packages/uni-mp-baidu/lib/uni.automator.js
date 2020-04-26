"use strict";function e(e){return e&&"object"==typeof e&&"default"in e?e.default:e}var t=e(require("os")),r=e(require("path")),s=e(require("debug")),a=e(require("licia/isWindows")),n=e(require("fs")),o=e(require("child_process")),i=e(require("licia/sleep")),c=e(require("licia/toStr")),l=e(require("licia/waitUntil")),p=e(require("licia/concat")),u=e(require("licia/getPort")),m=e(require("licia/dateFormat"));require("jimp"),require("licia/isStr");var d=e(require("ws")),h=require("events"),f=e(require("licia/uuid")),g=e(require("licia/stringify"));const w=/(^[a-z][a-z0-9-]*)/i,y=/^navigator/i,E=/^swan-nav$/i;var b;!function(e){e.SELECTOR="selector",e.TAGNAME="tagName"}(b||(b={}));const v={[b.SELECTOR]:[{test:y,processor:e=>e.replace(y,"nav")},{test:w,processor:e=>"swan-"+e}],[b.TAGNAME]:[{test:E,processor:e=>e.replace(E,"swan-navigator")},{test:w,processor:e=>e.toLocaleLowerCase().replace("swan-","")}]},j=e=>t=>{const r=(v[e]||[]).filter(e=>e.test.test(t));for(const e of r)t=e.processor(t);return t},P=j(b.SELECTOR),q=j(b.TAGNAME),O=e=>Object.assign({},e,{type:"id",info:{id:e.elementId}});require("qrcode-terminal"),require("qrcode-reader");class M extends h.EventEmitter{constructor(e){super(),this.ws=e,this.ws.addEventListener("message",e=>{this.emit("message",e.data)}),this.ws.addEventListener("close",()=>{this.emit("close")})}send(e){this.ws.send(e)}close(){this.ws.close()}}class C extends h.EventEmitter{constructor(e,t,r){super(),this.puppet=t,this.namespace=r,this.callbacks=new Map,this.transport=e,this.debug=s("automator:protocol:"+this.namespace),this.onMessage=e=>{this.debug(`${m("yyyy-mm-dd HH:MM:ss:l")} ◀ RECV ${e}`);const{id:t,method:r,error:s,result:a,params:n}=JSON.parse(e);if(!t)return this.puppet.emit(r,n);const{callbacks:o}=this;if(t&&o.has(t)){const e=o.get(t);o.delete(t),s?e.reject(Error(s.message)):e.resolve(a)}},this.onClose=()=>{this.callbacks.forEach(e=>{e.reject(Error("Connection closed"))})},this.transport.on("message",this.onMessage),this.transport.on("close",this.onClose)}send(e,t={},r=!0){if(r&&this.puppet.adapter.has(e))return this.puppet.adapter.send(this,e,t);const s=f(),a=g({id:s,method:e,params:t});return this.debug(`${m("yyyy-mm-dd HH:MM:ss:l")} SEND ► ${a}`),new Promise((e,t)=>{try{this.transport.send(a)}catch(e){t(Error("Connection closed"))}this.callbacks.set(s,{resolve:e,reject:t})})}dispose(){this.transport.close()}static createDevtoolConnection(e,t){return new Promise((r,s)=>{const a=new d(e);a.addEventListener("open",()=>{r(new C(new M(a),t,"devtool"))}),a.addEventListener("error",s)})}static createRuntimeConnection(e,t,r){return new Promise((a,n)=>{s("automator:runtime")(`${m("yyyy-mm-dd HH:MM:ss:l")} port=${e}`);const o=new d.Server({port:e});l(async()=>{if(t.runtimeConnection)return!0},r,1e3).catch(e=>{throw Error("Failed to connect to runtime, please make sure the project is running")}),o.on("connection",(function(e){s("automator:runtime")(m("yyyy-mm-dd HH:MM:ss:l")+" connected");const r=new C(new M(e),t,"runtime");t.setRuntimeConnection(r),a(r)})),t.setRuntimeServer(o)})}}const $=s("automator:devtool");async function S(e,t,r){const{port:s,cliPath:a,timeout:n,cwd:u="",account:d="",args:h=[],launch:f=!0}=t;let g=!1,w=!1;if(!1!==f){const t={stdio:"ignore"};u&&(t.cwd=u);let r=p(h,[]);r=p(r,["--auto"]),r=p(r,[e,"--auto-port",c(s)]),d&&(r=p(r,["--auto-account",d]));try{$("%s %o %o",a,r,t);const e=o.spawn(a,r,t);e.on("error",e=>{g=!0}),e.on("exit",()=>{setTimeout(()=>{w=!0},15e3)}),e.unref()}catch(e){g=!1}}else setTimeout(()=>{w=!0},15e3);const y=await l(async()=>{try{if(g||w)return!0;return await async function(e,t){let r;try{r=await C.createDevtoolConnection(e.wsEndpoint,t)}catch(t){throw Error(`Failed connecting to ${e.wsEndpoint}, check if target project window is opened with automation enabled`)}return r}({wsEndpoint:"ws://127.0.0.1:"+s},r)}catch(e){}},n,1e3);if(g)throw Error(`Failed to launch ${r.devtools.name}, please make sure cliPath is correctly specified`);if(w)throw Error(`Failed to launch ${r.devtools.name} , please make sure http port is open`);return await i(5e3),$(m("yyyy-mm-dd HH:MM:ss:l")+" connected"),y}const A=[];["","-rc"].forEach(e=>{a?(A.push(r.join(t.homedir(),`AppData/Local/Programs/swan-ide-gui${e}/cli.bat`)),A.push(`C:/Program Files/swan-ide-gui${e}/cli.bat`)):A.push(`/Applications/百度开发者工具${e}.app/Contents/MacOS/cli`)});const T={devtools:{name:"Baidu DevTools",remote:!0,automator:!0,paths:A,required:["project.swan.json","app.json","app.js"],defaultPort:9430,validate:async function(e,t){const r=function(e,t){const r=t.devtools.paths.slice(0);e&&r.unshift(e);for(const e of r)if(n.existsSync(e))return e;throw Error(t.devtools.name+" not found, please specify executablePath option")}(e.executablePath,t);let s=e.port||t.devtools.defaultPort;if(!1!==e.launch)try{s=await async function(e,t){const r=await u(e||t);if(e&&r!==e)throw Error(`Port ${e} is in use, please specify another port`);return r}(s)}catch(t){e.launch=!1}else{s===await u(s)&&(e.launch=!0)}return Object.assign(Object.assign({},e),{port:s,cliPath:r})},async create(e,t,r){const a=await S(e,t,r);return s("automator:devtool")("initRuntimeAutomator"),a.send("smartapp.swan",{api:"$$initRuntimeAutomator",params:[]}),a}},adapter:{"Tool.enableRemoteDebug":{reflect:async e=>({qrCode:(await e("Tool.enablePreview")).url})},"App.exit":{reflect:async()=>Promise.resolve()},"Page.getElement":{reflect:async(e,t)=>(await e("Page.getElements",t)).elements[0]},"Page.getElements":{reflect:async(e,t)=>{return{elements:(await e("smartapp.element.getBySelector",Object.assign(Object.assign({},t),{properties:["id","tagName"],selector:(r=t.selector,r.split(" ").map(e=>P(e)).join(" "))}))).map(e=>{const t=e.properties;return{elementId:t.id,nodeId:t.id,tagName:q(t.tagName)}})};var r}},"Page.getWindowProperties":{reflect:async(e,t)=>{const r=t.names.map(e=>e.replace("document.documentElement.","")),s=(await e("smartapp.element.getBySelector",{properties:r,selector:"html"}))[0];return{properties:r.map(e=>s.properties[e])}}},"Element.getHTML":{reflect:async(e,t)=>{const r=[t.type+"HTML"];return{html:(await e("Element.getDOMProperties",Object.assign(Object.assign({},t),{names:r}))).properties[0]}}},"Element.getElement":{reflect:async(e,t)=>(await e("Element.getElements",t)).elements[0]},"Element.getElements":{reflect:async(e,t)=>{const{elements:r}=await e("Page.getElements",Object.assign(Object.assign({},t),{selector:`#${t.elementId} ${t.selector}`}));return r.forEach(e=>{e.nodeId=e.id}),{elements:r}}},"Element.getAttributes":{reflect:async(e,t)=>{const r=[];for(const s of t.names)r.push(await e("smartapp.element.getAttribute",Object.assign({attribute:s},t)));return{attributes:r}},params:O},"Element.getStyles":{reflect:async(e,t)=>{const r=[];for(const s of t.names)r.push(await e("smartapp.element.getComputedStyle",Object.assign({style:s},t)));return{styles:r}},params:O},"Element.getDOMProperties":{reflect:async(e,t)=>{const r=[];for(const s of t.names)r.push(await e("smartapp.element.getProperty",Object.assign({property:s},t)));return{properties:r}},params:O},"Element.getProperties":{reflect:async(e,t)=>{const r=[];for(const s of t.names)r.push(await e("smartapp.element.getAttribute",Object.assign({attribute:s},t)));return{properties:r}},params:O},"Element.getOffset":{reflect:async(e,t)=>({left:await e("smartapp.element.getProperty",Object.assign({property:"offsetLeft"},t)),top:await e("smartapp.element.getProperty",Object.assign({property:"offsetTop"},t))}),params:O},"Element.tap":{reflect:"smartapp.element.touch",params:O}}};module.exports=T;

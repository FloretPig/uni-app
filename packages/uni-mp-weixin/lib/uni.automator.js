"use strict";function e(e){return e&&"object"==typeof e&&"default"in e?e.default:e}var t=e(require("debug")),r=e(require("licia/isWindows")),n=e(require("jimp"));require("licia/isStr");var o=e(require("licia/getPort")),s=e(require("fs")),i=e(require("child_process")),a=e(require("licia/sleep")),c=e(require("licia/toStr")),l=e(require("licia/waitUntil")),u=e(require("licia/concat")),d=e(require("licia/dateFormat")),p=e(require("ws")),h=require("events"),m=e(require("licia/uuid")),w=e(require("licia/stringify"));require("qrcode-terminal");const f=require("qrcode-reader");class y extends h.EventEmitter{constructor(e){super(),this.ws=e,this.ws.addEventListener("message",e=>{this.emit("message",e.data)}),this.ws.addEventListener("close",()=>{this.emit("close")})}send(e){this.ws.send(e)}close(){this.ws.close()}}class g extends h.EventEmitter{constructor(e,r,n){super(),this.puppet=r,this.namespace=n,this.callbacks=new Map,this.transport=e,this.debug=t("automator:protocol:"+this.namespace),this.onMessage=e=>{this.debug(`${d("yyyy-mm-dd HH:MM:ss:l")} ◀ RECV ${e}`);const{id:t,method:r,error:n,result:o,params:s}=JSON.parse(e);if(!t)return this.puppet.emit(r,s);const{callbacks:i}=this;if(t&&i.has(t)){const e=i.get(t);i.delete(t),n?e.reject(Error(n.message)):e.resolve(o)}},this.onClose=()=>{this.callbacks.forEach(e=>{e.reject(Error("Connection closed"))})},this.transport.on("message",this.onMessage),this.transport.on("close",this.onClose)}send(e,t={},r=!0){if(r&&this.puppet.adapter.has(e))return this.puppet.adapter.send(this,e,t);const n=m(),o=w({id:n,method:e,params:t});return this.debug(`${d("yyyy-mm-dd HH:MM:ss:l")} SEND ► ${o}`),new Promise((e,t)=>{try{this.transport.send(o)}catch(e){t(Error("Connection closed"))}this.callbacks.set(n,{resolve:e,reject:t})})}dispose(){this.transport.close()}static createDevtoolConnection(e,t){return new Promise((r,n)=>{const o=new p(e);o.addEventListener("open",()=>{r(new g(new y(o),t,"devtool"))}),o.addEventListener("error",n)})}static createRuntimeConnection(e,r,n){return new Promise((o,s)=>{t("automator:runtime")(`${d("yyyy-mm-dd HH:MM:ss:l")} port=${e}`);const i=new p.Server({port:e});l(async()=>{if(r.runtimeConnection)return!0},n,1e3).catch(e=>{throw Error("Failed to connect to runtime, please make sure the project is running")}),i.on("connection",(function(e){t("automator:runtime")(d("yyyy-mm-dd HH:MM:ss:l")+" connected");const n=new g(new y(e),r,"runtime");r.setRuntimeConnection(n),o(n)})),r.setRuntimeServer(i)})}}const v=t("automator:devtool");async function b(e,t,r){const{port:n,cliPath:o,timeout:s,cwd:p="",account:h="",args:m=[],launch:w=!0}=t;let f=!1,y=!1;if(!1!==w){const t={stdio:"ignore",detached:!0};p&&(t.cwd=p);let r=u(m,[]);r=u(r,["auto","--project"]),r=u(r,[e,"--auto-port",c(n)]),h&&(r=u(r,["--auto-account",h]));try{v("%s %o %o",o,r,t);const e=i.spawn(o,r,t);e.on("error",e=>{f=!0}),e.on("exit",()=>{setTimeout(()=>{y=!0},15e3)}),e.unref()}catch(e){f=!1}}else setTimeout(()=>{y=!0},15e3);const b=await l(async()=>{try{if(f||y)return!0;return await async function(e,t){let r;try{r=await g.createDevtoolConnection(e.wsEndpoint,t)}catch(t){throw Error(`Failed connecting to ${e.wsEndpoint}, check if target project window is opened with automation enabled`)}return r}({wsEndpoint:"ws://127.0.0.1:"+n},r)}catch(e){}},s,1e3);if(f)throw Error(`Failed to launch ${r.devtools.name}, please make sure cliPath is correctly specified`);if(y)throw Error(`Failed to launch ${r.devtools.name} , please make sure http port is open`);return await a(5e3),v(d("yyyy-mm-dd HH:MM:ss:l")+" connected"),b}const E={devtools:{name:"Wechat web devTools",remote:!0,automator:!0,paths:[r?"C:/Program Files (x86)/Tencent/微信web开发者工具/cli.bat":"/Applications/wechatwebdevtools.app/Contents/MacOS/cli"],required:["project.config.json","app.json","app.js"],defaultPort:9420,validate:async function(e,t){const r=function(e,t){const r=t.devtools.paths.slice(0);e&&r.unshift(e);for(const e of r)if(s.existsSync(e))return e;throw Error(t.devtools.name+" not found, please specify executablePath option")}(e.executablePath,t);let n=e.port||t.devtools.defaultPort;if(!1!==e.launch)try{n=await async function(e,t){const r=await o(e||t);if(e&&r!==e)throw Error(`Port ${e} is in use, please specify another port`);return r}(n)}catch(t){e.launch=!1}else{n===await o(n)&&(e.launch=!0)}return Object.assign(Object.assign({},e),{port:n,cliPath:r})},async create(e,r,n){const o=await b(e,r,n);return t("automator:devtool")("initRuntimeAutomator"),o.send("App.callWxMethod",{method:"$$initRuntimeAutomator",args:[]}),o}},adapter:{"Tool.enableRemoteDebug":{reflect:async(e,t)=>{let{qrCode:r}=await e("Tool.enableRemoteDebug",t,!1);return r&&(r=await function(e){const t=new Buffer(e,"base64");return new Promise(async(e,r)=>{const o=await n.read(t),s=new f;s.callback=function(t,n){if(t)return r(t);e(n.result)},s.decode(o.bitmap)})}(r)),{qrCode:r}}},"App.callFunction":{reflect:async(e,t)=>{return e("App.callFunction",Object.assign(Object.assign({},t),{functionDeclaration:(r=t.functionDeclaration,"}"===r[r.length-1]?r.replace("{","{\nvar uni = wx;\n"):r.replace("=>","=>{\nvar uni = wx;\nreturn ")+"}")}),!1);var r}},"Element.getHTML":{reflect:async(e,t)=>({html:(await e("Element.getWXML",t,!1)).wxml})}}};module.exports=E;

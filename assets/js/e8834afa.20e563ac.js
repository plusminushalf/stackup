"use strict";(self.webpackChunk_stackupfinance_docs=self.webpackChunk_stackupfinance_docs||[]).push([[858],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>m});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=a.createContext({}),l=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=l(e.components);return a.createElement(s.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,s=e.parentName,p=c(e,["components","mdxType","originalType","parentName"]),u=l(n),m=r,f=u["".concat(s,".").concat(m)]||u[m]||d[m]||o;return n?a.createElement(f,i(i({ref:t},p),{},{components:n})):a.createElement(f,i({ref:t},p))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=u;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c.mdxType="string"==typeof e?e:r,i[1]=c;for(var l=2;l<o;l++)i[l]=n[l];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}u.displayName="MDXCreateElement"},8699:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>s,default:()=>m,frontMatter:()=>c,metadata:()=>l,toc:()=>d});var a=n(7896),r=n(1461),o=(n(7294),n(3905)),i=["components"],c={sidebar_position:1},s="Installation",l={unversionedId:"packages/client-sdk/installation",id:"packages/client-sdk/installation",title:"Installation",description:"A guide for adding a Client SDK to your application.",source:"@site/docs/packages/client-sdk/installation.md",sourceDirName:"packages/client-sdk",slug:"/packages/client-sdk/installation",permalink:"/docs/packages/client-sdk/installation",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/packages/client-sdk/installation.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Client SDK",permalink:"/docs/category/client-sdk"},next:{title:"Usage",permalink:"/docs/packages/client-sdk/usage"}},p={},d=[{value:"Add dependencies",id:"add-dependencies",level:2}],u={toc:d};function m(e){var t=e.components,n=(0,r.Z)(e,i);return(0,o.kt)("wrapper",(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"installation"},"Installation"),(0,o.kt)("p",null,"A guide for adding a Client SDK to your application."),(0,o.kt)("admonition",{type:"caution"},(0,o.kt)("p",{parentName:"admonition"},(0,o.kt)("strong",{parentName:"p"},"\ud83d\udea7 This SDK is a work in progress")),(0,o.kt)("p",{parentName:"admonition"},"In the meantime, feel free the to read the docs and give us your feedback on ",(0,o.kt)("a",{parentName:"p",href:"https://discord.gg/FpXmvKrNed"},"Discord"),"! \ud83d\udcac")),(0,o.kt)("h2",{id:"add-dependencies"},"Add dependencies"),(0,o.kt)("p",null,"The Client SDK will be available in JavaScript with full TypeScript support and hosted on NPM."),(0,o.kt)("admonition",{type:"caution"},(0,o.kt)("p",{parentName:"admonition"},"\ud83d\udea7 ",(0,o.kt)("inlineCode",{parentName:"p"},"PackageName")," is still TBD and will be added here on release.")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"# would love to have it as a part of ethersproject\nnpm install @ethersproject/account-abstraction\n\n# Or we can make this part of the @account-abstraction project\nyarn add @account-abstraction/sdk\n")))}m.isMDXComponent=!0}}]);
"use strict";var s=Object.defineProperty;var n=Object.getOwnPropertyDescriptor;var y=Object.getOwnPropertyNames;var l=Object.prototype.hasOwnProperty;var P=(o,e)=>{for(var r in e)s(o,r,{get:e[r],enumerable:!0})},d=(o,e,r,a)=>{if(e&&typeof e=="object"||typeof e=="function")for(let t of y(e))!l.call(o,t)&&t!==r&&s(o,t,{get:()=>e[t],enumerable:!(a=n(e,t))||a.enumerable});return o};var m=o=>d(s({},"__esModule",{value:!0}),o);var u={};P(u,{lambdaHandler:()=>i});module.exports=m(u);var i=async o=>{let e;try{e={statusCode:200,body:JSON.stringify({message:"hello world"})}}catch(r){console.log(r),e={statusCode:500,body:JSON.stringify({message:r instanceof Error?r.message:"some error happened"})}}return e};0&&(module.exports={lambdaHandler});
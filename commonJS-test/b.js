/* 引用单个自定义文件时
const add = require ('./a')

let result =  add(5, 8)
console.log(result) */

/* 引用多个自定义文件时
const { add, mul  } = require ('./a')

let result1 = add(5, 8)
let result2 = mul(5,8)
console.log(result1)
console.log(result2)*/

/* 引入和使用npm包
const _ = require('lodash')
const result = _.concat([1, 2], 3)
console.log(result)*/
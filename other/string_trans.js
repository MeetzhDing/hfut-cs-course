'use strict';
const assert = require('assert');

// 将 from 位置的字符移到字符串 to 位置
function string_char_mov(str, from, to){
  assert((typeof(str) === 'string') && (from < str.length) && (to < str.length), 'args error');
  let item = str.charAt(from);
  str = str.slice(0, from) + str.slice(from+1);
  str = str.slice(0, to) + item + str.slice(to);
  return str;
}

console.log(string_char_mov('ABC EFG', 2, 5));
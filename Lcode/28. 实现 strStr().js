// 给你两个字符串 haystack 和 needle ，请你在 haystack 字符串中找出 needle 字符串出现的第一个位置（下标从 0 开始）。如果不存在，则返回  -1 。

/**
 * @param {number[]} nums
 * @return {number}
 */
/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
// var strStr = function(haystack, needle) {
//   let count = needle.length;
//   let j = 0;
//   let key = 0;
//   if (count > haystack.length) {
//     return -1;
//   }
//   if (count == 0) {
//     return 0;
//   }
//   while (j < needle.length && count != 0) {
//     for (var i = 0; i < haystack.length; i++) {
//       key = i;
//       if (haystack[i] == needle[j]) {
//         j++;
//       } else if (haystack[i] != needle[j]) {
//         j = 0;
//       }
//     }
//   }
//   if (j == count) {
//     return key - count;
//   }
// };
// 简洁思路： 在字符串里，整体找是否存在关键字字段。
// 遍历 haystack，在遍历 needle，若不存在 i+j != j，false。
// 错误思想：如果判断成功（可能是部分成功）存在，true 的话，返回的 i 不对。
// 应该判断，其中一个对应不上，立马false，break，如果都正确，会遍历完，得到正确的 i
var strStr = function (haystack, needle) {
    for (var i = 0; i <= haystack.length - needle.length; i++) {
          let flag = true;
        for (var j = 0; j < needle.length; j++) {
            if (haystack[i + j] != needle[j]) {
                flag = false;
                break;
            } 
        }
        if(flag){
            return i
        }
    }
    return -1;
};
let haystack = "hello", needle = "ll"
console.log("strStr(haystack,needle)--",strStr(haystack,needle));

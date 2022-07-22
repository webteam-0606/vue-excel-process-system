// 编写一个函数来查找字符串数组中的最长公共前缀。

// 如果不存在公共前缀，返回空字符串 ""。
/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function(e) {
  if(e.length == 0) 
      return "";
      // 让ans等于第一个字符内容，
  let ans = e[0];
  for(let i =1;i<e.length;i++) {
      let j=0;
      //固定ans[j]，遍历e[i][j]
      for(;j<ans.length && j < e[i].length;j++) {
          if(ans[j] != e[i][j])
              break;
      }
      //如果相同，则截取相同部分
      ans = ans.substring(0, j);
      if(ans === "")
          return ans;
  }
  console.log("最长公共前缀:",ans);
  return ans;
};
// 让ans等于第一个字符，遍历后边的字符，直到不相等，break，得到相同的长度，截取字符串。
let e = ["flower","flow","flight"];
longestCommonPrefix(e);
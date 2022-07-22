// 给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。

// 有效字符串需满足：

// 左括号必须用相同类型的右括号闭合。
// 左括号必须以正确的顺序闭合。
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
  var arr = "";
  var arrR = "";
  var j = 0;
  var r = 0;
  var left = ["{", "[", "("];
  var right = ["}", "]", ")"];
  if (s.length != 0) {
    for (let i = 0; i < s.length; i++) {
      if (left.includes(s[i])) {        
        // 左和右括号都得装在字符串里。不然右括号不装进去，若实例只有右，也会输出true。
        // 且右边装进去后，若是被消除了，右字符串里也得对应删除。
        // 同时，判断条件为左右括号都为空，才成功
        arr = arr.concat(s[i]);
        j++;
      }
      if (right.includes(s[i])) {
        r=r+1;
        arrR = arrR.concat(s[i]);
        if (
          (arr[j - 1] == "{" && s[i] == "}") ||
          (arr[j - 1] == "[" && s[i] == "]") ||
          (arr[j - 1] == "(" && s[i] == ")")
        ) {
          j = j - 1;
          arr = arr.substring(0, j);
          r = r-1;
          arrR = arrR.substring(0, r);

        }
      }
    }
  }
  // 注意 if(==)
  if (arrR == "" && arr == "") {
    console.log("true");
  } else {
    console.log("false");
  }
};
let s = "]";
isValid(s);
let s1 = ")";
isValid(s1);
let s2 = "()[]{}";
isValid(s2);

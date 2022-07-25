// 给你一个整数数组 nums ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

// 子数组 是数组中的一个连续部分

/**
 * @param {number[]} nums
 * @return {number}
 */
 var maxSubArray = function(nums) {
  const dp = [];
  let res = (dp[0] = nums[0]);
  //初始化状态，若长度为1，最大的子数组和就为1
  for (let i = 1; i < nums.length; ++i) {
      dp[i] = nums[i]; // 以此为起点，向右遍历
      if (dp[i - 1] > 0) {//前面的状态是正数 则加上。不是正数，则直接i++ 遍历后边的
          dp[i] += dp[i - 1];
      }
      res = Math.max(res, dp[i]);//更新最大值
  }
  return res;
};

//状态压缩，使得空间变小
var maxSubArray = function(nums) {
  let pre = 0, maxAns = nums[0];
  nums.forEach((x) => {
      pre = Math.max(pre + x, x);
      maxAns = Math.max(maxAns, pre);
  });
  return maxAns;
};

// 给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。

// 请必须使用时间复杂度为 O(log n) 的算法。

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var searchInsert = function(nums, target) {
    // 遍历一遍，若等于，输出。
    // 若不等于，直接看是不是中间值，是的话，返回 i 下标。
    // 记得考虑两边情况。
  if (target < nums[0]) {
    return 0;
  }
  if (target > nums[nums.length - 1]) {
    return nums.length;
  }
  for (var i = 0; i < nums.length; i++) {
    if (nums[i] == target) {
      return i;
    } else if (nums[i] < target && target < nums[i + 1]) {
      return i + 1;
    }
  }
};

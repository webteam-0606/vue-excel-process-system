// 给你一个数组 nums 和一个值 val，你需要 原地 移除所有数值等于 val 的元素，并返回移除后数组的新长度。

/**
 * @param {number[]} nums
 * @return {number}
 */
 var removeElement = function(nums,val) {
    // 原理同26题，slow 是需要保留的内容，fast 快速遍历。 
    // 若 fast 的值!=val，即需要保留，将其保留（覆盖/复制）至 slow 中，slow++。判断结束后，fast++ 继续寻找。
    // 若 fast 的值=val，即略过它（若 slow 到此位置，可能会有 fast 处!=val的值覆盖它），继续循环后边的数（以后也都不会再循环它了），fast++。
    let n = nums.length;
    let fast = 0,slow = 0;
    while(fast < n){
        if(nums[fast]!=val){
            nums[slow]=nums[fast]
            slow++
        }
        fast++;
    }
    return slow;

};
let nums = [0,0,1,1,3];
console.log("removeElement(nums,1)--",removeElement(nums,1));
// 给你一个 升序排列 的数组 nums ，请你 原地 删除重复出现的元素，使每个元素 只出现一次 ，返回删除后数组的新长度。元素的 相对顺序 应该保持 一致 。

/**
 * @param {number[]} nums
 * @return {number}
 */
 var removeDuplicates = function(nums) {
    // 错误写法如下：原因：应该一直保持让 fast 和 fast 的前一个比较，对比不一样后，赋给slow。
    // 否则，此种写法，[1，2，3] 只会输出 [1，2]
    // while(fast < n && n!=0){
    //     if(nums[fast]!=nums[slow-1]){
    //         nums[slow] = nums[fast];
    //         slow++;
    //         fast++;
    //     }else{
    //         fast++
    //     }
    // }

    let n = nums.length;
    let fast =1,slow=1;
    if(n==0){
        return 0;
    }
    while(fast < n){
        if(nums[fast]!=nums[fast-1]){
            nums[slow] = nums[fast];
            slow++;
        }
        fast++;
    }
    return slow;

};
let nums = [0,0,1,1,1,2,2,3,3,4];
console.log("removeDuplicates(nums1)--",removeDuplicates(nums));
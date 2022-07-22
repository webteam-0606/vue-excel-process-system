// 将两个升序链表合并为一个新的 升序 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
 var mergeTwoLists = function(list1, list2) {
  var len = 0;
  if(list1.length < list2.length ? len=list1.length: len=list2.length)
  for(var i=0;i<len;i++){
    if((list1[i]<list2[i] || list1[i]==list2[i]) ? list2.unshift(list1[i]) : list1.unshift(list2[i])){
      //把1放到2的第一个位置
      list2.unshift(list1[i])
    }
  }
};
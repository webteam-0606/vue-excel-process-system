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
  let list = new ListNode();
  // 用给定封装好的链表，这里运行不了
  let cur = list;
  // 注意先给一个表头，最后输出这个，不然链表形成了，不好从头输出。
  while(list1!=null && list2!=null){
      if(list1.val<list2.val){
          list.next = list1;
          list1 = list1.next;
      }else {
          list.next = list2;
          list2 = list2.next;
      }
      list = list.next;
      // 注意新的链表也得往后挪一个指针
  }
  // 判断，如果剩下的链表还有数据，则直接接上
  if(list1 != null){
      list.next = list1;
  }else if(list2 != null) {
      list.next = list2;
  }
  // 得返回 list 的表头
  return cur.next;
};
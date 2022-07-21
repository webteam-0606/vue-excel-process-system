# demo1
> vue+element-ui project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```
## 需解决

> 如果全文搜索，展示所有列时，其中一列（不是关键20列）有搜索内容，再展示关键20列时，这一条数据还是会显示,但是此时看不见搜索内容。

> 1、文件读取查找速度

> 2、浏览器自适应问题

> 3、数据缓存问题

## 已完成
> \\yy257728\CT System Engineering\90-Personal

> 1、按ID/全文搜索 √
+ `this.listTable=` 啥， `dataPreview` 就展示啥内容。所以解决一开始的展示一次性上传的多个文件内容，只需要去掉 `this.listTable.push(rowTable);`，加上 `this.listTable = sheetArray;` 即可。

> 2、自动读入不同 `title` 的文件 √

1）、搜索不到多余列里的字符 √
```java
//方法一

if (this.selectRadio == 1) {
        //search框输入的搜索内容--全文搜索
        // 我的想法是新创建一个临时的temKeyList,或者直接使用keyList，从searchArr获得数据的title行，存为数组。然后遍历，把title给e，但是为啥显示不行，总是说undefine啥的。也尝试使用过keyList。
        //这个方法也是对的 就是e[this.keyList[i]]才是键值对的值，不能用e.this.keyList[i]，这个是直接去e里边找键为this.keyList[i]，就算重新赋值也不行
        //这种方法，只适合与 keyList 与待查找表格内容的title一致
        this.keyList = [];
        for (let item in searchArr[0]) {
          this.keyList.push(item);
        }
        searchArr.forEach(e => {
          for (var i = 0; i < this.keyList.length; i++) {
            let temp = e[this.keyList[i]];
            if (temp.toString().includes(res)) {
              if (Search_List.indexOf(e) == "-1") {
                Search_List.push(e);
              }
            }
          }
        });
}

//方法二
//这个方法更加简单 obj[key]是遍历对象的值，obj是键。
//这种方法不依赖查找表的内容格式，只需要展示的keyList包含所有选中文件的title
          for(let key in obj){
            console.log('obj[key]-----',obj[key]);
            console.log('res-----',res);
            if(obj[key].toString().includes(res)){
              Search_List.push(obj);
              break;
            }
          }
```
2）、需要显示的列 √
+ Id  ×
+ Products  ×
+ Headline  ×
+ SubmitDescription √
+ VersionFoundIn ×        
+ Score ×
+ Probability_Score  ×
+ Impact_Score  ×
+ Hazard  ×
+ InstallBase ×
+ CRB_MinutesActions √
+ ReferenceID ×
+ Subsystem ×
+ RationaleForChange √
+ ResolutionDescription √
+ VersionsFixedIn  ×                                    
+ CFR_ID ×
+ AssociatedDefects ×
+ Status ×
+ Workaround ×

      <!-- // shortWidthKey: [
      //   "score",
      //   "hazard",
      //   "installbase",
      //   "status",
      //   "workaround",
      //   "score",
      //   "capareqd",
      //   "approvedformerge",
      //   "associateddefectscount",
      //   "bgprocstate",
      //   "CnR",
      //   "cnrreqd",
      //   "complaint",
      //   "crb_absent",
      //   "esig_is_current",
      //   "is_duplicate",
      //   "Noacceptcount",
      //   "nositesobserved",
      //   "readyformerge"
      // ] -->
```java
handleMainButton(val) {
      console.log("handleMainButton--val", val);
      var mainKeyList = [];
      mainKeyList = [
        "id",
        "Products",
        ...//省略
        "Workaround"
      ];
      this.keyList = [];
      for (let k in mainKeyList) {
        this.keyList.push(mainKeyList[k]);
      }
    },
```

> 3、数据显示问题（列宽 行高）
+ 目前按照title的宽度，设置的列宽，有些不准确
+ 文字内容目前居中平，可以设置成左上对齐
```java
:render-header="headSpanFit" //动态绑定

data() {  //给定宽的列名
    return {
      longWidthKey: [
        "crb_minutesactions",
        "rationaleforchange",
        "resolutiondescription",
        "historydetails"
      ],

headSpanFit(h, { column, index }) {
      let labelLong = column.label.length; // 表头label长度
      let size = 14; // 根据需要定义标尺，直接使用字体大小确定就行
      if (this.longWidthKey.includes(column.label.toLowerCase())) {
        column.minWidth = 800;
      } else if (labelLong > 0 && labelLong < 4) {
        column.minWidth = (labelLong + 4) * size; // 根据label长度计算该表头最终宽度
      } else {
        column.minWidth = labelLong * size;
      }
      return h("span", { class: "cell-content", style: { width: "100%" } }, [
        column.label
      ]);
    }
```

> 4、左侧文件框处，需要显示文件地址；解决文件名过长，重新命名为`solution` 和 `no solution`；

> 5、得显示关键的20列。 √
+ 正常搜索是全文搜索，争对所有title的搜索，如果按了main按钮只展示20列的数据。文件上传时的title 装在数组 `KeyList`里，然后展示对应列。


> 6、文件名重复问题 
+ 判断一下文件名列表里是否已经存在，若存在，则报错，为啥不行。
+ 解决：之前报错因为没有加 `this`，所以 `undefined`。同时，重复的话，就不给文件上传了，直接 `return true`，不执行下边代码。
```java
if (this.refreshFileNameList.includes(_file.name) || this.brillianceFileNameList.includes(_file.name)) {
        alert('文件名重复！请重新上传')
        return true
      }
```

> 7、折叠版左侧的文件名点击，右侧的目录不能同步
+ 解决：解决文件列表名和tabs标签页不对应。把 `selectedRefreshFile` 里的值在整个 `allFileData` 里边找到对应下标，即可以正确对应。`selectedBrillianceFile` 同理。
```java
// console.log("tempSearchBox-1--", tempSearchBox);
      for (let k in this.selectedRefreshFile) {
        // 改成数组形式
        this.fileNameList.find((item, index) => {
          if (item === this.refreshFileNameList[k]) {
            tempSearchBox = [...tempSearchBox, ...this.allFileData[index]];
          }
        });
      }
      for (let k in this.selectedBrillianceFile) {
        // 改成数组形式
        this.fileNameList.find((item, index) => {
          if (item === this.brillianceFileNameList[k]) {
            tempSearchBox = [...tempSearchBox, ...this.allFileData[index]];
          }
        });
      }
```
+ 备注：
```java      
//这种是将Box1与Box2对应合并，Box2的不同属性对应合并到Box1里。
      tempSearchBox = tempSearchBox1.map((item, index) => {
        return { ...item, ...tempSearchBox2[index] };
      });
```
>8、 选中1-1文件后，可以搜索，但是选择5-5后搜不到5-5的内容，还是只能搜索到1-1内容
+ 已解决,`this.refreshFileNameList[k]`改为`this.refreshFileNameList[this.selectedRefreshFile[k]]` 即可，前者 k=0 每次都是第一个文件名。后者是选中文件的序号。同时找到当前文件在整个文件里的下标，使得 `tabs` 标签一一对应.
```java
for (let k in this.selectedRefreshFile) {
        // 改成数组形式
        this.fileNameList.find((item, index) => {
          if (item === this.refreshFileNameList[this.selectedRefreshFile[k]]) {
            tempSearchBox = [...tempSearchBox, ...this.allFileData[index]];
          }
        });
      }
```


## 笔记
> 1、子组件封装

1)、子组件中
+ `el-table` 的表格需要 `data`，动态绑定了 `dataSet`
```java
:data="dataSet" 
```
+ 子组件 `props`，以及不同类型的props
```java
props: {
    dataSet:{
        type:Array,
        default:[]
    }

  props: {
    fieldString: {
      type: String,
      default: ''
    },
    fieldNumber: {
      type: Number,
      default: 0
    },
    fieldBoolean: {
      type: Boolean,
      default: true
    },
    fieldArray: {
      type: Array,
      default: () => []
    },
    fieldObject: {
      type: Object,
      default: () => ({})
    },
    fieldFunction: {
      type: Function,
      default: function () { }
    }
  }

```
2)、父组件拿到子组件

+ 给占位符，写法是
```java
<data-preview :dataSet="listTable"></data-preview>
```

+ 引入
```java
import dataPreview from "./dataPreview.vue";
```
+ 加入子组件名字
```java
components: {
    dataPreview,
  },
```
------
>2、封装实例
------
1）、`dataPreview` 的封装
+ 子组件 `dataPreview`中：设置列宽方法写在子组件即可。
+ 判断哪些参数需要传给父组件，此示例需要传递`:dataSet` 与 `:keyList`。
+ ① `dataSet` 展示时，不断变化。分页应该动态绑定，加在子组件的引入这里。
+ ② `keyList` 是展示内容的 `title`，展示哪些内容，会动态变化，也得动态绑定。
```java
<template> //子组件`dataPreview`中：
  <div class="preview-excel">
    <el-table :data="dataSet">
      <el-table-column
        v-for="(key, index) in keyList"
        :prop="key"
        :label="key"
        align="center"
        :key="index"
        :fit="true"
        :render-header="headSpanFit"
      ></el-table-column>
    </el-table>
  </div>
</template>
```
+ 子组件利用 `props` 与 `v-on` 和  `$.emit`向父组件传参。`v-on:click` 等价于 `@click`。
+ 父组件 `HelloWord` 中： `:dataSet` 与 `:keyList` 需要子传父，所以利用 `props`，给类型+默认值。
```java
<script> //子组件`dataPreview`中：
export default {
  name: 'dataPreview',
  data() {
    return {
      longWidthKey: ['HistoryDetails'] //没用上
    }
  },
  props: {
    dataSet: {
      type: Array,
      default: []
    },
    keyList: {
      type: Array,
      default: []
    }
  },
  create() {console.log('dataSet', this.dataSet)},
  methods: {//设置列宽方法
    headSpanFit(h, { column, index }) { 、、、},
  }
}
</script>
```
-----
+ 父组件中：给占位符，引入，注册组件。
```java
<data-preview 
              :dataSet="listTable.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
              :keyList="keyList"
            ></data-preview>
```

2）、`searchFileBox` 的封装
+ 子组件 `searchFileBox`中： 先判断哪些参数需要传给父组件。
+ ① 按照顺序，先看 `v-model`。其中，`inputVal` 的值是输入得到的一个 `String`， `selectRadio`的值是选择按钮得到的一个 `Number`。得到的简单的数值，都需要在 `data()` 里 `return` 给父组件。
+ ② 在看 `v-on:` 也就是 `@` 事件。 `@click="handleSearchButtonClick"` 是处理 `search` 按钮的点击函数，`@change="handleRadioSelectChange"` 是处理选择的小 `radios` 按钮的选中函数。 在子组件类定义函数内容，把得到的值通过 `&emit` 方式传父组件。
```java
<template>
  <!-- 搜索框 -->
  <div>
    <div>
      <el-input v-model="inputVal"></el-input>
      <el-button @click="handleSearchButtonClick">
        Search
      </el-button>
    </div>
    <div>
      <el-radio-group v-model="selectRadio" @change="handleRadioSelectChange">
        <el-radio label="1">Full Text</el-radio>
        <el-radio label="2">By ID</el-radio>
      </el-radio-group>
    </div>
  </div>
</template>
```
+ 子组件利用 `props` 与 `v-on` 和  `$.emit`向父组件传参。`v-on:click` 等价于 `@click`。
+ 父组件 `HelloWord` 中： `:dataSet` 与 `:keyList` 需要子传父，所以利用 `props`，给类型+默认值。
```java
<script scoped>
export default {
  name: 'searchFileBox',
  data() {
    return {
      selectRadio: 0,
      inputVal: ''
    }
  },
  create() {},
  methods: {
    handleSearchButtonClick() {
      console.log('inputVal',this.inputVal)
      this.$emit('searchButtonClick', this.inputVal)
    },
    handleRadioSelectChange(val) {
      console.log('radio变更', val)
      this.$emit('radioSelectChange', val)
    }
  }
}
</script>
```
-----
+ 父组件中：给占位符，引入，注册组件。
```java
<SearchFileBox
            @searchButtonClick="handleSearchButtonClick"
            @radioSelectChange="handleRadioSelectChange"
          ></SearchFileBox>
```




>3、改 `element-ui` 组件样式

1)、找到 element-ui 给的类名，以及最近的自己编写的他的父亲类名，中间加/deep/ 样式穿透
```java
.upload-demo /deep/ .el-upload-dragger
```
>4、`el-checkbox` 的问题

1)、`el-radio` 不好做复选框，使用 `el-checkbox` 可以，注意动态绑定的是数组类型。

2)、`el-checkbox` 的 `:label="index"`，绑定的是 `fileNameList` 的下标，是数组类型且具有唯一性。之前错误绑定了 `filename`，是文件名称，不确定且是字符串类型。错误绑定了`filename.id`，报错 `undefined`。因为 `filename` 没有 `id`，和普通的 `items` 不一样，注意区别。
```java
<el-checkbox-group class="file-switch" v-model="selectedFile" @change="handleSelectedFile">
                <div class="upload-filename-item" v-for="(filename, index) in fileNameList">
                  <div class="upload-filename">
                    <i class="el-icon-document"></i>
                    {{ filename }}
                  </div>
                  <el-checkbox :label="index"></el-checkbox>
                </div>
              </el-checkbox-group>
```
3）、另外 `:label="index"` 会自动显示下标值，在样式中隐藏即刻。
```java
.upload-filename-item /deep/ .el-checkbox__label {
  display: none;
}
```
4）、功能截图
![节点](./.jpg)
```java
<!-- 当前文件 -->
          <div class="full-upload-file-box">
            <div class="recent-file">
              Recent Flies
              <el-checkbox
                class="file-check-all"
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleCheckAllChange"
              >
                全选
              </el-checkbox>
            </div>
            <div class="upload-filename-list">
              <el-checkbox-group class="file-switch" v-model="selectedFile" @change="handleSelectedFile">
                <div class="upload-filename-item" v-for="(filename, index) in fileNameList">
                  <div class="upload-filename" @click="handleClickFileName(index)">
                    <i class="el-icon-document"></i>
                    {{ filename }}
                  </div>
                  <el-checkbox :label="index"></el-checkbox>
                </div>
              </el-checkbox-group>
            </div>
          </div>
```
>4、存储选中文件内容

1)、循环 `selectedFile`，得到选中的文件，以数组形式存在 临时的待搜索内容盒子里
```java
let tempSearchBox = [];
      for (let k in this.selectedFile) {
        // 改成数组形式
        tempSearchBox = [
          ...tempSearchBox,
          ...this.allFileData[this.selectedFile[k]]
        ];
      }
```
>5、实现tabs标签得动态绑定

1）、上传文件时候，拿到一个文件列表 `tabsList`=`allFileData`，标题渲染在标签页，内容传给 `listTable`，如果删除，就把当前的标题tab删除及对应页面 `listTable` 更新内容，
2）、 `targetName`为点击时获得的文件标签名，



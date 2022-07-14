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
> 1、按ID/全文搜索 √

> 2、自动读入不同 `title` 的文件 

1）、搜索不到多余列里的中文字符
2）、需要显示的列
+ Id
+ Products
+ Headline
+ SubmitDescription
+ VersionFoundIn        
+ Score
+ Probability_Score
+ Impact_Score
+ Hazard
+ InstallBase
+ CRB_MinutesActions
+ ReferenceID
+ Subsystem
+ RationaleForChange
+ ResolutionDescription
+ VersionsFixedIn                                        
+ CFR_ID
+ AssociatedDefects
+ Status
+ Workaround

> 3、文件读取查找速度

> 4、文件名重复问题

> 5、浏览器自适应问题

> 6、数据缓存问题

> 7、数据显示问题（列宽 行高）

> 8、左侧文件框处，需要显示文件地址；解决文件名过长，重新命名为`solution` 和 `no solution`；

>9、得显示关键的20列。

## 笔记
> 1、子组件封装

1)、`el-table` 的表格需要 `data`，动态绑定了 `dataSet`
```java
:data="dataSet" 
```
2)、子组件 `props`，以及不同类型的props
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
> 2、父组件拿到子组件

1)、给占位符，写法是
```java
<data-preview :dataSet="listTable"></data-preview>
```

2)、引入
```java
import dataPreview from "./dataPreview.vue";
```
3)、加入子组件名字
```java
components: {
    dataPreview,
  },
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



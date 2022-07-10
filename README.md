# demo1
> 子组件封装
```
1、el-table的表格需要data，动态绑定了dataSet

:data="dataSet" 

2、子组件props
props: {
    dataSet:{
        type:Array,
        default:[]
    }
```
> 父组件拿到子组件
```
1、给占位符，写法是-
<data-preview :dataSet="listTable"></data-preview>

2、引入
import dataPreview from "./dataPreview.vue";

3、加入子组件名字
components: {
    dataPreview,
  },
```

>改 element-ui 组件样式

1、找到 element-ui 给的类名，以及最近的自己编写的他的父亲类名，中间加/deep/ 样式穿透
```
.upload-demo /deep/ .el-upload-dragger
```

> vue project

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

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

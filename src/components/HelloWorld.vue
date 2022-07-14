<template>
  <div>
    <el-container>
      <el-header>
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          background-color="#E4E7ED"
          text-color="#black"
          @select="handleSelect"
        >
          <el-submenu index="1">
            <template slot="title">Menu</template>
            <el-menu-item index="1-1">选项1</el-menu-item>
            <el-menu-item index="1-2">选项2</el-menu-item>
            <el-menu-item index="1-3">选项3</el-menu-item>
          </el-submenu>

          <el-submenu index="2" style="padding-right:0px">
            <template slot="title">Help</template>
            <el-menu-item index="2-1">选项1</el-menu-item>
            <el-menu-item index="2-2">选项2</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-header>
      <el-container>
        <el-aside width="20%">
          <!-- 搜索框 -->
          <SearchFileBox
            @searchButtonClick="handleSearchButtonClick"
            @radioSelectChange="handleRadioSelectChange"
          ></SearchFileBox>

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
          <!--  excel表格上传  -->
          <ClickUpload
            :exceed="exceed"
            :remove="remove"
            :uploadFile="uploadFile"
            @click="search()"
            @change="handleRadioSelectChange"
          ></ClickUpload>
        </el-aside>
        <el-container>
          <el-main>
            <!-- 文件的 tabs 标签页 -->
            <div class="file-tabs-list">
              <el-tabs v-model="fileNameListValue" type="card" @tab-remove="removeTab" @tab-click="clickTab">
                <el-tab-pane
                  v-for="(filename, index) in fileNameList"
                  :label="stringIntercept(filename, 20)"
                  :key="index"
                  :name="(index + 1).toString()"
                ></el-tab-pane>
              </el-tabs>
            </div>

            <div class="product-defect">Product Defect :</div>
            <!--  上传的excel表格预览  -->
            <data-preview
              :dataSet="listTable.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
              :keyList="keyList"
            ></data-preview>
            <!-- 分页实现 -->
            <div class="block">
              <span class="demonstration"></span>
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="listTable.length"
              ></el-pagination>
            </div>
          </el-main>
          <el-footer>Footer222</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import XLSX from 'xlsx'
import dataPreview from './dataPreview.vue'
import ClickUpload from './clickUpload.vue'
import SearchFileBox from './searchFileBox.vue'
export default {
  name: 'HelloWorld',
  components: {
    dataPreview,
    ClickUpload,
    SearchFileBox
  },
  data() {
    return {
      fileNameList: [],
      // Header的menu
      activeIndex: '1',
      //Aside的请输入搜索的内容
      inputVal: '',
      //Recent file的全选按钮
      checkAll: false,
      isIndeterminate: false,
      // search框搜索出来的值
      listTable: [],
      //渲染时 数据
      showTable: [],
      //选择全文搜索/ID搜索
      selectRadio: '1',
      //目前选择按钮选中的文件
      selectedFile: [],
      //上传的所有文件
      allFileData: [],
      //tabs标签页
      fileNameListValue: 0,
      currentIndex: 1,
      tabIndex: 1,
      editableTabs: [
        {
          title: 'tab1',
          name: '1'
        }
      ],
      //分页
      currentPage: 1,
      pageSize: 10,

      keyList: [] //保存excel的列名
    }
  },

  //监听search框输入的搜索内容
  watch: {
    //监听：如果为空,显示所有数据
    inputVal(item1) {
      if (item1 == '') {
        this.listTable = this.showTable
      }
    }
  },
  //页面渲染时,显示所有的数据
  mounted() {
    this.showTable = this.listTable
  },
  methods: {
    handleSearchButtonClick(inputVal){
      console.log('接收到子组件searchValue的变更',inputVal);
      this.inputVal=inputVal
      this.search()
    },
    // aside 的全文搜索/ID搜索
    handleRadioSelectChange(val) {
      console.log('父组件---radio变更', val)
      this.selectRadio=val
    },
    //header的menu
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
    },
    // Recent File 的全选按钮
    handleCheckAllChange(val) {
      console.log('handleCheckAllChange--val', val)
      const all = this.fileNameList.map((item, index) => {
        return index
      })
      this.selectedFile = val ? all : []
      this.isIndeterminate = false
    },
    // Recent File 的文件单选按钮
    handleSelectedFile(val) {
      console.log('val', val)
      let checkedCount = val.length
      this.checkAll = checkedCount === this.selectedFile.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.fileNameList.length
      console.log('this.isIndeterminate', this.isIndeterminate)
      //若不选中，清空选择框
      if (val.length === 0) {
        this.isIndeterminate = false
        this.checkAll = false
      }
    },
    //点击左侧文件列表某个文件名时切换右侧展示内容
    handleClickFileName(index) {
      console.log('当前点击的文件index', index)
      this.listTable = this.allFileData[index]
      //同时更改keyList
      this.keyList = []
      if (this.listTable.length > 0) {
        for (let k in this.listTable[0]) {
          this.keyList.push(k)
        }
      }
      //同时切换右侧tab栏激活的标签
      this.fileNameListValue = index + 1 + ''
    },
    //解析excel
    async uploadFile(params) {
      console.log('上传文件触发');
      this.listTable = []
      const _file = params.file
      this.fileNameList.push(_file.name)
      console.log('_file', _file)
      const fileReader = new FileReader()
      fileReader.onload = ev => {
        try {
          const data = ev.target.result
          console.log('ev.target', ev.target)
          const workbook = XLSX.read(data, {
            type: 'binary'
          })
          for (let sheet in workbook.Sheets) {
            //循环读取每个文件
            const sheetArray = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
            //若当前sheet没有数据,则continue
            if (sheetArray.length == 0) {
              continue
            }
            console.log('读取文件')
            console.log(sheetArray)
            // this.listTable.push(sheetArray);
            //暂时的所有上传文件内容，用于在allFileData里边遍历，找到被选中的文件，如何传给临时内容搜索盒子
            this.allFileData.push(sheetArray)
            console.log('sheetArray', sheetArray)
            for (let item in sheetArray) {
              console.log('item', item)
              let rowTable = {}
              //这里的rowTable的属性名注意要与上面表格的prop一致
              //sheetArray的属性名与上传的表格的列名一致
              for (let key in sheetArray[item]) {
                rowTable[key] = sheetArray[item][key]
              }
              // rowTable.id = sheetArray[item].id
              // rowTable.Headline = sheetArray[item].Headline
              this.listTable.push(rowTable)
            }
            this.keyList = []
            if (this.listTable.length > 0) {
              for (let k in this.listTable[0]) {
                this.keyList.push(k)
              }
            }
            console.log('this.listTable', this.listTable)
            //上传完毕后把当前tab页激活(当前展示数据tab变成蓝色)
            //element-ui tab的name属性只接收string类型
            //v-model="fileNameListValue"意思是当前激活的tab的name属性为fileNameListValue
            this.fileNameListValue = this.allFileData.length.toString()
          }
        } catch (e) {
          this.$message.warning('文件类型不正确！')
        }
      }
      fileReader.readAsBinaryString(_file)
    },
    //上传1个以上文件时弹窗提示错误
    exceed: function() {
      this.$message.error('最多只能上传50个xls文件')
    },
    //删除文件
    remove() {
      this.listTable = []
    },
    search() {
      // Search_List 存放搜索成功返回的数据
      const Search_List = []
      let res1 = this.inputVal
      const res = res1.replace(/\s/gi, '')
      console.log('res', res)
      // 被选中文件形成的暂时的文件内容
      let tempSearchBox = []
      for (let k in this.selectedFile) {
        // 改成数组形式
        tempSearchBox = [...tempSearchBox, ...this.allFileData[this.selectedFile[k]]]
        // console.log('this.selectedFile[k]',this.selectedFile[k],k);
      }
      // searchArr 待被搜索的文件内容
      let searchArr = tempSearchBox

      if (this.selectRadio == 1) {
        //search框输入的搜索内容--全文搜索
        searchArr.forEach(e => {
          //绑定的table prop
          let id = e.id
          let Headline = e.Headline
          if (id.toString().includes(res)) {
            if (Search_List.indexOf(e) == '-1') {
              Search_List.push(e)
            }
          }
          if (Headline.toString().includes(res)) {
            if (Search_List.indexOf(e) == '-1') {
              Search_List.push(e)
            }
          }
        })
        //Search_List 搜索成功返回的内容，给listTable展示
        this.listTable = Search_List
      } else if (this.selectRadio == 2) {
        searchArr.forEach(e => {
          //绑定的table prop
          let id = e.id
          if (id.toString().includes(res)) {
            if (Search_List.indexOf(e) == '-1') {
              Search_List.push(e)
            }
          }
        })
        this.listTable = Search_List
        console.log('搜索结果', this.listTable)
        this.currentPage = 1
      } else {
        console.log('this.selectRadio', this.selectRadio)
      }
    },

    //实现tabs标签页
    removeTab(targetName) {
      if (this.fileNameList.length <= 1) {
        return false
      }
      console.log('targetName', targetName) //undefined
      let tabs = this.fileNameList
      console.log('tabs', tabs) //上传的列表名
      let activeName = this.fileNameListValue
      console.log('activeName', activeName, this.fileNameListValue) // 1 1
      if (activeName === targetName) {
        console.log(true)
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
            }
          }
        })
      }
      this.fileNameListValue = activeName
      this.fileNameList = tabs.filter(tab => tab.name !== targetName)
    },
    clickTab(targetName) {
      //切换tab页时更新展示数据
      console.log('tabsIndex', targetName.index)
      const tabIndex = targetName.index
      this.listTable = this.allFileData[tabIndex]
      //同步更改keyList
      this.keyList = []
      if (this.listTable.length > 0) {
        for (let k in this.listTable[0]) {
          this.keyList.push(k)
        }
      }
      console.log('fileNameListValue', this.fileNameListValue)
    },

    //实现表格分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      console.log(
        '当前页数据',
        this.listTable.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
      )
    },
    spliceFileName(fileName) {
      let name = fileName
      if (fileName.length > 22) {
        fileName = fileName.substring(0, 20) + '...'
      }
      return fileName
    },
    //截取字符串 包含中文处理,一个中文字符等于2个长度
    stringIntercept(str, len, hasDot) {
      var newLength = 0
      var newStr = ''
      var chineseRegex = /[^\x00-\xff]/g
      var singleChar = ''
      var strLength = str.replace(chineseRegex, '**').length
      for (var i = 0; i < strLength; i++) {
        singleChar = str.charAt(i).toString()
        if (singleChar.match(chineseRegex) != null) {
          newLength += 2
        } else {
          newLength++
        }
        if (newLength > len) {
          break
        }
        newStr += singleChar
      }

      if (hasDot && strLength > len) {
        newStr += hasDot
      }
      return newStr + '...'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.el-header {
  /* background-color: #b3c0d1; */
  text-align: center;
  line-height: 20px;
  padding: 0;
  height: 10px;
}

.el-aside {
  /* background-color: #d3dce6; */
  color: #333;
  text-align: center;
  /* line-height: 200px; */
  width: 20%;
  overflow: hidden;
}
.el-aside .UploadFileNameList {
  padding: 10px 0px 10px 0px;
}

.full-upload-file-box {
  margin-top: 10px;
  font-size: 14px;
  width: 100%;
}
.full-upload-file-box .recent-file {
  position: relative;
  width: 98%;
  text-align-last: left;
  border: 1px solid rgb(202, 205, 210);
  background-color: #e9eef3;
  font-size: 14px;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 5px 0 5px 5px;
}
.full-upload-file-box .file-check-all {
  position: absolute;
  right: 10px;
}
.upload-filename-item /deep/ .el-checkbox__label {
  display: none;
}

.upload-filename-list {
  height: 400px;
  overflow: auto;
}
.full-upload-file-box .upload-filename-item {
  text-align: left;
  border: 1px solid rgb(228, 231, 237);
  margin-top: 2px;
  padding: 5px 0px 5px 10px;
  font-size: 13px;
  border-right: 20px;
  display: flex;
  justify-content: space-between;
}
.upload-filename {
  width: 80%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}

.el-main {
  /* background-color: #e9eef3; */
  color: #333;
  text-align: center;
  border: 1px solid rgb(202, 205, 210);
  margin-left: 5px;
  /* line-height: 160px; */
  overflow: hidden;
}
.file-tabs-list {
  overflow: auto;
}
.file-tabs-list /deep/ .el-tabs__item {
  height: 30px;
  line-height: 35px;
  white-space: nowrap;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 2px;
}
.file-tabs-list /deep/ .el-icon-close {
  vertical-align: inherit;
}
.file-tabs-list /deep/.file-tabs-list {
  margin: 0 0 5px 0;
}
.file-tab-name {
  width: 180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.el-main .product-defect {
  width: 99%;
  text-align-last: left;
  border: 1px solid rgb(202, 205, 210);
  background-color: #b3c0d1;
  font-size: 14px;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 5px 5px 5px 5px;
}
.el-main /deep/ .el-table__body-wrapper {
  width: 99.7%;
  border: 1px solid rgb(202, 205, 210);
}

.el-main .el-pagination {
  padding: 5px 5px;
}
.el-footer {
  background-color: #b3c0d1;
  text-align: center;
  line-height: 40px;
  margin-left: 5px;
}
body > .el-container {
  margin-bottom: 40px;
}
</style>

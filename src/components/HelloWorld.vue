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

          <div class="full-upload-file-box">
            <el-collapse v-model="activeNames" @change="handleChange">
              <!-- 当前文件 Refresh -->
              <el-collapse-item name="1" class="refresh-file">
                <template slot="title">
                  Refresh
                  <el-checkbox
                    class="file-check-all"
                    :indeterminate="isRefreshIndeterminate"
                    v-model="checkRefreshAll"
                    @change="handleRefreshCheckAllChange"
                  >全选</el-checkbox>
                </template>
                <div class="upload-filename-list">
                  <el-checkbox-group
                    class="file-switch"
                    v-model="selectedRefreshFile"
                    @change="handleSelectedRefreshFile"
                  >
                    <div
                      class="upload-filename-item"
                      v-for="(filename, index) in refreshFileNameList"
                    >
                      <el-tooltip class="item" effect="light" :content="filename">
                        <div
                          class="upload-filename"
                          :alt="filename"
                          @click="handleClickFileName(index)"
                        >
                          <i class="el-icon-document"></i>
                          {{ filename }}
                        </div>
                      </el-tooltip>
                      <el-checkbox :label="index"></el-checkbox>
                    </div>
                  </el-checkbox-group>
                </div>
              </el-collapse-item>
              <!-- 当前文件 Brilliance Air -->
              <el-collapse-item name="2" class="refresh-file">
                <template slot="title">
                  Brilliance Air
                  <el-checkbox
                    class="file-check-all"
                    :indeterminate="isBrillianceIndeterminate"
                    v-model="checkBrillianceAll"
                    @change="handleBrillianceCheckAllChange"
                  >全选</el-checkbox>
                </template>
                <div class="upload-filename-list">
                  <el-checkbox-group
                    class="file-switch"
                    v-model="selectedBrillianceFile"
                    @change="handleSelectedBrillianceFile"
                  >
                    <div
                      class="upload-filename-item"
                      v-for="(filename, index) in brillianceFileNameList"
                    >
                      <el-tooltip class="item" effect="light" :content="filename">
                        <div
                          class="upload-filename"
                          :alt="filename"
                          @click="handleClickFileName(index)"
                        >
                          <i class="el-icon-document"></i>
                          {{ filename }}
                        </div>
                      </el-tooltip>
                      <el-checkbox :label="index"></el-checkbox>
                    </div>
                  </el-checkbox-group>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>

          <!--  excel表格上传  -->
          <ClickUpload
            :exceed="exceed"
            :uploadFile="uploadFile"
            @click="search()"
            @change="handleRadioSelectChange"
          ></ClickUpload>
        </el-aside>
        <el-container>
          <el-main>
            <!-- 文件的 tabs 标签页 -->
            <div class="file-tabs-list">
              <el-tabs
                v-model="fileNameListValue"
                type="card"
                @tab-remove="removeTab"
                @tab-click="clickTab"
              >
                <el-tab-pane
                  v-for="(filename, index) in fileNameList"
                  :label="stringIntercept(filename, 20)"
                  :key="index"
                  :name="(index + 1).toString()"
                ></el-tab-pane>
              </el-tabs>
            </div>

            <div class="product-defect">
              Product Defect :
              <el-button @click="handleMainButton" class="product-main" type="primary">Main</el-button>
            </div>
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
import XLSX from "xlsx";
import dataPreview from "./dataPreview.vue";
import ClickUpload from "./clickUpload.vue";
import SearchFileBox from "./searchFileBox.vue";
export default {
  name: "HelloWorld",
  components: {
    dataPreview,
    ClickUpload,
    SearchFileBox
  },
  data() {
    return {
      //树形结构
      data: [
        {
          label: "Refresh 1",
          children: [
            {
              label: "二级 1-1",
              label: "二级 1-2"
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      },
      activeNames: ["1"],
      fileNameList: [],
      refreshFileNameList: [],
      brillianceFileNameList: [],
      // Header的menu
      activeIndex: "1",
      //Aside的请输入搜索的内容
      inputVal: "",
      //Recent file的全选按钮
      checkRefreshAll: false,
      // checkAll: false,
      checkBrillianceAll: false,
      isRefreshIndeterminate: false,
      isBrillianceIndeterminate: false,
      isIndeterminate: false,
      // search框搜索出来的值
      listTable: [],
      //渲染时 数据
      showTable: [],
      //选择全文搜索/ID搜索
      selectRadio: "1",
      //目前选择按钮选中的文件
      selectedFile: [],
      selectedRefreshFile: [],
      selectedBrillianceFile: [],
      //上传的所有文件
      allFileData: [],
      //tabs标签页
      fileNameListValue: 0,
      currentIndex: 1,
      tabIndex: 1,
      editableTabs: [
        {
          title: "tab1",
          name: "1"
        }
      ],
      //分页
      currentPage: 1,
      pageSize: 10,
      keyList: [] //保存excel的列名
    };
  },

  //监听search框输入的搜索内容
  watch: {
    //监听：如果为空,显示所有数据
    inputVal(item1) {
      if (item1 == "") {
        this.listTable = this.showTable;
      }
    }
  },
  //页面渲染时,显示所有的数据
  mounted() {
    this.showTable = this.listTable;
  },
  methods: {
    //原uploadFile方法开始
    // async uploadFile(params) {
    //   console.log("上传文件触发");
    //   this.listTable = [];
    //   const _file = params.file;
    //   this.fileNameList.push(_file.name);

    //   console.log("_file", _file);
    //   const fileReader = new FileReader();
    //   fileReader.onload = ev => {
    //     try {
    //       const data = ev.target.result;
    //       console.log("ev.target", ev.target);
    //       const workbook = XLSX.read(data, {
    //         type: "binary"
    //       });
    //       for (let sheet in workbook.Sheets) {
    //         //循环读取每个文件
    //         const sheetArray = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
    //         //若当前sheet没有数据,则continue
    //         if (sheetArray.length == 0) {
    //           continue;
    //         }
    //         console.log("读取文件");
    //         console.log(sheetArray);
    //         // this.listTable.push(sheetArray);
    //         //暂时的所有上传文件内容，用于在allFileData里边遍历，找到被选中的文件，如何传给临时内容搜索盒子
    //         this.allFileData.push(sheetArray);
    //         console.log("sheetArray", sheetArray);
    //         for (let item in sheetArray) {
    //           // console.log('item', item)
    //           let rowTable = {};
    //           //这里的rowTable的属性名注意要与上面表格的prop一致
    //           //sheetArray的属性名与上传的表格的列名一致
    //           for (let key in sheetArray[item]) {
    //             rowTable[key] = sheetArray[item][key];
    //           }
    //           this.listTable.push(rowTable);
    //         }
    //         this.keyList = [];
    //         if (this.listTable.length > 0) {
    //           for (let k in this.listTable[0]) {
    //             this.keyList.push(k);
    //           }
    //         }
    //         console.log("this.listTable", this.listTable);
    //         //上传完毕后把当前tab页激活(当前展示数据tab变成蓝色)
    //         //element-ui tab的name属性只接收string类型
    //         //v-model="fileNameListValue"意思是当前激活的tab的name属性为fileNameListValue
    //         this.fileNameListValue = this.allFileData.length.toString();
    //       }
    //     } catch (e) {
    //       this.$message.warning("文件类型不正确！");
    //     }
    //   };
    //   fileReader.readAsBinaryString(_file);
    // },
    //原uploadFile方法结束

    //折叠面板
    handleChange(val) {
      console.log(val);
    },
    handleSearchButtonClick(inputVal) {
      console.log("接收到子组件searchValue的变更", inputVal);
      this.inputVal = inputVal;
      this.search();
    },
    // aside 的全文搜索/ID搜索
    handleRadioSelectChange(val) {
      console.log("父组件---radio变更", val);
      this.selectRadio = val;
    },
    //header的menu
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    // refresh-file 的全选按钮
    handleRefreshCheckAllChange(val) {
      console.log("handleCheckAllChange--val", val);
      const all = this.refreshFileNameList.map((item, index) => {
        return index;
      });
      this.selectedRefreshFile = val ? all : [];
      console.log("this.selectedRefreshFile---", this.selectedRefreshFile);
      // this.selectedFile.push(this.selectedRefreshFile);
      // console.log("this.selectedFile---", this.selectedFile);
      this.isRefreshIndeterminate = false;
    },
    // refresh-file 的文件单选按钮
    handleSelectedRefreshFile(val) {
      console.log("val", val);
      let checkedRefreshCount = val.length;
      this.checkRefreshAll =
        checkedRefreshCount === this.selectedRefreshFile.length;
      this.isRefreshIndeterminate =
        checkedRefreshCount > 0 &&
        checkedRefreshCount < this.refreshFileNameList.length;
      console.log("this.isRefreshIndeterminate", this.isRefreshIndeterminate);
      //若不选中，清空选择框
      if (val.length === 0) {
        this.isRefreshIndeterminate = false;
        this.checkRefreshAll = false;
        this.selectedRefreshFile = [];
      }
    },

    // Brilliance Air 的全选按钮
    handleBrillianceCheckAllChange(val) {
      console.log("handleCheckAllChange--val", val);
      const all = this.brillianceFileNameList.map((item, index) => {
        return index;
      });
      this.selectedBrillianceFile = val ? all : [];
      // this.selectedFile.push(this.selectedBrillianceFile);
      console.log(
        "this.selectedBrillianceFile---2-",
        this.selectedBrillianceFile
      );
      // console.log("this.selectedFile---2-", this.selectedFile);
      this.isBrillianceIndeterminate = false;
    },
    // Brilliance Air 的文件单选按钮
    handleSelectedBrillianceFile(val) {
      console.log("val", val);
      let checkedBrillianceCount = val.length;
      this.checkBrillianceAll =
        checkedBrillianceCount === this.selectedBrillianceFile.length;
      this.isBrillianceIndeterminate =
        checkedBrillianceCount > 0 &&
        checkedBrillianceCount < this.brillianceFileNameList.length;
      console.log(
        "this.isBrillianceIndeterminate",
        this.isBrillianceIndeterminate
      );
      //若不选中，清空选择框
      if (val.length === 0) {
        this.isBrillianceIndeterminate = false;
        this.checkBrillianceAll = false;
        this.selectedBrillianceFile = [];
      }
    },

    //点击左侧文件列表某个文件名时切换右侧展示内容
    handleClickFileName(index) {
      console.log("当前点击的文件index", index);
      this.listTable = this.allFileData[index];
      //同时更改keyList
      this.keyList = [];
      if (this.listTable.length > 0) {
        for (let k in this.listTable[0]) {
          this.keyList.push(k);
        }
      }
      //同时切换右侧tab栏激活的标签
      this.fileNameListValue = index + 2 + "";
    },
    //解析excel
    async uploadFile(params) {
      console.log("上传文件触发");
      this.listTable = [];
      const _file = params.file;
      if (_file.name.toLowerCase().includes("refresh")) {
        this.refreshFileNameList.push(_file.name);
        this.fileNameList.push(_file.name);
      } else if (_file.name.toLowerCase().includes("brilliance")) {
        this.brillianceFileNameList.push(_file.name);
        this.fileNameList.push(_file.name);
      }
      const fileReader = new FileReader();
      fileReader.onload = ev => {
        try {
          const data = ev.target.result;
          console.log("ev.target", ev.target);
          const workbook = XLSX.read(data, {
            type: "binary"
          });
          for (let sheet in workbook.Sheets) {
            //循环读取每个文件
            const sheetArray = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
            //若当前sheet没有数据,则continue
            if (sheetArray.length == 0) {
              continue;
            }
            console.log("读取文件");
            console.log(sheetArray);
            // this.listTable.push(sheetArray);
            //暂时的所有上传文件内容，用于在allFileData里边遍历，找到被选中的文件，如何传给临时内容搜索盒子
            this.allFileData.push(sheetArray);
            console.log("sheetArray", sheetArray);
            for (let item in sheetArray) {
              // console.log('item', item)
              let rowTable = {};
              //这里的rowTable的属性名注意要与上面表格的prop一致
              //sheetArray的属性名与上传的表格的列名一致
              for (let key in sheetArray[item]) {
                rowTable[key] = sheetArray[item][key];
              }
              // rowTable.id = sheetArray[item].id
              // rowTable.Headline = sheetArray[item].Headline
              this.listTable.push(rowTable);
            }
            this.keyList = [];
            if (this.listTable.length > 0) {
              for (let k in this.listTable[0]) {
                this.keyList.push(k);
              }
            }
            console.log("this.listTable", this.listTable);
            //上传完毕后把当前tab页激活(当前展示数据tab变成蓝色)
            //element-ui tab的name属性只接收string类型
            //v-model="fileNameListValue"意思是当前激活的tab的name属性为fileNameListValue
            this.fileNameListValue = this.allFileData.length.toString();
          }
        } catch (e) {
          this.$message.warning("文件类型不正确！");
        }
      };
      fileReader.readAsBinaryString(_file);
    },

    //上传1个以上文件时弹窗提示错误
    exceed: function() {
      this.$message.error("最多只能上传50个xls文件");
    },
    search() {
      // Search_List 存放搜索成功返回的数据
      const Search_List = [];
      let res1 = this.inputVal;
      const res = res1.replace(/\s/gi, "");
      console.log("res", res);
      // 被选中文件形成的暂时的文件内容
      let tempSearchBox = [];
      //源代码
      // for (let k in this.selectedFile) {
      //   // 改成数组形式
      //   tempSearchBox = [
      //     ...tempSearchBox,
      //     ...this.allFileData[this.selectedFile[k]]
      //   ];
      //   // console.log('this.selectedFile[k]',this.selectedFile[k],k);
      // }
      //源代码
      for (let k in this.selectedRefreshFile) {
        // 改成数组形式
        tempSearchBox = [
          ...tempSearchBox,
          ...this.allFileData[this.selectedRefreshFile[k]]
        ];
      }
      for (let k in this.selectedBrillianceFile) {
        // 改成数组形式
        tempSearchBox = [
          ...tempSearchBox,
          ...this.allFileData[this.selectedBrillianceFile[k]]
        ];
        // console.log('this.selectedFile[k]',this.selectedFile[k],k);
      }

      // searchArr 待被搜索的文件内容
      let searchArr = tempSearchBox;
      if (this.selectRadio == 1) {
        //search框输入的搜索内容--全文搜索

        //------修改开始

        // 我的想法是新创建一个临时的temKeyList，从searchArr获得数据的title行，存为数组。然后遍历，把title给e，但是为啥显示不行，总是说undefine啥的。也尝试使用过keyList。
        //这个方法也是对的 就是e[this.keyList[i]]才是键值对的值，不能用e.this.keyList[i]，这个是直接去e里边找键为this.keyList[i]，就算重新赋值也不行
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
        //------修改结束

        //search框输入的搜索内容--全文搜索
        // ------原始代码开始----
        console.log("searchArr============", searchArr);
        // searchArr.forEach(obj => {

        //   //绑定的table prop
        //   这个方法更加简单 obj[key]是遍历对象的值，obj是键
        //   for(let key in obj){
        //     console.log('obj[key]-----',obj[key]);
        //     console.log('res-----',res);
        //     if(obj[key].toString().includes(res)){
        //       Search_List.push(obj);
        //       break;
        //     }
        //   }
        // });
        // ----原始代码结束----

        //Search_List 搜索成功返回的内容，给listTable展示
        this.listTable = Search_List;
      } else if (this.selectRadio == 2) {
        searchArr.forEach(e => {
          //绑定的table prop
          let id = e.id;
          console.log("id", id);
          console.log("typeof(id)", typeof id);
          if (id.toString().includes(res)) {
            if (Search_List.indexOf(e) == "-1") {
              Search_List.push(e);
            }
          }
        });
        this.listTable = Search_List;
        console.log("搜索结果", this.listTable);
        this.currentPage = 1;
      } else {
        console.log("this.selectRadio", this.selectRadio);
      }
    },

    //实现tabs标签页
    removeTab(targetName) {
      if (this.fileNameList.length <= 1) {
        return false;
      }
      console.log("targetName", targetName); //undefined
      let tabs = this.fileNameList;
      console.log("tabs", tabs); //上传的列表名
      let activeName = this.fileNameListValue;
      console.log("activeName", activeName, this.fileNameListValue); // 1 1
      if (activeName === targetName) {
        console.log(true);
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      this.fileNameListValue = activeName;
      this.fileNameList = tabs.filter(tab => tab.name !== targetName);
    },
    clickTab(targetName) {
      //切换tab页时更新展示数据
      console.log("tabsIndex", targetName.index);
      const tabIndex = targetName.index;
      this.listTable = this.allFileData[tabIndex];
      //同步更改keyList
      this.keyList = [];
      if (this.listTable.length > 0) {
        for (let k in this.listTable[0]) {
          this.keyList.push(k);
        }
      }
      console.log("fileNameListValue", this.fileNameListValue);
    },
    //实现 Main 按钮
    handleMainButton(val) {
      console.log("handleMainButton--val", val);
      var mainKeyList = [];
      mainKeyList = [
        "id",
        "Products",
        "Headline",
        "SubmitDescription",
        "VersionFoundIn",
        "Score",
        "Probability_Score",
        "Impact_Score",
        "Hazard",
        "InstallBase",
        "CRB_MinutesActions",
        "ReferenceID",
        "Subsystem",
        "RationaleForChange",
        "ResolutionDescription",
        "VersionsFixedIn",
        "CFR_ID",
        "AssociatedDefects",
        "Status",
        "Workaround"
      ];
      this.keyList = [];
      for (let k in mainKeyList) {
        this.keyList.push(mainKeyList[k]);
      }
    },

    //实现表格分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      console.log(
        "当前页数据",
        this.listTable.slice(
          (this.currentPage - 1) * this.pageSize,
          this.currentPage * this.pageSize
        )
      );
    },
    spliceFileName(fileName) {
      let name = fileName;
      if (fileName.length > 22) {
        fileName = fileName.substring(0, 20) + "...";
      }
      return fileName;
    },
    //截取字符串 包含中文处理,一个中文字符等于2个长度
    stringIntercept(str, len, hasDot) {
      var newLength = 0;
      var newStr = "";
      var chineseRegex = /[^\x00-\xff]/g;
      var singleChar = "";
      var strLength = str.replace(chineseRegex, "**").length;
      for (var i = 0; i < strLength; i++) {
        singleChar = str.charAt(i).toString();
        if (singleChar.match(chineseRegex) != null) {
          newLength += 2;
        } else {
          newLength++;
        }
        if (newLength > len) {
          break;
        }
        newStr += singleChar;
      }

      if (hasDot && strLength > len) {
        newStr += hasDot;
      }
      return newStr + "...";
    }
  }
};
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
  height: 100px;
}

.full-upload-file-box {
  margin-top: 10px;
  font-size: 14px;
  width: 100%;
}
.full-upload-file-box .refresh-file {
  position: relative;
  width: 98%;
  text-align-last: left;
  border: 1px solid rgb(202, 205, 210);
  background-color: #e9eef3;
  font-size: 14px;
  /* margin-top: 10px;
  margin-bottom: 10px; */
  padding: 2px 2px 2px 2px;
}
.full-upload-file-box /deep/ .el-collapse-item__wrap {
  padding-right: 2px;
}
.full-upload-file-box /deep/ .el-collapse-item__content {
  padding-bottom: 5px;
}
.full-upload-file-box /deep/ .el-collapse-item__header {
  display: initial;
  background-color: transparent;
}
.full-upload-file-box .file-check-all {
  left: 60%;
  position: absolute;
}
.upload-filename-item /deep/ .el-checkbox__label {
  display: none;
  padding-left: 2px;
}

.upload-filename-list {
  height: 160px;
  overflow: auto;
}
.full-upload-file-box .upload-filename-item {
  text-align: left;
  border: 1px solid rgb(228, 231, 237);
  margin-top: 2px;
  padding: 1px 1px 1px 1px;
  font-size: 12px;
  border-right: 1px;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid rgb(202, 205, 210);
  background-color: #b3c0d1;
  font-size: 14px;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 5px 5px 5px 5px;
}
.product-defect .product-main .el-button--primary {
  padding: 5px 10px 5px 10px;
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

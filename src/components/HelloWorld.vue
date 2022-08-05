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
      <div ref="mainDiv" class="mainDivName">
        <el-container>
          <el-aside width="20%">
            <!-- 搜索框 -->
            <SearchFileBox
              @searchButtonClick="handleSearchButtonClick"
              @radioSelectChange="handleRadioSelectChange"
            ></SearchFileBox>

            <!--  从数据库获取表  -->
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                下拉菜单
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="sheet3">sheet3</el-dropdown-item>
                <el-dropdown-item command="sheet2">sheet2</el-dropdown-item>
                <el-dropdown-item command="sheet1">sheet1</el-dropdown-item>
                <el-dropdown-item command="refresh_no_solution" disabled>refresh_no_solution</el-dropdown-item>
                <el-dropdown-item command="禁掉" disabled>此选项被禁</el-dropdown-item>
                <el-dropdown-item command="refresh1_no_solution" divided>refresh1_no_solution</el-dropdown-item>
                <el-dropdown-item command="refresh2_no_solution" divided>refresh2_no_solution</el-dropdown-item>
                <el-dropdown-item command="refresh3_solution" divided>refresh3_solution</el-dropdown-item>
                <el-dropdown-item command="refresh4_solution" divided>refresh4_solution</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <!-- 当前上传文件列表 -->
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
                            @click="handleClickFileName(index,'refresh')"
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
                            @click="handleClickFileName(index,'brilliance')"
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
                <el-tabs v-model="fileNameListValue" type="card" @tab-click="clickTab">
                  <el-tab-pane label="search result" :key="-1" name="0"></el-tab-pane>
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
                <el-tooltip
                  class="item"
                  effect="light"
                  content="仅展示重要的20列内容"
                  placement="bottom-end"
                >
                  <el-button @click="handleMainButton" class="product-main" type="primary">Main</el-button>
                </el-tooltip>
              </div>
              <!--  上传的excel表格预览  -->
              <data-preview
                :dataSet="listTable.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
                :keyList="keyList"
                :loading="loading"
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
            <el-footer>
              <button @click="getRefresh1()">获取refresh1_no_s表数据</button>
              <button @click="getRefresh3()">获取refresh3_s表数据</button>
              <button @click="getRefresh2()">获取refresh2_n表数据</button>
              <button @click="getRefresh4()">获取refresh4_s表数据</button>

              <button @click="getsheet0()">refresh_no_s表数据</button>
              <button @click="getsheet1()">sheet1表数据</button>
              <button @click="getsheet2()">sheet2表数据</button>
              <button @click="getsheet3()">sheet3表数据</button>
            </el-footer>
          </el-container>
        </el-container>
      </div>
    </el-container>
  </div>
</template>

<script>
import XLSX from "xlsx";
import dataPreview from "./dataPreview.vue";
import ClickUpload from "./clickUpload.vue";
import SearchFileBox from "./searchFileBox.vue";
import axios from "axios";
export default {
  name: "HelloWorld",
  components: {
    dataPreview,
    ClickUpload,
    SearchFileBox
  },
  data() {
    return {
      option: [],
      loading: false,
      fileNameList: [],
      refreshFileNameList: [],
      brillianceFileNameList: [],
      // Header的menu
      activeIndex: "1",
      //Aside的请输入搜索的内容
      inputVal: "",
      activeNames: ["1", "2"],
      //Recent file的全选按钮
      checkRefreshAll: false,
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
      // currentIndex: 1,
      tabIndex: 1,
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
  // },
  methods: {
    // 实现下拉菜单，选择数据库的表
    handleCommand(command) {
      // this.$message("click on item " + command);
      axios
        .get("http://127.0.0.1/" + command)
        .then(res => {
          console.log(res.data);
          const _file = command;
          let refresh1Data = res.data;
          this.listTable = [];
          this.keyList = [];
          this.refreshFileNameList.push(_file);
          this.fileNameList.push(_file);
          this.allFileData.push(refresh1Data);
          this.listTable = refresh1Data;
          for (let item in refresh1Data) {
            let row1Table = {};
            for (let key in refresh1Data[item]) {
              row1Table[key] = refresh1Data[item][key];
            }
          }
          this.keyList = [];
          for (let item in refresh1Data[0]) {
            this.keyList.push(item);
          }
          this.fileNameListValue = this.allFileData.length.toString();
        })
        .catch(err => {
          console.log("获取数据失败" + err);
        });
    },
    // getRefresh1() {
    //   axios
    //     .get("http://127.0.0.1/refresh1_no_solution")
    //     .then(res => {
    //       console.log(res.data);

    //       const _file = "refresh1_no_solution";
    //       let refresh1Data = res.data;
    //       this.listTable = [];
    //       this.keyList = [];
    //       this.refreshFileNameList.push(_file);
    //       this.fileNameList.push(_file);
    //       this.allFileData.push(refresh1Data);
    //       this.listTable = refresh1Data;
    //       for (let item in refresh1Data) {
    //         let row1Table = {};
    //         for (let key in refresh1Data[item]) {
    //           row1Table[key] = refresh1Data[item][key];
    //         }
    //       }
    //       this.keyList = [];
    //       for (let item in refresh1Data[0]) {
    //         this.keyList.push(item);
    //       }
    //       this.fileNameListValue = this.allFileData.length.toString();
    //     })
    //     .catch(err => {
    //       console.log("获取数据失败" + err);
    //     });
    // },
    //折叠面板
    handleChange(val) {
      console.log("handleChange-val--", val);
    },
    handleSearchButtonClick(inputVal) {
      console.log("接收到子组件searchValue的变更", inputVal);
      this.inputVal = inputVal;
      // this.loading = true;
      this.search();
      // this.loading = false;
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
      this.isRefreshIndeterminate = false;
    },
    // refresh-file 的文件单选按钮
    handleSelectedRefreshFile(val) {
      console.log("handleSelectedRefreshFile-val-", val);
      let checkedRefreshCount = val.length;
      this.checkRefreshAll =
        checkedRefreshCount === this.selectedRefreshFile.length;
      this.isRefreshIndeterminate =
        checkedRefreshCount > 0 &&
        checkedRefreshCount < this.refreshFileNameList.length;
      //若不选中，清空选择框
      if (val.length === 0) {
        this.isRefreshIndeterminate = false;
        this.checkRefreshAll = false;
        // this.selectedRefreshFile = [];
      }
    },

    // Brilliance Air 的全选按钮
    handleBrillianceCheckAllChange(val) {
      console.log("handleCheckAllChange--val", val);
      const all = this.brillianceFileNameList.map((item, index) => {
        return index;
      });
      this.selectedBrillianceFile = val ? all : [];
      console.log(
        "this.selectedBrillianceFile---2-",
        this.selectedBrillianceFile
      );
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
        // this.selectedBrillianceFile = [];
      }
    },

    //点击左侧文件列表某个文件名时切换右侧展示内容
    handleClickFileName(index, folderName) {
      console.log("当前点击的文件index", index);
      console.log("当前点击的文件所属文件夹", folderName);
      this.loading = true;
      let tempFileName = "";
      let allFileIndex = 0;
      if (folderName === "refresh") {
        tempFileName = this.refreshFileNameList[index];
      } else {
        tempFileName = this.brillianceFileNameList[index];
      }
      this.fileNameList.find((fileName, index) => {
        if (fileName === tempFileName) {
          allFileIndex = index;
        }
      });
      this.listTable = this.allFileData[allFileIndex];
      this.loading = false;
      console.log("this.listTable", this.listTable);
      //同时更改keyList
      this.keyList = [];
      if (this.listTable.length > 0) {
        for (let k in this.listTable[0]) {
          this.keyList.push(k);
        }
      }
      //同时切换右侧tab栏激活的标签
      this.fileNameListValue = allFileIndex + 1 + "";
    },
    //解析excel
    async uploadFile(params) {
      console.log("上传文件触发");
      this.loading = true;
      this.listTable = [];
      this.keyList = [];
      const _file = params.file;
      console.log("file--", _file);
      if (
        this.refreshFileNameList.includes(_file.name) ||
        this.brillianceFileNameList.includes(_file.name)
      ) {
        alert("文件名重复！请重新上传");
        return true;
      }
      if (_file.name.toLowerCase().includes("refresh")) {
        this.refreshFileNameList.push(_file.name);
        this.fileNameList.push(_file.name);
      } else if (_file.name.toLowerCase().includes("brilliance")) {
        this.brillianceFileNameList.push(_file.name);
        this.fileNameList.push(_file.name);
      } else {
        alert(
          "上传文件名必须包含 refresh / brilliance, 请重新命名文件名并上传。"
        );
        return true;
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
            // console.log("sheetArray--", sheetArray);
            //暂时的所有上传文件内容，用于在allFileData里边遍历，找到被选中的文件，如何传给临时内容搜索盒子
            this.allFileData.push(sheetArray);
            //初始时，仅展示最近上传的一个文件

            // ---begin-replace-------------------------------
            const renderList = async () => {
              console.time("列表时间");
              const list = sheetArray;
              console.log("list", list);
              const total = list.length;
              console.log("total", total);
              const page = 0;
              const limit = 200;
              const totalPage = Math.ceil(total / limit);
              console.log("totalPage", totalPage);

              const render = page => {
                if (page >= totalPage) return;
                // 使用requestAnimationFrame代替setTimeout
                requestAnimationFrame(() => {
                  for (let i = page * limit; i < page * limit + limit; i++) {
                    let renderTable = [];
                    for (let key in list[i]) {
                      renderTable[key] = list[i][key];
                    }
                    this.listTable.push(renderTable);
                  }
                  render(page + 1);
                });
              };
              render(page);
              console.timeEnd("列表时间");
            };
            renderList();

            // this.listTable = sheetArray;
            // ---end-replace-------------------------------

            this.loading = false;
            // this.allFileData=[...this.allFileData,...sheetArray]

            for (let item in sheetArray) {
              // console.log("item=",item);
              let rowTable = {};
              //这里的rowTable的属性名注意要与上面表格的prop一致
              //sheetArray的属性名与上传的表格的列名一致
              for (let key in sheetArray[item]) {
                rowTable[key] = sheetArray[item][key];
              }
              // this.listTable.push(rowTable);//如果增加这个，就会上传时候展示一次性上传的所有文件
            }

            this.keyList = [];

            //上传时候，只需要展示最近的一个文件内容，对应tabs标签选中即可。
            for (let item in sheetArray[0]) {
              this.keyList.push(item);
            }
            // this.listTable = sheetArray
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
      // this.loading = true;
      const Search_List = [];
      this.keyList = [];
      let res1 = this.inputVal;
      const res = res1.replace(/\s/gi, "");
      console.log("res--", res);
      // 被选中文件形成的暂时的文件内容
      let tempSearchBox = [];
      //解决文件列表名和tabs标签页不对应。把selectedRefreshFile里的值在整个allFileData里边找到对应下标，即可以正确对应

      for (let k in this.selectedRefreshFile) {
        // 改成数组形式
        this.fileNameList.find((item, index) => {
          if (item === this.refreshFileNameList[this.selectedRefreshFile[k]]) {
            tempSearchBox = [...tempSearchBox, ...this.allFileData[index]];
          }
        });
      }
      for (let k in this.selectedBrillianceFile) {
        // 改成数组形式
        this.fileNameList.find((item, index) => {
          if (
            item === this.brillianceFileNameList[this.selectedBrillianceFile[k]]
          ) {
            tempSearchBox = [...tempSearchBox, ...this.allFileData[index]];
          }
        });
      }

      // searchArr 待被搜索的文件内容
      let searchArr = tempSearchBox;
      if (searchArr.length == 0) {
        alert("请上传并勾选需要搜索的文件，再进行搜索！");
      } else {
        this.keyList = [];
        for (var j = 0; j < searchArr.length; j++) {
          for (let item in searchArr[j]) {
            if (!this.keyList.toString().includes(item)) {
              this.keyList.push(item);
            }
          }
        }
        if (this.selectRadio == 1) {
          // search框输入的搜索内容--全文搜索
          console.log("开始全文搜索--");

          searchArr.forEach(obj => {
            for (let key in obj) {
              if (obj[key].toString().includes(res)) {
                if (Search_List.indexOf(obj) == "-1") {
                  Search_List.push(obj);
                  break;
                }
              }
            }
          });
          //Search_List 搜索成功返回的内容，给listTable展示
          this.listTable = Search_List;
          // this.loading = false;
        } else if (this.selectRadio == 2) {
          console.log("开始搜索id--");
          searchArr.forEach(e => {
            //绑定的table prop
            let id = e.id;
            if (id.toString().includes(res)) {
              if (Search_List.indexOf(e) == "-1") {
                Search_List.push(e);
              }
            }
          });
          this.listTable = Search_List;
          // this.loading = false;
          this.currentPage = 1;
        } else {
          alert("搜索错误。");
          console.log("this.selectRadio--", this.selectRadio);
        }

        this.fileNameListValue = "0";
        // this.loading = false;
        console.log("搜索结束。");
      }
    },
    clickTab(targetName) {
      //切换tab页时更新展示数据
      this.loading = true;
      const tabIndex = parseInt(targetName.index);
      console.log("tabsIndex--", tabIndex);
      if (tabIndex === 0) {
        this.listTable = [];
        this.loading = false;
        this.keyList = [];
        return true;
      }
      this.listTable = this.allFileData[tabIndex - 1];
      this.loading = false;
      //同步更改keyList
      this.keyList = [];
      if (this.listTable.length > 0) {
        for (let k in this.listTable[0]) {
          this.keyList.push(k);
        }
      }
      console.log("fileNameListValue--", this.fileNameListValue);
    },
    //实现 Main 按钮
    handleMainButton(val) {
      this.loading = true;
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
      // 解决关键列与表格title的大小写识别问题
      for (let k in this.keyList) {
        for (let i = 0; i < mainKeyList.length; i++) {
          if (mainKeyList[i].toLowerCase() === this.keyList[k].toLowerCase()) {
            mainKeyList[i] = this.keyList[k];
          }
        }
      }
      this.keyList = [];
      for (let k in mainKeyList) {
        this.keyList.push(mainKeyList[k]);
      }
      this.loading = false;
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
  height: 30px !important;
}
.mainDivName {
  height: 0;
  min-height: 600px;
}
.el-header /deep/ .el-menu--horizontal > .el-submenu .el-submenu__title {
  height: 30px;
  line-height: 30px;
}
.el-header /deep/ .el-menu--horizontal {
  height: 30px;
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
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 2px 2px 2px 2px;
  line-height: 30px;
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
  line-height: 30px;
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
  height: 200px;
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
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
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
.file-tabs-list /deep/ .el-tabs__nav-wrap.is-scrollable {
  padding: 0 15px;
}
.file-tabs-list /deep/ .el-tabs__item {
  height: 30px;
  line-height: 35px;
  white-space: nowrap;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 5px;
  font-size: 12px;
}
.el-main /deep/ .el-tabs__header {
  margin: 0 0 1px;
}
.file-tabs-list /deep/ .el-tabs__item:nth-child(2) {
  padding-left: 2px !important;
}
.file-tabs-list /deep/ .el-icon-close {
  vertical-align: inherit;
}
.file-tabs-list /deep/.file-tabs-list {
  margin: 0 0 5px 0;
}
.file-tabs-list /deep/ .el-button {
  padding: 6px 8px;
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
  padding: 2px 2px 2px 2px;
  border-radius: 2px;
}
.product-defect .product-main .el-button--primary {
  padding: 5px 10px 5px 10px;
}
.el-main /deep/ .el-table__body-wrapper {
  width: 99.7%;
  height: 89% !important;
  border: 1px solid rgb(202, 205, 210);
}

.el-main .el-pagination {
  padding: 5px 5px;
}
.el-footer {
  background-color: #b3c0d1;
  text-align: center;
  height: 30px !important;
  line-height: 30px;
  margin-left: 5px;
}
body > .el-container {
  margin-bottom: 40px;
}
</style>

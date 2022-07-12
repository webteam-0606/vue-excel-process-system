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
        <el-aside width="30%">
          <div class="full-search-box">
            <div class="input-search-box">
              <el-input placeholder="请输入要搜索的内容" v-model="inputVal" clearable></el-input>
              <el-button
                class="search-button"
                type="primary"
                icon="el-icon-search"
                @click="search()"
              >Search</el-button>
            </div>
            <div class="search-select">
              <el-radio-group v-model="selectRadio" @change="handleRadioSelectChange">
                <el-radio label="1">Full Text</el-radio>
                <el-radio label="2">By ID</el-radio>
              </el-radio-group>

              <!-- <input type="radio" name="status" id="status" value="0" />
              Full Text
              <input type="radio" name="status" id="status" value="1" />
              By ID-->
            </div>
          </div>
          <div class="full-upload-file-box">
            <div class="recent-file">
              Recent Flies
              <el-checkbox
                class="file-check-all"
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleCheckAllChange"
              >全选</el-checkbox>
            </div>

            <div class="upload-filename-list">
              <div class="upload-filename-item" v-for="(filename,index) in fileNameList">
                <div class="upload-filename">
                  <i class="el-icon-document"></i>
                  {{ filename }}
                </div>

                <el-switch
                  class="file-switch"
                  v-model="activedFile[index]"
                  active-color="#13ce66"
                  inactive-color="#e6e6e6"
                  @change="handleSwitchFile"
                ></el-switch>
              </div>
            </div>
          </div>
          <!--  excel表格上传  -->
          <div class="full-upload-files">
            <div class="upload-file">Upload Flies</div>
            <div>
              <el-upload
                class="upload-demo"
                drag
                action="https://jsonplaceholder.typicode.com/posts/"
                multiple
                accept=".xlsx"
                :on-exceed="exceed"
                :limit="50"
                :on-remove="remove"
                :http-request="uploadFile"
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  将文件拖到此处，或
                  <em>点击上传</em>
                </div>
                <div class="el-upload__tip" slot="tip">1次只能上传1个xls文件，最多上传50个</div>
              </el-upload>
            </div>
          </div>
        </el-aside>
        <el-container>
          <el-main>
            <div class="product-defect">Product Defect :</div>
            <!--  上传的excel表格预览  -->
            <data-preview
              :dataSet="listTable.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
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


<script src="jQuery.js"></script>
<script>
import XLSX from "xlsx";
import dataPreview from "./dataPreview.vue";
export default {
  name: "HelloWorld",
  components: {
    dataPreview
  },
  data() {
    return {
      fileNameList: [],
      // Header的menu
      activeIndex: "1",
      //Aside的请输入搜索的内容
      inputVal: "",
      //Recent file的全选按钮
      checkAll: false,
      isIndeterminate: true,
      // search框搜索出来的值
      showTable: [],
      listTable: [], // tableData: [],
      //选择全文搜索/ID搜索
      radio: "1",
      //目前文件的选择按钮
      activedFile: [],
      //分页
      currentPage: 1,
      pageSize: 10,
      selectRadio: 0
    };
  },

  //监听search框输入的搜索内容
  watch: {
    //监听：如果为空，显示所有数据
    inputVal(item1) {
      if (item1 == "") {
        this.listTable = this.showTable;
      }
    }
  },
  //页面渲染时，显示所有的数据
  mounted() {
    this.showTable = this.listTable;
  },
  methods: {
    //header的menu
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    // Recent File 的全选按钮
    handleCheckAllChange(val) {
      this.checkedCities = val ? this.fileNameList : [];
      this.isIndeterminate = false;
    },

    //解析excel
    async uploadFile(params) {
      const _file = params.file;
      this.fileNameList.push(_file.name);
      console.log("_file", _file);
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
            //若当前sheet没有数据，则continue
            if (sheetArray.length == 0) {
              continue;
            }
            console.log("读取文件");
            console.log(sheetArray);
            for (let item in sheetArray) {
              let rowTable = {};
              //这里的rowTable的属性名注意要与上面表格的prop一致
              //sheetArray的属性名与上传的表格的列名一致
              rowTable.id = sheetArray[item].id;
              rowTable.Headline = sheetArray[item].Headline;
              this.listTable.push(rowTable);
            }
          }
        } catch (e) {
          this.$message.warning("文件类型不正确！");
        }
      };
      fileReader.readAsBinaryString(_file);
    },
    //上传1个以上文件时弹窗提示错误
    exceed: function() {
      this.$message.error("最多只能上传2个xls文件");
    },
    //删除文件
    remove() {
      this.listTable = [];
    },
    search() {
      const Search_List = [];
      let res1 = this.inputVal;
      const res = res1.replace(/\s/gi, "");
      console.log("res", res);
      let searchArr = this.showTable;
      console.log("searchArr", searchArr);
      // const myValue = $("input[type='radio']:checked").val();
      console.log("selectRadio", this.selectRadio);
      if (this.selectRadio == 1) {
        //search框输入的搜索内容--全文搜索
        searchArr.forEach(e => {
          //绑定的table prop
          let id = e.id;
          let Headline = e.Headline;
          if (id.toString().includes(res)) {
            if (Search_List.indexOf(e) == "-1") {
              Search_List.push(e);
            }
          }
          if (Headline.toString().includes(res)) {
            if (Search_List.indexOf(e) == "-1") {
              Search_List.push(e);
            }
          }
        });
        this.listTable = Search_List;
      } else if (this.selectRadio == 2) {
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
        console.log("搜索结果", this.listTable);
        this.currentPage = 1;
      } else {
        console.log("this.selectRadio", this.selectRadio);
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
    handleRadioSelectChange(val) {
      console.log("radio变更", val);
    },
    handleSwitchFile(val) {}
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

.el-footer {
  background-color: #b3c0d1;
  text-align: center;
  line-height: 40px;
}

.el-header {
  /* background-color: #b3c0d1; */
  text-align: center;
  line-height: 20px;
  padding: 0;
  height: 10px;
}
/* .el-submenu /deep/ .el-submenu__title {
  background-color: #fff;
}
.el-header /deep/ .el-header[data-v-469af010] .li .el-submenu .el-submenu__title {
  background-color: #fff !important;
} */

.el-aside {
  /* background-color: #d3dce6; */
  color: #333;
  text-align: center;
  /* line-height: 200px; */
  width: 30%;
  overflow: hidden;
}
.el-aside .full-search-box {
  border: 1px solid #909399;
  margin-top: 5px;
}
.el-aside .input-search-box .el-input {
  width: 70%;
  padding-top: 5px;
}
.el-aside .input-search-box .el-button {
  font-size: 12px;
}
.input-search-box /deep/ .el-input__inner {
  padding-right: 2px;
}
.full-search-box .input-search-box .search-button {
  padding-left: 5px;
}
.full-search-box .search-select {
  text-align: left;
  padding: 5px 5px 5px 5px;
}
.el-aside .UploadFileNameList {
  /* padding-top: 10px;
  padding-bottom: 10px; */
  padding: 10px 0px 10px 0px;
}
.el-aside /deep/ .el-input--prefix .el-input__inner {
  padding-left: 15px;
}
.full-upload-file-box .full-upload-file-box {
  margin-top: 10px;
  font-size: 14px;
}
.full-upload-file-box .recent-file {
  width: 100%;
  text-align-last: left;
  border: 1px solid rgb(202, 205, 210);
  background-color: #e9eef3;
  font-size: 14px;
  margin-top: 10px;
  margin-bottom: 10px;
  /* padding-left: 5px;
  padding-top: 5px;
  padding-bottom: 5px; */
  padding: 5px 5px 5px 5px;
}
.full-upload-file-box .file-check-all {
  text-align: right;
}
.full-upload-file-box {
  width: 100%;
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
.full-upload-file-box .file-switch {
  text-align: right;
}
.upload-filename {
  width: 80%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.full-upload-files {
  margin-top: 20px;
}
.full-upload-files .upload-file {
  width: 100%;
  text-align-last: left;
  border: 1px solid rgb(202, 205, 210);
  background-color: #e9eef3;
  font-size: 14px;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 5px 5px 5px 5px;
}
.upload-demo /deep/ .el-upload-dragger {
  width: auto;
  height: auto;
}
/* .upload-demo {
  padding-top: 10px;
} */

.el-main {
  /* background-color: #e9eef3; */
  color: #333;
  text-align: center;
  border: 1px solid rgb(202, 205, 210);
  margin-left: 5px;
  /* line-height: 160px; */
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
.preview-excel /deep/ .el-table__body {
  width: 100%;
}
.el-main .el-pagination {
  padding: 5px 5px;
}

body > .el-container {
  margin-bottom: 40px;
}
</style>

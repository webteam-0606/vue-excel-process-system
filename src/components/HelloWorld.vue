<template>


  <div>
    <el-container>
      <el-header>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" background-color="#E4E7ED"
          text-color="#black" @select="handleSelect">
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
          <div>
            <el-input placeholder="请输入内容" v-model="input1">
              <i slot="prefix" class="el-input-search"></i>
            </el-input>
            <el-radio-group v-model="SearchContent">
              <el-radio label="FullText">Full Text</el-radio>
              <el-radio label="ById">By ID</el-radio>
            </el-radio-group>
          </div>
          <!--  excel表格上传  -->
          <div>
            <el-upload class="upload-demo" drag action="https://jsonplaceholder.typicode.com/posts/" multiple
              accept=".xlsx" :on-exceed="exceed" :limit="2" :on-remove="remove" :http-request="uploadFile">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传-</em>
              </div>
              <div class="el-upload__tip" slot="tip">1次只能上传1个xls文件，最多上传2个</div>
            </el-upload>
          </div>
        </el-aside>
        <el-container>
          <el-main>Main
            <!--  上传的excel表格预览  -->
            <div class="preview-excel">
              <el-table class="listTable_ele" :data="listTable" stripe height="500px" style="width:100%">
                <el-table-column prop="id" label="id" width="200" align="center"></el-table-column>
                <el-table-column prop="Headline" label="Headline" width="200" align="center"></el-table-column>
              </el-table>
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
export default {
  name: 'HelloWorld',
  data() {
    return {
      listTable: [],
      // Header的menu
      activeIndex: '1',
      SearchContent: '',
      //Aside的search框内容
      input1: '',
    }
  },
  methods: {
    //header的menu
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    //解析excel
    async uploadFile(params) {
      const _file = params.file;
      const fileReader = new FileReader();
      fileReader.onload = (ev) => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: 'binary'
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
              this.listTable.push(rowTable)
            }
          }
        } catch (e) {
          this.$message.warning('文件类型不正确！');
        }
      };
      fileReader.readAsBinaryString(_file);
    },
    //上传1个以上文件时弹窗提示错误
    exceed: function () {
      this.$message.error("最多只能上传1个xls文件");
    },
    //删除文件
    remove() {
      this.listTable = [];
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

.el-footer {
  background-color: #B3C0D1;
  text-align: center;
  line-height: 40px;
}

.el-header {
  background-color: #B3C0D1;
  text-align: center;
  line-height: 40px;
  padding: 0;
  height: 10px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
  width: 30%;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body>.el-container {
  margin-bottom: 40px;
}
</style>

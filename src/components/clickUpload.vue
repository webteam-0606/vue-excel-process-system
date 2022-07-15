<template>
  <!--  excel表格上传  -->
  <div class="full-upload-files">
    <div class="upload-file">Upload Flies</div>
    <div>
      <el-upload
        id='input-file'
        class="upload-demo"
        drag
        action="https://jsonplaceholder.typicode.com/posts/"
        multiple
        accept=".xlsx"
        :on-exceed="exceed"
        :limit="50"
        
        :http-request="uploadFile"
        :on-change="handleChange"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处,或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">1次可上传多个xls文件,最多上传50个</div>
      </el-upload>
    </div>
  </div>
</template>

<script scoped>
import XLSX from "xlsx";
export default {
  name: "clickUpload",
  data() {
    return {};
  },
  props: {
    exceed: {
      type: Function,
      default: function() {}
    },
    removeListTableData: {
      type: Function,
      default: function() {}
    },
    uploadFile: {
      type: Function,
      default: function(params) {}
    }
  },
  create() {},
  methods: {
    // 选择文件
		handleChange(file, fileLists) {
			console.log(file);
			console.log(fileLists);
			// 本地服务器路径
			console.log(URL.createObjectURL(file.raw));
			// 本地电脑路径
			console.log(document.getElementsByClassName("el-upload__input")[0].value); 
      var oFReader = new FileReader();
			// var file = document.getElementById('input-file').files[0];
			// oFReader.readAsDataURL(file);
			oFReader.onloadend = function(oFRevent){
				var src = oFRevent.target.result;
        console.log('src',src);
		    }
		},
  }
};
</script>

<style scoped>
.full-upload-files {
  margin-top: 20px;
}
.full-upload-files .upload-file {
  width: 98%;
  text-align-last: left;
  border: 1px solid rgb(202, 205, 210);
  background-color: #e9eef3;
  font-size: 14px;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 5px 0 5px 5px;
}

/* 上传列表多出时，滑页 */
.upload-demo /deep/ .el-upload-list {
  height: 60px;
  overflow: auto;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.upload-demo /deep/ .el-upload-list__item {
  overflow: hidden;
  font-size: 8px;
  margin: 1px 0px 0px 0px;
}
.upload-demo /deep/ .el-upload-dragger {
  width: 100%;
  height: 1%;
}
.upload-demo .el-icon-upload {
  line-height: 0px;
}
</style>

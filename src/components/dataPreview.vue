<template>
  <!--  上传的excel表格预览  -->
  <!-- :fit="true" 表格内容换行 -->
  <div class="preview-excel">
    <el-table class="listTable_ele" v-loading="loading" :data="dataSet" border stripe height="650px" style="width:100%">
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

<script>
export default {
  name: "dataPreview",
  data() {
    return {
      longWidthKey: [
        "crb_minutesactions",
        "rationaleforchange",
        "resolutiondescription",
        "historydetails",
        "submitdescription",
        "solution"
      ],
    }; 
  },
  props: {
    dataSet: {
      type: Array,
      default: []
    },
    keyList: {
      type: Array,
      default: []
    },
    loading :{
      type:Boolean,
      default:false
    }
  },
  create() {
    console.log("dataSet", this.dataSet);
  },
  methods: {
    //设置列宽方法
    headSpanFit(h, { column, index }) {
      let labelLong = column.label.length; // 表头label长度
      let size = 14; // 根据需要定义标尺，直接使用字体大小确定就行，也可以根据需要定义
      // if(column.label.toLowerCase().includes('solution')){
      //   column.minWidth = 1100;
      // } else 
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
  }
};
</script>

<style scoped>
.el-table /deep/ .cell {
  white-space: pre-line;
  text-align: left;
}
.preview-excel /deep/ .el-table__body {
  width: 100%;
}
</style>

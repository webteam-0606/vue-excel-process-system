<template>
  <!--  上传的excel表格预览  -->
  <div class="preview-excel">
    <el-table class="listTable_ele" :data="dataSet" stripe height="500px" style="width:100%">
      <el-table-column prop="id" label="id" width="200" align="center"></el-table-column>
      <el-table-column prop="Headline" label="Headline" width="200" align="center"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import XLSX from "xlsx";
export default {
  name: "dataPreview",
  data() {
    return {};
  },
  props: {
    dataSet:{
        type:Array,
        default:[]
    }
  },
  methods: {}
};
</script>

<style>
</style>

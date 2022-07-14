<template>
  <!--  上传的excel表格预览  -->
  <div class="preview-excel">
    <el-table class="listTable_ele" :data="dataSet" stripe height="500px" style="width:100%">
      <el-table-column
        v-for="(key, index) in keyList"
        :prop="key"
        :label="key"
        align="center"
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>
import XLSX from 'xlsx'
export default {
  name: 'dataPreview',
  data() {
    return {}
  },
  props: {
    dataSet: {
      type: Array,
      default: []
    },
    keyList:{
      type: Array,
      default: []
    }
  },
  create() {
    console.log('dataSet', this.dataSet)
  },
  methods: {}
}
</script>

<style scoped>
.preview-excel /deep/ .el-table__body {
  width: 100%;
}
</style>

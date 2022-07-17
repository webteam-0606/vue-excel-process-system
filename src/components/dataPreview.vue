<template>
  <!--  上传的excel表格预览  -->
  <div class="preview-excel">
    <el-table class="listTable_ele" :data="dataSet" stripe height="500px" style="width:100%">
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
import XLSX from 'xlsx'
export default {
  name: 'dataPreview',
  data() {
    return {
      longWidthKey: ['HistoryDetails']
    }
  },
  props: {
    dataSet: {
      type: Array,
      default: []
    },
    keyList: {
      type: Array,
      default: []
    }
  },
  create() {
    console.log('dataSet', this.dataSet)
  },
  methods: {
    headSpanFit(h, { column, index }) {
      let labelLong = column.label.length // 表头label长度
      let size = 14 // 根据需要定义标尺，直接使用字体大小确定就行，也可以根据需要定义
      column.minWidth = labelLong * size + 10 // 根据label长度计算该表头最终宽度
      if (this.longWidthKey.includes(column.label)) {
        column.minWidth = 1200
      }
      return h('span', { class: 'cell-content', style: { width: '100%' } }, [column.label])
    },
  }
}
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

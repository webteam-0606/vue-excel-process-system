<template>
  <!-- 搜索框 -->
  <div class="full-search-box">
    <div class="input-search-box">
      <el-input placeholder="请输入要搜索的内容" v-model="inputVal" clearable></el-input>
      <el-button class="search-button" type="primary" icon="el-icon-search" @click="handleSearchButtonClick">
        Search
      </el-button>
    </div>
    <div class="search-select">
      <el-radio-group v-model="selectRadio" @change="handleRadioSelectChange" class="search-select-group">
        <el-radio label="1">Full Text</el-radio>
        <el-radio label="2">By ID</el-radio>
      </el-radio-group>
    </div>
  </div>
</template>

<script scoped>
export default {
  name: 'searchFileBox',
  data() {
    return {
      selectRadio: 0,
      inputVal: ''
    }
  },
  create() {},
  methods: {
    handleSearchButtonClick() {
      console.log('inputVal',this.inputVal)
      this.$emit('searchButtonClick', this.inputVal)
    },
    handleRadioSelectChange(val) {
      console.log('radio变更', val)
      this.$emit('radioSelectChange', val)
    }
  }
}
</script>

<style scoped>
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
  width: 25%;
}
.full-search-box .search-select {
  text-align: left;
  padding: 5px 5px 5px 5px;
}
.search-select-group {
  display: flex;
  justify-content: center;
}
.el-aside /deep/ .el-input--prefix .el-input__inner {
  padding-left: 15px;
}
</style>

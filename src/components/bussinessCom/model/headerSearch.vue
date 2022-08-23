<template>
  <div class="header-search">
    <el-input
      placeholder="请输入关键字"
      v-model="key"
      class="input-with-select"
    >
      <i class="el-icon-search" slot="prepend" />
      <el-button slot="append" @click="search">搜索</el-button>
    </el-input>
  </div>
</template>
<script>
import { getToken } from "@/utils/auth";
export default {
  data() {
    return {
      key: "",
    };
  },
  methods: {
    /**
     * 搜索方法，跳转搜索页面
     */
    search() {
      // this.$router.push({ path: "/search", query: { keyWord: this.key } });
      if (getToken()) {
        location.href = `/indexSearch?keyword=${this.key}`;
      } else {
        this.$message.warning("还未登录，请先登录");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.header-search {
  width: 100%;
  height: 120px;
  line-height: 120px;
  background: url("~@assets/images/search-bg.png");
  margin-bottom: 15px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  ::v-deep .input-with-select {
    width: 680px;
    margin: auto;
    height: 45px;
    .el-input-group__prepend {
      background: #ffffff;
      padding: 0px 10px;
      font-size: 24px;
      border-right: 0;
    }
    .el-input__inner {
      height: 100%;
      border-left: 0px;
      height: 45px;
      line-height: 45px;
    }
    .el-input-group__append {
      background: rgba(230, 162, 60, 1);
      color: #ffffff;
      font-size: 15px;
      border: 0;
      &:hover {
        background: rgba(250, 161, 29, 1);
      }
    }
  }
}
</style>
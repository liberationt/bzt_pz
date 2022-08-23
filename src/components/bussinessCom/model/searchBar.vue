<template>
  <div class="searchBar">
    <div class="searchBar-content">
      <!-- <el-radio-group v-model="searchType" class="type">
        <el-radio-button :label="1">标准检索</el-radio-button>
        <el-radio-button :label="2">信息检索</el-radio-button>
      </el-radio-group> -->
      <el-input
        placeholder="请输入关键字"
        v-model="searchKey"
        class="s-input"
        @keyup.native.enter="submitSearch"
      >
        <i class="el-icon-search" slot="prepend" />
        <el-button slot="append" @click="submitSearch">搜索</el-button>
      </el-input>
    </div>
  </div>
</template>
<script>
export default {
  name: "searchBar",
  data() {
    return {
      searchType: 1,
      searchKey: "",
    };
  },
  methods: {
    submitSearch() {
      // this.searchList.unshift({ value: this.searchKey, label: this.searchKey });
      // this.searchList = _.uniqBy(this.searchList, "value");
      // this.$storage.set("searchRecods", [...this.searchList]);
      // let routeUrl = this.$router.resolve({
      //   path: "/search",
      //   query: { key: this.searchKey },
      // });
      this.$router.push({
        path: "/search",
        query: { key: this.searchKey },
      });
      // let a = document.createElement("a");
      // a.setAttribute("href", routeUrl.href);
      // a.setAttribute("target", "_blank");
      // a.click();
    },
  },
};
</script>
<style lang="scss" scoped>
.searchBar {
  margin: auto;
  background: url("~@assets/images/search-bg.png");
  width: 1206px;
  height: 155px;
  text-align: center;
  vertical-align: middle;
  ::v-deep .searchBar-content {
    padding: 35px 250px;
    text-align: left;
    .type {
      margin-left: 8px;
      .el-radio-button__inner {
        width: 100px;
        height: 35px;
        line-height: 35px;
        padding: 0;
        border: 1px;
        border-radius: 4px;
        font-size: 14px;
        margin-right: 15px;
        box-shadow: #999999 1px 1px 3px -6px;
      }
    }
    .s-input {
      margin-top: 20px;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      box-shadow: #999999 1px 5px 20px -6px;
      border-radius: 8px;
      i {
        font-size: 20px;
        line-height: 50px;
      }
      .el-input-group__prepend {
        background: #ffffff;
        border-radius: 8px 0px 0px 8px;
      }
      input {
        border-right: 0;
        border-left: 0;
        height: 53px;
        line-height: 53px;
        font-size: 14px;
      }
      .el-input-group__append {
        width: 100px;
        background-color: rgb(224, 161, 47);
        color: #ffffff;
        text-align: center;
        border-radius: 0px 8px 8px 0px;
        font-size: 18px;
        &:hover {
          background: rgba(224, 161, 47, 0.9);
        }
      }
    }
  }
  .search-btn {
    width: 100px;
    height: 40px;
    line-height: 40px;
    color: #333333;
    border: #ededed;
    border-radius: 4px;
    background: #ffffff;
    margin: 6px;
  }
}
</style>
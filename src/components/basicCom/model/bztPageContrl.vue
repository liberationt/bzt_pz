<template>
  <div class="pagination">
    <el-pagination
      background
      layout="total, sizes, prev, pager, next,jumper"
      :total="pageInfo.total"
      :page-size="pageInfo.pageSize"
      :current-page="pageInfo.pageNo"
      @next-click="next"
      @prev-click="prev"
      @current-change="pageChange"
      @size-change="pageSizeChange"
    >
    </el-pagination>
  </div>
</template>
<script>
export default {
  name: "page-ctrl",
  props: ["pageInfo"],
  methods: {
    closeBranchDialog() {},
  },
  watch: {
    pageInfo: {
      handler(newVal, oldVal) {},
    },
  },
  methods: {
    /**
     * 上一页
     * @param e 当前页码
     */
    prev(e) {
      this.$emit("page-change", e);
    },
    /**
     * 下一页
     * @param e 当前页码
     */
    next(e) {
      this.$emit("page-change", e);
    },
    /**
     * 翻页
     * @param e 当前页码
     */
    pageChange(e) {
      this.$emit("page-change", e);
    },
    /**
     * 每页显示数量
     * @param e 数量
     */
    pageSizeChange(e) {
      this.$emit("size-change", e);
    },
    /**
     * 跳到指定页
     */
    handleCurrentChange(e) {
      this.$emit("page-change", e);
    },
  },
};
</script>
<style lang="scss" scoped>
.pagination {
  width: 100%;
  text-align: right;
  .el-pagination {
    text-align: right;
    margin: 15px 5px;
  }
}
</style>
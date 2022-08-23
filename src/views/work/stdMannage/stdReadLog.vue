<template>
  <div class="std-read-log app-container">
    <!-- 浏览记录列表 -->
    <BztTable
      :tableData="{
        column: tabClums,
        data: list,
        action: [],
        actionWidth: '110px',
      }"
      :hasIndex="true"
      :pageInfo="page"
      :isLoading="isTabLoading"
      @checkLog="checkLog"
    />

    <!-- 分页 -->
    <BztPageContrl
      :pageInfo="page"
      @page-change="pageChange"
      @size-change="sizeChange"
    />

    <!-- 浏览记录信息 -->
    <LogInfo
      v-if="logVisiable == true"
      :visiable="logVisiable"
      :stdId="stdId"
      @close="closeLogInfo"
    />
  </div>
</template>
<script>
import Api from "@api/infoModule";
import processApi from "@api/process";
import { BztTable, BztPageContrl } from "@components/basicCom/index";
import LogInfo from "./components/logInfo.vue";

export default {
  name: "std-read-log",
  components: {
    BztTable,
    BztPageContrl,
    LogInfo,
  },
  dicts: ["standard_type", "standard_status"],
  data() {
    return {
      isTabLoading: false,
      logVisiable: false,
      stdId: null,
      tabClums: [
        {
          title: "标准编号",
          key: "stdNo",
          width: "280",
        },
        {
          title: "标准名称",
          key: "stdName",
          minWidth: "280",
        },
        {
          title: "浏览次数",
          key: "count",
          width: "210",
          filter: {
            type: "action",
            actionName: "checkLog",
            action: (data) => {
              return data;
            },
          },
        },
      ],
      listReq: {
        pageNum: 1,
        pageSize: 10,
      },
      list: [],
      page: {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      },
    };
  },
  mounted() {
    this.pageChange(1);
  },
  methods: {
    /**
     * 判断日期式
     * @param {string} data 要判断的日期字符串
     */
    getDate(data) {
      let str = "";
      if (data === null || data === undefined) {
        str = "";
      } else if (
        data.indexOf("1900-01-01") === -1 &&
        data.indexOf("1970-01-01") === -1 &&
        data.indexOf("9990-01-01") === -1
      ) {
        str = data;
      } //'1900-01-01'||'9990-01-01'||'1970-01-01'
      return str;
    },
    /**
     * 获取标准列表
     */
    getList() {
      this.isTabLoading = true;
      Api.stdReadLogList(this.listReq).then((res) => {
        const { code, msg, rows, total } = res;
        if (code === 200) {
          this.list = rows;
          this.page.total = total;
          this.page.pageNo = this.listReq.pageNum;
          this.page.pageSize = this.listReq.pageSize;
        } else {
          // this.$message.error(msg);
        }
        this.isTabLoading = false;
      });
    },
    /**
     * 翻页
     * @param {number} e 页码
     */
    pageChange(e) {
      this.listReq.pageNum = e;
      this.getList();
    },
    /**
     * 改变每页显示数量
     */
    sizeChange(e) {
      this.listReq.pageSize = e;
      this.pageChange(1);
    },
    /**
     * 查看浏览记录信息
     * @param data {*} 标准浏览记录
     */
    checkLog(data) {
      this.logVisiable = true;
      this.stdId = data.stdId;
    },
    closeLogInfo() {
      this.logVisiable = false;
      this.stdId = null;
    },
  },
};
</script>
<style lang="scss" scoped>
.std-read-log {
  width: 100%;
  height: 100%;
}

::v-deep .el-descriptions {
  font-size: 14px !important;
  width: 80%;
  margin: auto;
  .el-descriptions-row {
    .el-descriptions-item__cell {
      line-height: 35px;
      font-size: 15px;
    }
  }
}
::v-deep .btn {
  position: relative;
}
</style>
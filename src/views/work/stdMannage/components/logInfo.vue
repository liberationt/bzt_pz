<template>
  <BztDialog
    :dialogInfo="dialogInfo"
    @close="closeDialog($event)"
    :appendTobody="false"
  >
    <template slot="body">
      <!-- 内容区 -->
      <div class="std-list-content">
        <!-- 结果列表 -->
        <BztTable
          :tableData="{
            column: tabClums,
            data: list,
            action: [],
          }"
          :hasIndex="false"
          :pageInfo="page"
          :isLoading="isTabLoading"
        />
        <!-- 分页 -->
        <BztPageContrl
          :pageInfo="page"
          @page-change="pageChange"
          @size-change="sizeChange"
        />
      </div>
    </template>
  </BztDialog>
</template>
<script>
import {
  BztDialog,
  BztTable,
  BztPageContrl,
} from "@components/basicCom/index.js";
import Api from "@api/infoModule";
import { mapGetters } from "vuex";

export default {
  name: "log-info",
  components: {
    BztDialog,
    BztTable,
    BztPageContrl,
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  dicts: ["external_consultation_node"],
  props: {
    visiable: {
      type: Boolean,
      default: false,
    },
    stdId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      dialogInfo: {
        visible: false,
        title: "查看",
        width: "1000px",
      },
      tabClums: [
        {
          title: "标准编号",
          key: "stdNo",
          width: "180",
        },
        {
          title: "标准名称",
          key: "stdName",
          minWidth: "180",
        },
        {
          title: "浏览用户",
          key: "readUserId",
          width: "280",
          filter: {
            type: "user",
          },
        },
        {
          title: "浏览时间",
          key: "readStartTime",
          width: "180",
        },
      ],
      page: {
        total: 0,
        pageSize: 1000,
        pageNo: 1,
      },
      listReq: {
        stdId: null,
        pageNum: 1,
        pageSize: 10,
      },
      list: [],
      isTabLoading: false,
    };
  },
  mounted() {
    this.dialogInfo.title = "查看浏览记录";
    this.dialogInfo.visible = this.visiable;
    this.pageChange(1);
  },
  watch: {
    visiable: {
      handler(val) {
        this.dialogInfo.title = "查看浏览记录";
        this.dialogInfo.visiable = val;
      },
    },
  },
  methods: {
    /**
     * 获取结果列表
     */
    getList() {
      this.listReq.stdId = this.stdId;
      this.isTabLoading = true;
      Api.topicByStdId(this.listReq).then((res) => {
        this.isTabLoading = false;
        const { code, msg, rows, total } = res;
        if (code === 200) {
          this.list = rows;
          this.page.total = total;
          this.page.pageNo = this.listReq.pageNum;
          this.page.pageSize = this.listReq.pageSize;
        } else {
          // this.$message.error(msg);
        }
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
     * 关闭弹框
     */
    closeDialog(e) {
      this.$emit("close", null);
    },
  },
};
</script>
<style lang="scss" scoped>
.enterprise-std {
  width: 100%;
  height: 100%;
  .std-list-content {
    margin-top: -30px;
  }
}
::v-deep .btz-tables {
  max-height: 570px !important;
}
::v-deep .el-table__body-wrapper {
  max-height: 510px !important;
}
</style>
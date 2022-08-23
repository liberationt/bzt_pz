<template>
  <div class="delivery-info app-container">
    <!-- 搜索 -->
    <BztSearch :searchData="searchInfo" @search="searchList" />

    <!-- 功能操作行 -->
    <div class="operation-line">
      <div
        class="submit-btn"
        @click="updateFeedback()"
        v-hasPermi="['feedback:update']"
      >
        <i class="el-icon-edit-outline" />
        发布反馈意见
      </div>
    </div>

    <!-- 信息列表 -->
    <BztTable
      :tableData="{
        column: tabClums,
        data: list,
        action: tabAction,
        actionWidth: '180px',
      }"
      :hasIndex="true"
      :pageInfo="page"
      :isLoading="isTabLoading"
      @checkDetail="checkDetail"
    >
      <template slot="remove" slot-scope="{ scope }">
        <span
          class="yellow-link-txt"
          @click="isOpen(scope)"
          v-hasPermi="['feedback:isShow']"
        >
          {{ scope.state == 0 ? "公开" : "非公开" }}
        </span>
        <span
          class="red-link-text"
          @click="removeInfo(scope)"
          v-hasPermi="['feedback:remove']"
        >
          删除
        </span>
      </template>
    </BztTable>

    <!-- 分页 -->
    <BztPageContrl
      :pageInfo="page"
      @page-change="pageChange"
      @size-change="sizeChange"
    />

    <!-- 发布返回意见/查看反馈意见详情  -->
    <BztDialog
      v-if="dialogFeedback.visible == true"
      :dialogInfo="dialogFeedback"
      @close="closeDetail"
    >
      <template slot="body" v-if="update == true">
        <TinymceEditor
          editorName="feedback"
          :curValue="feedbackDetail.content"
          v-model="feedbackDetail.content"
          :height="'360px'"
          ref="content"
        />
      </template>
      <template slot="body" v-else>
        <div v-html="feedbackDetail.content"></div>
      </template>
    </BztDialog>
  </div>
</template>
<script>
import Api from "@api/infoModule";
import { mapGetters } from "vuex";
import {
  BztSearch,
  BztTable,
  BztPageContrl,
  BztDialog,
} from "@components/basicCom/index";

const infoFormReq = {
  infoPublishId: null,
  receiver: "",
};
export default {
  name: "delivery-info",
  components: {
    BztSearch,
    BztTable,
    BztPageContrl,
    BztDialog,
  },
  dicts: ["info_publish_theme", "info_publish_status"],
  computed: {
    ...mapGetters(["userInfo"]),
  },
  data() {
    return {
      update: false,
      dialogFeedback: {
        visible: false,
        title: "发布反馈意见",
        width: "900px",
        footer: true,
        loadding: false,
      },
      editVisible: false,
      isTabLoading: false,
      searchInfo: {
        labelList: [
          {
            label: "关键字查询",
            key: "content",
            type: 1,
          },
        ],
        btnList: [
          { label: "查询", action: "search", type: 1 },
          { label: "重置", action: "search", type: 0 },
        ],
      },
      tabClums: [
        {
          title: "反馈内容",
          key: "realContent",
          minWidth: "420",
          showTips: false,
          filter: {
            type: "html",
            isHtml: true,
          },
        },
        {
          title: "是否公开",
          key: "state",
          width: "150",
          filter: {
            type: "filter",

            action: (data) => {
              return data == 1 ? "公开" : "非公开";
            },
          },
        },
        {
          title: "发布时间",
          key: "createAt",
          width: "210",
          filter: {
            type: "filter",

            action: (data) => {
              return this.getDate(data);
            },
          },
        },
        {
          title: "发布人",
          key: "createBy",
          width: "210",
          filter: {
            type: "user",
          },
        },
      ],
      listReq: {
        content: "",
        pageNum: 1,
        pageSize: 10,
        isAsc: "desc",
        orderByColumn: "createAt",
        showAll: 0,
      },
      tabAction: [
        { label: "详情", action: "checkDetail" },
        {
          label: "删除",
          type: "slot",
          btnName: "remove",
          color: "rgba(214, 71, 48)",
        },
      ],
      list: [],
      page: {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      },
      feedbackDetail: {
        content: "",
      },
    };
  },
  created() {
    if (this.noPermi(["feedback:showAll"]) == false) {
      this.listReq.showAll = 1;
    }
    //feedback:showAll
    this.getList();
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
     * 获取信息列表
     */
    getList() {
      if (this.noPermi(["feedback:showAll"]) == false) {
        this.listReq.showAll = 1;
      }
      this.isTabLoading = true;
      Api.getFeedbackList(this.listReq).then((res) => {
        const { code, msg, rows, total } = res;
        if (code === 200) {
          this.list = rows;
          this.page.total = total;
          this.page.pageNo = this.listReq.pageNum;
          this.page.pageSize = this.listReq.pageSize;
          this.isTabLoading = false;
        } else {
          // this.$message.error(msg);
        }
      });
    },
    /**
     * 搜索
     * @param {object} e 搜索表单参数
     */
    searchList(e) {
      this.isAll = false;

      Object.keys(e).map((key) => {
        this.listReq[key] = e[key];
      });
      this.pageChange(1);
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
     * 关闭详情弹框
     */
    closeDetail(e) {
      if (e == true) {
        if (
          this.feedbackDetail.content == null ||
          this.feedbackDetail.content == ""
        ) {
          this.$message.warning("请输入反馈内容");
          return;
        }
        this.feedbackDetail.realContent = this.$refs.content.getTextVal();
        this.dialogFeedback.loadding = true;
        Api.updateFeedback(this.feedbackDetail).then((res) => {
          this.dialogFeedback.loadding = false;
          const { code, msg } = res;
          if (code == 200) {
            this.$message.success("反馈意见已发布");
            this.dialogFeedback.visible = false;
            this.pageChange(1);
          } else {
            this.dialogFeedback.loadding = false;
            this.$message.error(msg);
          }
        });
      } else {
        this.dialogFeedback.visible = false;
        this.feedbackDetail = { content: "" };
      }
    },
    /**
     * 打开新增编辑弹窗
     * @param {*} data 为null时为发布信息，否则为编辑
     */
    updateFeedback() {
      this.feedbackDetail = { content: "" };
      this.update = true;
      this.dialogFeedback.visible = true;
      this.dialogFeedback.loadding = false;
      this.dialogFeedback.footer = true;
      this.dialogFeedback.title = "发布反馈意见";
    },
    /**
     * 删除信息
     * @param {*} e 要删除的信息的详情
     */
    removeInfo(e) {
      this.$confirm(
        `确定删除反馈意见吗？删除后数据将不可再恢复，请谨慎操作！`,
        "反馈意见",
        {
          confirmButtonText: "删除",
          cancelButtonText: "取消",
          center: true,
        }
      )
        .then(() => {
          Api.removeFeedback(e.id).then((res) => {
            const { data, code, msg } = res;
            if (code === 200) {
              this.$message.success(`已删除反馈意见`);
              this.pageChange(1);
            } else {
              // this.$message.error(msg);
            }
          });
        })
        .catch(() => {});
    },
    /**
     * 查看反馈意见
     * @param {*} e 要查看的反馈意见信息
     */
    checkDetail(e) {
      this.update = false;
      this.feedbackDetail = e;
      this.dialogFeedback.footer = false;
      this.dialogFeedback.visible = true;
      this.dialogFeedback.title = "查看反馈意见";
    },
    /**
     * 设置公开非公开
     * @param {*} data 要设置的反馈意见信息
     */
    isOpen(data) {
      const req = {
        id: data.id,
        content: data.content,
        state: data.state == 1 ? 0 : 1,
      };
      let str = data.state == 1 ? "公开" : "非公开";
      this.$confirm(`确定设置${str}反馈意见吗？`, "反馈意见", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        center: true,
      })
        .then(() => {
          Api.updateFeedBack(req).then((res) => {
            const { code, msg, data } = res;
            if (code == 200) {
              this.$message.success("操作成功");
              this.pageChange(1);
            }
          });
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang="scss" scoped>
.delivery-info {
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
::v-deep .cell {
  width: 100%;
  overflow: hidden;
  height: 100;
  height: 22px;
  white-space: nowrap;
  word-break: break-all;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  overflow: hidden;
}
</style>
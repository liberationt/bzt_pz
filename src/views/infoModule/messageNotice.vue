<template>
  <div class="mesaage-notice app-container">
    <!-- 搜索 -->
    <BztSearch :searchData="searchInfo" @search="searchList" />

    <!-- 功能操作行 -->
    <div class="operation-line">
      <div class="green-btn" @click="readAll">全部标记为已读</div>
    </div>

    <!-- 信息列表 -->
    <BztTable
      :tableData="{
        column: tabClums,
        data: list,
        action: tabAction,
        actionWidth: '120px',
      }"
      :pageInfo="page"
      :isLoading="isTabLoading"
      @checkDetail="checkDetail"
    />

    <!-- 分页 -->
    <BztPageContrl
      :pageInfo="page"
      @page-change="pageChange"
      @size-change="sizeChange"
    />

    <!--详情  -->
    <BztDialog
      :dialogInfo="dialogDetailInfo"
      @close="closeDetail"
      :appendTobody="true"
    >
      <template slot="body">
        <div class="detail" v-if="messageDetail !== null">
          <el-descriptions
            :title="null"
            :column="1"
            labelClassName="label"
            contentClassName="contents"
            :labelStyle="{ width: '80px' }"
          >
            <el-descriptions-item label="标题">
              {{ messageDetail["title"] || "" }}
            </el-descriptions-item>
            <el-descriptions-item label="消息内容">
              {{ messageDetail["content"] || "" }}
            </el-descriptions-item>
            <el-descriptions-item label="发送时间">
              {{ messageDetail["createTime"] || "" }}
            </el-descriptions-item>
            <el-descriptions-item label="发布人">
              {{ getUser(messageDetail["sendUser"] || "") }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </template>
    </BztDialog>
  </div>
</template>
<script>
import Api from "@api/infoModule";
import {
  BztSearch,
  BztTable,
  BztPageContrl,
  BztDialog,
} from "@components/basicCom/index";
import Bus from "@/utils/bus";
export default {
  name: "mesaage-notice",
  components: { BztSearch, BztTable, BztPageContrl, BztDialog },
  dicts: ["message_status"],
  data() {
    return {
      dialogDetailInfo: {
        visible: false,
        title: "详情",
        width: "800px",
        footer: false,
      },
      searchInfo: {},
      isTabLoading: false,
      tabClums: [
        {
          title: "标题",
          key: "title",
          width: "220",
        },
        {
          title: "消息内容",
          key: "content",
        },
        {
          title: "发送者",
          key: "sendUser",
          width: "280",
          filter: {
            type: "user",
          },
        },
        {
          title: "发送时间",
          key: "createTime",
          width: "180",
        },
        {
          title: "状态",
          key: "status",
          width: "120",
          filter: {
            type: "filter",
            isHtml: true,
            action: (data) => {
              let str = "";
              this.dict.type.message_status.forEach((item) => {
                if (item.value == data) {
                  str = item.label;
                }
              });
              switch (data) {
                case 0:
                  str = `<span class="error-tag">${str}</span>`;
                  break;
                case 1:
                  str = `<span class="warning-tag">${str}</span>`;
                  break;
                case 2:
                  str = `<span class="success-tag">${str}</span>`;
                  break;
              }
              return str;
            },
          },
        },
      ],
      listReq: {
        content: null,
        status: null,
        pageNum: 1,
        pageSize: 10,
      },
      tabAction: [{ label: "查看详情", action: "checkDetail" }],
      list: [{}],
      page: {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      },
      messageDetail: {},
    };
  },
  created() {
    this.initDictData();
    this.getList();
  },
  methods: {
    /**
     * 初始搜索列表化字典数据
     */
    initDictData() {
      this.searchInfo = {
        labelList: [
          { label: "消息内容", key: "content", type: 1 },
          {
            label: "状态",
            key: "status",
            type: 2,
            options: this.dict.type.message_status,
            replaceField: { value: "value", label: "label" },
            multiple: false,
          },
        ],
        btnList: [
          { label: "搜索", action: "search", type: 1 },
          { label: "重置", action: "search", type: 0 },
        ],
      };
    },
    /**
     * 获取消息列表
     */
    getList() {
      this.isTabLoading = true;
      Api.getMessageList(this.listReq).then((res) => {
        const { code, msg, data } = res;
        this.isTabLoading = false;

        if (code === 200) {
          this.list = data.list;
          this.page.total = data.total;
          this.page.pageNo = this.listReq.pageNum;
          this.page.pageSize = this.listReq.pageSize;
        } else {
          // this.$message.error(msg);
        }
      });
    },
    /**
     * 获取用户名
     */
    getUser(userId) {
      console.log(userId);
      const sourceUserList = this.$cache.session.getJSON("sourceUserList");
      if (userId == 0) return "系统";
      const user = _.find(sourceUserList, { userId: Number(userId) });
      return user
        ? `${user.nickName}（${user.userName}）`
        : "-（${user.userName}）";
    },

    /**
     * 搜索
     * @param {object} e 搜索表单参数
     */
    searchList(e) {
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
     * 查看详情
     * @param {object} e 要查看的信息的信息
     */
    checkDetail(e) {
      this.dialogDetailInfo.visible = true;
      this.messageDetail = e;
      this.dialogDetailInfo.title = `消息详情`;
      Api.setMessageRead(e.id).then((res) => {
        // 打开消息 标记为已读
        const { code, msg, data } = res;
        // this.pageChange(1);
        if (code !== 200) {
          this.$message.error(msg);
        }
        //更新消息数量
        Api.listCountMessage().then((res) => {
          Bus.$emit("notice");
        });
      });
    },
    /**
     * 关闭详情弹框
     */
    closeDetail() {
      this.dialogDetailInfo.visible = false;
      this.messageDetail = {};
      this.getList();
    },
    /**
     * 全部标记为已读
     */
    readAll() {
      Api.setMessageAllRead().then((res) => {
        const { code, msg, data } = res;
        if (code === 200) {
          this.$message.success("标记成功");
          this.pageChange(1);
          //更新消息数量
          Api.listCountMessage().then((res) => {
            Bus.$emit("notice");
          });
        } else {
          // this.$message.error(msg);
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.mesaage-notice {
  width: 100%;
  height: 100%;
}
.detail {
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
}
</style>
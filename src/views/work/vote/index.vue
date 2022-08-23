<template>
  <div class="standard-query app-container">
    <!-- 功能操作行 -->
    <div class="operation-line">
      <div
        class="submit-btn"
        @click="updateVote(null, 0)"
        v-hasPermi="['vote:create']"
      >
        <i class="el-icon-plus" />
        创建投票任务
      </div>
    </div>

    <!-- 标准列表 -->
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
    >
      <template slot="action" slot-scope="{ scope }">
        <!-- <span
          class="yellow-link-txt"
          v-if="scope.stdId.indexOf('-') > -1"
          v-hasPermi="['vote:cast']"
          @click="updateVote(scope, 0)"
        >
          编辑
        </span> -->
        <span class="link-text" @click="updateVote(scope, 1)"> 详情 </span>
        <span
          class="yellow-link-txt"
          v-hasPermi="['vote:cast']"
          v-if="
            scope.isVote == 0 &&
            scope.state != 1 &&
            hasCasVote(scope.expertIds) == true
          "
          @click="updateVote(scope, 2)"
        >
          投票
        </span>
        <span
          class="yellow-link-txt"
          v-if="scope.state != 1 && scope.createBy == userInfo.userId"
          @click="updateVote(scope, 3)"
        >
          终止投票
        </span>

        <!-- <span
          v-if="scope.hasFile == 1"
          class="green-link-text"
          @click="fileDownLoad(scope, -1)"
        >
          删除
        </span> -->
      </template>
    </BztTable>

    <!-- 分页 -->
    <BztPageContrl
      :pageInfo="page"
      @page-change="pageChange"
      @size-change="sizeChange"
    />

    <!-- 添加（编辑）标准  -->
    <UpdateVote
      v-if="updateVoteVisiable == true"
      :visiable="updateVoteVisiable"
      :voteInfo="voteTaskForm"
      @save="saveVote"
    />

    <!-- 详情 -->
    <BztDialog
      v-if="dialogVoteDetail.visible == true"
      :dialogInfo="dialogVoteDetail"
      @close="closedCastVote"
    >
      <template slot="body">
        <VoteDetail :id="voteTaskForm.id" />
      </template>
    </BztDialog>

    <!-- 投票 -->
    <BztDialog
      v-if="dialogCastVote.visible == true"
      :dialogInfo="dialogCastVote"
      @close="closedCastVote"
    >
      <template slot="body">
        <CastVote
          :todoTask="{ businessObjId: voteTaskForm.id }"
          @success="closedCastVote(true)"
          @close="closedCastVote(false)"
        />
      </template>
    </BztDialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Api from "@api/process";
import {
  BztSearch,
  BztTable,
  BztPageContrl,
  BztDialog,
  BztUploadFile,
} from "@components/basicCom/index";

import UpdateVote from "./components/updateVote.vue";
import CastVote from "./castVote.vue";
import VoteDetail from "./voteDetail.vue";

export default {
  name: "vote",
  components: {
    BztSearch,
    BztTable,
    BztPageContrl,
    BztDialog,
    UpdateVote,
    BztUploadFile,
    CastVote,
    VoteDetail,
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  dicts: ["vote_type"],
  data() {
    return {
      dialogVoteDetail: {
        visible: false,
        title: "详情",
        width: "900px",
        loadding: false,
        footer: false,
      },
      dialogCastVote: {
        visible: false,
        title: "投票",
        width: "900px",
        loadding: false,
        footer: false,
      },
      dialogInfo: {
        visible: false,
        title: "添加标准",
        width: "800px",
        footer: true,
      },
      isTabLoading: false,
      tabClums: [
        {
          title: "任务名称",
          key: "voteTaskName",
          minWidth: "180",
        },
        {
          title: "包含项目数",
          key: "voteStdNum",
          width: "180",
        },
        {
          title: "投票类型",
          key: "voteType",
          width: "160",
          filter: {
            type: "filter",
            action: (data) => {
              let str = "";
              this.dict.type.vote_type.forEach((item) => {
                if (item.value == data) {
                  str = item.label;
                }
              });
              return str;
            },
          },
        },
        {
          title: "创建时间",
          key: "createTime",
          width: "180",
          sortable: true,
          filter: {
            type: "filter",
            action: (data) => {
              return this.getDate(data);
            },
          },
        },
      ],
      listReq: {
        state: 0,
        pageNum: 1,
        pageSize: 10,
      },
      tabAction: [{ label: "操作", type: "slot", btnName: "action" }],
      list: [],
      page: {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      },
      voteTaskForm: null,
      updateVoteVisiable: false,
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
     * 获取投票任务列表
     */
    getList() {
      this.isTabLoading = true;
      Api.getVoteList(this.listReq).then((res) => {
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
     * 获取该用户是否有投票的权限
     * @param ids {string} 可以参与投票的用户Ids
     * @returns hasCastVotePermisse {Boolean} true有投票权限，false无投票权限
     */
    hasCasVote(ids) {
      let hasCastVotePermisse = false;
      ids.split(",").forEach((id) => {
        if (id == this.userInfo.userId) {
          hasCastVotePermisse = true;
        }
      });
      return hasCastVotePermisse;
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
     * 编辑标准
     * @param {object} e 要编辑的标准的信息
     */
    updateVote(e, flag) {
      this.voteTaskForm = null;
      if (e != null) {
        this.voteTaskForm = e;
      }
      if (flag == 0) {
        this.updateVoteVisiable = true;
      }
      // 查看详情
      if (flag == 1) {
        this.dialogVoteDetail.title = `任务【${this.voteTaskForm.voteTaskName}】详情`;
        this.dialogVoteDetail.visible = true;
      }
      // 投票
      if (flag == 2) {
        this.dialogCastVote.title = `任务【${this.voteTaskForm.voteTaskName}】投票`;
        this.dialogCastVote.visible = true;
      }
      // 终止投票
      if (flag == 3) {
        this.$confirm(
          `确认终止投票任务${this.voteTaskForm.voteTaskName}？`,
          "提交投票",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            center: true,
          }
        )
          .then(() => {
            Api.stopVote({ id: this.voteTaskForm.id }).then((res) => {
              const { code } = res;
              if (code == 200) {
                this.$message.success("操作成功");
                this.pageChange(1);
              }
              this.isLoading = false;
            });
          })
          .catch(() => {});
      }
    },
    /**
     * 关闭投票窗口
     */
    closedCastVote(e) {
      if (e != null) {
        this.pageChange(1);
      }
      this.dialogCastVote.visible = false;
      this.dialogVoteDetail.visible = false;
    },
    /**
     * 保存/取消添加（编辑）标准
     * @param {*} e:true为检索，false：为取消
     */
    updateStd(e) {
      this.updateVoteVisiable = false;
      this.pageChange(1);
    },
    /**
     * 下载文件
     * @param {*} 要下载的文件信息
     */
    fileDownLoad(data) {
      if (data.hasFile == 1) {
        const fileName = `${data.stdName}.${data.stdFile.split(".")[1]}`;
        this.downLoadByURL(data.stdFile, `${fileName}`);
      }
    },
    saveVote(e) {
      if (e == true) {
        this.pageChange(1);
      }
      this.updateVoteVisiable = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.standard-query {
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
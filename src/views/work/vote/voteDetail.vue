<template>
  <div class="cast-vote app-container" v-if="voteDteial != null">
    <div class="line">投票任务名称： {{ voteDteial.voteTaskName }}</div>
    <div class="line">投票专家： {{ getUserName(voteDteial.expertIds) }}</div>
    <div class="line">未投票专家数： {{ noVote }}人</div>
    <div class="line">
      投票任务创建时间： {{ voteDteial.createTime }}
      <div style="float: right" class="submit-btn" @click="exportVoteResult()">
        <i class="el-icon-download" />
        导出投票结果
      </div>
    </div>

    <!-- 浏览记录列表 -->
    <BztTable
      :tableData="{
        column: tabClums,
        data: list,
        action: tabAction,
        actionWidth: '110px',
      }"
      :hasIndex="true"
      :pageInfo="page"
      :isLoading="isTabLoading"
      @checkDetail="checkDetail"
    />
    <!-- 查看项目详情 -->
    <CheckPprojectDtail :todoData="proInfo" @close="closePro" />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Api from "@api/process";
import { BztTable } from "@components/basicCom/index";
import CheckPprojectDtail from "./components/checkPprojectDtail.vue";

const castVotekForm = {
  voteTaskId: "",
  projectIdList: "",
  expertId: null,
  remark: "",
};
export default {
  name: "cast-vote",
  components: {
    BztTable,
    CheckPprojectDtail,
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  dicts: ["vote_type"],
  props: {
    id: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      proInfo: {
        id: null,
        compt: "",
        visible: false,
        projectPhase: null,
      },
      isTabLoading: false,
      isLoading: false,
      castVotekForm: null,
      tabClums: [
        {
          title: "项目名称",
          key: "projectName",
          minWidth: "280",
        },
        {
          title: "项目申请人",
          key: "applyUser",
          width: "160",
          filter: {
            type: "user",
          },
        },
        {
          title: "票数",
          key: "poll",
          width: "160",
        },
        {
          title: "未投票人数",
          key: "noVote",
          width: "160",
        },
      ],
      tabAction: [{ label: "项目详情", action: "checkDetail" }],
      list: [],
      page: {
        total: 0,
        pageSize: 100000,
        pageNo: 1,
      },
      votePros: [],
      poll: 0,
      taskName: "",
      taskPoll: 0,
      voteDteial: null,
      noVote: 0,
    };
  },
  mounted() {
    this.getVote();
  },
  methods: {
    /**
     * 获取UserName
     */
    getUserName(ids) {
      let arr = [];
      if (ids != "") {
        ids.split(",").forEach((id) => {
          const sourceUserList = this.$cache.session.getJSON("sourceUserList");
          if (id == 0) return "系统";
          const user = _.find(sourceUserList, { userId: Number(id) });
          arr.push(
            user
              ? `${user.nickName}（${user.userName}）`
              : `-（${user.userName}）`
          );
        });
      }
      return arr.length > 0 ? arr.join("；") : "";
    },
    setTabCloumn(flag) {
      // recommendSort
      if (flag == 1 || flag == 3) {
        this.tabClums = [
          {
            title: "标准名称",
            key: "projectName",
          },
          {
            title: "项目申请人",
            key: "applyUser",
            width: "160",
            filter: {
              type: "user",
            },
          },
        ];
      } else {
        this.tabClums = [
          {
            title: "标准名称",
            key: "projectName",
          },
          {
            title: "项目申请人",
            key: "applyUser",
            width: "160",
            filter: {
              type: "user",
            },
          },
          {
            title: "排序",
            key: "recommendSort",
          },
        ];
      }
    },
    /**
     * 获取标准列表
     */
    getVote() {
      this.isTabLoading = true;
      const req = { id: this.id };
      Api.getProjectByVoteId(req).then((res) => {
        const { code, msg, data } = res;
        if (code === 200) {
          this.castVotekForm = _.cloneDeep(castVotekForm);
          this.voteDteial = data.tScpVote;
          this.noVote = data.noVote ?? 0;
          this.setTabCloumn(data.tScpVote.voteType);
          this.votePros = data.scpProjectApprovals.map((item) => {
            item["poll"] = 0;
            return item;
          });
          this.getPollNum();
        } else {
          // this.$message.error(msg);
        }
        this.isTabLoading = false;
      });
    },
    /**
     * 获取票数
     */
    getPollNum() {
      Api.checkVote({ voteTaskId: this.id }).then((res) => {
        const { code, msg, data } = res;
        if (code == 200) {
          this.votePolls = data;
          this.list = this.votePros.map((item) => {
            this.votePolls.forEach((poll) => {
              if (item.id == poll.projectId) {
                item.poll = poll.count;
              }
            });
            return item;
          });
        }
      });
    },
    /**
     * 查看投票项目详情
     */
    checkDetail(e) {
      if (e.projectType == 1) {
        this.proInfo.comp = (resolve) =>
          require([
            `@/views/work/enterpriseStdRevise/components/projectDetail.vue`,
          ], resolve);
      } else if (e.projectType == 2) {
        this.proInfo.comp = (resolve) =>
          require([
            `@/views/work/externalStdRevise/components/projectDetail.vue`,
          ], resolve);
      }
      this.proInfo.id = e.id + "";
      this.proInfo.projectPhase = e.projectPhase;
      this.proInfo.visible = true;
    },
    closePro(e) {
      this.proInfo.visible = false;
      this.$set(this.proInfo, "visible", false);
    },
    /**
     * 导出投票结果
     */
    exportVoteResult() {
      this.$confirm(
        `确定导出《${this.voteDteial.voteTaskName}投票结果》？`,
        "投票结果",
        {
          confirmButtonText: "确定导出",
          cancelButtonText: "取消",
          center: true,
        }
      )
        .then(() => {
          const req = {
            // isTemplate: e,
            // projectState: this.listReq.projectState,
            // projectType: 1,
          };
          this.downloadByPost(
            "/scplat/scpVoteDetail/exportExcelVote",
            { taskId: this.voteDteial.id },
            `${this.voteDteial.voteTaskName}投票结果.xlsx`
          );
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang="scss" scoped>
.cast-vote {
  width: 100%;
  height: 100%;
}
.line {
  line-height: 35px;
  width: 100%;
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
.footer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 25px;
}
</style>
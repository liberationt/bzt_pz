<template>
  <div class="cast-vote app-container">
    <div class="line">投票任务名称： {{ taskName }}</div>
    <div class="line" style="text-align: right">
      剩余票数：
      <span class="red-link-text">{{ poll }}</span
      >票
    </div>
    <!-- 浏览记录列表 -->
    <BztTable
      :tableData="{
        column: tabClums,
        data: list,
        action: tabAction,
        actionWidth: '210px',
      }"
      :hasIndex="true"
      :pageInfo="page"
      :isLoading="isTabLoading"
      @checkDetail="checkDetail"
    >
      <template slot="castVoteTopro" slot-scope="{ scope }">
        <span
          class="yellow-link-txt"
          @click="castVoteToProject(scope, 1)"
          v-if="scope.poll == 0"
        >
          投票
        </span>
        <span
          class="yellow-link-txt"
          @click="castVoteToProject(scope, 0)"
          v-if="scope.poll == 1"
        >
          取消投票
        </span>
      </template>
    </BztTable>
    <div class="footer">
      <div class="cancelBtn" @click="closeCastVote(false)">取消</div>
      <el-button
        class="submit-btn"
        @click="closeCastVote(true, 0)"
        :loading="isLoading"
      >
        放弃投票
      </el-button>
      <el-button
        class="submit-btn"
        @click="closeCastVote(true, 1)"
        :loading="isLoading"
      >
        确定投票
      </el-button>
    </div>
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
    todoTask: {
      type: Object,
      default: {
        businessObjId: "",
      },
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
      projects: [],
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
        // {
        //   title: "投票",
        //   key: "poll",
        //   width: "160",
        //   filter: {
        //     type: "checkBox",
        //     options: [
        //       {
        //         name: "投票",
        //         value: 1,
        //       },
        //     ],
        //     action: "castVoteTopro",
        //   },
        // },
      ],
      tabAction: [
        { label: "投票", type: "slot", btnName: "castVoteTopro" },
        { label: "项目详情", action: "checkDetail" },
      ],
      list: [],
      page: {
        total: 0,
        pageSize: 100000,
        pageNo: 1,
      },
      poll: 0,
      taskName: "",
      taskPoll: 0,
    };
  },
  mounted() {
    this.getVote();
  },
  methods: {
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
      const req = { id: this.todoTask.businessObjId };
      Api.getProjectByVoteId(req).then((res) => {
        const { code, msg, data } = res;
        if (code === 200) {
          this.castVotekForm = _.cloneDeep(castVotekForm);
          this.castVotekForm.voteTaskId = data.tScpVote.id;
          this.taskName = data.tScpVote.voteTaskName;
          this.taskPoll = data.tScpVote.canVoteNum;
          this.setTabCloumn(data.tScpVote.voteType);

          this.list = data.scpProjectApprovals.map((item) => {
            item["poll"] = 0;
            return item;
          });
          this.getPoll();
        } else {
          // this.$message.error(msg);
        }
        this.isTabLoading = false;
      });
    },
    castVoteToProject(data, val) {
      console.log(data, val);
      if (val == 1 && this.poll == 0) {
        this.$message.warning("可投票数已用完");
        return;
      }
      this.list.forEach((item) => {
        console.log(item.poll);
        if (item.id == data.id) {
          item.poll = val;
        }
      });
      this.getPoll();
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
     * 获取剩余票数
     */
    getPoll() {
      this.poll = this.taskPoll;
      this.list.forEach((item) => {
        console.log(item.poll);
        if (item.poll == 1) {
          this.poll -= 1;
        }
      });
      console.log(this.poll);
    },
    /**
     * 确认投票
     */
    closeCastVote(e, flag = null) {
      if (e == true) {
        if (flag == 1) {
          this.castVotekForm.expertId = this.userInfo.userId;
          let proIds = [];
          this.list.forEach((item) => {
            if (item.poll == 1) {
              proIds.push(item.id);
            }
          });
          if (proIds.length == 0) {
            this.$message.warning("还未给项目投票，请先投票");
            return;
          }
          this.castVotekForm.projectIdList = proIds;
          this.$confirm(
            `确认后提示：您已投出${
              this.taskPoll - this.poll
            }票，剩余可投票数为${this.poll}票，是否确认投票完成？`,
            "提交投票",
            {
              confirmButtonText: "确定投票",
              cancelButtonText: "取消",
              center: true,
            }
          )
            .then(() => {
              this.isLoading = true;
              Api.expertCastVote(this.castVotekForm).then((res) => {
                const { code } = res;
                if (code == 200) {
                  this.$message.success("操作成功");
                  this.$emit("success", "操作成功");
                }
                this.isLoading = false;
              });
            })
            .catch(() => {});
        } else if (flag == 0) {
          // 放弃投票
          this.isLoading = true;
          this.$prompt("请输入放弃原因：", "确认放弃投票？", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            inputPlaceholder: "请输入放弃投票原因",
          })
            .then(({ value }) => {
              const req = {
                voteTaskId: this.castVotekForm.voteTaskId,
                expertId: this.userInfo.userId,
                remark: value,
              };
              Api.giveUpVote(req).then((res) => {
                const { code } = res;
                if (code == 200) {
                  this.$message.success("操作成功");
                  this.$emit("success", "操作成功");
                }
                this.isLoading = false;
              });
            })
            .catch(() => {});
        }
      } else {
        this.$emit("close", null);
      }
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
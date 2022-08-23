<template>
  <div class="opinion-finish-detail-container">
    <el-table size="mini" v-loading="initLoading" :data="checkVoteSuccessList" stripe border style="width:100%">
      <el-table-column prop="nickName" align="center" label="征求意见用户" />
      <el-table-column prop="isFinish" align="center" label="是否完成征求意见">
        <template slot-scope="scope">
          <i v-if="scope.row.isFinish" class="el-icon-check" style="color:#67C23A;font-size:18px"></i>
          <i v-else class="el-icon-close" style="color:#F56C6C;font-size:18px"></i>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Api from "@api/process";
import { mapGetters } from "vuex";
export default {
  name: "opinionFinishDetail",
  props: {
    projectData: Object,
  },
  data() {
    return {
      // 审查意见情况
      checkVoteSuccessList: [],
      initLoading: false
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  methods: {
    // 获取已完成意见的人员列表
    getOpinionFinishListData() {
      this.initLoading = true;
      const condition = {
        projectId: this.projectData.id,
        projectType: this.projectData.projectType,
      };
      Api.getOpinionFinishList(condition).then((response) => {
        if (response.code === 200) {
          let opinionFinishList = response.rows;
          let opinionUser = this.projectData.advicerIds.split(",");

          // 意见反馈情况
          this.checkVoteSuccessList = [];
          opinionUser.forEach((userId, idx) => {
            let checkVoteUserId = _.find(opinionFinishList, {
              createUser: Number(userId),
            });
            if (checkVoteUserId != null) {
              this.checkVoteSuccessList.push({
                userId: userId,
                nickName: this.parseUser(userId),
                isFinish: true,
              });
            } else {
              this.checkVoteSuccessList.push({
                userId: userId,
                nickName: this.parseUser(userId),
                isFinish: false,
              });
            }
          });
          console.info("checkVoteSuccessList=>",this.checkVoteSuccessList)
          this.initLoading = false;
        }
      });
    },
    // 格式化用户
    parseUser(id) {
      let user = _.find(this.sourceUserList, { userId: Number(id) });
      return user ? user.nickName : "";
    },
  },
  mounted() {
    this.sourceUserList = this.$cache.session.getJSON("sourceUserList");
    this.getOpinionFinishListData();
  },
};
</script>

<style scoped lang="scss">
.opinion-finish-detail-container{
  margin-top: 20px;
}
</style>
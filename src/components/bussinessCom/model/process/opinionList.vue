<template>
  <div class="opinion-list-container">
    <el-table
      size="mini"
      :data="tableData"
      stripe
      border
      style="width: 100%"
      :default-sort="{ prop: 'createTime', order: 'descending' }"
    >
      <el-table-column type="index" label="序号" align="center" width="60" />
      <el-table-column
        prop="chapter"
        sortable
        label="章节"
        show-overflow-tooltip
        width="200"
      />
      <el-table-column
        prop="entries"
        sortable
        label="条款"
        show-overflow-tooltip
        width="80"
      />
      <el-table-column
        prop="content"
        label="选择内容"
        show-overflow-tooltip
        width="300"
      />
      <el-table-column
        prop="comment"
        label="意见内容"
        show-overflow-tooltip
        width="350"
      />
      <el-table-column
        prop="createUser"
        sortable
        label="提出人"
        show-overflow-tooltip
        :formatter="parseUser"
      />
      <el-table-column
        prop="companyName"
        sortable
        label="提出单位"
        show-overflow-tooltip
        :formatter="parseDept"
      />
      <el-table-column
        prop="contactInformation"
        sortable
        label="联系方式"
        show-overflow-tooltip
      />
      <el-table-column
        prop="createTime"
        sortable
        label="发表时间"
        width="150"
      />
      <el-table-column
        fixed="right"
        label="操作"
        width="60"
        v-if="this.showDelete && !isEnd"
      >
        <template slot-scope="scope">
          <el-button
            class="red-link-text"
            type="text"
            v-if="!isEnd && scope.row.createUser == userInfo.userId"
            size="small"
            @click="remove(scope.row)"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Api from "@api/process";
import { mapGetters } from "vuex";

export default {
  name: "opinionList",
  props: {
    projectData: Object,
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  data() {
    return {
      tableData: [],
      queryParams: {
        isAsc: "desc",
        orderByColumn: "create_time",
      },
      loading: false,
      sourceUserList: [],
      showDelete: false,
      isEnd: false,
    };
  },
  mounted() {
    this.sourceUserList = this.$cache.session.getJSON("sourceUserList");
    this.isShow();
    this.getList();
  },
  methods: {
    /**
     * 是否显示操作列
     */
    async isShow() {
      let show = false;
      let has = false;

      if (
        this.projectData.advicerIds != null &&
        this.projectData.projectState == 1106
      ) {
        this.projectData.advicerIds.split(",").forEach((item) => {
          if (item == this.userInfo.userId) {
            has = true;
          }
        });
      }
      if (has == true) {
        await Api.opinionIsEnd({ projectId: this.projectData.id }).then(
          (res) => {
            const { code, data } = res;
            console.log(code == 200 && data == 0);
            show = code == 200 && data == 0;
            this.isEnd = code == 200 && data == 1;
          }
        );
      }
      console.log(show);
      this.showDelete = show;
    },
    /**
     * 移除意见
     */
    remove(data) {
      this.$confirm(`确定移除意见吗？`, "意见", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
      })
        .then(() => {
          Api.removeOpinion(data.opinionId).then((res) => {
            const { code } = res;
            if (code == 200) {
              this.getList();
              this.$message.success("操作成功");
            }
          });
        })
        .catch(() => {});
    },
    /**
     * 获取信息列表
     */
    getList() {
      this.loading = true;
      const condition = _.merge(this.queryParams, {
        projectId: this.projectData.id,
        projectType: this.projectData.projectType,
      });
      Api.getOpinionList(condition).then((res) => {
        const { msg, data, code } = res;
        if (code === 200) {
          this.tableData = res.rows;
        }
        this.loading = false;
      });
    },
    parseUser(row) {
      let user = _.find(this.sourceUserList, { userId: row.createUser });
      return user ? user.nickName : "-";
    },
    parseDept(row) {
      let user = _.find(this.sourceUserList, { userId: row.createUser });
      return user ? user.deptName : "-";
    },
  },
};
</script>

<style scoped lang="scss">
.opinion-list-container {
  margin-top: 20px;
}
</style>
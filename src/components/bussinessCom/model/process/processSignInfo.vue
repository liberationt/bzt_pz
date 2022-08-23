<template>
  <div class="opinion-finish-detail-container">
    <el-table size="mini" :data="signList" stripe border style="width: 100%">
      <el-table-column prop="nickName" align="center" label="会签人" />
      <el-table-column prop="isFinish" align="center" label="是否会签通过">
        <template slot-scope="scope">
          <i
            v-if="scope.row.isFinish"
            class="el-icon-check"
            style="color: #67c23a; font-size: 18px"
          ></i>
          <i
            v-else
            class="el-icon-close"
            style="color: #f56c6c; font-size: 18px"
          ></i>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Api from "@api/process";
import { mapGetters } from "vuex";
export default {
  name: "process-sign-info",
  props: {
    countersign: {
      type: String,
      default: "" | null,
    },
    countersignSort: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      signList: [],
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  methods: {},
  mounted() {
    this.signList = [];
    const sourceUserList = this.$cache.session.getJSON("sourceUserList");
    if (this.countersign != null && this.countersign != "") {
      let arr = this.countersign.split(",");
      arr.forEach((id, index) => {
        let item = _.find(sourceUserList, {
          userId: Number(id),
        });
        item["isFinish"] = false;
        if (this.countersignSort != null && this.countersignSort > index + 1) {
          item["isFinish"] = true;
        }
        this.signList.push(item);
      });
    }
  },
};
</script>

<style scoped lang="scss">
.opinion-finish-detail-container {
  margin-top: 20px;
}
</style>
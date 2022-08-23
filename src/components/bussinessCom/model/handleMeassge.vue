<template>
  <div class="handle-info">
    <div class="info-detail" v-html="todoTask['content'] || ''">
      <!-- {{ todoTask["content"] || "" }} -->
    </div>
    <div class="footer">
      <div class="cancelBtn" @click="examineInfo(false)">取消</div>
      <el-button
        class="submit-btn"
        @click="examineInfo(true)"
        :loading="isLoading"
      >
        已阅
      </el-button>
    </div>
  </div>
</template>
<script>
import Api from "@api/infoModule";
import { BztCheckDetail } from "@components/basicCom/index";

export default {
  components: { BztCheckDetail },
  name: "handle-message",
  dicts: [],
  props: {
    todoTask: {
      type: Object,
      default: {
        bussnessId: "",
        content: "",
      },
    },
    handle: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      messageDetail: {},
    };
  },
  watch: {
    todoTask: {
      deep: true,
      handler(val, oldVal) {
        this.getTaskDetail();
      },
    },
  },
  mounted() {
    this.getTaskDetail();
  },
  methods: {
    /**
     * 获取任务详情
     */
    examineInfo(e) {
      if (e == false) {
        this.$emit("close", true);
      } else {
        const req = {
          taskId: this.todoTask.taskId,
          state: 1,
        };
        Api.readTask(req).then((res) => {
          // 打开消息 标记为已读
          const { code, msg, data } = res;
          // this.pageChange(1);
          if (code !== 200) {
            this.$message.error(msg);
          }
          //更新消息数量
          Api.listCountMessage().then((res) => {
            this.$emit("success", true);
          });
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.handle-info {
  .infoForm {
    margin-top: 25px;
    .form-title {
      font-size: 16px;
      font-weight: 600;
      border-left: $bule 3px solid;
      line-height: 18px;
      padding-left: 8px;
      margin-bottom: 15px;
    }
  }
  .footer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 25px;
  }
}
</style>
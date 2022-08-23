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
          :hasIndex="true"
          :pageInfo="page"
          :isLoading="isTabLoading"
        >
        </BztTable>
      </div>
    </template>
  </BztDialog>
</template>
<script>
import { BztDialog, BztTable } from "@components/basicCom/index.js";
import Api from "@api/process";
import { mapGetters } from "vuex";

export default {
  name: "node-list",
  components: {
    BztDialog,
    BztTable,
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
    taskId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      dialogInfo: {
        visible: false,
        title: "查看",
        width: "900px",
      },
      tabClums: [
        {
          title: "处理人部门",
          key: "ownerDeptId",
          width: "180",
          filter: {
            type: "dept",
          },
        },
        {
          title: "处理人",
          key: "ownerId",
          minWidth: "280",
          filter: {
            type: "user",
          },
        },
        {
          title: "状态",
          key: "hasFinished",
          width: "100",
          filter: {
            type: "filter",
            isHtml: true,
            action: (data) => {
              let str = data == 0 ? "未处理" : "已处理";
              if (data == 0) {
                str = `<span class="ing-tag">${str}</span>`;
              } else {
                str = `<span class="success-tag">${str}</span>`;
              }
              return str;
            },
          },
        },
        {
          title: "处理节点",
          key: "nodeName",
          width: "180",
        },
      ],
      page: {
        total: 0,
        pageSize: 1000,
        pageNo: 1,
      },
      list: [],
      isTabLoading: false,
    };
  },
  mounted() {
    this.dialogInfo.title = "项目处理节点";
    this.dialogInfo.visible = this.visiable;
    this.getList();
  },
  watch: {
    visiable: {
      handler(val) {
        this.dialogInfo.title = "项目处理节点";
        this.dialogInfo.visiable = val;
      },
    },
  },
  methods: {
    /**
     * 获取结果列表
     */
    getList() {
      const req = {
        adviceTaskId: this.taskId,
      };
      this.isTabLoading = true;
      Api.getChildProcessNodes(req).then((res) => {
        this.isTabLoading = false;
        const { code, data, msg } = res;
        if (code === 200) {
          this.list = data;
        } else {
          // this.$message.error(msg);
        }
      });
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
</style>
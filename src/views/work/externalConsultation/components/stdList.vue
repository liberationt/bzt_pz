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
          @downloadFile="downloadFile"
        >
        </BztTable>
      </div>
    </template>
  </BztDialog>
</template>
<script>
import {
  BztDialog,
  BztTable,
  BztPageContrl,
} from "@components/basicCom/index.js";
import Api from "@api/process";
import { mapGetters } from "vuex";

export default {
  components: {
    BztDialog,
    BztTable,
    BztPageContrl,
  },
  name: "std-list",
  computed: {
    ...mapGetters(["userInfo"]),
  },
  props: {
    visiable: {
      type: Boolean,
      default: false,
    },
    formData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      dialogInfo: {
        visible: false,
        title: "查看结果",
        width: "900px",
        footer: true,
        submintText: "导出征求意见汇总表",
      },
      tabClums: [
        {
          title: "处理人",
          key: "createUser",
          width: "180",
          filter: {
            type: "user",
          },
        },
        {
          title: "文件名",
          key: "currentAttachments",
          filter: {
            type: "filter",
            isFiles: true,
            action: (data) => {
              return data == null ? [] : JSON.parse(data);
            },
          },
        },
        {
          title: "上传时间",
          key: "updateTime",
          width: "230",
        },
      ],

      list: [],
      page: {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      },
      listReq: {
        pageSize: "",
        pageNum: "",
      },
      isTabLoading: false,
    };
  },
  mounted() {
    this.dialogInfo.title = "查看结果";
    this.dialogInfo.visible = this.visiable;
    this.dialogInfo.footer =
      this.formData.taskState == 3108
        ? this.hasPermission("standardBusinessStaff")
        : this.formData.taskState == 32004
        ? this.formData.workItemId != null
        : false;
    this.getList();
  },
  watch: {
    visiable: {
      handler(val) {
        this.dialogInfo.title = "查看结果";
        this.dialogInfo.footer =
          this.formData.taskState == 3108
            ? this.hasPermission("standardBusinessStaff")
            : this.formData.taskState == 32004
            ? this.formData.workItemId != null
            : false;
        this.dialogInfo.visiable = val;
      },
    },
  },
  methods: {
    /**
     * 获取结果列表
     */
    getList() {
      this.listReq = {
        adviceTaskId: this.formData.adviceTaskId,
        childAdviceTaskId: this.formData.childAdviceTaskId,
        type:
          this.formData.taskState == 32004
            ? 1
            : this.formData.taskState == 3108 || this.formData.taskState == 3110
            ? 2
            : "",
      };
      Api.getFileByAdministrators(this.listReq).then((res) => {
        const { code, data, msg } = res;
        if (code === 200) {
          this.list = [];
          data.forEach((item) => {
            if (item.processAs == 5) {
              this.list.push(item);
            } else if (
              this.formData.taskState == 3108 ||
              this.formData.taskState == 3110
            ) {
              this.list.push(item);
            }
          });
        } else {
          // this.$message.error(msg);
        }
      });
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
     * 查看附件
     */
    checkFile(e) {
      Object.keys(this.fileReq).map((key) => {
        if (key === "taskName") {
          this.fileReq[key] = `外部征求意见_标准_${e[key]}`;
        } else {
          this.fileReq[key] = e[key];
        }
      });
      this.checkFileList = JSON.parse(e.fileList);
      console.log(this.checkFileList);
      this.checkFileVisiabel = true;
    },
    /**
     * 下载附件
     * @param {*} file 要下载的附件的信息
     */
    downloadFile(file) {
      // this.download(file.url, false);
      // window.open(file.url);
      // location.href = `${process.env.VUE_APP_BASE_API}/${file.url}`;
      console.log(file);
      this.downLoadByURL(file.url, file.name);
    },
    /**
     * 关闭弹框
     */
    closeDialog(e) {
      if (e == true) {
        const req = {
          adviceTaskId: this.formData.adviceTaskId,
          childAdviceTaskId: this.formData.childAdviceTaskId,
          type:
            this.formData.taskState == 32004
              ? 1
              : this.formData.taskState == 3108
              ? 2
              : "",
        };
        this.downloadByPost(
          "/scplat/adviceCollectingTaskAssign/downloadSolicitOpinionsWord",
          req,
          `${new Date().getFullYear()}年度外部征求意见汇总表.docx`
        );
      } else {
        this.$emit("save", null);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.enterprise-std {
  width: 100%;
  height: 100%;
  .std-list-content {
    border: 1px solid #efefef;
    padding: 15px;
    border-radius: 0px 0px 5px 5px;
  }
}
</style>
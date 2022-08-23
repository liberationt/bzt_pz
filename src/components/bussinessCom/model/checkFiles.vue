<template>
  <BztDialog
    :dialogInfo="dialogInfo"
    @close="closeDialog($event)"
    :appendTobody="false"
  >
    <template slot="body">
      <div class="file-list" v-if="fileList.length > 0">
        <template v-for="(file, index) in fileList">
          <div class="file" :key="`file_${index}`" @click="downloadFile(file)">
            <i class="el-icon-document" />{{ file.name }}
          </div>
        </template>
      </div>
      <el-empty v-else description="暂无附件"></el-empty>
    </template>
    <template
      slot="footer"
      v-if="showDownload !== false && fileList.length > 0"
    >
      <el-button class="submit-btn" @click="downloadAll">
        <i class="el-icon-download" />
        一键下载
      </el-button>
    </template>
  </BztDialog>
</template>
<script>
import { BztDialog, BztUploadFile } from "@components/basicCom/index";
import Api from "@api/process";
import { TecCommittees } from "@components/bussinessCom/index";

export default {
  components: { BztDialog, BztUploadFile, TecCommittees },
  name: "checkFiles",
  props: {
    visiable: {
      type: Boolean,
      default: false,
    },
    fileReq: {
      type: Object,
      default: {
        businessObjType: "",
        businessObjId: "",
        taskName: "",
      },
    },
    showDownload: {
      type: Boolean,
      default: true,
    },
    fileListVal: {
      type: Array | Object,
      default: null,
    },
    hasFile: {
      type: Boolean,
      default: false,
    },
    downLoadUrl: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      dialogInfo: {
        visible: false,
        title: "查看附件",
        width: "900px",
        footer: false,
      },
      fileList: [],
    };
  },
  watch: {
    visiable(val) {
      this.dialogInfo.visible = this.visiable;
      if (this.visiable === true) {
        this.getFiles();
      }
    },
  },
  mounted() {
    this.dialogInfo.visible = this.visiable;
    if (this.visiable === true && this.fileReq.businessObjId) {
      this.getFiles();
    }
  },
  methods: {
    /**
     * 获取附件列表
     */
    getFiles() {
      if (this.hasFile != true) {
        const req = {
          businessObjType: this.fileReq.businessObjType,
          businessObjId: this.fileReq.businessObjId,
        };
        this.fileList = [];
        Api.getAttachmentFile(req).then((res) => {
          const { code, data, msg } = res;
          if (code === 200) {
            this.fileList = data;
          } else {
            // this.$message.error(msg);
          }
        });
      } else {
        this.fileList = this.fileListVal;
      }
    },
    closeDialog(e) {
      this.dialogInfo.visible = false;
      this.$emit("close", null);
    },
    /**
     * 下载附件
     * @param {*} file 要下载的附件的信息
     */
    downloadFile(file) {
      // this.download(file.url, false);
      // window.open(file.url);
      // location.href = `${process.env.VUE_APP_BASE_API}/${file.url}`;
      this.downLoadByURL(file.url, file.name);
    },
    /**
     * 一键下载
     */
    downloadAll() {
      this.downloadByPost(
        this.downLoadUrl,
        this.fileReq,
        `${this.fileReq.taskName}.zip`
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.file-list {
  height: 100%;
  overflow: auto;
  .file {
    line-height: 30px;
    color: $bule;
    cursor: pointer;
    i {
      margin-right: 10px;
    }
    &:hover {
      font-size: 15px;
    }
  }
}
</style>
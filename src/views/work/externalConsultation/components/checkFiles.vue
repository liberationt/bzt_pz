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
    <!-- <template
      slot="footer"
      v-if="fileList.length > 0"
    >
      <el-button class="submit-btn" @click="downloadAll">
        <i class="el-icon-download" />
        一键下载
      </el-button>
    </template> -->
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
        adviceTaskId:'',
        processAs:6
      },
    },
    showDownload: {
      type: Boolean,
      default: true,
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
    this.getFiles();
  },
  methods: {
    /**
     * 获取附件列表
     */
    getFiles() {
      Api.queryFile(this.fileReq).then((res) => {
        const { code, rows, msg } = res;
        if (code === 200) {
          let fileList = []
          if(rows&&rows.length){
            fileList= JSON.parse(rows[0].extendAttachments)
          }
          if(fileList.length){
            this.fileList = fileList;
          }else{
            this.fileList = []
          }
        } 
      })
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
        `相关附件.zip`
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
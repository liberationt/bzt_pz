<template>
  <div class="process-files">
    <div class="operation-line">
      <div class="submit-btn" @click="downloadAll()">
        <i class="el-icon-download" />
        一键下载
      </div>
    </div>
    <template v-for="(item, index) in dict.type.inter_revision_process_phase">
      <div class="stages" :key="`stages_${index}`">
        <template v-for="(stage, index) in fileList">
          <div
            v-if="item.value == stage.phase"
            :key="`stage_${index}`"
            class="stage-li"
          >
            <div class="stage-title">{{ item.label }}</div>

            <template v-for="(node, index) in stage.type">
              <div :key="`node_${index}`" class="node-li">
                <div class="node-title">{{ node.name }}</div>
                <div class="files">
                  <template v-for="(file, j) in node.list">
                    <div class="file" :key="`file_${j}`">
                      <span :title="file.name" @click="downloadFile(file)">
                        {{
                          getFileName(
                            file.name,
                            file.version,
                            file.url.split(".")[1]
                          )
                        }}
                      </span>
                      <span>{{ file.createTime }}</span>
                    </div>
                  </template>
                </div>
              </div>
            </template>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>
<script>
import Api from "@api/process";
export default {
  name: "process-files",
  props: ["formValue","projectId"],
  dicts: ["inter_revision_process_phase"],
  data() {
    return {
      fileList: [],
    };
  },
  mounted() {
    this.getFileList();
  },
  methods: {
    /**
     * 获取过程文档
     */
    getFileList() {
      const req = {
        businessObjType: this.formValue.projectType,
        businessObjId: this.projectId,
      };
      Api.getFileListByProjectWfType(req).then((res) => {
        const { data, msg, code } = res;
        if (code === 200) {
          this.fileList = data;
          console.log(this.fileList);
        } else {
          // this.$message.error(msg);
        }
      });
    },
    getTpyes() {
      let type = [this.formValue.projectType];
      if (
        this.formValue.projectType == 1 ||
        this.formValue.projectType == 2 ||
        this.formValue.projectType == 10
      ) {
        type = [this.formValue.projectType];
      }
      if (this.formValue.projectType == 4) {
        type = [1, 4];
      }
      if (this.formValue.projectType == 5) {
        type = [2, 5];
      }
      return type;
    },
    getFileName(fileName, vesion, type) {
      let str = "";
      fileName.split(".").forEach((name, index) => {
        if (index == 0 || index < fileName.split(".").length - 1) {
          str += name;
        }
      });
      return `${str}V${vesion}.${type}`;
    },
    /**
     * 下载附件
     * @param {*} data 附件信息
     */
    downloadFile(file) {
      this.downLoadByURL(
        file.url,
        this.getFileName(file.name, file.version, file.url.split(".")[1])
      );
    },
    /**
     * 一键下载
     */
    downloadAll() {
      let hasFile = false;
      this.fileList.forEach((file) => {
        file.type.forEach((item) => {
          if (item.list.length > 0) {
            hasFile = true;
          }
        });
      });
      if (hasFile == false) {
        this.$message.warning("暂无过程文档");
      } else {
        const req = {
          businessObjType: this.formValue.projectType,
          businessObjId: this.formValue.id,
          zipName: this.formValue.projectName,
        };
        this.downloadByPost(
          "/scplat/attachmentFile/downloadByTypeAndId",
          req,
          `${this.formValue.projectName}_过程文档.zip`
        );
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.process-files {
  color: #555555;
  margin-bottom: 60px;
  .operation-line {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-top: 38px;
  }
  .stage-li {
    width: 90%;
    margin: 15px auto;
    margin-top: -35px;
    min-width: 900px;
    padding: 15px 0px;
    .stage-title {
      font-size: 18px;
      font-weight: 600;
    }
    .node-li {
      padding: 15px 8px;
      .node-title {
        border-left: 5px solid $bule;
        background: rgba(24, 144, 255, 0.0823529411764706);
        line-height: 38px;
        padding: 3px 8px;
        font-size: 16px;
        border-radius: 4px;
        color: #333333;
      }
      .files {
        padding: 15px;
        font-size: 15px;
        .file {
          line-height: 30px;
          color: $bule;
          cursor: pointer;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          &:hover {
            color: $link-text-hover-color;
          }
        }
      }
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    height: 60px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background: #ffffff;
    box-shadow: $bule 1px 0px 15px -8px;
    div {
      align-self: end;
    }
  }
}
</style>
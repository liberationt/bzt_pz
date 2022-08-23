<template>
  <BztDialog :dialogInfo="dialogInfo" @close="close" :appendTobody="false">
    <template slot="body">
      <!-- copyTemp -->
      <el-form
        v-if="temp != null"
        :model="temp"
        ref="temp"
        label-suffix=":"
        label-width="100px"
        class="temp"
        inline
      >
        <div
          class="yellow-link-txt"
          @click="copyTemp"
          style="float: right"
          v-hasPermi="['process-temp:copy']"
        >
          <i class="el-icon-document-copy" />
          复制流程模板
        </div>
        <el-form-item label="流程模板Id">
          {{ temp.id }}
        </el-form-item>
        <el-form-item label="流程模板编码">
          {{ temp.code }}
        </el-form-item>
        <el-form-item label="所属单位">
          {{ temp.org }}
        </el-form-item>
        <el-form-item label="类别">
          {{ temp.type == 0 ? "主流程" : "子流程" }}
        </el-form-item>
        <el-form-item label="版本">{{ temp.version }} </el-form-item>
        <el-form-item label="状态">
          <span v-if="temp.state == 0" class="grey-tag">禁用</span>
          <span v-else class="ing-tag">可用</span>
        </el-form-item>
        <el-form-item label="JSON文件">
          <a class="file link-text" @click="downloadFile(temp.propPath)">
            <i class="el-icon-document" />
          </a>
        </el-form-item>
        <el-form-item label="流程图片">
          <a class="file link-text" @click="downloadFile(temp.thumbPath)">
            <img :src="`${baseUrl}${temp.thumbPath}`" />
          </a>
        </el-form-item>

        <el-form-item label="模板数据结构" style="width: 100%">
          <JsonEditor
            style="width: 100%"
            :content="temp.content"
            :theme="'crimson_editor'"
          />
        </el-form-item>
        <el-form-item label="描述" style="width: 100%">
          {{ temp.tempDesc }}
        </el-form-item>
      </el-form>
    </template>
  </BztDialog>
</template>
<script>
import { BztDialog, JsonEditor } from "@components/basicCom/index";
import Api from "@api/processtemp";

export default {
  name: "process-temp-detail",
  components: { BztDialog, JsonEditor },
  props: {
    visiable: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "模板",
    },
    detail: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      dialogInfo: {
        visible: false,
        title: "运行Api",
        width: "900px",
        footer: false,
      },
      temp: null,
      baseUrl: process.env.VUE_APP_NODE_FILE,
    };
  },
  mounted() {
    this.dialogInfo.visible = this.visiable;
    this.dialogInfo.title = this.title;
    this.baseUrl = process.env.VUE_APP_NODE_FILE;
    this.getTempInfo();
  },
  methods: {
    /**
     * 获取模板详细信息
     */
    getTempInfo() {
      const req = { tempId: this.detail.id };
      Api.getWFTemplate(req).then((res) => {
        const { code, data } = res;
        if (code == 200) {
          this.temp = data;
          this.temp.content =
            data.content == null
              ? "{}"
              : JSON.stringify(JSON.parse(data.content), null, 2);
        }
      });
    },
    close(e) {
      this.dialogInfo.visible = false;
      this.$emit("close", e);
    },
    /**
     * 附件下载
     */
    downloadFile(data) {
      this.downLoadByURL(data, this.temp.name, process.env.VUE_APP_NODE_FILE);
    },
    /**
     * 复制流程模板
     */
    copyTemp() {
      const that = this;
      this.$confirm(
        `流程模板：《${this.temp.name}》存在实例,是否复制此流程模板 ?`,
        "提示",
        {
          confirmButtonText: "复制",
          cancelButtonText: "取消",
          center: true,
        }
      )
        .then(() => {
          let req = _.cloneDeep(that.temp);
          req.id = null;
          req.version = that.temp.version + 1;
          Api.setWFTemplate(req).then((res) => {
            if (res.code === 200) {
              this.close(true);
              this.dialogInfo.visible = false;
              this.$message.success(
                `操作成功,复制保存的流程 Id 为:${res.data.tempId}`
              );
            } else {
              // this.$message.error(msg);
            }
          });
        })
        .catch(() => {
          that.$emit("close", null);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.footer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 25px;
}
::v-deep .temp {
  .el-form-item {
    width: 48%;
    margin-bottom: 12px;
    &:last-child {
      margin-bottom: 0;
    }
    .el-form-item__content {
      width: calc(100% - 100px);
    }
  }
}
</style>
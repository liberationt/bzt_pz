<template>
  <div class="component-upload-image">
    <template v-if="type === 'picture'">
      <el-upload
        :action="uploadImgUrl"
        list-type="picture-card"
        :on-success="handleUploadSuccess"
        :before-upload="handleBeforeUpload"
        :limit="limit"
        :on-error="handleUploadError"
        :on-exceed="handleExceed"
        name="file"
        :on-remove="handleRemove"
        :show-file-list="true"
        :headers="headers"
        :file-list="fileList"
        :on-preview="handlePictureCardPreview"
        :class="{ hide: this.fileList.length >= this.limit }"
        :disabled="disabled"
      >
        <i class="el-icon-plus" v-if="disabled == false"></i>
      </el-upload>

      <!-- 上传提示 -->
      <div
        class="el-upload__tip"
        slot="tip"
        v-if="showTip && disabled == false"
      >
        请上传
        <template v-if="fileSize">
          大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b>
        </template>
        <template v-if="fileType.length > 0">
          格式为 <b style="color: #f56c6c">{{ fileType.join(" / ") }}</b>
        </template>
        的文件
      </div>
    </template>
    <template v-else-if="type === 'drop'">
      <el-upload
        :action="uploadImgUrl"
        drag
        :on-success="handleUploadSuccess"
        :before-upload="handleBeforeUpload"
        :limit="limit"
        :on-error="handleUploadError"
        :on-exceed="handleExceed"
        name="file"
        :on-remove="handleRemove"
        :show-file-list="true"
        :headers="headers"
        :file-list="fileList"
        :on-preview="handlePictureCardPreview"
        :class="{ hide: this.fileList.length >= this.limit }"
        :disabled="disabled"
        style="width: 100%"
        class="drap-upload"
      >
        <i class="el-icon-upload" v-if="disabled == false"></i>
        <div class="el-upload__text" v-if="disabled == false">
          将文件拖到此处，或<em>点击上传</em>
        </div>

        <!-- 上传提示 -->
        <div
          class="el-upload__tip"
          slot="tip"
          v-if="showTip && disabled == false"
        >
          请上传
          <template v-if="fileSize">
            大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b>
          </template>
          <template v-if="fileType.length > 0">
            格式为
            <b style="color: #f56c6c">{{ fileType.join(" / ") }}</b>
          </template>
          的文件
        </div>
      </el-upload>
    </template>

    <template v-else-if="type === 'drop-async'">
      <el-upload
        ref="fileUpload"
        :auto-upload="false"
        :action="uploadImgUrl"
        drag
        :on-success="handleUploadSuccess"
        :before-upload="handleBeforeUpload"
        :limit="limit"
        :on-error="handleUploadError"
        :on-exceed="handleExceed"
        name="file"
        :on-remove="handleRemove"
        :show-file-list="true"
        :headers="headers"
        :file-list="fileList"
        :on-preview="handlePictureCardPreview"
        :class="{ hide: this.fileList.length >= this.limit }"
        :disabled="disabled"
        style="width: 100%"
        class="drap-upload"
      >
        <i class="el-icon-upload" v-if="disabled == false"></i>
        <div class="el-upload__text" v-if="disabled == false">
          将文件拖到此处，或<em>点击上传</em>
        </div>

        <!-- 上传提示 -->
        <div
          class="el-upload__tip"
          slot="tip"
          v-if="showTip && disabled == false"
        >
          请上传
          <template v-if="fileSize">
            大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b>
          </template>
          <template v-if="fileType.length > 0">
            格式为
            <b style="color: #f56c6c">{{ fileType.join(" / ") }}</b>
          </template>
          的文件
        </div>
      </el-upload>
    </template>

    <template v-else>
      <el-upload
        :action="uploadImgUrl"
        :on-remove="handleRemove"
        :on-success="handleUploadSuccess"
        :before-upload="handleBeforeUpload"
        :on-error="handleUploadError"
        :on-exceed="handleExceed"
        :on-preview="handlePictureCardPreview"
        multiple
        :headers="headers"
        :limit="limit"
        :file-list="value"
        :class="{ hide: this.fileList.length >= this.limit }"
        :disabled="disabled"
      >
        <el-button size="small" type="primary" v-if="disabled == false"
          >点击上传</el-button
        >
        <!-- 上传提示 -->
        <div
          class="el-upload__tip"
          slot="tip"
          v-if="showTip && disabled == false"
        >
          请上传
          <template v-if="fileSize">
            大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b>
          </template>
          <template v-if="fileType.length > 0">
            格式为 <b style="color: #f56c6c">{{ fileType.join(" / ") }}</b>
          </template>
          的文件
        </div>
      </el-upload>
    </template>

    <el-dialog
      :visible.sync="dialogVisible"
      title="预览"
      width="800"
      append-to-body
    >
      <img
        :src="dialogImageUrl"
        style="display: block; max-width: 100%; margin: 0 auto"
      />
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";

export default {
  props: {
    value: [String, Object, Array],
    // 文件数量限制
    limit: {
      type: Number,
      default: 10,
    },
    // 大小限制(MB)
    fileSize: {
      type: Number,
      default: 100,
    },
    // 文件类型, 例如['png', 'jpg', 'jpeg']
    fileType: {
      type: Array,
      default: () => [],
    },
    // 是否显示提示
    isShowTip: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    actionUrl: {
      type: String,
      default: "",
    },
    // 上传接口返回值是否是文件列表
    isFile: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      hideUpload: false,
      baseUrl: process.env.VUE_APP_BASE_API,
      uploadImgUrl: process.env.VUE_APP_BASE_API + "/common/upload", // 上传的图片服务器地址
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      fileList: [],
    };
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          // 首先将值转为数组
          const list = Array.isArray(val) ? val : this.value.split(",");
          // 然后将数组转为对象数组
          this.fileList = list.map((item) => {
            if (typeof item === "string") {
              if (item.indexOf(this.baseUrl) === -1) {
                item = { name: this.baseUrl + item, url: this.baseUrl + item };
              } else {
                item = { name: item, url: item };
              }
            }
            return item;
          });
        } else {
          this.fileList = [];
          return [];
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    if (
      this.actionUrl != undefined &&
      this.actionUrl != null &&
      this.actionUrl != ""
    ) {
      this.uploadImgUrl = process.env.VUE_APP_BASE_API + this.actionUrl;
    }
  },
  computed: {
    // 是否显示提示
    showTip() {
      return this.isShowTip && (this.fileType || this.fileSize);
    },
  },
  methods: {
    // 删除图片
    handleRemove(file, fileList) {
      const findex = this.fileList.map((f) => f.name).indexOf(file.name);
      if (findex > -1) {
        this.fileList.splice(findex, 1);
        this.$emit("upload-change", this.fileList);
      }
    },
    // 上传成功回调
    handleUploadSuccess(res) {
      if (this.isFile == true) {
        if (res.data && res.data.fileName) {
          this.fileList.push({ name: res.data.fileName, url: res.data.url });
          this.$emit("upload-change", this.fileList);
          this.loading.close();
        }
      } else {
        this.$emit("upload-change", res);
        this.loading.close();
      }
    },
    // 上传前loading加载
    handleBeforeUpload(file) {
      let isImg = false;
      if (this.fileType.length) {
        let fileExtension = "";
        if (file.name.lastIndexOf(".") > -1) {
          fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
        }
        isImg = this.fileType.some((type) => {
          if (file.type.indexOf(type) > -1) return true;
          if (fileExtension && fileExtension.indexOf(type) > -1) return true;
          return false;
        });
      } else {
        isImg = file.type.indexOf("image") > -1;
      }

      // if (!isImg) {
      //   this.$message.error(
      //     `文件格式不正确, 请上传${this.fileType.join("/")}图片格式文件!`
      //   );
      //   return false;
      // }
      if (this.fileSize) {
        const isLt = file.size / 1024 / 1024 < this.fileSize;
        if (!isLt) {
          this.$message.error(`文件大小不能超过 ${this.fileSize} MB!`);
          return false;
        }
      }
      this.loading = this.$loading({
        lock: true,
        text: "上传中",
        background: "rgba(0, 0, 0, 0.7)",
      });
    },
    // 文件个数超出
    handleExceed() {
      this.$message.error(`上传文件数量不能超过 ${this.limit} 个!`);
    },
    // 上传失败
    handleUploadError() {
      this.$message({
        type: "error",
        message: "上传失败",
      });
      this.loading.close();
    },
    // 预览
    handlePictureCardPreview(file) {
      if (this.type == "picture") {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      } else {
        console.log(file);
        this.downLoadByURL(file.url, file.name);
      }
    },
    // 对象转成指定字符串分隔
    listToString(list, separator) {
      let strs = "";
      separator = separator || ",";
      for (let i in list) {
        strs += list[i].url.replace(this.baseUrl, "") + separator;
      }
      return strs != "" ? strs.substr(0, strs.length - 1) : "";
    },
    // 选择文件后上传至服务器
    fileUpload() {
      this.$refs.fileUpload.submit();
    },
  },
};
</script>
<style scoped lang="scss">
// .el-upload--picture-card 控制加号部分
::v-deep.hide .el-upload--picture-card {
  display: none;
}
// 去掉动画效果
::v-deep .el-list-enter-active,
::v-deep .el-list-leave-active {
  transition: all 0s;
}

::v-deep .el-list-enter,
.el-list-leave-active {
  opacity: 0;
  transform: translateY(0);
}
::v-deep .drap-upload {
  width: 100%;
  .el-upload {
    width: 100%;
  }
  .el-upload-dragger {
    width: 100%;
    border-color: $bule;
  }
}
</style>


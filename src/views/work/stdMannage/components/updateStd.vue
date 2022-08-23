<template>
  <BztDialog
    :dialogInfo="dialogInfo"
    @close="closeDialog($event)"
    :appendTobody="false"
  >
    <template slot="body">
      <el-form
        :model="stdForm"
        :rules="rules"
        ref="stdForm"
        label-suffix=":"
        label-width="100px"
        class="stdForm"
        v-if="stdForm != null"
      >
        <el-form-item label="标准类型">
          <el-radio-group v-model="stdType" @change="typeChange">
            <el-radio :label="1">自定义上传 </el-radio>
            <el-radio :label="2">购置入库</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="替换标准"
          v-if="stdForm.id == null && stdType == 1"
        >
          <el-select
            v-model="stdIds"
            multiple
            placeholder="请选择被替换标准"
            filterable
            remote
            :filter-method="remoteMethod"
            :loading="stdLoading"
            loading-text="搜索中..."
            clearable
          >
            <template v-for="(item, index) in stdList">
              <el-option
                :key="`std_${index}`"
                :label="item.stdName"
                :value="`${item.stdId}`"
              />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item
          label="标准名称"
          prop="stdName"
          v-if="stdForm.id == null && stdType == 1"
        >
          <el-input v-model="stdForm.stdName" placeholder="请输入标准名称" />
        </el-form-item>
        <el-form-item
          label="标准名称"
          prop="stdName"
          v-if="stdForm.id == null && stdType == 2"
        >
          <el-select
            v-model="stdForm.applyId"
            placeholder="请选择购置标准"
            clearable
            @visible-change="getGZStdList"
            @change="gzStdChange($event)"
          >
            <template v-for="(item, index) in gzStdList">
              <el-option
                :key="`std_${index}`"
                :label="item.stdName"
                :value="`${item.id}`"
              />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item
          label="标准编号"
          prop="stdNo"
          v-if="stdForm.id == null && stdType == 1"
        >
          <el-input v-model="stdForm.stdNo" placeholder="请输入标准编号" />
        </el-form-item>
        <el-form-item
          label="标准编号"
          prop="stdNo"
          v-if="stdForm.id == null && stdType == 2"
        >
          <el-input v-model="stdForm.stdNo" placeholder="请输入标准编号" />
        </el-form-item>
        <el-form-item
          label="发布日期"
          prop="publishdate"
          v-if="stdForm.id == null"
        >
          <el-date-picker
            v-model="stdForm.publishdate"
            type="date"
            placeholder="选择发布日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
          />
          <!-- :picker-options="pickerOptions" -->
        </el-form-item>
        <el-form-item label="实施日期" prop="dodate" v-if="stdForm.id == null">
          <el-date-picker
            v-model="stdForm.dodate"
            type="date"
            placeholder="选择发布日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="废止日期" prop="expiredate">
          <el-date-picker
            v-model="stdForm.expiredate"
            type="date"
            placeholder="选择发布日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="是否公开" prop="isOpen" v-if="stdForm.id == null">
          <el-radio-group v-model="stdForm.isOpen">
            <el-radio :label="0"> 公开 </el-radio>
            <el-radio :label="1"> 不公开 </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="正文附件" ref="upload">
          <!-- prop="filedir" -->
          <BztUploadFile
            :value="files"
            :limit="1"
            :fileSize="100"
            @upload-change="fileChange"
          />
        </el-form-item>
        <el-form-item label="修改单" v-if="stdForm.id != null">
          <!-- prop="filedir" -->
          <BztUploadFile
            :value="modifyFile"
            :limit="1"
            :fileSize="100"
            @upload-change="modifyFileChange"
          />
        </el-form-item>
      </el-form>
    </template>
  </BztDialog>
</template>
<script>
import Api from "@api/process";
import { BztDialog, BztUploadFile } from "@components/basicCom/index";
import stdApi from "@api/infoModule";

const stdForm = {
  id: null,
  stdType: 1400,
  stdName: "",
  publishdate: "",
  dodate: "",
  expiredate: "",
  stdNo: "",
  stdFile: "",
  filedir: "",
  isfile: 0,
  isOpen: 0, // 0为公开 1为不公开
  replaceId: "",
  modifyFile: "", // 修改单
  applyId: null,
};
export default {
  name: "upddate-std",
  components: { BztDialog, BztUploadFile },
  props: {
    visiable: {
      type: Boolean,
      default: false,
    },
    stdInfo: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      dialogInfo: {
        visible: false,
        title: "添加标准",
        width: "900px",
        footer: true,
        loadding: false,
        submintText: "提交",
      },
      stdForm: null,
      files: [],
      stdIds: [],
      rules: {
        stdName: {
          required: true,
          message: "请输入标准名称",
          trigger: "blur",
        },
        stdNo: {
          required: true,
          message: "请输入标准编号",
          trigger: "blur",
        },
        publishdate: {
          required: true,
          message: "请选择发布日期",
          trigger: "blur",
        },
        dodate: {
          required: true,
          message: "请选择实施日期",
          trigger: "blur",
        },
        // expiredate: {
        //   required: true,
        //   message: "请选择废止日期",
        //   trigger: "blur",
        // },
        isOpen: {
          required: true,
          message: "请选择是否公开",
          trigger: "change",
        },
        filedir: {
          required: true,
          message: "请上传附件",
          trigger: "change",
        },
      },
      listReq: {
        stdNo: "",
        stdName: "",
        status: 0 || "0",
        stdType: null,
        pageNo: 1,
        pageSize: 100,
        searchValueForNameOrNo: "",
        totalPage: 1,
      },
      stdLoading: false,
      stdList: [],
      modifyFile: [],
      stdType: 1,
      gzStdList: [],
    };
  },
  watch: {
    visiable(val) {
      this.dialogInfo.visible = this.visiable;
      if (this.visiable === true) {
        this.initPage();
      }
    },
  },
  mounted() {
    this.dialogInfo.visible = this.visiable;
    if (this.visiable === true) {
      this.initPage();
    }
  },
  methods: {
    getGZStdList() {
      Api.getPurSdList().then((res) => {
        const { msg, data, code } = res;
        if (code === 200) {
          this.gzStdList = data;
        }
      });
    },
    /**
     * 获取被修订标准编号
     */
    getStdList() {
      this.stdLoading = true;
      stdApi.getTopicaList(this.listReq).then((res) => {
        const { msg, data, code } = res;
        if (code === 200) {
          if (this.listReq.pageNo == 1) {
            this.stdList = data.rows;
          } else {
            this.stdlist = this.stdList.contact(data.rows);
          }
          this.listReq.totalPage =
            data.total % this.listReq.pageSize > 0
              ? data.total / this.listReq.pageSize + 1
              : data.total / this.listReq.pageSize;
        } else {
          // this.$message.error(msg);
        }
        this.stdLoading = false;
      });
    },
    remoteMethod(keyWord) {
      this.listReq.pageNo = 1;
      this.listReq.searchValueForNameOrNo = keyWord;
      this.getStdList();
    },
    /**
     * 获取标准详情
     */
    getTopiclInfo() {
      stdApi.getTopiclInfo(this.stdForm.id).then((res) => {
        const { code, data, msg } = res;
        if (code == 200) {
          Object.keys(this.stdForm).map((key) => {
            this.stdForm[key] = data[key];
          });
          if (
            this.stdForm.modifyFile == null ||
            this.stdForm.modifyFile == ""
          ) {
            this.modifyFile = [];
          } else {
            const file = {
              name: `${this.stdForm.stdName}(修改单)`,
              url: this.stdForm.modifyFile,
            };
            this.modifyFile.push(file);
          }
        }
      });
    },
    /**
     * 格式父组件传值
     */
    initPage() {
      this.dialogInfo.loadding = false;
      this.files = [];
      this.stdForm = this.deepClone(stdForm);
      if (this.stdInfo != null) {
        this.dialogInfo.title = `编辑标准【${this.stdInfo.stdName}】`;
        this.stdForm.id = this.stdInfo.stdId;
        this.getTopiclInfo();
      } else {
        this.getStdList();
      }
    },
    /**
     * 上传附件
     */
    fileChange(e) {
      this.files = e;
      if (this.files.length > 0) {
        this.stdForm.stdFile = this.files[0].name;
        this.stdForm.filedir = this.files[0].url;
        this.stdForm.isfile = 1;
        this.$refs.upload.clearValidate();
      } else {
        this.stdForm.stdFile = "";
        this.stdForm.filedir = "";
        this.stdForm.isfile = 0;
      }
    },
    gzStdChange(e) {
      this.stdForm.stdNo = "";
      this.stdForm.stdName = "";
      this.gzStdList.forEach((item) => {
        if (item.id == e) {
          this.stdForm.stdNo = item.stdNo;
          this.stdForm.stdName = item.stdName;
        }
      });
    },
    typeChange(e) {
      this.stdForm.stdNo = "";
      this.stdForm.stdName = "";
    },
    /**
     * 上传修改单
     */
    modifyFileChange(e) {
      this.modifyFile = e;
      if (this.modifyFile.length > 0) {
        this.modifyFile[0].name = `${this.stdForm.stdName}(修改单)`;
        this.stdForm.modifyFile = this.modifyFile[0].url;
      } else {
        this.stdForm.modifyFile = null;
        Api.updateModifyFileById({ id: this.stdForm.id }).then((res) => {});
      }
    },
    /**
     * 关闭弹框 提交/取消
     */
    closeDialog(e) {
      if (e === true) {
        this.$refs.stdForm.validate((valid) => {
          if (valid) {
            this.$set(this.dialogInfo, "loadding", true);
            if (this.stdForm.id && this.stdForm.id != null) {
              const req = {
                id: this.stdForm.id,
                expiredate: this.stdForm.expiredate,
                stdFile: this.stdForm.stdFile,
                filedir: this.stdForm.filedir,
                isfile: this.stdForm.isfile,
                modifyFile: this.stdForm.modifyFile,
              };
              Api.updateTopic(req).then((res) => {
                const { code, data, msg } = res;
                if (code === 200) {
                  this.$message.success("操作成功");
                  this.dialogInfo.visible = false;
                  this.$emit("save", false);
                }
                this.dialogInfo.loadding = false;
                this.$set(this.dialogInfo, "loadding", false);
              });
            } else {
              Api.addTopicAndReplace(this.stdForm).then((res) => {
                const { code, data, msg } = res;
                if (code === 200) {
                  this.$message.success("操作成功");
                  this.dialogInfo.visible = false;
                  this.$emit("save", false);
                }
                this.dialogInfo.loadding = false;
                this.$set(this.dialogInfo, "loadding", false);
              });
            }
          } else {
            return false;
          }
        });
      } else {
        this.dialogInfo.visible = false;
        this.dialogInfo.loadding = false;
        this.$emit("save", null);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.pro-list {
  // margin-top: 140px;
}
::v-deep .stdForm {
  width: 100%;
  overflow: hidden;
  .reason {
    line-height: 30px;
    margin-bottom: 15px;
    label {
      color: $red;
    }
    .reason-content {
      border-radius: 5px;
      background: $grey-light;
      line-height: 36px;
      color: $yellow;
      padding: 0px 15px;
      overflow: hidden;
    }
  }
  .el-form-item {
    margin-right: 15px;
    .el-form-item__label {
      font-weight: 400;
    }
    .el-form-item__content {
      .el-date-editor,
      .el-select {
        width: 100%;
      }
    }
  }
}
</style>
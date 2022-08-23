<template>
  <div>
    <BztDialog
      :dialogInfo="dialogInfo"
      @close="closeDialog($event, 0)"
      :appendTobody="true"
    >
      <template slot="body">
        <el-form
          class="out-std-form"
          label-width="120px"
          label-suffix=":"
          v-if="outStdForm != null"
          :model="outStdForm"
          ref="outStdForm"
          :rules="rules"
        >
          <!-- :inline="true" -->
          <el-form-item label="项目名称" style="width: 100%" prop="projectName">
            <el-input
              v-model="outStdForm.projectName"
              placeholder="请输入项目名称"
            />
          </el-form-item>
          <el-form-item label="第一起草人" prop="projectName">
            <!-- <el-input
              type="textarea"
              autosize
              placeholder="请选择第一起草人"
              :value="getUserName(outStdForm.startUser)"
              readonly
              @focus="changeStartUser()"
            /> -->
            <el-select
              v-model="outStdForm.mainEditorId"
              clearable
              filterable
              placeholder="请选择第一起草人"
            >
              <template v-for="(item, index) in userList">
                <el-option
                  :key="`user_${index}`"
                  :label="`${item.nickName}(${item.userName})`"
                  :value="Number(item.userId)"
                >
                  {{ item.nickName }}({{ item.userName }})</el-option
                >
              </template>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="主编单位">
            <el-input v-model="outStdForm.mainEditCompany" />
          </el-form-item> -->
          <el-form-item label="归口单位" prop="ownerDeptId">
            <TecCommittees
              :value="outStdForm.ownerDeptId"
              :disabled="true"
              @change="changeTecCom"
            />
          </el-form-item>
          <el-form-item label="标准类型" prop="stdType">
            <el-select
              v-model="outStdForm.stdType"
              placeholder="请选择标准类型"
            >
              <template v-for="(item, index) in dict.type.standard_type">
                <el-option
                  :key="`revision_mode_${index}`"
                  :label="item.label"
                  :value="Number(item.value)"
                />
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="制定或修订" prop="scplatMode">
            <el-select
              v-model="outStdForm.scplatMode"
              placeholder="请选择制定或修订"
            >
              <template v-for="(item, index) in dict.type.revision_mode">
                <el-option
                  :key="`revision_mode_${index}`"
                  :label="item.label"
                  :value="Number(item.value)"
                />
              </template>
            </el-select>
          </el-form-item>

          <el-form-item
            label="被修订标准号"
            prop="oldStdId"
            v-if="outStdForm.scplatMode != 0"
          >
            <el-select
              :value="outStdForm.oldStdId"
              placeholder="请选择被修订标准号"
              style="width: 100%"
              filterable
              remote
              :filter-method="remoteMethod"
              :loading="stdLoading"
              loading-text="搜索中..."
              @change="stdChange"
            >
              <template v-for="(item, index) in stdList">
                <el-option
                  :key="`std_${index}`"
                  :label="item.stdNo"
                  :value="`${item.stdId}`"
                />
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="附件">
            <BztUploadFile
              :value="fileList"
              :limit="1000"
              :fileSize="100"
              @upload-change="fileChange"
            />
          </el-form-item>
        </el-form>
      </template>
    </BztDialog>
    <!-- 选择第一起草人 -->
    <BztDialog :dialogInfo="changeUserDialog" @close="closeChangeUser">
      <template slot="body">
        <SelectUserByDept
          :value="outStdForm.startUser ? outStdForm.startUser : ''"
          @user-change="userChange"
        />
      </template>
    </BztDialog>
  </div>
</template>
<script>
import Api from "@api/process";
import { BztDialog, BztUploadFile } from "@components/basicCom/index";
import {
  SelectUserByDept,
  TecCommittees,
} from "@components/bussinessCom/index";
import { mapGetters } from "vuex";
import DataModel from "@utils/data-model";
const outStdForm = {
  projectName: "",
  fileList: [],
  startUser: "",
  scplatMode: "",
  stdType: "",
  oldStdNo: "",
  mainEditorId: null,
  oldStdId: "",
  ownerDeptId: "",
  mainEditCompany: "",
  projectPhase: "20",
  scpStdComment: {},
};
export default {
  components: { BztDialog, BztUploadFile, SelectUserByDept, TecCommittees },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  name: "createStd",
  dicts: ["info_publish_theme", "revision_mode", "standard_type"],
  props: {
    visiable: {
      type: Boolean,
      default: false,
    },
    hook: {
      type: String | Number,
      default: null,
    },
    ownerDeptId: {
      type: String | Number,
      default: null,
    },
  },
  data() {
    return {
      changeUserDialog: {
        visible: false,
        title: "选择第一起草人",
        width: "900px",
        footer: true,
        loadding: false,
      },
      dialogInfo: {
        visible: false,
        title: "添加外部标准",
        width: "900px",
        footer: true,
        loadding: false,
      },
      outStdForm: {
        projectName: "",
        fileList: [],
        startUser: "",
        scplatMode: "",
        stdType: "",
        oldStdNo: "",
        oldStdId: "",
        ownerDeptId: "",
        mainEditCompany: "",
        projectPhase: "20",
      },
      rules: {
        projectName: {
          required: true,
          message: "请输入项目名称",
          trigger: "blur",
        },
        ownerDeptId: {
          required: true,
          message: "请选择归口单位",
          trigger: "blur",
        },
        startUser: {
          required: true,
          message: "请选择第一起草人",
          trigger: "blur",
        },
        scplatMode: {
          required: true,
          message: "请选择制定或修订",
          trigger: "blur",
        },
        stdType: {
          required: true,
          message: "请选择标准类型",
          trigger: "blur",
        },
        oldStdNo: "",
        oldStdId: {
          required: true,
          message: "请选择被修订标准号",
          trigger: "blur",
        },
      },
      stdList: [],
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
      fileList: [],
      userList: [],
    };
  },
  watch: {
    visiable: {
      handler(val) {
        this.userList = this.$cache.session.getJSON("sourceUserList");
        this.outStdForm = this.deepClone(outStdForm);
        this.dialogInfo.title = "添加外部标准";
        this.dialogInfo.visible = val;
        this.outStdForm.ownerDeptId = Number(this.ownerDeptId);
        this.outStdForm.scpStdComment = this.deepClone(
          DataModel.applyPorjectEXForm.scpStdComment
        );
      },
    },
  },
  mounted() {
    this.userList = this.$cache.session.getJSON("sourceUserList");
    this.outStdForm = this.deepClone(outStdForm);
    this.dialogInfo.visible = this.visiable;
    this.dialogInfo.loadding = false;
    this.outStdForm.ownerDeptId = Number(this.ownerDeptId);
    this.outStdForm.scpStdComment = this.deepClone(
      DataModel.applyPorjectEXForm.scpStdComment
    );
  },

  methods: {
    /**
     * 获取被修订标准编号
     */
    getStdList() {
      this.stdLoading = true;
      this.listReq.stdType = this.outStdForm.stdType;
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
     * 改变标准类型
     */
    stdTypeChange() {
      if (this.outStdForm.scplatMode == 1) {
        this.getStdList();
      }
    },
    /**
     * 选择标准编号
     */
    stdChange(e) {
      // this.outStdForm.oldStdId = e.split("$$$")[0];
      // this.outStdForm.oldStdNo = e.split("$$$")[1];
      this.stdList.forEach((el) => {
        if (el.stdId == e) {
          this.outStdForm.oldStdNo = el.stdNo;
        }
      });
    },
    /**
     * 选择第一起草人
     */
    changeStartUser() {
      this.changeUserDialog.visible = true;
    },
    /**
     * 确认选择第一起草人
     */
    closeChangeUser(e) {
      this.changeUserDialog.visible = false;
    },
    /**
     * 第一起草人选择
     */
    userChange(e) {
      this.outStdForm.startUser = e.join(",");
    },
    /**
     * 获取UserName
     */
    getUserName(ids) {
      let arr = [];
      if (ids != "" && ids != null) {
        ids.split(",").forEach((id) => {
          const sourceUserList = this.$cache.session.getJSON("sourceUserList");
          if (id == 0) return "系统";
          const user = _.find(sourceUserList, { userId: Number(id) });
          arr.push(
            user
              ? `${user.nickName}（${user.userName}）`
              : "-（${user.userName}）"
          );
        });
      }
      return arr.length > 0 ? arr.join("；") : "";
    },
    /**
     * 选择归口单位
     */
    changeTecCom(e) {
      this.outStdForm.ownerDeptId = e;
    },
    /**
     * 上传附件
     */
    fileChange(e) {
      this.fileList = e;
      this.outStdForm.fileList =
        this.fileList.length == 0
          ? null
          : this.fileList.map((item) => {
              return { name: item.name, url: item.url };
            });
    },
    /**
     * 格式化附件
     */
    filterFiles() {
      this.fileList = [];
      if (this.outStdForm.fileList != null) {
        JSON.parse(this.outStdForm.fileList).forEach((item) => {
          const file = {
            name: item.fileName,
            url: item.filepath,
          };
          this.fileList.push(file);
        });
      }
    },
    /**
     * 提交
     */
    closeDialog(e) {
      if (e === true) {
        this.outStdForm.hook = this.hook;
        this.$refs.outStdForm.validate((valid) => {
          if (valid) {
            this.outStdForm.fileList =
              this.fileList.length == 0
                ? []
                : this.fileList.map((item) => {
                    return { name: item.name, url: item.url };
                  });
            this.dialogInfo.loadding = true;
            Api.createReviseProject(this.outStdForm).then((res) => {
              const { code, msg } = res;
              this.dialogInfo.loadding = false;

              if (code === 200) {
                this.$message.success("外部制修订标准已添加");
              } else {
                // this.$message.error(msg);
              }
              this.dialogInfo.visible = false;
              this.$emit("save", null);
            });
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
::v-deep .el-dialog__body {
}
::v-deep .out-std-form {
  width: 100% !important;
  overflow: hidden;
  margin: 25px 0px;
  .el-form-item {
    width: 48% !important;
    // float: left;
    font-size: 14px;
    .el-form-item__label {
      font-weight: 400;
    }
    &:first-child {
      width: 100% !important;
    }
    &:last-child {
      width: 100% !important;
    }
    &:nth-child(2n-1) {
      // float: right;
    }
    .el-form-item__content {
      width: calc(100% - 130px);
      margin-bottom: 0;
      .el-select,
      .el-input {
        margin-bottom: 0;
      }
      .tec-committees {
        margin-bottom: 0px;
        .el-select {
          margin-bottom: 0px;
          .el-input {
            margin-bottom: 0px;
          }
        }
      }
    }
  }
}
</style>
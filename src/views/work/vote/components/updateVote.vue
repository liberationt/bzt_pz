<template>
  <div>
    <BztDialog
      :dialogInfo="dialogInfo"
      @close="closeDialog($event)"
      :appendTobody="false"
    >
      <template slot="body">
        <el-form
          :model="voteForm"
          :rules="rules"
          ref="voteForm"
          label-suffix=":"
          label-width="120px"
          class="voteForm"
          v-if="voteForm != null"
        >
          <el-form-item label="任务类型" prop="voteType">
            <el-select
              v-model="voteForm.voteType"
              placeholder="请选择任务类型"
              clearable
              @change="voteTypeChange()"
            >
              <template v-for="(item, index) in dict.type.vote_type">
                <el-option
                  :key="`voteType_${index}`"
                  :label="item.label"
                  :value="`${item.value}`"
                />
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="任务名称" prop="voteTaskName">
            <el-input
              v-model="voteForm.voteTaskName"
              :readonly="voteForm.voteType == 1 || voteForm.voteType == 2"
              placeholder="请输入任务名称"
            />
          </el-form-item>

          <el-form-item
            :label="voteForm.voteType != 2 ? '外部立项通知' : '企业立项通知'"
            prop="infoPublishId"
            key="infoPublishId"
            v-if="
              voteForm.voteType == 3 ||
              voteForm.voteType == 4 ||
              voteForm.voteType == 2
            "
          >
            <el-select
              v-model="voteForm.infoPublishId"
              :placeholder="`请选择${
                voteForm.voteType != 2 ? '外部立项通知' : '企业立项通知'
              }`"
              clearable
              @change="exInfoChange()"
            >
              <template v-for="(item, index) in exInfoList">
                <el-option
                  :key="`doc_${index}`"
                  :label="item.infoTitle"
                  :value="item.infoPublishId"
                />
              </template>
            </el-select>
          </el-form-item>
          <el-form-item
            label="选择任务项目"
            v-if="voteForm.voteType == 2 || voteForm.voteType == 4"
          >
            <!--  -->
            <BztTable
              :tableData="{
                column: tabClums,
                data: stdList,
                action: tabAction,
                actionWidth: 180,
              }"
              height="400"
              :clearSelection="true"
              :hasIndex="false"
              :checkeBox="true"
              :pageInfo="page"
              :isLoading="stdLoading"
              @select-change="selecData"
              @skipVote="skipVote"
              @checkDetail="checkDetail"
            />
          </el-form-item>
          <el-form-item label="选择任务项目" v-else>
            <BztTable
              :tableData="{
                column: tabClums1,
                data: stdList,
                action: tabAction,
                actionWidth: 180,
              }"
              height="400"
              :clearSelection="true"
              :hasIndex="false"
              :checkeBox="true"
              :pageInfo="page"
              :isLoading="stdLoading"
              @select-change="selecData"
              @skipVote="skipVote"
              @checkDetail="checkDetail"
            />
          </el-form-item>
          <el-form-item label="投票专家" prop="expertIds">
            <el-input
              type="textarea"
              autosize
              placeholder="请输入投票专家"
              :value="getUserName(voteForm.expertIds)"
              readonly
              @focus="changeVoteExpert()"
            />
          </el-form-item>
          <el-form-item label="可投票数/人" prop="canVoteNum">
            <el-input-number
              v-model="voteForm.canVoteNum"
              :min="0"
              :max="projects.length"
            />
          </el-form-item>
          <!-- <el-form-item
          label="起始时间"
          prop="publishdate"
          v-if="voteForm.id == null"
        >
          <el-date-picker
            v-model="dateTime"
            type="date"
            placeholder="选择起始日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            :picker-options="pickerOptions"
          />
        </el-form-item> -->
        </el-form>
      </template>
      <template slot="footer">
        <div class="cancelBtn" @click="closeDialog(false)">取消</div>
        <el-button class="submit-btn" @click="skipVote()" :loading="castVoting">
          跳过投票
        </el-button>
        <el-button
          class="submit-btn"
          @click="closeDialog(true)"
          :loading="castVoting"
        >
          发起投票
        </el-button>
      </template>
    </BztDialog>
    <!-- 选择投票专家 -->
    <BztDialog
      v-if="changeUserDialog.visible == true"
      :dialogInfo="changeUserDialog"
      @close="closeChangeUser"
    >
      <template slot="body">
        <SelectUserByDept
          :value="voteForm.expertIds ? voteForm.expertIds : ''"
          :deptIds="
            voteForm.voteType == 1 || voteForm.voteType == 3
              ? userInfo.deptId.toString()
              : ''
          "
          :onlyUser="voteForm.voteType == 1 || voteForm.voteType == 3"
          @user-change="userChange"
        />
      </template>
    </BztDialog>

    <!-- 查看项目详情 -->
    <CheckPprojectDtail :todoData="proInfo" @close="closePro" />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Api from "@api/process";
import infoApi from "@api/infoModule";
import { BztDialog, BztTable } from "@components/basicCom/index";
// import { SelectUserByDept } from "@components/bussinessCom/index";
import SelectUserByDept from "@components/bussinessCom/model/selectDept";
import CheckPprojectDtail from "./checkPprojectDtail.vue";

const voteTaskForm = {
  voteTaskName: "",
  voteStdNum: null,
  state: 0,
  voteType: null,
  canVoteNum: null,
  expertIds: "",
  projectIds: "",
  startTime: "",
  endTime: "",
  infoPublishId: "",
};
export default {
  name: "upddate-vote",
  components: { BztDialog, BztTable, SelectUserByDept, CheckPprojectDtail },
  dicts: ["vote_type"],
  computed: {
    ...mapGetters(["userInfo"]),
  },
  props: {
    visiable: {
      type: Boolean,
      default: false,
    },
    voteInfo: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      castVoting: false,
      changeUserDialog: {
        visible: false,
        title: "选择投票专家",
        width: "800px",
        footer: true,
        loadding: false,
      },

      dialogInfo: {
        visible: false,
        title: "创建投票任务",
        width: "1000px",
        footer: false,
        loadding: false,
      },
      voteForm: null,
      rules: {
        voteTaskName: {
          required: true,
          message: "请输入任务名称",
          trigger: "blur",
        },
        voteType: {
          required: true,
          message: "请选择任务类型",
          trigger: "blur",
        },
        infoPublishId:{
          required: true,
          message: "请选择外部立项通知",
          trigger: "blur",
        },
        dateTime: {
          required: true,
          message: "请选择起始日期",
          trigger: "blur",
        },
        canVoteNum: {
          required: true,
          message: "请输入可投票数",
          trigger: "blur",
        },
      },
      page: {
        total: 0,
        pageSize: 10000,
        pageNo: 1,
      },
      listReq: {
        projectName: null,
        projectState: null,
        projectType: null,
        infoPublishId: null,
      },
      stdLoading: false,
      stdList: [],
      users: "",
      tabClums: [
        {
          title: "标准名称",
          key: "projectName",
          minWidth: "160",
        },
        {
          title: "项目申请人",
          key: "applyUser",
          width: "160",
          filter: {
            type: "user",
          },
        },
        {
          title: "排序",
          key: "recommendSort",
          width: "100",
        },
      ],
      tabClums1: [
        {
          title: "标准名称",
          key: "projectName",
          minWidth: "160",
        },
        {
          title: "项目申请人",
          key: "applyUser",
          width: "160",
          filter: {
            type: "user",
          },
        },
      ],
      projects: [],
      tabAction: [
        { label: "跳过投票", action: "skipVote" },
        { label: "项目详情", action: "checkDetail" },
      ],
      dateTime: null,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      exInfoList: [],
      proInfo: {
        id: null,
        compt: "",
        visible: false,
        projectPhase: null,
      },
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
    /**
     * 获取外部通知列表
     */
    getExInfoList() {
      let req = {
        infoTheme: "4",
        status: "5",
        isPublish: 1,
        isAsc: "desc",
        orderByColumn: "createTime",
        pageNum: 1,
        pageSize: 10000,
      };
      if (this.voteForm.voteType == 2) {
        req["identification"] = 1;
        req.infoTheme = "1";
      }

      this.exInfoList = [];
      infoApi.infoPblicList(req).then((res) => {
        const { code, msg } = res;
        if (code === 200) {
          this.exInfoList = res.rows;
        } else {
          // this.$message.error(msg);
        }
      });
    },
    /**
     * 格式父组件传值
     */
    initPage() {
      this.dialogInfo.loadding = false;
      this.dateTime = null;
      this.voteForm = this.deepClone(voteTaskForm);
      if (this.voteInfo != null) {
        this.dialogInfo.title = `编辑投票任务【${this.voteInfo.voteTaskName}】`;
        this.voteForm.id = this.voteInfo.id;
      }
    },
    /**
     * 选择任务类型
     */
    voteTypeChange() {
      this.stdList = [];
      // this.setTabCloumn(this.voteForm.voteType);
      if (this.voteForm.voteType == 1) {
        this.listReq.projectState = 1011;
        this.listReq.projectType = 1;
        this.listReq.infoPublishId = null;
        this.voteForm.infoPublishId = "";
        this.getProjectList();
      } else if (this.voteForm.voteType == 2) {
        this.listReq.projectState = 1012;
        this.listReq.projectType = 1;
        this.listReq.infoPublishId = null;
        this.voteForm.infoPublishId = "";
        if (this.listReq.infoPublishId != null) {
          this.getProjectList();
        } else {
          this.getExInfoList();
        }
      } else if (this.voteForm.voteType == 3) {
        this.listReq.projectState = 911;
        this.listReq.projectType = 2;
        if (this.listReq.infoPublishId != null) {
          this.getProjectList();
        } else {
          this.getExInfoList();
        }
      } else if (this.voteForm.voteType == 4) {
        this.listReq.projectState = 912;
        this.listReq.projectType = 2;
        if (this.listReq.infoPublishId != null) {
          this.getProjectList();
        } else {
          this.getExInfoList();
        }
      }
      console.log(this.voteTitle());
      this.voteForm.voteTaskName = this.voteTitle();
    },
    voteTitle() {
      return this.voteForm.voteType == 1
        ? `${new Date().getFullYear()}年企业标准部门申报`
        : this.voteForm.voteType == 2
        ? `${new Date().getFullYear()}年企业标准公司申报`
        : "";
    },
    setTabCloumn(flag) {
      // recommendSort
      if (flag == 1 || flag == 3) {
        this.tabClums = [
          {
            title: "标准名称",
            key: "projectName",
          },
          {
            title: "项目申请人",
            key: "applyUser",
            width: "160",
            filter: {
              type: "user",
            },
          },
        ];
      } else {
        this.tabClums = [
          {
            title: "标准名称",
            key: "projectName",
            minWidth: "160",
          },
          {
            title: "项目申请人",
            key: "applyUser",
            width: "160",
            filter: {
              type: "user",
            },
          },
          {
            title: "排序",
            key: "recommendSort",
            width: "90",
          },
        ];
      }
    },
    /**
     * 选择外部立项通知
     */
    exInfoChange() {
      this.listReq.infoPublishId = this.voteForm.infoPublishId;
      this.getProjectList();
    },
    /**
     * 获取投票的项目列表
     */
    getProjectList() {
      this.stdLoading = true;
      this.projects = [];
      this.stdList = [];
      Api.voteProList(this.listReq).then((res) => {
        const { code, msg, data } = res;
        this.stdLoading = false;
        if (code === 200) {
          this.stdList = data;
        } else {
          // this.$message.error(msg);
        }
      });
    },
    /**
     * 选择列表数据
     * @params {*} e 选中的数据列表
     */
    selecData(e) {
      this.projects = e;
    },
    /**
     * 查看投票项目详情
     */
    checkDetail(e) {
      if (e.projectType == 1) {
        this.proInfo.comp = (resolve) =>
          require([
            `@/views/work/enterpriseStdRevise/components/projectDetail.vue`,
          ], resolve);
      } else if (e.projectType == 2) {
        this.proInfo.comp = (resolve) =>
          require([
            `@/views/work/externalStdRevise/components/projectDetail.vue`,
          ], resolve);
      }
      this.proInfo.id = e.id + "";
      this.proInfo.projectPhase = e.projectPhase;
      this.proInfo.visible = true;
    },
    closePro(e) {
      this.proInfo.visible = false;
      this.$set(this.proInfo, "visible", false);
    },
    /**
     * 跳过投票
     * @params data{*} 要跳过投票的项目，null：跳过当前所有项目的跳票
     */
    async skipVote(data = null) {
      this.castVoting = true;
      let projectIdList = [];
      let projectNames = "";
      if (data != null) {
        projectIdList.push(data.id);
        projectNames = data.projectName;
      } else {
        if (this.projects.length > 0) {
          projectIdList = this.projects.map((item) => {
            return item.id;
          });
          projectNames = this.projects
            .map((item) => {
              return item.projectName;
            })
            .join(",");
        } else {
          this.castVoting = false;
          this.$message.warning("请选择项目");
          return;
        }
      }

      this.$confirm(`确定跳过项目：${projectNames}投票吗？`, "跳过投票", {
        confirmButtonText: "确定跳过",
        cancelButtonText: "取消",
        center: true,
      })
        .then(async () => {
          const req = {
            projectIdList: projectIdList,
            isIn:
              this.voteForm.voteType == 1 || this.voteForm.voteType == 2
                ? 1
                : 2,
            type: this.voteForm.voteType,
          };
          await Api.jumpVote(req).then((res) => {
            const { code } = res;
            if (code == 200) {
              this.$message.success("操作成功");
              if (data == null) {
                this.$emit("save", true);
              } else {
                this.projects = [];
                this.stdList = [];
                this.getProjectList();
              }
            }
          });
          this.castVoting = false;
        })
        .catch(() => {
            this.castVoting = false;
        });
    },
    /**
     * 选择投票专家
     */
    changeVoteExpert() {
      this.users = "";
      this.users = this.voteForm.expertIds;
      this.changeUserDialog.visible = true;
    },
    /**
     * 确认选择投票专家
     */
    closeChangeUser(e) {
      if (e == true) {
        this.voteForm.expertIds = this.users;
      }
      this.changeUserDialog.visible = false;
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
     * 选择投票专家
     */
    userChange(e) {
      this.users = e.join(",");
    },
    /**
     * 关闭弹框 提交/取消
     */
    async closeDialog(e) {
      if (e === true) {
        this.$refs.voteForm.validate(async (valid) => {
          if (valid) {
            if (this.projects.length > 0) {
              this.voteForm.projectIds = this.projects
                .map((item) => {
                  return item.id;
                })
                .join(",");
              this.voteForm.voteStdNum = this.projects.length;
            } else {
              this.$message.warning("请选择项目");
              return;
            }
            if (
              this.voteForm.expertIds == "" ||
              this.voteForm.expertIds == null
            ) {
              this.$message.warning("请选择投票专家");
              return;
            }
            await Api.createVote(this.voteForm).then((res) => {
              const { code } = res;
              if (code == 200) {
                this.$message.success("操作成功");
                this.dialogInfo.visiable = false;
                this.$emit("save", true);
              }
            });
            this.castVoting = false;
          } else {
            return false;
          }
        });
      } else {
        this.dialogInfo.visible = false;
        this.dialogInfo.loadding = false;
        this.$emit("save", false);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.pro-list {
  // margin-top: 140px;
}
::v-deep .voteForm {
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

::v-deep .dialog-footer {
  padding: 0;
}
::v-deep .el-table {
  overflow-y: auto !important;
}
</style>
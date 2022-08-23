<template>
  <div class="view-process">
    <div>
      <el-steps direction="vertical" class="module_steps" :active="stageActive">
        <template v-for="(item, index) in modules">
          <el-step
            :key="`modules_${index}`"
            :class="item.active == true ? 'this-step' : ''"
          >
            <template slot="title">
              <div class="module_title">
                <div class="title-btn" :title="item.name">{{ item.name }}</div>
                <template v-if="item.deadLine && item.deadLine != null">
                  <template v-for="(timer, index) in item.deadLine">
                    <div
                      :key="`time_name_${index}`"
                      class="title-desc"
                      :title="timer.name"
                    >
                      {{ timer.name }}
                    </div>
                    <div class="title-desc" :key="`timer_${index}`">
                      {{ timer.date }}
                    </div>
                  </template>
                </template>
              </div>
            </template>
            <template slot="description">
              <div class="module_description">
                <el-steps :space="200" :active="null" finish-status="success">
                  <template v-for="(step, index) in item.activityDefs">
                    <el-step
                      :class="
                        step.hasActivation == 1
                          ? 'is-success child-node'
                          : step.hasActivation == 2
                          ? 'this_step child-node'
                          : 'child-node'
                      "
                      :key="`step_${index}`"
                      :icon="
                        step.hasActivation == 1 ? 'el-icon-circle-check' : ''
                      "
                    >
                      <template slot="title">
                        <div
                          :class="
                            step.hasActivation == 2 ? 'status-ing' : 'status'
                          "
                        >
                          {{
                            step.hasActivation == 1
                              ? "已完成"
                              : step.hasActivation == 2
                              ? "进行中"
                              : "未开始"
                          }}
                        </div>
                        <div class="step-title" :title="step.name">
                          {{ step.name }}
                        </div>
                        <div class="step-btn">
                          <!-- <span
                            class="link-text"
                            @click="checkActionUser(step)"
                          >
                            操作人    
                          </span> -->
                          <span
                            v-if="
                              setNodeIds.indexOf(step.id) != -1 &&
                              step.hasActivation == 2 &&
                              $route.params.applyUser == userInfo.userId
                            "
                            class="yellow-link-txt"
                            @click="setNode(item, step.id, 0)"
                          >
                            设置
                          </span>
                          <span
                            v-if="
                              (setNodeIds.indexOf(step.id) != -1 &&
                                showEidtTime == true &&
                                projectPhase == item.code) ||
                              projectSate == 1103
                            "
                            class="yellow-link-txt"
                            @click="setNode(item, step.id, 0)"
                          >
                            修改操作时间
                          </span>
                          <span
                            v-if="
                              setNodeIds.indexOf(step.id) != -1 &&
                              showEidtTime == true &&
                              projectPhase == item.code
                            "
                            class="yellow-link-txt"
                            @click="setNode(item, step.id, 1)"
                          >
                            修改操作人
                          </span>
                        </div>
                      </template>
                    </el-step>
                  </template>
                </el-steps>
              </div>
            </template>
            <template slot="icon">
              <i class="modules_step" />
            </template>
          </el-step>
        </template>
      </el-steps>
    </div>
    <!-- 设置节点操作 -->
    <BztDialog
      v-if="setNodeDialog.visible == true"
      :dialogInfo="setNodeDialog"
      @close="closeSetNode"
    >
      <template slot="body">
        <el-form
          :model="nodeSetForm"
          :rules="rules"
          ref="nodeSetForm"
          label-suffix=":"
          label-position="top"
        >
          <el-form-item
            label="起止时间"
            prop="date"
            v-if="(showEidtTime == true || eidtFlag == 0) && editTime == 0"
          >
            <el-date-picker
              v-model="nodeSetForm.date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
            />
          </el-form-item>
          <el-form-item
            label="请选择该节点项目操作人员"
            prop="userIds"
            v-if="showEidtTime != true || eidtFlag == 1"
          >
            <SelectDept
              :value="nodeSetForm.userIds"
              :disableUsers="$route.params.applyUser"
              :disableDepts="[]"
              :isCheckAll="true"
              @user-change="userChange"
            />
          </el-form-item>
        </el-form>
      </template>
    </BztDialog>

    <!-- 查看操作人 -->
    <!-- <BztDialog :dialogInfo="checkDialog" @close="closeCheckDialog">
      <template slot="body">
        <el-form :model="nodeSetForm" label-suffix=":">
          <el-form-item label="节点名称">
            {{ nodeDetail.name }}
          </el-form-item>
          <el-form-item label="操作人员">
            {{ nodeDetail.users }}
          </el-form-item>
        </el-form>
      </template>
    </BztDialog> -->

    <!-- 确认起草人顺序 -->
    <BztDialog :dialogInfo="dialogUsers" @close="saveQCR" :appendTobody="false">
      <template slot="body" v-if="dialogUsers.visible == true">
        <div class="red-txt">注：可拖动调节顺序</div>
        <div style="padding: 3px 25px">项目起草人：{{ userName }}</div>
        <el-tree
          ref="users"
          :data="userList"
          node-key="userId"
          default-expand-all
          draggable
          :allow-drop="allowDrop"
          :allow-drag="allowDrag"
          class="menu-list"
        />
      </template>
    </BztDialog>
  </div>
</template>
<script>
import Api from "@api/process";
import { BztDialog } from "@components/basicCom/index";
import SelectDept from "./selectDept.vue";
import { mapGetters } from "vuex";
const formReq = {
  distributeUsers: "",
  id: null,
  distributeStartTime: "",
  distributeEndTime: "" /*  */,
  distributePhase: null,
};
const from = {
  date: "",
  userIds: "",
};
const editTimeForm = {
  id: null,
  modifyTimeRangeType: null,
  distributeStartTime: "",
  distributeEndTime: "",
};

const eidtPersonForm = {
  id: null,
  modifyMemberType: null,
  distributeUsers: "",
  projectType: null,
};
export default {
  computed: {
    ...mapGetters(["userInfo"]),
  },
  components: { BztDialog, SelectDept },
  name: "view-process",
  data() {
    return {
      stageActive: null,
      setNodeDialog: {
        visible: false,
        title: "设置操作人",
        width: "900px",
        footer: true,
        loadding: false,
        submintText: "确认",
      },
      dialogUsers: {
        visible: false,
        title: "确认起草人顺序",
        width: "600px",
        footer: true,
      },
      wfDefId: null,
      businessId: null,
      businessType: null,
      applayUser: null,
      modules: [],
      setNodeIds: [
        "KD3WVFR03O9GKODY0003", // 内部-选择编写人员
        "KD3WVFR03O9GKODY0015", // 内部-选择征求意见人员
        "KD3WVFR03O9GKODY0187", // 外部-选择编写人员
        "KD3WVFR03O9GKODY0195", // 外部-选择征求意见人员
      ],
      nodeSetForm: this.deepClone(from),
      rules: {
        date: {
          required: true,
          message: "请选择起始时间",
          trigger: "blur",
        },
        userIds: {
          required: true,
          message: "请选择节点项目操作人员",
          trigger: "blur",
        },
      },
      pickerOptions: {},
      nodeDetail: {
        name: "",
        users: "",
      },
      setNodeId: "",
      userList: [],
      userName: "",
      showEidtTime: false,
      editTimeForm: {
        id: null,
        modifyTimeRangeType: null,
        distributeStartTime: "",
        distributeEndTime: "",
      },
      eidtFlag: 0,
      eidtPersonForm: {
        id: null,
        modifyMemberType: null,
        distributeUsers: "",
        projectType: null,
      },
      projectSate: null,
      interfacePersonIds: [],
      editTime: 0,
    };
  },
  mounted() {
    const { projectPhase, businessId, businessType, applayUser } =
      this.$route.params;
    this.projectPhase = projectPhase;
    this.businessId = businessId;
    this.businessType = businessType;
    this.applayUser = applayUser;
    this.showEidtTime = false;
    this.getNodes();
  },
  methods: {
    /**
     * 获取流程节点
     */
    getNodes() {
      this.showEidtTime = false;

      if (this.businessType == 4 || this.businessType == 1) {
        Api.getProcessNodeList(`${this.businessId}/${this.businessType}`).then(
          (res) => {
            const { code, data, msg } = res;
            if (code === 200) {
              this.stageActive = data.length;
              this.modules = data.map((item, index) => {
                if (item.active == true) {
                  item.activityDefs.forEach((def) => {
                    if (def.hasActivation != 1) {
                      this.stageActive = index;
                      this.projectPhase = item.code;
                    }
                  });
                }
                item.activityDefs.forEach((def) => {
                  if (
                    (def.id == "KD3WVFR03O9GKODY0006" &&
                      def.hasActivation == 2) ||
                    (def.id == "KD3WVFR03O9GKODY0018" && def.hasActivation == 2)
                  ) {
                    this.editTimeForm = this.deepClone(editTimeForm);
                    this.eidtPersonForm = this.deepClone(eidtPersonForm);
                    this.getProjectDetail(
                      0,
                      def.id == "KD3WVFR03O9GKODY0006" ? 1 : 2
                    );
                  }
                });
                return item;
              });
            } else {
              // this.$message.error(msg);
            }
          }
        );
      } else if (this.businessType == 5 || this.businessType == 2) {
        Api.getProcessNodeOutList(
          `${this.businessId}/${this.businessType}`
        ).then((res) => {
          const { code, data, msg } = res;
          if (code === 200) {
            this.stageActive = data.length;
            this.modules = data.map((item, index) => {
              if (this.projectPhase == item.code) {
                // this.stageActive = index;
                item.activityDefs.forEach((def) => {
                  if (def.hasActivation != 1) {
                    this.stageActive = index;
                  }
                });
              }
              item.activityDefs.forEach((def) => {
                if (
                  (def.id == "KD3WVFR03O9GKODY0190" ||
                    def.id == "KD3WVFR03O9GKODY0198") &&
                  def.hasActivation == 2
                ) {
                  this.editTimeForm = this.deepClone(editTimeForm);
                  this.eidtPersonForm = this.deepClone(eidtPersonForm);
                  this.getProjectDetail(
                    1,
                    def.id == "KD3WVFR03O9GKODY0190" ? 1 : 2
                  );
                }
              });
              return item;
            });
          } else {
            // this.$message.error(msg);
          }
        });
      }
    },
    /**
     * 编辑时获取项目详情
     */
    getProjectDetail(falg, type) {
      if (falg == 0) {
        Api.getScpProjectApprovalWithScplat(this.businessId).then((res) => {
          const { code, data, msg } = res;
          if (code === 200) {
            this.projectSate = data.projectSate;
            this.interfacePersonIds =
              data.interfacePersonIds == null || data.interfacePersonIds == ""
                ? []
                : data.interfacePersonIds.split(",");
            if (data.applyUser == this.userInfo.userId) {
              this.showEidtTime = true;
              this.editTimeForm.modifyTimeRangeType = type;
              if (type == 1) {
                this.editTimeForm.distributeStartTime = this.parseTime(
                  data.stdOnlineWriteStartTime,
                  "{y}-{m}-{d}"
                );
                this.editTimeForm.distributeEndTime = this.parseTime(
                  data.stdOnlineWirteEndTime,
                  "{y}-{m}-{d}"
                );
                this.eidtPersonForm.distributeUsers = data.participantEditorIds;
              } else {
                this.editTimeForm.distributeStartTime = this.parseTime(
                  data.stdRequestForAdviceStartTime,
                  "{y}-{m}-{d}"
                );
                this.editTimeForm.distributeEndTime = this.parseTime(
                  data.stdRequestForAdviceEndTime,
                  "{y}-{m}-{d}"
                );
                this.eidtPersonForm.distributeUsers = data.advicerIds;
              }
              this.nodeSetForm.date = [
                this.editTimeForm.distributeStartTime,
                this.editTimeForm.distributeEndTime,
              ];
              this.nodeSetForm.userIds = this.eidtPersonForm.distributeUsers;
            }

            if (
              data.interfacePersonIds != null &&
              data.interfacePersonIds != ""
            ) {
              data.interfacePersonIds.split(",").forEach((id) => {
                if (this.userInfo.userId == id) {
                  this.showEidtTime = true;
                  this.editTimeForm.modifyTimeRangeType = type;
                  if (type == 1) {
                    this.editTimeForm.distributeStartTime = this.parseTime(
                      data.stdOnlineWriteStartTime,
                      "{y}-{m}-{d}"
                    );
                    this.editTimeForm.distributeEndTime = this.parseTime(
                      data.stdOnlineWirteEndTime,
                      "{y}-{m}-{d}"
                    );
                    this.eidtPersonForm.distributeUsers =
                      data.participantEditorIds;
                  } else {
                    this.editTimeForm.distributeStartTime = this.parseTime(
                      data.stdRequestForAdviceStartTime,
                      "{y}-{m}-{d}"
                    );
                    this.editTimeForm.distributeEndTime = this.parseTime(
                      data.stdRequestForAdviceEndTime,
                      "{y}-{m}-{d}"
                    );
                    // this.eidtPersonForm.distributeUsers = data.advicerIds;
                  }
                  this.nodeSetForm.date = [
                    this.editTimeForm.distributeStartTime,
                    this.editTimeForm.distributeEndTime,
                  ];
                  this.nodeSetForm.userIds =
                    this.eidtPersonForm.distributeUsers;
                  this.eidtPersonForm.projectType = data.projectType;
                }
              });
            }
          } else {
            // this.$message.error(msg);
          }
        });
      } else if (falg == 1) {
        Api.getScpProjectApprovalWithScplat(this.businessId).then((res) => {
          const { code, data, msg } = res;
          if (code === 200) {
            this.projectSate = data.projectSate;
            this.interfacePersonIds =
              data.interfacePersonIds == null || data.interfacePersonIds == ""
                ? []
                : data.interfacePersonIds.split(",");
            if (data.mainEditorId == this.userInfo.userId) {
              this.showEidtTime = true;
              this.editTimeForm.modifyTimeRangeType = type;
              if (type == 1) {
                this.editTimeForm.distributeStartTime = this.parseTime(
                  data.stdOnlineWriteStartTime,
                  "{y}-{m}-{d}"
                );
                this.editTimeForm.distributeEndTime = this.parseTime(
                  data.stdOnlineWirteEndTime,
                  "{y}-{m}-{d}"
                );
                this.eidtPersonForm.distributeUsers = data.participantEditorIds;
              } else {
                this.editTimeForm.distributeStartTime = this.parseTime(
                  data.stdRequestForAdviceStartTime,
                  "{y}-{m}-{d}"
                );
                this.editTimeForm.distributeEndTime = this.parseTime(
                  data.stdRequestForAdviceEndTime,
                  "{y}-{m}-{d}"
                );
                this.eidtPersonForm.distributeUsers = data.advicerIds;
              }

              this.nodeSetForm.date = [
                this.editTimeForm.distributeStartTime,
                this.editTimeForm.distributeEndTime,
              ];
              this.nodeSetForm.userIds = this.eidtPersonForm.distributeUsers;
              this.eidtPersonForm.projectType = data.projectType;
            }
            if (
              data.interfacePersonIds != null &&
              data.interfacePersonIds != ""
            ) {
              data.interfacePersonIds.split(",").forEach((id) => {
                if (this.userInfo.userId == id) {
                  this.showEidtTime = true;
                  this.editTimeForm.modifyTimeRangeType = type;
                  if (type == 1) {
                    this.editTimeForm.distributeStartTime = this.parseTime(
                      data.stdOnlineWriteStartTime,
                      "{y}-{m}-{d}"
                    );
                    this.editTimeForm.distributeEndTime = this.parseTime(
                      data.stdOnlineWirteEndTime,
                      "{y}-{m}-{d}"
                    );
                    this.eidtPersonForm.distributeUsers =
                      data.participantEditorIds;
                  } else {
                    this.editTimeForm.distributeStartTime = this.parseTime(
                      data.stdRequestForAdviceStartTime,
                      "{y}-{m}-{d}"
                    );
                    this.editTimeForm.distributeEndTime = this.parseTime(
                      data.stdRequestForAdviceEndTime,
                      "{y}-{m}-{d}"
                    );
                    this.eidtPersonForm.distributeUsers = data.advicerIds;
                  }

                  this.nodeSetForm.date = [
                    this.editTimeForm.distributeStartTime,
                    this.editTimeForm.distributeEndTime,
                  ];
                  this.nodeSetForm.userIds =
                    this.eidtPersonForm.distributeUsers;
                  this.eidtPersonForm.projectType = data.projectType;
                }
              });
            }
          } else {
            // this.$message.error(msg);
          }
        });
      }
    },
    /**
     * 设置操作人，起始时间
     * @param {*} data 要设置的节点信息
     * @param {*} id
     * @param {*} flag
     */
    setNode(data, id, flag) {
      this.setNodeId = id;
      this.setNodeDialog.title = "设置征求意见人员";
      this.eidtFlag = flag;
      if (
        this.setNodeId == "KD3WVFR03O9GKODY0003" ||
        this.setNodeId == "KD3WVFR03O9GKODY0187"
      ) {
        if (this.nodeSetForm.userIds == "") {
          this.nodeSetForm.userIds = this.$route.params.applyUser;
        } else {
          this.nodeSetForm.userIds += `,${this.$route.params.applyUser}`;
        }
        this.setNodeDialog.title = "设置起草人员";
      }
      this.pickerOptions["disabledDate"] = (time) => {
        if (data.deadLine && data.deadLine != null) {
          return (
            new Date(data.deadLine[0].date).getTime() < time.getTime() ||
            time.getTime() < Date.now() - 8.64e7
          );
        } else {
          return time.getTime() < Date.now() - 8.64e7;
        }
      };
      this.editTime = flag;
      this.setNodeDialog.visible = true;
    },

    /**
     * 关闭设置弹框
     */
    closeSetNode(e) {
      if (e == true) {
        this.$refs.nodeSetForm.validate((val) => {
          if (val) {
            if(this.nodeSetForm.userIds==this.$route.params.applyUser){
              return this.$message.warning("暂无选择其他人员")
            }
            if (this.showEidtTime != true || this.eidtFlag == 1) {
              if (
                this.setNodeId == "KD3WVFR03O9GKODY0003" ||
                this.setNodeId == "KD3WVFR03O9GKODY0006" ||
                this.setNodeId == "KD3WVFR03O9GKODY0006" ||
                this.setNodeId == "KD3WVFR03O9GKODY0190"
              ) {
                this.userList = [];
                this.$cache.session
                  .getJSON("sourceUserList")
                  .forEach((user) => {
                    this.nodeSetForm.userIds.split(",").forEach((id) => {
                      if (this.$route.params.applyUser == user.userId) {
                        this.userName = `${user.nickName}（${user.userName}）`;
                      } else if (id == user.userId) {
                        const newItem = {
                          id: user.userId,
                          label: `${user.nickName}（${user.userName}）`,
                          // userName: user.userName,
                        };

                        this.userList.push(newItem);
                      }
                    });
                  });
                this.dialogUsers.visible = true;
              } else {
                if (this.eidtFlag == 0) {
                  const req = {
                    distributeUsers: this.nodeSetForm.userIds,
                    id: this.businessId,
                    distributeStartTime: this.nodeSetForm.date[0],
                    distributeEndTime: this.nodeSetForm.date[1] /*  */,
                    distributePhase: this.projectPhase,
                  };
                  Api.setACtionUser(req).then((res) => {
                    const { code, msg } = res;
                    if (code == 200) {
                      this.$message.success("征求意见人员已设置");
                      this.setNodeDialog.visible = false;
                      this.nodeSetForm = this.deepClone(from);
                      this.getNodes();
                    } else {
                      this.$message.error(msg);
                    }
                  });
                } else {
                  this.$set(this.dialogUsers, "loadding", true);
                  this.eidtPersonForm.distributeUsers =
                    this.nodeSetForm.userIds;
                  this.eidtPersonForm.modifyMemberType = 2;
                  console.log(this.businessType);
                  this.eidtPersonForm.projectType = this.businessType;
                  this.eidtPersonForm.id = this.businessId;
                  Api.changeMyDistribute(this.eidtPersonForm).then((res) => {
                    console.log(res);
                    const { code, msg } = res;
                    if (code == 200) {
                      this.dialogUsers.visible = false;
                      this.dialogUsers.loadding = false;
                      this.$set(this.dialogUsers, "loadding", false);

                      this.$message.success("操作人已设置");
                      this.setNodeDialog.visible = false;

                      // if (this.businessType == 4) {
                      //   this.$router.push({
                      //     path: `/work/enterpriseStdRevise/viewProject/${this.businessId}/${this.projectPhase}`,
                      //   });
                      // } else if (this.businessType == 5) {
                      //   this.$router.push({
                      //     path: `/work/externalStdRevise/viewProject/${this.businessId}/${this.projectPhase}`,
                      //   });
                      // }
                      this.getNodes();
                    } else {
                      this.$message.error(msg);
                    }
                  });
                }
              }
            } else {
              if (this.eidtFlag == 0) {
                this.editTimeForm.id = this.businessId;
                this.editTimeForm.distributeStartTime =
                  this.nodeSetForm.date[0];
                this.editTimeForm.distributeEndTime = this.nodeSetForm.date[1];
                this.eidtPersonForm.projectType = this.businessType;

                this.$set(this.setNodeDialog, "loadding", true);
                Api.resolveTimeRange(this.editTimeForm).then((res) => {
                  const { code, msg } = res;
                  if (code == 200) {
                    this.$message.success("操作成功");
                    this.setNodeDialog.visible = false;
                    this.nodeSetForm = this.deepClone(from);

                    // if (this.businessType == 4) {
                    //   this.$router.push({
                    //     path: `/work/enterpriseStdRevise/viewProject/${this.businessId}/${this.projectPhase}`,
                    //   });
                    // } else if (this.businessType == 5) {
                    //   this.$router.push({
                    //     path: `/work/externalStdRevise/viewProject/${this.businessId}/${this.projectPhase}`,
                    //   });
                    // }
                    this.getNodes();
                  } else {
                    this.$message.error(msg);
                  }
                  this.$set(this.setNodeDialog, "loadding", false);
                });
              }
            }
          }
        });
      } else {
        this.nodeSetForm = this.deepClone(from);
        this.getNodes();
        this.setNodeDialog.visible = false;
      }
    },

    /**
     * 人员变化
     */
    userChange(e) {
      let arr = [];
      if (e.length > 0) {
        e.forEach((item) => {
          if (arr.indexOf(item) == -1 && item != this.$route.params.applyUser) {
            arr.push(item);
          }
        });
        this.nodeSetForm.userIds = arr.length > 0 ? arr.join(",") : "";
      }
  
    },
    userCheckAll(e){
      // if(e.length>0){
      //   this.nodeSetForm.userIds =e.join(",")
      // }
    },
    allowDrop(draggingNode, dropNode, type) {
      return (
        type !== "inner" && dropNode.userId != this.$route.params.applyUser
      );
    },
    allowDrag(draggingNode) {
      return draggingNode.id != this.$route.params.applyUser;
    },
    /**
     * 确认起草人顺序并保存
     */
    saveQCR(e) {
      if (e == true) {
        let ids = "";
        this.userList.forEach((user) => {
          if (ids != "") {
            ids += `,`;
          }
          ids += `${user.id}`;
        });
        const req = {
          distributeUsers: ids,
          id: this.businessId,
          distributeStartTime: this.nodeSetForm.date[0],
          distributeEndTime: this.nodeSetForm.date[1] /*  */,
          distributePhase: this.projectPhase,
        };
        if (this.eidtFlag == 0) {
          this.dialogUsers.loadding = true;
          Api.setACtionUser(req).then((res) => {
            const { code, msg } = res;
            if (code == 200) {
              this.setNodeDialog.visible = false;
              this.nodeSetForm = this.deepClone(from);

              this.dialogUsers.visible = false;
              this.dialogUsers.loadding = false;
              this.$message.success("操作人已设置");
              this.getNodes();
            } else {
              // this.$message.error(msg);
            }
          });
        } else {
          this.dialogUsers.loadding = true;
          this.eidtPersonForm.distributeUsers = this.nodeSetForm.userIds;
          this.eidtPersonForm.modifyMemberType = 1;
          this.eidtPersonForm.id = this.businessId;
          this.eidtPersonForm.projectType = this.businessType;
          Api.changeMyDistribute(this.eidtPersonForm).then((res) => {
            const { code, msg } = res;
            if (code == 200) {
              this.dialogUsers.visible = false;
              this.dialogUsers.loadding = false;
              this.$message.success("操作人已设置");
              this.setNodeDialog.visible = false;
              this.getNodes();
            } else {
              this.$message.error(msg);
            }
            this.$set(this.dialogUsers, "loadding", false);
          });
        }
      } else {
        this.dialogUsers.visible = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.view-process {
  width: 100%;
  height: 100%;
  padding: 35px;
  min-width: 1206px;
  overflow: auto;
  background: #ffffff;
  ::v-deep .module_steps {
    .el-step {
      height: 210px;
      .el-step__head {
        top: 4px;
        margin-left: 160px;
        .el-step__line {
          top: 2px;
        }
        .el-step__icon {
          border-color: #ffffff;
          margin-top: -3px;
          height: 40px;
          .modules_step {
            padding: 5px;
            border-radius: 50%;
            background: #d9d9d9;
          }
        }
      }
      .el-step__description {
        .module_description {
          .el-steps {
            .el-step {
              // height: 150px;
            }
          }
        }
      }
      .el-step__title {
        .module_title {
          position: absolute;
          left: 0;
          width: 145px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          min-height: 80px;
          .title-btn {
            background: #d9d9d9;
            color: #ffffff;
            line-height: 38px;
            height: 38px;
            text-align: center;
            border-radius: 0px 19px 19px 0px;
            cursor: pointer;
            margin-bottom: 15px;
            &:hover {
              background: #d0d0d0;
            }
          }
          .title-desc {
            width: 100%;
            color: #666666;
            line-height: 25px;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: pointer;
          }
        }
      }

      .is-finish {
        border-color: $green !important;
        color: $green !important;
        .modules_step {
          background: $green !important;
        }
        .title-btn {
          background: $green !important;
          &:hover {
            background: $green-hover !important;
          }
        }
        .el-step__line {
          background: $green !important;
          color: $green !important;
        }
        .el-step__line {
          background: $green !important;
        }
      }
      .module_description {
        margin-left: -15px;
        margin-top: -10px;
        .el-steps {
          display: flex;
          flex-wrap: wrap;
        }
        .el-step {
          width: 150px;
          flex-basis: 180px !important;
        }

        .el-step__head {
          margin: 15px auto;
          .el-step__line {
            width: 120px;
            // top: 6px;
            margin: 6px 15px;
            margin-left: 30px;
          }
          .el-step__icon {
            border-color: #d9d9d9;
            width: 28px;
            height: 28px;
          }
        }
        .el-step__title {
          display: flex;
          flex-direction: column;
          align-items: center;
          .step-title {
            width: 120px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            border-radius: 4px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            border: 1px solid rgba(166, 169, 173, 1);
            background-color: rgba(244, 244, 245, 1);
            color: #909399;
            font-size: 15px;
            padding: 0px 8px;
            cursor: pointer;
            margin: 10px 0px;
            &:hover {
              background: 1px solid rgba(166, 169, 173, 1);
              color: #666666;
            }
          }
          .step-btn {
            color: $link-text-color;
            font-size: 13px;
            cursor: pointer;
            &:hover {
              color: $link-text-hover-color;
            }
          }
        }
        .child-node {
          height: 180px;
        }
        // $puerple-light
        .this_step {
          font-weight: 400;
          .el-step__icon {
            border-color: $puerple-light;
            background: $puerple-light;
            color: #ffffff;
          }
          .status-ing {
            font-weight: 900;
            color: #555555;
          }
          .step-title {
            border: 1px solid $puerple-light;
            background-color: $puerple-light;
            color: #ffffff;

            &:hover {
              background: $puerple-light;
              color: #efefef;
            }
          }
          .el-step__line {
            background: $puerple-light !important;
          }
        }
        .el-step__line {
          background: #c0c4cc !important;
        }
        .is-success,
        .is-process {
          font-weight: 400;
          .el-step__icon {
            border-color: #13ce66;
            color: #13ce66;
          }
          .step-title {
            border: 1px solid #13ce66;
            background-color: rgba(240, 249, 232, 1);
            color: #13ce66;
            &:hover {
              background: #13ce66;
              color: #ffffff;
            }
          }
          .el-step__line {
            background: #13ce66 !important;
          }
          .status {
            color: #555555;
          }
        }
      }
    }
    .this-step {
      border-color: $puerple-light !important;
      color: $green !important;
      .modules_step {
        background: $puerple-light !important;
      }
      .title-btn {
        background: $puerple-light !important;
        &:hover {
          background: $puerple-light-hover !important;
        }
      }
      .el-step__line {
        background: $puerple-light !important;
        color: $puerple-light !important;
      }
      .el-step__line {
        background: $puerple-light !important;
      }
    }
  }
}
::v-deep .menu-list {
  width: 100%;
  // display: flex;
  // flex-wrap: wrap;
  .el-tree-node {
    // width: 48%;
    // &:nth-child(2n) {
    //   justify-self: end;
    // }
  }
}
::v-deep .red-txt {
  color: $red;
  width: 100%;
  text-align: left;
  font-size: 14px;
  line-height: 35px;
}
</style>
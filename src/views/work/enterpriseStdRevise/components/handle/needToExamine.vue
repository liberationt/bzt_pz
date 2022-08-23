<template>
  <div>
    <BztDialog
      :dialogInfo="dialogInfo"
      @close="closeDialog($event, 0)"
      :appendTobody="true"
    >
      <template slot="body">
        <el-form
          :model="needToExamineForm"
          :rules="rules"
          ref="needToExamineForm"
          label-suffix=":"
          label-width="160px"
          class="needToExamineForm"
        >
          <el-form-item label="是否组织线下会议" prop="reviewState">
            <el-radio-group v-model="needToExamineForm.reviewState">
              <el-radio :label="1"> 组织 </el-radio>
              <el-radio :label="0"> 不组织 </el-radio>
            </el-radio-group>
            
          </el-form-item>

          <el-form-item label="选择审核人" prop="approvedBy">
            <el-select  placeholder="请选择审核人" filterable clearable v-model="needToExamineForm.approvedBy" style="width:60%">
              <el-option
                v-for="item in optionList"
                :key="item.value"
                :label="`${item.nickName}(${item.userName})`"
                :value="item.userId">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item
            label="选择会签人"
            v-if="needToExamineForm.reviewState != 1"
            prop="countersign"
          >
            <SelectUserByDept
              :value="needToExamineForm.countersign"
              :disableDepts="[]"
              @user-change="userChange"
            />
          </el-form-item> -->
          <el-form-item
            label="选择会签人"
            prop="countersign"
          >
            <SelectUserByDept
              :value="needToExamineForm.countersign"
              :disableDepts="[]"
              @user-change="userChange"
            />
          </el-form-item>
          <!-- <el-select  placeholder="请选择审核人">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select> -->
        </el-form>
      </template>
    </BztDialog>

    <!-- 确认会签人顺序 -->
    <BztDialog
      :dialogInfo="dialogUsers"
      @close="commitPro"
      :appendTobody="false"
    >
      <template slot="body" v-if="dialogUsers.visible == true">
        <div class="red-txt">注：可拖动调节顺序</div>
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
import { BztDialog } from "@components/basicCom/index";
import Api from "@api/process";
import { mapGetters } from "vuex";

// import { SelectUserByDept } from "@components/bussinessCom/index";
import SelectUserByDept  from "@components/bussinessCom/model/selectDept";

//新增

import {
  listUser,
  listUserByRoleKey,
  listUserByDeptsAndRoleKeys,
} from "@api/system/user";

export default {
  components: { BztDialog, SelectUserByDept },
  name: "needToExamine",
  dicts: ["info_publish_theme"],
  computed: {
    ...mapGetters(["userInfo"]),
  },
  props: {
    visiable: {
      type: Boolean,
      default: false,
    },
    businessObjId: {
      type: String | Number,
      default: null,
    },
    title: { type: String, default: "第一起草人审核" },
    type: {
      type: Number,
      default: 0, // 0：审核，1：会签
    },
  },
  watch: {
    visiable: {
      handler(val) {
        this.dialogInfo.title = this.title;
        this.dialogInfo.visible = val;
      },
    },
  },
  data() {
    return {
      dialogUsers: {
        visible: false,
        title: "确认会签人顺序",
        width: "600px",
        footer: true,
      },
      dialogInfo: {
        visible: false,
        title: "第一起草人审核",
        width: "1000px",
        footer: true,
        loadding: false,
      },
      date: [],
      needToExamineForm: {
        id: null,
        reviewState: null,
        countersign: "",
        approvedBy:''
      },
      rules: {
        reviewState: {
          required: true,
          message: "请选择审核结论",
          trigger: ["blur", "change"],
        },
        countersign: {
          required: true,
          message: "请选择会签人",
          trigger: ["blur"],
        },
        approvedBy:{
          required: true,
          message: "请选择审核人",
          trigger: ["blur", "change"],
        },
      },
      userList: [],
      optionList:[]
    };
  },

  mounted() {
    this.dialogInfo.visible = this.visiable;
    this.dialogInfo.loadding = false;
    this.dialogInfo.title = this.title;
    this.getDeptPersion()
  },

  methods: {
    //获取用户部门人员
    getDeptPersion(){
      let req = {
          deptIds: this.userInfo.deptId.toString(),
          roleKeys: '',
        };
        listUserByDeptsAndRoleKeys(req).then((res) => {
          const { code, msg, data } = res;
          if (code === 200) {
            this.optionList = data;
          } else {
            // this.$message.error(msg);
          }
        });
    },
    /**
     * 获取UserName
     */
    getUserName(ids) {
      let arr = [];
      if (ids != "") {
        ids.split(",").forEach((id) => {
          const sourceUserList = this.$cache.session.getJSON("sourceUserList");
          if (id == 0) return "系统";
          const user = _.find(sourceUserList, { userId: Number(id) });
          arr.push(user ? `${user.nickName}` : `-`);
        });
      }
      return arr.length > 0 ? arr.join("；") : "";
    },
    /**
     * 人员变化
     */
    userChange(e) {
      console.log(999)
      this.needToExamineForm.countersign = e.length > 0 ? e.join(",") : "";
    },
    allowDrop(draggingNode, dropNode, type) {
      return type !== "inner";
    },
    allowDrag(draggingNode) {
      return true;
    },
    async commitPro(e) {
      if (e === true) {
        this.dialogInfo.loadding = true;
        this.needToExamineForm.id = this.businessObjId;
        this.needToExamineForm.countersign = this.userList
          .map((item) => {
            return item.id;
          })
          .join(",");
        this.$set(this.dialogInfo, "loadding", true);
        await Api.enNeedMeetingUnderLine(this.needToExamineForm).then((res) => {
          const { code, msg } = res;
          if (code === 200) {
            this.$message.success("审核已提交");
          } else {
            // this.$message.error(msg);
          }
          this.$set(this.dialogInfo, "loadding", false);
          this.dialogInfo.visible = false;
          this.$emit("save", null);
        });
        this.dialogUsers.visible = false;
        this.dialogInfo.loadding = false;
      } else {
        this.dialogUsers.visible = false;
        this.dialogInfo.visible = false;
        this.dialogInfo.loadding = false;
        this.$emit("save", null);
      }
    },
    /**
     * 提交审核
     */
    async closeDialog(e) {
      if (e === true) {
        if (this.needToExamineForm.reviewState == 1) {
          this.needToExamineForm.id = this.businessObjId;
          this.$refs.needToExamineForm.validate(async (valid) => {
            if (valid) {
              this.dialogInfo.loadding = true;
              this.$set(this.dialogInfo, "loadding", true);
              await Api.enNeedMeetingUnderLine(this.needToExamineForm).then(
                (res) => {
                  const { code, msg } = res;
                  if (code === 200) {
                    this.$message.success("审核已提交");
                  } else {
                    // this.$message.error(msg);
                  }
                  this.$set(this.dialogInfo, "loadding", false);
                  this.dialogInfo.visible = false;
                  this.$emit("save", null);
                }
              );
              this.dialogInfo.loadding = false;
            }
          });
        } else {
          //新增会签人校验
          this.$refs.needToExamineForm.validate(async (valid) => {
            if (valid) {
              this.userList = [];
              this.$cache.session.getJSON("sourceUserList").forEach((user) => {
                this.needToExamineForm.countersign.split(",").forEach((id) => {
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
            }
          });
          // 之前的逻辑
          return 
          this.userList = [];
          this.$cache.session.getJSON("sourceUserList").forEach((user) => {
            this.needToExamineForm.countersign.split(",").forEach((id) => {
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
        }
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
::v-deep .el-form {
  width: 100%;
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
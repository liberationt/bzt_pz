<template>
  <div>
    <BztDialog
      :dialogInfo="dialogInfo"
      @close="closeDialog($event, 0)"
      :appendTobody="true"
    >
      <template slot="body">
        <el-form
          :model="examineForm"
          :rules="rules"
          ref="examineForm"
          label-suffix=":"
          label-width="130px"
          class="examineForm"
        >
          <el-form-item label="审核结论" prop="reviewState">
            <el-radio-group v-model="examineForm.reviewState">
              <el-radio :label="1"> 通过 </el-radio>
              <el-radio :label="2"> 不通过 </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="修改原因"
            prop="rejectReason"
            v-if="examineForm.reviewState == 2"
          >
            <el-input
              type="textarea"
              placeholder="请输入修改原因"
              v-model="examineForm.rejectReason"
            />
          </el-form-item>
          <el-form-item
            label="选择会签人"
            v-if="examineForm.reviewState == 1 && toSign == true"
            prop="countersign"
          >
            <SelectUserByDept
              :value="examineForm.countersign"
              :disableDepts="[]"
              @user-change="userChange"
            />
          </el-form-item>
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
import { SelectUserByDept } from "@components/bussinessCom/index";
import Api from "@api/process";

export default {
  components: { BztDialog, SelectUserByDept },
  name: "toExamine",
  dicts: ["info_publish_theme"],
  props: {
    visiable: {
      type: Boolean,
      default: false,
    },
    businessObjId: {
      type: String | Number,
      default: null,
    },
    title: { type: String, default: "标准化审核" },
    type: {
      type: Number,
      default: 0, // 0：审核，1：会签，2：审核人审核
    },
    toSign: {
      type: Boolean,
      default: false,
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
        title: "标准化审核",
        width: "900px",
        footer: true,
        loadding: false,
      },
      date: [],
      examineForm: {
        id: null,
        reviewState: null,
        rejectReason: "",
        countersign: "",
      },
      rules: {
        reviewState: {
          required: true,
          message: "请选择审核结论",
          trigger: ["blur", "change"],
        },
        rejectReason: {
          required: true,
          message: "请输入驳回原因",
          trigger: "blur",
        },
        countersign: {
          required: true,
          message: "请选择会签",
          trigger: "blur",
        },
      },
    };
  },

  mounted() {
    this.dialogInfo.visible = this.visiable;
    this.dialogInfo.loadding = false;
    this.dialogInfo.title = this.title;
  },

  methods: {
    /**
     * 人员变化
     */
    userChange(e) {
      this.examineForm.countersign = e.length > 0 ? e.join(",") : "";
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
        this.examineForm.id = this.businessObjId;
        this.examineForm.countersign = this.userList
          .map((item) => {
            return item.id;
          })
          .join(",");
        this.$set(this.dialogInfo, "loadding", true);
        await Api.enReviewDraft(this.examineForm).then((res) => {
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
        this.examineForm.id = this.businessObjId;
        if (this.examineForm.reviewState == 1 && this.toSign == true) {
          this.userList = [];
          this.$cache.session.getJSON("sourceUserList").forEach((user) => {
            this.examineForm.countersign.split(",").forEach((id) => {
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
          return;
        }
        this.$refs.examineForm.validate(async (valid) => {
          if (valid) {
            if (this.type == 0) {
              this.$set(this.dialogInfo, "loadding", true);

              await Api.enReviewDraft(this.examineForm).then((res) => {
                const { code, msg } = res;
                if (code === 200) {
                  this.$message.success("审核已提交");
                } else {
                  // this.$message.error(msg);
                }
                this.dialogInfo.visible = false;
                this.$set(this.dialogInfo, "loadding", false);

                this.$emit("save", null);
              });
              this.dialogInfo.loadding = false;
            }else if(this.type==2){
              this.$set(this.dialogInfo, "loadding", true);
              await Api.enDeptAudit(this.examineForm).then((res) => {
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
              this.dialogInfo.loadding = false;
            }else {
              this.$set(this.dialogInfo, "loadding", true);
              await Api.enStdCountersignature(this.examineForm).then((res) => {
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
              this.dialogInfo.loadding = false;
            }
          }
        });
      } else {
        this.$set(this.dialogInfo, "loadding", false);
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
<template>
  <div>
    <BztDialog
      :dialogInfo="dialogInfo"
      @close="closeDialog($event, 0)"
      :appendTobody="true"
    >
      <template slot="body">
        <el-form
          :model="choiceReviewedForm"
          :rules="rules"
          ref="choiceReviewedForm"
          label-suffix=":"
          label-width="130px"
          class="choiceReviewedForm"
        >
          <el-form-item label="部门级领导审定" prop="deptLeader">
            <el-select
              v-model="choiceReviewedForm.deptLeader"
              placeholder="请选部门级领导"
            >
              <template v-for="(item, index) in depList">
                <el-option
                  :key="`user_${index}`"
                  :label="`${item.nickName}(${item.userName})`"
                  :value="Number(item.userId)"
                />
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="公司级领导审批" prop="companyLeader">
            <el-select
              v-model="choiceReviewedForm.companyLeader"
              placeholder="请选公司级领导"
            >
              <template v-for="(item, index) in comList">
                <el-option
                  :key="`user_${index}`"
                  :label="`${item.nickName}(${item.userName})`"
                  :value="Number(item.userId)"
                />
              </template>
            </el-select>
          </el-form-item>
        </el-form>
      </template>
    </BztDialog>
  </div>
</template>
<script>
import { BztDialog } from "@components/basicCom/index";
import Api from "@api/process";
import { mapGetters } from "vuex";

export default {
  components: { BztDialog },
  computed: {
    ...mapGetters(["userInfo"]),
  },
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
    title: { type: String, default: "选择审定/批准人" },
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
      dialogInfo: {
        visible: false,
        title: "选择部门级、公司级评审人",
        width: "900px",
        footer: true,
        loadding: false,
      },
      depList: [],
      comList: [],
      choiceReviewedForm: {
        id: null,
        deptLeader: null,
        companyLeader: null,
      },
      rules: {
        deptLeader: {
          required: true,
          message: "请选择部门级领导",
          trigger: ["blur", "change"],
        },
        companyLeader: {
          required: true,
          message: "请选择公司级领导",
          trigger: "blur",
        },
      },
    };
  },

  mounted() {
    this.dialogInfo.visible = this.visiable;
    this.dialogInfo.loadding = false;
    this.dialogInfo.title = this.title;
    this.getUserList();
  },

  methods: {
    /**
     * 获取用户列表
     */
    getUserList() {
      // 获取部门领导列表
      Api.getTaskCheckList({
        roleKeys: "deptLeader,principalLeader",
        deptId: this.userInfo.deptId,
      }).then((res) => {
        const { code, data, msg } = res;
        if (code === 200) {
          this.depList = data;
        } else {
          // this.$message.error(msg);
        }
      });
      // 获取公司级领导列表
      Api.getTaskCheckList({
        roleKeys: "companyLeader",
        deptId: 0,
      }).then((res) => {
        const { code, data, msg } = res;
        if (code === 200) {
          this.comList = data;
        } else {
          // this.$message.error(msg);
        }
      });
    },
    /**
     * 提交审核
     */
    async closeDialog(e) {
      if (e === true) {
        this.choiceReviewedForm.id = this.businessObjId;
        this.$refs.choiceReviewedForm.validate(async (valid) => {
          if (valid) {
            this.$set(this.dialogInfo, "loadding", true);

            await Api.choiceReviewedBy(this.choiceReviewedForm).then((res) => {
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
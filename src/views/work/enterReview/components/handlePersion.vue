<template>
  <BztDialog
    :dialogInfo="dialogInfo"
    @close="closeDialog($event, 0)"
    :appendTobody="true"
  >
    <template slot="body">
      <el-form
        :model="distributeProForm"
        :rules="rules"
        ref="distributeProForm"
        label-suffix=":"
        label-width="130px"
        class="distributeProForm"
      >
        <el-form-item label="处理人员" prop="userList">
          <SelectUserByDept
            :value="distributeProForm.userList"
            :roleKeys="'stdLiaison'"
            :disableDepts="[]"
            @user-change="userChange"
          />
        </el-form-item>
      </el-form>
    </template>
  </BztDialog>
</template>
<script>
import { BztDialog } from "@components/basicCom/index";
import Api from "@api/process";
// import { SelectUserByDept } from "@components/bussinessCom/index";
import SelectUserByDept from "@components/bussinessCom/model/selectDept";

export default {
  components: { BztDialog, SelectUserByDept },
  name: "distribute-pro",
  dicts: ["info_publish_theme"],
  props: {
    visiable: {
      type: Boolean,
      default: false,
    },
    taskInfo: {
      type: Object,
      default: null,
    },
    title: { type: String, default: "选择标准化网员" },
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
        title: "标准化审核",
        width: "1000px",
        footer: true,
        loadding: false,
      },
      distributeProForm: {
        userList: "",
        date: null,
      },
      rules: {
        userList: {
          required: true,
          message: "请选择网员",
          trigger: "blur",
        },
      },
      // pickerOptions: {
      //   disabledDate(time) {
      //     // return time.getTime() < Date.now() - 8.64e7;
      //     return time.getTime() < Date.now(this.taskInfo.startTime);
      //   },
      // },
    };
  },
  computed: {
    pickerOptions(time) {
      let disableTime = {};
      disableTime["disabledDate"] = (time) => {
        return (
            new Date(this.taskInfo.startTime).getTime() > time.getTime() ||
            time.getTime() > new Date(this.taskInfo.endTime).getTime()
          );
      };
      return disableTime;
    },
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
      this.distributeProForm.userList = e.length > 0 ? e.join(",") : "";
    },
    /**
     * 提交审核
     */
    closeDialog(e) {
      if (e === true) {
        this.$refs.distributeProForm.validate((valid) => {
          if (valid) {
            console.log(this.distributeProForm.userList)
            this.$set(this.dialogInfo, "loadding", true);
            const req = {
              rwTaskId: this.taskInfo.id,
              userList: this.distributeProForm.userList.split(","),
            //   startTime: this.distributeProForm.date[0],
            //   endTime: this.distributeProForm.date[1],
              projectType: 6,
            };
            Api.distributePersonnel(req).then((res) => {
              const { code, msg } = res;
              if (code === 200) {
                this.$message.success("操作成功");
                this.$emit("save", false);
              } else {
                // this.$message.error(msg);
              }
              this.dialogInfo.visible = false;
              this.$set(this.dialogInfo, "loadding", false);

              this.dialogInfo.loadding = false;
            });
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
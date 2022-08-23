<template>
  <div class="aduit-purchase">
    <div class="main-list" style="margin-bottom:20px">
        <el-table :data="todoTask" stripe>
        <el-table-column
            prop="taskTitle"
            label="任务名称"
            min-width="300px"
            align="center"
        />
        <el-table-column
            label="任务类型"
            prop="taskSubType"
            min-width="200px"
            :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
              label="发送人"
              prop="createUser"
              align="center"
              width="120px"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span
                  v-html="parseKeyword(parseUser(scope.row.createUser))"
                ></span>
              </template>
            </el-table-column>
        </el-table>
    </div>
    <el-form
      :model="aduitForm"
      :rules="rules"
      ref="aduitForm"
      label-suffix=":"
      label-width="100px"
      class="aduitForm"
    >
      <el-form-item label="审核结论" prop="state">
        <el-radio-group v-model="aduitForm.state">
          <el-radio :label="1">通过</el-radio>
          <el-radio :label="-1">驳回</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="理由"
        v-if="aduitForm.state == -1"
        prop="approveConclusion"
      >
        <el-input
          type="textarea"
          v-model="aduitForm.approveConclusion"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="footer">
      <div class="cancelBtn" @click="aduit(false)">取消</div>
      <el-button class="submit-btn" @click="aduit(true)" :loading="isLoading">
        确定
      </el-button>
    </div>
  </div>
</template>
<script>
import Api from "@api/process";
const auditForm = {
  approveConclusion: "",
  state: null,
  hook: "",
  id: "",
};
export default {
  name: "BatchAudit",
  props: {
    todoTask: {
      type: Array,
      default:()=>{
        return []
      }
    },
  },
  data() {
    return {
      dialogInfo: {
        visible: false,
        title: "审核",
        width: "900px",
      },
      aduitForm: this.deepClone(auditForm),
      rules: {
        approveConclusion: {
          required: true,
          message: "请输入驳回理由",
          trigger: "blur",
        },
        state: {
          required: true,
          message: "请选择审核结论",
          trigger: "blur",
        },
      },
      isLoading: false,
      approveConclusion: "",
      hook: "",
      aduitInfo: null,
      sourceUserList:[]
    };
  },
  
  mounted() {
    this.sourceUserList = this.$cache.session.getJSON("sourceUserList");
  },
  methods: {
    // 用户名称转换
    parseUser(userId) {
      if (userId == 0) return "系统";
      const user = _.find(this.sourceUserList, { userId: userId });
      return user ? user.nickName : "-";
    },
    // 关键字转换
    parseKeyword(value) {
      if (!_.isEmpty(this.searchKeyword)) {
        value = value.replace(
          new RegExp(this.searchKeyword, "gm"),
          '<span style="color: #F56C6C;">' + this.searchKeyword + "</span>"
        );
      }
      return value;
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
     * 内容审核审核操作
     * @param {*} e true:提交审核，false:取消审核
     */
    aduit(e) {
      if (e === false) {
        this.$emit("close", null);
      } else {
        this.$refs.aduitForm.validate((valid) => {
          if (valid) {
            let dataList = []
            this.todoTask.forEach((item)=>{
                dataList.push({
                    approveConclusion:this.aduitForm.approveConclusion,
                    hook:item.hook,
                    id:item.businessObjId,
                    state:this.aduitForm.state
                })
            })
            this.isLoading = true;
            Api.aduitStdPurchase(dataList).then((res) => {
              const { code, data, msg } = res;
              this.isLoading = false;
              if (code === 200) {
                this.$message.success(`操作成功`);
                // if (this.aduitForm.state == 1) {
                //   this.$router.push({
                //     path: `/work/stdPurchase`,
                //   });
                // } else {
                //   }
                this.$emit("success", null,1);
              }
            });
          }
        });
      }
    },
    /**
     * 取消
     */
    handleClose() {
      this.dialogInfo.visible = false;
      this.$emit("close", null);
    },
    handleSuccess() {
      this.dialogInfo.visible = false;
      this.$emit("success", null);
    },
    closeDialog() {
      this.dialogInfo.visible = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.aduit-purchase {
  ::v-deep .aduitForm {
    margin-top: 25px;
    font: initial !important;
    margin-top: -5px;
    font-size: 15px !important;
    .form-title {
      font-size: 16px;
      font-weight: 600;
      border-left: $bule 3px solid;
      line-height: 18px;
      padding-left: 8px;
      margin-bottom: 15px;
    }
    .el-form-item {
      margin-bottom: 10px;
    }
    .el-form-item__label {
      font-size: 14px;
    }
    .el-form-item__content {
      text-align: left !important;
    }
  }
  .footer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 25px;
  }
}
</style>
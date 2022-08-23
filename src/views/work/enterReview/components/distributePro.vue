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
        <el-form-item label="起止时间" prop="date">
          <el-date-picker
            v-model="distributeProForm.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item label="是否下发任务" prop="radio">
          <el-radio-group v-model="distributeProForm.radio" @change="changeHandle">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="处理人员" prop="userList" v-if="distributeProForm.radio==1">
          <!-- <SelectUserByDept
            v-if="radio==1"
            :value="distributeProForm.userList"
            :roleKeys="'stdLiaison'"
            :disableDepts="[]"
            :checkOneUser="true"
            @user-change="userChange"
          /> -->
          <el-select v-model="distributeProForm.userList" filterable  clearable placeholder="请选择处理人员">
            <template v-for="(item, index) in directorList">
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
</template>
<script>
import { BztDialog } from "@components/basicCom/index";
import Api from "@api/process";
// import { SelectUserByDept } from "@components/bussinessCom/index";
import SelectUserByDept from "@components/bussinessCom/model/selectDept";
import { mapGetters } from "vuex";
import {
  listUserByDeptsAndRoleKeys,
} from "@api/system/user";

export default {
  components: { BztDialog, SelectUserByDept },
  name: "distribute-pro",
  dicts: ["info_publish_theme"],
  computed: {
   
  },
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
    selectDataList:{
      type:Array,
      default:()=>{
        return []
      }
    }
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
        radio:'',
      },
      rules: {
        userList: {
          required: true,
          message: "请选择处理人员",
          trigger: "blur",
        },
        radio:{
          required: true,
          message: "请选择是否下发任务",
          trigger: "change",
        },
        date: {
          required: true,
          message: "选择起止日期",
          trigger: "change",
        },
        
      },
      directorList:[]
      // pickerOptions: {
      //   disabledDate(time) {
      //     // return time.getTime() < Date.now() - 8.64e7;
      //     return time.getTime() < Date.now(this.taskInfo.startTime);
      //   },
      // },
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
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
    const req = {
      deptIds: this.userInfo.deptId,
      roleKeys: "",
    };
    listUserByDeptsAndRoleKeys(req).then((res) => {
      const { code, msg, data } = res;
      if (code === 200) {
        this.directorList = data
      } else {
        // this.$message.error(msg);
      }
    });
  },

  methods: {
    changeHandle(val){
      if(val==1){
       this.distributeProForm.userList = ''
      }else{
        this.distributeProForm.userList = String(this.$store.state.user.userInfo.userId)
      }
    },
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
            this.$set(this.dialogInfo, "loadding", true);
            let standardList = []
            this.selectDataList.forEach((item)=>{
              standardList.push(item.rwStandardId)
            })
            const req = {
              rwTaskId: this.taskInfo.id,
              // userList: this.distributeProForm.userList.split(","),
              startTime: this.distributeProForm.date[0],
              endTime: this.distributeProForm.date[1],
              projectType: 6,
              standardList,
              userId:this.distributeProForm.userList,
              processorTaskId:this.taskInfo.childTaskId
            };
            Api.distributionHandler(req).then((res) => {
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
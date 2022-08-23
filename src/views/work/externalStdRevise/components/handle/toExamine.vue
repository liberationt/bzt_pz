<template>
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
        <!-- 审核草案高 -->
        <template v-if="state == 1205">
          <el-form-item label="编制时间" prop="dodate">
            <el-date-picker
              v-model="examineForm.organizationTime"
              type="date"
              placeholder="选择编制时间"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              :picker-options="pickerOptions"
            />
          </el-form-item>
        </template>
      </el-form>
    </template>
  </BztDialog>
</template>
<script>
import { BztDialog } from "@components/basicCom/index";
import Api from "@api/process";

export default {
  components: { BztDialog },
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
      default: 0, // 0：审核，1：会签
    },
    docUrl:{
      type:String,
      default:''
    },
    state: {
      type: Number,
      default: null, // 项目所在节点
    },
    version:{
      type:Number,
      default:13
    }
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
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
        organizationTime: "",
        fileJson: "",
        version:''
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
      },
    };
  },
  watch: {
    visiable: {
      handler(val) {
        this.dialogInfo.title = this.title;
        this.dialogInfo.visible = val;
        this.examineForm = {
          id: null,
          reviewState: null,
          rejectReason: "",
          version:''
        };
      },
    },
  },
  mounted() {
    this.examineForm = {
      id: null,
      reviewState: null,
      rejectReason: "",
      version:''
    };
    this.dialogInfo.visible = this.visiable;
    this.dialogInfo.loadding = false;
    this.dialogInfo.title = this.title;
    this.getSelectVersion()
  },

  methods: {
    //获取版本
    getSelectVersion(){
      let paramsData = {
        businessObjId:this.businessObjId,
        businessObjType:5,
        type:this.version
      }
      Api.getSelectVersion(paramsData).then(res=>{
        const { data,code,message} = res
        if(code===200){
          if(data==null||data==""){
            this.examineForm.version = 2
          }else{
            this.examineForm.version = Number(data)+1
          }
        }
      })
    },  
    /**
     * 提交审核
     */
    closeDialog(e) {
      if (e === true) {
        this.examineForm.id = this.businessObjId;
        this.$refs.examineForm.validate((valid) => {
          if (valid) {
            if (this.type == 0) {
              //新增
              if(this.examineForm.reviewState==1){
                this.examineForm.url = this.docUrl
              }
              console.log(this.examineForm,999)
              this.$set(this.dialogInfo, "loadding", true);
              Api.setExamin(this.examineForm).then((res) => {
                const { code, msg } = res;
                if (code === 200) {
                  this.$message.success(this.title);
                } else {
                  this.$message.error(msg);
                }
                this.dialogInfo.visible = false;
                this.$set(this.dialogInfo, "loadding", false);

                this.$emit("save", null);
                this.dialogInfo.loadding = false;
              });
            } else {
              this.$set(this.dialogInfo, "loadding", true);
              Api.enStdCountersignature(this.examineForm).then((res) => {
                const { code, msg } = res;
                if (code === 200) {
                  this.$message.success("审核已提交");
                } else {
                  this.$message.error(msg);
                }
                this.dialogInfo.visible = false;
                this.$set(this.dialogInfo, "loadding", false);
                this.$emit("save", null);
                this.dialogInfo.loadding = false;
              });
            }
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
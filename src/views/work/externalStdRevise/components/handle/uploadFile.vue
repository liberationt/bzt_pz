<template>
  <BztDialog
    :dialogInfo="dialogInfo"
    @close="closeDialog($event, 0)"
    :appendTobody="true"
  >
    <template slot="body">
      <el-form
        :model="logFileForm"
        :rules="rules"
        ref="logFileForm"
        label-suffix=":"
        class="logFileForm"
      > 
        <!-- <el-form-item label="相关附件" prop="fileList">
          <BztUploadFile
            :value="fileList"
            :limit="10"
            :fileSize="100"
            type="drop"
            @upload-change="fileChange"
          />
        </el-form-item> -->
        <el-form-item
          label="会议纪要"
          style="width: 100%"
          prop="fileUrl"
        >
          <BztUploadFile
            :value="fileUrl"
            :limit="1"
            :fileSize="100"
            @upload-change="fileChanges"
          />
        </el-form-item>
        <el-form-item
          label="附件"
          style="width: 100%"
        >
          <BztUploadFile
            :value="fileList"
            :limit="1000"
            :fileSize="100"
            @upload-change="fileChange"
          />
        </el-form-item>
        <el-form-item :label="`是否组织第${logFileForm.version}次${labelTitle}审查会`" prop="reviewState" v-if="isUpload">
          <el-radio v-model="logFileForm.reviewState" :label="1">组织</el-radio>
          <el-radio v-model="logFileForm.reviewState" :label="2">不组织</el-radio>
        </el-form-item>
      </el-form>
    </template>
  </BztDialog>
</template>
<script>
import { BztDialog, BztUploadFile } from "@components/basicCom/index";
import Api from "@api/process";

export default {
  components: { BztDialog, BztUploadFile },
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
    fileTitle:{
      type:String,
      default:''
    },
    isUpload:{
      type:Boolean,
      default:true
    },
    version:{
      type:Number,
      default:13
    },
    labelTitle:{
      type:String,
      default:''
    }
  },
  watch: {
    visiable: {
      handler(val) {
        this.dialogInfo.title = this.title;
        this.dialogInfo.visible = val;
        this.dialogInfo.title = this.fileTitle;
      },
    },
  },
  data() {
    return {
      dialogInfo: {
        visible: false,
        title: "",
        width: "900px",
        footer: true,
        loadding: false,
      },
      fileList: [],
      fileUrl:[],
      logFileForm: {
        id: null,
        fileList: [],
        fileUrl:[],
        reviewState:'',
        version:""
      },
      rules: {
        fileList: {
          required: true,
          message: "请上传相关附件",
          trigger: ["blur", "change"],
        },
        fileUrl: {
          required: true,
          message: "请上传会议纪要文件",
          trigger: ["blur", "change"],
        },
        reviewState:{
          required: true,
          message: "是否组织审查会",
          trigger: ["blur", "change"],
        }
      },
    };
  },

  mounted() {
    this.dialogInfo.visible = this.visiable;
    this.dialogInfo.title=this.fileTitle
    this.dialogInfo.loadding = false;
    this.getSelectVersion()
  },

  methods: {
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
            this.logFileForm.version = 2
          }else{
            this.logFileForm.version = Number(data)+1
          }
        }
      })
    },  
    /**
     * 上传附件
     */
    fileChange(e) {
      this.fileList = e;
      this.logFileForm.fileList =
        this.fileList.length == 0
          ? ""
          : this.fileList.map((item) => {
              return { name: item.name, url: item.url,type:13,version:this.logFileForm.version };
            });
    },
    fileChanges(e){
      this.fileUrl = e;
      this.logFileForm.fileUrl =
        this.fileUrl.length == 0
          ? ""
          : this.fileUrl.map((item) => {
              return { name: item.name, url: item.url,version:this.logFileForm.version };
            });
    },
    /**
     * 提交审核
     */
    closeDialog(e) {
      if (e === true) {
        // this.logFileForm.id = this.businessObjId;
        this.$refs.logFileForm.validate((valid) => {
          if (valid) {
            let paramsData = {
              id: this.businessObjId,
              reviewState: this.logFileForm.reviewState,
              rejectReason:''
            }
            let fileList = this.logFileForm.fileList.concat(this.logFileForm.fileUrl)
            paramsData.fileList = fileList
            this.$set(this.dialogInfo, "loadding", true);
            Api.uploadFile(paramsData).then((res) => {
              const { code, msg } = res;
              if (code === 200) {
                this.$message.success(`${this.fileTitle}成功`);
              } else {
                this.$message.error(msg);
              }
              this.$set(this.dialogInfo, "loadding", false);
              this.dialogInfo.visible = false;
              this.$emit("save", null);
              this.dialogInfo.loadding = false;
            });
          }
        });
      } else {
        this.dialogInfo.visible = false;
        this.$set(this.dialogInfo, "loadding", false);
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
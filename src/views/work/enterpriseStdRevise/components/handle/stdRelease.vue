<template>
  <BztDialog
    :dialogInfo="dialogInfo"
    @close="closeDialog($event, 0)"
    :appendTobody="true"
  >
    <template slot="body">
      <el-form
        :model="stdReleaseForm"
        :rules="rules"
        ref="stdReleaseForm"
        label-suffix=":"
        label-width="150px"
        class="stdReleaseForm"
        v-if="stdReleaseForm != null"
      >
        <el-form-item label="标准名称">
          <div class="pro-name">
            {{ businessObjName }}
          </div>
        </el-form-item>
        <el-form-item label="技术标准编号" prop="stdNo">
          <!-- Q/PC
          <el-input
            placeholder="请输入技术标准编号"
            v-model="stdReleaseForm.stdNo1"
            style="width: 160px"
          />
          —
          <el-input
            placeholder="请输入技术标准编号"
            v-model="stdReleaseForm.stdNo2"
            style="width: 160px"
          />
          — {{ new Date().getFullYear() }} -->
          <div class="standard">
            <span class="leftTitle"> Q/PC &nbsp;</span>
            <el-select v-model="stdReleaseForm.stdNo1" filterable placeholder="请选择" style="width:40%">
              <el-option
                v-for="item in optionsList"
                :key="item.dictValue"
                :label="item.dictValue"
                :value="item.dictValue">
              </el-option>
            </el-select>
            <span>&nbsp; — &nbsp;{{stdReleaseForm.stdNo2}}</span>
          </div>
        </el-form-item>
        <el-form-item label="发布日期" prop="publishdate">
          <el-date-picker
            v-model="stdReleaseForm.publishdate"
            type="date"
            placeholder="选择发布日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item label="实施日期" prop="dodate">
          <el-date-picker
            v-model="stdReleaseForm.dodate"
            type="date"
            placeholder="选择实施日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item label="专业" prop="specialtyCatalogId">
          <el-select
            v-model="stdReleaseForm.specialtyCatalogId"
            placeholder="请选择专业"
          >
            <template v-for="(item, index) in dict.type.pdca_specialty_catalog">
              <el-option
                :key="`pdca_specialty_catalog_${index}`"
                :label="item.label"
                :value="item.value"
              />
            </template>
          </el-select>
        </el-form-item>
      </el-form>
    </template>
  </BztDialog>
</template>
<script>
import { BztDialog, BztUploadFile } from "@components/basicCom/index";
import Api from "@api/process";
import { listData } from "@/api/system/dict/data";

const stdReleaseForm = {
  businessId: "",
  stdNo: "",
  stdName: null,
  publishdate: null,
  dodate: "",
  fileUrl: "",
  specialtyCatalogId: null,
  stdNo2:null,
  stdNo1:null
};

export default {
  components: { BztDialog, BztUploadFile },
  name: "stdRelease",
  dicts: ["pdca_specialty_catalog"],
  props: {
    visiable: {
      type: Boolean,
      default: false,
    },
    businessObjId: {
      type: String | Number,
      default: null,
    },
    businessObjName: {
      type: String,
      default: "",
    },
    loadding: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    visiable: {
      handler(val) {
        this.dialogInfo.title = "发布标准";
        this.dialogInfo.visible = val;
        this.stdReleaseForm = this.deepClone(stdReleaseForm);
        this.stdReleaseForm.businessId = this.businessObjId;
        this.stdReleaseForm.stdName = this.businessObjName;
      },
    },
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      optionsList:[],
      dialogInfo: {
        visible: false,
        title: "标准发布",
        width: "900px",
        footer: true,
        loadding: false,
        submintText: "立即发布",
      },
      date: [],
      stdReleaseForm: null,
      rules: {
        stdNo: { required: true, message: "技术标准编号", trigger: "blur" },
        publishdate: {
          required: true,
          message: "请选择发布日期",
          trigger: "change",
        },
        dodate: {
          required: true,
          message: "请选择实施日期",
          trigger: "change",
        },
        specialtyCatalogId: {
          required: true,
          message: "请选择专业",
          trigger: "change",
        },
      },
      fileList: [],
    };
  },
  mounted() {
    this.dialogInfo.visible = this.visiable;
    this.dialogInfo.loadding = this.loadding;
    this.dialogInfo.title = "发布标准";
    this.stdReleaseForm = this.deepClone(stdReleaseForm);
    this.stdReleaseForm.businessId = this.businessObjId;
    this.stdReleaseForm.stdName = this.businessObjName;
    this.getInfoList()
    this.getOptionList()
    // this.stdReleaseForm["fileUrl"] = this.url;
  },

  methods: {
   
    getOptionList(){
      const data = {
        // dictName: undefined,
        dictType: 'scplat_code_category',
        // status: undefined
      }
      listData(data).then(response => {
        this.optionsList = response.rows;
      });

    },
    //获取指标
    getInfoList(){
      const data = {
        projectType:4,
        projectStatus:3
      }
      Api.getStandard(data).then(res=>{
        const { msg, data, code } = res;
        if (code === 200) {
          this.$nextTick(()=>{
            this.stdReleaseForm.stdNo2 = data;
          })
        }
      })
    },
    /**
     * 关闭弹框 提交/取消
     */
    closeDialog(e, flag) {
      if (e === true) {
        this.stdReleaseForm.businessId = this.businessObjId;
        this.dialogInfo.loadding = false;
        this.stdReleaseForm.stdNo = `Q/PC ${this.stdReleaseForm.stdNo1}—${
          this.stdReleaseForm.stdNo2
        }`;
        this.$refs.stdReleaseForm.validate((valid) => {
          if (valid) {
            if(new Date(this.stdReleaseForm.publishdate)>new Date(this.stdReleaseForm.dodate)){
              return this.$message({
                message: '实施日期错误',
                type: 'warning'
              });
            }
            this.dialogInfo.loadding = true;
            this.$emit("save", this.stdReleaseForm);
          }
        });
      } else {
        this.dialogInfo.visible = false;
        this.$emit("save", null);
        this.dialogInfo.loadding = false;
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
    .pro-name {
      border-radius: 5px;
      line-height: 36px;
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
.standard{
    display: flex;
    span{
      flex-shrink: 0;
    }
  }
</style>
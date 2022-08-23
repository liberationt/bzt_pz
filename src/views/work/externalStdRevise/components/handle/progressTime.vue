<template>
<div>
  <el-form
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    :label-width="optionsObject.labelWidth"
    class="demo-ruleForm"
  > 
    <template v-if="optionsObject.optionsType==1">
      <el-form-item label="大纲、草案审查会" prop="draftTime">
        <el-date-picker
          v-model="ruleForm.draftTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="征求意见审查会" prop="seekTime">
         <el-date-picker
          v-model="ruleForm.seekTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="技术审查会" prop="skillTime">
         <el-date-picker
          v-model="ruleForm.skillTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          :picker-options="pickerOptions"
          >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="标准发布" prop="standardTime">
         <el-date-picker
          v-model="ruleForm.standardTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
    </template>
    <template v-else-if="optionsObject.optionsType==2">
      <el-divider>公司内部人员</el-divider>
      <el-form-item label="组建人员">
        <!-- <el-input v-model="ruleForm.name"></el-input> -->
        <el-input
          type="textarea"
          autosize
          placeholder="请选择组建人员"
          :value="getUserName(ruleForm.mainEditorIds)"
          @focus="changeMainEditor()"
          readonly
        />
      </el-form-item>
      <el-divider>非公司人员</el-divider>
      <template>
        <div style="text-align:right;margin-bottom:20px;">
          <el-button type="primary" @click="addStds()">
            <i class="el-icon-plus" />
            添加人员信息</el-button>
        </div>
        <BztTable
          :tableData="{
            column: stdTabClums,
            data: stdList,
            action: stdTabAction,
            actionWidth: '80px',
          }"
          :hasIndex="true"
          :pageInfo="stdPage"
          @stdNameChange="stdValChange($event, 'corporateName')"
          @stdNoChange="stdValChange($event, 'employeeName')"
        >
          <template slot="removeStd" slot-scope="{ scope }">
            <span class="red-link-text" @click="removeStd(scope)"> 删除 </span>
          </template>
        </BztTable>
      </template>
    </template>
    <el-form-item align="center" style="margin-top:20px">
      <el-button @click="resetForm('ruleForm')">取消</el-button>
      <el-button type="primary" :loading="loadding" @click="submitForm('ruleForm')"
        >确认</el-button
      >
    </el-form-item>
  </el-form>
  <!-- 选择组件人员 -->
  <BztDialog :dialogInfo="changeUserDialog" v-if="changeUserDialog.visible ==true"  @close="closeChangeUser">
    <template slot="body">
      <SelectUserByDept
        :value="ruleForm.mainEditorIds ? ruleForm.mainEditorIds : ''"
        @user-change="userChange"
      />
    </template>
  </BztDialog>
</div>
</template>

<script>
import Api from "@api/process";
import { BztDialog ,BztTable} from "@components/basicCom/index";
import SelectUserByDept from "@components/bussinessCom/model/selectDept";
const stdItem = {
  type: 1,
  corporateName: "",
  employeeName: "",
  stdId: null,
};
export default {
  components:{
    BztDialog,
    BztTable,
    SelectUserByDept
  },
  props:{
    optionsObject:{
      type:Object,
      default:{
        optionsType:1,
        labelWidth:"140px",
        id:'',
        ids:[]
      }
    },
    id:{
      type:String,
      default:''
    }
  },
  data() {
    return {
      pickerOptions:{
        disabledDate(time) {
           return time.getTime() < Date.now() - 8.64e7
        }
      },
      changeUserDialog: {
        visible: false,
        title: "选择组建人员",
        width: "900px",
        footer: true,
        loadding: false,
      },
      stdTabClums: [
        {
          title: "公司名称",
          key: "corporateName",
          width: "210",
          filter: {
            type: "input",
            action: "stdNameChange",
          },
        },
        {
          title: "员工姓名",
          key: "employeeName",
          width: "210",
          filter: {
            type: "input",
            action: "stdNoChange",
          },
        }
      ],
      stdList: [],
      stdTabAction: [{ label: "删除", type: "slot", btnName: "removeStd" }],
      stdPage: {
        total: 0,
        pageSize: 100,
        pageNo: 1,
      },
      loadding:false,
      ruleForm: {
        // draftTime: "",
        // seekTime: "",
        // skillTime: "",
        // standardTime: "",
        // mainEditorIds:''
      },
      rules: {
        draftTime: [
          { required: true, message: "请选择大纲、草案审查会", trigger: ["change","blur"]},
        ],
        seekTime: [
          { required: true, message: "请选择征求意见审查会", trigger: ["change","blur"]},
        ],
        skillTime: [
          { required: true, message: "请选择技术审查会", trigger: ["change","blur"]},
        ],
        standardTime: [
          { required: true, message: "请选择标准发布", trigger: ["change","blur"] },
        ],
        mainEditorIds:[
          { required: true, message: "请选择人员姓名", trigger: ["blur"] },
        ]
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // 制定时间编制
          if(this.optionsObject.optionsType==1){
            this.loadding = true
            let paramsData = {
              id:this.optionsObject.id,
              scheduleTime:JSON.stringify(this.ruleForm),
              idList:this.optionsObject.ids?this.optionsObject.ids:[this.optionsObject.id]
            }
            Api.setProgressTime(paramsData).then(res=>{
              const { code, data, msg } = res;
              if (code == 200) {
                this.$message.success("制定编制进度时间完成")
                this.$emit("close")
              } else {
                this.$message.error(msg);
              }
              this.loadding = false
            })
          }else if(this.optionsObject.optionsType==2){
            if(!this.ruleForm.mainEditorIds){
              return this.$message.warning("请选择组建人员")
            }
            if(this.testStdList()){
              let paramsData = {
                id:this.optionsObject.id,
                participantEditorIds:this.ruleForm.mainEditorIds,
                participantEditorOut:JSON.stringify(this.stdList)
              }
              this.loadding = true
              Api.setAssemblyTime(paramsData).then(res=>{
                const { code, data, msg } = res;
                if (code == 200) {
                  this.$message.success("组建编制组完成")
                  this.$emit("close")
                } else {
                  this.$message.error(msg);
                }
                this.loadding = false
              })
            }
          }
        } 
      });
    },
    resetForm(formName) {
      this.$emit("close",false)
      this.$refs[formName].resetFields();
    },
    testStdList() {
      let pass = true;
      let str = "";
      this.stdList.forEach((item, index) => {
        if (item.corporateName == "") {
          pass = false;
          str += str != "" ? ";" : "";
          str += `序号${index + 1}的公司名称不能为空`;
        }
        if (item.employeeName == "") {
          pass = false;
          str += str != "" ? ";" : "";
          str += `序号${index + 1}的员工姓名不能为空`;
        }
      });
      if (pass == false) {
        this.$message.warning(str);
      }
      return pass;
    },
    /**
     * 组建人员选择
     */
    userChange(e) {
      if(e&&e.length){
        this.users = e.join(",");
      }else{
        this.users = ""
      }
      // this.users = e.join(",");
    },
     /**
     * 确认选择组建人员
     */
    closeChangeUser(e) {
      if (e == true) {
        this.ruleForm.mainEditorIds = this.users;
      }
      this.changeUserDialog.visible = false;
    },
    /**
     * 选择组建人员
     */
    changeMainEditor() {
      this.users = this.ruleForm.mainEditorIds;
      this.changeUserDialog.visible = true;
    },
    /**
     * 获取UserName
     */
    getUserName(ids) {
      let arr = [];
      if (ids != "" && ids != null) {
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
     * 添加购置标准（申请购置）
     */
    addStds() {
      let newItem = _.cloneDeep(stdItem);
      newItem.std = Date.now();
      this.stdList.push(newItem);
    },
    /**
     * 编辑公司人员信息
     */
    stdValChange(e, rowKey) {
      this.stdList.forEach((pro) => {
        if (pro.std == e.row.std) {
          pro[rowKey] = e.val;
        }
      });
    },
    /**
     * 移除公司人员信息
     */
    removeStd(e) {
      this.stdList.forEach((item, index) => {
        if (e.std == item.std) {
          this.stdList.splice(index, 1);
        }
      });
    },
  },
};
</script>
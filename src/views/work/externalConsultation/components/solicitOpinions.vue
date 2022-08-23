<template>
  <BztDialog
    :dialogInfo="dialogInfo"
    @close="closeDialog($event, 0)"
    :appendTobody="true"
  >
    <template slot="body">
      <div style="text-align:right;margin-bottom:10px">
        <el-button type="primary" @click="addTable">添加意见</el-button>
      </div>
			<div class="tableHead">
				<div class="label">标准名称</div>
				<div>
					<el-input v-model="stdName" placeholder="请输入内容" style="width:560px"></el-input>
				</div>
				<div class="label">征集意见单位</div>
				<div>
					<el-input v-model="consultationUnit" placeholder="请输入内容" style="width:290px"></el-input>
				</div>
			</div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="chapterNumber" label="章条编号" width="210" align="center">
          <template slot-scope="{row}">
            <el-input v-model="row.chapterNumber" />
          </template>
        </el-table-column>
        <el-table-column label="意见内容" align="center"> 
					<el-table-column prop="originalText" label="原文为" width="280" align="center">
            <template slot-scope="{row}">
              <el-input v-model="row.originalText" />
            </template>
					</el-table-column>
					<el-table-column prop="updateText" label="修改为" width="280" align="center">
            <template slot-scope="{row}">
              <el-input v-model="row.updateText" />
            </template>
					</el-table-column>
        </el-table-column>

        <el-table-column prop="nameTheUnit" label="提出单位" width="258" align="center">
          <template slot-scope="{row}">
            <el-input v-model="row.nameTheUnit" disabled/>
          </template>
        </el-table-column>
				<el-table-column prop="nameThePerson" label="提出人员" width="250" align="center">
          <template slot-scope="{row}">
            <el-input v-model="row.nameThePerson" disabled/>
          </template>
        </el-table-column>
				<!-- <el-table-column prop="handlingOpinions" label="处理意见" width="300" align="center">
          <template slot-scope="{row}">
            <el-select  v-model="row.handlingOpinions" placeholder="请选择">
              <el-option
                v-for="item in optionsList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column> -->
        <!-- <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="{row}">
            <el-button @click="removeTable(row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column> -->
      </el-table>
       <div class="dialog-footer">
        <el-button @click="closeDialog(false)">取 消</el-button>
        <el-button type="primary" :loading="isLoading" @click="closeDialog(true)">提交</el-button>
        <el-button type="warning" :loading="isLoading" @click="storageOption(true)">暂存</el-button>
        <el-button type="success" :loading="isLoading" @click="closeDialog(true,'noPoint')">无意见</el-button>
      </div>
    </template>
   
  </BztDialog>
</template>
<script>
import { BztDialog } from "@components/basicCom/index.js";
import Api from "@api/process";
import { mapGetters } from "vuex";

export default {
  components: {
    BztDialog,
  },
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
    processAs: {
      type: String | Number,
      default: null,
    },
    extendAttachments: {
      type: String,
      default: "",
    },
    endTime: {
      type: String,
      default: "",
    },
    startTime: {
      type: String,
      default: "",
    },
    adviceTaskId: {
      type: Number,
      default: null,
    },
    childAdviceTaskId: {
      type: Number,
      default: null,
    },
    parentProcessorId: {
      type: Number,
      default: null,
    },
    parentId: {
      type: Number,
      default: null,
    },
    title: {
      type: String,
      default: "提交意见汇总表",
    },
    workItemId: {
      type: String,
      default: "",
    },
    row:{
      type:Object,
      default:()=>{
        return {}
      }
    }
  },
  data() {
    return {
      dialogInfo: {
        visible: true,
        title: "技术标准征求意见表",
        width: "1340px",
        // footer: true,
        loadding: false,
      },
      tableData: [
        {
          standardTaskId:'',
          stdName:'',
          processorTaskId:'',
          consultationUnit:'',
          chapterNumber:'',
          originalText:'',
          updateText:'',
          nameTheUnit:'中车南京浦镇公司',
          nameThePerson:'',
          handlingOpinions:'',
          isOpinion:''
        },
      ],
      logFileForm:{

      },
      nameThePerson:'',
      isLoading:false,
      optionsList:[
        {
          label:'采纳',
          value:'1'
        },
        {
          label:'不采纳',
          value:'2'
        },{
          label:'部门采纳',
          value:'3'
        }
      ],
      stdName:'',
      consultationUnit:'',
      scpAdviceCollectingOpinions:[{
        standardTaskId:'',
        stdName:'',
        processorTaskId:'',
        consultationUnit:'',
        chapterNumber:'',
        originalText:'',
        updateText:'',
        nameTheUnit:'',
        nameThePerson:'',
        handlingOpinions:'',
        isOpinion:''
      }]
    };
  },
  methods: {
    closeDialog(e,flag=null) {
      if(e==true){
        this.isLoading = true
        if(flag=="noPoint"){
          this.tableData=[{
            standardTaskId:this.adviceTaskId,
            stdName:this.stdName,
            processorTaskId:this.childAdviceTaskId,
            consultationUnit:this.consultationUnit,
            chapterNumber:'',
            originalText:'',
            updateText:'',
            nameTheUnit:'',
            nameThePerson:'',
            handlingOpinions:'',
            isOpinion:1
          }]
        }else{
          this.tableData.forEach((item) => {
              item.stdName = this.stdName
              item.consultationUnit = this.consultationUnit
              item.standardTaskId = this.adviceTaskId
              item.processorTaskId = this.childAdviceTaskId
              item.isOpinion = 0
          });
        }
        this.tableData = this.tableData.filter(item=>!item.id)
        if (this.processAs == 6) {
          this.logFileForm.id = this.businessObjId;
          this.logFileForm.extendAttachments = this.extendAttachments;
          this.logFileForm.processAs = this.processAs;
          this.logFileForm["startTime"] = this.startTime;
          this.logFileForm["endTime"] = this.startTime;
          this.logFileForm["childAdviceTaskId"] = null;
          this.logFileForm["adviceTaskId"] = this.adviceTaskId;
          this.logFileForm["parentProcessorId"] = this.parentProcessorId;
          this.logFileForm["parentId"] = this.parentId;
          this.logFileForm["workItemId"] = this.workItemId;
          this.logFileForm["scpAdviceCollectingOpinions"] = this.tableData
          Api.companyUpload(this.logFileForm).then((res) => {
            const { code, msg } = res;
            if (code === 200) {
              this.$message.success("意见汇总表已上传");
            } else {
              // this.$message.error(msg);
            }
            this.isLoading = false
            this.dialogInfo.visible = false;
            this.$emit("save", null);
            this.dialogInfo.loadding = false;
          });
        } else {
          // this.tableData.forEach((item) => {
          //     item.stdName = this.stdName
          //     item.consultationUnit = this.consultationUnit
          //     item.standardTaskId = this.parentProcessorId
          //     item.processorTaskId = this.childAdviceTaskId
          //     item.isOpinion = 0
          // });
          this.logFileForm.id = this.businessObjId;
          this.logFileForm.extendAttachments = JSON.stringify(
            this.extendAttachments
          );
          this.logFileForm.processAs = this.processAs;
          this.logFileForm["startTime"] = this.startTime;
          this.logFileForm["endTime"] = this.startTime;
          this.logFileForm["childAdviceTaskId"] = this.childAdviceTaskId;
          this.logFileForm["adviceTaskId"] = this.adviceTaskId;
          this.logFileForm["parentProcessorId"] = this.parentProcessorId;
          this.logFileForm["parentId"] = this.parentId;
          this.logFileForm["workItemId"] = this.workItemId;
          this.logFileForm["scpAdviceCollectingOpinions"] = this.tableData
          Api.updateAdviceCollectingTaskAssign(this.logFileForm).then(
            (res) => {
              const { code, msg } = res;
              if (code === 200) {
                this.$message.success("意见汇总表已上传");
              } else {
                // this.$message.error(msg);
              }
              this.dialogInfo.visible = false;
              this.$emit("save", null);
              this.dialogInfo.loadding = false;
              this.isLoading = false
            }
          );
        }
      }else{
        this.dialogInfo.visible = false
        this.$emit('save')
      }
    },
    storageOption(){
      this.tableData.forEach((item) => {
          item.stdName = this.stdName
          item.consultationUnit = this.consultationUnit
          item.standardTaskId = this.adviceTaskId
          item.processorTaskId = this.childAdviceTaskId
          item.isOpinion = 0
      });
      this.tableData = this.tableData.filter(item=>!item.id)
      Api.setOpinion(this.tableData).then((res) => {
          const { code, msg } = res;
          if (code === 200) {
            this.$message.success("意见汇总表已暂存");
          } 
          this.isLoading = false
          this.dialogInfo.visible = false;
          this.$emit("save", null);
          this.dialogInfo.loadding = false;
        });
    },
    addTable(){
      this.tableData.push({
        standardTaskId:'',
        stdName:'',
        processorTaskId:'',
        consultationUnit:'',
        chapterNumber:'',
        originalText:'',
        updateText:'',
        nameTheUnit:'中车南京浦镇公司',
        nameThePerson:this.nameThePerson,
        handlingOpinions:'',
        isOpinion:''
      })
    },
    removeTable(row,index){
      console.log(row)
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
    //查询暂存数据
    getOptionList(){
      let params ={
        standardTaskId:this.adviceTaskId,
        createUser:this.userInfo.userId
      }
      Api.standardTask(params).then((res) => {
        const { code, data, rows, msg } = res;
        if (code === 200) {
          this.tableData = rows;
        } else {
          // this.$message.error(msg);
        }
      });
    }
  },
  mounted(){
    this.stdName = this.row.stdName
    this.consultationUnit = this.row.ownerCompanyName
    this.nameThePerson = this.getUserName(this.row.userId)
    this.tableData[0].nameThePerson = this.nameThePerson
    this.getOptionList()
  }
};
</script>
<style lang="scss" scoped>
	.tableHead{
		// height:44px;
		display: flex;
		padding:10px 0;
		align-items: center;
		background:#f5f7fa;
		.label{
			width:210px;
			text-align: center;
			font-weight: bold;
			flex-shrink: 0;
		}
	}
  .dialog-footer{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;;
  }
</style>
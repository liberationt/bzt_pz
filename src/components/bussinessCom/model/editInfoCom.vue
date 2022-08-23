<template>
  <div v-if="infoForm != null">
    <el-form
      :model="infoForm"
      :rules="rules"
      ref="infoForm"
      label-suffix=":"
      label-width="180px"
      class="infoForm"
    >
      
      <!-- <template v-if="infoForm.status != null && showAction == true">
        <el-form-item
          label="修改原因"
          class="reason"
          v-if="infoForm.status != 1"
          key="reason"
        >
          <div class="reason-content">
            {{ infoForm.rejectReason }}
          </div>
        </el-form-item>
      </template> -->
       <el-form-item
          label="驳回原因"
          class="reason"
          v-show="infoForm.status != 1&&infoForm.status != null && showAction == true"
          key="reason"
        >
          <div class="reason-content">
            {{ infoForm.rejectReason }}  
          </div>
        </el-form-item>

      <el-form-item
        label="主题"
        prop="infoTheme"
        v-show="infoForm.infoTheme != 2&&infoForm.infoTheme != 4"
        key="infoTheme"
      >
        <el-select
          v-model="infoForm.infoTheme"
          placeholder="请选择主题"
          :disabled="
            infoForm.infoTheme == 2 ||
            infoForm.infoTheme == 4 ||
            (infoForm.infoPublishId != null && infoForm.infoPublishId != '')
          "
          @change="themeChange()"
        >
          <template v-for="(item, index) in dict.type.info_publish_theme">
            <el-option
              v-if="item.value == 1"
              :key="`theme_${index}`"
              :label="item.label"
              :value="Number(item.value)"
              :disabled="!hasPermission('standardBusinessStaff')"
            />
            <el-option
              v-else-if="item.value != 2 && item.value != 4"
              :key="`theme_${index}`"
              :label="item.label"
              :value="Number(item.value)"
              :disabled="!hasPermission('standardBusinessSupervisor')"
            />
          </template>
        </el-select>
        <el-select
          v-if="infoForm.infoTheme == 2 || infoForm.infoTheme == 4"
          v-model="infoForm.infoTheme"
          placeholder="请选择主题"
          disabled
          @change="themeChange()"
        >
          <template v-for="(item, index) in dict.type.info_publish_theme">
            <el-option
              v-if="item.value == 2 || item.value == 4"
              :key="`theme_${index}`"
              :label="item.label"
              :value="Number(item.value)"
            />
          </template>
        </el-select>
      </el-form-item>

      <el-form-item label="标题" prop="infoTitle">
        <el-input v-model="infoForm.infoTitle" />
      </el-form-item>

      <el-form-item label="内容" prop="content">
        <!-- <el-input type="textarea" v-model="infoForm.content" /> -->
        <TinymceEditor
          editorName="content_edit"
          :cur-value="infoForm.content"
          v-model="infoForm.content"
          :height="'200px'"
        />
      </el-form-item>

        <!-- v-if="infoForm.infoTheme != 2" -->
      <el-form-item
        v-if="infoForm.infoTheme != 2&&infoForm.infoTheme != 5"
        :label="
          infoForm.infoTheme == 1 ||
          infoForm.infoTheme == 3 ||
          infoForm.infoTheme == 4
            ? '立项起止时间'
            : infoForm.infoTheme == 2
            ? '标准编制起止时间'
            : infoForm.infoTheme == 5
            ? '制修订起止时间'
            : '起止时间'
        "
        prop="date"
        key="date"
      >
        <el-date-picker
          v-model="infoForm.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
          @blur="dateChange"
        />
      </el-form-item>
      <template v-if="infoForm.infoTheme == 4">
        <el-form-item
          label="归口单位"
          prop="technicalCommittees"
        >
          <TecCommittees
            :value="infoForm.technicalCommittees"
            :disabled="
              infoForm.infoPublishId != null && infoForm.infoPublishId != ''
            "
            @change="changeTecCom"
          />
        </el-form-item>
        <el-form-item label="附件" ref="uploadFile">
          <!-- :prop="infoForm.infoTheme == 2 ? 'file' : ''" -->
          <BztUploadFile
            :value="fileList"
            :limit="10"
            :fileSize="100"
            @upload-change="fileChange"
          />
        </el-form-item>
        <el-form-item label="备注" prop="desc">
          <el-input type="textarea" v-model="infoForm.remark"></el-input>
        </el-form-item>
        <el-divider>审核人选择</el-divider>            
        <el-form-item
            label="标准化业务主管"
            prop="firstAuditUser"
          >
            <el-select v-model="infoForm.firstAuditUser" disabled placeholder="请选择标准化业务主管">
              <template v-for="(item, index) in directorList">
                <el-option
                  :key="`user_${index}`"
                  :label="`${item.nickName}(${item.userName})`"
                  :value="Number(item.userId)"
                />
              </template>
            </el-select>
          </el-form-item>
          <el-form-item
            label="科技管理部部门领导"
            prop="secondAuditUser"
          >
            <el-select v-model="infoForm.secondAuditUser" disabled placeholder="请选择科技管理部部门领导">
              <template v-for="(item, index) in deptList">
                <el-option
                  :key="`user_${index}`"
                  :label="`${item.nickName}(${item.userName})`"
                  :value="Number(item.userId)"
                />
              </template>
            </el-select>
          </el-form-item>
      </template>
      <!-- 新增 -->
      <template v-if="infoForm.infoTheme == 5">
        <el-form-item label="附件" ref="uploadFile" prop="filesPath">
          <!-- :prop="infoForm.infoTheme == 2 ? 'file' : ''" -->
          <BztUploadFile
            :value="fileList"
            :limit="10"
            :fileSize="100"
            @upload-change="fileChange"
          />
        </el-form-item>
      </template>
      <template v-if="infoForm.infoTheme == 1">
        <el-form-item
          prop="stdDraftDeadline"
          label="完成草案时间"
          key="stdDraftDeadline"
          :rules="[
            {
              required: true,
              message: '完成草案计划完成时间',
              trigger: 'blur',
            },
          ]"
          ref="stdDraftDeadline"
        >
          <el-date-picker
            v-model="infoForm.stdDraftDeadline"
            type="date"
            placeholder="选择日期"
            :format="formatStr"
            :value-format="formatStr"
            :disabled="infoForm.date == null || infoForm.date.length == 0"
            :picker-options="pickerOptionsPlan"
          />
        </el-form-item>
        <el-form-item
          label="完成征求意见时间"
          key="stdForAdviceDeadline"
          prop="stdForAdviceDeadline"
          :rules="[
            {
              required: true,
              message: '完成征求意见计划完成时间',
              trigger: 'blur',
            },
          ]"
        >
          <el-date-picker
            v-model="infoForm.stdForAdviceDeadline"
            type="date"
            placeholder="选择日期"
            :format="formatStr"
            :value-format="formatStr"
            :disabled="infoForm.date == null || infoForm.date.length == 0"
            :picker-options="pickerOptionsPlan"
          />
        </el-form-item>
        <el-form-item
          label="完成标准审核时间"
          key="stdForReviewDeadline"
          prop="stdForReviewDeadline"
          :rules="[
            {
              required: true,
              message: '完成标准审核计划完成时间',
              trigger: 'blur',
            },
          ]"
        >
          <el-date-picker
            v-model="infoForm.stdForReviewDeadline"
            type="date"
            placeholder="选择日期"
            :format="formatStr"
            :value-format="formatStr"
            :disabled="infoForm.date == null || infoForm.date.length == 0"
            :picker-options="pickerOptionsPlan"
          />
        </el-form-item>
        <el-form-item
          label="完成报批稿时间"
          key="stdForApprovalDeadline"
          prop="stdForApprovalDeadline"
          :rules="[
            {
              required: true,
              message: '完成报批稿计划完成时间',
              trigger: 'blur',
            },
          ]"
        >
          <el-date-picker
            v-model="infoForm.stdForApprovalDeadline"
            type="date"
            placeholder="选择日期"
            :format="formatStr"
            :value-format="formatStr"
            :disabled="infoForm.date == null || infoForm.date.length == 0"
            :picker-options="pickerOptionsPlan"
          />
        </el-form-item>
        <el-form-item
          label="完成评审时间"
          key="stdMultiAggreementDeadline"
          prop="stdMultiAggreementDeadline"
          :rules="[
            {
              required: true,
              message: '完成评审计划完成时间',
              trigger: 'blur',
            },
          ]"
        >
          <el-date-picker
            v-model="infoForm.stdMultiAggreementDeadline"
            type="date"
            placeholder="选择日期"
            :format="formatStr"
            :value-format="formatStr"
            :disabled="infoForm.date == null || infoForm.date.length == 0"
            :picker-options="pickerOptionsPlan"
          />
        </el-form-item>
      
      <el-form-item
        label="处理人"
        prop="receiver"
        v-if="infoForm.infoTheme == 3"
      >
        <el-input
          type="textarea"
          autosize
          placeholder="请选择处理人"
          :value="getUserName(infoForm.receiver)"
          readonly
          @focus="changeMainEditor()"
        />
      </el-form-item>
      <el-form-item
        label="处理人"
        prop="receiver"
        v-if="infoForm.infoTheme == 5"
      >
        <el-select v-model="infoForm.receiver" placeholder="请选处理人员">
          <template v-for="(item, index) in userList">
            <el-option
              :key="`user_${index}`"
              :label="`${item.nickName}(${item.userName})`"
              :value="Number(item.userId)"
            />
          </template>
        </el-select>
      </el-form-item>
      <el-form-item
        label="归口单位"
        prop="infoTitle"
        v-if="infoForm.infoTheme == 3 || infoForm.infoTheme == 5"
      >
        <TecCommittees
          :value="infoForm.technicalCommittees"
          :disabled="
            infoForm.infoPublishId != null && infoForm.infoPublishId != ''
          "
          @change="changeTecCom"
        />
      </el-form-item>
      <el-form-item label="附件" ref="uploadFile">
        <!-- :prop="infoForm.infoTheme == 2 ? 'file' : ''" -->
        <BztUploadFile
          :value="fileList"
          :limit="10"
          :fileSize="100"
          @upload-change="fileChange"
        />
      </el-form-item>
      <el-form-item label="备注" prop="desc" v-if="infoForm.infoTheme != 2">
        <el-input type="textarea" v-model="infoForm.remark"></el-input>
      </el-form-item>

      <el-form-item
        v-if="infoForm.infoTheme == 1"
        label="通知公告是否显示时间"
        prop="dataShow"
      >
        <!-- v-if="infoForm.infoTheme == 1" -->
        <el-radio-group
          v-model="infoForm.dataShow"
          :disabled="infoForm.infoPublishId !=null"
        >
          <el-radio :label="1"> 显示 </el-radio>
          <el-radio :label="0"> 不显示 </el-radio>
        </el-radio-group>
      </el-form-item>
      <template>
           <el-divider>审核人选择</el-divider>            
        </template>
        <el-form-item
            label="标准化业务主管"
            prop="firstAuditUser"
          >
            <el-select v-model="infoForm.firstAuditUser" disabled placeholder="请选择标准化业务主管">
              <template v-for="(item, index) in directorList">
                <el-option
                  :key="`user_${index}`"
                  :label="`${item.nickName}(${item.userName})`"
                  :value="Number(item.userId)"
                />
              </template>
            </el-select>
          </el-form-item>
          <el-form-item
            label="科技管理部部门领导"
            prop="secondAuditUser"
          >
            <el-select v-model="infoForm.secondAuditUser" disabled placeholder="请选择科技管理部部门领导">
              <template v-for="(item, index) in deptList">
                <el-option
                  :key="`user_${index}`"
                  :label="`${item.nickName}(${item.userName})`"
                  :value="Number(item.userId)"
                />
              </template>
            </el-select>
          </el-form-item>
      </template>
      <div class="footer" v-if="showAction == true">
        <div class="cancelBtn" @click="closeDialog(false, 0)">取消</div>
        <el-button
          class="submit-btn"
          @click="closeDialog(true, 0)"
          :loading="isLoading"
        >
          <!-- 确定 -->
          <!-- <span v-if="infoForm.status != null && showAction == true && infoForm.status != 1">立即发布</span> -->
          <span v-if="infoForm.status != null && showAction == true && infoForm.status != 1">提交</span> 
          <span v-else>确定</span>
        </el-button>
      </div>
    </el-form>
    <!-- <template slot="footer-btn" v-if="showZCBtn != false">
        <div class="yellow-btn el-button" @click="closeDialog(true, 1)">
          暂存
        </div>
      </template> -->
    <!-- 选择处理人 -->
    <BztDialog :dialogInfo="changeUserDialog" @close="closeChangeUser">
      <template slot="body" v-if="infoForm != null">
        <SelectUserByDept
          :value="infoForm.receiver ? infoForm.receiver : ''"
          :roleKeys="'standardBusinessStaff'"
          @user-change="userChange"
        />
      </template>
    </BztDialog>
  </div>
</template>
<script>
import { BztDialog, BztUploadFile } from "@components/basicCom/index";
import SelectUserByDept from "./selectUserByDept.vue";
import TecCommittees from "./process/tecCommittees.vue";
import Api from "@api/infoModule";
import {
  listUserByDeptsAndRoleKeys,
} from "@api/system/user";
const infoForm = {
  content: "",
  endDate: "",
  filesPath: null,
  infoTheme: null,
  infoTitle: "",
  startDate: "",
  businessObjId: "",
  status: null,
  infoPublishId: null,
  date: [],
  remark: "",
  technicalCommittees: "",
  firstAuditUser:null,
  secondAuditUser:null,
  receiver: "",
  stdDraftDeadline: null, //草案稿计划完成时间
  stdForAdviceDeadline: null, // 征求意见稿计划完成时间
  stdForApprovalDeadline: null, // 报批稿计划完成时间
  stdForReviewDeadline: null, // 送审稿计划完成时间
  stdMultiAggreementDeadline: null, // 会签计划完成时间
  dataShow: 0, // 通知公告是否展示时间日期 0不展示，1展示
};
const infoFormReq = {
  content: "",
  endDate: "",
  firstAuditUser:null,
  secondAuditUser:null,
  filesPath: null,
  infoTheme: null,
  infoTitle: "",
  startDate: "",
  businessObjId: "",
  technicalCommittees:'',
  status: null,
  infoPublishId: null,
  remark: "",
  receiver: "",
  stdDraftDeadline: null, //草案稿计划完成时间
  stdForAdviceDeadline: null, // 征求意见稿计划完成时间
  stdForApprovalDeadline: null, // 报批稿计划完成时间
  stdForReviewDeadline: null, // 送审稿计划完成时间
  stdMultiAggreementDeadline: null, // 会签计划完成时间
  dataShow: 0, // 通知公告是否展示时间日期 0不展示，1展示
};
export default {
  components: { BztDialog, BztUploadFile, TecCommittees, SelectUserByDept },
  name: "editInfoCom",
  dicts: ["info_publish_theme", "technical_committees"],
  props: {
    todoTask: {
      type: Object,
      default: {
        businessObjId: "",
      },
    },
    showAction: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    pickerOptionsPlan() {
      let disableTime = {};
      disableTime["disabledDate"] = (time) => {
        if (this.infoForm.date != null && this.infoForm.date.length > 0) {
          return (
            new Date(this.infoForm.date[1]).getTime() > time.getTime() ||
            time.getTime() < Date.now() - 8.64e7
          );
        } else {
          return time.getTime() < Date.now() - 8.64e7;
        }
      };
      return disableTime;
    },
  },
  data() {
    return {
      dialogInfo: {
        visible: false,
        title: "信息发布",
        width: "900px",
        loadding: false,
      },
      changeUserDialog: {
        visible: false,
        title: "选择处理人",
        width: "900px",
        footer: true,
        loadding: false,
      },
      date: [],
      formatStr: "yyyy-MM-dd",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      directorList:[],
      deptList:[],
      infoForm: null,
      rules: {
        content: { required: true, message: "请输入发布内容", trigger: "blur" },
        infoTheme: { required: true, message: "请选择主题", trigger: "blur" },
        infoTitle: { required: true, message: "请输入标题", trigger: "blur" },
        date: {
          required: true,
          message: "请选择起止时间",
          trigger: ["change", "blur"],
        },
        receiver: {
          required: true,
          message: "请选择处理人",
          trigger: ["change", "blur"],
        },
        technicalCommittees: {
          required: true,
          message: "请选择归口单位",
          trigger: ["change", "blur"],
        },
        file: {
          required: true,
          message: "请上传附件",
          trigger: ["change", "blur"],
        },
        filesPath: {
          required: true,
          message: "请上传附件",
          trigger: ["change", "blur"],
        },
      },
      fileList: [],
      userList: [],
      isLoading: false,
    };
  },
  watch: {
    todoTask(val) {
      this.getTaskDetail();
    },
  },
  async mounted() {
    await this.getDeptList('standardBusinessSupervisor')
    await this.getDeptList('principalLeader',200)
    await this.getTaskDetail();


  },

  methods: {
    handleInfo(){
      let flag = false
      this.$refs.infoForm.validate(async (valid) => {
        if(valid){
          flag = true 
        }
      })
      return flag
    },
    //获取人员 标准化业务主管:
    getDeptList(roleKeys,deptIds=null){
      let data = {
        roleKeys
      }
      if(deptIds){
        data.deptIds = deptIds
      }
      listUserByDeptsAndRoleKeys(data).then((res) => {
        const { code, msg, data } = res;
        if (code === 200) {
          if(deptIds){
            this.deptList = data
          }else{
            this.directorList = data
          }
          // this.userList = rows;
        }
      });
    },
    /**
     * 获取信息详情
     */
    getTaskDetail() {
      this.infoForm = _.cloneDeep(infoForm);
      console.log(this.todoTask.businessObjId);
      this.infoForm.infoPublishId = this.todoTask.businessObjId ?? "";
      if (this.todoTask.businessObjId) {
        Api.getInfoDetail(this.todoTask.businessObjId).then((res) => {
          const { msg, data, code } = res;
          if (code === 200) {
            this.infoForm = _.cloneDeep(data);
            this.$set(this.infoForm, "date", [
              this.infoForm.startDate,
              this.infoForm.endDate,
            ]);
            this.filterFiles();
          } else {
            // this.$message.error(msg);
          }
        });
      }
    },
    /**
     * 上传附件
     */
    fileChange(e) {
      this.fileList = e;
      this.infoForm.fileList = e;
      let files = [];
      this.fileList.forEach((item) => {
        const file = {
          fileName: item.name,
          filePath: item.url,
        };
        files.push(file);
      });
      this.infoForm.filesPath =
        files.length === 0 ? null : JSON.stringify(files);
    },
    /**
     * 格式化附件
     */
    filterFiles() {
      this.fileList = [];
      if (this.infoForm.filesPath != null) {
        JSON.parse(this.infoForm.filesPath).forEach((item) => {
          const file = {
            name: item.fileName,
            url: item.filePath,
          };
          this.fileList.push(file);
        });
      }
    },
    /**
     * 起止时间监听
     */
    dateChange(e) {
      console.log("起止时间", this.infoForm.date);
      // this.infoForm.startDate = this.infoForm.date[0];
      // this.infoForm.endDate = this.infoForm.date[1];
    },
    /**
     * 起止时间校验
     */
    dateBlur() {
      if (this.date !== null && this.date.length > 0) {
        this.$refs.dateRange.clearValidate();
      }
    },
    /**
     * 获取信息内容
     */
    getInfo() {
      if (this.infoForm.date.length > 1 && this.infoForm.infoTheme != 2) {
        this.infoForm.startDate = this.infoForm.date[0];
        this.infoForm.endDate = this.infoForm.date[1];
      } else if (this.infoForm.infoTheme != 2) {
        this.$message.warning("起止日期不能为空，请选择！");
      }
      let files = [];
      this.fileList.forEach((item) => {
        const file = {
          fileName: item.name,
          filePath: item.url,
        };
        files.push(file);
      });
      this.infoForm.filesPath =
        files.length === 0 ? null : JSON.stringify(files);
      let formData = _.cloneDeep(infoFormReq);
      Object.keys(formData).map((key) => {
        formData[key] = this.infoForm[key] ?? null;
      });
      return formData;
      //
    },
    /**
     * 关闭弹框 提交/暂存/取消
     */
    async closeDialog(e, flag) {
      if (e === true) {
        this.isLoading = false;
        if (
          this.infoForm.stdDraftDeadline == null &&
          this.infoForm.infoTheme == 1
        ) {
          return;
        }
        if (this.infoForm.infoTheme == 1) {
          this.$refs.stdDraftDeadline.clearValidate();
        }
        this.$refs.infoForm.validate(async (valid) => {
          if (valid || this.infoForm.stdDraftDeadline != null) {
            // this.$refs.uploadFile.clearValidate();
            if (this.infoForm.date.length > 1 && this.infoForm.infoTheme != 2) {
              this.infoForm.startDate = this.infoForm.date[0];
              this.infoForm.endDate = this.infoForm.date[1];
            } else if (this.infoForm.infoTheme != 2) {
              this.$message.warning("起止日期不能为空，请选择！");
            }
            let files = [];
            this.fileList.forEach((item) => {
              const file = {
                fileName: item.name,
                filePath: item.url,
              };
              files.push(file);
            });
            this.infoForm.filesPath =
              files.length === 0 ? null : JSON.stringify(files);
            let formData = _.cloneDeep(infoFormReq);
            Object.keys(formData).map((key) => {
              formData[key] = this.infoForm[key] ?? null;
            });
            formData.businessObjId = this.todoTask.businessObjId ?? "";

            // if (
            //   this.infoForm.infoTheme == 2 &&
            //   this.infoForm.filesPath == null
            // ) {
            //   // 上传企业标准制修订修订计划
            //   this.$message.warning("请上传企业标准制修订修订计划");
            //   return;
            // }
            this.isLoading = true;
            if (formData.infoPublishId === null) {
              if (flag === 1) {
                formData.status = 1;
              } else {
                formData.status = this.data.type;
              }
              if (this.infoForm.infoTheme == 3) {
                await Api.sendExternalApprovalNotic(formData).then((res) => {
                  const { code, data, msg } = res;
                  if (code === 200) {
                    this.$emit("success", null);
                    this.$message.success(
                      formData.status === 1 ? "信息已暂存" : "信息已发布"
                    );
                  } else {
                    // this.$message.error(msg);
                  }
                });
                this.isLoading = false;
              } else if (this.infoForm.infoTheme == 5) {
                await Api.sendExternalScplatNotice(formData).then((res) => {
                  const { code, data, msg } = res;
                  if (code === 200) {
                    this.$message.success(
                      formData.status === 1 ? "信息已暂存" : "信息已发布"
                    );
                    this.$emit("success", null);
                  } else {
                    // this.$message.error(msg);
                  }
                });
                this.isLoading = false;
              } else {
                formData.businessObjId = this.todoTask.businessObjId ?? "";

                await Api.infoPublish(formData).then((res) => {
                  const { code, data, msg } = res;
                  if (code === 200) {
                    this.$message.success(
                      formData.status === 1 ? "信息已暂存" : "信息已发布"
                    );
                    this.$emit("success", null);
                  } else {
                    // this.$message.error(msg);
                  }
                });
                this.isLoading = false;
              }
              //
            } else {
              if (flag === 1) {
                formData.status = formData.status === 1 ? 1 : 4;
              } else {
                formData.status =
                  formData.status === 4
                    ? this.infoForm.secondAduitTime == null
                      ? 2
                      : 3
                    : 2;
              }
              this.dialogInfo.loadding = true;
              if (this.infoForm.infoTheme == 3) {
                await Api.sendExternalApprovalNotic(formData).then((res) => {
                  const { code, data, msg } = res;
                  if (code === 200) {
                    this.$message.success(
                      formData.status === 1 ? "信息已暂存" : "信息已发布"
                    );
                    this.$emit("success", null);
                  } else {
                    // this.$message.error(msg);
                  }
                });
                this.isLoading = false;
              } else if (this.infoForm.infoTheme == 5) {
                await Api.sendExternalScplatNotice(formData).then((res) => {
                  const { code, data, msg } = res;
                  if (code === 200) {
                    this.$message.success(
                      formData.status === 1 ? "信息已暂存" : "信息已发布"
                    );
                    this.$emit("success", null);
                  } else {
                    // this.$message.error(msg);
                  }
                });
                this.isLoading = false;
              } else {
                formData.businessObjId = this.todoTask.businessObjId ?? "";
                if(formData.infoTheme==2){
                  formData.businessObjId =null
                  }

                await Api.updatePublish(formData).then((res) => {
                  const { code, data, msg } = res;
                  if (code === 200) {
                    this.$message.success(
                      formData.status === 4 ? "信息已暂存" : "信息已发布"
                    );
                    this.$emit("success", null);
                  } else {
                    // this.$message.error(msg);
                  }
                });
                this.isLoading = false;
              }
            }
          } else {
            return false;
          }
        });
      } else {
        this.dialogInfo.visible = false;
        this.isLoading = false;
        this.$emit("close", null);
      }
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
              : `-（${user.userName}）`
          );
        });
      }
      return arr.length > 0 ? arr.join("；") : "";
    },
    /**
     * 选择处理人
     */
    changeMainEditor() {
      this.changeUserDialog.visible = true;
    },
    /**
     * 选择归口单位
     */
    changeTecCom(e) {
      this.infoForm.technicalCommittees = e;
      console.log(e, this.infoForm.businessObjId);
    },
    /**
     * 确认选择主要起草人
     */
    closeChangeUser(e) {
      this.changeUserDialog.visible = false;
    },
    /**
     * 主要起草人选择
     */
    userChange(e) {
      this.infoForm.receiver = e.join(",");
    },
    /**
     * 获取可选人员
     */
    getCheckUserList() {
      this.userList = [];
      this.$cache.session.getJSON("sourceUserList").forEach((user) => {
        if (user.roleList) {
          let has = false;
          user.roleList.forEach((role) => {
            if (role.roleKey == "standardBusinessStaff") {
              has = true;
            }
          });
          if (has == true) {
            this.userList.push(user);
          }
        }
      });
    },
    themeChange() {
      if (this.infoForm.infoTheme == 5) {
        this.getCheckUserList();
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
  .footer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 25px;
  }
}
</style>
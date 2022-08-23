<template>
  <BztDialog :dialogInfo="dialogInfo" @close="closeDialog" :appendTobody="true">
    <template slot="body">
      <!-- 批量操作行 -->
      <div class="operation-line" style="margin-bottom: 8px">
        <el-button
          :disabled="checkPros.length == 0"
          class="submit-btn"
          @click="auditPro(1)"
          >批量通过
        </el-button>
        <el-button
          class="yellow-btn"
          @click="auditPro(2)"
          :disabled="checkPros.length == 0"
          >批量不通过
        </el-button>
        <el-button
          class="error-btn"
          :disabled="checkPros.length == 0"
          @click="auditPro(3)"
        >
          批量终止
        </el-button>
      </div>
      <div class="std-list-content">
        <!-- 标准项目列表 -->
        <BztTable
          :tableData="{
            column: tabClums,
            data: list,
            action: [],
          }"
          :checkeBox="true"
          :hasIndex="false"
          :pageInfo="page"
          :isLoading="isTabLoading"
          @select-change="selectPro"
          ref="protable"
          @conclusionChange="cellChange($event, 'conclusion')"
          @reasonChange="cellChange($event, 'reason')"
          @recommendSortChange="cellChange($event, 'recommendSort')"
          @remarkChange="cellChange($event, 'remark')"
        >
        </BztTable>
        <el-form style="margin-top: 15px">
          <el-form-item label="评审会议纪要:">
            <BztUploadFile
              :value="fileList"
              :limit="1"
              :fileSize="100"
              @upload-change="fileChange($event)"
            />
          </el-form-item>
        </el-form>
      </div>
      <!-- <BztDialog
        :dialogInfo="proDialogInfo"
        @close="closeProDialog($event)"
        :appendTobody="true"
        v-if="projectDetail != null"
      >
        <template slot="body">
          <el-form
            :model="projectDetail"
            :rules="rules"
            ref="projectAuditForm"
            label-suffix=":"
            label-width="130px"
          >
            <el-form-item label="审核结论" prop="conclusion">
              <el-radio-group
                v-model="projectDetail.conclusion"
                @change="
                  () => {
                    projectDetail.reason = '';
                  }
                "
              >
                <el-radio :label="1"> 通过 </el-radio>
                <el-radio :label="2"> 不通过 </el-radio>
                <el-radio :label="3"> 终止 </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="不通过/终止原因"
              prop="reason"
              v-if="projectDetail.conclusion != 1"
            >
              <el-input
                type="textarea"
                placeholder="请输入修改原因"
                v-model="projectDetail.reason"
              />
            </el-form-item>
            <el-form-item label="推荐排序">
              <el-input
                type="input"
                placeholder="请输入推荐排序"
                v-model="projectDetail.recommendSort"
              />
            </el-form-item>
            <el-form-item label="备注">
              <el-input
                type="textarea"
                placeholder="请输入备注"
                v-model="projectDetail.remark"
              />
            </el-form-item>
          </el-form>
        </template>
      </BztDialog> -->
    </template>
  </BztDialog>
</template>
<script>
import {
  BztDialog,
  BztTable,
  BztUploadFile,
} from "@components/basicCom/index.js";
import Api from "@api/process";
import { mapGetters } from "vuex";
const auditForm = {
  conclusions: [],
  meetingMinutesName: "",
  meetingMinutesPath: "",
  projectType: 2,
  reviewType: null,
};

export default {
  name: "audit-online",
  components: {
    BztDialog,
    BztTable,
    BztUploadFile,
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  dicts: [
    "inter_revision_process_phase",
    "en_application_pro_node",
    "revision_mode",
    "task_status",
  ],
  props: {
    visiable: {
      type: Boolean,
      default: false,
    },
    projectList: {
      type: Array,
      default: [],
    },
    reviewType: {
      type: Number,
      default: false,
    },
  },
  data() {
    return {
      dialogInfo: {
        visible: false,
        title: "查看",
        width: "1300px",
        footer: true,
        loadding: false,
        submintText: "提交",
      },
      proDialogInfo: {
        visible: false,
        title: "查看",
        width: "900px",
        footer: true,
        loadding: false,
      },
      tabClums: [
        {
          title: "标准名称",
          key: "projectName",
          minWidth: "160",
        },
        {
          title: "项目申请人",
          key: "applyUser",
          width: "120",
          filter: {
            type: "user",
          },
        },
        {
          title: "申请单位",
          key: "applyCompanyId",
          width: "160",
          filter: {
            type: "dept",
          },
        },
        {
          title: "制定或修订",
          key: "scplatMode",
          width: "100",
          // sortable: true,
          filter: {
            type: "filter",
            action: (data) => {
              let str = "";
              this.dict.type.revision_mode.forEach((item) => {
                if (item.value == data) {
                  str = item.label;
                }
              });
              return str;
            },
          },
        },
        {
          title: "结论",
          key: "conclusion",
          width: "280",
          filter: {
            type: "radio",
            options: [
              {
                name: "通过",
                value: 1,
              },
              {
                name: "不通过",
                value: 2,
              },
              {
                name: "终止",
                value: 3,
              },
            ],
            action: "conclusionChange",
          },
        },
        {
          title: "修改/终止理由",
          key: "reason",
          width: "210",
          filter: {
            type: "input",
            action: "reasonChange",
          },
        },
        {
          title: "推荐排序",
          key: "recommendSort",
          width: "160",
          filter: {
            type: "number",
            min: 1,
            action: "recommendSortChange",
          },
        },
        {
          title: "备注",
          key: "remark",
          width: "130",
          filter: {
            type: "input",
            action: "remarkChange",
          },
        },
      ],
      page: {
        total: 0,
        pageSize: 1000,
        pageNo: 1,
      },
      list: [],
      isTabLoading: false,
      fileList: [],
      meetingMinutesPath: "",
      meetingMinutesName: "",
      projectDetail: null,
      rules: {
        conclusion: {
          required: true,
          message: "请选择审核结论",
          trigger: ["blur", "change"],
        },
        reason: {
          required: true,
          message: "请输入驳回/终止理由",
          trigger: "blur",
        },
      },
      checkPros: [],
    };
  },
  mounted() {
    this.dialogInfo.title =
      this.reviewType == 1 ? "部门级批量审核" : "公司级批量审核";
    this.dialogInfo.visible = this.visiable;
    this.isTabLoading = true;
    if (this.visiable == true) {
      this.initList();
    }
       if (this.reviewType != 1) {
      this.tabClums = [
        {
          title: "标准名称",
          key: "projectName",
          minWidth: "160",
        },
        {
          title: "项目申请人",
          key: "applyUser",
          width: "120",
          filter: {
            type: "user",
          },
        },
        {
          title: "申请单位",
          key: "applyCompanyId",
          width: "160",
          filter: {
            type: "dept",
          },
        },
        {
          title: "制定或修订",
          key: "scplatMode",
          width: "100",
          // sortable: true,
          filter: {
            type: "filter",
            action: (data) => {
              let str = "";
              this.dict.type.revision_mode.forEach((item) => {
                if (item.value == data) {
                  str = item.label;
                }
              });
              return str;
            },
          },
        },
        {
          title: "结论",
          key: "conclusion",
          width: "280",
          filter: {
            type: "radio",
            options: [
              {
                name: "通过",
                value: 1,
              },
              {
                name: "不通过",
                value: 2,
              },
              {
                name: "终止",
                value: 3,
              },
            ],
            action: "conclusionChange",
          },
        },
        {
          title: "修改/终止理由",
          key: "reason",
          width: "210",
          filter: {
            type: "input",
            action: "reasonChange",
          },
        },
        {
          title: "推荐排序",
          key: "recommendSort",
          width: "90",
        },
        {
          title: "备注",
          key: "remark",
          width: "130",
          filter: {
            type: "input",
            action: "remarkChange",
          },
        },
      ];
    }
  },
  watch: {
    visiable: {
      handler(val) {
        this.dialogInfo.title =
          this.reviewType == 1 ? "部门级批量审核" : "公司级批量审核";
        this.dialogInfo.visiable = val;
        this.isTabLoading = true;
        if (this.visiable == true) {
          this.initList();
        }
      },
    },
  },
  methods: {
    initList() {
      this.list = [];
      this.projectList.forEach((item) => {
        item["conclusion"] = null;
        item["reason"] = null;
        if( this.reviewType == 1){
          item["recommendSort"] = null;
        }
        item["remark"] = null;
        this.list.push(item);
      });
      this.isTabLoading = false;
    },
    /**
     * 选择项目设置
     */
    selectPro(e) {
      this.checkPros = e;
    },
    /**
     * 批量给项目结论
     * @param audit {number} 结论：1，通过；2，不通过；3，终止
     */
    auditPro(audit) {
      let str = audit == 1 ? "通过" : audit == 2 ? "不通过" : "终止";
      let proNames = this.checkPros.map((item) => {
        return item.projectName;
      });
      console.log(proNames.join(","), str);
      this.$confirm(
        `确定批量${str}项目：${proNames.join(",")}吗？`,
        "批量审核",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          center: true,
        }
      )
        .then(() => {
          this.projectList.forEach((pro) => {
            this.checkPros.forEach((checkpro) => {
              if (pro.id == checkpro.id) {
                pro["conclusion"] = audit;
                pro["reason"] = "";
              }
            });
          });
          this.$refs.protable.toggleSelection();
          this.checkpro = [];
        })
        .catch(() => {});
    },
    cellChange(e, rowKey) {
      this.projectList.forEach((pro) => {
        if (pro.id == e.row.id) {
          pro[rowKey] = e.val;
        }
      });
    },
    /**
     * 上传附件
     * @param {*} file 上传成功的附件信息
     * @param {*} name 附件位置 minutes1：年度标准立项汇总表，minutes2：评审会议纪要
     */
    fileChange(file) {
      if (file.length > 0) {
        this.meetingMinutesPath = file[0].url;
        this.meetingMinutesName = file[0].name;
      } else {
        this.meetingMinutesPath = "";
        this.meetingMinutesName = "";
      }
    },
    /**
     * 关闭批量审核弹框
     */
    closeDialog(e) {
      if (e == true) {
        let conclusions = [];
        let hasNull = false;
        let sort = {};
        let sortNum = [];
        let proNames = [];
        this.list.forEach((item) => {
          const newItem = {
            conclusion: item.conclusion,
            projectId: item.id,
            reason: item.reason ?? null,
            recommendSort: item.recommendSort ?? 1,
            remark: item.remark,
          };

          // 判断推荐排序是否重复
          if (this.reviewType == 1) {
            if (
              sort[newItem.recommendSort] &&
              sortNum.indexOf(newItem.recommendSort) == -1 &&
              newItem.conclusion == 1
            ) {
              console.log(newItem);
              sortNum.push(newItem.recommendSort);
            } else if (newItem.conclusion == 1) {
              sort[newItem.recommendSort] = 1;
            }
          }

          // 判断项目是否审核
          if (newItem.conclusion == undefined || newItem.conclusion == null) {
            hasNull = true;
          }
          // 判断不通过/终止的项目是否填写理由
          if (
            (newItem.conclusion == 2 || newItem.conclusion == 3) &&
            newItem.reason == null
          ) {
            proNames.push(item.projectName);
          }
          conclusions.push(newItem);
        });
        if (hasNull == true) {
          this.$message.warning("还有标准（项目）未审核，请先审核");
          return;
        }
        if (sortNum.length > 0) {
          this.$message.warning(`推荐排序：${sortNum.join(",")}重复`);
          return;
        }
        if (proNames.length > 0) {
          this.$message.warning(
            `项目：${proNames.join(",")}在不通过/终止理由未填写`
          );
          return;
        }
        let formReq = JSON.parse(JSON.stringify(auditForm));
        formReq.conclusions = conclusions;
        formReq.meetingMinutesName = this.meetingMinutesName;
        formReq.meetingMinutesPath = this.meetingMinutesPath;
        formReq.reviewType = this.reviewType;
        this.$set(this.dialogInfo, "loadding", true);
        Api.projectApplicationReview(formReq).then((res) => {
          const { code, msg } = res;
          if (code == 200) {
            this.$message.success("已审核");
            this.$set(this.dialogInfo, "loadding", false);
            this.dialogInfo.visiable = false;
            this.$emit("success", true);
          } else {
            // this.$message.error(msg);
          }
        });
      } else {
        this.dialogInfo.visiable = false;
        this.$emit("success", false);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.enterprise-std {
  width: 100%;
  height: 100%;
  .std-list-content {
    margin-top: -30px;
  }
}
</style>
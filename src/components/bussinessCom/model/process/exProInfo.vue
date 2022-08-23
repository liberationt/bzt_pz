<template>
  <div class="pro-info">
    <div class="info-title">
      <!-- 企业技术标准计划项目申请表 -->
      <div
        class="operation-line"
        style="float: right"
        v-if="showEditBtn() === true"
      >
        <div
          class="submit-btn"
          v-if="editProName === false"
          @click="editProName = true"
        >
          <i class="el-icon-edit-outline" />
          编辑
        </div>
        <template v-if="editProName == true">
          <div class="submit-btn" @click="save()">保存</div>
          <div class="cancelBtn" @click="editProName = false">取消</div>
        </template>
      </div>
    </div>
    <template>
      <el-form
        class="info-form"
        label-width="120px"
        label-suffix=":"
        v-if="formValue != null"
      >
        <el-form-item
          label="立项信息通知"
          style="width: 100%"
          :rules="[
            { required: true, message: '请选择立项信息通知', trigger: 'blur' },
          ]"
        >
          <el-select
            v-model="formValue.infoPublishId"
            placeholder="请选择立项信息通知"
            style="width: 100%"
            v-if="isEdit == true"
            @change="changeInfo"
          >
            <template v-for="(item, index) in infoList">
              <el-option
                :key="`doc_${index}`"
                :label="item.infoTitle"
                :value="item.infoPublishId"
              />
            </template>
          </el-select>
          <span v-else>
            {{ getInfoNameById(formValue.infoPublishId) }}
          </span>
        </el-form-item>
        <el-form-item
          label="项目名称"
          style="width: 100%"
          :rules="[
            { required: true, message: '请输入项目名称', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="formValue.projectName"
            placeholder="请输入项目名称"
            v-if="isEdit == true || editProName == true"
          />
          <span v-else>
            {{ formValue.projectName }}
          </span>
        </el-form-item>
        <el-form-item
          label="第一起草人"
          v-if="
            formValue.foundationProjectId != null ||
            formValue.id == null ||
            formValue.projectPhase == 10
          "
        >
          <div v-if="isEdit == true">
            <el-input
              v-if="formValue.applyUser == null || formValue.applyUser == ''"
              :value="`${userInfo.nickName}（${userInfo.userName}）`"
              disabled
            />
            <el-input
              v-else
              :value="getUserName(formValue.applyUser + '')"
              disabled
            />
          </div>
          <span v-else>{{ getUserName(formValue.applyUser + "") }}</span>
        </el-form-item>
        <el-form-item label="第一起草人" v-else>
          <span>{{ getUserName(formValue.mainEditorId + "") }}</span>
        </el-form-item>
        <el-form-item label="主编单位">
          <div v-if="isEdit == true">
            <el-input
              v-if="formValue.applyCompanyId == null"
              v-model="userInfo.dept.deptName"
              disabled
            />
            <el-input
              v-else
              :value="getDeptName(formValue.applyCompanyId)"
              disabled
            />
          </div>
          <span v-else>{{ getDeptName(formValue.applyCompanyId) }}</span>
        </el-form-item>
        <el-form-item
          label="归口单位"
          :rules="[
            { required: true, message: '请选择归口单位', trigger: 'blur' },
          ]"
        >
            <!-- @change="changeTecCom" -->
          <TecCommittees
            :value="formValue.ownerDeptId"
            v-if="isEdit == true"
            @change="changeTecCom"
          />
          <span v-else>
            {{
              selectDictLabel(
                dict.type.technical_committees,
                formValue.ownerDeptId
              )
            }}
          </span>
        </el-form-item>
        <el-form-item
          label="主要起草人"
          :rules="[
            { required: true, message: '请选择主要起草人', trigger: 'blur' },
          ]"
        >
          <el-input
            type="textarea"
            autosize
            placeholder="请输入主要起草人"
            :value="getUserName(formValue.mainEditorIds)"
            readonly
            @focus="changeMainEditor()"
            v-if="isEdit == true"
          />
          <span v-else>
            {{
              formValue.projectPhase != 10 && formValue.projectState != 1203
                ? getUserName(formValue.participantEditorIds)
                : getUserName(formValue.mainEditorIds)
            }}
          </span>
        </el-form-item>
        <el-form-item
          label="制定或修订"
          :rules="[
            { required: true, message: '请选择制定或修订', trigger: 'blur' },
          ]"
        >
          <el-select
            v-model="formValue.scplatMode"
            placeholder="请选择制定或修订"
            v-if="isEdit == true"
            @change="
              (e) => {
                formValue.oldStdId = null;
                formValue.oldStdNo = null;
              }
            "
          >
            <template v-for="(item, index) in dict.type.revision_mode">
              <el-option
                :key="`revision_mode_${index}`"
                :label="item.label"
                :value="Number(item.value)"
              />
            </template>
          </el-select>
          <span v-else>
            {{ selectDictLabel(dict.type.revision_mode, formValue.scplatMode) }}
          </span>
        </el-form-item>
        <el-form-item
          label="标准类型"
          :rules="[
            { required: true, message: '请选择标准类型', trigger: 'blur' },
          ]"
        >
          <el-select
            v-model="formValue.stdType"
            placeholder="请选择标准类型"
            v-if="isEdit == true"
            @change="stdTypeChange"
          >
            <template v-for="(item, index) in dict.type.standard_type">
              <el-option
                :key="`revision_mode_${index}`"
                :label="item.label"
                :value="Number(item.value)"
              />
            </template>
          </el-select>
          <span v-else>
            {{ selectDictLabel(dict.type.standard_type, formValue.stdType) }}
          </span>
        </el-form-item>
        <el-form-item
          label="被修订标准号"
          v-if="formValue.scplatMode ==1"
          :rules="
            formValue.scplatMode == 0
              ? null
              : [
                  {
                    required: true,
                    message: '请选择制定或修订',
                    trigger: 'blur',
                  },
                ]
          "
        >
          <el-select
            v-model="formValue.oldStdId"
            placeholder="请选择被修订标准号"
            style="width: 100%"
            filterable
            remote
            v-if="isEdit == true"
            :filter-method="remoteMethod"
            :loading="stdLoading"
            loading-text="搜索中..."
            @change="stdChange"
            clearable
          >
            <template v-for="(item, index) in stdList">
              <el-option
                :key="`std_${index}`"
                :label="item.stdNo"
                :value="`${item.stdId}`"
              />
            </template>
          </el-select>
          <span v-else>{{ formValue.oldStdNo }}</span>
        </el-form-item>
        <el-form-item
          label="附件"
          style="width: 100%"
          :rules="
            formValue.foundationProjectId != null ||
            formValue.id == null ||
            formValue.projectPhase == 10
              ? [{ required: true, message: '请上传附件', trigger: 'blur' }]
              : []
          "
        >
          <BztUploadFile
            :value="fileList"
            :limit="1000"
            :fileSize="100"
            :disabled="isEdit != true"
            @upload-change="fileChange"
          />
        </el-form-item>
        <el-form-item
          label="大纲草案"
          style="width: 100%"
          :rules="[
            { required: true, message: '请选择大纲草案', trigger: 'blur' },
          ]"
          v-if="
            formValue.foundationProjectId != null ||
            formValue.id == null ||
            formValue.projectPhase == 10
          "
        >
          <el-select
            v-model="formValue.stdDraftUrl"
            placeholder="请选择大纲草案"
            style="width: 100%"
            v-if="isEdit == true"
          >
            <template v-for="(item, index) in docList">
              <el-option
                :key="`doc_${index}`"
                :label="item.stdName"
                :value="item.draftId"
              />
            </template>
          </el-select>
          <!-- <span v-else>
            {{ getDraftName(formValue.stdDraftUrl) }}
            <span
              class="link-text"
              style="margin-left: 30px"
              @click="docDownload()"
            >
            </span>
          </span> -->
          <span v-else
            >{{ getDraftName(formValue.stdDraftUrl, "stdName") }}
            <span
              class="link-text"
              style="margin-left: 30px"
              @click="showDoc()"
            >
              预览
            </span>
          </span>
        </el-form-item>
        <!-- <el-form-item
          v-if="isEdit != true"
          label="标准化业务人员"
          style="width: 100%"
        >
          <span>{{ getUserName(formValue.interfacePersonIds) }}</span>
        </el-form-item> -->
      </el-form>
    </template>

    <!-- 选择主要起草人 -->
    <BztDialog :dialogInfo="changeUserDialog" v-if="changeUserDialog.visible ==true" @close="closeChangeUser">
      <template slot="body">
        <SelectUserByDept
          :value="formValue.mainEditorIds ? formValue.mainEditorIds : ''"
          @user-change="userChange"
        />
      </template>
    </BztDialog>

    <SamEditorDialog
      v-if="editorVisiable"
      :visiable="editorVisiable"
      :title="editorTiltle"
      :data="docData"
      @close="closeDoc"
    />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { BztDialog, BztUploadFile,SamEditorDialog } from "@components/basicCom/index";
// import { SelectUserByDept } from "@components/bussinessCom/index";
import  SelectUserByDept  from "@components/bussinessCom/model/selectDept";
import stdApi from "@api/infoModule";
import draftApi from "@api/draft";
import TecCommittees from "./tecCommittees.vue";
import { toWordByBusinessId } from "@api/editor";
export default {
  name: "ex-pro-info",
  components: { BztDialog, SelectUserByDept, TecCommittees, BztUploadFile,SamEditorDialog },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  dicts: ["revision_mode", "standard_type", "technical_committees"],
  props: {
    formValue: {
      type: Object,
      default: null,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    formValue: {
      deep: true,
      handler(val) {
        this.$emit("value-change", val);
        this.filterFiles();
      },
    },
  },
  data() {
    return {
      changeUserDialog: {
        visible: false,
        title: "选择主要起草人",
        width: "900px",
        footer: true,
        loadding: false,
      },
      stdList: [],
      listReq: {
        stdNo: "",
        stdName: "",
        status: 0 || "0",
        stdType: null,
        pageNo: 1,
        pageSize: 100,
        searchValueForNameOrNo: "",
        totalPage: 1,
      },
      stdLoading: false,
      docList: [],
      fileList: [],
      editProName: false,
      users: "",
      infoList: [],
      docData: {
        docId: null,
        author: null,
        stdNo: null,
        stdName: null,
        readOnly: null,
      },
      editorVisiable: false,
      editorTiltle: "查看文档",
    };
  },
  mounted() {
    this.filterFiles();
    this.getStdList();
    this.getListDocument();
    this.getInfoList();
  },
  methods: {
    /**
     * 获取立项信息通知
     */
    getInfoList() {
      const req = {
        infoTheme: "4",
        status: "5",
        isPublish: 1,
        isAsc: "desc",
        orderByColumn: "createTime",
        pageNum: 1,
        pageSize: 10000,
      };
      this.infoList = [];
      stdApi.infoPblicList(req).then((res) => {
        const { code, msg } = res;
        if (code === 200) {
          this.infoList = res.rows;
          if (
            this.infoList.length > 0 &&
            this.formValue.infoPublishId == null
          ) {
            this.formValue.infoPublishId = this.infoList[0].infoPublishId;
            this.formValue.ownerDeptId =
              // this.infoList[0].businessObjId.split(",")[0];
              Number(this.infoList[0].technicalCommittees);
            this.$emit("value-change", this.formValue);
          }
        } else {
          // this.$message.error(msg);
        }
      });
    },
    changeInfo() {
      this.infoList.forEach((item) => {
        if (item.infoPublishId == this.formValue.infoPublishId) {
          // this.formValue.ownerDeptId = item.businessObjId.split(",")[0];
          this.formValue.ownerDeptId = Number(item.technicalCommittees);
        }
      });
    },
    getInfoNameById(id) {
      let str = "-";
      this.infoList.forEach((item) => {
        if (item.infoPublishId == id) {
          str = item.infoTitle;
        }
      });
      return str;
    },
    /**
     * 是否显示编辑按钮
     */
    showEditBtn() {
      let show = false;
      if (
        this.formValue.foundationProjectId != null &&
        this.formValue.applyUser == this.userInfo.userId
      ) {
        if (this.formValue.projectPhase != 10) {
          show = true;
        }
      }
      return show;
    },
    /**
     * 获取被修订标准编号
     */
    getStdList() {
      this.stdLoading = true;
      this.listReq.stdType = this.formValue.stdType;
      stdApi.getTopicaList(this.listReq).then((res) => {
        const { msg, data, code } = res;
        if (code === 200) {
          if (this.listReq.pageNo == 1) {
            this.stdList = data.rows;
          } else {
            this.stdlist = this.stdList.contact(data.rows);
          }
          this.listReq.totalPage =
            data.total % this.listReq.pageSize > 0
              ? data.total / this.listReq.pageSize + 1
              : data.total / this.listReq.pageSize;
        } else {
          // this.$message.error(msg);
        }
        this.stdLoading = false;
      });
    },
    remoteMethod(keyWord) {
      this.listReq.pageNo = 1;
      this.listReq.searchValueForNameOrNo = keyWord;
      this.getStdList();
    },
    /**
     * 选择标准编号
     */
    stdChange(e) {
      // this.formValue.oldStdId = e.split("$$$")[0];
      // this.formValue.oldStdNo = e.split("$$$")[1];
      this.stdList.forEach((el) => {
        if (el.stdId == e) {
          this.formValue.oldStdNo = el.stdNo;
        }
      });
    },
    /**
     * 改变标准类型
     */
    stdTypeChange() {
      if (this.formValue.scplatMode == 1) {
        this.getStdList();
      }
    },
    /**
     * 上传附件
     */
    fileChange(e) {
      this.fileList = e;
      this.formValue.attachFiles =
        this.fileList.length == 0
          ? ""
          : JSON.stringify(
              this.fileList.map((item) => {
                return { fileName: item.name, filePath: item.url };
              })
            );
    },
    /**
     * 格式化附件
     */
    filterFiles() {
      this.fileList = [];
      if (this.formValue.attachFiles && this.formValue.attachFiles != null) {
        JSON.parse(this.formValue.attachFiles).forEach((item) => {
          const file = {
            name: item.fileName,
            url: item.filePath,
          };
          this.fileList.push(file);
        });
      }
      console.log(this.formValue.fileList);
      if (this.formValue.fileList && this.formValue.fileList != null) {
        this.formValue.fileList.forEach((item) => {
          const file = {
            name: item.name,
            url: item.url,
          };
          this.fileList.push(file);
        });
      }
    },
    /**
     * 选择归口单位
     */
    changeTecCom(e) {
      this.formValue.ownerDeptId = e;
      return
      const req = {
        ownerDeptId: e,
        infoTheme: 4,
        isPublish: 1,
        status: "5",
      };
      stdApi.infoPblicList(req).then((res) => {
        const { code, rows, msg } = res;
        if (code === 200) {
          if (rows.length > 0) {
            this.formValue.ownerDeptId = rows.length > 0 ? e : null;
            this.formValue.infoPublishId =
              rows.length > 0 ? rows[0].infoPublishId : null;
            console.log(rows, this.formValue.infoPublishId);
          } else {
            this.$message.warning("此归口单位暂无立项申请通知");
            this.formValue.ownerDeptId = null;
            this.formValue.infoPublishId = null;
          }
        }
      });
    },
    /**
     * 获取大纲草案列表
     */
    async getListDocument() {
      var req = {
        searchValue: "",
        createUser: this.isEdit == true ? this.userInfo.userId : "",
      };
      draftApi.getDraftList(req).then((res) => {
        const { code, msg, rows } = res;
        if (code === 200) {
          this.docList = rows;
        } else {
          // this.$message.error(msg);
        }
      });
    },
    /**
     * 选择主要起草人
     */
    changeMainEditor() {
      this.users = "";
      if (this.isEdit == true) {
        this.users = this.formValue.mainEditorIds;
        this.changeUserDialog.visible = true;
      }
    },
    /**
     * 确认选择主要起草人
     */
    closeChangeUser(e) {
      if (e == true) {
        this.formValue.mainEditorIds = this.users;
      }
      this.changeUserDialog.visible = false;
    },
    /**
     * 主要起草人选择
     */
    userChange(e) {
      if(e&&e.length){
        this.users = e.join(",");
      }
    },
    /**
     * 根据草案大纲ID获取名称
     */
    getDraftName(id) {
      let str = "-";
      this.docList.forEach((item) => {
        if (item.draftId == id) {
          str = item.stdName;
        }
      });
      return str;
    },
    /**
     * 获取UserName
     */
    getUserName(ids) {
      let arr = [];
      if (ids != "" && ids != null) {
        ids.split(",").forEach((id) => {
          // if (flag == 1) {
          //   if(this.formValue.)
          // }
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
     * 获取部门
     * @param {*} deptId 要查询的部门ID
     */
    getDeptName(deptId) {
      const sourceDeptList = this.$cache.session.getJSON("sourceDeptList");

      if (deptId == null) return "—";
      const dept = _.find(sourceDeptList, { deptId: deptId });
      return dept ? dept.deptName : "-";
    },
    /**
     * 编辑保存
     */
    save() {
      this.editProName = false;
      this.$emit("updateProName", this.formValue);
    },
    /**
     * 标准草案下载
     */
    // docDownload() {
    //   const req = {
    //     businessCategory:
    //       this.formValue.projectPhase == 10 ? 0 : this.formValue.projectType,
    //     businessId:
    //       this.formValue.projectPhase == 10
    //         ? this.formValue.stdDraftUrl
    //         : this.formValue.id,
    //   };
    //   console.log(this.getDraftName(this.formValue.stdDraftUrl))
    //   toWordByBusinessId(req).then((res) => {
    //     const { code, msg } = res;
    //     if (code == 200) {
    //       this.downLoadByURL(
    //         `/profile/${msg}`,
    //         `${this.getDraftName(this.formValue.stdDraftUrl)}.docx`,
    //         process.env.VUE_APP_EDITOR_PORT_URL_API
    //       );
    //     } else {
    //       this.$meesga.error(msg);
    //     }
    //   });
    // },
    /**
     * 标准草案查看
     */
    showDoc() {
      this.editorTiltle = "查看大纲";
      
      this.docData.docId = this.formValue.docId
      this.docData.author = this.userInfo.nickName;
      this.docData.readOnly = true;
      this.editorVisiable = true;
    },
    /**
     * 关闭更新大纲/文档窗口
     */
    closeDoc(e) {
      this.editorTiltle = "";
      this.editorUrl = "";
      this.editorVisiable = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.pro-info {
  padding: 15px;
  .info-title {
    line-height: 20px;
    font-size: 16px;
    font-weight: 600;
    border-left: 3px solid $bule;
    margin: 25px 0px;
    padding-left: 10px;
  }
  ::v-deep .info-form {
    width: 100%;
    overflow: hidden;
    margin: 25px 0px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
    .el-form-item {
      width: 48%;
      font-size: 14px;
      .el-form-item__label {
        font-weight: 400;
      }
      .el-input,
      .el-select {
        width: 100%;
      }
    }
  }
}
</style>
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
        <el-form-item label="项目申请人">
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
          label="制定或修订"
          :rules="[
            { required: true, message: '请选择制定或修订', trigger: 'blur' },
          ]"
        >
          <el-select
            v-if="isEdit == true"
            v-model="formValue.scplatMode"
            placeholder="请选择制定或修订"
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
          label="被修订标准号"
          v-if="formValue.scplatMode == 1"
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
          <!-- <el-input
            v-model="formValue.searchValue"
            placeholder="请输入被修订标准号"
          />stdList -->
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
          label="主要起草人"
          style="width: 100%"
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
          <!-- <span v-else>{{
            formValue.projectPhase != 10 && formValue.projectState != 1101
              ? getUserName(formValue.participantEditorIds)
              : getUserName(formValue.mainEditorIds)
          }}</span> -->
          <span v-else>{{
            formValue.projectPhase == 20 && formValue.projectState == 1102?getUserName(formValue.mainEditorIds):formValue.projectPhase != 10 && formValue.projectState != 1101
              ? getUserName(formValue.participantEditorIds)
              : getUserName(formValue.mainEditorIds)
          }}</span>
        </el-form-item>

        <el-form-item label="采用国际标准" style="width: 100%">
          <el-input
            v-model="formValue.internationalStandardNameAdopted"
            placeholder="请输入采用国际标准"
            v-if="isEdit == true"
          />
          <span v-else>{{ formValue.internationalStandardNameAdopted }}</span>
        </el-form-item>
        <el-form-item label="采标号" style="width: 100%">
          <el-input
            v-model="formValue.internationalStandardNoAdopted"
            placeholder="请输入采标号"
            v-if="isEdit == true"
          />
          <span v-else>{{ formValue.internationalStandardNoAdopted }}</span>
        </el-form-item>
        <!-- <el-form-item
          v-if="isEdit != true"
          label="标准化业务人员"
          style="width: 100%"
        >
          <span>{{ getUserName(formValue.interfacePersonIds) }}</span>
        </el-form-item> -->
      </el-form>
      <el-form
        class="info-form"
        label-width="120px"
        label-suffix=":"
        v-if="formValue != null"
        style="border: 0"
      >
        <el-form-item
          label="大纲草案"
          style="width: 100%"
          :rules="[
            { required: true, message: '请选择大纲草案', trigger: 'blur' },
          ]"
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
                :value="Number(item.draftId)"
              />
            </template>
          </el-select>
          <span v-else
            >{{ getDraftField(formValue.stdDraftUrl, "stdName") }}
            <span
              class="link-text"
              style="margin-left: 30px"
              @click="showDoc()"
            >
              预览
            </span>
          </span>
        </el-form-item>
        <el-form-item
          label="主要技术内容"
          style="width: 100%"
          :rules="[
            { required: true, message: '请输入主要技术内容', trigger: 'blur' },
          ]"
        >
          <TinymceEditor
            editorName="keyTechniqueContent"
            :curValue="formValue.keyTechniqueContent"
            v-model="formValue.keyTechniqueContent"
            :height="'260px'"
            v-if="isEdit == true"
          />
          <div
            v-else
            style="width: 100%; height: 260px; overflow: auto"
            v-html="formValue.keyTechniqueContent"
          ></div>
        </el-form-item>
        <el-form-item
          label="申请理由"
          style="width: 100%"
          :rules="[
            { required: true, message: '请输入主要技术内容', trigger: 'blur' },
            { min: 300, message: '长度大于 300 个字符', trigger: 'blur' },
          ]"
        >
          <template v-if="isEdit == true">
            <TinymceEditor
              editorName="applyReason"
              :cur-value="formValue.applyReason"
              v-model="formValue.applyReason"
              :height="'260px'"
              :maxNum="300"
            />
            <span class="val-text">注：申请理由不少于300字</span>
          </template>
          <div
            v-else
            style="width: 100%; height: 260px; overflow: auto"
            v-html="formValue.applyReason"
          ></div>
        </el-form-item>
      </el-form>
    </template>

    <!-- 选择主要起草人 -->
    <BztDialog :dialogInfo="changeUserDialog"  @close="closeChangeUser">
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
import { BztDialog, SamEditorDialog } from "@components/basicCom/index";
// import { SelectUserByDept } from "@components/bussinessCom/index";
import SelectUserByDept from "@components/bussinessCom/model/selectDept";

import stdApi from "@api/infoModule";
import { toWordByBusinessId } from "@api/editor";
import infoApi from "@api/infoModule";
import draftApi from "@api/draft";
export default {
  name: "pro-info",
  components: { BztDialog, SelectUserByDept, SamEditorDialog },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  dicts: ["revision_mode"],
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
      editProName: false,
      users: "",
      docData: {
        docId: null,
        author: null,
        stdNo: null,
        stdName: null,
        readOnly: null,
      },
      editorVisiable: false,
      editorTiltle: "查看文档",
      infoList: [],
    };
  },
  mounted() {
    if (this.formValue.id == null) {
      this.formValue.infoPublishId = null;
    }
    this.getInfoList();
    this.getStdList();
    this.getListDocument();
  },
  methods: {
    /**
     * 获取立项信息通知
     */
    getInfoList() {
      const req = {
        infoTheme: "1",
        status: "5",
        isPublish: 1,
        isAsc: "desc",
        orderByColumn: "createTime",
        pageNum: 1,
        pageSize: 10000,
      };
      this.infoList = [];
      infoApi.infoPblicList(req).then((res) => {
        const { code, msg } = res;
        if (code === 200) {
          this.infoList = res.rows;
          if (
            this.infoList.length > 0 &&
            this.formValue.infoPublishId == null
          ) {
            this.formValue.infoPublishId = this.infoList[0].infoPublishId;
            this.$emit("value-change", this.formValue);
          }
        } else {
          // this.$message.error(msg);
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
      if (this.formValue.applyUser == this.userInfo.userId) {
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
      this.getListDocument();
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
     * 根据草案大纲ID获取字段
     */
    getDraftField(id, field) {
      let str = "-";
      this.docList.forEach((item) => {
        if (item.draftId == id) {
          str = item[field];
        }
      });
      return str;
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
      console.log(this.users)
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
      // this.users = e.join(",");
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
     * 标准草案查看
     */
    showDoc() {
      this.editorTiltle = "查看文档";
      this.docData.stdNo = this.getDraftField(
        this.formValue.stdDraftUrl,
        "stdNo"
      );
      this.docData.stdName = this.getDraftField(
        this.formValue.stdDraftUrl,
        "stdName"
      );
      this.docData.docId = this.getDraftField(
        this.formValue.stdDraftUrl,
        "docId"
      );
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
    border-bottom: 1px dashed $bule;
    overflow: hidden;
    margin: 25px 0px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
    .el-form-item {
      width: 48%;
      float: left;
      font-size: 14px;
      .el-form-item__label {
        font-weight: 400;
      }
    }
  }
}
</style>
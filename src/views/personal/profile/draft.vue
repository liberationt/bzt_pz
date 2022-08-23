<template>
  <div class="draft app-container">
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="我的文档" name="my"></el-tab-pane>
      <el-tab-pane label="协作文档" name="collaborator"></el-tab-pane>
    </el-tabs>

    <!-- 搜索 -->
    <BztSearch :searchData="searchInfo" @search="searchList" />

    <!-- 功能操作行 -->
    <div class="operation-line">
      <div class="submit-btn" @click="editDraft(null)">
        <i class="el-icon-edit-outline" />
        新增标准
      </div>
    </div>

    <!-- 草案列表 -->
    <BztTable
      :tableData="{
        column: tabClums,
        data: list,
        action: tabAction,
        actionWidth: '320px',
      }"
      :hasIndex="true"
      :pageInfo="page"
      :isLoading="isTabLoading"
      @checkDetail="checkDetail"
    >
      <template slot="edit" slot-scope="{ scope }">
        <span class="link-text" @click="editDraft(scope)"> 编辑 </span>
        <span
          class="yellow-link-txt"
          v-if="
            scope.collaborator &&
            scope.collaborator != '' &&
            scope.createUser == userInfo.userId
          "
          @click="openEditOutline(scope)"
        >
          编辑大纲
        </span>
        <span
          class="yellow-link-txt"
          v-if="scope.collaborator && scope.collaborator != ''"
          @click="openCollaborativeEdit(scope)"
        >
          协同编纂
        </span>
        <span
          class="yellow-link-txt"
          v-if="
            scope.collaborator &&
            scope.collaborator != '' &&
            scope.createUser == userInfo.userId
          "
          @click="openMergeDoc(scope)"
        >
          合并文档
        </span>
        <span
          class="yellow-link-txt"
          v-if="!scope.collaborator || scope.collaborator == ''"
          @click="editDocument(scope)"
        >
          编辑文档
        </span>
        <!-- <span class="yellow-link-txt" @click="editDOCDetail(scope)"> -->
        <!-- 编辑正文 -->
        <!-- </span> -->
      </template>
      <template slot="remove" slot-scope="{ scope }" v-if="scope.status === 0">
        <span class="red-link-text" @click="removeInfo(scope)"> 删除 </span>
      </template>
    </BztTable>

    <!-- 分页 -->
    <BztPageContrl
      :pageInfo="page"
      @page-change="pageChange"
      @size-change="sizeChange"
    />

    <!--详情  -->
    <BztDialog :dialogInfo="updateDraftDialog" @close="closeAddDraft">
      <template slot="body">
        <el-form
          :model="draftForm"
          :rules="rules"
          ref="draftForm"
          label-suffix=":"
          label-width="120px"
          class="draftForm"
        >
          <el-form-item label="标准名称" prop="stdName">
            <el-input v-model="draftForm.stdName" />
          </el-form-item>
          <el-form-item label="标准编号" prop="stdNo">
            <el-input v-model="draftForm.stdNo" />
          </el-form-item>
          <el-form-item label="标准分类" prop="stdKind">
            <!-- <el-input v-model="draftForm.origStdNo" /> -->
            <el-select v-model="draftForm.stdKind" placeholder="请选择标准分类">
              <el-option
                v-for="item in optionsList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="协作者">
            <!-- 选择人员 -->
            <SelectUserByDept
              :value="draftForm.collaborator ? draftForm.collaborator : ''"
              :disableUsers="String(userInfo.userId)"
              @user-change="userChange"
            />
          </el-form-item>
        </el-form>
      </template>
    </BztDialog>

    <SamEditorDialog
      v-if="editorVisiable"
      :visiable="editorVisiable"
      :title="editorTiltle"
      :data="docData"
      @close="updateDoc"
    />

    <!-- 编辑大纲 -->
    <EditOutlineDialog
      v-if="editOutline.visible"
      :visiable="editOutline.visible"
      :title="editOutline.title"
      :docId="currItem.docId"
      :memberList="memberList"
      @close="closeEditOutline"
    />

    <!-- 多人协同 -->
    <CollaborativeEditDialog
      v-if="collaborativeEdit.visible"
      :visiable="collaborativeEdit.visible"
      :title="collaborativeEdit.title"
      :docId="currItem.docId"
      :memberList="memberList"
      @close="closeCollaborativeEdit"
    />

    <!-- 合并文档 -->
    <MergeDocDialog
      v-if="mergeDoc.visible"
      :visiable="mergeDoc.visible"
      :title="mergeDoc.title"
      :docId="currItem.docId"
      :memberList="memberList"
      @close="closeMergeDoc"
    />
  </div>
</template>
<script>
import Api from "@/api/draft.js";
import { updateByBusiness, getConfigByKey } from "@/api/editor.js";
import { mapGetters } from "vuex";
import {
  BztSearch,
  BztTable,
  BztPageContrl,
  BztDialog,
  SamEditorDialog,
} from "@components/basicCom/index";
import SelectUserByDept from "@components/bussinessCom/model/selectDept";
import EditOutlineDialog from "@components/bussinessCom/editor/editOutlineDialog";
import CollaborativeEditDialog from "@components/bussinessCom/editor/collaborativeEditDialog";
import MergeDocDialog from "@components/bussinessCom/editor/mergeDocDialog";

const draftForm = {
  businessId: null,
  businessCategory: 0,
  stdNo: "",
  stdName: "",
  origStdNo: "",
  hasDocument: 0,
  collaborator: "",
  stdKind:''
};
export default {
  name: "draft",
  dicts: ["draft_status"],
  components: {
    BztSearch,
    BztTable,
    BztPageContrl,
    BztDialog,
    SamEditorDialog,
    EditOutlineDialog,
    SelectUserByDept,
    CollaborativeEditDialog,
    MergeDocDialog,
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  data() {
    return {
      updateDraftDialog: {
        visible: false,
        title: "新增标准",
        width: "1000px",
        footer: true,
        loadding: false,
      },
      optionsList:[
        {
          label:'国家标准',
          value:1100
        },
        {
          label:'行业标准',
          value:1200
        },
        {
          label:'地方标准',
          value:6
        },
        {
          label:'团体标准',
          value:1500
        },
        {
          label:'企业标准',
          value:1400
        },
      ],
      editorVisiable: false,
      editorTiltle: "编辑大纲",
      editorUrl: "",
      isTabLoading: false,
      searchInfo: {},
      tabClums: [
        {
          title: "标准名称",
          key: "stdName",
          minWidth: "210",
        },
        {
          title: "标准编号",
          key: "stdNo",
          width: "180",
        },
        {
          title: "发布人",
          key: "createUser",
          width: "180",
          filter: {
            type: "user",
          },
        },
        {
          title: "发布日期",
          key: "createTime",
          width: "220",
          filter: {
            type: "filter",

            action: (data) => {
              return this.getDate(data);
            },
          },
        },
        {
          title: "协作者",
          key: "collaborator",
          width: "250",
          filter: {
            type: "filter",
            action: (data) => {
              if (data && data != "") {
                console.info("data=>", data);
                let users = data.split(",");
                let usersName = users.map((i) => this.parseUserName(i));
                return usersName.join(",");
              } else {
                return "";
              }
            },
          },
        },
        {
          title: "状态",
          key: "status",
          width: "100",
          filter: {
            type: "filter",
            action: (data) => {
              let str = "";
              this.dict.type.draft_status.forEach((item) => {
                if (item.value == data) {
                  str = item.label;
                }
              });
              return str;
            },
          },
        },
      ],
      listReq: {
        createUser: "",
        searchValue: "",
        isAsc: "desc",
        orderByColumn: "createTime",
        status: null,
        pageNum: 1,
        pageSize: 10,
      },
      tabAction: [
        // { label: "详情", action: "checkDetail" },
        { label: "编辑", type: "slot", btnName: "edit" },
        { label: "修改", type: "slot", btnName: "update" },
        { label: "修改", type: "slot", btnName: "resive" },
        {
          label: "删除",
          type: "slot",
          btnName: "remove",
          color: "rgba(214, 71, 48)",
        },
      ],
      list: [],
      page: {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      },
      draftForm: this.deepClone(draftForm),
      rules: {
        stdName: { required: true, message: "请输入标准名称", trigger: "blur" },
        stdKind: { required: true, message: "请选择标准分类", trigger: ["change","blur"] }
      },
      docData: {
        docId: null,
        author: null,
        stdNo: null,
        stdName: null,
        readOnly: null,
      },
      editOutline: {
        visible: false,
        title: "编辑大纲",
      },
      collaborativeEdit: {
        visible: false,
        title: "多人协同编纂",
      },
      mergeDoc: {
        visible: false,
        title: "合并文档",
      },
      memberList: [],
      currItem: {},
      activeTab: "my",
    };
  },
  created() {
    this.initDictData();
    this.getList();
  },
  methods: {
    // 格式化用户
    parseUserName(id) {
      let user = _.find(this.$cache.session.getJSON("sourceUserList"), {
        userId: Number(id),
      });
      return user ? user.nickName + "(" + user.userName + ")" : "-";
    },
    /**
     * 初始搜索列表化字典数据
     */
    initDictData() {
      this.searchInfo = {
        labelList: [
          {
            label: "关键字",
            key: "searchValue",
            type: 1,
          },
          {
            label: "状态",
            key: "status",
            type: 2,
            options: this.dict.type.draft_status,
            replaceField: { value: "value", label: "label" },
            multiple: false,
          },
          {
            label: "发布人",
            key: "createUser",
            type: 4,
            multiple: false,
          },
        ],
        btnList: [
          { label: "搜索", action: "search", type: 1 },
          { label: "重置", action: "search", type: 0 },
        ],
      };
    },
    /**
     * 判断日期式
     * @param {string} data 要判断的日期字符串
     */
    getDate(data) {
      let str = "";
      if (data === null || data === undefined) {
        str = "";
      } else if (
        data.indexOf("1900-01-01") === -1 &&
        data.indexOf("1970-01-01") === -1 &&
        data.indexOf("9990-01-01") === -1
      ) {
        str = data;
      } //'1900-01-01'||'9990-01-01'||'1970-01-01'
      return str;
    },
    /**
     * 获取草案列表
     */
    getList() {
      this.isTabLoading = true;
      if (this.activeTab == "collaborator") {
        this.listReq.collaborator = this.userInfo.userId;
        this.listReq.createUser = null;
      } else {
        this.listReq.createUser = this.userInfo.userId;
        this.listReq.collaborator = null;
      }

      Api.getDraftList(this.listReq).then((res) => {
        const { msg, data, code } = res;
        if (code === 200) {
          this.list = res.rows;
          this.page.total = res.total;
          this.page.pageNo = this.listReq.pageNum;
          this.page.pageSize = this.listReq.pageSize;
        } else {
          // this.$message.error(msg);
        }
        this.isTabLoading = false;
      });
    },
    /**
     * 搜索
     * @param {object} e 搜索表单参数
     */
    searchList(e) {
      this.isAll = false;

      Object.keys(e).map((key) => {
        this.listReq[key] = e[key];
      });
      this.pageChange(1);
    },
    /**
     * 翻页
     * @param {number} e 页码
     */
    pageChange(e) {
      this.listReq.pageNum = e;
      this.getList();
    },
    /**
     * 改变每页显示数量
     */
    sizeChange(e) {
      this.listReq.pageSize = e;
      this.pageChange(1);
    },
    /**
     * 查看详情
     * @param {object} e 要查看的草案的草案
     */
    checkDetail(e) {
      // this.updateDraftDialog.visible = true;
      // this.infoDetail = e;
      // this.updateDraftDialog.title = `查看草案： [ ${e.infoTitle} ] 详情`;
    },
    /**
     * 关闭详情弹框
     */

    /**
     * 打开新增编辑弹窗
     * @param {*} data 为null时为发布草案，否则为编辑
     */
    editInfo(data = null) {
      this.infoData.formData = data;
      this.infoData.type = null;
      if (data != null) {
        this.infoData.type = data.status;
      }
      this.editorVisiable = true;
    },
    /**
     * 暂存/提交/取消草案
     */
    saveInfo(e) {
      this.editorVisiable = false;
      this.pageChange(1);
    },
    /**
     * 删除草案
     * @param {*} e 要删除的草案的详情
     */
    removeInfo(e) {
      this.$confirm(`确定删除：《${e.stdName}》吗？`, "标准", {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
        center: true,
      })
        .then(() => {
          Api.removeDraft(e.draftId).then((res) => {
            const { data, code, msg } = res;
            if (code === 200) {
              this.$message.success(`已删除标准：${e.stdName}`);
              this.pageChange(1);
            } else {
              // this.$message.error(msg);
            }
          });
        })
        .catch(() => {});
    },
    /**
     * 新增草案
     * @param {*} data 编辑的草案信息
     */
    editDraft(data) {
      this.draftForm = this.deepClone(draftForm);
      this.updateDraftDialog.title = "新增标准";
      if (data != null) {
        Object.keys(this.draftForm).map((key) => {
          this.draftForm[key] = data[key];
        });
        this.draftForm["draftId"] = data.draftId;
        this.updateDraftDialog.title = `编辑标准：【${data.stdName}】`;
      }
      this.updateDraftDialog.visible = true;
    },
    /**
     * 更新保存草案
     */
    closeAddDraft(e) {
      if (e == true) {
        this.$refs.draftForm.validate((valid) => {
          if (valid) {
            this.updateDraftDialog.loadding = true;
            if (!this.draftForm.draftId) {
              // 新增草案
              Api.addDraft(this.draftForm).then((res) => {
                this.updateDraftDialog.loadding = false;
                const { code, msg } = res;
                if (code == 200) {
                  this.$message.success("新增标准成功");
                  this.pageChange(1);
                  this.updateDraftDialog.visible = false;
                  this.draftForm = this.deepClone(this.draftForm);
                } else {
                  this.$message.error(msg);
                }
              });
            } else {
              const condition = _.merge(this.draftForm, {
                updateCover: 1,
              });
              Api.updateDraft(condition).then((res) => {
                // 编辑草案
                this.updateDraftDialog.loadding = false;
                const { code, msg } = res;
                if (code == 200) {
                  this.$message.success("修改标准成功");
                  this.updateDraftDialog.visible = false;
                  this.pageChange(1);
                } else {
                  this.$message.error(msg);
                }
              });
            }
          }
        });
      } else {
        this.updateDraftDialog.visible = false;
        this.draftForm = JSON.parse(JSON.stringify(this.draftForm));
      }
    },
    /**
     * 编辑大纲
     */
    editDW(data) {
      this.editorTiltle = "编辑大纲";
      this.editorUrl = encodeURI(
        `${
          process.env.VUE_APP_EDITOR_URL
        }outline?t=${Date.now()}&setOwner=false&businessId=${
          data.draftId
        }&businessCategory=0&readOnly=false&coverVisible=true&stdNo=${
          data.stdNo
        }&origStdNo=${data.origStdNo}&stdName=${data.stdName}&userId=${
          this.userInfo.userId
        }&userName=${this.userInfo.nickName}`
      );
      this.editorVisiable = true;
    },
    /**
     * 编辑正文
     */
    editDOCDetail(editData) {
      const req = {
        businessCategory: 0,
        businessId: editData.draftId,
        configKey: "insert",
      };

      getConfigByKey(req).then((res) => {
        const { code, data, msg } = res;
        if (code == 200) {
          if (data != null) {
            this.editorTiltle = "编辑文档";
            this.editorUrl = encodeURI(
              `${
                process.env.VUE_APP_EDITOR_URL
              }editor?t=${Date.now()}&businessId=${
                editData.draftId
              }&businessCategory=0&readOnly=false&coverVisible=true&userId=${
                this.userInfo.userId
              }&userName=${this.userInfo.nickName}`
            );
            this.editorVisiable = true;
          } else {
            this.$message.warning("还未编辑保存大纲，请先编辑保存大纲");
          }
        } else {
          console.log(msg);
        }
      });
    },
    /**
     * 关闭更新大纲/文档窗口
     */
    updateDoc(e) {
      this.pageChange(1);
      this.editorTiltle = "";
      this.editorUrl = "";
      this.editorVisiable = false;
    },
    /**
     * 编辑文档
     */
    editDocument(data, readOnly = false) {
      if (readOnly) this.editorTiltle = "查看文档";
      else this.editorTiltle = "编辑文档";
      this.docData.stdNo = data.stdNo;
      this.docData.stdName = data.stdName;
      this.docData.docId = data.docId;
      this.docData.author = this.userInfo.nickName;
      this.docData.readOnly = readOnly;
      this.editorVisiable = true;
    },
    openEditOutline(item) {
      this.currItem = item;

      if (!_.isEmpty(item.collaborator)) {
        let userIds = item.collaborator.split(",");
        this.memberList = userIds.map((i) => {
          return _.find(this.$cache.session.getJSON("sourceUserList"), {
            userId: Number(i),
          });
        });
        this.memberList.unshift(
          _.find(this.$cache.session.getJSON("sourceUserList"), {
            userId: item.createUser,
          })
        );
      } else {
        this.memberList = [
          _.find(this.$cache.session.getJSON("sourceUserList"), {
            userId: item.createUser,
          }),
        ];
      }

      this.editOutline.visible = true;
    },
    /**
     * 关闭更新大纲/文档窗口
     */
    closeEditOutline(e) {
      this.editOutline.visible = false;
    },
    openCollaborativeEdit(item) {
      this.currItem = item;

      if (!_.isEmpty(item.collaborator)) {
        let userIds = item.collaborator.split(",");
        this.memberList = userIds.map((i) => {
          return _.find(this.$cache.session.getJSON("sourceUserList"), {
            userId: Number(i),
          });
        });
        this.memberList.unshift(
          _.find(this.$cache.session.getJSON("sourceUserList"), {
            userId: item.createUser,
          })
        );
      } else {
        this.memberList = [
          _.find(this.$cache.session.getJSON("sourceUserList"), {
            userId: item.createUser,
          }),
        ];
      }

      this.collaborativeEdit.visible = true;
    },
    /**
     * 关闭窗口
     */
    closeCollaborativeEdit(e) {
      this.collaborativeEdit.visible = false;
    },
    openMergeDoc(item) {
      this.currItem = item;

      if (!_.isEmpty(item.collaborator)) {
        let userIds = item.collaborator.split(",");
        this.memberList = userIds.map((i) => {
          return _.find(this.$cache.session.getJSON("sourceUserList"), {
            userId: Number(i),
          });
        });
        this.memberList.unshift(
          _.find(this.$cache.session.getJSON("sourceUserList"), {
            userId: item.createUser,
          })
        );
      } else {
        this.memberList = [
          _.find(this.$cache.session.getJSON("sourceUserList"), {
            userId: item.createUser,
          }),
        ];
      }

      this.mergeDoc.visible = true;
    },
    /**
     * 关闭窗口
     */
    closeMergeDoc(e) {
      this.mergeDoc.visible = false;
    },
    /**
     * 处理人员
     */
    userChange(e) {
      this.draftForm.collaborator = e.join(",");
    },
    // 切换tab
    handleTabClick(tab, event) {
      this.pageChange(1);
    },
  },
};
</script>
<style lang="scss" scoped>
.draft {
  width: 100%;
  height: 100%;
}

::v-deep .el-descriptions {
  font-size: 14px !important;
  width: 80%;
  margin: auto;
  .el-descriptions-row {
    .el-descriptions-item__cell {
      line-height: 35px;
      font-size: 15px;
    }
  }
}
</style>
<template>
  <div class="delivery-info app-container">
    <!-- 搜索 -->
    <BztSearch
      :searchData="searchInfo"
      :formVal="listReq"
      @search="searchList"
    />

    <!-- 功能操作行 -->
    <div class="operation-line">
      <div
        class="submit-btn"
        @click="editInfo(null)"
        v-if="
          !noPermi([
            'deliveryInfo:exStd',
            'deliveryInfo:exReStd',
            'deliveryInfo:enStd',
          ])
        "
      >
        <i class="el-icon-edit-outline" />
        发布通知
      </div>
    </div>

    <!-- 信息列表 -->
    <BztTable
      :tableData="{
        column: tabClums,
        data: list,
        action: tabAction,
        actionWidth: '260px',
      }"
      :hasIndex="true"
      :pageInfo="page"
      :isLoading="isTabLoading"
      @checkDetail="checkDetail"
    >
      <template
        slot="edit"
        slot-scope="{ scope }"
        v-if="scope.status == 1 && scope.createUser == userInfo.userId"
      >
        <span class="yellow-link-txt" @click="editInfo(scope)"> 编辑 </span>
      </template>
      <template
        slot="update"
        slot-scope="{ scope }"
        v-if="scope.status == 4 && scope.createUser == userInfo.userId"
      >
        <span class="yellow-link-txt" @click="editInfo(scope)"> 修改 </span>
      </template>
      <template slot="resive" slot-scope="{ scope }" v-if="scope.status == 5">
        <span
          v-if="
            scope.haveFirst == 1 &&
            (scope.infoTheme == 1 || scope.infoTheme == 4)
          "
          class="green-link-text"
          @click="distributionNotice(scope, 1)"
        >
          分发通知
        </span>
        <span
          v-if="
            scope.haveSecond == 1 &&
            (scope.infoTheme == 1 || scope.infoTheme == 4)
          "
          class="green-link-text"
          @click="distributionNotice(scope, 2)"
        >
          部门内部分发
        </span>
        <span
          class="yellow-link-txt"
          v-if="
            scope.haveFirst == 1 &&
            (scope.infoTheme == 1 || scope.infoTheme == 4)
          "
          @click="receiverEnd(scope, 3)"
          >结束分发</span
        >
        <span
          class="yellow-link-txt"
          v-if="
            scope.haveSecond == 1 &&
            (scope.infoTheme == 1 || scope.infoTheme == 4)
          "
          @click="receiverEnd(scope, 1)"
          >结束部门内部分发</span
        >
        <span
          class="red-link-text"
          v-if="scope.haveRead == 1||scope.haveLook==1"
          @click="receiverEnd(scope,scope.haveRead==1?2:5)"
          >待阅
        </span>
      </template>
      <template
        slot="remove"
        slot-scope="{ scope }"
        v-if="
          scope.createUser === userInfo.userId &&
          (scope.status == 4 || scope.status == 1)
        "
        v-hasPermi="['deliveryInfo:remove']"
      >
        <span class="red-link-text" @click="removeInfo(scope)"> 删除 </span>
      </template>
    </BztTable>

    <!-- 分页 -->
    <BztPageContrl
      :pageInfo="page"
      @page-change="pageChange"
      @size-change="sizeChange"
    />

    <!--信息发布/编辑/修改  -->
    <PublicInfo :visiable="editVisible" v-if="editVisible" :data="infoData" @save="saveInfo" />

    <!--详情  -->
    <BztDialog :dialogInfo="dialogDetailInfo" @close="closeDetail">
      <template slot="body">
        <HandleInfo
          :todoTask="{ businessObjId: infoDetail.infoPublishId }"
          :handle="false"
        />
      </template>
    </BztDialog>

    <!-- 选择信息分发人 -->
    <BztDialog
      :dialogInfo="distriNoticeDialog"
      v-if="distriNoticeDialog.visible == true"
      @close="closeNotice"
    >
      <template slot="body">
        <NoticeDistribution
          :todoTask="{
            businessObjId: infoDetail.infoPublishId,
            receiver: infoDetail.receiver,
            hook: '',
          }"
          :isBtnText="'暂存'"
          :witchDist="witchDist"
          @success="closeNotice"
          @close="closeNotice"
        />
      </template>
    </BztDialog>
 
     <!-- 选择部门分发人员 -->
    <BztDialog :dialogInfo="changeUserDialog" v-if="changeUserDialog.visible==true" @close="closeChangeUser">
      <template slot="body">
        <!-- <div style="margin-bottom:20px;">
          <el-checkbox-group v-model="checkList" @change="choosePersion">
            <el-checkbox label="1">部门网员</el-checkbox>
            <el-checkbox label="2">其他人员</el-checkbox>
          </el-checkbox-group>
        </div>

        <SelectUserByDept
          v-show="checkList[checkList.length-1] == 1"
          :value="receiver ? receiver  : ''"
          :roleKeys="
            infoDetail.infoTheme == 1 || infoDetail.infoTheme == 4
              ? 'stdLiaison'
              : ''
          "
          :disableUsers="infoDetail.receiver"
          :disableDepts="
            infoDetail.receiverDept != null ? infoDetail.receiverDept : []
          "
          :isEcho="isEcho"
          @user-change="userChange"
          :checkDepAllUser="infoDetail.infoTheme == 1 || infoDetail.infoTheme == 4"
        />

        <SelectUserByDept
          v-show="checkList[checkList.length-1] == 2"
          :value="otherReceivers? otherReceivers : ''"
          @user-change="userChanges"
        /> -->

        <el-collapse v-model="activeName">
          <el-collapse-item title="部门网员" name="1">
            <SelectUserByDept
              :value="receiver ? receiver  : ''"
              :roleKeys="
                infoDetail.infoTheme == 1 || infoDetail.infoTheme == 4
                  ? 'stdLiaison'
                  : ''
              "
              :disableUsers="infoDetail.receiver"
              :disableDepts="
                infoDetail.receiverDept != null ? infoDetail.receiverDept : []
              "
              :isEcho="isEcho"
              @user-change="userChange"
              :checkDepAllUser="infoDetail.infoTheme == 1 || infoDetail.infoTheme == 4"
            />
          </el-collapse-item>
          <el-collapse-item title="其他人员" name="2">
           <SelectUserByDept
              :value="otherReceivers? otherReceivers : ''"
              :isDelNetwork="true"
              @user-change="userChanges"
            />
          </el-collapse-item>
          
        </el-collapse>

      </template>
    </BztDialog>
  </div>
</template>
<script>
import Api from "@api/infoModule";
import { mapGetters } from "vuex";
import {
  BztSearch,
  BztTable,
  BztPageContrl,
  BztDialog,
} from "@components/basicCom/index";

import {
  PublicInfo,
  HandleInfo,
  // SelectUserByDept,
  NoticeDistribution,
} from "@components/bussinessCom/index";
import SelectUserByDept from "@components/bussinessCom/model/selectDept";
// import Distribute from "@components/bussinessCom/model/distribute";
import {
  listUserByDeptsAndRoleKeys,
} from "@api/system/user";
const infoFormReq = {
  infoPublishId: null,
  receiver: "",
  secondReceiver: "",
  receiverDept: [],
};
export default {
  name: "delivery-info",
  components: {
    BztSearch,
    BztTable,
    BztPageContrl,
    BztDialog,
    PublicInfo,
    HandleInfo,
    SelectUserByDept,
    NoticeDistribution,
    // Distribute
  },
  dicts: ["info_publish_theme", "info_publish_status"],
  computed: {
    ...mapGetters(["userInfo"]),
  },
  data() {
    return {
      changeUserDialog: {
        visible: false,
        title: "分发人员",
        width: "900px",
        footer: true,
        loadding: false,
      },
      activeName:'1',
      isLoading:false,
      isEcho:true,
      isAll: false,
      dialogDetailInfo: {
        visible: false,
        title: "详情",
        width: "900px",
        footer: false,
      },
      distriNoticeDialog: {
        visible: false,
        title: "分发通知",
        width: "900px",
      },
      deptDialog:{
        visible: false,
        title: "分发通知",
        width: "900px",
      },
      formLabelAlign:{
        receiver:'',
        otherReceivers:''
      },
      receiver:'',
      editVisible: false,
      isTabLoading: false,
      searchInfo: {},
      checkList:['1'],
      tabClums: [
        {
          title: "标题",
          key: "infoTitle",
          minWidth: "380",
        },
        {
          title: "主题",
          key: "infoTheme",
          width: "260",
          filter: {
            type: "filter",
            action: (data) => {
              let str = "";
              this.dict.type.info_publish_theme.forEach((item) => {
                if (item.value == data) {
                  str = item.label;
                }
              });
              return str;
            },
          },
        },
        {
          title: "发布人",
          key: "createUser",
          width: "160",
          filter: {
            type: "user",
          },
        },
        {
          title: "发布部门",
          key: "initiatingDept",
          width: "160",
          filter: {
            type: "dept",
          },
        },
        {
          title: "发布日期",
          key: "createTime",
          width: "200",
          filter: {
            type: "filter",

            action: (data) => {
              return this.getDate(data);
            },
          },
        },
        {
          title: "状态",
          key: "status",
          width: "120",
          filter: {
            type: "filter",
            isHtml: true,
            action: (data) => {
              let str = "";
              this.dict.type.info_publish_status.forEach((item) => {
                if (item.value == data) {
                  str = item.label;
                }
              });
              switch (data) {
                case 6:
                  str = `<span class="error-tag">${str}</span>`;
                  break;
                case 1:
                case 4:
                  str = `<span class="warning-tag">${str}</span>`;
                  break;
                case 5:
                  str = `<span class="success-tag">${str}</span>`;
                  break;
                case 2:
                case 3:
                  str = `<span class="ing-tag" style="display:block;max-width:180px;">${str}</span>`;
                  break;
              }
              return str;
            },
          },
        },
      ],
      listReq: {
        // createUser: "",
        infoTheme: "",
        infoTitle: "",
        isAsc: "desc",
        orderByColumn: "createTime",
        status: null,
        pageNum: 1,
        pageSize: 10,
        initiatingDept: null,
        dataScope: "",
      },
      tabAction: [
        { label: "详情", action: "checkDetail" },
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
      infoDetail: {},
      infoData: {
        formData: null,
        type: 0,
      },
      noticeVisiable: false,
      witchDist: null,
      saveData:{
        otherReceivers:''
      },
      otherReceiversList:[],
      secondReceiver:[],
      otherReceivers:'',
      scopedRow:{},
      clonePersion:['1']
    };
  },
  created() {
    this.initDictData();
    this.getList();
  },
  methods: {
    /**
     * 获取UserName
     */
    getUserName(ids) {
      let arr = [];
      if (ids != ""&&ids !=undefined) {
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
     * 初始搜索列表化字典数据
     */
    initDictData() {
      this.searchInfo = {
        labelList: [
          {
            label: "发布部门",
            key: "initiatingDept",
            type: 5,
          },
          {
            label: "主题",
            key: "infoTheme",
            type: 2,
            options: this.dict.type.info_publish_theme,
            replaceField: { value: "value", label: "label" },
            multiple: false,
          },
          {
            label: "状态",
            key: "status",
            type: 2,
            options: this.dict.type.info_publish_status,
            replaceField: { value: "value", label: "label" },
            multiple: false,
          },
          {
            label: "发布人",
            key: "createUser",
            type: 4,
            multiple: false,
          },
          {
            label: "发布日期",
            key: "create_time",
            type: 3,
            formatStr: "yyyy-MM",
            formatValStr: "yyyy-MM",
            dateType: "dateRange",
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
     * 获取信息列表
     */
    getList() {
      this.isTabLoading = true;
      this.listReq["dataScope"] =
        this.hasPermission("systemAdmin") || this.userInfo.userId == 1
          ? null
          : this.userInfo.userId;
      Api.infoPblicList(this.listReq).then((res) => {
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
     * @param {object} e 要查看的信息的信息
     */
    checkDetail(e) {
      this.dialogDetailInfo.visible = true;
      this.infoDetail = e;
      this.dialogDetailInfo.title = ` [ ${e.infoTitle} ] 详情`;
    },
    /**
     * 关闭详情弹框
     */
    closeDetail() {
      this.dialogDetailInfo.visible = false;
      this.infoDetail = { businessObjId: null };
    },
    /**
     * 打开新增编辑弹窗
     * @param {*} data 为null时为发布信息，否则为编辑
     */
    editInfo(data = null) {
      this.infoData.formData = data;
      this.infoData.type = null;
      if (data != null) {
        this.infoData.type = data.status;
      }
      this.editVisible = true;
    },
    /**
     * 暂存/提交/取消信息
     */
    saveInfo(e) {
      this.editVisible = false;
      this.pageChange(1);
    },
    /**
     * 删除信息
     * @param {*} e 要删除的信息的详情
     */
    removeInfo(e) {
      this.$confirm(
        `确定删除：《${e.infoTitle}》吗？删除后数据将不可再恢复，请谨慎操作！`,
        "信息",
        {
          confirmButtonText: "删除",
          cancelButtonText: "取消",
          center: true,
        }
      )
        .then(() => {
          Api.removeInfoPubilic(e.infoPublishId).then((res) => {
            const { data, code, msg } = res;
            if (code === 200) {
              this.$message.success(`已删除信息：${e.infoTitle}`);
              this.pageChange(1);
            } else {
              // this.$message.error(msg);
            }
          });
        })
        .catch(() => {});
    },
    choosePersion(val){
      if(!val.length){
        this.checkList = this.clonePersion
        return
      }
      this.clonePersion = val
    },
    /**
     * 分发通知
     * @param {*} e 要分发的信息的详细信息
     */
    distributionNotice(e, flag) {
      this.scopedRow = {}
      this.scopedRow = e
      this.infoDetail = this.deepClone(infoFormReq);
      this.witchDist = flag;
      Object.keys(this.infoDetail).map((key) => {
        this.infoDetail[key] = e[key] ?? null;
      });

       Api.getInfoDetail(this.infoDetail.infoPublishId).then((res) => {
        const { msg, data, code } = res;
        if (code === 200) {
          this.infoDetail = data;
          if(flag==1){
            this.receiver = data.receiver?data.receiver:''
            this.changeUserDialog.visible = true
          }else{
            this.distriNoticeDialog.visible = true
          }
        }
      });

    },
    //确认分发
    closeChangeUser(e) {
      if (e == true) {
        let flag = true
        this.saveData = this.scopedRow
        this.saveData.otherReceivers = this.otherReceivers?this.otherReceivers:""
        if(this.witchDist ==1){
          if(!this.receiver&&!this.scopedRow.receiver){
            flag=false
            return this.$message.warning('请选择要分发的网员')
          }
          this.saveData.receiver = this.receiver ? this.receiver : this.scopedRow.receiver ? this.scopedRow.receiver :''
        }else{
          if(this.secondReceiver&&this.secondReceiver.length){
            let arr = [];
            if (this.saveData.secondReceiver != null &&this.saveData.secondReceiver != "") {
              arr = this.saveData.secondReceiver.split(",");
            }
            this.secondReceiver.forEach((item) => {
              if (arr.indexOf(item.toString()) == -1 && arr.indexOf(item) == -1) {
                arr.push(item);
              }
            });
            this.saveData.secondReceiver = arr.join(",");
          }else{
            flag=false
            return this.$message.warning('请选择要分发的人员')
          }
        }
        if(flag){
          if(this.witchDist ==1){
            Api.updatePublish(this.saveData).then((res) => {
              const { code, data, msg } = res;
              if (code === 200) {
                this.$message.success("通知分发成功");
                this.changeUserDialog.loadding = false
                this.deptDialog.visible = false;
                this.infoDetail = {};
                this.secondReceiver = []
                this.saveData = {
                  otherReceivers:''
                }
                this.distriNoticeDialog.visible = false;
                this.pageChange(1);
              } 
            }).catch(()=>{
              this.isLoading = false;
            });
          }else{
            this.$confirm('确认后不可修改！', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
                Api.updatePublish(this.saveData).then((res) => {
                const { code, data, msg } = res;
                if (code === 200) {
                  this.$message.success("通知分发成功");
                  this.changeUserDialog.loadding = false
                  this.deptDialog.visible = false;
                  this.infoDetail = {};
                  this.secondReceiver = []
                  this.saveData = {
                    otherReceivers:''
                  }
                  this.distriNoticeDialog.visible = false;
                  this.pageChange(1);
                } 
              }).catch(()=>{
                this.isLoading = false;
              });
            }).catch(() => {
              this.deptDialog.visible = false;
              this.infoDetail = {};
              this.secondReceiver = []
              this.saveData = {
                otherReceivers:''
              }
              this.distriNoticeDialog.visible = false;   
            });
          }
          
        }
      }
      this.changeUserDialog.visible = false;
      this.checkList = ["1"]
      this.activeName = "1"
      this.receiver = ""
      this.otherReceivers = ""
    },
    userChange(e){
      if(e&&e.length){
        this.receiver = e.join(",")
      }
    },
    userChanges(e){
      if(e&&e.length){
        this.otherReceivers = e.join(",")
      }
    },
    /**
     * 确认(取消)信息分发通知
     * @param {*} e true：确认，false:取消
     */
    closeNotice(e,secondReceiver=null) {
      if(e){
        this.saveData = this.scopedRow = e
        this.secondReceiver = secondReceiver
        this.closeChangeUser(true)
      }else{
        this.distriNoticeDialog.visible = false;
      }
    },
    /**
     * 结束通知分发
     */
    receiverEnd(e, type) {
      if (type == 2||type == 5) {
        const req = {
          id: e.infoPublishId,
          type: e.infoTheme == 2 ? 4 : type,
        };
        Api.receiverEnd(req).then((res) => {
          const { data, code, msg } = res;
          if (code === 200) {
            this.pageChange(1);
            this.checkDetail(e);
          } else {
            // this.$message.error(msg);
          }
        });
      } else {
        this.$confirm(`确定结束：《${e.infoTitle}》通知分发吗？`, "信息", {
          confirmButtonText: "结束",
          cancelButtonText: "取消",
          center: true,
        })
          .then(() => {
            const req = {
              id: e.infoPublishId,
              type: type,
            };
            Api.receiverEnd(req).then((res) => {
              const { data, code, msg } = res;
              if (code === 200) {
                this.$message.success("操作成功");
                this.pageChange(1);
              } else {
                // this.$message.error(msg);
              }
            });
          })
          .catch(() => {});
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.delivery-info {
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
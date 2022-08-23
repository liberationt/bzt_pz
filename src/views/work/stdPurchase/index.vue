<template>
  <div class="enterprise-std app-container">
    <!-- 内容区 -->
    <div class="enterprise-std-content">
      <!-- 搜索 -->
      <BztSearch :searchData="searchInfo" @search="searchList" />

      <!-- 功能操作行 -->
      <div class="operation-line">
        <div
          class="submit-btn"
          @click="applyStdNewPurchase()"
          v-hasPermi="['stdPurchase:purchase']"
        >
          <!-- v-if="hasPermission('stdLiaison')" -->
          <i class="el-icon-s-order" />
          申请标准购置
        </div>
        <div
          class="submit-btn"
          @click="applyStdPurchase(null)"
          v-hasPermi="['stdPurchase:apply']"
        >
          <!-- v-if="hasPermission('stdLiaison')" -->
          <i class="el-icon-plus" />
          标准购置列表
        </div>
         <div
          class="green-btn"
          @click="checkListByYear()"
          v-hasPermi="['stdPurchase:year']"
        >
          <!-- v-if="hasPermission('stdLiaison')" -->
          <i class="el-icon-view" />
          查看年度购置清单
        </div>
      </div>

      <!-- 标准购置列表 -->
      <BztTable
        :tableData="{
          column: tabClums,
          data: list,
          action: tabAction,
          actionWidth: '150px',
        }"
        :hasIndex="true"
        :pageInfo="page"
        :isLoading="isTabLoading"
      >
        <template slot="remove" slot-scope="{ scope }">
          <span
            class="yellow-link-txt"
            @click="updateTask(scope)"
            v-if="
              scope.applierId == userInfo.userId && scope.projectStatus == 5
            "
          >
            修改
          </span>
          <!-- <span
            class="red-link-text"
            @click="updateTask(scope)"
            v-else-if="scope.hasAuth==true"
          >
            详情及审批
          </span> -->
          <span
            class="red-link-text"
            @click="updateTask(scope)"
            v-else-if="
              (scope.businessDeptApproveUserId == userInfo.userId) && scope.hasAuth==true&&
              (handleScope(scope.nodeId)==2 || handleScope(scope.nodeId)==3)
            "
          >
          <!-- v-else-if="
              (scope.businessDeptApproveUserId == userInfo.userId &&
                scope.projectState == 1303) ||
              (scope.sciTechDeptApproveUserId == userInfo.userId &&
                scope.projectState == 1304)
            " -->
            详情及审批
          </span>
          <template v-else-if="scope.hasAuth == true">
                      <span
            class="red-link-text"
            @click="updateTask(scope)"
            v-if="handleScope(scope.nodeId)==4
            "
          >
            提交完成
          </span>
          <span
            class="red-link-text"
            @click="updateTask(scope)"
            v-else
          >
            详情及审批
          </span>

          </template>
          <span class="link-text" @click="updateTask(scope)" v-else>
            查看详情
          </span>
          <span
            class="red-link-text"
            @click="removeTask(scope)"
            v-if="
              scope.applierId == userInfo.userId && scope.projectStatus != 3
            "
            v-hasPermi="['project:remove']"
          >
            删除
          </span>
        </template>
      </BztTable>

      <!-- 分页 -->
      <BztPageContrl
        :pageInfo="page"
        @page-change="pageChange"
        @size-change="sizeChange"
      />
    </div>

    <!-- 购置申请  -->
    <BztDialog
      v-if="dialogPurchase.visible == true"
      :dialogInfo="dialogPurchase"
      @close="closedialogPurchase"
    >
      <template slot="body">
        <!-- <el-form
          label-width="100px"
          :model="purchaseStd"
          :rules="purchaseStdRules"
          ref="purchaseStdForm"
        >
          <el-form-item label="标准名称" prop="stdName">
            <el-input v-model="purchaseStd.stdName" />
          </el-form-item>
          <el-form-item label="标准编号" prop="stdNo">
            <el-input v-model="purchaseStd.stdNo" />
          </el-form-item>
          <el-form-item label="购买理由">
            <el-input
              type="textarea"
              :rows="2"
              v-model="purchaseStd.applyReason"
            />
          </el-form-item>
        </el-form> -->
        <div style="width: 100%; height: 40px">
          <button
            class="submit-btn"
            @click="addStd()"
            style="float: right; margin-bottom: 8px"
          >
            <!-- v-if="hasPermission('stdLiaison')" -->
            <i class="el-icon-plus" />
            添加标准
          </button>
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
          @applyReasonChange="stdValChange($event, 'applyReason')"
          @stdNameChange="stdValChange($event, 'stdName')"
          @stdNoChange="stdValChange($event, 'stdNo')"
        >
          <template slot="removeStd" slot-scope="{ scope }">
            <span class="red-link-text" @click="removeStd(scope)"> 删除 </span>
          </template>
        </BztTable>
      </template>
    </BztDialog>


    <!-- 年度购置清单  -->
    <BztDialog
      v-if="dialogYear.visible == true"
      :dialogInfo="dialogYear"
      @close="dialogYear.visible = false"
    >
      <template slot="body">
        <SearchByYear/>
      </template>
    </BztDialog>
  </div>
</template>
<script>
import {
  BztSearch,
  BztTable,
  BztPageContrl,
  BztDialog,
} from "@components/basicCom/index.js";
import applyStdPurchase from "./stdPurchaseUpdate.vue";
import Api from "@api/process";
import cgApi from "@api/infoModule";
import { mapGetters } from "vuex";
import SearchByYear from './components/searchByYear.vue';
const stdItem = {
  type: 1,
  stdName: "",
  stdNo: "",
  stdId: null,
  applyReason: "",
  std: null,
};
export default {
  computed: {
    ...mapGetters(["userInfo"]),
  },
  components: {
    BztSearch,
    BztTable,
    BztPageContrl,
    applyStdPurchase,
    BztDialog,
    SearchByYear,
  },
  name: "std-purchase",
  dicts: ["task_status", "std_purchase_nodes"],
  data() {
    return {
      dialogPurchase: {
        visible: false,
        title: "购置申请",
        width: "1000px",
        loadding: false,
        footer: true,
      },
      dialogYear: {
        visible: false,
        title: "年度购置清单",
        width: "1200px",
        loadding: false,
      },
      purchaseStdRules: {
        stdName: [
          { required: true, message: "请输入标准名称", trigger: "blur" },
        ],
        stdNo: [{ required: true, message: "请输入标准名称", trigger: "blur" }],
      },
      isTabLoading: false,
      searchInfo: {},
      tabClums: [
        {
          title: "项目名称",
          key: "projectName",
          minWidth: "180",
        },
        {
          title: "部门",
          key: "applyDeptId",
          minWidth: "160",
          filter: {
            type: "dept",
          },
        },
        {
          title: "项目申请人",
          key: "applierId",
          minWidth: "160",
          filter: {
            type: "user",
          },
        },
        {
          title: "申请时间",
          key: "createTime",
          minWidth: "160",
        },
        {
          title: "节点",
          key: "nodeName",
          minWidth: "140",
          // filter: {
          //   type: "filter",
          //   action: (data) => {
          //     let str = "";
          //     this.dict.type.std_purchase_nodes.forEach((item) => {
          //       if (Number(item.value) == data) {
          //         str = item.label;
          //       }
          //     });
          //     return str;
          //   },
          // },
        },
        {
          title: "项目状态",
          key: "projectStatus",
          width: "180",
          filter: {
            type: "filter",
            isHtml: true,
            action: (data) => {
              return this.setTaskStatusStyle(this.dict.type.task_status, data);
            },
          },
        },
      ],
      listReq: {
        applyDeptId: null,
        startTime: null,
        endtTime: null,
        projectState: null,
        pageNum: 1,
        pageSize: 10,
      },
      tabAction: [
        // { label: "查看详情", action: "checkTaskDetail" },
        { label: "删除", type: "slot", btnName: "remove" },
      ],
      stdTabAction: [{ label: "删除", type: "slot", btnName: "removeStd" }],
      list: [],
      page: {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      },
      stdPage: {
        total: 0,
        pageSize: 10000,
        pageNo: 1,
      },
      stdList: [],
      nodeKey:[],
      stdTabClums: [
        {
          title: "标准名称",
          key: "stdName",
          width: "210",
          filter: {
            type: "input",
            action: "stdNameChange",
          },
        },
        {
          title: "标准编号",
          key: "stdNo",
          width: "210",
          filter: {
            type: "input",
            action: "stdNoChange",
          },
        },
        {
          title: "购买理由",
          key: "applyReason",
          minWidth: "130",
          filter: {
            type: "input",
            action: "applyReasonChange",
          },
        },
      ],
    };
  },
  async created() {

    await this.handleInfo('dwfe.purchase.node01')
    await this.handleInfo('dwfe.purchase.node02')
    await this.handleInfo('dwfe.purchase.node03')
    await this.handleInfo('dwfe.purchase.node04')
    await this.handleInfo('dwfe.purchase.node05')
    await this.initDictData();
    await this.getList();
  },
  methods: {
    handleInfo(item){
      return new Promise((resove,reject)=>{
        this.getConfigKey(item).then((res) => {
          this.nodeKey = this.nodeKey.concat(res.msg)
          resove()
        });
      })
    },
    handleScope(nodeKey){
      return this.nodeKey.findIndex((item)=>item==nodeKey)
    },
    /**
     * 初始搜索列表化字典数据
     */
    initDictData() {
      this.searchInfo = {
        labelList: [
          { label: "部门", key: "applyDeptId", type: 5 },
          {
            label: "节点",
            key: "projectState",
            type: 2,
            options: this.dict.type.std_purchase_nodes,
            replaceField: { value: "value", label: "label" },
            multiple: false,
          },
          {
            label: "申请日期",
            key: "createTime",
            type: 3,
            formatStr: "yyyy-MM-dd",
            formatValStr: "yyyy-MM-dd",
            dateType: "datetimeRange",
          },
        ],
        btnList: [
          { label: "搜索", action: "search", type: 1 },
          { label: "重置", action: "search", type: 0 },
        ],
      };
    },
    /**
     * 切换阶段
     * @param {*} e 阶段标识
     */
    chengeTab(e) {},
    /**
     * 获取标准列表
     */
    getList() {
      Api.getPurchaseList(this.listReq).then((res) => {
        const { code, data, msg } = res;
        if (code === 200) {
          this.list = data.list;
          this.page.total = data.total;
          this.page.pageSize = this.listReq.pageSize;
          this.page.pageNo = this.listReq.pageNum;
        } else {
          this.$message.error(msg);
        }
      });
    },
    /**
     * 搜索
     * @param {object} e 搜索表单参数
     */
    searchList(e) {
      Object.keys(e).map((key) => {
        if (key == "createTime") {
          this.listReq.startTime = null;
          this.listReq.endtTime = null;
          if (e[key] != null) {
            this.listReq.startTime = e[key][0];
            this.listReq.endtTime = e[key][1];
          }
        } else {
          this.listReq[key] = e[key];
        }
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
     * 申请标准购置
     */
    applyStdNewPurchase() {
      // this.purchaseStd = {
      //   stdName: "",
      //   stdNo: "",
      //   stdId: null,
      //   applyReason: "",
      //   type: 1,
      // };
      this.stdList = [];
      this.dialogPurchase.visible = true;
    },
    /**
     * 添加购置标准（申请购置）
     */
    addStd() {
      let newItem = _.cloneDeep(stdItem);
      newItem.std = Date.now();
      this.stdList.push(newItem);
    },
    /**
     * 编辑购置标准（申请购置）
     */
    stdValChange(e, rowKey) {
      this.stdList.forEach((pro) => {
        if (pro.std == e.row.std) {
          pro[rowKey] = e.val;
        }
      });
    },
    /**
     * 移除购置标准（申请购置）
     */
    removeStd(e) {
      this.stdList.forEach((item, index) => {
        if (e.std == item.std) {
          this.stdList.splice(index, 1);
        }
      });
    },
    testStdList() {
      let pass = true;
      let str = "";
      this.stdList.forEach((item, index) => {
        if (item.stdName == "") {
          pass = false;
          str += str != "" ? ";" : "";
          str += `序号${index + 1}的标准名称不能为空`;
        }
        if (item.stdNo == "") {
          pass = false;
          str += str != "" ? ";" : "";
          str += `序号${index + 1}的标准编号不能为空`;
        }
      });
      if (pass == false) {
        this.$message.warning(str);
      }
      return pass;
    },
    /**
     * 保存（取消）申请标准购置
     */
    closedialogPurchase(e) {
      if (e == false) {
        this.dialogPurchase.visible = false;
      } else if (e == true) {
        if (this.testStdList() == true && this.stdList.length > 0) {
          this.$set(this.dialogPurchase, "loadding", true);
          Api.applyStdPurchase(this.stdList).then((res) => {
            this.$set(this.dialogPurchase, "loadding", false);
            const { code, msg } = res;
            if (code == 200) {
              this.$message.success("操作成功");
              this.stdList = [];
              this.dialogPurchase.visible = false;
            }
          });
        } else if (this.stdList.length == 0) {
          this.$message.warning("请添加标准");
        }
      }
    },
    /**
     * 查看年度标准购置清单
     */
    checkListByYear(){
      this.dialogYear.visible=true
    },
    /*
     * 申请标准购置列表
     */
    applyStdPurchase() {
      this.$router.push(`/work/stdPurchaseList/1`);
    },
    /**
     * 更新保存标准购置
     */
    updateStdPurchase() {
      this.applyStdPurchaseVisiable = false;
      this.pageChange(1);
    },
    /**
     * 删除标准购置
     * @param {*} e 要删除的标准购置信息
     */
    removeTask(e) {
      this.$confirm(`确定删除标准购置：《${e.projectName}》吗？`, "标准购置", {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
        center: true,
      })
        .then(() => {
          Api.removePurchase(e.id).then((res) => {
            const { data, code, msg } = res;
            if (code === 200) {
              this.$message.success(`已删除标准购置：${e.projectName}`);
              this.pageChange(1);
            } else {
              // this.$message.error(msg);
            }
          });
        })
        .catch(() => {});
    },
    /**
     * 修改编辑标准购置(查看标准购置详情)
     */
    updateTask(data) {
      this.$router.push(`/work/stdPurchaseDetail/${data.id}?instanceId=${data.instanceId}&nodeId=${data.nodeId}`);
    },
  },
};
</script>
<style lang="scss" scoped>
.enterprise-std {
  width: 100%;
  height: 100%;
  .enterprise-std-content {
    border: 1px solid #efefef;
    padding: 15px;
    border-radius: 0px 0px 5px 5px;
  }
}
</style>
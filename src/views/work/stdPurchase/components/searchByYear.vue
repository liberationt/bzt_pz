<template>
  <div class="enterprise-std app-container" style="padding:0">
    <!-- 内容区 -->
    <div class="enterprise-std-content">
      <!-- 搜索 -->
      <BztSearch :searchData="searchInfo" @search="searchList" />

      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="标准数量" name="first">
           <div>
            <el-table :data="list" style="width: 100%" empty-text="暂无数据">
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-table :data="scope.row.list" style="width: 100%" max-height="300" border size="mini" header-cell-class-name="std-cell" cell-class-name="std-cell">
                    <el-table-column label="标准名称" prop="docName"/>
                    <el-table-column label="标准编号" prop="docNo"/>
                    <el-table-column label="标准数量" prop="docNum"/>
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column
                label="项目名称"
                prop="projectName"/>
              <el-table-column label="申请人" >
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ getUser(scope.row.applierId) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="申请部门"
              >
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ getDept(scope.row.applyDeptId) }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <BztPageContrl
            :pageInfo="page"
            @page-change="pageChange"
            @size-change="sizeChange"
          />
        </el-tab-pane>
        <el-tab-pane label="总类数量" name="second">
          <div style="padding-bottom:20px">
            <span>标准名称总数： {{optionDataList.length?optionDataList.length:0}}</span>&nbsp;&nbsp;
            <span>标准数量总数： {{totalNum?totalNum:0}}</span>
          </div>
          <el-table :data="optionDataList" style="width: 100%" max-height="300" border size="mini" header-cell-class-name="std-cell" cell-class-name="std-cell">
            <el-table-column label="标准名称" prop="docName"/>
            <el-table-column label="标准编号" prop="docNo"/>
            <el-table-column label="标准数量" prop="docNum"/>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- <div style="padding-bottom:20px">
        <span>标准种类总数： {{optionDataList.length?optionDataList.length:0}}</span>&nbsp;&nbsp;
        <span>标准数量总数： {{totalNum?totalNum:0}}</span>
      </div>
      <el-table :data="optionDataList" style="width: 100%" max-height="300" border size="mini" header-cell-class-name="std-cell" cell-class-name="std-cell">
        <el-table-column label="标准名称" prop="docName"/>
        <el-table-column label="标准编号" prop="docNo"/>
        <el-table-column label="标准数量" prop="docNum"/>
      </el-table> -->
    </div>
  </div>
</template>
<script>
import {
  BztSearch,
  BztTable,
  BztPageContrl,
  BztDialog,
} from "@components/basicCom/index.js";
import Api from "@api/process";
import cgApi from "@api/infoModule";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["userInfo"]),
  },
  components: {
    BztSearch,
    BztTable,
    BztPageContrl,
    BztDialog,
  },
  name: "search-by-year",
  dicts: ["task_status", "std_purchase_nodes"],
  data() {
    return {
      isTabLoading: false,
      activeName:'first',
      searchInfo: {
        labelList: [
          {
            label: "申请年度",
            key: "yearTime",
            type: 3,
            formatStr: "yyyy",
            formatValStr: "yyyy",
            dateType: "year",
          },
        ],
        btnList: [
          { label: "搜索", action: "search", type: 1 },
          { label: "重置", action: "search", type: 0 },
        ],
      },
      tabClums: [
        {
          title: "项目名称",
          key: "projectName",
          minWidth: "230",
        },
        {
          title: "部门",
          key: "applyDeptId",
          width: "180",
          filter: {
            type: "dept",
          },
        },
        {
          title: "项目申请人",
          key: "applierId",
          width: "210",
          filter: {
            type: "user",
          },
        },
        {
          title: "申请时间",
          key: "createTime",
          width: "230",
        },
        {
          title: "节点",
          key: "projectState",
          width: "180",
          filter: {
            type: "filter",
            action: (data) => {
              let str = "";
              this.dict.type.std_purchase_nodes.forEach((item) => {
                if (Number(item.value) == data) {
                  str = item.label;
                }
              });
              return str;
            },
          },
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
        // projectState: 1307,
        projectStatus:3,
        yearTime:null,
        pageNum: 1,
        pageSize: 10,
      },
      listAll:{
        applyDeptId: null,
        startTime: null,
        endtTime: null,
        // projectState: 1307,
        projectStatus:3,
        yearTime:null,
        pageNum: 1,
        pageSize: 100000,
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
      optionDataList:[],
      totalNum:null
    };
  },
  mounted() {
    this.getList();
    // this.getOptionList()
  },
  methods: {
    handleClick(val){
      if(val.index==1){
        this.getOptionList()
      }
    },
    /**
     * 获取标准列表
     */
    getList() {
      Api.getPurchaseList(this.listReq).then((res) => {
        const { code, data, msg } = res;
        if (code === 200) {
          this.list = data.list.filter(item=>{
            let newItem = item
            newItem['list'] = item.docEntry=="" ||item.docEntry==null?[]:JSON.parse(item.docEntry)
            return newItem
          });
          this.page.total = data.total;
          this.page.pageSize = this.listReq.pageSize;
          this.page.pageNo = this.listReq.pageNum;
        } else {
          this.$message.error(msg);
        }
      });
    },
    //标准总和
    getOptionList(){
      this.optionDataList=[]
      this.totalNum = 0
      let optionsList = []
      this.listAll.yearTime = this.listReq.yearTime
      Api.getPurchaseList(this.listAll).then((res) => {
        const { code, data, msg } = res;
        if (code === 200) {
          optionsList = data.list.filter(item=>{
            let newItem = item
            newItem['list'] = item.docEntry=="" ||item.docEntry==null?[]:JSON.parse(item.docEntry)
            return newItem
          });
          optionsList.forEach((item)=>{
            item.list.forEach((v)=>{
              this.totalNum+=v.docNum
              this.optionDataList.push(v)
            })
          })
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
      this.getOptionList()
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
     * 获取用户名
     */
    getUser(userId) {
      const sourceUserList = this.$cache.session.getJSON("sourceUserList");
      if (userId == 0) return "系统";
      const user = _.find(sourceUserList, { userId: Number(userId) });
      return user ? `${user.nickName}（${user.userName}）` : `-`;
    },
    /**
     * 获取部门名称
     */
    getDept(deptId) {
      const sourceDeptList = this.$cache.session.getJSON("sourceDeptList");

      if (deptId == null) return "—";
      const dept = _.find(sourceDeptList, { deptId: deptId });
      return dept ? dept.deptName : "-";
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
  ::v-deep .std-cell{
    color: #666666 !important;
    font-size: 13px !important;
  }
</style>
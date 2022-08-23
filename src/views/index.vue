<template>
  <div
    class="dashboard-editor-container app-container"
    style="background: #fff"
  >
    <el-row :gutter="50">
      <el-col :span="16">
        <div class="indext-title">我参与的工作</div>
        <div class="work-content">
          <template v-for="(item, index) in workList">
            <div
              :key="`work_${index}`"
              class="work-li"
              @click="toStdList(item.path)"
            >
              <img class="icon" :src="getWorkIcon(item.icon)" />
              <div class="right-content">
                <div class="work-title">
                  {{ item.title }}
                </div>
                <div class="work-num">{{ item.value.toLocaleString() }}</div>
              </div>
            </div>
          </template>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="indext-title">
          我的任务({{ taskNum }})
          <span class="link-text" @click="toTaskList(null)">查看全部</span>
        </div>
        <div class="task-content">
          <template v-for="(item, index) in taskList">
            <div
              :key="`task_${index}`"
              class="task-li"
              @click="toTaskList(item.taskType)"
            >
              <div
                class="task-title"
                :title="
                  selectDictLabel(dict.type.todo_task_type, item.taskType)
                "
              >
                {{ selectDictLabel(dict.type.todo_task_type, item.taskType) }}
              </div>
              <div class="task-num">{{ item.count }}</div>
            </div>
          </template>
        </div>
      </el-col>
    </el-row>
    <el-row style="background: #fff; margin-bottom: 32px">
      <div class="indext-title">我的收藏</div>
      <!-- 信息列表 -->
      <BztTable
        :tableData="{
          column: tabClums,
          data: list,
          action: tabAction,
          actionWidth: '210px',
        }"
        :hasIndex="true"
        :pageInfo="page"
        :isLoading="isTabLoading"
        @checkDetail="checkDetail"
        @remove="remove"
        @fileView="fileView"
      >
        <template slot="download" slot-scope="{ scope }">
          <span
            v-if="scope.stdTopical.hasFile == 1"
            class="green-link-text"
            @click="fileDownLoad(scope)"
            >下载文件
          </span>
        </template>
      </BztTable>

      <!-- 分页 -->
      <BztPageContrl
        :pageInfo="page"
        @page-change="pageChange"
        @size-change="sizeChange"
      />
    </el-row>

    <!--收藏详情  -->
    <BztDialog :dialogInfo="dialogDetailInfo" @close="closeDetail">
      <template slot="body">
        <div class="standar-detail" v-if="favoriteDetail !== null">
          <el-descriptions
            :title="null"
            :column="1"
            labelClassName="label"
            contentClassName="contents"
            :labelStyle="{ width: '80px' }"
          >
            <el-descriptions-item label="信息名称">
              {{ favoriteDetail["stdName"] || "" }}
            </el-descriptions-item>
            <el-descriptions-item label="信息编号">
              {{ favoriteDetail["stdNo"] || "" }}
            </el-descriptions-item>
            <el-descriptions-item label="发布日期">
              {{ getDate(favoriteDetail["stdPublishDate"]) }}
            </el-descriptions-item>
            <el-descriptions-item label="实施日期">
              {{ getDate(favoriteDetail["stdDoDate"]) }}
            </el-descriptions-item>

            <el-descriptions-item label="废除日期">
              {{ getDate(favoriteDetail["stdExpiredDate"]) }}
            </el-descriptions-item>

            <el-descriptions-item label="信息状态">
              {{ favoriteDetail["statusStr"] }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </template>
    </BztDialog>
  </div>
</template>

<script>
import Api from "@api/infoModule";
import taskApi from "@api/system/todoTask";
import {
  BztSearch,
  BztTable,
  BztPageContrl,
  BztDialog,
} from "@components/basicCom/index";
export default {
  name: "Index",
  dicts: ["standard_type", "standard_status", "todo_task_type"],
  components: { BztSearch, BztTable, BztPageContrl, BztDialog },
  data() {
    return {
      dialogDetailInfo: {
        visible: false,
        title: "详情",
        width: "600px",
        footer: false,
      },
      isTabLoading: false,
      tabClums: [
        {
          title: "标准编号",
          key: "stdTopical.stdNo",
          width: "230",
        },
        {
          title: "标准名称",
          key: "stdTopical.stdName",
          minWidth: "320px",
          filter: {
            type: "action",
            actionName: "pdfView",
            isHtml: true,
            action: (data, row) => {
              let str = "";
              if (data != null) {
                if (row.stdTopical.hasFile != 1) {
                  str = `<span>${data}</span>`;
                } else if (
                  row.stdTopical.stdFile.split(".")[1].indexOf("docx") != -1 &&
                  row.stdTopical.stdFile.split(".")[1].indexOf("doc") != -1
                ) {
                  const img = require(`@assets/images/doc.png`);
                  str = `<span><img src="${img}" style="width:25px;height:25px;margin-right:8px;vertical-align: middle;cursor: pointer;"/>${data}</span>`;
                } else if (
                  row.stdTopical.stdFile.split(".")[1].indexOf("docx") != -1 &&
                  row.stdTopical.stdFile.split(".")[1].indexOf("doc") != -1
                ) {
                  const img = require(`@assets/images/pdf.png`);
                  str = `<span><img src="${img}" style="width:25px;height:25px;margin-right:8px;vertical-align: middle;cursor: pointer;"/>${data}</span>`;
                } else {
                  const img = require(`@assets/images/file.png`);
                  str = `<span><img src="${img}" style="width:25px;height:25px;margin-right:8px;vertical-align: middle;cursor: pointer;"/>${data}</span>`;
                }
              }
              return str;
            },
          },
        },
        {
          title: "标准替代信息",
          key: "stdTopical.stdNameReplacedBy",
          width: "180",
        },
        {
          title: "发布时间",
          key: "stdTopical.stdPublishDate",
          width: "180",
          sortable: true,
          filter: {
            type: "filter",
            action: (data) => {
              return this.getDate(data);
            },
          },
        },
        {
          title: "实施时间",
          key: "stdTopical.stdDoDate",
          width: "160",
          filter: {
            type: "filter",
            action: (data) => {
              return this.getDate(data);
            },
          },
        },
        {
          title: "状态",
          key: "stdTopical.stdStatus",
          width: "120",
          filter: {
            type: "filter",
            action: (data) => {
              let str = "";
              this.dict.type.standard_status.forEach((item) => {
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
        pageNum: 1,
        pageSize: 10,
        favoritesId: 0,
        userId: "",
        favoritesCatalogId: null,
        businessId: null,
        businessCategory: "1",
        searchValue: null,
      },
      tabAction: [
        { label: "详情", action: "checkDetail" },
        { label: "取消收藏", action: "remove", color: "rgb(245, 154, 35)" },
        { label: "下载", type: "slot", btnName: "download" },
      ],
      list: [],
      page: {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      },
      favoriteDetail: {},
      taskNum: 0,
      taskList: [
        {
          title: "内部立项任务",
          taskType: 1,
          count: 0,
        },
        {
          title: "外部立项任务",
          taskType: 2,
          count: 0,
        },
        {
          title: "内部制修订任务",
          taskType: 4,
          count: 0,
        },
        {
          title: "外部制修订任务",
          taskType: 5,
          count: 0,
        },
      ],
      workList: {
        projectApprovalCount: {
          title: "内部标准立项",
          icon: "icon-1.png",
          path: "/work/enterpriseStdRevise/10/null",
          value: 0,
        },
        projectScplatCount: {
          title: "内部标准制修订",
          icon: "icon-2.png",
          path: "/work/enterpriseStdRevise/20/null",
          value: 0,
        },
        reApproveCount: {
          title: "内部标准复审",
          icon: "icon-3.png",
          path: "/work/enterReview",
          value: 0,
        },
        externalProjectApprovalCount: {
          title: "外部标准立项",
          icon: "icon-4.png",
          path: "/work/externalStdRevise/10/null",
          value: 0,
        },
        externalProjectScplatCount: {
          title: "外部标准制修订",
          icon: "icon-5.png",
          path: "/work/externalStdRevise/20/null",
          value: 0,
        },
        // purchaseCount: {
        //   title: "外部标准复审",
        //   icon: "icon-6.png",
        //   path: "",
        //   value: 0,
        // },
        externalConsultation: {
          title: "外部征求意见",
          icon: "icon-7.png",
          path: "/work/externalConsultation",
          value: 0,
        },
        // performSuperviseCount: {
        //   title: "内部标准实施监督",
        //   icon: "icon-8.svg",
        //   path: "",
        //   value: 0,
        // },
        // externalPerformSuperviseCount: {
        //   title: "外部标准实施监督",
        //   icon: "icon-9.svg",
        //   path: "",
        //   value: 0,
        // },
      },
    };
  },
  created() {
    this.getList();
    this.getTypeCount();
    this.getMyWork();
  },
  methods: {
    /**
     * 获取我的工作图标
     */
    getWorkIcon(icon) {
      return require(`@assets/images/work/${icon}`);
    },
    /**
     * 获取我的任务数
     */
    getTypeCount() {
      taskApi.getTypeCount().then((res) => {
        const { code, data, msg } = res;
        if (code === 200) {
          // this.taskList = data;
          this.taskNum = 0;
          data.forEach((t) => {
            this.taskList.forEach((item) => {
              if (item.taskType == t.taskType) {
                item.count = t.count;
              }
            });
            this.taskNum = this.taskNum + t.count;
          });
        } else {
          // this.$message.error(msg);
        }
      });
    },
    /**
     * 我参与的工作
     */
    getMyWork() {
      Api.getMyWork().then((res) => {
        const { code, msg, data } = res;
        if (code === 200) {
          Object.keys(this.workList).map((key) => {
            if (data[key]) {
              this.workList[key].value = data[key];
            }
          });
        } else {
          // this.$message.error(msg);
        }
      });
    },
    /**
     * 我的待办
     * @param {*} type 任务类型标识
     */
    toTaskList(type) {
      if (type == null) {
        this.$router.push("/maintenance/task");
      } else {
        this.$router.push({ path: "/maintenance/task", query: { type: type } });
      }
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
     * 获取收藏列表
     */
    getList() {
      this.isTabLoading = true;
      this.listReq.userId = this.$store.state.userId;
      Api.getFavoritesList(this.listReq).then((res) => {
        const { code, msg, data } = res;
        if (code === 200) {
          this.list = data.list;
          this.page.total = data.total;
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
      this.favoriteDetail = e.stdTopical;

      this.dialogDetailInfo.title = `标准： [ ${e.stdTopical.stdName} ] 详情`;
    },
    /**
     * 关闭详情弹框
     */
    closeDetail() {
      this.dialogDetailInfo.visible = false;
      this.favoriteDetail = null;
    },
    /**
     * 取消收藏
     * @param {*} e 取消收藏的收藏信息
     */
    remove(e) {
      this.$confirm(
        `确定取消收藏：《${e.stdTopical.stdName}》吗？`,
        "取消收藏",
        {
          confirmButtonText: "取消收藏",
          cancelButtonText: "取消",
          center: true,
        }
      )
        .then(() => {
          const req = {
            category: 1,
            businessIds: [e.businessId],
          };
          Api.removeFavority(req).then((res) => {
            const { data, code, msg } = res;
            if (code === 200) {
              this.$message.success("已取消收藏");
              this.pageChange(1);
            } else {
              // this.$message.error(msg);
            }
          });
        })
        .catch(() => {});
    },
    /**
     * 我参与的工作列表
     * @params {*} path:我的工作列表
     */
    toStdList(path) {
      if (path != "") {
        this.$router.push(path);
      }
    },
    /**
     * 下载文件
     * @param {*} 要下载的文件信息
     */
    fileDownLoad(data) {
      if (data.hasFile == 1) {
        const fileName = `${data.stdTopical.stdName}.${
          data.stdTopical.stdFile.split(".")[1]
        }`;
        this.downLoadByURL(data.stdTopical.stdFile, `${fileName}`);
      }
    },
    /**
     * PDF预览
     * @param {*} 要预览的PDF文件信息
     */
    fileView() {
      if (data.stdFile.split(".")[1] == "pdf") {
        const url = `${process.env.VUE_APP_BASE_API}${data.stdFile}`;
        const { href } = this.$router.resolve({
          path: "/pdfView",
          query: {
            url: url,
          },
        });
        window.open(href, "_blank");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  background-color: rgb(240, 242, 245);
  position: relative;
  min-width: 1206px;
  overflow: auto;

  .indext-title {
    font-size: 16px;
    color: #333333;
    height: 20px;
    line-height: 20px;
    border-left: 3px solid $link-text-color;
    padding-left: 6px;
    margin: 15px 0px;
    .link-text {
      float: right;
      font-size: 14px;
    }
  }
  .task-content {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    .task-li {
      padding: 10px;
      min-width: 120px;
      width: calc(50% - 8px);
      height: 145px;
      margin-bottom: 15px;
      cursor: pointer;
      &:nth-child(1n) {
        background: Url("~@assets/images/task/bg-1.svg");
        background-size: 100% 100%;
        .task-num {
          background: rgb(71, 157, 238);
        }
      }
      &:nth-child(2n) {
        background: Url("~@assets/images/task/bg-2.svg");
        background-size: 100% 100%;
        margin-left: 15px;
        .task-num {
          background: rgb(112, 185, 69);
        }
      }
      &:nth-child(3n) {
        background: Url("~@assets/images/task/bg-3.svg");
        background-size: 100% 100%;
        .task-num {
          background: $yellow;
        }
      }
      &:nth-child(4n) {
        background: Url("~@assets/images/task/bg-4.svg");
        background-size: 100% 100%;
        .task-num {
          background: $red;
        }
      }
      .task-title {
        line-height: 40px;
        height: 40px;
        color: $white;
        text-align: center;
        border-bottom: 1px dashed $white;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .task-num {
        margin: auto;
        color: $white;
        width: 60px;
        height: 60px;
        line-height: 50px;
        text-align: center;
        border: 5px solid $white;
        border-radius: 50%;
        margin-top: 15px;
        color: #333333;
        cursor: pointer;
        &:hover {
          opacity: 0.9;
        }
      }
    }
  }
  .work-content {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    // justify-content: space-between;
    .work-li {
      width: 30%;
      height: 85px;
      border: 1px solid rgba(233, 233, 233, 1);
      border-radius: 8px;
      color: $bule;
      padding: 15px;
      margin-bottom: 15px;
      vertical-align: middle;
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-right: 20px;
      cursor: pointer;
      .icon {
        float: left;
        width: 42px;
        height: 42px;
        vertical-align: middle;
        margin-right: 18px;
      }
      .right-content {
        display: flex;
        flex-direction: column;
        .work-title {
          margin-bottom: 15px;
        }
        .work-num {
          color: #333333;
          font-size: 20px;
          text-align: center;
        }
      }
      &:hover {
        opacity: 0.9;
      }
    }
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
    font-size: 18px;
  }
}
</style>

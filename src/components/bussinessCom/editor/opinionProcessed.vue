<template>
  <div class="opinion-processed-container">
    <div class="ol-header">
      <div class="ol-title">
        <el-divider content-position="left">意见列表</el-divider>
      </div>
      <div class="search-form">
        <el-input size="mini" v-model="queryParams.searchValue" clearable style="padding-right:10px;" placeholder="关键字"
          @keyup.enter.native="getList()" @change="getList()" />
        <el-button size="mini" icon="el-icon-refresh" @click="reset()">重置</el-button>
      </div>
      <div class="ol-form">
        <el-form :model="queryParams" :inline="true">
          <el-form-item label="排序字段">
            <el-select size="mini" style="width:100px" v-model="queryParams.orderByColumn" placeholder="排序字段"
              @change="getList()">
              <el-option v-for="item in orderByColumnOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序方式">
            <el-select size="mini" style="width:100px" v-model="queryParams.isAsc" placeholder="排序方式"
              @change="getList()">
              <el-option v-for="item in isAscOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="处理类型">
            <el-select size="mini" style="width:100px" v-model="queryParams.feedback" placeholder="处理类型"
              @change="getList()">
              <el-option :key="0" label="全部" :value="0"></el-option>
              <el-option :key="-1" label="未处理" :value="-1"></el-option>
              <el-option v-for="item in feedbackOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="修改状态">
            <el-select size="mini" style="width:100px" v-model="queryParams.isReply" placeholder="修改状态"
              @change="getList()">
              <el-option v-for="item in isReplyOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="ol-main" v-loading="searchLoading">
      <el-scrollbar class="scrollbar ver">
        <div style="padding:10px">
          <div class="ol-box" v-for="item in filterOpinionList" :key="item.scpOpinionId" >
            <div class="ol-card" :class="checkStatus(item)" @click.stop.prevnt="selectedOpinion(item)">
              <div class="ol-container">
                <div class="left">
                  <div class="ol-chapter">
                    <span>{{ item.chapter }}</span>
                    <span v-if="item.entries"> · {{ item.entries }}</span>
                    <span v-if="item.isReply == 1" style="color:#67c23a;padding-left:5px"
                      class="el-icon-check">已反馈</span>
                    <el-tag v-if="item.feedback == 1" style="margin-left:5px" type="success">采纳</el-tag>
                    <el-tag v-if="item.feedback == 2" style="margin-left:5px" type="warning">部分采纳</el-tag>
                    <el-tag v-if="item.feedback == 3" style="margin-left:5px" type="danger">
                      不采纳</el-tag>
                    <el-tag v-if="item.feedback == null" style="margin-left:5px" type="info">未处理</el-tag>
                  </div>
                  <div v-if="item.content" class="ol-content">
                    {{item.content}}
                  </div>
                  <div class="ol-comment">{{ item.comment }}</div>
                  <div class="ol-create">
                    <span>{{ item.createBy }}</span>
                    <span> / {{ item.companyName }}</span>
                  </div>
                </div>
                <div class="right">
                  <el-tooltip content="查看详情" placement="left">
                    <i class="el-icon-document" @click.stop.prevnt="openOpinionDetail(item)" />
                  </el-tooltip>
                  <el-tooltip content="修改意见处理" placement="left">
                    <i class="el-icon-edit-outline" @click.stop.prevnt="editOpinionStatus(item)" />
                  </el-tooltip>
                </div>
              </div>
            </div>
          </div>
          <div v-if="total == 0" style="color:#999;text-align:center;">未查找到意见记录</div>
        </div>
      </el-scrollbar>
    </div>

    <el-dialog title="意见详情" :visible="opinionDetail.visible" append-to-body @close="opinionDetail.visible = false"
      width="500px">
      <template v-if="opinionDetail.data">
        <div class="od-infos">
          <ul>
            <li>
              <label>章节</label>
              <span>{{opinionDetail.data.chapter}}</span>
            </li>
            <li>
              <label>条款</label>
              <span>{{opinionDetail.data.entries}}</span>
            </li>
            <li>
              <label>选择内容</label>
              <span>{{opinionDetail.data.content}}</span>
            </li>
            <li>
              <label>意见内容</label>
              <span>{{opinionDetail.data.comment}}</span>
            </li>
            <li>
              <label>提出人</label>
              <span>{{opinionDetail.data.createBy}}</span>
            </li>
            <li>
              <label>提出单位</label>
              <span>{{opinionDetail.data.companyName}}</span>
            </li>
            <li>
              <label>联系方式</label>
              <span>{{opinionDetail.data.contactInformation}}</span>
            </li>
            <li>
              <label>发表时间</label>
              <span>{{opinionDetail.data.createTime}}</span>
            </li>
            <li v-if="opinionDetail.data.status">
              <label>意见反馈</label>
              <span>{{formatStatus(opinionDetail.data)}}</span>
            </li>
            <li v-if="opinionDetail.data.status">
              <label>反馈理由</label>
              <span>{{opinionDetail.data.feedback}}</span>
            </li>
            <li v-if="opinionDetail.data.status">
              <label>备注</label>
              <span>{{opinionDetail.data.remark}}</span>
            </li>
          </ul>
        </div>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="opinionDetail.visible = false">关闭窗口</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改意见处理" :visible="editStatus.visible" append-to-body @close="editStatus.visible = false"
      width="500px">
      <template v-if="editStatus.data">
        <el-form size="mini" :model="editStatus" label-position="top" class="comment-hr">
          <el-form-item label="反馈处理" prop="feedback">
            <el-radio-group v-model="editStatus.data.feedback">
              <el-radio v-for="(item, idx) in feedbackOptions" :key="idx" :label="item.value">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item> 
          <el-form-item label="反馈理由" prop="feedbackContent">
            <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 10}" placeholder="请输入反馈理由"
              v-model="editStatus.data.feedbackContent" />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 10}" placeholder="请输入备注"
              v-model="editStatus.data.remark" />
          </el-form-item>
        </el-form>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitEditStatus">确定修改</el-button>
        <el-button size="small" @click="editStatus.visible = false">关闭窗口</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Api from "@api/process";
export default {
  name: "opinionProcessed",
  props: {
    projectData: Object,
  },
  data() {
    return {
      searchLoading: false,
      queryParams: {
        searchValue: null,
        orderByColumn: "createTime",
        isAsc: "asc",
        isReply: -1,
        feedback: 0,
      },
      total: 0,
      opinionDetail: {
        visible: false,
        data: null,
      },
      editStatus: {
        visible: false,
        data: null,
      },
      feedbackOptions: [
        { value: 1, label: "采纳" },
        { value: 2, label: "部分采纳" },
        { value: 3, label: "不采纳" },
      ],
      filterOpinionList: [],
      orderByColumnOptions: [
        { value: "createTime", label: "创建日期" },
        { value: "chapter", label: "章节" },
        { value: "createBy", label: "提出人" },
        { value: "companyName", label: "提出单位" },
      ],
      isAscOptions: [
        { value: "asc", label: "升序" },
        { value: "desc", label: "降序" },
      ],
      isReplyOptions: [
        { value: -1, label: "全部" },
        { value: 1, label: "已反馈" },
        { value: null, label: "未反馈" },
      ],
      opinionList:[],
      sourceUserList:[]
    };
  },
  methods: {
    // 重置条件
    reset() {
      this.queryParams = {
        searchValue: null,
        orderByColumn: "createTime",
        isAsc: "asc",
        isReply: -1,
        feedback: 0,
      };
      this.getList();
    },
    // 检查状态返回class
    checkStatus(item) {
      // 编写页面意见处理
      if (item.feedback == null) {
        return "info";
      } else if (item.feedback == 1) {
        return "success";
      } else if (item.feedback == 2) {
        return "warning";
      } else if (item.feedback == 3) {
        return "error";
      } else {
        return "info";
      }
    },
    // 格式化意见处理
    formatStatus(row) {
      let data = _.find(this.status, { value: row.status });
      return data ? data.label : "";
    },
    // 查询意见
    getList() {
      this.searchLoading = true;
      setTimeout(() => {
        let tempList = _.cloneDeep(this.opinionList);

        // 处理类型
        if (this.queryParams.feedback != 0) {
          if (this.queryParams.feedback != -1) {
            tempList = tempList.filter((i) => {
              return i.feedback == this.queryParams.feedback;
            });
          } else {
            tempList = tempList.filter((i) => {
              return i.feedback == null;
            });
          }
        }

        // 修改状态
        if (this.queryParams.isReply != -1) {
          tempList = tempList.filter((i) => {
            return i.isReply == this.queryParams.isReply;
          });
        }

        // 搜索关键字
        if (!_.isEmpty(this.queryParams.searchValue)) {
          tempList = tempList.filter((i) => {
            return (
              i.chapter.indexOf(this.queryParams.searchValue) > -1 ||
              (i.entries &&
                i.entries.indexOf(this.queryParams.searchValue) > -1) ||
              (i.content &&
                i.content.indexOf(this.queryParams.searchValue) > -1) ||
              i.comment.indexOf(this.queryParams.searchValue) > -1 ||
              i.createBy.indexOf(this.queryParams.searchValue) > -1 ||
              i.companyName.indexOf(this.queryParams.searchValue) > -1
            );
          });
        }

        // 排序
        tempList.sort((a, b) => {
          if (this.queryParams.isAsc == "asc") {
            return a[this.queryParams.orderByColumn].localeCompare(
              b[this.queryParams.orderByColumn]
            );
          } else {
            return b[this.queryParams.orderByColumn].localeCompare(
              a[this.queryParams.orderByColumn]
            );
          }
        });

        this.filterOpinionList = tempList;
        this.total = this.filterOpinionList.length;
        this.searchLoading = false;
      }, 500);
    },
    // 打开详情
    openOpinionDetail(data) {
      this.opinionDetail.data = _.cloneDeep(data);
      this.opinionDetail.visible = true;
    },
    // 提交状态修改
    submitEditStatus() {
      if (
        this.editStatus.data.feedback != 1 &&
        _.isEmpty(this.editStatus.data.feedbackContent)
      ) {
        this.$modal.msgWarning("部分采纳或不采纳需填写反馈理由");
        return;
      }
      let condition = {
        opinionId: this.editStatus.data.opinionId,
        isReply: 1,
        feedback: this.editStatus.data.feedback,
        feedbackContent: this.editStatus.data.feedbackContent,
        remark: this.editStatus.data.remark,
      };
      Api.updateOpinion(condition).then((response) => {
        this.$modal.msgSuccess("修改成功");
        this.editStatus.visible = false;
        this.getOpinionList();
      });
    },
    // 修改处理状态
    editOpinionStatus(data) {
      this.editStatus.data = _.cloneDeep(data);
      this.editStatus.visible = true;
    },
    // 获取意见列表
    getOpinionList(){
      const condition = {
        projectId: this.projectData.id,
        projectType: this.projectData.projectType,
        agree: 1
      }
      Api.getOpinionList(condition).then(res=>{
        this.opinionList = res.rows.map(i=>{
          let user = this.parseUser(i.createUser);
          i.companyName = user.deptName;
          i.createBy = user.nickName;
          return i;
        });
        this.getList();
      })
    },
    // 格式化用户
    parseUser(id) {
      let user = _.find(this.sourceUserList, { userId: Number(id) });
      return user;
    },
    // 选中意见
    selectedOpinion(item){
      console.info("selected opinion=>", item)
      if(item.outlineId){
        this.$emit("selected", item.outlineId);
      }
    }
  },
  created(){
    this.sourceUserList = this.$cache.session.getJSON("sourceUserList");
    this.getOpinionList();
  }
};
</script>

<style scoped lang="scss">
.opinion-processed-container {
  height: 100%;
  background: #f8f8f8;
  ::v-deep .el-divider__text {
    background: #f8f8f8;
  }
  .pagination-container {
    background: transparent;
  }
  .ol-header {
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }
  .ol-title {
    position: relative;
    display: flex;
    align-items: center;
    &::before {
      content: "";
      height: 20px;
      width: 6px;
      background-color: #8dc9e0;
      display: inline-block;
      margin-right: 15px;
    }
    ::v-deep .el-divider {
      .el-divider__text {
        font-weight: bold;
        font-size: 14px;
        color: #37768e;
      }
    }
  }
  .search-form {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }
  .ol-form {
    ::v-deep .el-form-item {
      margin-bottom: 5px;
      margin-right: 5px;
    }
  }
  .ol-main {
    height: calc(100% - 187px);
    .ol-box {
      font-size: 14px;
      border: 2px transparent solid;
      border-radius: 4px;
      margin-bottom: 20px;
      &:hover{
        cursor: pointer;
        border-radius: 4px;
        border: 2px rgba(64,158,255, 0.3) solid;
        box-shadow: 0 2px 12px 0 rgba(64,158,255, 0.3)
      }
    }

    .ol-card {
      border-style: solid;
      border-width: 0 0 0 4px;
      border-radius: 4px;
      background-color: #fff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
      position: relative;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      overflow: hidden;
      padding: 15px;

      &.error {
        border-color: #ff7a7a;
      }
      &.info {
        border-color: #aaa;
      }
      &.success {
        border-color: #67c23a;
      }
      &.full {
        border-color: #977aff;
      }
      &.warning {
        border-color: #e6a23c;
      }
      .ol-container {
        width: 100%;
        display: flex;
        flex-direction: row;
        overflow: hidden;
        .left {
          display: flex;
          flex-direction: column;
          min-width: calc(100% - 31px);
          .ol-chapter {
            color: #909399;
            margin-bottom: 8px;
            .chapter-icon {
              border-radius: 50%;
              width: 10px;
              display: inline-block;
              height: 10px;
              margin-right: 5px;
              &.error {
                background: #ff7a7a;
              }
              &.info {
                background: #aaa;
              }
              &.success {
                background: #67c23a;
              }
              &.full {
                background: #977aff;
              }
            }
          }
          .ol-content {
            line-height: 24px;
            background-color: #e8f4ff;
            border-color: #d1e9ff;
            padding: 2px 10px;
            font-size: 12px;
            color: #1890ff;
            border-width: 1px;
            border-style: solid;
            border-radius: 4px;
            margin-bottom: 8px;
          }
          .ol-comment {
            color: #303133;
            margin-bottom: 8px;
          }
          .ol-create {
            color: #909399;
            margin-bottom: 8px;
          }
        }
        .right {
          color: #909399;
          display: flex;
          box-sizing: border-box;
          justify-content: space-around;
          padding-left: 8px;
          align-items: center;
          flex-direction: column;
          i {
            cursor: pointer;
            padding: 5px;
            &:hover {
              background: #eee;
            }
          }
        }
      }
    }
  }
}
.od-infos {
  margin-bottom: 10px;
  > ul {
    list-style: none;
    padding: 0;
    > li {
      font-size: 12px;
      padding: 5px 0;
      border-bottom: 1px solid #ddd;
      > label {
        line-height: 18px;
        width: 70px;
        vertical-align: middle;
        float: left;
      }
      > span {
        margin-left: 70px;
        line-height: 18px;
        position: relative;
        display: block;
        &::before {
          display: table;
          content: "";
        }
        &::after {
          display: table;
          content: "";
          clear: both;
        }
      }
    }
  }
}

</style>
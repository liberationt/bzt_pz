<template>
  <BztDialog
    :dialogInfo="dialogInfo"
    @close="closeDialog($event)"
    :appendTobody="false"
  >
    <template slot="body">
      <!-- 内容区 -->
      <div class="std-list-content">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="处理列表" name="first">
            <BztTable
              :tableData="{
                column: tabClums,
                data: list,
                action: [],
              }"
              :hasIndex="true"
              :pageInfo="page"
              :isLoading="isTabLoading"
              @checkFile="checkFile"
            >
            </BztTable>
          </el-tab-pane>
          <el-tab-pane label="意见列表" name="second">
            <div class="tableHead">
              <div class="label">标准名称</div>
              <div>
                <el-input
                  disabled
                  v-model="stdName"
                  placeholder="请输入内容"
                  style="width: 560px"
                ></el-input>
              </div>
              <div class="label">征集意见单位</div>
              <div>
                <el-input
                  disabled
                  v-model="consultationUnit"
                  placeholder="请输入内容"
                  style="width:290px"
                ></el-input>
              </div>
            </div>
            <el-table :data="tableData" style="width: 100%">
              <el-table-column
                prop="chapterNumber"
                label="章条编号"
                width="210"
                align="center"
              >
                <template slot-scope="{ row }">
                  <el-input v-model="row.chapterNumber" disabled />
                </template>
              </el-table-column>
              <el-table-column label="意见内容" align="center">
                <el-table-column
                  prop="originalText"
                  label="原文为"
                  width="280"
                  align="center"
                >
                  <template slot-scope="{ row }">
                    <el-input v-model="row.originalText" disabled />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="updateText"
                  label="修改为"
                  width="280"
                  align="center"
                >
                  <template slot-scope="{ row }">
                    <el-input v-model="row.updateText" disabled />
                  </template>
                </el-table-column>
              </el-table-column>

              <el-table-column
                prop="nameTheUnit"
                label="提出单位"
                width="258"
                align="center"
              >
                <template slot-scope="{ row }">
                  <el-input v-model="row.nameTheUnit" disabled />
                </template>
              </el-table-column>
              <el-table-column
                prop="nameThePerson"
                label="提出人员"
                width="250"
                align="center"
              >
                <template slot-scope="{ row }">
                  <el-input v-model="row.nameThePerson" disabled />
                </template>
              </el-table-column>
              <!-- <el-table-column
                prop="handlingOpinions"
                label="处理意见"
                width="300"
                align="center"
              >
                <template slot-scope="{ row }">
                  <el-select
                    v-model="row.handlingOpinions"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in optionsList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </template>
              </el-table-column> -->
            </el-table>
          </el-tab-pane>
        </el-tabs>
        <!-- 结果列表 -->
      </div>
    </template>
  </BztDialog>
</template>
<script>
import { BztDialog, BztTable } from "@components/basicCom/index.js";
import Api from "@api/process";
import { mapGetters } from "vuex";

export default {
  name: "node-list",
  components: {
    BztDialog,
    BztTable,
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  dicts: ["external_consultation_node"],
  props: {
    visiable: {
      type: Boolean,
      default: false,
    },
    taskId: {
      type: Number,
      default: null,
    },
    row: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      activeName: "first",
      dialogInfo: {
        visible: true,
        title: "查看",
        width: "1340px",
        footer: true,
      },
      tableData: [
        {
          standardTaskId: "",
          stdName: "",
          processorTaskId: "",
          consultationUnit: "",
          chapterNumber: "",
          originalText: "",
          updateText: "",
          nameTheUnit: "",
          nameThePerson: "",
          handlingOpinions: "",
          isOpinion: "",
        },
      ],
      optionsList: [
        {
          label: "采纳",
          value: "1",
        },
        {
          label: "不采纳",
          value: "2",
        },
        {
          label: "部门采纳",
          value: "3",
        },
      ],
      stdName: "",
      consultationUnit: "",
      tabClums: [
        {
          title: "标准名称",
          key: "stdName",
          minWidth: "180",
        },
        {
          title: "处理人",
          key: "processorId",
          minWidth: "150",
          filter: {
            type: "user",
            action: (data) => this.getUserName(data),
          },
        },
        {
          title: "状态",
          key: "hasFinished",
          minWidth: "150",
          filter: {
            type: "filter",
            action: (data) => {
                return data?"已完成":'未完成'
            },
          },
        },
        {
          title: "处理角色",
          key: "processAs",
          minWidth: "200",
          filter: {
            type: "filter",
            isHtml: true,
            action: (data) => {
              let str = "";
              switch (data) {
                case 1:
                  str = "标准化业务主管";
                  break;
                case 2:
                  str = "部门标准化网员";
                  break;
                case 3:
                  str = "子公司标准化网员";
                  break;
                case 4:
                  str = "部门标准化负责人";
                  break;
                case 5:
                  str = "部门标准化处理人";
                  break;
                case 6:
                  str = "标准化业务人员";
                  break;
              }
              return str;
            },
          },
        },
        {
          title: "开始时间",
          key: "startTime",
          width: "180",
        },
        {
          title: "结束时间",
          key: "endTime",
          width: "180",
        },
        {
          title: "相关附件",
          key: "currentAttachments",
          width: "160",
          filter: {
            type: "action",
            actionName: "checkFile",
            action: (data) => {
              return data ? "下载附件" : "";
            },
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
    };
  },
  mounted() {
    this.dialogInfo.title = "项目处理详情";
    this.dialogInfo.visible = this.visiable;
    this.getList();
  },
  watch: {
    visiable: {
      handler(val) {
        this.dialogInfo.title = "项目处理详情";
        this.dialogInfo.visiable = val;
      },
    },
  },
  methods: {
    handleClick() {},
    checkFile(row) {
        const currentAttachments = JSON.parse(rows.currentAttachments)
        const fileName = currentAttachments.name
        const fileUrl = currentAttachments.url
        this.downLoadByURL(fileUrl, `${fileName}`)
    },
    /**
     * 获取结果列表
     */
    getList() {
      const req = {
        adviceTaskId: this.taskId,
      };
      const params = {
        standardTaskId: this.row.id,
      };
      this.isTabLoading = true;
      Api.queryFile(req).then((res) => {
        this.isTabLoading = false;
        const { code, data, rows, msg } = res;
        if (code === 200) {
          this.list = rows.filter(item=>item.processAs==6&&item.hasFinished===0);
        }
      });
      Api.standardTask(params).then((res) => {
        const { code, data, rows, msg } = res;
        if (code === 200) {
          this.tableData = rows;
        } else {
          // this.$message.error(msg);
        }
      });

      //   Api.getChildProcessNodes(req).then((res) => {
      //     this.isTabLoading = false;
      //     const { code, data, msg } = res;
      //     if (code === 200) {
      //       this.list = data;
      //     } else {
      //       // this.$message.error(msg);
      //     }
      //   });
    },
    /**
     * 关闭弹框
     */
    closeDialog(e) {
      this.$emit("save", null);
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
              : "-（${user.userName}）"
          );
        });
      }
      return arr.length > 0 ? arr.join("；") : "";
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
.tableHead {
  // height:44px;
  display: flex;
  padding: 10px 0;
  align-items: center;
  background: #f5f7fa;
  .label {
    width: 210px;
    text-align: center;
    font-weight: bold;
    flex-shrink: 0;
  }
}
</style>
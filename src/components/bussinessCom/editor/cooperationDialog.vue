<template>
  <div class="cooperation-dialog-container">
    <el-dialog
      title="协作分配"
      :visible.sync="dialogVisible"
      append-to-body
      width="1000px"
      class="cooperation-dialog"
    >
      <el-alert
        title="分配编写任务"
        type="info"
        description="选中右侧的一位编写人员，再勾选左侧需要编写的标准的章节，勾选完成后点击确定分配完成分配任务"
        show-icon
        :closable="false"
      >
      </el-alert>
      <div class="cooperation-content">
        <div class="left">
          <el-tree
            ref="oTree"
            :data="outlineList"
            :props="cooperationDialogProps"
            show-checkbox
            node-key="outlineId"
            @check="currentChecked"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span v-if="data.outlineCatalog && data.outlineCatalog != ''">{{
                data.appendix ? "附录" + data.letter : data.outlineCatalog
              }}</span>
              <span>{{ data.outlineTitle }}</span>
            </span>
          </el-tree>
        </div>
        <div class="right">
          <el-table
            ref="cmTable"
            size="mini"
            :data="cooperationList"
            stripe
            border
            style="width: 100%"
            @selection-change="selectTable"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column
              type="index"
              label="序号"
              width="55"
              align="center"
            />
            <el-table-column
              prop="nickName"
              sortable
              label="姓名"
              show-overflow-tooltip
            />
            <el-table-column
              prop="deptName"
              sortable
              label="部门"
              show-overflow-tooltip
            />
            <el-table-column
              prop="commitData"
              label="分配状态"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-tag v-if="scope.row.commitData != null">已分配</el-tag>
                <el-tag v-else type="danger">未分配</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="deptName" label="已分配章节" show-overflow-tooltip>
              <template slot-scope="{row}">
                <span>{{handelData(row&&row.commitData?row.commitData:'')}}</span>
              </template> 
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveCommitRecord">确定分配</el-button>
        <el-button @click="close">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listOutline,
  listCommitRecord,
  addCommitRecord,
  updateCommitRecord,
} from "@/api/editor";
import { letters } from "@/components/bussinessCom/editor/editorOptions";
export default {
  name: "cooperationDialog",
  props: {
    docId: String,
    userId: Number,
    visible: Boolean,
    memberList: Array,
    mainEditorId: Object,
  },
  data() {
    return {
      cooperationDialogProps: {
        children: "not",
        label: "outlineTitle",
      },
      // cooperationMember: [
      //   {userId:1,userName:"孙源祥",deptName:"科管部",memberType:'主编',status:1},
      //   {userId:2,userName:"张三",deptName:"科管部",memberType:'参编',status:0},
      //   {userId:3,userName:"李四",deptName:"科管部",memberType:'参编',status:0}
      // ],
      commitReloadList: [],
      currItem: null,
      currSelectedData: [],
      outlineList: [],
      outlineData: [],
      cooperationList: [],
    };
  },
  watch: {
    dialogVisible: {
      handler(dialogVisible) {
        if (dialogVisible) {
          this.getOutlineData();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("close", val);
      },
    },
  },
  methods: {
    handelData(row){
      let arr = []
      if(row&&row.outlineList.length){
        this.outlineList.forEach((item)=>{
          if(row.outlineList.split(",").indexOf(item.outlineId)!=-1){
            arr.push(item.outlineTitle)
          }
        })
      } 
      return arr.length?arr.join(","):''
    },
    close() {
      this.$emit("close");
    },
    async getOutlineData() {
      var condition = {
        docId: this.docId,
        orderByColumn: "level_num",
        isAsc: "asc",
      };
      var res = await listOutline(condition);
      if (res.code === 200 && res.rows) {
        if (res.rows.length) {
          let outlineDatas = res.rows.map((item) => {
            let data = this.$editorUtils.clearDataByField(item, [
              "commitId",
              "createTime",
              "createUser",
              "delFlag",
              "deleteTime",
              "deleteUser",
              "pageNum",
              "params",
              "remark",
              "searchValue",
              "searchValueArray",
              "updateTime",
              "updateUser",
              "pageSize",
              "orderByColumn",
              "isAsc",
            ]);
            // 附录项及附录条款
            if ([8, 9].includes(item.outlineType)) {
              data.appendix = true;
              data.letter = letters[parseInt(item.outlineCatalog) - 1];
              data.docattr = item.outlineType === 8 ? "specs" : "means";
            }
            return data;
          });
          outlineDatas = _.orderBy(
            outlineDatas,
            ["outlineType", "orderNum"],
            ["asc", "asc"]
          );
          this.outlineData = this.$editorUtils.handleTree(
            outlineDatas,
            "outlineId",
            "parentId",
            "children",
            "0"
          );
          this.setOutlineList();
        }
      }
    },
    selectTable(selection, row) {
      if (selection.length > 1) {
        let del_row = selection.shift();
        this.$refs.cmTable.toggleRowSelection(del_row, false); // 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
      }
      this.currItem = selection.length == 0 ? null : selection[0];
      this.currSelectedData = [];
      this.setOutlineList();
    },
    // 获取分配人员情况列表
    async getCooperationList() {
      let memberList = _.cloneDeep(this.memberList);
      await listCommitRecord({ docId: this.docId }).then((res2) => {
        this.commitReloadList = res2.rows;
        memberList.forEach((m) => {
          let commitData = _.find(this.commitReloadList, {
            userId: String(m.userId),
          });
          m.commitData = commitData ? commitData : null;
        });
        this.cooperationList = memberList;
      });
    },
    setOutlineList() {
      let outlineList = _.cloneDeep(this.outlineData[0].children);
      this.outlineList = outlineList;
      if (this.currItem) {
        let currOutlineIds = this.currItem.commitData
          ? this.currItem.commitData.outlineList.split(",")
          : [];
        if (currOutlineIds.length > 0) {
          this.currSelectedData = currOutlineIds
          this.$refs.oTree.setCheckedKeys(currOutlineIds);
        } else {
          this.$refs.oTree.setCheckedKeys([]);
        }
      } else {
        this.outlineList.forEach((item) => {
          item.disabled = true;
        });
        if (this.$refs.oTree) this.$refs.oTree.setCheckedKeys([]);
      }

      // 如果主编还未分配则默认主编有所有的编辑权限
      // console.info(
      //   this.mainEditorId,
      //   _.find(this.commitReloadList, {
      //     userId: String(this.mainEditorId.userId),
      //   })
      // );
      if (
        this.mainEditorId != null &&
        _.find(this.commitReloadList, {
          userId: String(this.mainEditorId.userId),
        }) == null
      ) {
        let param = {
          docId: this.docId,
          userId: this.mainEditorId.userId,
          userName: this.mainEditorId.userName,
          outlineList: this.outlineList
            .map((item) => {
              return item.outlineId;
            })
            .join(","),
          createUser: this.userId,
        };
        addCommitRecord(param).then((res) => {
          this.$modal.msgSuccess("保存成功");
          this.getCooperationList();
        });
      }
    },
    // 选中大纲
    currentChecked(nodeObj, SelectedObj) {
      this.currSelectedData = SelectedObj.checkedKeys;
    },
    // 保存分配结果
    saveCommitRecord() {
      
      if (this.currItem == null) {
        this.$message.warning("请选择要分配的参编人员");
        return;
      }
      if(!this.currSelectedData.length){
        this.$message.warning("请选择要分配章节");
        return;
      }
      if (this.currItem.commitData) {
        let param = _.cloneDeep(this.currItem.commitData);
        param.outlineList =
          this.currSelectedData.length == 0
            ? ""
            : this.currSelectedData.join(",");
        updateCommitRecord(param).then((res) => {
          this.$modal.msgSuccess("保存成功");
          this.getCooperationList();
        });
      } else {
        let param = {
          docId: this.docId,
          userId: this.currItem.userId,
          userName: this.currItem.userName,
          outlineList:
            this.currSelectedData.length == 0
              ? ""
              : this.currSelectedData.join(","),
          createUser: this.userId,
        };
        addCommitRecord(param).then((res) => {
          this.$modal.msgSuccess("保存成功");
          this.getCooperationList();
        });
      }
    },
  },
  created() {
    this.getCooperationList();
  },
  mounted() {},
};
</script>

<style scoped lang="scss">
.cooperation-dialog {
  ::v-deep .el-dialog__body {
    .cooperation-content {
      display: flex;
      height: 60vh;
      padding: 20px;
      background: #fafafa;
      border-bottom: 1px #ddd solid;
      .left {
        height: 100%;
        overflow: auto;
        padding: 10px;
        background: #fff;
        border-radius: 3px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        flex: 0 0 300px;
      }
      .right {
        height: 100%;
        flex: 1;
        margin-left: 20px;
        background: #fff;
        border-radius: 3px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        .el-table__header-wrapper .el-checkbox {
          display: none;
        }
      }
    }
  }
}
</style>
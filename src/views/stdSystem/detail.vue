<template>
  <div class="system-edit-container">
    <div class="system-main">
      <system-info
        @change="setData()"
        :isEdit="true"
        :editNodeSwitch="editNodeSwitch"
        :treeData="treeData"
        :stdSystemData="stdSystemData"
      >
        <div slot="header">
          <span>体系名称：</span>
          <el-input
            v-if="editNodeSwitch"
            size="mini"
            v-model="form.systemName"
            style="width: 250px"
          />
          <span v-else-if="stdSystemData != null">{{
            stdSystemData.systemName
          }}</span>
        </div>
        <div slot="forms">
          <div class="btns">
            <el-button
              v-if="!editNodeSwitch"
              size="mini"
              icon="el-icon-d-arrow-left"
              @click="back()"
              >返回</el-button
            >
            <el-button
              v-if="!editNodeSwitch"
              v-hasPermi="['stdSystem:node']"
              size="mini"
              style="float: right"
              type="cyan"
              icon="el-icon-s-tools"
              @click="editNodeSwitchOpen()"
              >编辑体系</el-button
            >
            <el-button
              v-if="editNodeSwitch"
              v-hasPermi="['stdSystem:node']"
              size="mini"
              style="float: right"
              icon="el-icon-close"
              @click="editNodeSwitchClose()"
              >取消编辑</el-button
            >
            <el-button
              v-if="editNodeSwitch"
              v-hasPermi="['stdSystem:node']"
              size="mini"
              style="float: right; margin-right: 10px"
              type="primary"
              icon="el-icon-upload"
              @click="saveSystemNode()"
              >保存编辑</el-button
            >
          </div>
        </div>
      </system-info>
    </div>
  </div>
</template>

<script>
import { getStdSystem } from "@/api/standard/system";
import {
  listSystemNode,
  recursionEditNodeTree,
} from "@/api/standard/systemNode";
import { countSystemBindById } from "@/api/standard/systemBind";
import { SystemInfo } from "@components/bussinessCom/index";
export default {
  name: "StdSystemDetail",
  components: {
    SystemInfo,
  },
  data() {
    return {
      // loading:true,
      systemId: null,
      form: {
        systemName: null,
      },
      // 体系节点树结构
      treeData: [],
      // 体系信息
      stdSystemData: null,
      // 绑定标准数量数据
      countDatas: [],
      // 编辑节点开关
      editNodeSwitch: false,
    };
  },
  methods: {
    setData() {
      getStdSystem(this.systemId).then((modelR) => {
        this.stdSystemData = modelR.data;
        this.form.systemName = this.stdSystemData.systemName;
        //得到 模板体系Id 查询体系
        listSystemNode(this.systemId).then((treeR) => {
          if (treeR.code === 200) {
            let treeData = treeR.data;
            // // 获取绑定标准数量
            countSystemBindById(this.systemId).then((bindR) => {
              this.countDatas = bindR.rows;
              this.setStructData(treeData);
            });
          }
        });
      });
    },
    // 解析树结构
    setStructData(treeData) {
      const parseTreeData = (data, index) => {
        if (data && data.length) {
          data.forEach((node, i) => {
            let count = this.getNodeCount(node);
            node.systemNodeId = node.systemNodeId;
            node.title = node.nodeName;
            node.subTitle = "[" + index + (i + 1) + "](" + count + ")";
            node.extend = true;
            if (node.children) {
              parseTreeData(node.children, index + (i + 1) + ".");
            }
          });
        }
      };
      treeData[0].id = treeData[0].systemNodeId;
      treeData[0].title = treeData[0].nodeName;
      parseTreeData(treeData[0].children, "1.");
      this.treeData = treeData;
    },
    getNodeCount(node) {
      let allCount = 0;

      const sumCount = (item) => {
        let count = 0;
        let nodes = _.filter(this.countDatas, {
          systemNodeId: item.systemNodeId,
        });
        if (nodes && nodes.length) {
          nodes.forEach((item) => {
            count += item.count;
          });
        }
        return count;
      };
      const parserCounts = (nodes) => {
        let count = 0;
        nodes.forEach((item) => {
          if (item.children && item.children.length) {
            count += parserCounts(item.children);
          } else {
            count += sumCount(item);
          }
        });
        return count;
      };
      if (node.children && node.children.length) {
        allCount = parserCounts(node.children);
      } else {
        allCount = sumCount(node);
      }

      return allCount;
    },
    back() {
      this.$tab.closeOpenPage("/stdSystem");
    },
    // 开启编辑节点
    editNodeSwitchOpen() {
      this.editNodeSwitch = true;
      this.$notify({
        title: "警告",
        message: "编辑模式开启",
        type: "warning",
      });
    },
    // 取消关闭编辑节点
    editNodeSwitchClose() {
      let sel = this;
      this.$confirm("确定取消编辑吗？未保存的节点将会丢失！", "确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          sel.editNodeSwitch = false;
          sel.$notify({
            title: "提示",
            message: "编辑模式关闭",
            type: "success",
          });
          sel.setData();
        })
        .catch(function () {});
    },
    // 保存体系节点
    saveSystemNode() {
      let sel = this;
      this.$confirm("确定保存体系吗？", "确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          const loading = sel.$loading({
            lock: true,
            text: "正在更新体系，请稍等片刻……",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });
          let nodeTree = _.cloneDeep(sel.treeData);
          console.info("nodeTree==>", nodeTree);
          let data = {
            systemId: sel.systemId,
            treeData: nodeTree,
            systemName: sel.form.systemName,
          };
          recursionEditNodeTree(data).then((rse) => {
            sel.$modal.msgSuccess("体系更新成功");
            sel.$notify({
              title: "提示",
              message: "节点编辑模式关闭",
              type: "success",
            });
            sel.editNodeSwitch = false;
            sel.setData();
            loading.close();
          });
        })
        .catch(function () {});
    },
  },
  created() {
    this.systemId = this.$route.params.systemId;
    this.setData();
  },
};
</script>

<style scoped lang="scss">
.system-edit-container {
  height: calc(100vh - 84px);
  .system-main {
    height: 100%;
    overflow: auto;
  }
}
</style>
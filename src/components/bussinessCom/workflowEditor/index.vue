<template>
  <div class="workflow-editor">
    <flow-editor
      v-if="flowData != null"
      :data="flowData"
      isScroller
      :flowCode="flowCode"
      isEdit
      @loaded="loadedEditor"
      @change="changeEvent"
      @close="closeEditor"
    />
  </div>
</template>

<script>
import Api from "@api/processtemp";
import {
  flowEditor,
  flowList,
  pageEditor,
  pageList,
  flowFun,
  flowDistance,
} from "samshen-editor";
import "samshen-editor/dist/samshenEditor.css";
export default {
  name: "workflow-editor",
  components: {
    flowEditor,
  },
  props: {
    flowId: null,
    flowCode: [],
  },
  data() {
    return {
      tempData: {
        apiUrl: process.env.VUE_APP_PROCESS_URL, // JAVA接口地址(目前使用：http://192.168.0.140:10084)
        nodeUrl: process.env.VUE_APP_PROCESS_NODE_URL, // NodeServer地址(目前使用：http://192.168.0.140:9292)
        author: {}, // 用户信息
        exportData: false, // 保存直接输出，不在编辑器中处理
      },
      // 分页
      pages: {
        pageNum: 0,
        pageSize: 20,
      },
      flowData: null,
      emptyData: {
        background: {
        color: '#FFF',
        image: '',
        position: 'center',
        size: 'auto',
        repeat: 'no-repeat',
        opacity: 0.2
        },
        cells: [],
        flowCode: []
    },
    };
  },
  methods: {
    async getData(flowId) {
      const req = { tempId: flowId };
      Api.getWFTemplate(req).then(async (res) => {
        const { code, data } = res;
        if (code == 200) {
          let fdata = data;
          if (!fdata.background) {
            fdata.background = {
              color: "#FFF",
              image: "",
              position: "center",
              size: "auto",
              repeat: "no-repeat",
              opacity: 0.2,
            };
          }
          if (!fdata.cells) {
            fdata.cells = [];
          }
          // 单个调用获取模板数据
          var flow = await flowFun.getTemplateData(
            fdata.id,
            this.tempData.nodeUrl
          );
          // 根据模板数据的JSON路径获取配置信息
          var flowJSON = await flowFun.getPropPath(
            flow.data.prop_path,
            this.tempData.nodeUrl
          );
            const flowData = JSON.parse(flowJSON);
          // this.flowData = _.merge({}, flowData , { ...this.tempData });
          this.flowData = Object.assign(this.emptyData, this.tempData, flowData);
        }
      });
    },
    /**
     * @description 接收列表组件的上报事件
     * @params {Object} obj
     */
    changeEvent(obj) {
      console.log(obj);
      switch (obj.act) {
        case "edit":
          // 如果流程编辑
          this.flowData = _.merge({}, obj.data, { ...this.tempData });
          // this.$storage.session.set('graphData', obj.data);
          break;
        case "save":
          console.log(obj.data);
          this.$emit("close", true);
          break;
        case "run":
          break;
        case "close":
          // this.pageData = null;
          break;
      }
    },
    /**
     * @description 新建流程模板
     */
    createNewFlow() {
      this.flowData = _.merge(
        {},
        {
          background: {
            color: "#FFF",
            image: "",
            position: "center",
            size: "auto",
            repeat: "no-repeat",
            opacity: 0.2,
          },
          cells: [],
          flowCode: this.flowCode,
        },
        { ...this.tempData }
      );
    },

    /**
     * @description 流程设计器加载完成
     */
    loadedEditor() {
      // todo something
    },
    closeEditor() {
      this.flowData = null;
      this.$emit("close", false);
      // this.$storage.session.remove('graphData');
    },
  },
  created() {
    /*var graphData = this.$storage.session.get('graphData');
        if (graphData) {
          this.flowData = graphData;
        }*/
  },
  mounted() {
    // const { id } = this.$route.params;
    // this.flowId = id ?? null;

    if (this.flowId != null) {
      this.getData(this.flowId);
    } else {
      this.flowData = {
        background: {
          color: "#FFF",
          image: "",
          position: "center",
          size: "auto",
          repeat: "no-repeat",
          opacity: 0.2,
        },
        cells: [],
        flowCode: this.flowCode,
      };
      this.createNewFlow();
    }
  },
};
</script>

<style lang="scss" scoped>
.workflow-editor {
  position: relative;
  height: 850px;
  width: 100%;
  overflow: hidden;
}
</style>
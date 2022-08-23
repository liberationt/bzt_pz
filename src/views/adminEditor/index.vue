<template>
  <div class="admin-index-container">
    <div class="tabs">
      <samTabs
        :data="templateBaseTypes"
        :tabIndex="activeTab"
        @update="updateTab"
      />
    </div>
    <div class="content">
      <component
        v-if="comp"
        :is="comp"
        :data="currData"
        :type="tempType"
        @change="chageSetting"
      />
    </div>
  </div>
</template>

<script>
import samTabs from "@/components/samTabs";
import { fontConfig, templateBaseTypes } from "@/config/editorCfg";
import * as tempComponent from "./components/index.js";
import {
  listContentTemplate,
  addContentTemplate,
  editContentTemplate,
} from "@/api/stdEditor/editor";
export default {
  name: "admin-editor-base",
  components: {
    samTabs,
  },
  computed: {
    comp() {
      return tempComponent[this.activeTab];
    },
    tempType() {
      var tempData = _.find(this.templateBaseTypes, { act: this.activeTab });
      return tempData.value || 1;
    },
    currData() {
      var tempData = _.find(this.listTemplate, { tmplType: this.activeValue });
      if (tempData) {
        return JSON.parse(tempData.content);
      }
      return null;
    },
  },

  data() {
    return {
      templateBaseTypes,
      activeTab: "font",
      activeValue: 2001,
      tableData: [...fontConfig],
      listTemplate: [],
      // currData: null,
    };
  },
  methods: {
    /**
     * @description 保存配置数据
     */
    chageSetting(data) {
      this.saveTemplate(data);
    },
    /**
     * @description 保存模板数据
     */
    async saveTemplate(data = {}) {
      var condition = {
        tmplId: this.$editorUtils.guid(),
        ...data,
      };
      // 校验是否已经存在数据
      var tempData = _.find(this.listTemplate, { tmplType: data.tmplType });
      if (tempData) {
        condition.id = tempData.id;
        condition.tmplId = tempData.tmplId;
      }
      // console.log('saveTemplate condition=>', condition);
      var res;
      if (condition.id) {
        res = await editContentTemplate(condition);
      } else {
        res = await addContentTemplate(condition);
      }
      // console.log(res);
      if (res.code === 200) {
        this.$message.success("已保存设置");
        this.listContentTemplate();
      }
    },

    /**
     * @description 切换标签
     * @param {Object} tab
     */
    updateTab(tab) {
      // this.currData = null;
      this.activeTab = tab.act;
      this.activeValue = tab.value;
      /* var tempData = _.find(this.listTemplate, { tmplType:tab.value });
                if (tempData) {
                    this.currData = JSON.parse(tempData.content);
                } */
    },

    async listContentTemplate() {
      var res = await listContentTemplate({});
      if (res.code === 200) {
        this.listTemplate = res.rows.map((item) => {
          item = this.$editorUtils.clearDataByField(item, [
            "createTime",
            "createUser",
            "delFlag",
            "deleteTime",
            "deleteUser",
            "isAsc",
            "orderByColumn",
            "pageNum",
            "pageSize",
            "params",
            "searchValue",
            "searchValueArray",
            "updateTime",
            "updateUser",
          ]);
          return item;
        });
      }
    },
  },

  created() {
    this.listContentTemplate();
  },
};
</script>

<style lang="scss" scoped>
.admin-index-container {
  height: 100%;
  padding: 10px;
  .content {
    height: calc(100% - 26px);
    overflow: auto;
  }
}
</style>

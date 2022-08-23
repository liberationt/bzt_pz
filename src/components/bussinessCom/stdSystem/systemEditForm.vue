<template>
  <div class="system-edit-form-container">
    <div style="padding: 0 20px 10px">
      <el-timeline>
        <el-timeline-item
          :timestamp="item.label"
          placement="top"
          v-for="(item, idx) in systemFormLists"
          :key="idx"
        >
          <el-card>
            <el-button
              v-if="!item.edit && isEdit"
              class="edit-btn"
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleEditForm(item)"
              v-hasPermi="['stdSystem:form']"
              >编辑</el-button
            >
            <div class="form-card">
              <div
                class="content ql-editor"
                v-if="!loading && !item.edit"
                v-html="
                  systemForm[item.name] == null || systemForm[item.name] == ''
                    ? '<span style=\'color:#C0C4CC;\'>暂无内容</span>'
                    : systemForm[item.name]
                "
              ></div>
              <div class="edit" v-else-if="!loading && item.edit">
                <editor
                  v-model="systemForm[item.name]"
                  :min-height="192"
                ></editor>
                <div style="padding: 10px">
                  <el-button
                    style="float: right"
                    size="mini"
                    type="primary"
                    icon="el-icon-upload"
                    @click="saveForm(item)"
                    >保存</el-button
                  >
                  <el-button
                    style="float: right; margin-right: 10px"
                    size="mini"
                    icon="el-icon-close"
                    @click="item.edit = !item.edit"
                    >取消</el-button
                  >
                  <div style="clear: both"></div>
                </div>
              </div>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script>
import { updateSystemForm, listSystemForm } from "@/api/standard/systemForm";
import Editor from "@/components/Editor";
const tableFormData = [
  { name: "background", label: "标准体系建设的背景", edit: false },
  {
    name: "aims",
    label: "标准体系的建设目标、构建依据及实施原则",
    edit: false,
  },
  { name: "summary", label: "国内外相关标准化情况综述", edit: false },
  { name: "basis", label: "各级子体系划分原则和依据", edit: false },
  { name: "explanation", label: "各级子体系的说明", edit: false },
  { name: "content", label: "主要内容", edit: false },
  { name: "scope", label: "范围", edit: false },
  { name: "crossOpinions", label: "与其它体系交叉情况和处理意见", edit: false },
  {
    name: "supportingOpinions",
    label: "需要其他体系协调配套的意见",
    edit: false,
  },
  {
    name: "direction",
    label:
      "结合统计表，分析现有标准与国际、国外的差距和薄弱环节，明确今后的主攻方向",
    edit: false,
  },
  { name: "proposal", label: "标准制修订规划建议", edit: false },
  { name: "other", label: "其他", edit: false },
];
export default {
  name: "systemEditForm",
  components: {
    Editor,
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
    stdSystemData: Object,
  },
  data() {
    return {
      systemForm: {},
      sourceSystemFormData: {},
      systemFormLists: _.cloneDeep(tableFormData),
      loading: true,
    };
  },
  methods: {
    async getSystemForm() {
      this.loading = true;
      this.systemForm = {};
      let response = await listSystemForm({
        systemId: this.stdSystemData.systemId,
      });
      if (response.code === 200 && response.rows.length > 0) {
        this.sourceSystemFormData = response.rows[0];
      }
      tableFormData.forEach((item) => {
        this.systemForm[item.name] = this.sourceSystemFormData
          ? this.sourceSystemFormData[item.name]
          : "";
      });
      this.loading = false;
    },
    // 编辑表单
    handleEditForm(item) {
      item.edit = true;
    },
    // 保存表单
    saveForm(item) {
      let value = this.systemForm[item.name];
      let param = {};
      param.systemFormId = this.sourceSystemFormData.systemFormId;
      param[item.name] = value;
      updateSystemForm(param).then((res) => {
        item.edit = false;
        this.$modal.msgSuccess("保存成功");
      });
    },
  },
  created() {
    this.getSystemForm();
  },
};
</script>

<style scoped lang="scss">
.system-edit-form-container {
  ::v-deep .el-card__body {
    padding: 0;
    .form-card {
      min-height: 100px;
      .content {
        padding: 15px 20px 20px 20px;
      }
      .editor {
        padding: 0 10px 10px;
      }
    }
    .edit-btn {
      position: absolute;
      top: 0px;
      right: 10px;
    }
  }
}
</style>
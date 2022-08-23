<template>
  <div class="pre-desc">
    <div
      class="operation-line"
      style="position: absolute; z-index: 1; right: 25px"
    >
      <div class="submit-btn" @click="exportPredesc()" v-if="this.formValue.id">
        <i class="el-icon-download" />
        导出编制说明
      </div>
      <div
        class="submit-btn"
        v-if="editPredesc === false && showEditBtn() === true"
        @click="editPredesc = true"
      >
        <i class="el-icon-edit-outline" />
        编辑
      </div>
      <template v-if="editPredesc == true && showEditBtn() === true">
        <div class="submit-btn" @click="save()">保存</div>
        <div class="cancelBtn" @click="editPredesc = false">取消</div>
      </template>
    </div>
    <el-steps :active="null" class="pre-desc-step" direction="vertical">
      <el-step>
        <template slot="icon">
          <img src="@assets/images/task/point.svg" />
        </template>
        <template slot="title">
          <div class="pre-desc-title">一、工作简况</div>
          <TinymceEditor
            editorName="workBrief"
            :cur-value="formValue.scpStdComment.workBrief"
            v-model="formValue.scpStdComment.workBrief"
            :height="'360px'"
            v-if="isEdit == true || editPredesc == true"
          />
          <div
            v-else
            style="width: 100%; height: 260px; overflow: auto"
            v-html="formValue.scpStdComment.workBrief"
          ></div>
        </template>
      </el-step>
      <el-step>
        <template slot="icon">
          <img src="@assets/images/task/point.svg" />
        </template>
        <template slot="title">
          <div class="pre-desc-title">二、编制原则</div>
          <TinymceEditor
            editorName="scplatPrinciple"
            :cur-value="formValue.scpStdComment.scplatPrinciple"
            v-model="formValue.scpStdComment.scplatPrinciple"
            :height="'260px'"
            v-if="isEdit == true || editPredesc == true"
          />
          <div
            v-else
            style="width: 100%; height: 260px; overflow: auto"
            v-html="formValue.scpStdComment.scplatPrinciple"
          ></div>
        </template>
      </el-step>
      <el-step>
        <template slot="icon">
          <img src="@assets/images/task/point.svg" />
        </template>
        <template slot="title">
          <div class="pre-desc-title">三、主要内容</div>
          <TinymceEditor
            editorName="mainContent"
            :cur-value="formValue.scpStdComment.mainContent"
            v-model="formValue.scpStdComment.mainContent"
            :height="'460px'"
            v-if="isEdit == true || editPredesc == true"
          />
          <div
            v-else
            style="width: 100%; height: 260px; overflow: auto"
            v-html="formValue.scpStdComment.mainContent"
          ></div>
        </template>
      </el-step>
      <el-step>
        <template slot="icon">
          <img src="@assets/images/task/point.svg" />
        </template>
        <template slot="title">
          <div class="pre-desc-title">四、关键指标的确定</div>
          <TinymceEditor
            editorName="keyIndicator"
            :cur-value="formValue.scpStdComment.keyIndicator"
            v-model="formValue.scpStdComment.keyIndicator"
            :height="'360px'"
            v-if="isEdit == true || editPredesc == true"
          />
          <div
            v-else
            style="width: 100%; height: 260px; overflow: auto"
            v-html="formValue.scpStdComment.keyIndicator"
          ></div>
        </template>
      </el-step>
      <el-step>
        <template slot="icon">
          <img src="@assets/images/task/point.svg" />
        </template>
        <template slot="title">
          <div class="pre-desc-title">五、采标情况</div>
          <TinymceEditor
            editorName="internationStandardAdopt"
            :cur-value="formValue.scpStdComment.internationStandardAdopt"
            v-model="formValue.scpStdComment.internationStandardAdopt"
            :height="'160px'"
            v-if="isEdit == true || editPredesc == true"
          />
          <div
            v-else
            style="width: 100%; height: 260px; overflow: auto"
            v-html="formValue.scpStdComment.internationStandardAdopt"
          ></div>
        </template>
      </el-step>
      <el-step>
        <template slot="icon">
          <img src="@assets/images/task/point.svg" />
        </template>
        <template slot="title">
          <div class="pre-desc-title">六、有无重大分歧意见</div>
          <TinymceEditor
            editorName="bigIssues"
            :cur-value="formValue.scpStdComment.bigIssues"
            v-model="formValue.scpStdComment.bigIssues"
            :height="'160px'"
            v-if="isEdit == true || editPredesc == true"
          />
          <div
            v-else
            style="width: 100%; height: 260px; overflow: auto"
            v-html="formValue.scpStdComment.bigIssues"
          ></div>
        </template>
      </el-step>
      <el-step>
        <template slot="icon">
          <img src="@assets/images/task/point.svg" />
        </template>
        <template slot="title">
          <div class="pre-desc-title">七、其他应予说明事项</div>
          <TinymceEditor
            editorName="otherItemsToBeComment"
            :cur-value="formValue.scpStdComment.otherItemsToBeComment"
            v-model="formValue.scpStdComment.otherItemsToBeComment"
            :height="'160px'"
            v-if="isEdit == true || editPredesc == true"
          />
          <div
            v-else
            style="width: 100%; height: 260px; overflow: auto"
            v-html="formValue.scpStdComment.otherItemsToBeComment"
          ></div>
        </template>
      </el-step>
    </el-steps>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "pro-info",
  dicts: ["revision_mode"],
  computed: {
    ...mapGetters(["userInfo"]),
  },
  props: {
    formValue: {
      type: Object,
      default: null,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    formValue: {
      deep: true,
      handler(val) {
        this.$emit("value-change", val);
      },
    },
  },
  data() {
    return {
      editPredesc: false,
    };
  },
  mounted() {},
  methods: {
    /**
     * 是否显示编辑按钮
     */
    showEditBtn() {
      let show = false;
      if (
        this.formValue.foundationProjectId != null &&
        this.formValue.applyUser == this.userInfo.userId
      ) {
        if (this.formValue.projectPhase != 10) {
          show = true;
        }
      }
      if (
        this.formValue.foundationProjectId == null &&
        this.formValue.mainEditorId == this.userInfo.userId
      ) {
        if (this.formValue.projectPhase != 10) {
          show = true;
        }
      }
      return show;
    },
    save() {
      this.editPredesc = false;
      this.$emit("updateDetail", this.formValue);
    },
    /**
     * 导出编制说明
     */
    exportPredesc() {
      this.$confirm(
        `确定导出项目《${this.formValue.projectName}》的编制说明？`,
        "编制说明",
        {
          confirmButtonText: "确定导出",
          cancelButtonText: "取消",
          center: true,
        }
      )
        .then(() => {
          const req = {
            // isTemplate: e,
            // projectState: this.listReq.projectState,
            // projectType: 1,
          };
          this.downloadByPost(
            "/scplat/projectApproval/exportStdComment",
            { businessId: this.formValue.id },
            `《${this.formValue.projectName}》的编制说明.doc`
          );
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang="scss" scoped>
.pre-desc {
  margin-top: 15px;
  padding: 15px;
}
::v-deep .pre-desc-step {
  .el-step {
    color: #333333;
    .el-step__head {
      .el-step__icon {
        border: 0 !important;
      }
      .el-step__line {
        background: transparent;
        border-left: 1px dashed $grey;
      }
    }
    .el-step__title {
      color: #333333 !important;
      .pre-desc-title {
        line-height: 40px;
        margin-bottom: 10px;
      }
    }
  }
}
</style>
<template>
  <div class="code-editor">
    <BztDialog :dialogInfo="dialogInfo" @close="close" :appendTobody="false">
      <template slot="body">
        <el-form
          :model="codeForm"
          :rules="rules"
          ref="codeForm"
          label-suffix=":"
          label-width="100px"
          class="codeForm"
        >
          <el-form-item label="Code名称" prop="codeName">
            <sapn v-if="type == 2">{{ codeForm.codeName }}</sapn>
            <el-input v-else type="input" v-model="codeForm.codeName" />
          </el-form-item>
          <el-form-item
            label="Code内容"
            prop="code"
            v-show="type == 2 || isEdit == false"
          >
            <JavaEditor
              ref="editors"
              :content="codeForm.code"
              :readOnly="true"
              :theme="'crimson_editor'"
              @change="codeChange"
            />
          </el-form-item>
          <el-form-item
            label="Code内容"
            prop="code"
            v-show="type != 2 && isEdit == true"
          >
            <JavaEditor
              ref="editors"
              :content="codeForm.code"
              :theme="'crimson_editor'"
              @change="codeChange"
            />
          </el-form-item>
        </el-form>
      </template>
      <template slot="footer">
        <div class="footer">
          <!-- <div class="cancelBtn" @click="close(false)">取消</div> -->
          <el-button
            v-if="isEdit == true && type != 2"
            class="submit-btn"
            @click="saveApi()"
            :loading="isLoading"
          >
            保存
          </el-button>
          <template v-else>
            <el-button class="submit-btn" v-if="type != 2" @click="editCode()">
              编辑
            </el-button>
            <el-button
              class="submit-btn"
              @click="runApiCode()"
              :loading="isLoading"
            >
              运行
            </el-button>
          </template>
        </div>
      </template>
    </BztDialog>

    <!-- 运行Api -->
    <RunApiCode
      v-if="runVisiable == true"
      :visiable="runVisiable"
      :codeId="codeForm.codeId"
      :title="`运行API【${codeForm.codeName}】`"
      @close="runVisiable = false"
    />
  </div>
</template>
<script>
import { BztDialog, JavaEditor } from "@components/basicCom/index";
import Api from "@api/processtemp";
import RunApiCode from "./runApiCode.vue";

const codeForm = {
  codeId: null,
  code: "",
  codeName: "",
};
export default {
  name: "code-editor",
  components: { BztDialog, JavaEditor, RunApiCode },
  props: {
    visiable: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "添加Code",
    },
    codeDetail: {
      type: Object,
      default: null,
    },
    type: {
      type: Number,
      default: 0, // 0:新增，1：编辑，2：查看详情
    },
  },
  data() {
    return {
      dialogInfo: {
        visible: false,
        title: "添加CODE",
        width: "900px",
        footer: false,
      },
      codeForm: this.deepClone(codeForm),
      isLoading: false,
      rules: {
        codeName: {
          required: true,
          message: "请输入Code名称",
          trigger: "blur",
        },
        code: {
          required: true,
          message: "请输入Code内容",
          trigger: "blur",
        },
      },
      isEdit: true,
      runVisiable: false,
    };
  },
  mounted() {
    this.dialogInfo.visible = this.visiable;
    this.dialogInfo.title = this.title;
    this.codeForm = this.deepClone(codeForm);
    if (this.codeDetail != null) {
      Object.keys(this.codeForm).map((key) => {
        this.codeForm[key] = this.codeDetail[key];
      });
      this.getCodeInfo();
    }
    if (this.type != 2) {
    }
  },
  methods: {
    /**
     * 获取CODE数据详情
     */
    getCodeInfo() {
      Api.getCode(this.codeDetail.codeId).then((res) => {
        const { code, data } = res;
        if (code == 200) {
          this.codeForm.code = data;
        }
      });
    },
    /**
     *保存数据
     */
    saveData() {},
    /**
     * 关闭/保存 弹框
     * @param e {boolen} false:关闭弹框，true：保存数据并关闭弹框
     */
    close(e) {
      if (e == true) {
        this.saveData();
      } else {
        this.dialogInfo.visible = false;
        this.$emit("close", false);
      }
    },
    codeChange(e) {
      this.codeForm.code = e;
    },
    async saveApi() {
      this.isLoading = true;
      if (this.codeForm.codeId != null) {
        Api.editApiCode(this.codeForm).then((res) => {
          const { code, msg } = res;
          if (code == 200) {
            this.$message.success("操作成功");
            this.isEdit = false;
            this.$emit("save", true);
          }
        });
        this.isLoading = false;
      } else {
        await Api.addApiCode(this.codeForm).then((res) => {
          const { code, msg, data } = res;
          if (code == 200) {
            this.$message.success("操作成功");
            this.codeForm.codeId = data;
            this.isEdit = false;
            this.$emit("save", true);
          }
        });
        this.$set(this, "isLoading", false);
        this.isLoading = false;
      }
    },
    /**
     * 编辑ApiCode
     */
    editCode() {
      this.isEdit = true;
    },
    /**
     * 运行代码
     */
    runApiCode() {
      this.runVisiable = true;
    },
  },
};
</script>
<style lang="scss" scoped>
.footer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 25px;
}
.codemirror {
  height: 450px !important;
}
</style>
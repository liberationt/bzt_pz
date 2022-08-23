<template>
  <BztDialog :dialogInfo="dialogInfo" @close="close" :appendTobody="false">
    <template slot="body">
      <el-form
        :model="runApiCodeForm"
        ref="runApiCodeForm"
        label-suffix=":"
        label-width="100px"
        class="runApiCodeForm"
      >
        <el-form-item label="是否打印日志">
          <el-radio-group v-model="runApiCodeForm.printCode">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="参数列表" class="params">
          <template v-for="(item, index) in paramsList">
            <div :key="`param_${index}`" class="params-li">
              <div class="params-li-input">
                参数名：<el-input type="input" v-model="item.key" />
              </div>
              <div class="params-li-input">
                参数类型：
                <el-select
                  v-model="item.type"
                  placeholder="请选择"
                  @change="item.value = null"
                >
                  <el-option
                    v-for="item in typeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <div class="params-li-input">
                参数值：
                <el-input
                  v-if="item.type == 0"
                  type="input"
                  v-model="item.value"
                />
                <!-- <el-input
                  v-if="item.type == 1"
                  type="number"
                  v-model="item.value"
                /> -->
                <el-input-number
                  v-if="item.type == 1"
                  v-model="item.value"
                  :min="-9999999999999999999999"
                  :max="9999999999999999999999"
                  label="描述文字"
                />
                <el-radio-group v-model="item.value" v-if="item.type == 2">
                  <el-radio :label="true">true</el-radio>
                  <el-radio :label="false">false</el-radio>
                </el-radio-group>
              </div>
              <span
                class="red-link-text remove"
                v-if="paramsList.length - 1 > index"
                @click="removeParam(index)"
              >
                移除参数
              </span>
              <span v-else class="link-text add" @click="addParam()">
                添加参数
              </span>
            </div>
          </template>
        </el-form-item>

        <el-form-item label="运行结果">
          <JsonEditor :content="runData" :theme="'crimson_editor'" />
        </el-form-item>
      </el-form>
    </template>
    <template slot="footer">
      <div class="footer">
        <el-button
          class="submit-btn"
          @click="runApiCode()"
          :loading="isLoading"
        >
          运行
        </el-button>
      </div>
    </template>
  </BztDialog>
</template>
<script>
import { BztDialog, JsonEditor } from "@components/basicCom/index";
import Api from "@api/processtemp";

const runApiCodeForm = {
  codeId: null,
  printCode: true,
  callParams: {},
};

const param = {
  key: "",
  type: 0,
  value: "",
};
const options = [
  {
    label: "字符串",
    value: 0,
  },
  {
    label: "数字",
    value: 1,
  },
  {
    label: "布尔",
    value: 2,
  },
];
export default {
  name: "run-api-code",
  components: { BztDialog, JsonEditor },
  props: {
    visiable: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "运行Api",
    },
    codeId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      dialogInfo: {
        visible: false,
        title: "运行Api",
        width: "1000px",
        footer: false,
      },
      runApiCodeForm: this.deepClone(runApiCodeForm),
      isLoading: false,
      paramsList: [],
      runData: null,
      typeList: options,
    };
  },
  mounted() {
    this.dialogInfo.visible = this.visiable;
    this.dialogInfo.title = this.title;
    this.runApiCodeForm.codeId = this.codeId;
    this.paramsList.push(this.deepClone(param));
  },
  methods: {
    /**
     * 添加参数
     */
    addParam() {
      this.paramsList.push(this.deepClone(param));
    },
    /**
     * 移除参数
     */
    removeParam(index) {
      this.paramsList.splice(index, 1);
    },
    close(e) {
      this.dialogInfo.visible = false;
      this.$emit("close", null);
    },
    /**
     * 运行代码
     */
    runApiCode() {
      this.runApiCodeForm.callParams = {};
      this.paramsList.forEach((item) => {
        if (item.key != "") {
          this.runApiCodeForm.callParams[item.key] = item.value;
        }
      });
      Api.runApiCode(this.runApiCodeForm).then((res) => {
        const { code, msg, data } = res;
        if (code == 200) {
          this.runData = JSON.stringify(data, null, 2);
        }
      });
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
::v-deep .params {
  .add {
    position: relative;
    margin: 10px auto;
    width: 100px;
    overflow: hidden;
    text-align: center;
  }
  .params-li {
    margin-bottom: 8px;
    .params-li-input {
      width: 250px;
      float: left;
      .el-input,
      .el-select,
      .el-input-number {
        width: 160px;
        height: 28px;
        // line-height: 28px;
      }
    }
  }
}
</style>
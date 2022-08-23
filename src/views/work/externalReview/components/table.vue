<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column type="index" width="50"></el-table-column>
    <el-table-column prop="stdName" label="审核结论" min-width="400" align="center" v-if="taskState==15002">
      <template slot-scope="{ row }">
        <div style="display:flex;flex-wrap:nowrap;align-items:center">
        <el-radio-group v-model="row.state">
          <el-radio :label="1">通过</el-radio>
          <el-radio :label="2">不通过</el-radio>
        </el-radio-group>
        <el-input
          v-if="row.state==2"
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="row.reviseReasion"
          style="width:200px;margin-left:20px"
        >
        </el-input>
        </div>
      </template>
    </el-table-column>
    <!-- <el-table-column prop="stdNo" label="理由 " width="240" align="center">
      <template slot-scope="{ row }">
        <el-input
          v-if="row.radio==2"
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="row.textarea"
        >
        </el-input>
      </template>
    </el-table-column> -->

    <el-table-column prop="stdNo" label="标准编号 " width="150" align="center">
      <template slot-scope="{ row }">
        {{row.disabled?'11':'22'}}
      </template>
    </el-table-column>
    <el-table-column prop="stdName" label="标准名称" width="150" align="center">
    </el-table-column>

    <el-table-column
      prop="isRelevant"
      label="是否与本企业有关"
      width="100"
      align="center"
    >
      <template slot-scope="{ row }">
        <el-select
          :disabled="disabled|| row.disabled"
          v-model="row.isRelevant"
          placeholder="请选择"
        >
          <el-option label="是" :value="0">是</el-option>
          <el-option label="否" :value="1">否</el-option>
        </el-select>
      </template>
    </el-table-column>

    <el-table-column label="成员企业标准复审情况" align="center">
      <el-table-column
        prop="conclusion"
        label="复审结论建议"
        width="120"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-select
            v-model="row.conclusion"
            :disabled="row.isRelevant == 1 || disabled|| row.disabled"
            placeholder="请选择"
          >
            <el-option label="继续有效" :value="0"></el-option>
            <el-option label="修订" :value="1"></el-option>
            <el-option label="废止" :value="2">废止</el-option>
          </el-select>
        </template>
      </el-table-column>

      <el-table-column
        prop="reason"
        label="请具体说明标准废止或修订及修改的原因"
        width="240"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-input
            type="textarea"
            :disabled="row.isRelevant == 1 || row.conclusion == 0 || disabled ||row.disabled"
            :rows="2"
            placeholder="请输入内容"
            maxlength="150"
            show-word-limit
            v-model="row.reason"
          />
        </template>
      </el-table-column>
    </el-table-column>

    <el-table-column
      label="废止原因（如有下列情况请在相应项目下打“√”）"
      align="center"
    >
      <el-table-column
        prop="10"
        label="该标准被其他标准代替"
        width="120"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-checkbox
            :disabled="row.isRelevant == 1 || row.conclusion != 2 || disabled || row.disabled"
            v-model="row[10]"
          ></el-checkbox>
          <!-- <el-checkbox-group :disabled="row.isRelevant==2||row.conclusion!=2" v-model="checkList">
            <el-checkbox value="10"></el-checkbox>
            </el-checkbox-group> -->
        </template>
      </el-table-column>
      <el-table-column label="该标准已不再使用" prop="11" align="center">
        <template slot-scope="{ row }">
          <el-checkbox
            :disabled="row.isRelevant == 1 || row.conclusion != 2 || disabled || row.disabled"
            v-model="row[11]"
          ></el-checkbox>
        </template>
      </el-table-column>
    </el-table-column>

    <el-table-column
      label="修订（修改）原因（如有下列情况请在相应项目下打“√”）"
      align="center"
    >
      <el-table-column
        prop="20"
        label="标准中的技术要求及试验方法等规定不适用"
        width="160"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-checkbox
            :disabled="row.isRelevant == 1 || row.conclusion != 1 || disabled || row.disabled"
            v-model="row[20]"
          ></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column
        prop="21"
        label="标准需扩大范围，纳入新内容（新产品、新技术、新方法等）"
        width="220"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-checkbox
            :disabled="row.isRelevant == 2 || row.conclusion != 1 || disabled || row.disabled"
            v-model="row[21]"
          ></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column
        prop="22"
        label="包含专利或其他不必要的门槛限制"
        width="140"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-checkbox
            :disabled="row.isRelevant == 1 || row.conclusion != 1 || disabled || row.disabled"
            v-model="row[22]"
          ></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column
        prop="23"
        label="需要对网络安全等相关技术内容进行补充完善"
        width="160"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-checkbox
            :disabled="row.isRelevant == 1 || row.conclusion != 1 || disabled || row.disabled"
            v-model="row[23]"
          ></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column
        prop="24"
        label="标准中存在不宜在标准中规定的管理内容"
        width="160"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-checkbox
            :disabled="row.isRelevant == 1 || row.conclusion != 1 || disabled || row.disabled"
            v-model="row[24]"
          ></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column
        prop="25"
        label="与其他标准（包括行业及国家标准、国际标准）存在协调统一问题"
        width="220"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-checkbox
            :disabled="row.isRelevant == 1 || row.conclusion != 1 || disabled || row.disabled"
            v-model="row[25]"
          ></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="26" label="其他的原因" align="center">
        <template slot-scope="{ row }">
          <el-checkbox
            :disabled="row.isRelevant == 1 || row.conclusion != 1 || disabled || row.disabled"
            v-model="row[26]"
          ></el-checkbox>
        </template>
      </el-table-column>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  props: {
    tableData: {
      type: Array,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    taskState:{
      type: [Number,String],
      default: '',
    }
  },
  data() {
    return {};
  },
};
</script>
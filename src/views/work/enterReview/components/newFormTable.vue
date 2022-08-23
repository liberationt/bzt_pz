<template>
  <BztDialog
    :dialogInfo="dialogInfo"
    @close="closeDialog($event, 0)"
    :appendTobody="true"
  >
    <template slot="body">
			<div class="tableHead">
				<div class="label">标准名称</div>
				<div>
					<el-input v-model="input" placeholder="请输入内容" style="width:560px"></el-input>
				</div>
				<div class="label">征集意见单位</div>
				<div>
					<el-input v-model="input" placeholder="请输入内容" style="width:440px"></el-input>
				</div>
			</div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="章条编号" width="160" align="center">
        </el-table-column>
        <el-table-column label="意见内容" align="center"> 
					<el-table-column prop="province" label="原文为" width="280" align="center">
					</el-table-column>
					<el-table-column prop="province" label="修改为" width="280" align="center">
					</el-table-column>
        </el-table-column>

        <el-table-column prop="date" label="提出单位" width="160" align="center">
        </el-table-column>
				<el-table-column prop="date" label="提出人员" width="158" align="center">
        </el-table-column>
				<el-table-column prop="date" label="处理意见" width="300" align="center">
        </el-table-column>
      </el-table>
    </template>
  </BztDialog>
</template>
<script>
import { BztDialog } from "@components/basicCom/index.js";

export default {
  components: {
    BztDialog,
  },
  data() {
    return {
      dialogInfo: {
        visible: true,
        title: "技术标准征求意见表",
        width: "1400px",
        footer: true,
        loadding: false,
      },
      tableData: [
        {
          date: "2016-05-03",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-08",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
      ],
    };
  },
  methods: {
    closeDialog() {},
  },
};
</script>
<style lang="scss" scoped>
	.tableHead{
		// height:44px;
		display: flex;
		padding:10px 0;
		align-items: center;
		background:#f5f7fa;
		.label{
			width:160px;
			text-align: center;
			font-weight: bold;
			flex-shrink: 0;
		}
	}
</style>
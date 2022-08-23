<template>
  <div>
    <el-checkbox-group v-model="checkList">
      <el-checkbox label="1">部门网员</el-checkbox>
      <el-checkbox label="2">抄送人员</el-checkbox>
    </el-checkbox-group>

    <div>
      <SelectUserByDept
        :value="
          formLabelAlign.otherReceivers ? formLabelAlign.otherReceivers : ''
        "
        @user-change="userChange"
      />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      checkList: ["1"],
    };
  },
};
</script>
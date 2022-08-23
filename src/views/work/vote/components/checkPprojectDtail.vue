<template>
  <BztDialog
    :dialogInfo="{
      visible: todoData.visible,
      title: '项目详情',
      width: '100%',
      isFull: true,
    }"
    :appendTobody="false"
    @close="closeDialog"
  >
    <template slot="body">
      <component
        :is="todoData.comp"
        :proInfo="{ id: todoData.id, projectPhase: todoData.projectPhase }"
      />
    </template>
  </BztDialog>
</template>
<script>
import { BztDialog } from "@components/basicCom/index";
export default {
  components: { BztDialog },
  name: "check-project-detail",
  props: {
    todoData: {
      id: null,
      compt: "",
      visible: false,
      projectPhase: null,
    },
  },
  methods: {
    closeDialog() {
      console.log(33);
      this.$emit("close", null);
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .dialog-component .el-dialog__body {
  max-height: calc(100% - 65px) !important;
  padding: 0;
}
::v-deep .el-dialog__wrapper {
  z-index: 9999 !important;
}
</style>
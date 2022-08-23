<template>
  <BztDialog :dialogInfo="dialogDetailInfo" @close="closeDetail">
    <template slot="body">
      <div class="standar-detail" v-if="stdInfo !== null">
        <el-descriptions
          :title="null"
          :column="1"
          labelClassName="label"
          contentClassName="contents"
          :labelStyle="{ width: '80px' }"
        >
          <el-descriptions-item label="标准名称">
            {{ stdInfo["stdName"] || "" }}
          </el-descriptions-item>
          <el-descriptions-item label="标准编号">
            {{ stdInfo["stdNo"] || "" }}
          </el-descriptions-item>
          <el-descriptions-item label="发布日期">
            {{type==1?getDate(stdInfo["publishdate"]):getDate(stdInfo["stdPublishDate"]) }}
          </el-descriptions-item>
          <el-descriptions-item label="实施日期">
            {{type==1?getDate(stdInfo["dodate"]) : getDate(stdInfo["stdDoDate"]) }}
          </el-descriptions-item>

          <el-descriptions-item label="废除日期">
            {{ type==1? getDate(stdInfo["expiredate"]): getDate(stdInfo["stdExpiredDate"]) }}
          </el-descriptions-item>

          <el-descriptions-item label="标准状态">
            {{ type==1?statusStr:stdInfo["statusStr"] }}
          </el-descriptions-item>
          <el-descriptions-item label="题录">
            {{ stdInfo["modifyFile"] }}
          </el-descriptions-item>
          <el-descriptions-item label="修改单">
            {{ stdInfo["modifyFile"] }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <template v-else>
        <el-empty description="暂未查到详情" />
      </template>
    </template>
  </BztDialog>
</template>
<script>
import { BztDialog } from "@components/basicCom/index";
import stdApi from "@api/infoModule";

export default {
  components: { BztDialog },
  name: "std-detail",
  props: {
    visiable: {
      type: Boolean,
      default: false,
    },
    standarDetail: {
      type: Object,
      default: null,
    },
    title: {
      type: String,
      default: "",
    },
    type:{
      type:Number,
      default:0
    },
    statusStr:{
      type:String,
      default:''
    }
  },
  data() {
    return {
      dialogDetailInfo: {
        visible: false,
        title: "详情",
        width: "800px",
        footer: false,
      },
      fileList: [],
      stdInfo: null,
    };
  },
  watch: {
    visiable(val) {
      this.dialogDetailInfo.visible = this.visiable;
      this.dialogDetailInfo.title = this.title;
    },
  },
  mounted() {
    this.dialogDetailInfo.visible = this.visiable;
    if (this.visiable === true) {
      this.dialogDetailInfo.title = this.title;
      this.getTopiclInfo();
    }
  },
  methods: {
    /**
     * 获取标准详情
     */
    getTopiclInfo() {
      console.log(this.standarDetail);
      stdApi.getTopiclInfo(this.standarDetail.stdId).then((res) => {
        const { code, data, msg } = res;
        if (code == 200) {
          this.stdInfo = data ?? null;
        }
      });
    },
    closeDetail(e) {
      this.dialogDetailInfo.visible = false;
      this.$emit("close", null);
    },
    /**
     * 判断日期式
     * @param {string} data 要判断的日期字符串
     */
    getDate(data) {
      let str = "";
      if (data === null || data === undefined) {
        str = "";
      } else if (
        data.indexOf("1900-01-01") === -1 &&
        data.indexOf("1970-01-01") === -1 &&
        data.indexOf("9990-01-01") === -1
      ) {
        str = data;
      } //'1900-01-01'||'9990-01-01'||'1970-01-01'
      return str;
    },
  },
};
</script>
<style lang="scss" scoped>
.file-list {
  height: 100%;
  overflow: auto;
  .file {
    line-height: 30px;
    color: $bule;
    cursor: pointer;
    i {
      margin-right: 10px;
    }
    &:hover {
      font-size: 15px;
    }
  }
}
</style>
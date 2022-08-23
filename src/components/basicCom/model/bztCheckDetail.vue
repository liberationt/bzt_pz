<template>
  <div class="check-detail">
    <template v-for="(item, index) in list">
      <el-descriptions
        :key="`desc_${index}`"
        :title="item.title"
        :column="item.column"
        labelClassName="label"
        contentClassName="contents"
        :labelStyle="{ width: item.labelWidth ? item.labelWidth : '120px' }"
        :contentStyle="{
          width: item.labelWidth
            ? `calc(100% - ${item.labelWidth})`
            : 'calc(100% - 120px)',
        }"
        :border="item.border == true"
        colon
      >
        <template slot="extra">
          <slot :name="item.extra"></slot>
        </template>
        <template v-for="(val, key, i) in item.content">
          <el-descriptions-item :key="`desc_item_${i}`" :label="val.label">
            <span
              :style="{
                color: val.color
                  ? val.color(val.value) == undefined
                    ? '#333333'
                    : val.color(val.value)
                  : '',
              }"
            >
              <!-- 0, 文本 -->
              <template v-if="val.type === 0">{{ val.value }}</template>

              <!-- 1,文件附件 -->
              <template v-if="val.type === 1">
                <a
                  class="file link-text"
                  @click="downloadFile(value)"
                  :title="getParse(val.value).fileName"
                >
                  <i class="el-icon-document" />{{
                    getParse(val.value).fileName
                  }}
                </a>
              </template>

              <!-- 2,文件附件列表 -->
              <template v-if="val.type === 2">
                <a
                  class="file link-text"
                  v-for="(file, j) in getParse(val.value)"
                  :key="`file_${index}_${i}_${j}`"
                  @click="downloadFile(file)"
                  :title="getParse(val.value).fileName"
                >
                  <i class="el-icon-document" />{{ file.fileName }}
                </a>
              </template>

              <!-- 3,图片附件 -->
              <template v-if="val.type === 3">
                <a
                  class="info-img"
                  @click="downloadFile(getParse(val.value))"
                  :title="getParse(val.value).fileName"
                >
                  <img :src="`${baseUrl}${getParse(val.value).filePath}`" />
                </a>
              </template>

              <!-- 4,图片附件列表 -->
              <template v-if="val.type === 4">
                <a
                  class="info-img"
                  v-for="(file, j) in getParse(val.value)"
                  :key="`img_${index}_${i}_${j}`"
                  @click="downloadFile(file)"
                  :title="getParse(val.value).fileName"
                >
                  <img :src="`${baseUrl}${getParse(val.value).filePath}`" />
                </a>
              </template>

              <!-- 5, 过滤器方法 -->
              <template v-if="val.type === 5">
                {{ val.filter(val.value) }}
              </template>
              
              <!-- 富文本编辑器 -->
              <template v-if="val.type === 6">
                <div v-html="val.value"></div>
              </template>

              <template v-if="val.type === 7">
                {{ getUserName(val.value+'')}}
              </template>
            </span>
          </el-descriptions-item>
        </template>
      </el-descriptions>
    </template>
  </div>
</template>
<script>
/**
 * list [item]
 * item:{title:'',content:{desc},border:false}
 * desc:{label:"标题",value:"内容",type:0}
 * type:0,文本，1：文件附件，2：文件附件列表，3：图片附件，4：图片附件列表, 5:过滤器
 */
export default {
  name: "bzt-check-detail",
  props: {
    list: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      baseUrl: process.env.VUE_APP_BASE_API,
    };
  },
  methods: {
    getParse(data) {
      let parData = {};
      if (data != "" && data != null) {
        parData = JSON.parse(data);
      }
      return parData;
    },
    /**
     * 获取UserName
     */
    getUserName(ids) {
      let arr = [];
      if (ids != "") {
        ids.split(",").forEach((id) => {
          const sourceUserList = this.$cache.session.getJSON("sourceUserList");
          if (id == 0) return "系统";
          const user = _.find(sourceUserList, { userId: Number(id) });
          arr.push(
            user
              ? `${user.nickName}（${user.userName}）`
              : "-（${user.userName}）"
          );
        });
      }
      return arr.length > 0 ? arr.join("；") : "";
    },
    /**
     * 附件下载
     */
    downloadFile(data) {
      // this.download(data.filePath, false);
      // location.href = `${process.env.VUE_APP_BASE_API}/${
      //   data.filePath ?? data.url
      // }`;
      let file = {
        url: "",
        name: "",
      };
      if (data.fileName) {
        file["url"] = data.filePath;
        file["name"] = data.fileName;
      } else {
        file["url"] = data.url;
        file["name"] = data.name;
      }
      this.downLoadByURL(file.url, file.name);
    },
  },
};
</script>
<style lang="scss" scoped>
.check-detail {
  ::v-deep .el-descriptions {
    margin: 0;
    width: 100%;
    font-size: 14px;
    margin-bottom: 35px;
    .el-descriptions__header {
      .el-descriptions__title {
        font-size: 16px;
        font-weight: 600;
        border-left: $bule 3px solid;
        line-height: 18px;
        padding-left: 8px;
      }
    }
    .label {
      color: #666666 !important;
      font-weight: 600;
    }
    .contents {
      color: #333333;
      padding: 3px 8px;
      line-height: 25px;
      .file {
        width: 100%;
        display: inline-block;
        white-space: nowrap;
        /* 强制性的在一行显示所有的文本，直到文本结束或者遭遇br标签对象才换行*/
        overflow: hidden;
        /* 溢出的文字隐藏起来*/
        text-overflow: ellipsis;
        line-height: 22px;

        i {
          margin-right: 5px;
        }
      }
      .info-img {
        width: 80px;
        height: 80px;
        float: right;
        margin-left: 15px;
        &:first-child {
          margin-left: 0;
        }
      }
    }
  }
}
</style>
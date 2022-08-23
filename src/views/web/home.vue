<template>
  <div class="index-web">
    <!-- 页面顶部 -->
    <HomeHeader />
    <div class="web-content">
      <!-- 搜索区域 -->
      <HeaderSearch />

      <!-- 内容发布通知 -->
      <div class="menu-list">
        <template v-for="(item, index) in articleTypeList">
          <span :key="index" class="menu-li" @click="toDetail(item.dictValue)">
            {{ item.dictLabel }}
          </span>
        </template>
      </div>

      <!-- <el-row :gutter="20">
        <el-col :span="7">
          <div class="col">
            <div class="col-title">
              通知公告
              <span class="more" @click="toMore(0)">
                更多
                <i class="el-icon-d-arrow-right" />
              </span>
            </div>
            <div class="col-content">
              <template v-for="(item, index) in newsList">
                <div
                  class="news-li"
                  :key="`news_${index}`"
                  v-if="index < 7 && item.title != null"
                  @click="checkDetail(item)"
                >
                  <span class="news-title" :title="item.title">
                    {{
                      item.title.length > 12
                        ? `${item.title.substring(0, 12)}...`
                        : item.title
                    }}
                  </span>
                  <img class="new-icon" src="@assets/images/new-icon.png" /> 
                  <span v-if="index < 3" class="new-icon">new</span>
                  <span class="time">{{ item.publishTime }}</span>
                </div>
              </template>
            </div>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="col">
            <div class="col-title">
              标准编写类型统计
              <el-date-picker
                class="date-range"
                v-model="dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                @change="initChartpei"
              />
            </div>

            <div class="col-content">
              <BztChart :option="optionPei" ref="peiChart" />
            </div>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="col">
            <div class="col-title">
              常用功能入口
              <span class="more" @click="toMore(1)" style="margin-top: 10px"
                >服务入口<i class="el-icon-d-arrow-right" />
              </span>
            </div>
            <div
              class="col-content"
              v-if="serviceList.length > 0"
              style="background: rgb(244, 247, 251)"
            >
              <template v-for="(item, index) in serviceList">
                <el-tooltip
                  :key="index"
                  class="item"
                  effect="dark"
                  :content="item.menuName"
                  placement="top"
                  trigger="focus"
                  popper-class="ser-pop"
                  :hide-after="2000"
                  :disabled="item.menuName.length < 27"
                >
                  <div class="home-btn-li" @click="toPage(item)">
                    {{
                      item.menuName.length > 28
                        ? `${item.menuName.substring(0, 13)}...`
                        : item.menuName
                    }}
                    <span class="more"><i class="el-icon-right" /> </span>
                  </div>
                </el-tooltip>
              </template>
            </div>
          </div>
        </el-col>
      </el-row> -->
      

      <div>
      <el-row :gutter="20">
        <el-col :span="7">
          <div class="col">
            <div class="col-title">
              通知公告
              <span class="more" @click="toMore(0,10)">
                更多
                <i class="el-icon-d-arrow-right" />
              </span>
            </div>
            <div class="col-content">
              <template v-for="(item, index) in newsList">
                <div
                  class="news-li"
                  :key="`news_${index}`"
                  v-if="index < 7 && item.title != null"
                  @click="checkDetail(item)"
                >
                  <span class="news-title" :title="item.title">
                    {{
                      item.title.length > 12
                        ? `${item.title.substring(0, 12)}...`
                        : item.title
                    }}
                  </span>
                  <!-- <img class="new-icon" src="@assets/images/new-icon.png" /> -->
                  <span v-if="index < 3" class="new-icon">new</span>
                  <span class="time">{{ item.publishTime }}</span>
                </div>
              </template>
            </div>
          </div>
          <div class="col">
            <div class="col-title">
              标准工作
              <span class="more" @click="toMore(0,30)">
                更多
                <i class="el-icon-d-arrow-right" />
              </span>
            </div>
            <div class="col-content">
              <template v-for="(item, index) in standardList">
                <div
                  class="news-li"
                  :key="`news_${index}`"
                  v-if="index < 7 && item.title != null"
                  @click="checkDetail(item)"
                >
                  <span class="news-title" :title="item.title">
                    {{
                      item.title.length > 12
                        ? `${item.title.substring(0, 12)}...`
                        : item.title
                    }}
                  </span>
                  <!-- <img class="new-icon" src="@assets/images/new-icon.png" /> -->
                  <span v-if="index < 3" class="new-icon">new</span>
                  <span class="time">{{ item.publishTime }}</span>
                </div>
              </template>
            </div>
          </div>
          <div class="col">
            <div class="col-title">
              重点工作
              <span class="more" @click="toMore(0,20)">
                更多
                <i class="el-icon-d-arrow-right" />
              </span>
            </div>
            <div class="col-content">
              <template v-for="(item, index) in pointList">
                <div
                  class="news-li"
                  :key="`news_${index}`"
                  v-if="index < 7 && item.title != null"
                  @click="checkDetail(item)"
                >
                  <span class="news-title" :title="item.title">
                    {{
                      item.title.length > 12
                        ? `${item.title.substring(0, 12)}...`
                        : item.title
                    }}
                  </span>
                  <!-- <img class="new-icon" src="@assets/images/new-icon.png" /> -->
                  <span v-if="index < 3" class="new-icon">new</span>
                  <span class="time">{{ item.publishTime }}</span>
                </div>
              </template>
            </div>
          </div>
        </el-col>
        <el-col :span="17">
          <el-row :gutter="20">
            <el-col :span="13">
              <div class="col">
                <div class="col-title">
                  我的待办
                  <span class="more" @click="toMore(2)">
                    更多
                    <i class="el-icon-d-arrow-right" />
                  </span>
                </div>
                <div class="col-content col-contents">
                  <template v-for="(item, index) in taskList">
                    <div
                      class="news-li"
                      :key="`news_${index}`"
                      @click="taskDetail(item)"
                    >
                      <span>{{item.taskTitle}}</span>
                      <span style="color:#0481f5">去办理</span>
                    </div>
                  </template>
                </div>
              </div>
              <!-- <div class="col">
                <div class="col-title">
                  标准编写类型统计
                  <el-date-picker
                    class="date-range"
                    v-model="dateRange"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    @change="initChartpei"
                  />
                </div>

                <div class="col-content col-content-chart">
                  <BztChart :option="optionPei" ref="peiChart" />
                </div>
              </div> -->
           </el-col>
            <el-col :span="11">
              <div class="col">
                <div class="col-title">
                  常用功能入口
                  <span class="more" @click="toMore(1)" style="margin-top: 10px"
                    >服务入口<i class="el-icon-d-arrow-right" />
                  </span>
                </div>
                <div
                  class="col-content col-contents"
                  v-if="serviceList.length > 0"
                  style="background: rgb(244, 247, 251)"
                >
                  <template v-for="(item, index) in serviceList">
                    <el-tooltip
                      :key="index"
                      class="item"
                      effect="dark"
                      :content="item.menuName"
                      placement="top"
                      trigger="focus"
                      popper-class="ser-pop"
                      :hide-after="2000"
                      :disabled="item.menuName.length < 27"
                    >
                      <div class="home-btn-li" @click="toPage(item)">
                        {{
                          item.menuName.length > 28
                            ? `${item.menuName.substring(0, 13)}...`
                            : item.menuName
                        }}
                        <span class="more"><i class="el-icon-right" /> </span>
                      </div>
                    </el-tooltip>
                  </template>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
                <div class="col">
                <div class="col-title">
                  标准编写类型统计
                  <el-date-picker
                    class="date-range"
                    v-model="dateRange"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    @change="initChartpei"
                  />
                </div>

                <div class="col-content col-content-chart">
                  <BztChart :option="optionPei" ref="peiChart" />
                </div>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <!-- <el-col :span="7">
          <div class="col">
            <div class="col-title">
              常用功能入口
              <span class="more" @click="toMore(1)" style="margin-top: 10px"
                >服务入口<i class="el-icon-d-arrow-right" />
              </span>
            </div>
            <div
              class="col-content"
              v-if="serviceList.length > 0"
              style="background: rgb(244, 247, 251)"
            >
              <template v-for="(item, index) in serviceList">
                <el-tooltip
                  :key="index"
                  class="item"
                  effect="dark"
                  :content="item.menuName"
                  placement="top"
                  trigger="focus"
                  popper-class="ser-pop"
                  :hide-after="2000"
                  :disabled="item.menuName.length < 27"
                >
                  <div class="home-btn-li" @click="toPage(item)">
                    {{
                      item.menuName.length > 28
                        ? `${item.menuName.substring(0, 13)}...`
                        : item.menuName
                    }}
                    <span class="more"><i class="el-icon-right" /> </span>
                  </div>
                </el-tooltip>
              </template>
            </div>
          </div>
        </el-col> -->
      </el-row>
      </div>

    </div>

    <!-- 页面底部 -->
    <Footer />
  </div>
</template>

<script>
import {
  Footer,
  HomeHeader,
  HeaderSearch,
} from "@components/bussinessCom/index";
import { BztChart } from "@components/basicCom/index";
import Api from "@api/web";
import { getToken } from "@/utils/auth";
import { mapGetters } from "vuex";
import TaskApi from "@/api/system/todoTask";

export default {
  name: "IndexWeb",
  computed: {
    ...mapGetters(["userInfo"]),
  },
  components: { Footer, HomeHeader, HeaderSearch, BztChart },
  data() {
    return {
      optionPei: {},
      serviceList: [],
      newsList: [],
      userMenus: [],
      hasMenu: false,
      articleTypeList: [],
      dateRange: [],
      taskList:[],
      listReq: {
        publishTimeRange: null,
        title: "",
        type: null,
        pageNum: 1,
        pageSize: 10,
      },
      pointList:[],
      standardList:[]
    };
  },
  created() {
    // 加载饼图信息
    this.initChartpei();

    // 获取内容分类
    this.getArticleTypeList();

    // 通知公告列表
    this.getNewsList();

    // 获取服务入口信息
    this.getServiceList();

    //查询待办列表
    this.getList()
    //其他公告
    this.getOtherList(20)
    this.getOtherList(30)
  },
  methods: {
    /** 查询待办任务列表 */
    getList() {
      let params = {
        isAsc: "desc",
        orderByColumn: "create_time",
        page: 1,
        pageNum: 1,
        pageSize: 19,
        state: 0,
        taskType: 0
      }
      TaskApi.listTodoTask(params).then((response) => {
        this.taskList = response.rows;
      });
    },
    /**
     * 获取饼图信息
     */
    initChartpei() {
      // this.$refs.peiChart.chart.dispose();
      let req = {
        startDate: "",
        endDate: "",
      };
      if (this.dateRange != null) {
        req = {
          startDate: this.dateRange.length == 0 ? "" : this.dateRange[0],
          endDate: this.dateRange.length == 0 ? "" : this.dateRange[1],
        };
      }

      Api.indexChartpei(req).then((res) => {
        const { code, data, msg } = res;
        if (code === 200) {
          // this.optionPei = {
          //   title: {
          //     text: "标准编写统计",
          //     subtext: "",
          //     left: "center",
          //   },
          //   tooltip: {
          //     trigger: "item",
          //   },
          //   legend: {
          //     orient: "vertical",
          //     // left: "right",
          //     bottom: "bottom",
          //   },
          //   series: [
          //     {
          //       name: "统计",
          //       type: "line",
          //       radius: "50%",
          //       data: data,
          //       emphasis: {
          //         itemStyle: {
          //           shadowBlur: 10,
          //           shadowOffsetX: 0,
          //           shadowColor: "rgba(0, 0, 0, 0.5)",
          //         },
          //       },
          //     },
          //   ],
          // };
          let xArr = [];
          let yArr = [];
          data.forEach((item) => {
            xArr.push(item.name);
            yArr.push(item.value);
          });
          this.optionPei = {
            title: {
              text: "标准编写统计",
              subtext: "",
              left: "center",
              top: 10,
            },
            tooltip: {
              trigger: "axis",
            },
            xAxis: {
              type: "category",
              data: xArr,
              axisLabel: {
                interval: 0,
                rotate: 0, //倾斜的程度
              },
            },
            yAxis: {
              type: "value",
            },
            series: [
              {
                name: "标准数",
                type: "bar",
                itemStyle: {
                  normal: {
                    //好，这里就是重头戏了，定义一个list，然后根据所以取得不同的值，这样就实现了，
                    color: function (params) {
                      // build a color map as your need.
                      var colorList = [
                        "#F3A339",
                        "#00AAAA",
                        "#800DFC",
                        "#85d603",
                        "#FD4025",
                      ];
                      const index = colorList.length % params.dataIndex;
                      return colorList[index];
                    }, //以下为是否显示，显示位置和显示格式的设置了
                  },
                },
                barWidth: 28,
                data: yArr,
                label: {
                  show: true,
                  position: "top",
                  valueAnimation: true,
                },
              },
            ],
          };

          this.$nextTick(() => {
            setTimeout(() => {
              this.$refs.peiChart.drawChart(this.optionPei);
            }, 500);
          });
        } else {
          // this.$message.error(msg);
        }
      });
    },
    /**
     * 获取通知公告列表
     */
    getNewsList() {
      Api.newsList().then((res) => {
        const { code, data, msg } = res;
        if (code === 200) {
          this.newsList = data;
        } else {
          // this.$message.error(msg);
        }
      });
    },
    // 获取其他内容公告
    getOtherList(type) {
      let req = this.deepClone(this.listReq)
      req.type = type
      Api.articleList(this.listReq).then((res) => {
        const { code, rows, msg, total } = res;
        if (code === 200) {
          if(type==20){
            this.pointList = rows
          }else{
            this.standardList = rows
          }
        } 
      });
    },
    getArticleTypeList() {
      Api.getArticleTypeList().then((res) => {
        const { code, data, msg } = res;
        if (code === 200) {
          this.articleTypeList = data;
        } else {
          // this.$message.error(msg);
        }
      });
    },
    /**
     * 获取服务入口
     */
    getServiceList() {
      Api.getServiceList().then((res) => {
        const { code, data, msg } = res;
        if (code == 200) {
          this.serviceList = data;
        } else {
          // this.$message.error(msg);
        }
      });
      if (getToken()) {
        Api.getMenuList({ userId: this.userInfo.userId }).then((res) => {
          const { code, data, msg } = res;
          if (code == 200) {
            this.userMenus = data;
          } else {
            // this.$message.error(msg);
          }
        });
      }
    },
    toPage(item) {
      if (getToken()) {
        this.hasMenu = false;
        this.checkMenuQX(item.menuId, this.userMenus);
        if (this.hasMenu == true) {
          this.$router.push(item.path);
        } else {
          this.$message.warning("无权限操作");
        }
      } else {
        this.$message.warning("还未登录，请先登录");
      }
    },
    checkMenuQX(menuId, list) {
      list.forEach((item) => {
        if (item.menuId == menuId) {
          this.hasMenu = true;
        }
        if (item.children.length > 0) {
          this.checkMenuQX(menuId, item.children);
        }
      });
    },
    /**
     * 内容详情
     */
    toDetail(type) {
      if (getToken()) {
        const keyWord = "";
        this.$router.push(`/articleDetail?type=${type}`);
      } else {
        this.$message.warning("还未登录，请先登录");
      }
    },
    /**
     * 查看通知公告详情
     */
    checkDetail(e) {
      if (getToken()) {
        this.$router.push(`/checkArticleDetail/${e.id}`);
      } else {
        this.$message.warning("还未登录，请先登录");
      }
    },
    taskDetail(item) {
      if (getToken()) {
        // this.$router.push(e.processPath);
        if (item.state == 0) {
          if (item.processType == 1) {
            this.$router.push("/maintenance/task");
          } else if (item.processType == 2) {
            this.$router.push(item.processPath);
          }
        }
      } else {
        this.$message.warning("还未登录，请先登录");
      }
    },
    /**
     * 更多
     * @param {number} flag 0:通知公告，1：服务入口
     */
    toMore(flag,type=null) {
      switch (flag) {
        case 0:
          this.$router.push(`/articleDetail?type=${type}`);
          break;
        case 1:
          this.$router.push({ path: "/index" });
          break;
        case 2:
          this.$router.push({ path: "/maintenance/task" });
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.index-web {
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 1920px;
  min-width: 1206px;
  margin: auto;
  .menu-list {
    min-width: 1000px;
    width: 100%;
    margin-bottom: 15px;
    overflow: hidden;
    height: 38px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    .menu-li {
      font-size: 16px;
      line-height: 35px;
      float: left;
      margin-left: 25px;
      cursor: pointer;
      &:first-child {
        margin-left: 0;
      }
      &:hover {
        color: $bule;
        border-bottom: 2px solid $bule;
      }
    }
  }
  .web-content {
    position: relative;
    height: calc(100% - 210px);
    overflow-y: auto;
    .col-content {
      height: 420px;
      &:nth-child(3) {
        height: auto;
        min-height: 380px;
        overflow: hidden;
      }
      .btn-li {
        background: $submit-btn-color;
        color: $white;
        line-height: 40px;
        height: 40px;
        width: 47%;
        float: left;
        text-align: center;
        border-radius: 0px 10px 0px 10px;
        margin-top: 10px;
        cursor: pointer;
        &:nth-child(2n) {
          float: right;
        }
        &:hover {
          background: $submit-btn-hover-color;
        }
        &:nth-last-child(3) {
          width: 100%;
        }
        &:nth-last-child(2) {
          width: 100%;
        }
        &:nth-last-child(1) {
          width: 100%;
        }
      }
      .home-btn-li {
        width: 100%;
        line-height: 36px;
        border-bottom: 1px solid #999999;
        cursor: pointer;
        display: flex;
        flex-direction: row;
        flex-direction: row;
        justify-content: space-between;
        color: #555555;
        .more {
          float: right;
        }
        &:first-child {
          margin-top: -15px;
        }
        &:last-child {
          border: 0;
        }
        &:hover {
          color: #333333;
        }
      }
    }
    .col-contents{
      height:897px;
    }
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
    border: 1px solid #333333;
  }
  .date-range {
    float: right;
    width: 245px;
    margin-top: 10px;
  }
}
::v-deep .ser-pop {
  margin-bottom: -15px;
}
</style>

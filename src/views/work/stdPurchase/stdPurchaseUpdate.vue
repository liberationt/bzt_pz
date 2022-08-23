<template>
  <div class="std-purchase-detail" v-if="applyForm != null">
    <div class="apply-title">标准文件购置申请单</div>
    <div class="detail-module">
      <div class="title">申请单信息</div>
      <div class="form-content">
        <el-form
          :model="applyForm"
          :rules="rules"
          ref="applyForm"
          label-suffix=":"
          label-width="100px"
          class="applyForm"
          v-if="applyForm != null"
        >
          <el-form-item label="项目名称" style="width: 100%">
            <el-input
              v-model="applyForm.projectName"
              placeholder="请输入项目名称"
            />
          </el-form-item>
          <el-form-item
            label="部门"
            :rules="[
              {
                required: true,
                message: '请输入部门',
                trigger: 'blur',
              },
            ]"
          >
            <el-input v-model="userInfo.dept.deptName" disabled />
          </el-form-item>
          <el-form-item label="编号">
            <el-input
              v-model="applyForm.docNo"
              placeholder="请输入编号"
              disabled
            />
          </el-form-item>
          <el-form-item label="版本">
            <el-input v-model="applyForm.docVersion" placeholder="请输入版本" />
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 文件清单 -->
    <div class="detail-module">
      <div class="title">文件清单</div>
      <div class="form-content">
        <el-form
          :rules="docRules"
          ref="docForm"
          label-suffix=":"
          label-width="auto"
          class="docForm"
        >
          <template v-for="(item, index) in docEntry">
            <div :key="`doc_${index}`" class="doc-entry">
              <div class="doc-entry-left">
                <div class="index">序号：{{ index + 1 }}</div>
                <el-form-item
                  class="doc-li"
                  label="代号"
                  :rules="[
                    {
                      required: true,
                      message: '请输入代号',
                      trigger: 'blur',
                    },
                  ]"
                >
                  <el-input v-model="item.docNo" placeholder="请输入代号" />
                </el-form-item>
                <el-form-item
                  label="名称"
                  class="doc-li"
                  :rules="[
                    {
                      required: true,
                      message: '请输入名称',
                      trigger: 'blur',
                    },
                  ]"
                >
                  <!-- <el-input v-model="item.docName" placeholder="请输入名称" /> -->
                  <el-select
                    :value="item.docName"
                    placeholder="请选择标准"
                    @change="selStd($event, item)"
                    @visible-change="getList"
                  >
                    <template v-for="(std, index) in list">
                      <el-option
                        v-if="std.isShow==true"
                        :key="`std_${index}`"
                        :label="std.stdName"
                        :value="std.id"
                      />
                    </template>
                  </el-select>
                </el-form-item>
                <el-form-item
                  class="doc-li"
                  label="数量/份"
                  :rules="[
                    {
                      required: true,
                      message: '请输入数量/份',
                      trigger: 'blur',
                    },
                  ]"
                >
                  <el-input-number
                    v-model="item.docNum"
                    :min="1"
                    :max="10000"
                    placeholder="请输入数量/份"
                  />
                </el-form-item>

                <!-- <el-form-item
                  class="doc-li"
                  label="购置方式"
                  :rules="[
                    {
                      required: true,
                      message: '请选择购置方式',
                      trigger: 'blur',
                    },
                  ]"
                >
                  <el-radio-group v-model="item.docUseScope">
                    <el-radio :label="1">单机版</el-radio>
                    <el-radio :label="2">团体版</el-radio>
                  </el-radio-group>
                </el-form-item> -->
              </div>

              <div class="doc-entry-right">
                <el-button class="error-btn" @click="delDoc(index)">
                  <!-- v-if="index < docEntry.length - 1" -->
                  删除
                </el-button>
                <el-button class="submit-btn" @click="addDoc()">
                  添加
                </el-button>
              </div>
            </div>
          </template>
        </el-form>
      </div>
    </div>

    <!-- 申请单位评审 -->
    <div class="detail-module">
      <div class="title">申请单位评审</div>
      <div class="form-content">
        <el-form
          :rules="docRules"
          ref="docForm"
          label-suffix=":"
          label-width="auto"
          class="docForm"
        >
          <el-form-item label="" style="width: 100%">
            <el-checkbox-group v-model="businessDeptOpinion.use_method">
              <el-checkbox :label="1">直接使用</el-checkbox>
              <el-checkbox :label="2">翻译后使用</el-checkbox>
              <el-checkbox :label="3">参考使用</el-checkbox>
              <el-checkbox :label="4">转成内部文件使用</el-checkbox>
              <el-checkbox :label="5">是否需要发放供方</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item
            label="标准适用项目"
            :rules="[
              {
                required: true,
                message: '请输入标准适用项目',
                trigger: 'blur',
              },
            ]"
          >
            <el-input v-model="businessDeptOpinion.use_for" />
            <!-- placeholder="请输入文件来源" -->
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 部门审批人 -->
    <div class="detail-module">
      <div class="title">部门审批人</div>
      <div class="form-content">
        <el-form
          :rules="docRules"
          ref="docForm"
          label-suffix=":"
          label-width="auto"
          class="docForm"
        >
          <el-form-item
            label="部门审批人"
            style="width：100%"
            :rules="[
              {
                required: true,
                message: '请选择部门审批人',
                trigger: 'blur',
              },
            ]"
          >
            <!-- depAduitPersons -->
            <el-select
              v-model="applyForm.businessDeptApproveUserId"
              placeholder="请选择部门审批人"
              @visible-change="getDeptAduitPersons"
            >
              <template v-for="(user, index) in depAduitPersons">
                <el-option
                  :key="`user_${index}`"
                  :label="`${user.nickName}（ ${user.userName}）`"
                  :value="user.userId"
                />
              </template>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="operation-line footer">
      <el-button class="cancelBtn" @click="cancel()">取消</el-button>
      <el-button class="submit-btn" :loading="isLoading" @click="update()"
        >提交
      </el-button>
    </div>
  </div>
</template>
<script>
import Api from "@api/process";
import { mapGetters } from "vuex";
import { listUserByDeptsAndRoleKeys } from "@api/system/user";
const applyForm = {
  applyDeptId: "",
  docNo: null,
  projectName: null,
  docVersion: "1",
  docEntry: "",
  businessDeptOpinion: "",
  businessDeptApproveUserId: null,
};

const docEntryItem = {
  docNo: "",
  docName: "",
  docNum: null,
  docUseScope: null,
  stdNo: "",
  id: null,
  applyReason: "",
};
export default {
  computed: {
    ...mapGetters(["userInfo"]),
  },
  name: "applyStdPurchase",
  data() {
    return {
      applyForm: null,
      rules: {},
      docEntry: [],
      docRules: {},
      isLoading: false,
      list: [],
      businessDeptOpinion: {
        use_method: [],
        use_for: "",
      },
      depAduitPersons: [],
    };
  },
  beforeMount() {
    this.getList(true);
  },
  mounted() {
    this.applyForm = this.deepClone(applyForm);
    this.getDeptAduitPersons();
    this.docEntry = [];
    this.applyForm.docEntry = JSON.stringify(
      JSON.parse(localStorage.getItem("purchaseStds")).map((item) => {
        const newItem = {
          docNo: item.stdNo,
          docName: item.stdName,
          docNum: null,
          docUseScope: null,
          stdNo: item.stdNo,
          id: item.id,
        };
        return newItem;
      })
    );
    if (this.applyForm.docEntry == null || this.applyForm.docEntry == "") {
      this.docEntry.push(this.deepClone(docEntryItem));
    } else {
      this.docEntry = JSON.parse(this.applyForm.docEntry);
    }
    this.serialNumber();
  },
  methods: {
    /**
     * 获取标准购置流水号
     */
    serialNumber() {
      Api.serialNumber().then((res) => {
        const { code, msg, data } = res;
        if (code == 200) {
          this.applyForm.docNo = data;
        }
      });
    },
    /**
     * 获取订购列表
     */
    getList(e) {
      if (e == true) {
        const req = { state: 1 };
        Api.stdPurchaseList(req).then((res) => {
          const { msg, data, code } = res;
          if (code === 200) {
            this.list = [];
            res.rows.forEach((item) => {
              let has = false;
              this.docEntry.forEach((doc) => {
                if (doc.stdNo == item.docNo) {
                  has = true;
                }
              });
              if (has == false) {
                this.list.push(item);
              }
            });
             this.setStdList();
          }
        });
      }
    },
    setStdList(){
      this.list.forEach(item=>{
          item["isShow"] = true
        this.docEntry.forEach(doc=>{
          if(doc.id == item.id){
            item["isShow"] = false
          }
        })
      })
    },
    selStd(e, doc) {
      this.list.forEach((item) => {
        if (item.id == e) {
          doc.docName = item.stdName;
          doc.docNo = item.stdNo;
          doc.id = item.id;
          doc.applyReason = item.applyReason;
        }
      });
            this.setStdList()
    },

    /**
     * 部门审批人列表
     */
    getDeptAduitPersons() {
      const req = {
        deptIds: this.userInfo.dept.deptId + "",
        roleKeys: "deptLeader,principalLeader",
      };
      listUserByDeptsAndRoleKeys(req).then((res) => {
        const { code, msg, data } = res;
        if (code === 200) {
          this.depAduitPersons = data;
        } else {
          // this.$message.error(msg);
        }
      });
    },
    /**
     * 提交标准购置
     */
    update() {
      if (this.testDoc() == false) {
        return;
      }
      if (
        this.businessDeptOpinion.use_for == "" ||
        this.businessDeptOpinion.use_for == null
      ) {
        this.$message.warning("标准适用项目不能为空");
        return;
      }
      // 新增
      this.isLoading = true;
      this.applyForm.applyDeptId = this.userInfo.dept.deptId;
      this.applyForm.docEntry = JSON.stringify(this.docEntry);
      let ids = [];
      this.docEntry.forEach((item) => {
        ids.push(item.id);
      });
      this.applyForm.businessDeptOpinion = JSON.stringify(
        this.businessDeptOpinion
      );
      Api.applyStdLiaisonApplyOnline(this.applyForm).then((res) => {
        this.isLoading = false;
        localStorage.setItem("purchaseStds", "");
        const { code, msg } = res;
        if (code == 200) {
          Api.updateStdPurchaseState(ids.join(",")).then((re) => {
            if (re.code == 200) {
              this.$message.success("申请标准购置成功");
              this.$store.dispatch("tagsView/delView", this.$route);
              this.$router.push("/enterReview/stdPurchase");
            }
          });
        } else {
          // this.$message.error(msg);
        }
      });
    },
    /**
     * 删除文件
     */
    delDoc(index) {
      this.docEntry.splice(index, 1);
      if(this.docEntry.length == 0){
        this.docEntry.push(this.deepClone(docEntryItem));
      }
            this.setStdList()
    },
    /**
     * 添加文件
     */
    addDoc() {
      if (this.testDoc() == true) {
        this.docEntry.push(this.deepClone(docEntryItem));
        this.getList();
      }
    },
    /**
     * 验证文件清单是否配置完整
     */
    testDoc() {
      let isFull = true;
      this.docEntry.forEach((doc, i) => {
        if (
          doc.docNo == null ||
          doc.docNo == "" ||
          doc.docName == null ||
          doc.docName == "" ||
          doc.docNum == null ||
          doc.docNum == 0
        ) {
          console.log(doc);
          isFull = false;
          this.$message.warning(`序号：${i + 1}的信息不完整`);
          return;
        }
      });
      return isFull;
    },
    /**
     * 取消
     */
    cancel() {
      history.go(-1);
    },
  },
};
</script>
<style lang="scss" scoped>
.std-purchase-detail {
  position: relative;
  height: 100%;
  padding: 15px;
  color: #555555;
  overflow-x: auto;
  overflow-y: hidden;
  .apply-title {
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-weight: 900;
    font-size: 16px;
  }
  .detail-module {
    border: 1px solid $grey-light;
    min-width: 1206px;
    border-radius: 5px;
    // padding: 15px 0px;
    margin-bottom: 15px;
    > div {
      padding: 0 15px;
    }
    .title {
      line-height: 40px;
      border-bottom: 1px solid $grey-light;
      color: #555555;
      font-size: 15px;
    }
    .form-content {
      margin: 15px 0px;
      overflow: hidden;
      .applyForm {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        .el-form-item {
          width: 48%;
        }
      }
      ::v-deep .docForm {
        .el-form-item {
          margin-bottom: 0;
          width: 25%;
          .el-form-item__label-wrap {
            margin-left: 0px;
            label {
              font-weight: 400 !important;
            }
          }
          .el-input {
            // width: 260px;
          }
        }
      }
      ::v-deep .docForm {
        .el-form-item {
          margin-bottom: 0;
          // margin: 15px 0px;
          .el-form-item__label-wrap {
            margin-left: 0px;
            label {
              font-weight: 400 !important;
            }
          }
          .el-input {
            // width: 260px;
          }
          .el-form-item__content {
            // margin: 15px 0px;
          }
          .radio {
            overflow: hidden;
          }
        }
        .left-item {
          width: 49%;
          float: left;
        }
        .right-item {
          width: 49%;
          float: right;
        }
      }
      .submit-btn {
        margin: auto;
        margin-top: 15px;
        display: flex;
      }
      .doc-entry {
        position: relative;
        width: 100%;
        font-size: 14px;
        height: auto;
        line-height: 56px;
        overflow: hidden;
        .doc-entry-left {
          float: left;
          width: calc(100% - 150px);
        }
        .doc-entry-right {
          float: right;
          width: 150px;
          .error-btn {
            float: left;
            margin-top: 12px;
          }
          .submit-btn {
            margin: auto;
            margin-top: 12px;
            display: flex;
          }
        }
        .index {
          width: 60px;
          float: left;
        }
        ::v-deep .doc-li {
          float: left;
          margin-right: 12px;
          width: 310px;
          padding: 0;
          .el-form-item__content {
            padding-top: 10px;
          }
        }
      }
    }
  }
  .footer {
    width: 100%;
    text-align: center;
    // position: fixed;
    margin-top: 15px;
    // bottom: 0;
    // height: 60px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-content: center;
  }
}
</style>
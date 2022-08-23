<template>
  <div class="std-purchase-detail">
    <div class="apply-title">
      <!-- 标准购置申请表 -->
      标准文件购置申请单
      <div
        class="operation-line"
        v-if="status == 5 || status == 4"
        style="float: right"
      >
        <el-button
          type="button"
          class="red-btn"
          @click="checkRejectReason(true)"
        >
          查看驳回终止理由
        </el-button>
      </div>
    </div>

    <!-- 申请单信息 -->
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
              v-if="isEdit == true"
            />
            <span v-else>{{ applyForm.projectName }}</span>
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
            <el-input
              :value="getDeptName(applyForm.applyDeptId)"
              disabled
              v-if="isEdit == true"
            />
            <span v-else>{{ getDeptName(applyForm.applyDeptId) }}</span>
          </el-form-item>
          <el-form-item label="编号">
            <el-input
              v-model="applyForm.docNo"
              placeholder="请输入编号"
              v-if="isEdit == true"
              disabled
            />
            <span v-else>{{ applyForm.docNo }}</span>
          </el-form-item>
          <el-form-item label="版本">
            <el-input
              v-model="applyForm.docVersion"
              placeholder="请输入版本"
              v-if="isEdit == true"
            />
            <span v-else>{{ applyForm.docVersion }}</span>
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
              <div
                class="doc-entry-left"
                :style="status != 5 ? { width: '100%' } : null"
              >
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
                  <el-input
                    v-model="item.docNo"
                    placeholder="请输入代号"
                    v-if="isEdit == true"
                  />
                  <span v-else>{{ item.docNo }}</span>
                </el-form-item>
                <el-form-item
                  class="doc-li"
                  label="名称"
                  :rules="[
                    {
                      required: true,
                      message: '请输入名称',
                      trigger: 'blur',
                    },
                  ]"
                >
                  <!-- <el-input
                  v-model="item.docName"
                  placeholder="请输入名称"
                  v-if="isEdit == true"
                /> -->
                  <el-select
                    v-if="isEdit == true"
                    :value="item.docName"
                    placeholder="请选择标准"
                    @change="selStd($event, item)"
                    @visible-change="getList"
                  >
                    <template v-for="(std, index) in list">
                      <el-option
                        v-if="std.isShow!=false"
                        :key="`std_${index}`"
                        :label="std.stdName"
                        :value="std.id"
                      />
                    </template>
                  </el-select>
                  <span v-else>{{ item.docName }}</span>
                </el-form-item>
                <el-form-item
                  label="数量/份"
                  class="doc-li"
                  :rules="[
                    {
                      required: true,
                      message: '请输入数量/份',
                      trigger: 'blur',
                    },
                  ]"
                  style="width: 280px"
                >
                  <el-input-number
                    v-model="item.docNum"
                    :min="1"
                    :max="10000"
                    placeholder="请输入数量/份"
                    v-if="isEdit == true"
                  />
                  <span v-else>{{ item.docNum }}</span>
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
                  <el-radio-group
                    v-model="item.docUseScope"
                    :disabled="status != 5"
                  >
                    <el-radio :label="1">单机版</el-radio>
                    <el-radio :label="2">团体版</el-radio>
                  </el-radio-group>
                </el-form-item> -->
              </div>

              <div class="doc-entry-right" v-if="status == 5 && isEdit == true">
                <el-button class="error-btn" @click="delDoc(index)">
                  <!-- v-if="index < docEntry.length - 1" -->
                  删除
                </el-button>
                <!-- v-else  -->
                <el-button class="submit-btn" @click="addDoc()">
                  添加
                </el-button>
              </div>
            </div>
          </template>
          <!-- <el-button class="submit-btn" @click="addDoc()" v-if="isEdit == true">
            添加文件
          </el-button> -->
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
          <el-form-item label="">
            <el-checkbox-group
              v-model="businessDeptOpinion.use_method"
              :disabled="isEdit == false"
            >
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
            <el-input
              v-model="businessDeptOpinion.use_for"
              v-if="isEdit == true"
            />
            <!-- placeholder="请输入文件来源" -->
            <span v-else>{{ businessDeptOpinion.use_for }}</span>
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
              v-if="isEdit == true"
            >
              <template v-for="(user, index) in depAduitPersons">
                <el-option
                  :key="`user_${index}`"
                  :label="`${user.nickName}（ ${user.userName}）`"
                  :value="Number(user.userId)"
                />
              </template>
            </el-select>
            <span v-else>
              {{ getUserName(applyForm.businessDeptApproveUserId + "") }}
            </span>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 科技管理部审批人 -->
    <div class="detail-module">
      <div class="title">科技管理部审批人</div>
      <div class="form-content">
        <el-form
          :rules="docRules"
          ref="docForm"
          label-suffix=":"
          label-width="auto"
          class="docForm"
        >
          <el-form-item
            label="科技管理部审批人"
            style="width：100%"
            :rules="[
              {
                required: true,
                message: '请选择科技管理部审批人',
                trigger: 'blur',
              },
            ]"
          >
            <!-- depAduitPersons -->
            <el-select
              v-model="applyForm.sciTechDeptApproveUserId"
              placeholder="请选择科技管理部审批人"
              @visible-change="getsciTechDeptAduitPersons"
              :disabled="
                applyForm.projectStatus == 5 && applyForm.projectState == 1301 
              "
              v-if="(isEdit == true || proState == 1302 )&& applyForm.hasAuth==true"
            >
              <!-- :disabled="" -->
              <template v-for="(user, index) in sciTechDeptAduitPersons">
                <el-option
                  :key="`user_${index}`"
                  :label="`${user.nickName}（ ${user.userName}）`"
                  :value="Number(user.userId)"
                />
              </template>
            </el-select>
            <span v-else-if="applyForm.sciTechDeptApproveUserId != null">
              {{ getUserName(applyForm.sciTechDeptApproveUserId + "") }}
            </span>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 文件信息 -->
    <div
      class="detail-module"
      v-if="status == 3 || (hasAuth == true && proState == 1305)"
    >
      <div class="title">文件信息</div>
      <div class="form-content">
        <el-form
          :rules="docRules"
          ref="docForm"
          label-suffix=":"
          label-width="auto"
          class="docForm"
        >
          <el-form-item label="文件来源">
            <el-input
              v-model="applyForm.supplier"
              placeholder="请输入文件来源"
              v-if="status != 3"
            />
            <span v-else>{{ applyForm.supplier }}</span>
          </el-form-item>
          <el-form-item label="文件类别">
            <el-radio-group
              v-model="applyForm.stdDocumentType"
              :disabled="status == 3"
            >
              <el-radio :label="1">标准</el-radio>
              <el-radio :label="2">文件</el-radio>
              <el-radio :label="3">其他</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="文件接收人"
            class="left-item"
            :rules="[
              {
                required: true,
                message: '请选择文件接收人',
                trigger: 'blur',
              },
            ]"
          >
            <el-input
              v-model="applyForm.receiverName"
              placeholder="请输入文件接收人"
              v-if="status != 3"
            />
            <span v-else>{{ applyForm.receiverName }}</span>
          </el-form-item>
          <el-form-item label="文件接收时间" class="right-item">
            <span>{{ applyForm.receiveAt }}</span>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 科技管理部评审 -->
    <div
      class="detail-module"
      v-if="status == 3 || (hasAuth == true && proState == 1305)"
    >
      <div class="title">科技管理部评审</div>
      <div class="form-content">
        <el-form
          :rules="docRules"
          ref="docForm"
          label-suffix=":"
          label-width="auto"
          class="docForm"
        >
          <el-form-item
            label="实施时间"
            class="left-item"
            :rules="[
              {
                required: true,
                message: '请选择实施时间',
                trigger: 'blur',
              },
            ]"
          >
            <!-- v-model="sciTechDeptOpinion.implement_time" -->
            <el-date-picker
              type="date"
              value-format="yyyy-MM-dd"
              v-model="sciTechDeptOpinion.implement_time"
              placeholder="选择日期"
              v-if="status != 3"
            />
            <span v-else>{{ sciTechDeptOpinion.implement_time }}</span>
          </el-form-item>
          <el-form-item
            label="需发放部门"
            class="right-item"
            :rules="[
              {
                required: true,
                message: '请选择需发放部门',
                trigger: 'blur',
              },
            ]"
          >
            <el-input
              v-model="sciTechDeptOpinion.receive_dept"
              placeholder="请输入需发放部门"
              v-if="status != 3"
            />
            <span v-else>{{ sciTechDeptOpinion.receive_dept }}</span>
          </el-form-item>
          <el-form-item
            label="保密等级"
            class="left-item"
            :rules="[
              {
                required: true,
                message: '请选择保密等级',
                trigger: 'blur',
              },
            ]"
          >
            <el-radio-group
              v-model="sciTechDeptOpinion.security_level"
              :disabled="status == 3"
            >
              <el-radio :label="1">绝密</el-radio>
              <el-radio :label="2">私密</el-radio>
              <el-radio :label="3">一般</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="替代关系" class="right-item">
            <el-input
              v-model="sciTechDeptOpinion.replace"
              placeholder="请输入替代关系"
              v-if="status != 3"
            />
            <span v-else>{{ sciTechDeptOpinion.replace }}</span>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 申请部门领导意见 -->
    <div
      class="detail-module"
      v-if="status == 3 || (hasAuth == true && proState == 1305)"
    >
      <div class="title">申请部门领导意见</div>
      <div class="form-content">
        <el-form
          :rules="docRules"
          ref="docForm"
          label-suffix=":"
          label-width="auto"
          class="docForm"
        >
          <el-form-item class="left-item" label="是否同意购置">
            <span>同意</span>
          </el-form-item>
          <el-form-item class="right-item" label="领导签字">
            <span>
              {{ getUserName(applyForm.businessDeptApproveUserId + "") }}
            </span>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 科技管理部领导意见 -->
    <div
      class="detail-module"
      v-if="status == 3 || (hasAuth == true && proState == 1305)"
    >
      <div class="title">科技管理部领导意见</div>
      <div class="form-content">
        <el-form
          :rules="docRules"
          ref="docForm"
          label-suffix=":"
          label-width="auto"
          class="docForm"
        >
          <el-form-item class="left-item" label="是否同意购置">
            <span>同意</span>
          </el-form-item>
          <el-form-item class="right-item" label="领导签字">
            <span>
              {{ getUserName(applyForm.sciTechDeptApproveUserId + "") }}
            </span>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- <el-form-item class="right-item" label="上传标准/文件">
      <el-button class="submit-btn" :loading="isLoading" @click="update()">
        上传文件/标准
      </el-button>
    </el-form-item> -->

    <div class="operation-line footer" v-if="isEdit == true">
      <template v-if="proState == 1305">
        <el-button class="submit-btn" :loading="isLoading" @click="update(1)">
          暂存
        </el-button>
        <el-button class="submit-btn" :loading="isLoading" @click="save()">
          提交
        </el-button>
      </template>
      <template v-else-if="proState == 1302">
        <el-button v-if="isEdit == true" class="cancelBtn" @click="cancel(2)">
          取消
        </el-button>
        <el-button
          v-if="isEdit == true"
          class="submit-btn"
          :loading="isLoading"
          @click="update()"
        >
          保存修改
        </el-button>
      </template>
      <template v-else>
        <el-button class="cancelBtn" @click="cancel(0)">取消</el-button>
        <el-button
          class="submit-btn"
          :loading="isLoading"
          :disabled="checkStd"
          @click="upateStdPur()"
        >
          提交
        </el-button>
      </template>
    </div>
    <div
      class="operation-line footer"
      v-else-if="isEdit != true && hasAuth == true"
    >
      <el-button class="cancelBtn" @click="cancel(1)">返回列表</el-button>
      <template v-if="proState != 1305">
        <template v-if="proState == 1302">
          <el-button
            class="submit-btn"
            :loading="isLoading"
            @click="isEdit = true"
            v-if="isEdit == false"
          >
            修改
          </el-button>
        </template>
        <el-button
          class="submit-btn"
          :loading="isLoading"
          @click="toExamine()"
          v-if="isEdit == false && proState == 1302"
        >
          审核
        </el-button>
         <el-button
          class="submit-btn"
          :loading="isLoading"
          @click="toExamine()"
          v-else-if="isEdit == false"
        >
          审批
        </el-button>
      </template>
    </div>
    <div class="operation-line footer" v-else-if="status == 3">
      <el-button class="submit-btn" :loading="isLoading" @click="exportTable()">
        导出表格
      </el-button>
    </div>

    <!-- 标准化审核 -->
    <ToExamine
      v-if="exaVisible == true"
      :visiable="exaVisible"
      :title="exaTilte"
      :businessObjId="businessProId"
      :sciTechDeptApproveUserId="applyForm.sciTechDeptApproveUserId"
      @save="todoExamine()"
    />

    <!-- 查看驳回原因 -->
    <ProcessRejectReason
      :visiable="rejectReasonVisible"
      :processInfo="{ id: applyForm.id, projectType: 14 }"
      :title="`查看【${applyForm.projectName}】驳回终止原因`"
      @close="checkRejectReason(false)"
    />

    <!-- 上传标准/文件 -->
  </div>
</template>
<script>
import Api from "@api/process";
import { mapGetters } from "vuex";
import ToExamine from "./components/toExamine.vue";
import { ProcessRejectReason } from "@components/bussinessCom/index";
import { listUserByDeptsAndRoleKeys } from "@api/system/user";
const applyForm = {
  id: null,
  applyDeptId: "",
  docNo: null,
  projectName: null,
  docVersion: "1",
  docEntry: "",
  stdDocumentType: null,
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
  components: { ToExamine, ProcessRejectReason },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  name: "applyStdPurchase",
  data() {
    return {
      dialogInfo: {
        visible: false,
        title: "创办任务",
        width: "900px",
        footer: true,
        loadding: false,
        submintText: "确定",
      },
      applyForm: {
        applyDeptId: "",
        docNo: null,
        projectName: null,
        docVersion: "",
        docEntry: "",
      },
      rules: {},
      docEntry: [],
      docRules: {},
      isLoading: false,
      isEdit: false,
      hasAuth: false,
      exaVisible: false,
      exaTilte: "",
      businessProId: null,
      proState: null,
      rejectReasonVisible: false,
      status: null,
      businessDeptOpinion: {
        use_method: "",
        use_for: "",
      },
      sciTechDeptOpinion: {
        implement_time: "",
        receive_dept: "",
        security_level: "",
        replace: "",
      },
      sciTechDeptAduitPersons: [],
      depAduitPersons: [],
      checkStd:false
    };
  },
  beforeMount() {
    this.getList();
  },
  mounted() {
    this.applyForm = this.deepClone(applyForm);
    this.businessProId = this.$route.params.id;
    this.getStdPurchaseDetail();
  },
  methods: {
    /**
     * 获取订购列表
     */
    getList() {
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
            this.setStdList()
          }
        });
      
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
      if(this.status == 5 && this.checkStd == true){
        this.checkPurchase()
      }
    },
    /**
     * 部门审批人列表
     */
    getDeptAduitPersons() {
      const req = {
        deptIds: this.applyForm.applyDeptId + "",
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
     * 科技管理部审批人
     */
    getsciTechDeptAduitPersons() {
      const req = {
        deptIds: "200",
        roleKeys: "deptLeader,principalLeader",
      };
      listUserByDeptsAndRoleKeys(req).then((res) => {
        const { code, msg, data } = res;
        if (code === 200) {
          this.sciTechDeptAduitPersons = data;
        } else {
          // this.$message.error(msg);
        }
      });
    },
    /**
     * 获取标准购置详情
     */
    getStdPurchaseDetail() {
      Api.getPurchaseDetail(this.businessProId).then((res) => {
        const { code, msg, data } = res;
        if (code == 200) {
          this.applyForm = data;
          // Object.keys(data).map((key) => {
          //   this.applyForm[key] = data[key];
          // });
          this.proState = data.projectState;
          this.docEntry = [];
          if (
            this.applyForm.docEntry == null ||
            this.applyForm.docEntry == ""
          ) {
            this.docEntry.push(this.deepClone(docEntryItem));
          } else {
            this.docEntry = JSON.parse(this.applyForm.docEntry);
            this.getList();
          }
          if (
            data.applierId == this.userInfo.userId &&
            data.projectStatus == 5
          ) {
            this.isEdit = true;
          } else {
            this.hasAuth = data.hasAuth;
          }
          this.status = data.projectStatus;
          if (
            data.businessDeptOpinion != "" &&
            data.businessDeptOpinion != null
          ) {
            this.businessDeptOpinion = JSON.parse(data.businessDeptOpinion);
          }
          if (
            data.sciTechDeptOpinion != "" &&
            data.sciTechDeptOpinion != null
          ) {
            this.sciTechDeptOpinion = JSON.parse(data.sciTechDeptOpinion);
          }
          if (this.hasAuth == true && this.proState == 1305) {
            this.isEdit = true;
          }
          if(this.isEdit == true && this.status==5){
            this.checkPurchase();
          }
          this.getDeptAduitPersons();
          this.getsciTechDeptAduitPersons();
        } else {
          this.$message.error(msg);
        }
      });
    },
    /**
     * 获取UserName
     */
    getUserName(ids) {
      let arr = [];
      if (ids != "" && ids != null) {
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
     * 获取部门
     * @param {*} deptId 要查询的部门ID
     */
    getDeptName(deptId) {
      const sourceDeptList = this.$cache.session.getJSON("sourceDeptList");

      if (deptId == null) return "—";
      const dept = _.find(sourceDeptList, { deptId: deptId });
      return dept ? dept.deptName : "-";
    },
    /**
     * 提交标准购置(暂存)
     */
    update(flag = null) {
      let confirmInfo = {
        title: `确定求修改标准购置：《${this.applyForm.projectName}》吗？`,
        icon: "修改标准购置",
        btn: "确定修改",
      };
      if (flag == 1) {
        confirmInfo = {
          title: `确定求暂存标准购置：《${this.applyForm.projectName}》吗？`,
          icon: "暂存标准购置",
          btn: "确定暂存",
        };
        this.applyForm.sciTechDeptOpinion = JSON.stringify(
          this.sciTechDeptOpinion
        );
      }
      this.$confirm(confirmInfo.title, confirmInfo.icon, {
        confirmButtonText: confirmInfo.btn,
        cancelButtonText: "取消",
        center: true,
      })
        .then(() => {
          if (this.applyForm.sciTechDeptApproveUserId == null) {
            this.$message.warning("请先选择科技管理部标准审核人");
            return;
          }
          if (this.testDoc() == true) {
            // 修改
            this.isLoading = true;
            let ids = [];
            this.docEntry.forEach((item) => {
              ids.push(item.id);
            });
            if (
              this.businessDeptOpinion.use_for == "" ||
              this.businessDeptOpinion.use_for == null
              ) {
                this.$message.warning("标准适用项目不能为空");
                return
            } 
            this.applyForm.businessDeptOpinion = JSON.stringify(
              this.businessDeptOpinion
            );
        this.applyForm.docEntry = JSON.stringify(this.docEntry)
            Api.updateStdLiaisonApplyOnline(this.applyForm).then((res) => {
              const { code, msg } = res;
              this.isLoading = false;
              if (code == 200) {
                this.$message.success("标准购置已更新");
                this.getStdPurchaseDetail();
                this.isEdit = false;
              }
            });
          }
        })
        .catch(() => {});
    },
    upateStdPur() {
      if (this.testDoc() == true) {
        // 修改
        this.isLoading = true;
        let ids = [];
        this.docEntry.forEach((item) => {
          ids.push(item.id);
        });
        this.applyForm.docEntry = JSON.stringify(this.docEntry)
         if (
            this.businessDeptOpinion.use_for == "" ||
            this.businessDeptOpinion.use_for == null
            ) {
              this.$message.warning("标准适用项目不能为空");
              return
          } 
        this.applyForm.businessDeptOpinion = JSON.stringify(
          this.businessDeptOpinion
        );
        Api.updateStdLiaisonApplyOnline(this.applyForm).then((res) => {
          const { code, msg } = res;
          if (code == 200) {
            Api.updateStdPurchaseState(ids.join(",")).then((re) => {});
            Api.stdLiaisonApplyOnlineByBusinessId(this.businessProId).then(
              (resStd) => {
                this.isLoading = false;
                const { code, msg } = resStd;
                if (code == 200) {
                  this.$message.success("标准购置已更新");
                  this.$router.push("/work/stdPurchase");
                } else {
                  this.$message.error(msg);
                }
              }
            );
          } else {
            // this.$message.error(msg);
          }
        });
      }
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
     * 检查标准是否被购置
     */
    checkPurchase(){
      let ids = [];
      this.docEntry.forEach((item) => {
        ids.push(item.id);
      });
      Api.checkPurchase({idList:ids.join(',')}).then(res=>{
        const {code,data,msg}=res
        if(data == null){
            this.checkStd = false;
        }else{
          data.forEach(id=>{
            this.docEntry.filter(item=>{
              if(item.id == id){
                item['check']=true
              }
            })
          })
          this.checkStd = true;
          this.$message.warning(msg)
        }

      })
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
    cancel(flag) {
      if (flag == 0) {
        history.go(-1);
      } else if (flag == 1) {
        this.$router.push("/work/stdPurchase");
      } else if (flag == 2) {
        this.isEdit = false;
        this.getPurchaseDetail();
      }
    },
    /**
     * 审核
     */
    toExamine() {
      switch (this.proState) {
        case 1302:
          this.exaTilte = "标准化审核";
          break;
        case 1303:
          this.exaTilte = "部门管领导审批";
          break;
        case 1304:
          this.exaTilte = "科技管理部领导审批";
          break;
      }
      if (
        this.proState == 1302 &&
        this.applyForm.sciTechDeptApproveUserId == null
      ) {
        this.$message.warning("请先选择科技管理部标准审核人");
        return;
      }
      this.exaVisible = true;
    },
    /**
     * 提交/取消审核
     */
    todoExamine() {
      this.getStdPurchaseDetail();
      this.exaVisible = false;
      this.exaTilte = "";
    },
    /**
     * 查看驳回终止
     */
    checkRejectReason(flag) {
      this.rejectReasonVisible = flag;
    },
    /**
     * 保存
     */
    save() {
      if (
        this.applyForm.receiverName == "" ||
        this.applyForm.receiverName == null
      ) {
        this.$message.warning("文件接收人不能为空");
        return;
      }
      if (
        this.sciTechDeptOpinion.implement_time == "" ||
        this.sciTechDeptOpinion.implement_time == null
      ) {
        this.$message.warning("实施时间不能为空");
        return;
      }
      if (
        this.sciTechDeptOpinion.receive_dept == "" ||
        this.sciTechDeptOpinion.receive_dept == null
      ) {
        this.$message.warning("需发放部门不能为空");
        return;
      }
      if (
        this.sciTechDeptOpinion.security_level == "" ||
        this.sciTechDeptOpinion.security_level == null
      ) {
        this.$message.warning("保密等级不能为空");
        return;
      }
      // if (
      //   this.sciTechDeptOpinion.replace == "" ||
      //   this.sciTechDeptOpinion.replace == null
      // ) {
      //   this.$message.warning("替代关系不能为空");
      //   return;
      // }

      if (
        this.businessDeptOpinion.use_for == "" ||
        this.businessDeptOpinion.use_for == null
      ) {
        this.$message.warning("标准适用项目不能为空");
      } else {
        this.applyForm.businessDeptOpinion = JSON.stringify(
          this.businessDeptOpinion
        );
        this.applyForm.sciTechDeptOpinion = JSON.stringify(
          this.sciTechDeptOpinion
        );
        this.isLoading = true;

              let ids = [];
      this.docEntry.forEach((item) => {
        ids.push(item.id);
      });
      this.applyForm["applyIdList"] = ids;
        this.$confirm(
          `确认提交完成标准购置吗？`,
          "提交标准购置",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            center: true,
          }
        )
          .then(() => {
            Api.completeScpStdPurchase(this.applyForm).then((res) => {
              const { code, msg } = res;
              this.isLoading = false;
              if (code == 200) {
                this.getStdPurchaseDetail();
                this.$message.success("标准购置已保存");
                this.isEdit = false;
              } else {
                // this.$message.error(msg);
              }
            });
          })
          .catch(() => {
            this.isLoading = false
          });
      }
    },
    /**
     * 导出表格
     */
    exportTable() {
      this.$confirm(`确定导出标准文件购置申请单？`, "导出表格", {
        confirmButtonText: "确定导出",
        cancelButtonText: "取消",
        center: true,
      })
        .then(() => {
          const req = {
            id: this.applyForm.id,
          };
          this.XHRDownloadFile("post", "/scplat/purchase/saveFile", req, null);
        })
        .catch(() => {});
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
          display: flex;
          flex-wrap: wrap;
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
          margin: 0;
          margin-right: 12px;
          width: 320px;
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
    // display: flex;
    flex-direction: row;
    justify-content: center;
    align-content: center;
  }
}
</style>
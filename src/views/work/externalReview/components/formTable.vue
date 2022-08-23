<template>
  <BztDialog
    :dialogInfo="dialogInfo"
    @close="closeDialog($event, 0)"
    :appendTobody="true"
  >
    <template slot="body">
      <Table :tableData="tableData" :disabled="disabled" />
    </template>
  </BztDialog>
</template>
<script>
import { BztDialog, BztTable } from "@components/basicCom/index.js";
import Table from "./table.vue"
import Api from "@api/process";
import { mapGetters } from "vuex";
export default {
  components: {
    BztDialog,
    BztTable,
    Table
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  props:{
    visiable: {
      type: Boolean,
      default: false,
    },
    taskInfo: {
      type: Object,
      default: null,
    },
    type:{
      type: Number,
      default: 2,
    }
  },
  data() {
    return {
      dialogInfo: {
        visible: false,
        title: "中车浦镇技术标准复审项目及复审结论汇总表",
        width: "1400px",
        footer: true,
        loadding: false,
      },
      disabled:false,
      tableData: [{
          standardId:'',
          stdName: '',
          stdNo:'',
          isRelevant:'',
          conclusion:'',
          opinion:'',
          reason:'',
          processorTaskId:'',
          detailItems:[],
          10:'',
          11:'',
          20:'',
          21:'',
          22:'',
          23:'',
          24:'',
          25:'',
          26:'',
        }]
      };
  },
  methods: {
    closeDialog(e) {
      if(e==true){
        const req = {
          opinionList:[],
          taskId: this.taskInfo.id,
          processorTaskId: this.taskInfo.childTaskId,
          processorId: this.userInfo.userId,
          processAs: 2,
          hasFinished: 1,
          projectType: 7,
        };
        let flag = true
        this.tableData.forEach((item)=>{
          if(item.isRelevant==0&&item.conclusion!=0){
            if(!item.reason){
              flag=false
              return this.$message.warning("请具体说明原因")
            }
          }
          let detailItems = []
          for(let key in item){
            if(item[key]===true){
             detailItems.push(key)
            }
          }
          let currentItem = {
            isRelevant :item.isRelevant,
            reason:item.reason,
            detailItems:detailItems.length?detailItems.join(","):'',
            standardId:item.standardId,
            conclusion:item.conclusion,
            opinion:item.reason,
            isRelevant:item.isRelevant,
            processorTaskId: this.taskInfo.childTaskId,
          }
          req.opinionList.push(currentItem)
        })
        if(flag){
          Api.importOpinion(req).then((res) => {
            const { code, msg } = res;
            if (code === 200) {
              this.$message.success("已审核");
              this.$emit("save", false);
            }
            this.$set(this.dialogInfo, "loadding", false);
            this.dialogInfo.loadding = false;
            this.dialogInfo.visible = false;
          });
        }
        
      }else{
        this.$emit("save",false)
      }
    },
    getInfo(){
      let req = {
        rwTaskId: this.$route.params.rwTaskId ||this.taskInfo.id,
        type:this.type,
        projectType:this.type==1?13:15,
        processorTaskId:this.taskInfo.childTaskId
      }
      this.tableData = []
      Api.findStandardByTaskId(req).then((res) => {
        const { code, msg,data } = res;
        if (code === 200) {
          let flag = data.filter((item)=>{
            return item.conclusion!==null&&item.conclusion!==""
          })
          console.log(flag,"flafff")
          if(flag&&flag.length){
            let tableData = {
                standardId:'',
                stdName: '',
                stdNo:'',
                id:'',
                isRelevant:'',
                conclusion:'',
                opinion:'',
                reason:'',
                processorTaskId:'',
                detailItems:[
                  {

                  }
                ],
                10:'',
                11:'',
                20:'',
                21:'',
                22:'',
                23:'',
                24:'',
                25:'',
                26:'',
              }
              console.log(data,"datatat")
            data.forEach((item,i)=>{
              console.log(item.conclusion!==null&&item.conclusion!=="","999998")
              let detailItems = item.detailItems!=""&&item.detailItems!=null?item.detailItems.split(","):[]
              let object = {
                standardId:item.pdcaStdlist.id,
                stdName:item.pdcaStdlist.stdName,
                stdNo:item.pdcaStdlist.stdNo,
                isRelevant:item.isRelevant,
                conclusion:item.conclusion,
                reason:item.reason,
                id:item.id,
                disabled:item.conclusion!==null&&item.conclusion!==""? true : false
              }
              for(let key in tableData){
                if(detailItems.length&&detailItems.indexOf(key)!=-1){
                  object[key] = true
                }
              }
              // this.disabled = true
              // this.dialogInfo.footer = false
              console.log(object,"oooo")
              this.tableData.push(object)
            })
          }else{
            data.forEach((item,i)=>{
              let pdcaStdlist = item.pdcaStdlist
              this.tableData.push(
                {
                  standardId:pdcaStdlist.id,
                  stdName: pdcaStdlist.stdName,
                  stdNo:pdcaStdlist.stdNo,
                  isRelevant:'',
                  conclusion:'',
                  opinion:'',
                  reason:'',
                  processorTaskId:'',
                  detailItems:[],
                  10:'',
                  11:'',
                  20:'',
                  21:'',
                  22:'',
                  23:'',
                  24:'',
                  25:'',
                  26:'',
                }
              )
            })
          }
        } 
      });
    }
  },
  mounted(){
    this.dialogInfo.visible = this.visiable
    this.getInfo()
  }
};
</script>
<style lang="scss">
</style>
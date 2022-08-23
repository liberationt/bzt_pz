<template>
    <div class="comment-container">
        <div class="forms">
            <div class="comment-item" style="display:flex;">
                <label class="comment-item-label">意见范围：</label>
                <span class="comment-item-content">
                    <el-radio-group v-model="form.optionRange">
                        <el-radio v-for="(item, idx) in optionRangeOptions" :key="idx" :label="item.value" >{{item.label}}</el-radio>
                    </el-radio-group>
                </span>
            </div>
            <div class="comment-item" v-if="form.optionRange == 1">
                <label class="comment-item-label">章节：</label>
                <span class="comment-item-content">
                    <span v-if="form.chapter">{{form.chapter}}</span>
                    <span v-else class="placeholder">请选择内容进行引用</span>
                </span>
            </div>
            <div class="comment-item" v-if="form.optionRange == 1">
                <label class="comment-item-label">条款：</label>
                <span class="comment-item-content">
                    <span v-if="form.chapter">
                        <span style="margin-right:10px">{{form.entries}}</span>
                    </span>
                    <span v-else class="placeholder">请选择内容进行引用</span>
                </span>
            </div>
            <div class="comment-item" v-if="form.optionRange == 1">
                <label class="comment-item-label">选择内容：</label>
                <span class="comment-item-content">
                    <span v-if="form.chapter">{{form.content}}</span>
                    <span v-else class="placeholder">请选择内容进行引用</span>
                </span>
            </div>
            <div class="comment-item">
                <label class="comment-item-label">意见内容：</label>
                <el-input type="textarea" v-model="form.comment" :rows="3" placeholder="意见内容" clearable />
            </div>
            <div class="comment-item">
                <label class="comment-item-label">提出人/提出单位：</label>
                <div>
                    <el-breadcrumb separator="/">
                    <el-breadcrumb-item>{{this.userInfo.nickName}}</el-breadcrumb-item>
                    <el-breadcrumb-item>{{this.userInfo.dept.deptName}}</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
            </div>
            <div class="comment-item">
                <label class="comment-item-label">联系方式：</label>
                <el-input v-model="form.contactInformation" placeholder="联系方式" clearable />
            </div>
            <div class="btns">
                <el-button size="mini" type="cyan" icon="el-icon-chat-dot-round" :disabled="!checkSubmitComment" @click="submitComment" v-loading="loadingSubmit">发表意见</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    // import { addOpinion } from "@/api/scplat/write/opinion";
    import { mapGetters } from "vuex";
    import Api from "@api/process";
    export default{
        name: "comment",
        props:{
            projectData: Object,
            selectionData: Object
        },
        watch:{
            // 正文内容点击章节的节点后将数据内容置入意见表单中
        	selectionData:{
                handler(selectionData) {
                    if(!_.isEmpty(selectionData)){
                        this.setCommentData()
                    }
                },
                immediate: true,
                deep: true
            }
        },
        data(){
            return {
                user: null,
                docData: null,
                form:{
                    optionRange: 1,
                    chapter: "",
                    entries: "",
                    content: "",
                    comment: "",
                    outlineId: "",
                    contactInformation: ""
                },
                replyContent: "",
                replyData: null,
                lastId: 0,
                userList: [],
                loadingSubmit: false,
                optionRangeOptions: [
                    {"value":1, "label":"章节"},{"value":2, "label":"全文"}
                ],
            }
        },
        computed:{
            ...mapGetters(["userInfo"]),
            checkSubmitComment(){
                if(this.form.optionRange == 1){
                    if(this.form.chapter != null && this.form.chapter != "" && this.form.comment != ""){
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    if(this.form.comment != ""){
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        },
        methods:{
            // 意见提交所对应的正文内容
            setCommentData(){
                if(this.selectionData.outlineArr.length > 0 && this.selectionData.outlineArr[0].length > 1){
                    let selection = this.selectionData.outlineArr[0];
                    let chapter = "";
                    if(selection[1].outlineCatalog == null){
                        chapter = selection[1].outlineTitle;
                    } else {
                        if(selection[1].appendix){
                            chapter = "附录" + selection[1].letter + " " + selection[1].outlineTitle;
                        } else {
                            chapter = selection[1].outlineCatalog + " " + selection[1].outlineTitle;
                        }
                    }
                    this.form.chapter = chapter;
                    this.form.entries = selection[selection.length - 1].outlineCatalog;
                    this.form.outlineId = selection[selection.length - 1].outlineId;
                    this.form.content = this.selectionData.text;
                }
            },
            clearForm(){
                this.form = {
                    optionRange: 1,
                    chapter: "",
                    entries: "",
                    content: "",
                    comment: "",
                    outlineId: "",
                    contactInformation: this.form.contactInformation
                }
            },
            // 提交评论
            submitComment(){

                this.$confirm("确定要发表意见吗？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                .then(() => {
                    this.loadingSubmit = true;

                    if(this.form.optionRange == 2){
                        this.form.chapter = "全文";
                        this.form.entries = null;
                        this.form.content = null;
                        this.form.outlineId = null;
                    }

                    let data = {
                        projectId: this.projectData.id,
                        projectType: this.projectData.projectType,
                        agree: 1,   // 有意见
                        contactInformation: this.form.contactInformation,
                        chapter: this.form.chapter,
                        entries: this.form.entries,
                        content: this.form.content,
                        outlineId: this.form.outlineId,
                        comment: this.form.comment
                    }
                    Api.addOpinion(data).then(response=>{
                        if(response.code === 200){
                            this.$message.success("提交成功！");
                            this.clearForm();
                            // 刷新父组件意见数量
                            this.$emit("refresh");
                        }
                        this.loadingSubmit = false;
                    })
                })
                .catch(() => {});
            },
        },
    }
</script>

<style lang="scss" scoped>
    .comment-container{
        padding:0;
        border: 1px #ddd solid;
        border-radius: 10px;
        overflow: hidden;
        >.forms{
            padding: 10px;
            background-color: rgba(0,0,0,.05);
            .d-title{
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .btns{
                padding: 10px 0;
                text-align: right;
            }
            .comment-item{
                margin: 5px 0;
                .comment-item-label{
                    color:#303133;
                }
                .comment-item-content{
                    color: #606266;
                    .entries-edit{
                        cursor: pointer;
                        color: #409EFF;
                        margin-left: 10px;
                        &:hover{
                            text-decoration: underline;
                        }
                    }
                    .placeholder{
                        color: #C0C4CC;
                    }
                }
            }
            
        }
    }
</style>

<template>
    <div class="template-page-container">
        <sam-editor ref="samEditor" :data="editorSetting" @change="changeEvent" />
    </div>
</template>

<script>
    import { samEditor } from 'sam-editor';
    import 'sam-editor/dist/sam-editor.css';
    import { stdKinds } from '@/config/editorOptions';
    export default {
        name: 'template-cover',
        components: {
            samEditor
        },
        props: {
            kind: String,
            name: String,
            data: Object
        },
        watch: {
            data: {
                handler(obj) {
                    if(!_.isEmpty(obj) && this.loaded) {
                        this.$nextTick(() => {
                            this.loadPageData(obj.content);
                        })
                    }
                },
                deep: true,
                immediate: true
            }
        },
        data() {
            var uuid = this.$editorUtils.guid()
            return {
                stdKinds,
                currNode: null,
                loaded: false,
                tmplId: uuid,
                editorSetting: {
                    nodeURL: process.env.VUE_APP_REMOTE_API,
                    author: {},
                    admin: true,
                    setTemplate: true,
                    menuBar: false,                                 // 隐藏菜单
                    hideSideBar: true,
                    toolbar1:'undo redo | insertTag | queue | formatting | indent2em lineheight | paragraph-btn | example-btn zhu-btn | code',
                    contextmenu: 'remove-btn',
                    quickbars: '',
                    htmlContent: `<div class="page-container"><div class="info-block" data-id="${uuid}"></div></div>`,
                }
            }
        },
        methods: {
            loadPageData(data=null) {
                var htmlContent = '';
                if (!this.data) {
                    var stdData = _.find(this.stdKinds, { value:this.kind });
                    if (stdData) {
                        htmlContent = stdData.cover;
                    } else {
                        this.$alert('默认模板未定义！')
                        return;
                    }
                } else {
                    htmlContent = this.data.content;
                    this.tmplId = this.data.tmplId;
                }

                htmlContent = `<div class="page-container"><div class="info-block ${this.name}" data-id="${this.tmplId}">${htmlContent}</div></div>`;
                this.$refs.samEditor.interFaceAction({ act:'resetContent', htmlContent });
            },
            async getBlockContent() {
                return await this.$refs.samEditor.interFaceAction({ act:'getBlockContent', id: this.tmplId });
            },
            /**
             * @description 监听编辑器事件上报
             * @param {Object} data
             */
            changeEvent(data) {
                if(data.act === 'click') {
                    this.currNode = data.node;
                    this.$emit('change', data.node)
                // 编辑器加载完成赋予数据
                } else if (data.act === 'loaded') {
                    this.loaded = true;
                    this.loadPageData();
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
    .template-page-container{
        height: 100%;
        width: 100%;
    }
</style>

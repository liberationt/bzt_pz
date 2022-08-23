<template>
    <div class="parse-xml-container">
        <div class="upload">
            <h3>解析器DOCX文档</h3>
            <el-upload action="#" :show-file-list="false" accept=".docx" :http-request="httpRequest" :before-upload="handleBeforeUpload" style="display: inline;">
                <el-button size="small">点击上传docx文件</el-button>
            </el-upload>
            <el-select size="small" v-model="xmlId" style="margin:0 20px; width:400px;">
                <el-option v-for="(item, idx) in xmlSplitList" :key="idx" :label="item.txt_content" :value="item.id" />
                <div style="padding:5px 10px; border-top:1px solid #EEE">
                    <span v-for="n in xmlContentList.length" :key="n" style="margin: 0 2px; cursor:pointer" @click="movePageNum(n)">{{n}}</span>
                </div>
            </el-select>
            <el-button size="small" style="margin-left: 20px;" @click="getXmlContent">TEST Xml content</el-button>
        </div>
        <div class="upload">
            <div class="codes">
                <div>
                    <h1>XML内容</h1>
                    <sam-code ref="code1" :data="xmlCode" :mode="{'name':'application/xml'}" format />
                    <div class="btns">
                        <el-upload action="#" :show-file-list="false" accept=".xml" :http-request="httpRequest" :before-upload="readXmlFile" style="display: inline;">
                            <el-button size="small">点击上传XML文件</el-button>
                        </el-upload>
                        <el-button size="small" style="margin-left: 20px;" @click="parseXmlToJson">XML->JSON</el-button>
                    </div>
                </div>
                <div>
                    <h1>JSON转换内容</h1>
                    <sam-code ref="code2" :data="jsonCode" :mode="{'name':'application/json'}" isJson />
                    <div class="btns">
                        <el-button size="small" @click="parseJsonToHtml">JSON->HTML</el-button>
                    </div>
                </div>
                <div class="html-content">
                    <h1>HTML内容</h1>
                    <div class="html-page" v-html="htmlCode" />
                    <div class="btns">
                        <!-- <el-button size="small" style="margin-left: 20px;" @click="parseJsonToHtml">解析JSON</el-button> -->
                    </div>
                </div>
            </div>
            <!-- <el-upload action="#" :show-file-list="false" accept=".xml" :http-request="httpRequest" :before-upload="readXmlFile" style="display: inline;">
                <el-button size="small">点击上传XML文件</el-button>
            </el-upload>
            <el-button size="small" style="margin-left: 20px;" @click="parseXmlToJson(xmlCode)">解析XML</el-button> -->
        </div>
    </div>
</template>

<script>
    import { uploadDocFile, uploadProcessMsg } from '@/api/stdEditor/docTrans';
    import { documentServer, dbServer } from '@/api/stdEditor/nodeServer';
    import samCode from "@/components/samCode";
    export default {
        name:'parse-xml',
        components: {
            samCode
        },
        computed: {
            xmlSplitList() {
                return this.xmlContentList[this.pageNum];
            }
        },
        data() {
            return {
                loading: false,
                xmlCode: '<root a="nice" b="very nice" ><a>wow</a></root>',
                jsonCode: { "root": {  "a": "wow" } },
                htmlCode: '<div>Test</div>',
                pageNum: 0,
                xmlContentList: [],
                xmlId: ''
            }
        },
        watch: {
            xmlId: {
                handler(val) {
                    this.setXmlContent(val);
                },
                immediate: true
            }
        },
        methods: {
            httpRequest() {
                return false;
            },
            movePageNum(v) {
                this.pageNum = v - 1;
            },
            setXmlContent(id) {
                var xmlData = _.find(this.xmlSplitList, { id });
                if (xmlData) {
                    this.xmlCode = xmlData.xml_content;
                }
            },
            parseJsonToHtml(val) {

            },

            getXmlContent() {
                this.openDocByHtml({
                    htmlPath: 'http://192.168.0.239:8084/upload/2022-04-12/1649750803073.html'
                });
            },

            /**
             * @description 上传文档
             * @param {Object} file
             */
            readXmlFile(file) {
                var reader = new FileReader();
                reader.onload = (e) => {
                    this.xmlCode = e.target.result;
                };
                reader.readAsText(file);
            },
            async parseXmlToJson() {
                var xmlStr = this.$refs.code1.getValue();
                var condition = {
                    type:'xmlToJson',
                    data: xmlStr
                }
                var res = await documentServer(condition);
                if (res.error_code === 200) {
                    this.jsonCode = res.data;
                }
                // console.log('parseXmlToJson=>', JSON.stringify(res.data))
            },

            /**
             * @description 监听DOC文件上传后解析集成
             * @param {Int}  msgBoxId
             * @param {String}  htmlContent
             * @param {String}  htmlPath
             */
            getUploadProcess(msgBoxId=0, data={}) {
                const getBoxMsg = async () => {
                    var res = await uploadProcessMsg({msgBoxId});
                    if (res.code === 200) {
                        return res.data.msgs;
                    }
                    return [];
                }

                var timeHandler = setInterval(async () => {
                    let res = await getBoxMsg();
                    if(res.includes('finished')) {
                        console.log('getUploadProcess=>', data)
                        clearInterval(timeHandler);
                        this.loading = false;
                        // this.openDocByHtml(data);
                    }
                }, 200)
            },

            async openDocByHtml(data) {
                var fileName = data.htmlPath; // "http://192.168.0.239:8084/upload/2022-04-12/1649746527882.html";
                var nameSplit = fileName.split('/');
                var docId = nameSplit[nameSplit.length -1].replace(/\.html/g, '');
                console.log(docId);

                var sql = 'SELECT * FROM wordparser.word_content WHERE doc_id="' + docId + '" order BY doc_part_id ASC';
                var condition = {
                    type: 'query',
                    sql
                }
                var res = await dbServer(condition);
                console.log('openDocByHtml=>', res)
                if (res.error_code === 200) {
                    this.xmlContentList = _.chunk(res.data, 50);
                }
            },

            handleBeforeUpload(file) {
                var msgBoxId = parseInt(Math.random()*10000+99999, 10);
                var formData = new FormData();
                formData.append("file", file);
                formData.append("msgBoxId", msgBoxId);

                uploadDocFile(formData).then(res => {
                    console.log('uploadDocFile=>', res);
                    if (res.code === 200) {
                        this.getUploadProcess(msgBoxId, res.data);
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .parse-xml-container{
        height:100%;
        .upload {
            padding:15px;
            .codes{
                display:flex;
                >div {
                    flex: 1;
                    margin: 0 5px;
                    >h1{
                        font-size:12px;
                        line-height:35px;
                    }
                    ::v-deep .code-content, .html-page{
                        height: 300px;
                        border:1px solid #DDD;
                    }
                    .btns{
                        height: 40px;
                        padding: 10px 0;
                    }
                }
            }
        }
    }
</style>

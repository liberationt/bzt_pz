export const editorConfig = {
    admin: true,
    editorURL: process.env.VUE_APP_EDITOR_URL, // JAVA接口地址
    nodeURL: process.env.VUE_APP_REMOTE_API, // nodeServer服务器地址
    pluginURL: process.env.VUE_APP_PLUGIN_URL, // 外挂插件地址
    readonly: false,
    private: true,
    setTemplate: false,
    isStandard: true, // 是否为标准编写
    mergeDoc: false, // 文档初始化后是否自动合并正文
    chapter: ['6', '8', '9'], // 章节标识;用于目次数据的筛选
    // 默认目次选项
    catalogues: {
        type1: true,
        type2: true,
        type3: true,
        type4: true,
        type5: true,
        type6: true,
        leve11: true
    },
    page: {
        size: 'A4',
        width: '210mm',
        height: '297mm',
        padding: '20mm 25mm 20mm 20mm',
        layout: 'doubleSided',
        number: 'Q/CY 100—2021'
    },
    logo: require(`@/assets/logo/logo1.png`),
    navShow: true,
    exportStruct: true, // 是否在保存数据时同时导出结构化数据
    menu: {
        file: { title: 'File', items: 'newStandard openFile | save saveAs | searchreplace preview print | exportFile | close-btn' },
        edit: { title: 'Edit', items: 'undo redo | cut copy paste | searchreplace' },
        insert: { title: 'Insert', items: 'charmap | paragraph-btn image inserttable | math graphy | hr' },
        pageElement: { title: 'pageElement', items: 'cover catalogue prefaceWord introWord addendixWord referenceWord | indexWord indexMarker | page-type' },
        levelStyle: { title: 'levelStyle', items: 'chapterTitle | chapter1 chapter2 chapter3 chapter4 chapter5 | notTitle1 notTitle2 notTitle3 notTitle4 notTitle5 | list1 list2 list3 list4 list5 list6 list7' },
        Tools: { title: 'Tools', items: 'validateFormat validatDms | translate' },
        help: { title: 'Help', items: 'help concatus | bzt-ver upgrade' }
    },
    // 菜单栏
    menuBar: 'file edit insert pageElement levelStyle elementStyle Tools help',
    // 第一行工具栏
    toolbar1: 'undo redo | close-btn save saveAs | cover catalogue prefaceWord introWord chapterWord addendixWord referenceWord indexWord indexMarker | chapterTitle chapter1 chapter2 chapter3 chapter4 chapter5 notTitle1 notTitle2 notTitle3 notTitle4 notTitle5 | list1 list2 list3 list4 list5 list6 list7 | entryTitle notTitle',
    // 第二行工具栏
    toolbar2: 'paragraph-btn image table | example-btn zhu-btn zhu-imgtable footer-btn imgtitle tabletitle | math graphy | quote-btn term quota | comment  | page-type exportFile | translate searchreplace',
    // 快捷工具条
    quickbars: 'bold italic underline strikethrough superscript subscript',
    // 公式下拉菜单
    mathItems: ['custom', 'hand', 'number'], // 自定义 手写 编号
    // 上下文菜单
    contextmenu: 'undo redo | table | image',
    draftTimes: 30000,
    htmlContent: ``
};

export const styleccs = '';

export const pagePadding = {
    left: '35mm 25mm 20mm 20mm',
    right: '35mm 20mm 20mm 25mm'
}

export const docVersion = [
    { label: '草案稿', value: 1 },
    { label: '征求意见稿', value: 2 },
    { label: '送审稿', value: 3 },
    { label: '报批稿', value: 4 }
]

export const fontSize = {
    "一号": '28pt',
    "二号": '21pt',
    "小二号": '18pt',
    "三号": '15.75pt',
    "四号": '14pt',
    "小四号": '12pt',
    "五号": '10.5pt',
    "小五号": '9pt',
    "六号": '7.875pt'
}

export const catalogueTypes = [
    { key: 'leve11', label: '一级条标题', value: true },
    { key: 'leve12', label: '二级条标题', value: false },
    { key: 'leve13', label: '三级条标题', value: false },
    { key: 'leve14', label: '四级条标题', value: false },
    { key: 'leve15', label: '五级条标题', value: false },
    { key: 'appendix0', label: '附录章标题', value: true },
    { key: 'appendix1', label: '附录一级条标题', value: true },
    { key: 'appendix2', label: '附录二级条标题', value: false },
    { key: 'appendix3', label: '附录三级条标题', value: false },
    { key: 'appendix4', label: '附录四级条标题', value: false },
    { key: 'appendix5', label: '附录五级条标题', value: false },
    { key: 'imgTitle', label: '图标题', value: false },
    { key: 'tableTitle', label: '表标题', value: false }
]

export const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

export const numberChar = {
    roma: ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ', 'Ⅷ', 'Ⅸ', 'Ⅹ', 'Ⅺ', 'Ⅻ', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVII', 'XIX', 'XX'],
    lower: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n']
}

export const tagType = [
    { label: "文本框输入", value: 1 },
    { label: "富文本输入", value: 2 },
    { label: "日期框选择", value: 5 },
    { label: "上传", value: 4 },
    { label: "绑定远程数据", value: 3 }
]

export const feedbackTypes = [
    { label: '采纳', value: 1 },
    { label: '部分采纳', value: 2 },
    { label: '不采纳', value: 3 },
]

export const outlineTypes = [
    { type: 1, label: '前言', orderNum: 0, infoNum: 0 },
    { type: 2, label: '引言', orderNum: 1, infoNum: 1 },
    { type: 3, label: '范围', orderNum: 2, infoNum: 2 },
    { type: 4, label: '规范性引用文件', orderNum: 3, infoNum: 3 },
    { type: 5, label: '术语和定义', orderNum: 4, infoNum: 4 },
    { type: 6, label: '其他章节', orderNum: 5, infoNum: 5 },
    { type: 7, label: '章节条目', orderNum: 6, infoNum: 6 },
    { type: 8, label: '附录章节-规范性', orderNum: 7, infoNum: 7 },
    { type: 9, label: '附录章节-资料性', orderNum: 8, infoNum: 8 },
    { type: 10, label: '附录条目', orderNum: 9, infoNum: 9 },
    { type: 11, label: '参考文献', orderNum: 100, infoNum: 100 },
    { type: 12, label: '索引', orderNum: 200, infoNum: 200 },
    { type: 13, label: '空页面', orderNum: 300, infoNum: 300 },
    { type: 999, label: '章节标题', orderNum: 999, infoNum: 999 }
];

const outlineTemp = {
    ancestors: '1',
    outlineId: '1',
    outlineTitle: '我的标准文档',
    parentId: '0',
    isVisible: 1,
    orderNum: 0,
    children: [{
            ancestors: '1,2',
            content: null,
            isVisible: 1,
            levelNum: 1,
            orderNum: 0,
            outlineId: '2',
            outlineTitle: '前言',
            outlineType: 1,
            parentId: '1'
        },
        /*{
        	ancestors:'1,3',
        	content: null,
        	isVisible: 1,
        	levelNum: 1,
        	orderNum: 1,
        	outlineId: '3',
        	outlineTitle: "引言",
        	outlineType: 2,
        	parentId: '1'
        },*/
        {
            ancestors: '1,4',
            content: null,
            isVisible: 1,
            levelNum: 1,
            orderNum: 2,
            outlineCatalog: 1,
            outlineId: '4',
            outlineTitle: "范围",
            outlineType: 3,
            parentId: '1'
        },
        {
            ancestors: '1,5',
            content: null,
            isVisible: 1,
            levelNum: 1,
            orderNum: 3,
            outlineCatalog: 2,
            outlineId: '5',
            outlineTitle: "规范性引用文件",
            outlineType: 4,
            parentId: '1'
        },
        {
            ancestors: '1,6',
            content: null,
            isVisible: 1,
            levelNum: 1,
            orderNum: 4,
            outlineCatalog: 3,
            outlineId: '6',
            outlineTitle: "术语和定义",
            outlineType: 5,
            parentId: '1'
        },
        {
            ancestors: '1,7',
            content: null,
            isVisible: 1,
            levelNum: 1,
            orderNum: 5,
            outlineCatalog: 4,
            outlineId: '7',
            outlineTitle: "其他章节",
            outlineType: 6,
            parentId: '1'
        },
        {
            ancestors: '1,7',
            content: null,
            isVisible: 1,
            levelNum: 1,
            orderNum: 100,
            outlineId: '7',
            outlineTitle: "参考文献",
            outlineType: 11,
            parentId: '1'
        },

    ]
}

export const kindsType = { 'gb': 1100, 'hb': 1200, 'db': 6, 'tb': 1500, 'qb': 1400, 'zd': 7 };


export const stdKinds = [{
        type: 0,
        label: '空白文档',
        img: 'cover/empty.png',
        docType: '',
        id: "template-1",
        typeTitle: '文档标题',
        docData: {
            "docId": "0000-000",
            "stdCategory": 1,
            "stdEdition": "v1.0",
            "stdKind": 0,
            "docType": "",
            "stdNo": "",
            "stdName": "文档名称定义",
            "stdNameEn": "English Name",
            "stdTitle": "",
            "releaseDepartment": "润申标准化信息技术（上海）有限公司"
        },
        outline: {
            ancestors: '1',
            outlineId: '1',
            parentId: '0',
            outlineTitle: '文档主题名称',
            isVisible: 1,
            orderNum: 0,
            outlineType: 13,
            children: [{
                ancestors: '1,2',
                content: null,
                isVisible: 1,
                levelNum: 1,
                orderNum: 300,
                outlineId: '2',
                outlineTitle: '页面',
                outlineType: 13,
                parentId: '1'
            }]
        },
        htmlContent: `
			<div class="info-block cover fixed" title="封面" data-id="template-1" style="width: 210mm; height: 297mm; padding: 10mm 20mm 20mm 25mm;">
				<div class="content">
					<p class="std-name" contenteditable="true">{@stdName}</p>
					<p class="en-name" contenteditable="true">{@stdNameEn}</p>
					<p class="tag-content" contenteditable="true">{@stdEdition}</p>
				</div>
				<hr class="footer-hr" />
				<div class="footer-table">
					<div class="uc main-util" contenteditable="true">{@releaseDepartment}</div>
					<div class="ub" contenteditable="false">发布</div>
				</div>
			</div>
		`,
    },
    {
        type: 7,
        value: 'zd',
        label: '标准指导性技术文件',
        id: "template-1100",
        img: 'cover/GB.png',
        docType: 'GB/T',
        typeTitle: '中华人民共和国国家标准指导性技术文件标准',
        disabled: true,
        docData: {
            "docId": "0000-000",
            "ccsNumber": "xxx.xxx",
            "consistentSign": "与国际标准一致性程度的标识",
            "stdEdition": "测试版本Ver1.0",
            "icsNumber": "xxx.xxx",
            "stdCategory": 1,
            "stdKind": 1100,
            "stdName": "标准名称定义",
            "stdNameEn": "English Name",
            "stdNo": "2021-1130-010",
            "origStdNo": "XXXXXXXXX",
            "stdPerformDate": "2021-11-30",
            "stdPublishDate": "2021-12-30",
            "stdTitle": "中华人民共和国国家标准",
            "releaseDepartment": "润申标准化信息技术（上海）有限公司"
        },
        outline: outlineTemp,
        cover: `
            <div class="ics-ccs">
                <p class="ics" title="ICS编号"><span contenteditable="true" class="tag other icsNumber" data-tag="icsNumber" data-name="ICS编号"></span></p>
                <p class="ccs" title="CCS编号"><span contenteditable="true" class="tag other ccsNumber" data-tag="ccsNumber" data-name="CCS编号"></span></p>
            </div>
            <div class="icon icon_gb" data-icon="gb">
                <img style="width: 40mm; height: 20mm;" class="tag other" data-tag="stdSign" data-name="标准标志" crossOrigin="anonymous" src="http://192.168.0.239:9001/files/images/cover_gb.png" />
            </div>
            <h1 class="title gb">中华人民共和国国家标准</h1>
            <div class="numbers">
                <p class="tt gb">
                    <span contenteditable="true" class="tag other" data-tag="stdSign" data-name="标准标志"></span>
                    <span contenteditable="true" class="tag other" data-tag="stdVer" data-name="版本号"></span>
                    <span contenteditable="true" class="tag other" data-tag="stdNo" data-name="年代号"></span>
                </p>
                <p class="instead" style="display:{@dispalyInstead}; margin-top:5px;">
                    <span contenteditable="true" class="tag other" data-tag="origStdNo" data-name="修订原标准编号"></span>
                </p>
            </div>
            <hr class="title-hr" size="1" />
            <div class="content">
                <p class="std-name">
                    <span contenteditable="true" class="tag other" data-tag="stdName" data-name="标准名称"></span>
                </p>
                <p class="en-name">
                    <span contenteditable="true" class="tag other" data-tag="stdNameEn" data-name="标准英文译名"></span>
                </p>
                <p class="sign-name">
                    <span contenteditable="true" class="tag other" data-tag="consistentSign" data-name="与国际标准一致性程度的标识"></span>
                </p>
                <p class="tag-content">
                    <span contenteditable="true" class="tag other" data-tag="stdEdition" data-name="草案版次"></span>
                </p>
                <p class="tag-updatetime">
                    <span contenteditable="true" class="tag other" data-tag="updateTime" data-name="草案完成时间"></span>
                </p>
            </div>
            <div class="footer-publish">
                <span contenteditable="true" class="tag other" data-tag="stdPublishDate" data-name="发布时间"></span>
            </div>
            <div class="footer-put">
                <span contenteditable="true" class="tag other" data-tag="stdPerformDate" data-name="实施时间"></span>
            </div>
            <hr class="footer-hr" />
            <div class="footer-table">
                <div class="uc main-util">
                    <p>
                        <span contenteditable="true" class="tag other" data-tag="releaseDepartment" data-name="主发布单位">国家市场监督管理总局</span>
                    </p>
                    <p>
                        <span contenteditable="true" class="tag other" data-tag="secondDepartment" data-name="次发布单位">国家标准化管理委员会</span>
                    </p>
                </div>
                <div class="ub">发布</div>
            </div>
    	`,
        preface: `
                <div class="header-title"><p>前&nbsp; &nbsp; 言</p></div>
                <p style="text-indent: 2em;">请输入内容。</p>
        `,
    },
    {
        type: 1100,
        value: 'gb',
        label: '国家标准',
        id: "template-1100",
        img: 'cover/GB.png',
        docType: 'GB/T',
        typeTitle: '中华人民共和国国家标准',
        docData: {
            "docId": "0000-000",
            "ccsNumber": "xxx.xxx",
            "consistentSign": "与国际标准一致性程度的标识",
            "stdEdition": "测试版本Ver1.0",
            "icsNumber": "xxx.xxx",
            "stdCategory": 1,
            "stdKind": 1100,
            "stdName": "标准名称定义",
            "stdNameEn": "English Name",
            "stdNo": "2021-1130-010",
            "origStdNo": "XXXXXXXXX",
            "stdPerformDate": "2021-11-30",
            "stdPublishDate": "2021-12-30",
            "stdTitle": "中华人民共和国国家标准",
            "releaseDepartment": "润申标准化信息技术（上海）有限公司"
        },
        outline: outlineTemp,
        cover: `
            <div class="ics-ccs">
                <p class="ics" title="ICS编号"><span contenteditable="true" class="tag other icsNumber" data-tag="icsNumber" data-name="ICS编号"></span></p>
                <p class="ccs" title="CCS编号"><span contenteditable="true" class="tag other ccsNumber" data-tag="ccsNumber" data-name="CCS编号"></span></p>
            </div>
            <div class="icon icon_gb" data-icon="gb">
                <img style="width: 40mm; height: 20mm;" class="tag other" data-tag="stdSign" data-name="标准标志" crossOrigin="anonymous" src="http://192.168.0.239:9001/files/images/cover_gb.png" />
            </div>
            <h1 class="title gb">中华人民共和国国家标准</h1>
            <div class="numbers">
                <p class="tt gb">
                    <span contenteditable="true" class="tag other" data-tag="stdSign" data-name="标准标志"></span>
                    <span contenteditable="true" class="tag other" data-tag="stdVer" data-name="版本号"></span>
                    <span contenteditable="true" class="tag other" data-tag="stdNo" data-name="年代号"></span>
                </p>
                <p class="instead" style="display:{@dispalyInstead}; margin-top:5px;">
                    <span contenteditable="true" class="tag other" data-tag="origStdNo" data-name="修订原标准编号"></span>
                </p>
            </div>
            <hr class="title-hr" size="1" />
            <div class="content">
                <p class="std-name">
                    <span contenteditable="true" class="tag other" data-tag="stdName" data-name="标准名称"></span>
                </p>
                <p class="en-name">
                    <span contenteditable="true" class="tag other" data-tag="stdNameEn" data-name="标准英文译名"></span>
                </p>
                <p class="sign-name">
                    <span contenteditable="true" class="tag other" data-tag="consistentSign" data-name="与国际标准一致性程度的标识"></span>
                </p>
                <p class="tag-content">
                    <span contenteditable="true" class="tag other" data-tag="stdEdition" data-name="草案版次"></span>
                </p>
                <p class="tag-updatetime">
                    <span contenteditable="true" class="tag other" data-tag="updateTime" data-name="草案完成时间"></span>
                </p>
            </div>
            <div class="footer-publish">
                <span contenteditable="true" class="tag other" data-tag="stdPublishDate" data-name="发布时间"></span>
            </div>
            <div class="footer-put">
                <span contenteditable="true" class="tag other" data-tag="stdPerformDate" data-name="实施时间"></span>
            </div>
            <hr class="footer-hr" />
            <div class="footer-table">
                <div class="uc main-util">
                    <p>
                        <span contenteditable="true" class="tag other" data-tag="releaseDepartment" data-name="主发布单位">国家市场监督管理总局</span>
                    </p>
                    <p>
                        <span contenteditable="true" class="tag other" data-tag="secondDepartment" data-name="次发布单位">国家标准化管理委员会</span>
                    </p>
                </div>
                <div class="ub">发布</div>
            </div>
		`,
        preface: `
                <div class="header-title"><p>前&nbsp; &nbsp; 言</p></div>
                <p style="text-indent: 2em;">请输入内容。</p>
        `,
    },
    {
        type: 1200,
        value: 'hb',
        label: '行业标准',
        id: "template-1200",
        img: 'cover/HB.png',
        docType: 'HB/T',
        typeTitle: '中华人民共和国XX行业标准',
        docData: {
            "docId": "0000-000",
            "ccsNumber": "xxx.xxx",
            "consistentSign": "与国际标准一致性程度的标识",
            "stdEdition": "测试版本Ver1.0",
            "icsNumber": "xxx.xxx",
            "stdCategory": 1,
            "stdKind": 1200,
            "stdName": "标准名称定义",
            "stdNameEn": "English Name",
            "stdNo": "2021-1130-010",
            "origStdNo": "XXXXXXXXX",
            "stdPerformDate": "2021-11-30",
            "stdPublishDate": "2021-12-30",
            "stdTitle": "中华人民共和国XX行业标准",
            "releaseDepartment": "润申标准化信息技术（上海）有限公司"
        },
        outline: outlineTemp,
        cover: `
            <div class="ics-ccs">
                <p class="ics" title="ICS编号"><span contenteditable="true" class="tag other" data-tag="icsNumber" data-name="ICS编号"></span></p>
                <p class="ccs" title="CCS编号"><span contenteditable="true" class="tag other" data-tag="ccsNumber" data-name="CCS编号"></span></p>
                <p title="备案号"><span contenteditable="true" class="tag other" data-tag="recordNumber" data-name="备案号"></span></p>
            </div>
            <div class="icon hb std-sign" data-icon="qb" contenteditable="false">
                <span contenteditable="true" class="tag other" data-tag="stdSign" data-name="标准代号"></span>
            </div>
            <h1 class="title hb tag other" contenteditable="true" data-tag="stdTitle" data-name="中华人民共和国XX行业标准">
                中华人民共和国XX行业标准
            </h1>
            <div class="numbers">
                <p class="tt gb">
                    <span contenteditable="true" class="tag other" data-tag="stdSign" data-name="标准标志">标准标志</span>
                    <span contenteditable="true" class="tag other" data-tag="stdVer" data-name="顺序号">顺序号</span>
                    <span contenteditable="true" class="tag other" data-tag="stdNo" data-name="年代号">年代号</span>
                </p>
                <p class="instead" style="display:{@dispalyInstead}; margin-top:5px;">
                    <span contenteditable="true" class="tag other" data-tag="origStdNo" data-name="修订原标准编号"></span>
                </p>
            </div>
            <hr class="title-hr" size="1" />
            <div class="content">
                <p class="std-name">
                    <span contenteditable="true" class="tag other" data-tag="stdName" data-name="标准名称"></span>
                </p>
                <p class="en-name">
                    <span contenteditable="true" class="tag other" data-tag="stdNameEn" data-name="标准英文译名"></span>
                </p>
                <p class="sign-name">
                    <span contenteditable="true" class="tag other" data-tag="consistentSign" data-name="与国际标准一致性程度的标识"></span>
                </p>
                <p class="tag-content">
                    <span contenteditable="true" class="tag other" data-tag="stdEdition" data-name="草案版次"></span>
                </p>
                <p class="tag-updatetime">
                    <span contenteditable="true" class="tag other" data-tag="updateTime" data-name="草案完成时间"></span>
                </p>
            </div>
            <div class="footer-publish" contenteditable="true">
                <span contenteditable="true" class="tag other" data-tag="stdPublishDate" data-name="发布时间"></span>
            </div>
            <div class="footer-put" contenteditable="true">
                <span contenteditable="true" class="tag other" data-tag="stdPerformDate" data-name="实施时间"></span>
            </div>
            <hr class="footer-hr" />
            <div class="footer-table">
                <div class="uc main-util" contenteditable="true">
                    <p>
                        <span contenteditable="true" class="tag other" data-tag="releaseDepartment" data-name="主发布单位">XXX行业单位</span>
                    </p>
                </div>
                <div class="ub">发布</div>
            </div>
		`,
    },
    {
        type: 6,
        value: 'db',
        label: '地方标准',
        id: "template-6",
        img: 'cover/DB.png',
        docType: 'DB/T',
        typeTitle: 'XXX地方标准',
        docData: {
            "docId": "0000-000",
            "ccsNumber": "xxx.xxx",
            "consistentSign": "与国际标准一致性程度的标识",
            "stdEdition": "测试版本Ver1.0",
            "icsNumber": "xxx.xxx",
            "stdCategory": 1,
            "stdKind": 6,
            "stdName": "标准名称定义",
            "stdNameEn": "English Name",
            "stdNo": "2021-1130-010",
            "origStdNo": "XXXXXXXXX",
            "stdPerformDate": "2021-11-30",
            "stdPublishDate": "2021-12-30",
            "stdTitle": "XXX地方标准",
            "releaseDepartment": "润申标准化信息技术（上海）有限公司"
        },
        outline: outlineTemp,
        cover: `
			<div class="ics-ccs">
			    <p class="ics" title="ICS编号"><span contenteditable="true" class="tag other" data-tag="icsNumber" data-name="ICS编号"></span></p>
			    <p class="ccs" title="CCS编号"><span contenteditable="true" class="tag other" data-tag="ccsNumber" data-name="CCS编号"></span></p>
			    <p title="备案号"><span contenteditable="true" class="tag other" data-tag="recordNumber" data-name="备案号"></span></p>
			</div>
			<div class="icon hb std-sign" data-icon="qb" contenteditable="false">
			    <span contenteditable="true" class="tag other" data-tag="stdSign" data-name="标准代号"></span>
			</div>
			<h1 class="title hb tag other" contenteditable="true" data-tag="stdTitle" data-name="XXX地方标准">
			    XXX地方标准
			</h1>
			<div class="numbers">
			    <p class="tt gb">
			        <span contenteditable="true" class="tag other" data-tag="stdSign" data-name="标准标志">标准标志</span>
			        <span contenteditable="true" class="tag other" data-tag="stdVer" data-name="顺序号">顺序号</span>
			        <span contenteditable="true" class="tag other" data-tag="stdNo" data-name="年代号">年代号</span>
			    </p>
			    <p class="instead" style="display:{@dispalyInstead}; margin-top:5px;">
			        <span contenteditable="true" class="tag other" data-tag="origStdNo" data-name="修订原标准编号"></span>
			    </p>
			</div>
			<hr class="title-hr" size="1" />
			<div class="content">
			    <p class="std-name">
			        <span contenteditable="true" class="tag other" data-tag="stdName" data-name="标准名称"></span>
			    </p>
			    <p class="en-name">
			        <span contenteditable="true" class="tag other" data-tag="stdNameEn" data-name="标准英文译名"></span>
			    </p>
			    <p class="sign-name">
			        <span contenteditable="true" class="tag other" data-tag="consistentSign" data-name="与国际标准一致性程度的标识"></span>
			    </p>
			    <p class="tag-content">
			        <span contenteditable="true" class="tag other" data-tag="stdEdition" data-name="草案版次"></span>
			    </p>
			    <p class="tag-updatetime">
			        <span contenteditable="true" class="tag other" data-tag="updateTime" data-name="草案完成时间"></span>
			    </p>
			</div>
			<div class="footer-publish" contenteditable="true">
			    <span contenteditable="true" class="tag other" data-tag="stdPublishDate" data-name="发布时间"></span>
			</div>
			<div class="footer-put" contenteditable="true">
			    <span contenteditable="true" class="tag other" data-tag="stdPerformDate" data-name="实施时间"></span>
			</div>
			<hr class="footer-hr" />
			<div class="footer-table">
			    <div class="uc main-util" contenteditable="true">
			        <p>
			            <span contenteditable="true" class="tag other" data-tag="releaseDepartment" data-name="主发布单位">XXX地方</span>
			        </p>
			    </div>
			    <div class="ub">发布</div>
			</div>
		`,
    },
    {
        type: 1500,
        value: 'tb',
        label: '团体标准',
        id: "template-1500",
        img: 'cover/TB.png',
        docType: 'T/CMIF',
        typeTitle: 'XXX团体标准',
        docData: {
            "docId": "0000-000",
            "ccsNumber": "xxx.xxx",
            "consistentSign": "与国际标准一致性程度的标识",
            "stdEdition": "测试版本Ver1.0",
            "icsNumber": "xxx.xxx",
            "stdCategory": 1,
            "stdKind": 1500,
            "stdName": "标准名称定义",
            "stdNameEn": "English Name",
            "stdNo": "2021-1130-010",
            "origStdNo": "XXXXXXXXX",
            "stdPerformDate": "2021-11-30",
            "stdPublishDate": "2021-12-30",
            "stdTitle": "XXX团体标准",
            "releaseDepartment": "润申标准化信息技术（上海）有限公司"
        },
        outline: outlineTemp,
        cover: `
            <div class="ics-ccs">
                <p class="ics" title="ICS编号"><span contenteditable="true" class="tag other" data-tag="icsNumber" data-name="ICS编号"></span></p>
                <p class="ccs" title="CCS编号"><span contenteditable="true" class="tag other" data-tag="ccsNumber" data-name="CCS编号"></span></p>
            </div>
            <div class="icon icon_gb" data-icon="hb">
                <img style="width: 40mm; height: 20mm;" class="tag other" data-tag="stdSign" data-name="标准标志" crossOrigin="anonymous" src="http://192.168.0.239:9001/files/images/cover-empty.png" />
            </div>
            <h1 class="title hb tag other" contenteditable="true" data-tag="stdTitle" data-name="团体标准">
                团体标准
            </h1>
            <div class="numbers">
                <p class="tt gb">
                    <span contenteditable="true" class="tag other" data-tag="stdSign" data-name="标准标志"></span>
                    <span contenteditable="true" class="tag other" data-tag="stdVer" data-name="顺序号">顺序号</span>
                    <span contenteditable="true" class="tag other" data-tag="stdNo" data-name="年代号">年代号</span>
                </p>
                <p class="instead" style="display:{@dispalyInstead}; margin-top:5px;">
                    <span contenteditable="true" class="tag other" data-tag="origStdNo" data-name="修订原标准编号"></span>
                </p>
            </div>
            <hr class="title-hr" size="1" />
            <div class="content">
                <p class="std-name">
                    <span contenteditable="true" class="tag other" data-tag="stdName" data-name="标准名称"></span>
                </p>
                <p class="en-name">
                    <span contenteditable="true" class="tag other" data-tag="stdNameEn" data-name="标准英文译名"></span>
                </p>
                <p class="sign-name">
                    <span contenteditable="true" class="tag other" data-tag="consistentSign" data-name="与国际标准一致性程度的标识"></span>
                </p>
                <p class="tag-content">
                    <span contenteditable="true" class="tag other" data-tag="stdEdition" data-name="文档版次">文档版次</span>
                </p>
                <p class="tag-updatetime">
                    <span contenteditable="true" class="tag other" data-tag="updateTime" data-name="文档完成时间">文档完成时间</span>
                </p>
                <p class="patentFile hide" style="margin-top: 2em; font-size: 12pt;" data-mce-style="margin-top: 2em; font-size: 12pt;"><span class="tag other" data-tag="patentFile" data-name="专利说明">在提交反馈意见时，请将您知道的相关专利连同支持性文件一并附上。</span></p>
            </div>
            <div class="footer-publish">
                <span contenteditable="true" class="tag other" data-tag="stdPublishDate" data-name="发布时间"></span>
            </div>
            <div class="footer-put">
                <span contenteditable="true" class="tag other" data-tag="stdPerformDate" data-name="实施时间"></span>
            </div>
            <hr class="footer-hr" />
            <div class="footer-table">
                <div class="uc main-util">
                    <p>
                        <span contenteditable="true" class="tag other" data-tag="releaseDepartment" data-name="XXX团体">XXX团体</span>
                    </p>
                </div>
                <div class="ub">发布</div>
            </div>
		`,
    },
    {
        type: 1400,
        value: 'qb',
        label: '企业标准',
        id: "template-1400",
        img: 'cover/QB.png',
        docType: 'Q/CY',
        typeTitle: 'XX公司企业标准',
        docData: {
            "docId": "0000-000",
            "ccsNumber": "xxx.xxx",
            "consistentSign": "与国际标准一致性程度的标识",
            "stdEdition": "测试版本Ver1.0",
            "icsNumber": "xxx.xxx",
            "stdCategory": 1,
            "stdKind": 1400,
            "stdName": "标准名称定义",
            "stdNameEn": "English Name",
            "stdNo": "2021-1130-010",
            "origStdNo": "XXXXXXXXX",
            "stdPerformDate": "2021-11-30",
            "stdPublishDate": "2021-12-30",
            "stdTitle": "'XX公司企业标准",
            "releaseDepartment": "润申标准化信息技术（上海）有限公司"
        },
        outline: outlineTemp,
        cover: `
            <div class="ics-ccs">
                <p class="ics" title="ICS编号"><span contenteditable="true" class="tag other" data-tag="icsNumber" data-name="ICS编号"></span></p>
                <p class="ccs" title="CCS编号"><span contenteditable="true" class="tag other" data-tag="ccsNumber" data-name="CCS编号"></span></p>
            </div>
            <div class="icon qb std-sign" data-icon="qb">
                <span contenteditable="true" class="tag other stdSign" data-tag="stdSign" data-name="标准标志">Q/XXXX</span>
            </div>
            <h1 class="title qb tag other stdTitle" contenteditable="true" data-tag="stdTitle" data-name="XXXX企业标准">XXXX企业标准</h1>
            <div class="numbers">
                <p class="tt gb">
                    <span contenteditable="true" class="tag other" data-tag="stdSign" data-name="Q/XXXX">Q/XXX</span>
                    <span contenteditable="true" class="tag other" data-tag="stdVer" data-name="顺序号">顺序号</span>
                    <span contenteditable="true" class="tag other" data-tag="stdNo" data-name="年代号">年代号</span>
                </p>
                <p class="instead" style="margin-top:5px;">
                    <span contenteditable="true" class="tag other origStdNo" data-tag="origStdNo" data-name="修订原标准编号"></span>
                </p>
            </div>
            <hr class="title-hr" size="1" />
            <div class="content">
                <p class="std-name">
                    <span contenteditable="true" class="tag other stdName" data-tag="stdName" data-name="标准名称"></span>
                </p>
                <p class="en-name">
                    <span contenteditable="true" class="tag other stdNameEn" data-tag="stdNameEn" data-name="标准英文译名"></span>
                </p>
                <p class="tag-content std-edition">
                    <span contenteditable="true" class="tag other stdEdition" data-tag="stdEdition" data-name="草案版次"></span>
                </p>
                <p class="tag-updatetime date-time">
                    <span contenteditable="true" class="tag other updateTime" data-tag="updateTime" data-name="草案完成时间"></span>
                </p>
                <p class="patentFile hide" style="margin-top: 2em; font-size: 12pt;" data-mce-style="margin-top: 2em; font-size: 12pt;"><span class="tag other" data-tag="patentFile" data-name="专利说明">在提交反馈意见时，请将您知道的相关专利连同支持性文件一并附上。</span></p>
            </div>
            <div class="footer-publish date-time">
                <span contenteditable="true" class="tag other stdPublishDate" data-tag="stdPublishDate" data-name="发布时间"></span>
            </div>
            <div class="footer-put date-time">
                <span contenteditable="true" class="tag other stdPerformDate" data-tag="stdPerformDate" data-name="实施时间"></span>
            </div>
            <hr class="footer-hr" />
            <div class="footer-table">
                <div class="uc main-util">
                    <p>
                        <span contenteditable="true" class="tag other releaseDepartment" data-tag="releaseDepartment" data-name="主发布单位">XXX企业</span>
                    </p>
                </div>
                <div class="ub" contenteditable="false">发布</div>
            </div>
		`,
        preface: `
			<div class="header-title"><p>前&nbsp; &nbsp; 言</p></div>
			<p style="text-indent: 2em;">请输入内容。</p>
        `,
        intro: `
			<div class="header-title"><p>引&nbsp; &nbsp; 言</p></div>
			<p style="text-indent: 2em;">请输入内容。</p>
        `,
        range: `
			<div class="header-title"><p class="tag other stdName" contenteditable="false" data-bind="stdName" data-tag="stdName" data-name="标准名称">标准名称</p></div>
			<div class="ol-list" data-bookmark="111" data-outlinetype="3" data-index="1" style="line-height: 2.5;">范围<p style="text-indent: 2em;" data-mce-style="text-indent: 2em;">本标准规定了……。</p><p style="text-indent: 2em;" data-mce-style="text-indent: 2em;">本标准适用于……。</p><p style="text-indent: 2em;" data-mce-style="text-indent: 2em;"><br></p></div>
		`,
        normative: `
			<div class="ol-list" data-bookmark="222" data-outlinetype="4" data-index="2" style="line-height: 2.5;">规范性引用文件<p style="text-indent: 2em;" data-mce-style="text-indent: 2em;">下列文件中的内容通过文中的规范性引用而构成本文件必不可少的条款……。</p></div>
		`,
        term: `
			<div class="ol-list" data-bookmark="333" data-outlinetype="5" data-index="3" style="line-height: 2.5;">术语和定义<p style="text-indent: 2em;" data-mce-style="text-indent: 2em;">下列术语和定义适用于本标准。</p></div>
		`,
        chapter: `
			<div class="ol-list" data-bookmark="444" data-outlinetype="6" data-index="4" style="line-height: 2.5;">技术要求<p style="text-indent: 2em;" data-mce-style="text-indent: 2em;">文本内容...</p></div>
		`,
        literature: `
			<div class="header-title"><p>参考文献</p></div>
			<p style="text-indent: 2em;" class="tag other" data-tag="literature" data-name="参考文献">可录入或选择内容。</p>
		`,
        index: `
			<div class="header-title"><p>索&nbsp; &nbsp; 引</p></div>
		`,
    },
];

export const outline = {
    label: '标准名称',
    isRoot: true,
    children: [{
            label: '前言',
            htmlContent: ''
        },
        {
            label: '引言',
            htmlContent: ''
        },
        {
            label: '范围',
            isStruct: true,
            infoId: 1,
            htmlContent: ''
        },
        {
            label: '规范性引用文件',
            isStruct: true,
            infoId: 2,
            htmlContent: ''
        },
        {
            label: '术语和定义',
            infoId: 3,
            isStruct: true,
            htmlContent: ''
        },
        {
            label: '附录名称',
            isStruct: true,
            infoId: 4,
            appendix: true,
            letter: 'A',
            htmlContent: ''
        }
    ]
}
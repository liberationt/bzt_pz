export const defaultEditorSetting = {
    author: {   userId: "",   userName: "",   commitId: "",   isAdmin: true,   lockedAll: false,   },
    admin: true,
    editorURL: '', // JAVA接口地址
    nodeURL: '', // nodeServer服务器地址
    pluginURL: '', // 外挂插件地址
    readonly: true,
    private: true,
    setTemplate: false,
    isStandard: true, // 是否为标准编写
    mergeDoc: true, // 文档初始化后是否自动合并正文
    chapter: ['6', '8', '9'], // 章节标识;用于目次数据的筛选
    page: {
        size: 'A4',
        width: '210mm',
        height: '297mm',
        padding: '20mm 25mm 20mm 20mm',
        layout: 'doubleSided'
    },
    disabledSave: false, // 禁用保存
    unlock: false, // 解锁所有页面
    logo: require(`@/assets/images/logo1.png`),
    navShow: true,
    exportStruct: true, // 是否在保存数据时同时导出结构化数据
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
    openSidebar: true,
    // 菜单内容
    menu: {
        file: { title: 'File', items: 'save | searchreplace preview print | exportFile' },
        edit: { title: 'Edit', items: 'undo redo | cut copy paste | searchreplace' },
        insert: { title: 'Insert', items: 'charmap | paragraph-btn image inserttable | math graphy | hr' },
        pageElement: { title: 'pageElement', items: ' page-type' },
        levelStyle: { title: 'levelStyle', items: 'chapterTitle | chapter1 chapter2 chapter3 chapter4 chapter5 | notTitle1 notTitle2 notTitle3 notTitle4 notTitle5 | list1 list2 list3 list4 list5 list6 list7' },
        Tools: { title: 'Tools', items: 'translate' },
        help: { title: 'Help', items: 'help concatus | bzt-ver upgrade' }
    },
    // 菜单栏
    menuBar: 'file edit insert pageElement levelStyle Tools',
    // 第一行工具栏
    toolbar1: 'undo redo | save saveAs | chapterTitle chapter1 chapter2 chapter3 chapter4 chapter5 notTitle1 notTitle2 notTitle3 notTitle4 notTitle5 | list1 list2 list3 list4 list5 list6 list7 | entryTitle notTitle',
    // 第二行工具栏
    toolbar2: 'paragraph-btn image table separateTable | example-btn zhu-btn zhu-imgtable footer-btn imgtitle tabletitle | math graphy | term  | page-type pageLayout exportFile |  alignment indent2em | translate searchreplace preview fullscreen ',
    // 快捷工具条
    quickbars: 'bold italic underline strikethrough superscript subscript',
    // 公式下拉菜单
    mathItems: ['custom', 'hand', 'number'], // 自定义 手写 编号
    // 上下文菜单
    contextmenu: 'undo redo | table | image',
    draftTimes: 0,
    htmlContent: ``
}

// export const defaultEditorSetting = {
// 	author: {
// 		userId: "",
// 		userName: "",
// 		commitId: null,
// 	},
// 	admin: true,
// 	editorURL: '',								// JAVA接口地址
// 	nodeURL: '',									// nodeServer服务器地址
// 	pluginURL: '',								// 外挂插件地址
// 	readonly: true,
// 	isStandard: true,                           // 是否为标准编写
// 	mergeDoc: true,                            // 文档初始化后是否自动合并正文
// 	chapter: ['6','8','9'],                     // 章节标识;用于目次数据的筛选
// 	page: {
// 			size: 'A4',
// 			width: '210mm',
// 			height: '297mm',
// 			padding: '20mm 25mm 20mm 20mm',
// 			layout: 'doubleSided'
// 	},
// 	logo: require(`@/assets/logo/logo1.png`),
// 	navShow: true,
// 	exportStruct: true,                         // 是否在保存数据时同时导出结构化数据
// 	// 默认目次选项
// 	catalogues: {
// 			type1: true,
// 			type2: true,
// 			type3: true,
// 			type4: true,
// 			type5: true,
// 			type6: true,
// 			leve11: true
// 	},
// 	// 菜单内容
// 	menu: {
// 			file: { title: 'File', items: 'newStandard openFile | save saveAs | searchreplace preview print | exportFile | close-btn' },
// 			edit: { title: 'Edit', items: 'undo redo | cut copy paste | searchreplace' },
// 			insert: { title: 'Insert', items: 'charmap | paragraph-btn image inserttable | math graphy | hr' },
// 			pageElement: { title:'pageElement', items:'cover catalogue prefaceWord introWord addendixWord referenceWord | indexWord indexMarker | page-type' },
// 			levelStyle: { title:'levelStyle', items:'chapterTitle | chapter1 chapter2 chapter3 chapter4 chapter5 | notTitle1 notTitle2 notTitle3 notTitle4 notTitle5 | list1 list2 list3 list4 list5 list6 list7' },
// 			Tools: { title: 'Tools', items: 'validateFormat validatDms | translate' },
// 			help: { title: 'Help', items: 'help concatus | bzt-ver upgrade' }
// 	},
// 	// 菜单栏
// 	menuBar: 'file edit insert pageElement levelStyle elementStyle Tools help',
// 	// 第一行工具栏
// 	toolbar1: 'undo redo | close-btn save saveAs | cover catalogue prefaceWord introWord chapterWord addendixWord referenceWord indexWord indexMarker | chapterTitle chapter1 chapter2 chapter3 chapter4 chapter5 notTitle1 notTitle2 notTitle3 notTitle4 notTitle5 | list1 list2 list3 list4 list5 list6 list7 | entryTitle notTitle',
// 	// 第二行工具栏
// 	toolbar2: 'paragraph-btn image table | example-btn zhu-btn zhu-imgtable footer-btn imgtitle tabletitle | math graphy | quote-btn term quota | comment  | page-type pageLayout exportFile |  alignment indent2em | translate searchreplace preview fullscreen | code',
// 	// 快捷工具条
// 	quickbars: 'bold italic underline strikethrough superscript subscript',
// 	// 公式下拉菜单
// 	mathItems: ['custom','hand','number'], // 自定义 手写 编号
// 	// 上下文菜单
// 	contextmenu: 'undo redo | table | image',
// 	// menu: {
// 	// 		file: { title: 'File', items: 'newStandard save-btn | preview | close-btn' },
// 	// 		edit: { title: 'Edit', items: 'undo redo | cut copy paste | searchreplace' },
// 	// 		view: { title: 'View', items: ' | preview fullscreen' },
// 	// 		insert: { title: 'Insert', items: 'image inserttable | charmap hr | math linecode-btn textnode-btn' },
// 	// 		format: { title: 'Format', items: 'bold italic underline strikethrough superscript subscript | fontformats fontsizes align lineheight | forecolor backcolor | removeformat' },
// 	// 		tools: { title: 'Tools', items: 'spellchecker spellcheckerlanguage | code' },
// 	// 		table: { title: 'Table', items: 'inserttable | cell row column | tableprops deletetable' },
// 	// 		help: { title: 'Help', items: 'help | bzt-ver' },
// 	// },
// 	// toolbar1: 'undo redo | close-btn save-btn | queue levels | hr finished-btn paragraph-btn title-block formatting | alignment indent2em lineheight | image charmap table | pageLayout page-type | searchreplace preview fullscreen',
// 	// toolbar2: 'zhu-btn | example-btn | articleTitle imgtitle-btn | footer-btn | math graphy | introduceGroup quote-btn term quota | comment | exportFile mergePage',
// 	draftTimes: 30000,
// 	htmlContent: ``
// }

export const styleccs = '';

export const pagePadding = {
    left: '35mm 25mm 20mm 20mm',
    right: '35mm 20mm 20mm 25mm'
}
export const pageLayout = {
    'A4': {
        width: '210mm',
        height: '297mm'
    },
    'A3': {
        width: '297mm',
        height: '420mm'
    }
}
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
    { key: 'leve11', label: '一级条标题', value: false },
    { key: 'leve12', label: '二级条标题', value: false },
    { key: 'leve13', label: '三级条标题', value: false },
    { key: 'leve14', label: '四级条标题', value: false },
    { key: 'leve15', label: '五级条标题', value: false },
    { key: 'appendix0', label: '附录章标题', value: false },
    { key: 'appendix1', label: '附录一级条标题', value: false },
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

export const modelTypes = [{
        label: "按样式",
        id: 1,
        pid: 0,
        typeName: 'style',
        children: [
            { label: "国家标准", stdKing: 1100, pid: 1, id: 1 },
            { label: "行业标准", stdKing: 1200, pid: 1, id: 2 },
            { label: "地方标准", stdKing: 6, pid: 1, id: 3 },
            { label: "团体标准", stdKing: 1500, pid: 1, id: 4 },
            { label: "企业标准", stdKing: 1400, pid: 1, id: 5 },
        ]
    },
    {
        label: "按对象",
        id: 2,
        pid: 1,
        typeName: 'object',
        children: [
            { label: "产品标准", pid: 2, id: 1 },
            { label: "过程标准", pid: 2, id: 2 },
            { label: "服务标准", pid: 2, id: 3 }
        ]
    },
    {
        label: "按功能",
        id: 3,
        pid: 1,
        typeName: 'domain',
        children: [
            { label: "术语标准", pid: 3, id: 1 },
            { label: "符号标准", pid: 3, id: 2 },
            { label: "分类标准", pid: 3, id: 3 },
            { label: "试验标准", pid: 3, id: 4 },
            { label: "规范标准", pid: 3, id: 5 },
            { label: "规程标准", pid: 3, id: 6 },
            { label: "指南标准", pid: 3, id: 7 },
        ]
    },
    {
        label: "按目的",
        id: 4,
        pid: 1,
        typeName: 'aim',
        children: [
            { label: "基础标准", pid: 4, id: 1 },
            { label: "技术标准", pid: 4, id: 2 },
            { label: "公益标准", pid: 4, id: 3 }
        ]
    },
];

export const guidingLans = [
    { outlineType: 1, label: '前言', html: '<p style="text-indent: 2em;">本文件按照GB/T 1.1-2020《标准化工作导则 第1部分：标准化文件的结构和起草规则》的规定起草。</p><p style="text-indent: 2em;">本文件由XXX公司提出并归口。</p><p style="text-indent: 2em;">本文件起草单位：XXX公司YYY部门。</p><p style="text-indent: 2em;">本标准主要起草人：</p>' },
    { outlineType: 2, label: '引言', html: '<p style="text-indent: 2em;">请输入引言内容。</p>' },
    { outlineType: 3, label: '范围', html: '<p style="text-indent: 2em;">本标准规定了……。</p><p style="text-indent: 2em;">本标准适用于……。</p>' },
    { outlineType: 4, label: '规范性引用文件', html: '<p style="text-indent: 2em;">下列文件中的内容通过文中的规范性引用而构成本文件必不可少的条款……。</p>' },
    { outlineType: 5, label: '术语和定义', html: '<p style="text-indent: 2em;">下列术语和定义适用于本标准。</p>' },
    { outlineType: 11, label: '参考文献', html: '<p style="text-indent: 2em;">请输入参考文献内容……。</p>' },
    { outlineType: 12, label: '索引', html: '<p style="text-indent: 2em;">请输入索引内容……。</p>' },
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

export const coverData = {
    ics: '01.1299040',
    ccs: 'A 00123',
    typeTitle: '中华人民共和国国家标准',
    mainUtil: '中华人民共和国国家质量监督总局',
    otherUtil: '中国国家标准化管理委员会',
    docType: 'GB/T',
    docNo: '2021-11-09.002',
    insteadNo: 'GB/T 2010.001',
    stdName: '关于润申标准化编辑器使用指南',
    enName: 'English translation of standard name',
    tagContent: 'Version 0.0.1',
    publishDate: '2012-11-30',
    putDate: '2021-12-30',
    htmlContent: `
        <div class="info-block cover disabled fixed" style="width: 210mm; height: 297mm; padding: 10mm 20mm 20mm 25mm;">
			<div class="ics-ccs">
				<p class="ics" contenteditable="true">{@ICS}</p>
				<p class="ccs" contenteditable="true">{@CCS}</p>
			</div>
			<div class="icon_gb">
				<img style="width: 40mm; height: 20mm;" src="http://localhost:8989/files/images/cover_gb.png" />
			</div>
			<h1 class="title" contenteditable="true">{@typeTitle}</h1>
			<div class="numbers">
				<p class="tt gb" contenteditable="true">{@stdNo}</p>
				<p class="instead" contenteditable="true" style="display:{@dispalyInstead}">{@origStdNo}</p>
			</div>
			<hr class="title-hr" size="1" />
			<div class="content std-name" contenteditable="true">{@stdName}</div>
			<div class="en-content en-name" contenteditable="true">{@stdNameEn}</div>
			<div class="tag-content" contenteditable="true">{@tagContent}</div>
			<div class="footer-publish" contenteditable="true">{@publishDate}</div>
			<div class="footer-put" contenteditable="true">{@putDate}</div>
			<hr class="footer-hr" />
			<div class="footer-table">
				<table class="noborder" style="width: 100%; border-width: 0px!important; height: 72px;">
					<colgroup>
						<col style="width: 76.9766%;"/>
						<col style="width: 22.705%;"/>
					</colgroup>
					<tbody>
						<tr style="height: 36px;">
							<td style="border-width: 0px; text-align: center; vertical-align: middle;  height: 36px;">
								<p  contenteditable="true" class="main-util" style="font-family: simSun; font-size: 18pt; font-weight: bold; line-height: 1.5; text-align: center; white-space: nowrap; padding: 0; ">
									{@department}
								</p>
							</td>
							<td style="border-width: 0px; text-align: center; vertical-align: middle; height: 72px;">
								<p class="util-put" style="font-family: simHei; font-size: 16pt;">发布</p>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
    `,

}
export const stdKinds = [{
        type: 0,
        label: '空白文档',
        img: 'cover/empty.png',
        docType: '',
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
            "stdEdition": "v1.0",
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
			<div class="info-block cover fixed" title="封面" style="width: 210mm; height: 297mm; padding: 10mm 20mm 20mm 25mm;">
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
        type: 1100,
        label: '国家标准',
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
            "stdEdition": "v1.0",
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
        htmlContent: `
			<div class="info-block cover fixed" title="封面" style="width: 210mm; height: 297mm; padding: 10mm 20mm 20mm 25mm;">
				<div class="ics-ccs">
					<p class="ics" contenteditable="true" title="ICS">{@ICS}</p>
					<p class="ccs" contenteditable="true" title="CCS">{@CCS}</p>
				</div>
				<div class="icon icon_gb" data-icon="gb" contenteditable="false">
					<img style="width: 40mm; height: 20mm;" crossOrigin="anonymous" src="{@iconUrl}/images/cover_gb.png" />
				</div>
				<h1 class="title gb">{@stdTitle}</h1>
				<div class="numbers">
					<p class="tt gb" contenteditable="true" data-sign="{@stdSign}">{@stdNo}</p>
					<p class="instead" contenteditable="true" style="display:{@dispalyInstead}">{@origStdNo}</p>
				</div>
				<hr class="title-hr" size="1" />
				<div class="content">
					<p class="std-name" contenteditable="true">{@stdName}</p>
					<p class="en-name" contenteditable="true">{@stdNameEn}</p>
					<p class="sign-name" contenteditable="true">{@consistentSign}</p>
					<p class="tag-content" contenteditable="true">{@stdEdition}</p>
				</div>
				<div class="footer-publish" contenteditable="true">{@stdPerformDate}</div>
				<div class="footer-put" contenteditable="true">{@stdPublishDate}</div>
				<hr class="footer-hr" />
				<div class="footer-table">
					<div class="uc main-util" contenteditable="true">{@releaseDepartment}</div>
					<div class="ub" contenteditable="false">发布</div>
				</div>
			</div>
		`,
    },
    {
        type: 1200,
        label: '行业标准',
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
            "stdEdition": "v1.0",
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
        htmlContent: `
			<div class="info-block cover fixed" title="封面" style="width: 210mm; height: 297mm; padding: 10mm 20mm 20mm 25mm;">
				<div class="ics-ccs">
					<p class="ics" contenteditable="true" title="ICS">{@ICS}</p>
					<p class="ccs" contenteditable="true" title="CCS">{@CCS}</p>
				</div>
				<div class="icon hb std-sign" data-icon="qb" contenteditable="true">{@stdSign}</div>
				<h1 class="title hb" contenteditable="true">{@stdTitle}</h1>
				<div class="numbers">
					<p class="tt ttb" contenteditable="true" data-sign="{@stdSign}">{@stdNo}</p>
					<p class="instead" contenteditable="true" style="display:{@dispalyInstead}">{@origStdNo}</p>
				</div>
				<hr class="title-hr" size="1" />
				<div class="content">
					<p class="std-name" contenteditable="true">{@stdName}</p>
					<p class="en-name" contenteditable="true">{@stdNameEn}</p>
					<p class="sign-name" contenteditable="true">{@consistentSign}</p>
					<p class="tag-content" contenteditable="true">{@stdEdition}</p>
				</div>
				<div class="footer-publish" contenteditable="true">{@stdPerformDate}</div>
				<div class="footer-put" contenteditable="true">{@stdPublishDate}</div>
				<hr class="footer-hr" />
				<div class="footer-table">
					<div class="uc main-util" contenteditable="true">{@releaseDepartment}</div>
					<div class="ub" contenteditable="false">发布</div>
				</div>
			</div>
		`,
    },
    {
        type: 6,
        label: '地方标准',
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
            "stdEdition": "v1.0",
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
        htmlContent: `
			<div class="info-block cover fixed" style="width: 210mm; height: 297mm; padding: 10mm 20mm 20mm 25mm;">
				<div class="ics-ccs">
					<p class="ics" contenteditable="true" title="ICS">{@ICS}</p>
					<p class="ccs" contenteditable="true" title="CCS">{@CCS}</p>
				</div>
				<div class="icon db std-sign" data-icon="qb" contenteditable="true">{@stdSign}</div>
				<h1 class="title" contenteditable="true">{@stdTitle}</h1>
				<div class="numbers">
					<p class="tt ttb" contenteditable="true" data-sign="{@stdSign}">{@stdNo}</p>
					<p class="instead" contenteditable="true" style="display:{@dispalyInstead}">{@origStdNo}</p>
				</div>
				<hr class="title-hr" size="1" />
				<div class="content">
					<p class="std-name" contenteditable="true">{@stdName}</p>
					<p class="en-name" contenteditable="true">{@stdNameEn}</p>
					<p class="sign-name" contenteditable="true">{@consistentSign}</p>
					<p class="tag-content" contenteditable="true">{@stdEdition}</p>
				</div>
				<div class="footer-publish" contenteditable="true">{@stdPerformDate}</div>
				<div class="footer-put" contenteditable="true">{@stdPublishDate}</div>
				<hr class="footer-hr" />
				<div class="footer-table">
					<div class="uc main-util" contenteditable="true">{@releaseDepartment}</div>
					<div class="ub" contenteditable="false">发布</div>
				</div>
			</div>
		`,
    },
    {
        type: 1500,
        label: '团体标准',
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
            "stdEdition": "v1.0",
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
        htmlContent: `
			<div class="info-block cover fixed" style="width: 210mm; height: 297mm; padding: 10mm 20mm 20mm 25mm;">
				<div class="ics-ccs">
					<p class="ics" contenteditable="true" title="ICS">{@ICS}</p>
					<p class="ccs" contenteditable="true" title="CCS">{@CCS}</p>
				</div>
				<div class="icon tb std-sign" data-icon="qb" contenteditable="true">{@stdSign}</div>
				<h1 class="title" contenteditable="true">{@stdTitle}</h1>
				<div class="numbers">
					<p class="tt ttb" contenteditable="true" data-sign="{@stdSign}">{@stdNo}</p>
					<p class="instead" contenteditable="true" style="display:{@dispalyInstead}">{@origStdNo}</p>
				</div>
				<hr class="title-hr" size="1" />
				<div class="content">
					<p class="std-name" contenteditable="true">{@stdName}</p>
					<p class="en-name" contenteditable="true">{@stdNameEn}</p>
					<p class="sign-name" contenteditable="true">{@consistentSign}</p>
					<p class="tag-content" contenteditable="true">{@stdEdition}</p>
				</div>
				<div class="footer-publish" contenteditable="true">{@stdPerformDate}</div>
				<div class="footer-put" contenteditable="true">{@stdPublishDate}</div>
				<hr class="footer-hr" />
				<div class="footer-table">
					<div class="uc main-util" contenteditable="true">{@releaseDepartment}</div>
					<div class="ub" contenteditable="false">发布</div>
				</div>
			</div>
		`,
    },
    {
        type: 1400,
        label: '企业标准',
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
            "stdEdition": "v1.0",
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
        htmlContent: `
			<div class="info-block cover fixed" title="封面" style="width: 210mm; height: 297mm; padding: 10mm 20mm 20mm 25mm;">
				<div class="ics-ccs">
					<p class="ics" contenteditable="true" title="ICS">{@ICS}</p>
					<p class="ccs" contenteditable="true" title="CCS">{@CCS}</p>
				</div>
				<div class="icon qb std-sign" data-icon="qb" contenteditable="true">{@stdSign}</div>
				<h1 class="title" contenteditable="true">{@stdTitle}</h1>
				<div class="numbers">
					<p class="tt ttb" contenteditable="true" data-sign="{@stdSign}">{@stdNo}</p>
					<p class="instead" contenteditable="true" style="display:{@dispalyInstead}">{@origStdNo}</p>
				</div>
				<hr class="title-hr" size="1" />
				<div class="content">
					<p class="std-name" contenteditable="true">{@stdName}</p>
					<p class="en-name" contenteditable="true">{@stdNameEn}</p>
					<p class="sign-name" contenteditable="true">{@consistentSign}</p>
					<p class="tag-content" contenteditable="true">{@stdEdition}</p>
				</div>
				<div class="footer-publish" contenteditable="true">{@stdPerformDate}</div>
				<div class="footer-put" contenteditable="true">{@stdPublishDate}</div>
				<hr class="footer-hr" />
				<div class="footer-table">
					<div class="uc main-util" contenteditable="true">{@releaseDepartment}</div>
					<div class="ub" contenteditable="false">发布</div>
				</div>
			</div>
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

export const testHtmls = [{
        label: '测试-封面目次结构',
        filepath: 'html/test0.html'
    },
    {
        label: '测试-文档跨页处理',
        filepath: 'html/test1.html'
    },
    {
        label: '测试-表格XML解析',
        filepath: 'html/test2.html'
    },
    {
        label: '测试-编辑器使用说明',
        filepath: 'html/test3.html'
    },
    {
        label: '测试-层级项与列项',
        filepath: 'html/test4.html'
    },
    {
        label: '测试-附录项',
        filepath: 'html/test5.html'
    },
    {
        label: '测试7',
        filepath: 'html/test6.html'
    }
]
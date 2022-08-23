import request from '@utils/request';

// 上传附件
export function fileUpload(data) {
    return new Promise((resolve, reject) => {
        let response = request({
            url: "/common/upload",
            method: 'post',
            data: data,
        })
        resolve(response);
    })
}

// 下载附件
export function fileDownLoad(filePath, fileName) {
    // /common/download/resourceDownloadWithName
    return new Promise((resolve, reject) => {
        let response = request({
                url: `/common/download/resourceDownloadWithName`,
                method: 'post',
                data: {
                    resource: filePath,
                    fileName: fileName
                }
            })
            // const content = response;
            // const blob = new Blob([content], { type: "application/vnd.ms-excel" });
            // const elink = document.createElement("a");
            // elink.download = file.name;
            // elink.style.display = "none";
            // elink.href = URL.createObjectURL(blob);
            // document.body.appendChild(elink);
            // elink.click();
            // URL.revokeObjectURL(elink.href);
            // document.body.removeChild(elink);
        resolve(response);
    })
}

export function downLoadFileByURL(filePath, fileName) {
    if (filePath == undefined || filePath == null) {
        this.$message.warning("附件异常，请检查");
        return
    }
    fileDownLoad(filePath, fileName).then(res => {
        const content = res;
        const blob = new Blob([content], { type: "application/vnd.ms-excel" });
        const elink = document.createElement("a");
        elink.download = fileName;
        elink.style.display = "none";
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href);
        document.body.removeChild(elink);
    })
}
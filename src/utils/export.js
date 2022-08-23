import { getToken } from '@/utils/auth'
// 直接使用请求获取的文件流名称保存现在文件流
export function XHRDownloadFile(method, url, params) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, process.env.VUE_APP_BASE_API + url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.setRequestHeader("Authorization", 'Bearer ' + getToken());
    xhr.responseType = 'blob';
    xhr.onload = function(res) {
        if (this.status === 200) {
            var type = xhr.getResponseHeader('Content-Type');
            var blob = new Blob([this.response], { type: type });
            const fileName = decodeURI(xhr.getResponseHeader('content-disposition').split('=')[1])
            if (typeof window.navigator.msSaveBlob !== 'undefined') {
                /*
                 * For IE
                 * >=IE10
                 */
                window.navigator.msSaveBlob(blob, fileName);
            } else {
                /*
                 * For Non-IE (chrome, firefox)
                 */
                var URL = window.URL || window.webkitURL;
                var objectUrl = URL.createObjectURL(blob);
                if (fileName) {
                    var a = document.createElement('a');
                    if (typeof a.download === 'undefined') {
                        window.location = objectUrl;
                    } else {
                        a.href = objectUrl;
                        a.download = fileName;
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                    }
                } else {
                    window.location = objectUrl;
                }
            }
        } else {
            message.error(res.message + "!")
        }
    }
    xhr.send(JSON.stringify(params));
}

// 根据URL保存文件
export function downLoadByURL(filePath, fileName, api = null) {
    const elink = document.createElement("a");
    elink.style.display = "none";
    const arr = filePath.split("/")
    if (arr[1].indexOf('editorPath') == -1) {
        elink.href = `${api==null?process.env.VUE_APP_BASE_API:api}${filePath}`;
    } else {
        elink.href = `${api==null?"":api}${filePath}`;
    }
    console.log(fileName)
    document.body.appendChild(elink);
    elink.download = fileName;
    elink.click();
    window.URL.revokeObjectURL(elink.href);
    document.body.removeChild(elink);
}
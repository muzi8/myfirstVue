export function formatDate(date, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {  // RegExp('M+') 等同于 /(M+)/
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
}

function padLeftZero(str) {  // 如果str是1,那么它的长度是1. '001',substr(1),从第2位开始截取，截取后是01
    return ('00' + str).substr(str.length);  // 如果str是12, 那么长度是2. '0012', substr(2), 从第3位开始截取，截取后是12，不影响值
}

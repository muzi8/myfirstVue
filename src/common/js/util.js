/**
 * 解析url参数
 * @example ?id=12345&a=b
 * @return Object {id:12345, a:b}
 */
export function urlParse() {
    let url = window.location.search;
    let obj = {};
    let reg = /[?&][^?&]+=[^?&]+/g;  // 全局匹配包含？或者&字符，后面跟和非?和&的字符有多个，然后用=连接，后面再跟着多个非?和&字符
    // ?匹配[?&],id匹配[^?&]+, =匹配=，12345匹配[^?&]+，接下来再往后匹配，&匹配[?&]，a匹配[^?&]+，=匹配=，b匹配[^?&]+
    let arr = url.match(reg); // arr是一个数组，第一个匹配?id=12345，第二个匹配&a=b
    // ['?id=12345', '&a=b'], 将它变成对象，取id
    if (arr) {
        arr.forEach((item) => {
            let tempArr = item.substring(1).split('=');
            let key = decodeURIComponent(tempArr[0]);
            let val = decodeURIComponent(tempArr[1]);
            obj[key] = val;
        });
    }
    return obj;
}

export function saveToLocal(id, key, value) {
    let seller = window.localStorage.__seller__; // 拿个特殊的值来保存
    if (!seller) { // 第一次从来没创建过
        seller = {};
        seller[id] = {};
    } else { // 如果不是第一次存值
        seller = JSON.parse(seller);
        if (!seller[id]) { // 如果没有注册这个商家
            seller[id] = {};
        }
        console.log(seller);
    }
    seller[id][key] = value;
    window.localStorage.__seller__ = JSON.stringify(seller);
};

export function LoadFromLocal(id, key, def) {
    let seller = window.localStorage.__seller__;
    if (!seller) {
        return def;
    }
    seller = JSON.parse(seller)[id];
    if (!seller) {
        return def;
    }
    let ret = seller[key];
    return ret || def;
};

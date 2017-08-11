// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import axios from 'axios';
import App from './App';
import goods from './components/goods/goods';
import ratings from './components/ratings/ratings';
import seller from './components/seller/seller';

import './common/stylus/index.styl';

Vue.use(VueRouter);
Vue.prototype.$http = axios;

Vue.config.productionTip = false;

/* eslint-disable no-new
new Vue({
    el: '#app',
    template: '<App/>',
    components: { App }
}); */
const routes = [ // 重定向
    { path: '/goods', component: goods },
    { path: '/ratings', component: ratings },
    { path: '/seller', component: seller }
];

const router = new VueRouter({
    routes, // （缩写）相当于 routes: routes
    linkActiveClass: 'active'
});

new Vue({
    router,
    render: h => h(App),
    data: {
        eventHub: new Vue()
    }
}).$mount('#app');

// router.push('/goods');  // 利用vue-router的导航式编程。(8月11日注释掉了这一句，因为在开发ratings的时候因为这一句导致报错)，上线时默认带个hash值

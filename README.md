# sell

> 这是一个跟着慕课网教程，利用VueJS做的“仿饿了么”APP, 我看的版本是VueJS 1.0的版本,但是现在已经是Vue 2.0了，有一些地方是根据VUE的API进行迁移更改，还有里面用到的不是vue-resource，我自己替换成了axios了。
> 用axios的具体步骤是：
> 1. 先 `npm install axios`
> 2. 然后在`main.js`里要导入它`import axios from 'axios'`
> 3. 之后不能像之前一样用use，而是应该用`Vue.prototype.$http = axios` 要加在原型链上，它的使用方法是
> ```
> this.$http.get(URL).then((response) => {
>   // success callback 成功的回调函数
>   response = response.data;
>   if (response.errno === ERR_OK) {
>       this.seller = response.data;
>   }
> });
> ```

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## 目前的情况

> 目前的版本还只实现到商品详情页的评价部分，稍后几天会努力写完，也算是自己对这个项目有个圆满的结局。从这个视频中自己也学到了很多。光拿本本做笔记就已经密密麻麻写了40多张纸了。
> 
> 8月11日的修改
> >已经写完了评论组件，但是因为总是会报一个错，ratings里的$nextTick会说找不到children的错误，因为在main.js里用`router.push('/goods');` 直接导航到了goods组件。那个时候会删除ratings的DOM，而ratings里的$nextTick是一个异步更新的过程，所以才找不到。现在暂时将`router.push('/goods');`这一句注释掉了，但是打开之后默认是空白的，得点击商品、评价选项才会有内容。
>> 等组件都开发完毕研究一下怎么正确导向又不报错。P
 
## 遇到的问题
> 目前来说遇到最大的问题就是因为视频和实际版本的不统一，在$dispatch那里出现了一些小问题，后来自己在网上找了很多解决方法，因为没有用Vuex，目前的解决办法是建立一个eventHub创建一个事件中心，相当于中转站，然后用来传递和接受事件。在用$dispatch的地方写上`this.$root.eventHub.$emit('YOUR_EVENT_NAME', yourData);` (在子组件内触发这个事件), 然后去另外一个组件内(或是父组件内)，要在它的
> ```
> created() {
>   this.$root.eventHub.$on('YOUR_EVENT_NAME', (yourData) => {
>    // 写事件
>   });
> } 
> ```
> 最后记得在组件销毁之前接触绑定操作：
> ```
> beforeDestroy() {  // 在组件销毁之前回收这个
>   this.$root.eventHub.$off('YOUR_EVENT_NAME', yourData);
> }
> ```
> 

## 目前完成的动图效果

>![](https://github.com/muzi8/myfirstVue/raw/master/demo1.gif)  

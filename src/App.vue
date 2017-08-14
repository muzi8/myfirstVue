<template>
  <div id="app">
      <v-header v-bind:seller="seller"></v-header>
      <div class="tab border-1px">
          <div class="tab-item">
              <router-link to="/goods">商品</router-link>
          </div>
          <div class="tab-item">
              <router-link to="/ratings">评论</router-link>
          </div>
          <div class="tab-item">
              <router-link to="/seller">商家</router-link>
          </div>
      </div>
      <!-- 路由匹配到的组件将渲染在这里, keep-alive是让组件保存状态 -->
      <keep-alive>
          <router-view :seller="seller"></router-view>
      </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
    import header from './components/header/header.vue';
    import {urlParse} from './common/js/util.js';
    // 上面的路径是'./common/js/util.js' 而不是'common/js/util'

    const ERR_OK = 0;

    export default{
        data() {
            return {
                seller: {
                    id: (() => {
                        let queryParam = urlParse();
                        return queryParam.id;
                    })()
                }
            };
        },
        created() {
            // 这里也要改写不再是'/api/seller' 而是'/api/seller?id=' + this.seller.id
            this.$http.get('/api/seller?id=' + this.seller.id).then((response) => {
                response = response.data;
                if (response.errno === ERR_OK) {
                    // this.seller = response.data;
                    // console.log(this.seller.id); 直接输出会被丢弃掉，因为response.data里面没有id这个属性
                    this.seller = Object.assign({}, this.seller, response.data);
                    // console.log(this.seller.id); // 现在可以拿到id的值12345了
                }
            });
        },
        components: {
            'v-header': header
        }
    };
</script>

<style lang="stylus" type="text/stylus">
    @import "./common/stylus/mixin.styl";

    #app
        .tab
            display:flex
            width: 100%
            height: 40px
            line-height: 40px
            //border-bottom: 1px solid rgba(7, 17, 27, 0.1)
            border-1px(rgba(7, 17, 27, 0.1))
            .tab-item
                flex: 1
                text-align: center
                & > a
                    display: block
                    font-size: 14px;
                    color: rgb(77, 85, 93)
                    &.active
                        color: rgb(240, 20, 20)
</style>

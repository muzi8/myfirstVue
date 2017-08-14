<template>
    <div>
        <div class="shopcart">
            <div class="content" @click="toggleList">
                <div class="content-left">
                    <div class="logo-wrapper">
                        <div class="logo" :class="{'hightlight': totalCount>0}">
                            <i class="icon-shopping_cart" :class="{'hightlight': totalCount>0}"></i>
                        </div>
                        <div class="num" v-show="totalCount>0">{{totalCount}}</div>
                    </div>
                    <div class="price" :class="{'hightlight': totalPrice>0}">¥ {{totalPrice}}</div>
                    <div class="desc">另需配送费 ¥ {{deliveryPrice}}元</div>
                </div>
                <div class="content-right" @click.stop.prevent="pay">
                    <div class="pay" :class="payClass">
                        {{payDesc}}
                    </div>
                </div>
            </div>
            <div class="ball-container">
                <div v-for="ball in balls">
                    <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
                        <div  v-show="ball.show" class="ball">
                            <div class="inner inner-hook"></div>
                        </div>
                    </transition>
                </div>
            </div>
            <transition name="fold">
                <div class="shopcart-list" v-show="listShow">
                    <div class="list-header">
                        <h1 class="title">购物车</h1>
                        <span class="empty" @click="empty">清空</span>
                    </div>
                    <div class="list-content" ref="listcontent">
                        <ul>
                            <li class="food" v-for="food in selectFoods">
                                <span class="name">{{food.name}}</span>
                                <div class="price">
                                    <span>¥ {{food.price * food.count}}</span>
                                </div>
                                <div class="cartcontrol-wrapper">
                                    <cartcontrol :food="food"></cartcontrol>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </transition>
        </div>
        <transition name="fade">
            <div class="list-mask" @click="hideList" v-show="listShow"></div>
        </transition>
    </div>
</template>

<script type="text/ecmascript-6">
    import cartcontrol from '../cartcontrol/cartcontrol';
    import BScroll from 'better-scroll';  // 不引进的话，购物车内的按钮无法点击

    export default {
        props: {
            selectFoods: {
              type: Array,
              default() {  // 如果类型是数组或者是对象，那么它的default就是一个函数
                  return [
                      {
                          price: 30,
                          count: 1
                      }
                  ];
              }
            },
            deliveryPrice: {
                type: Number
            },
            minPrice: {
                type: Number
            }
        },
        data() {
          return {
              balls: [
                  {
                      show: false
                  },
                  {
                      show: false
                  },
                  {
                      show: false
                  },
                  {
                      show: false
                  },
                  {
                      show: false
                  }
              ],
              dropBalls: [],
              fold: true  // fold是折叠的意思
          };
        },
        created() {   // 到这里定义事件-购物车小球
            this.$root.eventHub.$on('cartadd', (el) => {
                this.drop(el);
            });
        },
        computed: {
            totalPrice() {
                let total = 0;
                this.selectFoods.forEach((food) => {   // 在已选择的商品中做一个循环遍历，遍历每一个商品
                    total += food.price * food.count;  // 商品的单价*数量
                });
                return total;
            },
            totalCount() {
                let count = 0;
                this.selectFoods.forEach((food) => {
                   count += food.count;
                });
                return count;
            },
            payDesc() {
                if (this.totalPrice === 0) {
                    return `¥ ${this.minPrice} 元起送`;
                } else if (this.totalPrice < this.minPrice) {
                    let diff = this.minPrice - this.totalPrice;
                    return `还差¥ ${diff} 元起送`;
                } else {
                    return '去结算';
                }
            },
            payClass() {
                if (this.totalPrice < this.minPrice) {
                    return 'not-enough';
                } else {
                    return 'enough';
                }
            },
            listShow() {  // 不能在购物车内+和-不能点击是因为
                if (!this.totalCount) {
                    this.fold = true;
                    return false;
                }
                let show = !this.fold;
                if (show) {  // 当列表展示时，要给BS做初始化
                    this.$nextTick(() => {  // 数据变，DOM并不能生效,BScroll依赖DOM,所以要放在nextTick中
                        if (!this.scroll) { // 如果存在
                            this.scroll = new BScroll(this.$refs.listcontent, { // 初始化BScroll, 取需要派发click事件的DOM
                                click: true
                            });
                        } else {
                            this.scroll.refresh();  // 就让它重新计算
                        }
                    });
                }
                return show;
            }
        },
        methods: {
            drop(el) {
                for (let i = 0; i < this.balls.length; i++) {
                    let ball = this.balls[i];
                    if (!ball.show) {
                        ball.show = true;
                        ball.el = el;
                        this.dropBalls.push(ball);
                        return;
                    }
                }
            },
            beforeDrop(el) {
                let count = this.balls.length;
                while (count--) {
                    let ball = this.balls[count];
                    if (ball.show) {
                        let rect = ball.el.getBoundingClientRect();  // 获得这个元素相当于视口的一个位置
                        let x = rect.left - 32;  // X轴的偏移
                        let y = -(window.innerHeight - rect.top - 22);  // Y轴的偏移，是负值
                        el.style.display = '';  // 手动置为空
                        el.style.webkitTransform = `translate3d(0, ${y}px, 0)`;
                        el.style.transform = `translate3d(0, ${y}px, 0)`;  // 外层是Y轴纵向的动画
                        let inner = el.getElementsByClassName('inner-hook')[0];  // 这是一个数组
                        inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`;
                        inner.style.transform = `translate3d(${x}px, 0, 0)`;  // 这是横向X轴的动画
                    }
                }
            },
            dropping(el, done) {
                /* eslint-disable no-unused-vars */
                let rf = el.offsetHeight;  // 这个变量不会用的，所以要加上面的eslint注释，免得报错
                this.$nextTick(() => {  // 将上面的动画重置过来，这里面不能用反引号`，因为没有变量，是单纯的字符串，要用引号'
                    el.style.display = '';
                    el.style.webkitTransform = 'translate3d(0, 0, 0)';
                    el.style.transform = 'translate3d(0, 0, 0)';
                    let inner = el.getElementsByClassName('inner-hook')[0];
                    inner.style.webkitTransform = 'translate3d(0, 0, 0)';
                    inner.style.transform = 'translate3d(0, 0, 0)';
                    el.addEventListener('transitionend', done);
                });
            },
            afterDrop(el) { // 动画完成之后要将ball.show置为false，不然有个球一直挡在那里
                let ball = this.dropBalls.shift();  // 做完一个动画，从dropBalls里面取一个ball出来。
                if (ball) {
                    ball.show = false;
                    el.style.display = 'none';  // 手动置为none
                }
            },
            toggleList() {
                if (!this.totalCount) {  // 如果当前展开点它，fold就变成了true
                    return;
                }
                this.fold = !this.fold;  // 取反
            },
            empty() {
                this.selectFoods.forEach((food) => {
                    food.count = 0;
                });
            },
            hideList() {
                this.fold = true;
            },
            pay() {
                if (this.totalPrice < this.minPrice) {
                    return;
                }
                window.alert(`需要支付${this.totalPrice}元`);
            }
        },
        components: {
            cartcontrol
        },
        beforeDestroy() {
            this.$root.eventHub.$off('cartadd', (el) => {
                this.drop(el);
            });
        }
    };
</script>

<style lang="stylus" type="text/stylus">
    @import "../../common/stylus/mixin.styl";

    .shopcart
        position: fixed
        left: 0
        bottom: 0
        z-index: 50
        width: 100%
        height: 48px
        .content
            display: flex
            background: #141d27
            font-size: 0
            color: rgba(255, 255, 255, 0.4)
            .content-left
                flex: 1
                .logo-wrapper
                    display: inline-block
                    vertical-align: top
                    position: relative
                    top: -10px
                    margin: 0 12px
                    padding: 6px
                    width: 56px
                    height: 56px
                    box-sizing: border-box
                    border-radius: 50%
                    background: #141d27
                    .logo
                        width: 100%
                        height: 100%
                        border-radius: 50%
                        text-align: center
                        background: #2b343c
                        &.hightlight
                            background: rgb(0, 160, 220)
                        .icon-shopping_cart
                            line-height: 44px
                            font-size: 24px
                            &.hightlight
                                color: #fff
                    .num
                        position: absolute
                        top: 0
                        right: 0
                        width: 24px
                        height: 16px
                        line-height: 16px
                        text-align: center
                        border-radius: 16px
                        font-size: 9px
                        font-weight: 700
                        color: #FFF
                        background: rgb(240, 20, 20)
                        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
                .price
                    display: inline-block
                    vertical-align: top
                    margin-top: 12px
                    line-height: 24px
                    padding-right: 12px
                    box-sizing: border-box
                    border-right: 1px solid rgba(255, 255, 255, 0.1)
                    font-size: 16px
                    font-weight: 700
                    &.hightlight
                        color: #fff
                .desc
                    display: inline-block
                    vertical-align: top
                    margin: 12px 0 0 12px
                    line-height: 24px
                    font-size: 10px
                    font-weight: 200
            .content-right
                flex: 0 0 105px
                width: 105px
                .pay
                    height: 48px
                    line-height: 48px
                    text-align: center
                    font-size: 12px
                    font-weight: 700
                    &.not-enough
                        background: #2b343c
                    &.enough
                        background: #00b43c
                        color: #fff
        .ball-container
            .ball
                position: fixed
                left: 32px
                bottom: 22px
                z-index: 200
                transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
                .inner
                    width: 16px
                    height: 16px
                    border-radius: 50%
                    background: rgb(0, 160, 220)
                    transition: all 0.4s linear
        .shopcart-list
            position: absolute
            left: 0
            top: 0
            z-index: -1  // 要从底下出来
            width: 100%
            transform: translate3d(0, -100%, 0)
            &.fold-enter-active, &.fold-leave-active
                transition: all 0.5s
            &.fold-enter, &.fold-leave-to
                transform: translate3d(0, 0, 0)
            .list-header
                height: 40px
                line-height: 40px
                padding: 0 18px
                background: #f3f5f7
                border-bottom: 1px solid rgba(7, 17, 27, 0.1)
                .title
                    float: left
                    font-size: 14px
                    color: rgb(7, 17, 27)
                .empty
                    float: right
                    font-size: 12px
                    color: rgb(0, 160, 220)
            .list-content
                padding: 0 18px
                max-height: 217px
                overflow: hidden
                background: #fff
                .food
                    position: relative
                    padding: 12px 0;
                    box-sizing: border-box
                    border-1px(rgba(7, 17, 27, 0.1))
                    .name
                        line-height: 24px
                        font-size: 14px
                        color: rgb(7, 17, 27)
                    .price
                        position: absolute
                        right: 90px
                        bottom: 12px
                        line-height: 24px
                        font-size: 14px
                        font-weight: 700
                        color: rgb(240, 20, 20)
                    .cartcontrol-wrapper
                        position: absolute
                        right: 0
                        bottom: 6px
    .list-mask
        position: fixed
        top: 0
        left: 0
        width: 100%
        height: 100%
        z-index: 40
        backdrop-filter: blur(10px)
        opacity: 1
        background: rgba(7, 17, 27, 0.6)
        &.fade-enter-active, &.fade-leave-active
            transition: all 0.5s
        &.fade-enter, &.fade-leave-active
            opacity: 0
            background: rgba(7, 17, 27, 0)
</style>
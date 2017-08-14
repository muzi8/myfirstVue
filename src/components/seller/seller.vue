<template>
    <div class="seller" ref="seller">
        <div class="seller-content">
            <div class="overview">
                <h1 class="title">{{seller.name}}</h1>
                <div class="desc border-1px">
                    <star :size="36" :score="seller.score"></star>
                    <span class="text">({{seller.ratingCount}})</span>
                    <span class="text">月售{{seller.sellCount}}单</span>
                </div>
                <ul class="remark">
                    <li class="block">
                        <h2>起送价</h2>
                        <div class="content">
                            <span class="stress">{{seller.minPrice}}</span>元
                        </div>
                    </li>
                    <li class="block">
                        <h2>商家配送</h2>
                        <div class="content">
                            <span class="stress">{{seller.deliveryPrice}}</span>元
                        </div>
                    </li>
                    <li class="block">
                        <h2>平均配送时间</h2>
                        <div class="content">
                            <span class="stress">{{seller.deliveryTime}}</span>元
                        </div>
                    </li>
                </ul>
                <div class="favorite" @click="toggleFavorite">
                    <span class="icon-favorite" :class="{'active':favorite}"></span>
                    <span class="text">{{favoriteText}}</span>
                </div>
            </div>
            <split></split>
            <div class="bulletin">
                <h1 class="title">公告与活动</h1>
                <div class="content-wrapper">
                    <p class="content">{{seller.bulletin}}</p>
                </div>
                <ul v-if="seller.supports" class="supports">
                    <li v-for="(item, index) in seller.supports" class="support-item border-1px">
                        <span class="icon" :class="classMap[seller.supports[index].type]"></span>
                        <span class="text">{{seller.supports[index].description}}</span>
                    </li>
                </ul>
            </div>
            <split></split>
            <div class="pics">
                <h1 class="title">商家实景</h1>
                <!-- 可能要横向滚动，当图片超过视口大小的时候，就要横向滚动，所以加一个wrapper -->
                <div class="pic-wrapper" ref="picWrapper">
                    <ul class="pic-list" ref="picList">
                        <li class="pic-item" v-for="pic in seller.pics">
                            <img :src="pic" width="120" height="90">
                        </li>
                    </ul>
                </div>
            </div>
            <split></split>
            <div class="info">
                <h1 class="title border-1px">商家信息</h1>
                <ul>
                    <li class="info-item" v-for="info in seller.infos">{{info}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import BScroll from 'better-scroll';
    import {saveToLocal, LoadFromLocal} from '../../common/js/store';
    import star from '../../components/star/star';
    import split from '../../components/split/split';

    export default {
        props: {
            seller: {  // 这里必须接收seller,上面才能写{{seller.name}}
                type: Object
            }
        },
        data() {
          return {
              favorite: (() => {
                  return LoadFromLocal(this.seller.id, 'favorite', false);
              })()
          };
        },
        computed: {
            favoriteText() {
                return this.favorite ? '已收藏' : '收藏';  // 依赖于favorite这个变量
            }
        },
        created() {
            this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
        },
        watch: {
          seller() {
              // console.log(4);
              this.$nextTick(() => {
                  this._initScroll();
                  this._initPics();
                  // console.log(5);
              });
              // console.log(this.seller);
          }
        },
        mounted() {
            // console.log(1); // 一开始seller是空的，没有被撑开
            this.$nextTick(() => {  // 这里是异步更新，用watch跟踪变化
                this._initScroll();
                this._initPics();
            });
        },
        methods: {
            toggleFavorite(event) {
                if (!event._constructed) {  // 原生没有这个属性，如果不存在这个属性，则不执行下面的函数，只有BScroll派发的才可以执行
                    return;
                }
                this.favorite = !this.favorite;
                saveToLocal(this.seller.id, 'favorite', this.favorite);
            },
            _initScroll() {
                if (!this.scroll) {
                    this.scroll = new BScroll(this.$refs.seller, {
                        click: true
                    });
                   // console.log(2);
                } else {
                    this.scroll.refresh();
                  // console.log(3);
                }
            },
            _initPics() {
                if (this.seller.pics) {  // 有图片的时候
                    let picWidth = 120;
                    let margin = 6;
                    let width = (picWidth + margin) * this.seller.pics.length - margin;
                    this.$refs.picList.style.width = width + 'px';
                    this.$nextTick(() => {
                       if (!this.picScroll) {  // 如果横向滑动没有初始化过
                           this.picScroll = new BScroll(this.$refs.picWrapper, {
                               scrollX: true,  // 允许横向滚动
                               eventPassthrough: 'vertical'  // 让外层区块可以竖向滚动，内层横向滚动互不干扰
                           });
                       } else {
                           this.picScroll.refresh();  // 如果已经有了就刷新
                       }
                    });
                }
            }
        },
        components: {
            star,
            split
        }
    };
</script>

<style lang="stylus" type="text/stylus">
    @import "../../common/stylus/mixin.styl"

    .seller
        position: absolute
        top: 174px
        bottom: 0
        left: 0
        width: 100%
        overflow: hidden
        .overview
            position: relative
            padding: 18px
            .title
                margin-bottom: 8px
                line-height: 14px
                font-size: 14px
                color: rgb(7, 17, 27)
            .desc
                padding-bottom: 18px
                border-1px(rgba(7, 17, 27, 0.1))
                font-size: 0
                .star
                    display: inline-block
                    vertical-align: top
                    margin-right: 8px
                .text
                    display: inline-block
                    vertical-align: top
                    margin-right: 12px
                    font-size: 10px
                    line-height: 18px
                    color: rgb(77, 85, 93)
            .remark
                display: flex
                padding-top: 18px
                .block
                    flex: 1
                    text-align: center
                    border-right: 1px solid rgba(7, 17, 27, 0.1)
                    &:last-child
                        border: none
                    h2
                        margin-bottom: 4px
                        font-size: 10px
                        line-height: 10px
                        color: rgb(147, 153, 159)
                    .content
                        line-height: 24px
                        font-size: 10px
                        color: rgb(7, 17, 27)
                        .stress
                            font-size: 24px
            .favorite
                position: absolute
                width: 50px
                right:11px
                top: 18px
                text-align: center
                .icon-favorite
                    display: block
                    margin-bottom: 4px
                    line-height: 24px
                    font-size: 24px
                    color: #d4d6d9
                    &.active
                        color: rgb(240, 20, 20)
                .text
                    line-height: 10px
                    font-size: 10px
                    color: rgb(77, 85, 93)
        .bulletin
            padding: 18px 18px 0 18px
            .title
                margin-bottom: 8px
                line-height: 14px
                color: rgb(7, 17, 27)
                font-size: 14px
            .content-wrapper
                padding: 0 12px 16px 12px
                border-1px(rgba(7, 17, 27, 0.1))
                .content
                    line-height: 24px
                    font-size: 12px
                    color: rgb(240, 20, 20)
            .supports
                .support-item
                    padding: 16px 12px
                    border-1px(rgba(7, 17, 27, 0.1))
                    font-size: 0
                    &:last-child
                        border-none()
                .icon
                    display: inline-block
                    vertical-align: top
                    width: 12px
                    height: 12px
                    margin-right: 4px
                    background-size: 12px 12px
                    background-repeat: no-repeat
                    &.decrease
                        bg-image('decrease_4')
                    &.discount
                        bg-image('discount_4')
                    &.guarantee
                        bg-image('guarantee_4')
                    &.invoice
                        bg-image('invoice_4')
                    &.special
                        bg-image('special_4')
                .text
                    line-height: 16px
                    font-size: 12px
                    color: rgb(7, 17, 27)
        .pics
            padding: 18px
            .title
                margin-bottom: 12px
                line-height: 14px
                color: rgb(7, 17, 27)
                font-size: 14px
            .pic-wrapper
                width: 100%
                overflow: hidden
                white-space: nowrap  // 超过的时候不会被折行
                .pic-list
                    font-size: 0   // 减少横向排列图片之间的间隙
                    .pic-item
                        display: inline-block
                        margin-right: 6px
                        width: 120px
                        height: 90px
                        &:last-child
                            margin: 0
        .info
            padding: 18px 18px 0 18px
            .title
                padding-bottom: 12px
                line-height: 14px
                border-1px( rgba(7, 17, 27, 0.1))
                font-size: 14px
            .info-item
                padding: 16px 12px
                line-height: 16px
                border-1px( rgba(7, 17, 27, 0.1))
                font-size: 12px
                &:last-child
                    border-none()
</style>
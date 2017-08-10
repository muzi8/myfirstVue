<template>
    <div class="cartcontrol">
        <transition name="move">
            <!-- 这里和下面的@click都加了.stop.prevent阻止被穿透的默认事件。不然点击这个会直接弹到详情页-->
            <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart" >
                <span class="inner icon-remove_circle_outline"></span>
            </div>
        </transition>
        <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
        <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
    </div>
</template>

<script type="text/ecmascript-6">
    import Vue from 'vue';

    export default {
        props: {
          food: {
              type: Object
          }
        },
        methods: {
            addCart(event) {  // 需要BSscroll派发一个事件，才能去点击
                if (!event._constructed) {  // 不是自己派发的点击事件，将它return掉
                    return;
                }
                if (!this.food.count) {
                    Vue.set(this.food, 'count', 1);
                } else {
                    this.food.count++;
                }
                this.$root.eventHub.$emit('cartadd', event.target);  // 在组件内触发事件-购物车小球
            },
            decreaseCart(event) {
                if (!event._constructed) {  // 不是自己派发的点击事件，将它return掉
                    return;
                }
                if (this.food.count) {
                    this.food.count--;
                }
            }
        }
    };
</script>

<style lang="stylus" type="text/stylus">
    .cartcontrol
        font-size: 0
        .cart-decrease
            display: inline-block
            padding: 6px
            .inner
                display: inline-block
                font-size: 24px
                line-height: 24px
                color: rgb(0, 160, 220)
                transition: all .4s linear
            &.move-enter-active, &.move-leave-active
                transition: all .4s linear
                .inner
                    transform: rotate(0)
            &.move-enter, &.move-leave-to
                opacity: 0
                transform: translate3d(24px, 0, 0)
                .inner
                    transform: rotate(180deg)
        .cart-count
            display: inline-block
            vertical-align: top
            width: 12px
            padding-top: 6px
            line-height: 24px
            font-size: 10px
            color: rgb(147, 153, 159)
        .cart-add
            display: inline-block
            padding: 6px
            font-size: 24px
            line-height: 24px
            color: rgb(0, 160, 220)
</style>
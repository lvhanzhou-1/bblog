<template>
    <ul class="menus">
        <li v-for="(item,index) in menus" :key="index">
            <div class="title-container">
                <div class="title-h">{{ `H${item.h_level}` }}</div>
                <div class="title-content" @click="menusTreeClick(item.offsetTop)">{{ item.h_title }}</div>
            </div>
            <ul v-if="item[childLabel]" class="child">
                <MenusTree :menus="item[childLabel]" :child-label="childLabel"></MenusTree>
            </ul>
        </li>
    </ul>

    <!--    <ul class="menus">-->
    <!--        <li v-for="item in menus" :key="item.h_id">-->
    <!--            <a @click="scrollEvent" :href="`#${item.h_id}`">{{ item.h_title }}</a>-->
    <!--&lt;!&ndash;            <span @click="menusTreeClick(item.offsetTop)">◊ {{ item.h_title }}</span>&ndash;&gt;-->
    <!--            <ul v-if="item[childLabel]" class="child">-->
    <!--                <MenusTree :menus="item[childLabel]" :child-label="childLabel"></MenusTree>-->
    <!--            </ul>-->
    <!--        </li>-->
    <!--    </ul>-->
</template>

<script>
export default {
    name: "MenusTree",
    props: {
        menus: {
            type: [Object, Array],
            required: true
        },
        childLabel: {
            type: String,
            default: 'child'
        }
    },
    data() {
        return {}
    },
    methods: {

        menusTreeClick(height) {
            console.info("🚀 ~ file:MenusTree method:menusTreeClick line:44 -----height", height)

            const currentY = document.documentElement.scrollTop || document.body.scrollTop

            console.info("🚀 ~ file:MenusTree method:menusTreeClick line:48 -----currentY", currentY)


            window.scrollTo(
                0,
                height + 450
            )
        },

        // scrollAnimation( targetY) {
        //     // 获取当前位置方法
        //     const currentY = document.documentElement.scrollTop || document.body.scrollTop
        //
        //     // 计算需要移动的距离
        //     let needScrollTop = targetY - currentY
        //     let _currentY = currentY
        //     setTimeout(() => {
        //         // 一次调用滑动帧数，每次调用会不一样
        //         const dist = Math.ceil(needScrollTop / 10)
        //         _currentY += dist
        //         window.scrollTo(_currentY, currentY)
        //         // 如果移动幅度小于十个像素，直接移动，否则递归调用，实现动画效果
        //         if (needScrollTop > 10 || needScrollTop < -10) {
        //             scrollAnimation(_currentY, targetY)
        //         } else {
        //             window.scrollTo(_currentY, targetY)
        //         }
        //     }, 1)
        // }


    }
}
</script>

<style scoped lang="scss">
@import "/src/styles/variables";

.menus {
    //line-height: 30px;
}

.child {
    padding-left: 15px;
}

.title-container {
    width: 100%;

    height: 30px;
    display: flex;
    align-items: center;

    .title-h {
        //padding-right: 10px;
        //width: 15%;
        line-height: 24px;
        color: #97a8be;
        height: 24px;
        font-size: 16px;
        padding-right: 5px;
    }

    .title-content {
        //width: 80%;
        color: #3e444d;
        font-size: 16px;
        line-height: 24px;
        height: 24px;
        @include textOneLine
    }

    &:hover div {
        //color: #b94646;
        color: #6ac5ea;
        font-weight: 550;
    }

    margin: 0;
    padding: 0;
}
</style>

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
    <!--&lt;!&ndash;            <span @click="menusTreeClick(item.offsetTop)">โ {{ item.h_title }}</span>&ndash;&gt;-->
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
            console.info("๐ ~ file:MenusTree method:menusTreeClick line:44 -----height", height)

            const currentY = document.documentElement.scrollTop || document.body.scrollTop

            console.info("๐ ~ file:MenusTree method:menusTreeClick line:48 -----currentY", currentY)


            window.scrollTo(
                0,
                height + 450
            )
        },

        // scrollAnimation( targetY) {
        //     // ่ทๅๅฝๅไฝ็ฝฎๆนๆณ
        //     const currentY = document.documentElement.scrollTop || document.body.scrollTop
        //
        //     // ่ฎก็ฎ้่ฆ็งปๅจ็่ท็ฆป
        //     let needScrollTop = targetY - currentY
        //     let _currentY = currentY
        //     setTimeout(() => {
        //         // ไธๆฌก่ฐ็จๆปๅจๅธงๆฐ๏ผๆฏๆฌก่ฐ็จไผไธไธๆ?ท
        //         const dist = Math.ceil(needScrollTop / 10)
        //         _currentY += dist
        //         window.scrollTo(_currentY, currentY)
        //         // ๅฆๆ็งปๅจๅนๅบฆๅฐไบๅไธชๅ็ด?๏ผ็ดๆฅ็งปๅจ๏ผๅฆๅ้ๅฝ่ฐ็จ๏ผๅฎ็ฐๅจ็ปๆๆ
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

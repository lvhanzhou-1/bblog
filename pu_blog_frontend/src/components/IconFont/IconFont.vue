<!-- iconFont.vue -->
<template>
    <span>
        <!-- 应用阿里icon组件  官方固定写法  不封装也可以在页面中直接使用-->
        <svg :style="{width:iconClass.width,height:iconClass.height}" aria-hidden="true">
            <use :xlink:href="'#'+iconHref"/>
        </svg>
    </span>
</template>

<script>
export default {
    props: ['iconClass', 'iconHref']
    //传入的iconClass写法  iconClass: { width: "20px", height: "20px", },
}
</script>

<style>
svg{
    vertical-align: bottom;

}
</style>

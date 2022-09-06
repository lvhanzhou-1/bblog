<template>
  <div class="back-top-container">
    <div class="back-top-box" @click="backTopHandle">
<!--        <i class="el-icon-top"></i>-->
        <img :src="src" alt="">
    </div>
  </div>
</template>

<script>
export default {
  name: "BackTop",
    data(){
      return {
          src:require('@/assets/backTop.png')
      }
    },
  methods: {
    backTopHandle(){
      this.$emit('backTopHandle')
    },
  },
}
</script>

<style scoped lang="scss">
@import "BackTop";
</style>

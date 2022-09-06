<template>
  <section class="app-main">

    <transition mode="out-in" name="fade-transform">

      <keep-alive :include="keepAliveIncludes">
        <router-view :key="key"/>
      </keep-alive>

    </transition>

  </section>
</template>

<script>
export default {
  name: "AppMain",
  computed: {
    key() {
      return this.$route.name;
    },
    keepAliveIncludes(){
      return this.$store.state.app.keepAliveIncludes
    },
  },

}
</script>

<style scoped lang="scss">
@import "AppMain.scss";
</style>

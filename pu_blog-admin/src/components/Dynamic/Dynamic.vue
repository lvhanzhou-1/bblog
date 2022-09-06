<template>
    <div class="dynamic-box">
        <el-timeline>
            <el-timeline-item :color="`#75e0c7`" v-for="(item) in timeLines" :key="item.uid"
                              :timestamp="item.time | changeTimeFormat" placement="top">
                <el-card>
                    <h4>{{ item.newMethod }} {{ item.newDataBase }}: {{ item.itemName }}</h4>
                    <br>
                    <span class="userInfo">{{ item.user }} 提交于 {{ item.time }}</span>
                </el-card>
            </el-timeline-item>
        </el-timeline>
    </div>
</template>

<script>
export default {
    name: "Dynamic",
    props: {
        timeLines: {
            type: Array,
            default: () => []
        }
    },
    components: {},
    data() {
        return {
            isEmpty: false
        }
    },

    methods: {},
    computed: {},
    watch: {},
    mounted() {
    },
    filters: {
        changeTimeFormat(val) {
            // console.log(val);
            return val.split(' ')[0]
        }
    }
}
</script>

<style scoped lang="scss">
@import "Dynamic";
</style>

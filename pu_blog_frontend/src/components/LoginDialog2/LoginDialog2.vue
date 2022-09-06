<template>
    <div class="login-dialog-container">
        <el-dialog
            title="登录"
            :append-to-body="true"
            :visible.sync="isShow"
            width="400px"
            :close-on-click-modal="false"
            :before-close="beforeCloseHandle"
            custom-class="login-dialog-custom"
        >
            <div class="icon-btns-box">

                <el-tooltip content="Gitee" effect="light" placement="bottom" >
                    <div class="icon-box gitee" @click="giteeClickHandle">
                        <IconFont :icon-class="{width:'50px',height:'50px'}"
                                  icon-href="icon-gitee"></IconFont>
                    </div>
                </el-tooltip>

            </div>

            <div class="tip-message-box">
                <p>注册登录即表示同意 <a href="javascript:;" onClick="return false;">用户协议</a>、<a href="javascript:;"
                                                                                        onClick="return false;">隐私政策</a>
                </p>
                <p>当前仅支持Gitee登录</p>
            </div>

        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "LoginDialog",
    props: {},
    components: {},
    data() {
        return {
            isShow: true
        }
    },
    methods: {
        beforeCloseHandle(done) {
            this.$emit('closeLoginHandle')
            done()
        },
        giteeClickHandle() {
            console.info("🚀 ~ file:LoginDialog2 method:giteeClickHandle line:60 -----", 'giteeClickHandle')
            this.$emit('giteeClickHandle')
        },
        qqClickHandle() {
            this.$emit('qqClickHandle')
        },
        microBlogClickHandle() {
            this.$emit('microBlogClickHandle')
        },


    },
    computed: {},
    watch: {},
    mounted() {
    }
}
</script>

<style scoped lang="scss">
@import "LoginDialog2";
</style>

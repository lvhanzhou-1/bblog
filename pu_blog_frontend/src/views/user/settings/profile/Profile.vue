<template>
    <div class="profile-container">
        <h3>个人资料</h3>

        <main class="info-box">
            <div class="left-info">
                <el-form
                    ref="form"
                    :model="form"
                    label-width="80px"
                    label-position="left"
                >
                    <el-form-item label="用户名">
                        <el-input
                            v-model="form.nickName"
                            placeholder="请输入内容"
                            maxlength="20"
                            show-word-limit
                        ></el-input>
                    </el-form-item>

                    <el-form-item label="性别">
                        <el-radio v-model="form.gender" label="男">男</el-radio>
                        <el-radio v-model="form.gender" label="女">女</el-radio>
<!--                        <el-input-->
<!--                            v-model="form.gender"-->
<!--                            placeholder="请输入内容"-->
<!--                            maxlength="20"-->
<!--                            show-word-limit-->
<!--                        ></el-input>-->
                    </el-form-item>


                    <el-form-item label="电话">
                        <el-input
                            type="tel"
                            v-model="form.userTel"
                            placeholder="请输入内容"
                            maxlength="11"
                            show-word-limit
                        ></el-input>
                    </el-form-item>

                    <el-form-item label="职位">
                        <el-input
                            v-model="form.userPosition"
                            placeholder="请输入内容"
                            maxlength="10"
                            show-word-limit
                        ></el-input>
                    </el-form-item>

                    <el-form-item label="公司">
                        <el-input
                            v-model="form.userCompany"
                            placeholder="请输入内容"
                            maxlength="30"
                            show-word-limit
                        ></el-input>
                    </el-form-item>

                    <el-form-item label="个人主页">
                        <el-input
                            v-model="form.userWebsite"
                            placeholder="请输入内容"
                            maxlength="100"
                            show-word-limit
                        ></el-input>
                    </el-form-item>

                    <el-form-item label="个人介绍">
                        <el-input
                            type="textarea"
                            v-model="form.userIntro"
                            placeholder="请输入内容"
                            maxlength="100"
                            show-word-limit
                            :autosize="{minRows: 4, maxRows: 4 }"
                        ></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">保存修改</el-button>
                    </el-form-item>

                </el-form>
            </div>
            <div class="right-profile">
<!--                <UploadProfile/>-->
                <el-upload
                    v-if="!currentCoverUrl"
                    class="choose-img"
                    name="file"
                    :action="action"
                    :headers="headers"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeUpload"
                    accept=".jpg,.png,.gif,.jpeg,.ico"
                >
                    <i class="el-icon-plus"></i>
                </el-upload>

            </div>
        </main>

    </div>
</template>

<script>
// import UploadProfile from "@/components/UploadProfile/UploadProfile";
import {dataURItoBlob} from "../../../../../../pu_blog-admin/src/utils/dataURItoBlob";

export default {
    name: "Profile",
    props: {},
    components: {
        // UploadProfile
    },
    data() {
        return {
            form: {
                userTel: '',
                userProfile: '',
                nickName: '',
                userPosition: '', // 职位
                userCompany: '',// 公司
                userWebsite: '',// 个人主页
                userIntro: '',// 个人介绍
                gender: '', // 性别
            }
        }
    },
    methods: {
        onSubmit() {
            console.log('submit!');
        },
        /*上传封面图片，带压缩*/
        beforeUpload(file) { // 文件上传前钩子


            // const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' //图片格式是否为png或jpg
            const isJpgOrPng = file.type.startsWith('image')
            const isLt10M = file.size / 1024 / 1024 < 8 //判断图片大小是否超过10MB
            if (!isJpgOrPng) {
                this.$message.error('文件格式错误！')
            } else if (!isLt10M) {
                this.$message.error('文件过大！')
            } else {
                // const _this = this
                console.log('压缩');
                return new Promise(resolve => {
                    const reader = new FileReader()
                    const image = new Image()
                    image.onload = () => {
                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');
                        const originWidth = image.width
                        const originHeight = image.height
                        // 最大尺寸限制，可通过设置宽高来实现图片压缩程度
                        let maxWidth = 800, maxHeight = 800
                        // 目标尺寸
                        let targetWidth = originWidth, targetHeight = originHeight
                        // 图片尺寸超过800x800的限制
                        if (originWidth > maxWidth || originHeight > maxHeight) {
                            if (originWidth / originHeight > maxWidth / maxHeight) {
                                // 更宽，按照宽度限定尺寸
                                targetWidth = maxWidth;
                                targetHeight = Math.round(maxWidth * (originHeight / originWidth));
                            } else {
                                targetHeight = maxHeight;
                                targetWidth = Math.round(maxHeight * (originWidth / originHeight));
                            }
                        }
                        canvas.width = targetWidth
                        canvas.height = targetHeight
                        context.clearRect(0, 0, targetWidth, targetHeight)
                        context.drawImage(image, 0, 0, targetWidth, targetHeight)
                        const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
                        const blobData = dataURItoBlob(dataUrl, 'image/jpeg')
                        resolve(blobData)
                    }
                    reader.onload = (e => {
                        image.src = e.target.result;
                    })
                    reader.readAsDataURL(file)
                })
            }
            return isJpgOrPng && isLt10M
        },
        handleAvatarSuccess(res) {
            console.log(res, 'res')
            let {data} = res
            // this.$emit('handleAvatarSuccess', data[0].url)

            this.form.userProfile = data[0].url
            // userProfile

        },
    },
    computed: {
        /*文件上传地址*/
        action() {
            let baseURL = process.env.VUE_APP_BASE_URL;
            // if(process.env.NODE_ENV === 'development'){ // 开发环境
            //     baseURL = myConfig.apiUrlDevelopment
            // } else { // 生产环境
            //     if(this.isDemoVersion){
            //         baseURL = myConfig.apiUrlDemo
            //     } else {
            //         baseURL = myConfig.apiUrlProduction
            //     }
            // }
            return `${baseURL}/file/uploadFile`;
        },
        headers() {
            return {
                Authorization: this.$store.state.user.token,
                userid: this.$store.state.user.loginUserInfo.uid,
                username: this.$store.state.user.loginUserInfo.user_name,
            };
        },
        /*用户信息*/
        loginUserInfo() {
            return this.$store.state.user.loginUserInfo
        },
    },
    watch: {},
    mounted() {
    }
}
</script>

<style scoped lang="scss">
@import "Profile";
</style>

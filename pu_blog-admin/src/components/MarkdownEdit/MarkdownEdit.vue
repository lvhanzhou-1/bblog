<template>
    <div class="markdown-edit-container">
<!--        <div id="vditor" style="min-height: 90%; width: auto;"></div>-->

        <mavon-editor  ref="md" @imgAdd="imgAdd" @change="renderHtml" v-model="md_text"/>
    </div>
</template>

<script>
import "vditor/dist/index.css"

import axios from "@/lib/request";

export default {
    name: "MarkdownEdit",
    props: {
        blogContent: {
            type: String,
            default: () => ''
        }
    },
    data() {
        return {

            md_text:'',
            value_html:'',

        }
    },
    methods: {

        renderHtml(md_text){
            // this.value_html = value_html

            this.$emit('blogContentInputHandle', md_text)
        },

        // 绑定@imgAdd event
        /*上传文章内图片，带压缩*/
        imgAdd(pos, $file) { //上传图片
            let $vm = this.$refs.md
            const formData = new FormData()

            let requestHeaders = this.requestHeaders

            let imgUploadUrl = this.uploadUrl
            // 压缩图片
            if ($file.type.indexOf("image") === 0) {
                let reader = new FileReader(), img = new Image();
                reader.readAsDataURL($file)
                reader.onload = function (e) {
                    img.src = e.target.result
                }


                img.onload = async function() {
                    // 缩放图片需要的canvas（也可以在DOM中直接定义canvas标签，这样就能把压缩完的图片不转base64也能直接显示出来）
                    let canvas = document.createElement('canvas');
                    let context = canvas.getContext('2d');

                    // 图片原始尺寸
                    let originWidth = this.width
                    let originHeight = this.height

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
                    // canvas对图片进行缩放
                    canvas.width = targetWidth
                    canvas.height = targetHeight
                    // 清除画布
                    context.clearRect(0, 0, targetWidth, targetHeight)
                    // 图片压缩
                    context.drawImage(img, 0, 0, targetWidth, targetHeight)
                    /*第一个参数是创建的img对象；第二三个参数是左上角坐标，后面两个是画布区域宽高*/

                    //压缩后的图片转base64 url
                    /*canvas.toDataURL(mimeType, qualityArgument),mimeType 默认值是'image/png';
                     * qualityArgument表示导出的图片质量，只有导出为jpeg和webp格式的时候此参数才有效，默认值是0.92*/
                    let newUrl = canvas.toDataURL('image/jpeg', 0.6);//base64 格式

                    // base64 转 blob 再转 file
                    let arr = newUrl.split(","),
                        mime = arr[0].match(/:(.*?);/)[1], // 去掉url的头，并转化为byte
                        bstr = atob(arr[1]), // 处理异常,将ascii码小于0的转换为大于0
                        n = bstr.length,
                        u8arr = new Uint8Array(n);
                    while (n--) {
                        u8arr[n] = bstr.charCodeAt(n);
                    }
                    // 转blob
                    let filename = Date.parse(new Date()) + ".jpeg"
                    // 转file
                    let file = new File([u8arr], filename, {type: mime})

                    // 将图片上传到服务器
                    formData.append('image', file)



                    try {
                        // console.info("🚀 ~ file:MarkdownEdit method:onload line:115 -----this.uploadUrl",imgUploadUrl )
                        let res = await axios.post(imgUploadUrl, formData, {
                            headers: requestHeaders,
                        })

                        // console.info("🚀 ~ file:MarkdownEdit method:onload line:125 -----res", res)

                        let url = res.data.data[0].url;

                        // console.info("🚀 ~ file:MarkdownEdit method:onload line:129 -----url",url )

                        // url = process.env.VUE_APP_BASE_API + url

                        $vm.$img2Url(pos, url);

                    } catch (e) {
                        // console.info("🚀 ~ file:MarkdownEdit method:onload line:124 -----", e)
                    }




                }
            }
        },

    },
    computed: {
        requestHeaders() {
            return {
                Authorization: this.$store.state.user.token,
                userid: this.$store.state.user.loginUserInfo.uid,
                username: this.$store.state.user.loginUserInfo.user_name,
                "Content-Type": "multipart/form-data"
            }
        },
        uploadUrl() {
            let baseURL = process.env.VUE_APP_BASE_URL

            return `${baseURL}/file/uploadFile`
        },


    },

    mounted() {
        if(this.blogContent){
            this.md_text = this.blogContent
        }
    }

}
</script>

<style scoped lang="scss">
@import "MarkdownEdit";

#vditor{
    height: 100%;
}
</style>

const Service = require('egg').Service;
const {
    saveSpecialPartSectionSql,
    deleteSpecialPartSectionByUidSql,
    updateSpecialPartSectionByUidSql,
    querySpecialPartSectionPageSql,
    queryAllCountSpecialPartSectionSql,
    querySpecialPartSectionBySectionTitleSql,
    querySpecialPartSectionByUidSql,
    querySpecialPartSectionAllSql,
} = require('../sql/specialPartSection')
const generateUuid = require("../utils/generateUuid");
const dayjs = require("dayjs");


class SpecialPartSection extends Service {

    async querySpecialPartSectionBySectionTitle(sectionTitle, specialPartId) {
        // return await specialPartSectionDao.querySpecialPartSectionBySectionTitle(sectionTitle, specialPartId)
        const resultArr = await this.app.mysql.query(querySpecialPartSectionBySectionTitleSql, [sectionTitle, specialPartId])
        return resultArr[0]
    }

    async querySpecialPartSectionByUid(uid) {
        const resultArr = await this.app.mysql.query(querySpecialPartSectionByUidSql, [uid])
        return resultArr[0]
    }

    async saveSpecialPartSection(params) {
        let {
            uid, sectionTitle, specialPartId, orderNum,
            createTime, updateTime
        } = params

        /**
         * 模式：$保存接口，sql参数接收$
         * 替换方式：提取出所有解析过的数据表字段，将连字符变量，替换为为小驼峰格式字符串
         */
        await this.app.mysql.query(
            saveSpecialPartSectionSql,
            [
                uid, sectionTitle, specialPartId, orderNum,
                createTime, updateTime
            ]
        )
        return true
    }

    async querySpecialPartSectionPage(params) {
        let {
            currentPage, pageSize,
            sectionTitle, specialPartId, orderNum
        } = params

        let _currentPage = (currentPage - 1) * pageSize

        /**
         * 模式：$分页查询接口，sql参数接收$
         * 模式解析方式：提取解析过的数据表，默认值不为null的字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid，新增 currentPage, pageSize
         */
        return await this.app.mysql.query(
            querySpecialPartSectionPageSql,
            [
                `%${sectionTitle}%`,
                `%${specialPartId}%`,
                `${orderNum}`,
                _currentPage,
                pageSize
            ])
    }

    async updateSpecialPartSectionByUid(params) {
        let {
            uid, sectionTitle, specialPartId, orderNum,
            createTime, updateTime
        } = params

        /**
         * 模式：$更新接口，sql参数接收$
         * 模式解析方式：提取出所有解析过的数据表字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid createTime,updateTime
         */
        await this.app.mysql.query(
            updateSpecialPartSectionByUidSql,
            [
                sectionTitle, specialPartId, orderNum,
                createTime, updateTime, uid
            ]
        )
        return true
    }

    async deleteSpecialPartSectionByUid(uids) {
        let promiseArr = []
        for (const uid of uids) {
            promiseArr.push((async (uid) => {

                let {section_title} =await this.ctx.service.specialPartSection.querySpecialPartSectionByUid(uid)
                /*=========*/
                await this.ctx.service.timeLine.saveTimeLine({
                    uuid: generateUuid(),
                    user_name: this.ctx.request.header.username,
                    user_id: this.ctx.request.header.userid,

                    method: 'delete',
                    database_name: 't_special_part_section',
                    item_name: `${section_title}`,

                    create_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    update_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                })


                return await this.app.mysql.query(deleteSpecialPartSectionByUidSql, [uid])
            })(uid))
        }
        return await Promise.all(promiseArr)
    }

    async queryAllCountSpecialPartSection(params) {
        let {
            sectionTitle, specialPartId, orderNum
        } = params

        /**
         * 模式：$查询接口，sql查询总条数参数接收$
         * 模式解析方式：提取解析过的数据表，默认值不为null的字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid
         */
        const result = await this.app.mysql.query(
            queryAllCountSpecialPartSectionSql,
            [
                `%${sectionTitle}%`,
                `%${specialPartId}%`,
                `${orderNum}`
            ])
        return result[0]
    }

    async querySpecialPartSectionAll() {
        return await this.app.mysql.query(querySpecialPartSectionAllSql, [])
    }

    async querySpecialPartSectionTree(isXzzOrCheny) {
        /**
         * 1、获取所有的专题分类
         * 2、获取所有的专题
         * 3、获取所有的专题->部分
         * 4、获取所有的专题->部分->章节
         */
            // 1、
        const specialSortList = await this.ctx.service.specialSort.querySpecialSortAll()
        // 2、
        const specialList = await this.ctx.service.special.querySpecialAll(isXzzOrCheny)
        // 3、
        const specialPartList = await this.ctx.service.specialPart.querySpecialPartAll()
        // 4、
        const specialPartSectionList = await this.app.mysql.query(querySpecialPartSectionAllSql, [])

        return this.convertToTreeData({
            specialSortList,
            specialList,
            specialPartList,
            specialPartSectionList,
            root: 'specialSort'
        })

    }

    async querySpecialPartSectionBlogTreeBySpecialUid(uid, isXzzOrCheny) {
        /**
         * 1、获取所有的专题
         * 2、获取所有的专题->部分
         * 3、获取所有的专题->部分->章节
         * 4、获取所有的专题->部分->章节->文章
         */

            // 1、
        const specialList = await this.ctx.service.special.querySpecialByUid(uid)
        console.log(specialList, 'specialList')
        if (!specialList) { // 若果没有查到，直接啥都不用干了，前台输的是错误的uid
            return []
        } else {
            // 2、
            const specialPartList = await this.ctx.service.specialPart.querySpecialPartAll()
            // 3、
            const specialPartSectionList = await this.app.mysql.query(querySpecialPartSectionAllSql, [])
            // 4、
            const specialPartSectionBlogList = await this.ctx.service.specialPartSectionBlog.querySpecialPartSectionBlogAll(isXzzOrCheny)
            console.log(specialPartSectionBlogList[0], 'specialPartSectionBlogList[0]')

            return this.convertToTreeData({
                specialList: [specialList],
                specialPartList,
                specialPartSectionList,
                specialPartSectionBlogList,
                root: 'special'
            })
        }


    }

    async querySpecialPartSectionTree2(isXzzOrCheny) {
        /**
         * 1、获取所有的专题分类
         * 2、获取所有的专题
         * 3、获取所有的专题->部分
         * 4、获取所有的专题->部分->章节
         * 5、获取所有的专题->部分->章节->文章
         */
            // 1、
            // const specialSortList = await specialSortDao.querySpecialSortAll()
        const specialSortList = await this.ctx.service.specialSort.querySpecialSortAll()
        // 2、
        const specialList = await this.ctx.service.special.querySpecialAll(isXzzOrCheny)
        // 3、
        const specialPartList = await this.ctx.service.specialPart.querySpecialPartAll()
        // 4、
        const specialPartSectionList = await this.app.mysql.query(querySpecialPartSectionAllSql, [])
        // 5、
        const specialPartSectionBlogList = await this.ctx.service.specialPartSectionBlog.querySpecialPartSectionBlogAll()

        return this.convertToTreeData({
            specialSortList,
            specialList,
            specialPartList,
            specialPartSectionList,
            specialPartSectionBlogList,
            root: 'specialSort'
        })

    }


    /**
     * @description 数组转换为map，根据 keyword 分组
     * @param {Array} arr 待转换的数组
     * @param {String} flag 是哪一层级的数据，做个区分
     * @return {Map<any, any>} tempMap 返回的map
     */
    convertToMap(arr, flag) {

        let tempMap = new Map()

        arr.map((item) => {
            // 转换为对应的格式
            let obj, key
            switch (flag) {
                // 二级
                case 'isSpecial':
                    key = item.special_sort_id
                    obj = {
                        id: item.uid,
                        label: item.special_name,
                        special_summary: item.special_summary,
                        cover_url: item.cover_url,
                        order: item.order_num,
                        [flag]: true,
                        children: []
                    }
                    break;
                // 三级
                case 'isSpecialPart':
                    key = item.special_id
                    obj = {
                        id: item.uid,
                        label: item.part_name,
                        part_title: item.part_title,
                        part_summary: item.part_summary,
                        order: item.order_num,
                        [flag]: true,
                        children: []
                    }
                    break;
                //  四级
                case 'isSpecialPartSection':
                    key = item.special_part_id
                    obj = {
                        id: item.uid,
                        label: item.section_title,
                        order: item.order_num,
                        [flag]: true,
                        children: []
                    }
                    break;
                //  五级
                case 'isSpecialPartSectionBlog':
                    key = item.part_section_id
                    obj = {
                        id: item.uid,
                        blog_id: item.blog_id,
                        label: item.blog_title,
                        order: item.order_num,
                        [flag]: true,
                        children: []
                    }
                    break;

            }

            if (tempMap.has(key)) {
                tempMap.get(key).push(obj)
            } else {
                tempMap.set(key, [obj])
            }
        })

        return tempMap
    }

    /**
     * @description 将有关联关系的数组列表，转换为树形结构
     * @param {Array} specialSortList 非必填，
     * @param {Array} specialList 非必填，
     * @param {Array} specialPartList 非必填，
     * @param {Array} specialPartSectionList 非必填，
     * @param {Array} specialPartSectionBlogList 非必填，
     * @param {String} root 必填，树形结构的第一层数据。 specialSort或special
     * @return {Array} resultArr 处理过的树形结构
     */
    convertToTreeData({
                          specialSortList = [],
                          specialList = [],
                          specialPartList = [],
                          specialPartSectionList = [],
                          specialPartSectionBlogList = [],
                          root = '',
                      }) {
        console.log(specialSortList.length, 'specialSortList.length')
        console.log(specialList.length, 'specialList.length')
        console.log(specialPartList.length, 'specialPartList.length')
        console.log(specialPartSectionList.length, 'specialPartSectionList.length')
        console.log(specialPartSectionBlogList.length, 'specialPartSectionBlogList.length')


        let resultArr = [] // 存放最终的结果
        /*专题分类==专题==专题部分==专题部分章节==专题部分章节博客*/
        if (root === 'specialSort') {
            console.log('root === \'specialSort\'')
            let specialMap = specialList.length > 0 ? this.convertToMap(specialList, 'isSpecial') : null
            let specialPartMap = specialPartList.length > 0 ? this.convertToMap(specialPartList, 'isSpecialPart') : null
            let specialPartSectionMap = specialPartSectionList.length > 0 ? this.convertToMap(specialPartSectionList, 'isSpecialPartSection') : null
            let specialPartSectionBlogMap = specialPartSectionBlogList.length > 0 ? this.convertToMap(specialPartSectionBlogList, 'isSpecialPartSectionBlog') : null
            // 1
            specialSortList.map(sort => {
                let sortObj = {
                    id: sort.uid,
                    label: sort.special_sort_name,
                    order: sort.order_num,
                    isSpecialSort: true,
                    children: []
                }
                if (specialMap && specialMap.has(sortObj.id)) {
                    // 2
                    sortObj.children = specialMap.get(sortObj.id)

                    sortObj.children.map(special => {
                        if (specialPartMap && specialPartMap.has(special.id)) {
                            // 3
                            special.children = specialPartMap.get(special.id)

                            special.children.map(specialPart => {
                                if (specialPartSectionMap && specialPartSectionMap.has(specialPart.id)) {
                                    // 4
                                    specialPart.children = specialPartSectionMap.get(specialPart.id)

                                    specialPart.children.map(specialPartSectionBlog => {
                                        if (specialPartSectionBlogMap && specialPartSectionBlogMap.has(specialPartSectionBlog.id)) {
                                            // 5
                                            specialPartSectionBlog.children = specialPartSectionBlogMap.get(specialPartSectionBlog.id)
                                        }
                                    })

                                }
                            })
                        }
                    })

                }

                resultArr.push(sortObj)
            })
        } else if (root === 'special') {
            console.log('root === \'special\'')
            let specialPartMap = specialPartList.length > 0 ? this.convertToMap(specialPartList, 'isSpecialPart') : null
            let specialPartSectionMap = specialPartSectionList.length > 0 ? this.convertToMap(specialPartSectionList, 'isSpecialPartSection') : null
            let specialPartSectionBlogMap = specialPartSectionBlogList.length > 0 ? this.convertToMap(specialPartSectionBlogList, 'isSpecialPartSectionBlog') : null
            // 1
            console.log(specialList, 'specialList')
            specialList.map(special => {
                let specialObj = {
                    id: special.uid,
                    label: special.special_name,
                    special_summary: special.special_summary,
                    cover_url: special.cover_url,
                    order: special.order_num,
                    isSpecial: true,
                    children: []
                }
                if (specialPartMap && specialPartMap.has(specialObj.id)) {
                    // 2
                    specialObj.children = specialPartMap.get(specialObj.id)

                    specialObj.children.map(specialPart => {
                        if (specialPartSectionMap && specialPartSectionMap.has(specialPart.id)) {
                            // 3
                            specialPart.children = specialPartSectionMap.get(specialPart.id)

                            specialPart.children.map(specialPartSectionBlog => {
                                if (specialPartSectionBlogMap && specialPartSectionBlogMap.has(specialPartSectionBlog.id)) {
                                    // 4
                                    specialPartSectionBlog.children = specialPartSectionBlogMap.get(specialPartSectionBlog.id)
                                }
                            })

                        }
                    })
                }


                resultArr.push(specialObj)
            })

        }


        return resultArr
    }
}

module.exports = SpecialPartSection;

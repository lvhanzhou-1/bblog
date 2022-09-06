import Dexie from 'dexie';

const db = new Dexie('myArticle');
db.version(1).stores({
    article: "++id,content,blogUid,blogTitle", // Primary key and indexed props
});

class myDB {
    constructor() {
    }


    async add(content) {
        return await db.article.add({content})
    }

    /**
     * 只查询id为1的第一条记录
     */
    async query() {
        return await db.article.get(1)
    }

    /**
     * @description 只更新第一条记录，当没有时，会创建一条新的
     * @param {String} content 博客内容
     * @param {String} title 博客标题
     * @param {String} blogUid 博客uid
     * @return {Promise<AxiosResponse<any>|IDBRequest<IDBValidKey>|void>} 更新结果promise对象
     */
    async update(content, title, blogUid) {
        return await db.article.put({id: 1, content, title, blogUid})
    }


    /**
     * 只删除第一条记录
     */
    async delete() {
        return await db.article.delete(1)
    }
}


export default myDB




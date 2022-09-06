const Service = require("egg").Service;

const {
	saveFileSql,
	queryAllFileSortSql,
	queryAllFilePageSql,
	queryAllFileCountSql,
	deleteFileByUidSql,
	updateFileSortByUidSql,
	queryAllFileSql,
	queryFileByUidSql,
} = require("../sql/file");

const {
	queryFileSortBySortIdSql,
	saveFileSortSql,
} = require("../sql/fileSort");

const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");
const generateUuid = require("../utils/generateUuid");
// const fileDao = require('../dao/file')
// const fileSortDao = require('../dao/fileSort')

const { baseUrl } = require("../constant/config");

class File extends Service {
	// 递归创建嵌套目录 同步创建
	mkdirsSync(dirname) {
		if (fs.existsSync(dirname)) {
			return true;
		} else {
			if (this.mkdirsSync(path.dirname(dirname))) {
				fs.mkdirSync(dirname);
				return true;
			}
		}
	}

	/**
	 * 处理查询出来文件的数据格式
	 * 按照日期分组
	 * @param fileList
	 * @return {*}
	 */
	handleFileData(fileList) {
		return fileList.reduce((prev, current) => {
			let file = {
				fileId: current.uid,
				fileUrl: `${baseUrl}/public/upload/${current.file_suffix}/${
					current.create_time.split(" ")[0]
				}/${current.file_current_name}`,
				fileName: current.file_original_name,
				fileMarkDown: "",
			};

			let findIndex = prev.findIndex(
				(item) =>
					item.uploadTime.split(" ")[0] === current.create_time.split(" ")[0]
			);

			// 没找到，说明不是同一天上传的文件，另起炉灶，新push一条数据到数组中
			if (findIndex === -1) {
				let tempObj = {
					uploadTime: current.create_time.split(" ")[0],
					files: [file],
				};
				prev.push(tempObj);
			} else {
				// 找到了，说明是同一天的数据，push到当天数据的files字段里
				prev[findIndex].files.push(file);
			}
			return prev;
		}, []);
	}

	async uploadFile(files, fileExtraData) {
		// 递归创建文件夹，不存在就创建
		let resultPathArr = [];

		/**
		 * 判断传过来的有没有fileSortUid、fileSortName、如果没有就去t_file_sort表中查找有没有uid为-1的文件分类
		 * 规定，如果没有传分类，就去数据库建一个分类
		 */

		let resultArr = await this.app.mysql.query(queryFileSortBySortIdSql, [
			"-1",
		]);
		const findResultSort = resultArr[0];

		console.log(findResultSort, "findResultSort");
		if (!findResultSort) {
			// 没找到就新增一个默认图片分类 uid = '-1'，sort_name = '默认'，order = '-1'

			const createTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
			const updateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");

			await this.app.mysql.query(saveFileSortSql, [
				"-1",
				"",
				"默认",
				"-1",
				createTime,
				updateTime,
			]);
		}

		let fileSortUid = fileExtraData.uid ? fileExtraData.uid : "-1";
		let fileSortName = fileExtraData.sort_name
			? fileExtraData.sort_name
			: "默认";

		console.log("aaaaaaaaaaaaa");
		console.log(fileSortUid, fileSortName);

		for (let file of files) {
			console.info("🚀 ~ file:file method:uploadFile line:119 -----",file )

			/**
			 * 1、首先根据上传的文件后缀，拼接不同的存放路径
			 * 例如 public\upload\jpg\20210708\7.jpg
			 */
			// 根据文件类型，判断上传的目录，目录格式为 koa-blog-service\public\upload\jpg\20210708\7.jpg
			const suffix = path.extname(file.filename).slice(1); // 获取后缀，拼接路径，把第一个.去掉
			const nowDate = dayjs().format("YYYY-MM-DD"); // 当天的时间 20210708
			const myPath = `upload/${suffix}/${nowDate}`; // 上传的文件夹目录，为了待会回显数据地址用

			const uploadPath = path.join(this.config.baseDir, `app/public/`, myPath); // 拼接文件上传的目录，不包含文件名
			let uid = generateUuid(); // 随机生成uid，作为文件名
			const finalFileName = `${uid}.${suffix}`; // 文件上传到服务器最终的文件名，防止重复
			const filePath = path.join(uploadPath, finalFileName); // 上传后的文件全路径 koa-blog-service\public\upload\jpg\20210708\7.jpg

			/**
			 * 2、判断文件夹是否存在，不存在的话就递归创建嵌套的文件夹
			 */
			// 判断文件夹是否存在 不存在就先创建
			await this.mkdirsSync(uploadPath);
			/**
			 * 3、开始创建可读流和可写流，上传文件到对应的文件目录中
			 */

			await fs.copyFileSync(file.filepath, filePath);
			/**
			 * 4、将文件信息存储到数据库
			 */

			const createTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
			const updateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
			await this.app.mysql.query(saveFileSql, [
				uid,
				file.filename,
				finalFileName,
				suffix,
				fileSortUid,
				fileSortName,
				createTime,
				updateTime,
			]);

			/*保存 timeLine */
			await this.ctx.service.timeLine.saveTimeLine({
				uuid: generateUuid(),
				user_name: this.ctx.request.header.username,
				user_id: this.ctx.request.header.userid,
				method: "save",
				database_name: "t_file",
				item_name: file.filename,
				create_time: createTime,
				update_time: updateTime,
			});

			/**
			 * 5、将生成的服务器路径存到数组中，返回给前台
			 */
			resultPathArr.push({
				name: file.filename,
				url: `${baseUrl}/public/${myPath}/${finalFileName}`,
			});
		}
		return resultPathArr;
	}

	async queryAllFileSort() {
		return await this.app.mysql.query(queryAllFileSortSql, []);
	}

	async queryFileByUid(uid) {
		let res = await this.app.mysql.query(queryFileByUidSql, [uid]);
		return res[0];
	}

	async queryAllFilePage(currentPage, pageSize, fileSortId, createTime) {
		// let result = await fileDao.queryAllFilePage(currentPage, pageSize, fileSortId, createTime)

		let _currentPage = (currentPage - 1) * pageSize;
		let result = await this.app.mysql.query(queryAllFilePageSql, [
			fileSortId,
			`%${createTime}%`,
			_currentPage,
			pageSize,
		]);

		// 处理数据
		return this.handleFileData(result);
	}

	async queryAllFile(fileSortId, createTime) {
		let result = await this.app.mysql.query(queryAllFileSql, [
			`%${fileSortId}%`,
			`%${createTime}%`,
		]);

		// 处理数据
		return this.handleFileData(result);
	}

	async queryAllFileCount(fileSortId, createTime) {
		let result = await this.app.mysql.query(queryAllFileCountSql, [
			fileSortId,
			`%${createTime}%`,
		]);
		return result[0];
	}

	async deleteFileByUid(uids) {
		let promiseArr = [];
		for (const uid of uids) {
			promiseArr.push(
				(async (uid) => {
					let { file_original_name } =
						await this.ctx.service.file.queryFileByUid(uid);
					/*=========*/
					await this.ctx.service.timeLine.saveTimeLine({
						uuid: generateUuid(),
						user_name: this.ctx.request.header.username,
						user_id: this.ctx.request.header.userid,

						method: "delete",
						database_name: "t_file",
						item_name: file_original_name,

						create_time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
						update_time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
					});

					await this.app.mysql.query(deleteFileByUidSql, [uid]);
				})(uid)
			);
		}
		return await Promise.all(promiseArr);
	}

	async updateFileSortByUid(fileIds, sortId) {
		// 根据sortId查询名字
		// let {sort_name} = await fileSortDao.queryFileSortBySortId(sortId)

		let resultArr = await this.app.mysql.query(queryFileSortBySortIdSql, [
			sortId,
		]);
		let { sort_name } = resultArr[0];

		let promiseArr = [];
		for (const fileId of fileIds) {
			promiseArr.push(
				(async (fileId, sortId, sort_name) => {
					const updateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");

					await this.app.mysql.query(updateFileSortByUidSql, [
						sortId,
						sort_name,
						updateTime,
						fileId,
					]);
				})(fileId, sortId, sort_name)
			);
		}
		await Promise.all(promiseArr);
		return true;
	}
}

module.exports = File;

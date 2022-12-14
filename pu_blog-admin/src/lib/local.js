const KEYS = {
	TAG_NAV_LIST: "routeTags",

	USER_INFO: "userinfo",

	// IS_DEMO_VERSION: "isDemoVersion",
};
// /**
//  * @description 设置 是否是测试账号 到本地localStorage中
//  */
// export const getIsDemoVersionInLocalStorage = () => {
// 	let isDemoVersion = localStorage[KEYS.IS_DEMO_VERSION];
// 	return isDemoVersion ? Boolean(isDemoVersion) : false;
// };
// export const setIsDemoVersionInLocalStorage = (data) => {
// 	localStorage[KEYS.IS_DEMO_VERSION] = String(data);
// };
//
// export const removeIsDemoVersionInLocalStorage = () => {
// 	localStorage.removeItem(KEYS.IS_DEMO_VERSION);
// };

/**
 * @description 设置 登录用户信息 到本地localStorage中
 */
export const getUserInfoInLocalStorage = () => {
	let userInfo = localStorage[KEYS.USER_INFO];
	return userInfo ? JSON.parse(userInfo) : "";
};
/**
 * @param {Object} data 登录用户信息
 * @description 设置 登录用户信息 到本地localStorage中
 */
export const setUserInfoInLocalStorage = (data) => {
	localStorage[KEYS.USER_INFO] = JSON.stringify(data);
};

/**
 * @description 清空  localStorage中 的 登录用户信息
 */
export const removeUserInfoInLocalStorage = () => {
	localStorage.removeItem(KEYS.USER_INFO);
};

/**
 * @description 清空  localStorage中 的缓存路由标签
 */
export const removeTagNavListInLocalStorage = () => {
	localStorage.removeItem(KEYS.TAG_NAV_LIST);
};

/**
 * @param {Array} list 待保存的点击过的路由数组
 * @description 设置 缓存路由标签 到本地localStorage中
 */
export const setTagNavListInLocalStorage = (list) => {
	localStorage[KEYS.TAG_NAV_LIST] = JSON.stringify(list);
};

/**
 * @return {Array}
 * @description 从localStorage获取 缓存路由标签
 */
export const getTagNavListInLocalStorage = () => {
	let list = localStorage[KEYS.TAG_NAV_LIST];
	return list ? JSON.parse(list) : [];
};

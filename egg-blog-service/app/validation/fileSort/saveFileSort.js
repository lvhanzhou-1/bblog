const Validator = require('validator')
const {isEmpty} = require('../../utils/toolsFunction')

/**
 * @param sortName 名字不能为空
 */
module.exports = (sortName) => {

    let _sortName = isEmpty(sortName)? '' : sortName

    let isValid = false // 默认校验不通过

    if (Validator.isEmpty(_sortName)) {
        return {
            errorMsg: '分类名不能为空',
            isValid,
        }
    }

    isValid = true // 当所有的逻辑走完之后，校验通过

    return {
        errorMsg: '校验通过',
        isValid
    }
}

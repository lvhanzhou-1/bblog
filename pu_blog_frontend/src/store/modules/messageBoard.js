import {messageBoardMutation} from "@/store/mutation-types";

export default {
    state: {
        hiddenCommentsId: [], // 需要被隐藏的评论，保存他们的id，例如： ['aa','bb','cc']
        waitDeleteCommentIds: [], // 等待删除的评论，保存他们的id，例如： ['aa','bb','cc']
        waitReportedCommentId: '', // 等待被举报的评论，保存他的id，例如： '1d0f6b10-1a23-11ec-8cdb-997607a1dfa1'
    },
    mutations: {
        /**
         * @param state
         * @param {Object} payload { flag:hidden|show, uid:'需要隐藏评论的uid'}
         * @description 更新留言板页面需要隐藏的评论列表数组
         */
        [messageBoardMutation.CHANGE_MESSAGE_HIDDEN_LIST](state, payload) {
            switch (payload.flag) {
                case 'hidden':
                    state.hiddenCommentsId.push(payload.uid)
                    break
                case 'show':
                    let index = state.hiddenCommentsId.findIndex((item => item === payload.uid))
                    state.hiddenCommentsId.splice(index, 1)
                    break
            }
        },
        /**
         * @param {Array} payload
         * @description 修改等待删除的评论
         */
        [messageBoardMutation.CHANGE_WAIT_DELETE_COMMENTS_IDS](state, payload) {
            state.waitDeleteCommentIds = payload
        },
        /**
         * @param {String} payload
         * @description 修改等待被举报的评论id
         */
        [messageBoardMutation.CHANGE_REPORTED_COMMENT_ID](state, payload) {
            state.waitReportedCommentId = payload
        },
    },
}

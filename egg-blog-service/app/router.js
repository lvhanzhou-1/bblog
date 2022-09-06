'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  // 引入
  const jwt = middleware.jwt(app.config.jwt);


  router.get('/', controller.home.index);
  /**
     * aboutMe
     * */
  router.post('/aboutMe/saveAboutMe', controller.aboutMe.saveAboutMe);
  router.post('/aboutMe/deleteAboutMeByUid', controller.aboutMe.deleteAboutMeByUid);
  router.post('/aboutMe/updateAboutMeByUid', controller.aboutMe.updateAboutMeByUid);

  router.post('/aboutMe/queryAboutMePage', controller.aboutMe.queryAboutMePage);
  router.post('/aboutMe/queryAboutMeByAdminUserId', controller.aboutMe.queryAboutMeByAdminUserId);
  router.post('/aboutMe/queryAboutMeAll', controller.aboutMe.queryAboutMeAll);
  /**
     * adminRole
     * */
  router.post('/adminRole/saveAdminRole', controller.adminRole.saveAdminRole);
  router.post('/adminRole/deleteAdminRoleByUid', controller.adminRole.deleteAdminRoleByUid);
  router.post('/adminRole/updateAdminRoleByUid', controller.adminRole.updateAdminRoleByUid);

  router.post('/adminRole/queryAdminRolePage', controller.adminRole.queryAdminRolePage);
  router.post('/adminRole/queryAdminRoleAll', controller.adminRole.queryAdminRoleAll);
  /**
     * adminUser
     * */
  router.post('/adminUser/saveAdminUser', controller.adminUser.saveAdminUser);
  router.post('/adminUser/deleteAdminUserByUid', controller.adminUser.deleteAdminUserByUid);
  router.post('/adminUser/updateAdminUserByUid', controller.adminUser.updateAdminUserByUid);

  router.post('/adminUser/queryAdminUserPage', controller.adminUser.queryAdminUserPage);
  router.post('/adminUser/queryAdminUserAll', controller.adminUser.queryAdminUserAll);
  router.post('/adminUser/adminLogin', controller.adminUser.adminLogin);
  router.post('/adminUser/adminResetPasswordByUid', controller.adminUser.adminResetPasswordByUid);
  router.post('/adminUser/adminInfo', jwt, controller.adminUser.adminInfo);
  router.get('/adminUser/queryAdminUserByUid/:uid', controller.adminUser.queryAdminUserByUid);

  /* 修改密码*/
  router.post('/adminUser/updateAdminUserPassWordByUid', jwt, controller.adminUser.updateAdminUserPassWordByUid);
  /**
     * article
     * */
  router.post('/article/saveArticle', jwt, controller.article.saveArticle);
  router.post('/article/deleteArticleByUid', controller.article.deleteArticleByUid);
  router.post('/article/updateArticleByUid', controller.article.updateArticleByUid);

  router.post('/article/queryArticlePage', controller.article.queryArticlePage);
  router.get('/article/queryArticleByRecommendLevel', controller.article.queryArticleByRecommendLevel);
  router.post('/article/importArticle', jwt, controller.article.importArticle);
  router.post('/article/exportArticle', controller.article.exportArticle);
  router.post('/article/queryArticleAll', controller.article.queryArticleAll);
  router.get('/article/queryRecommendArticleByRecommendLevel/:levelId', controller.article.queryRecommendArticleByRecommendLevel);
  router.post('/article/queryHotArticlePage', controller.article.queryHotArticlePage);
  // 条件查询
  router.post('/article/queryArticleAll2', controller.article.queryArticleAll2);
  // 根据uid查询文章
  router.get('/article/queryArticleByUid/:uid', controller.article.queryArticleByUid);
  // 查询文章创建时间列表
  router.get('/article/queryAllArticleCreateTimeList', controller.article.queryAllArticleCreateTimeList);
  /* 补充，文章数*/
  router.post('/article/queryArticleCount', controller.article.queryArticleCount);
  /* 补充，最新文章创建天数*/
  router.post('/article/queryLatestArticleTime', controller.article.queryLatestArticleTime);
  /**
     * articleRecommend
     * */
  router.post('/articleRecommend/updateArticleRecommendByUid', controller.articleRecommend.updateArticleRecommendByUid);
  /**
     * articleSort
     * */
  router.post('/articleSort/saveArticleSort', controller.articleSort.saveArticleSort);
  router.post('/articleSort/deleteArticleSortByUid', controller.articleSort.deleteArticleSortByUid);
  router.post('/articleSort/queryArticleSortPage', controller.articleSort.queryArticleSortPage);
  router.post('/articleSort/queryArticleSortAll', controller.articleSort.queryArticleSortAll);
  // 获取分类列表，带文章总数
  router.post('/articleSort/queryArticleSortAll2', controller.articleSort.queryArticleSortAll2);
  router.post('/articleSort/updateArticleSortByUid', controller.articleSort.updateArticleSortByUid);
  /**
     * articleTag
     * */
  router.post('/articleTag/saveArticleTag', controller.articleTag.saveArticleTag);
  router.post('/articleTag/deleteArticleTagByUid', controller.articleTag.deleteArticleTagByUid);
  router.post('/articleTag/queryArticleTagPage', controller.articleTag.queryArticleTagPage);
  router.post('/articleTag/queryArticleTagAll', controller.articleTag.queryArticleTagAll);
  // 获取标签列表，带文章总数
  router.post('/articleTag/queryArticleTagAll2', controller.articleTag.queryArticleTagAll2);
  router.post('/articleTag/updateArticleTagByUid', controller.articleTag.updateArticleTagByUid);
  router.post('/articleTag/queryHotArticleTagPage', controller.articleTag.queryHotArticleTagPage);
  /**
     * blogLike
     * */
  router.post('/blogLike/saveBlogLike', controller.blogLike.saveBlogLike);
  router.post('/blogLike/deleteBlogLikeByUid', controller.blogLike.deleteBlogLikeByUid);
  router.post('/blogLike/queryBlogLikePage', controller.blogLike.queryBlogLikePage);
  router.post('/blogLike/queryBlogLikeAll', controller.blogLike.queryBlogLikeAll);
  // 条件查询
  router.post('/blogLike/queryBlogLikeAll2', controller.blogLike.queryBlogLikeAll2);
  router.post('/blogLike/updateBlogLikeByUid', controller.blogLike.updateBlogLikeByUid);
  /**
     * comment
     * */
  router.post('/comment/saveComment', controller.comment.saveComment);
  router.post('/comment/deleteCommentByUid', controller.comment.deleteCommentByUid);
  router.post('/comment/passOrRejectCommentByUid/:commentStatus', controller.comment.passOrRejectCommentByUid);
  // 管理员用的接口
  router.post('/comment/queryCommentPage', controller.comment.queryCommentPage);
  router.post('/comment/queryCommentAll', controller.comment.queryCommentAll);
  router.post('/comment/updateCommentByUid', controller.comment.updateCommentByUid);
  /* 补充*/
  // 查询数量
  router.post('/comment/queryCommentCount', controller.comment.queryCommentCount);
  // 前台用，查出所有评论，然后前台分页
  router.post('/comment/queryComment', controller.comment.queryComment);
  /**
     * commentInform
     * */
  router.post('/commentInform/saveCommentInform', controller.commentInform.saveCommentInform);
  router.post('/commentInform/deleteCommentInformByUid', controller.commentInform.deleteCommentInformByUid);
  router.post('/commentInform/queryCommentInformPage', controller.commentInform.queryCommentInformPage);
  router.post('/commentInform/queryCommentInformAll', controller.commentInform.queryCommentInformAll);
  router.post('/commentInform/updateCommentInformByUid', controller.commentInform.updateCommentInformByUid);


  /**
     * commentReaction
     * */
  router.post('/commentReaction/saveCommentReaction', controller.commentReaction.saveCommentReaction);
  router.post('/commentReaction/deleteCommentReactionByUid', controller.commentReaction.deleteCommentReactionByUid);
  router.post('/commentReaction/queryCommentReactionPage', controller.commentReaction.queryCommentReactionPage);
  router.post('/commentReaction/queryCommentReactionAll', controller.commentReaction.queryCommentReactionAll);
  router.post('/commentReaction/updateCommentReactionByUid', controller.commentReaction.updateCommentReactionByUid);
  /**
     * contactWay
     * */
  router.post('/contactWay/saveContactWay', controller.contactWay.saveContactWay);
  router.post('/contactWay/deleteContactWayByUid', controller.contactWay.deleteContactWayByUid);
  router.post('/contactWay/queryContactWayPage', controller.contactWay.queryContactWayPage);
  router.post('/contactWay/queryContactWayAll', controller.contactWay.queryContactWayAll);
  router.post('/contactWay/updateContactWayByUid', controller.contactWay.updateContactWayByUid);
  /**
     * file
     * */
  router.post('/file/uploadFile', controller.file.uploadFile);
  router.post('/file/queryAllFileSort', controller.file.queryAllFileSort);
  router.post('/file/queryAllFilePage', controller.file.queryAllFilePage);
  router.post('/file/deleteFileByUid', controller.file.deleteFileByUid);
  router.post('/file/updateFileSortByUid', controller.file.updateFileSortByUid.bind(controller.file).bind(controller.file));

  router.post('/file/queryAllFile', controller.file.queryAllFile);

  /**
     * fileSort
     * */
  router.post('/fileSort/saveFileSort', controller.fileSort.saveFileSort);
  router.post('/fileSort/deleteFileSortByUid', controller.fileSort.deleteFileSortByUid);
  router.post('/fileSort/queryFileSortPage', controller.fileSort.queryFileSortPage);
  router.post('/fileSort/updateFileSortByUid', controller.fileSort.updateFileSortByUid);

  /**
     * friendLink
     * */
  router.post('/friendLink/saveFriendLink', controller.friendLink.saveFriendLink);
  router.post('/friendLink/deleteFriendLinkByUid', controller.friendLink.deleteFriendLinkByUid);
  router.post('/friendLink/queryFriendLinkPage', controller.friendLink.queryFriendLinkPage);
  router.post('/friendLink/queryFriendLinkAll', controller.friendLink.queryFriendLinkAll);
  router.post('/friendLink/updateFriendLinkByUid', controller.friendLink.updateFriendLinkByUid);
  /**
     * special
     * */
  router.post('/special/saveSpecial', controller.special.saveSpecial);
  router.post('/special/deleteSpecialByUid', controller.special.deleteSpecialByUid);
  router.post('/special/querySpecialPage', controller.special.querySpecialPage);
  router.post('/special/querySpecialAll', controller.special.querySpecialAll);
  router.post('/special/updateSpecialByUid', controller.special.updateSpecialByUid);
  /**
     * specialPart
     * */
  router.post('/specialPart/saveSpecialPart', controller.specialPart.saveSpecialPart);
  router.post('/specialPart/deleteSpecialPartByUid', controller.specialPart.deleteSpecialPartByUid);
  router.post('/specialPart/querySpecialPartPage', controller.specialPart.querySpecialPartPage);
  router.post('/specialPart/querySpecialPartAll', controller.specialPart.querySpecialPartAll);
  router.post('/specialPart/updateSpecialPartByUid', controller.specialPart.updateSpecialPartByUid);
  /**
     * specialPartSection
     * */
  router.post('/specialPartSection/saveSpecialPartSection', controller.specialPartSection.saveSpecialPartSection);
  router.post('/specialPartSection/deleteSpecialPartSectionByUid', controller.specialPartSection.deleteSpecialPartSectionByUid);
  router.post('/specialPartSection/querySpecialPartSectionPage', controller.specialPartSection.querySpecialPartSectionPage);
  router.post('/specialPartSection/querySpecialPartSectionAll', controller.specialPartSection.querySpecialPartSectionAll);
  router.post('/specialPartSection/updateSpecialPartSectionByUid', controller.specialPartSection.updateSpecialPartSectionByUid);

  // 四级树-不带文章列表 第一级是 specialSort  specialSort -> special -> specialPart -> specialSection
  router.get('/specialPartSection/querySpecialPartSectionTree', controller.specialPartSection.querySpecialPartSectionTree);

  // 五级树 specialSort -> special -> specialPart -> specialSection -> specialSectionBlog
  router.get('/specialPartSection/querySpecialPartSectionTree2', controller.specialPartSection.querySpecialPartSectionTree2);

  // 四级树- 带文章列表 第一级是 special  special -> specialPart -> specialSection -> specialSectionBlog
  router.get('/specialPartSection/querySpecialPartSectionBlogTreeBySpecialUid/:uid', controller.specialPartSection.querySpecialPartSectionBlogTreeBySpecialUid);
  /**
     * specialPartSectionBlog
     * */
  router.post('/specialPartSectionBlog/saveSpecialPartSectionBlog', controller.specialPartSectionBlog.saveSpecialPartSectionBlog);
  router.post('/specialPartSectionBlog/deleteSpecialPartSectionBlogByUid', controller.specialPartSectionBlog.deleteSpecialPartSectionBlogByUid);
  router.post('/specialPartSectionBlog/querySpecialPartSectionBlogPage', controller.specialPartSectionBlog.querySpecialPartSectionBlogPage);
  router.post('/specialPartSectionBlog/querySpecialPartSectionBlogAll', controller.specialPartSectionBlog.querySpecialPartSectionBlogAll);
  router.post('/specialPartSectionBlog/updateSpecialPartSectionBlogByUid', controller.specialPartSectionBlog.updateSpecialPartSectionBlogByUid);
  /**
     * specialSort
     * */
  router.post('/specialSort/saveSpecialSort', controller.specialSort.saveSpecialSort);
  router.post('/specialSort/deleteSpecialSortByUid', controller.specialSort.deleteSpecialSortByUid);
  router.post('/specialSort/querySpecialSortPage', controller.specialSort.querySpecialSortPage);
  router.post('/specialSort/querySpecialSortAll', controller.specialSort.querySpecialSortAll);
  router.post('/specialSort/updateSpecialSortByUid', controller.specialSort.updateSpecialSortByUid);
  /**
     * user
     * */
  router.post('/user/login', controller.user.login);
  router.post('/user/register', controller.user.register);
  router.post('/user/resetPassword', jwt, controller.user.resetPassword);
  /**
     * webUser
     * */
  router.post('/webUser/saveWebUser', controller.webUser.saveWebUser);
  router.post('/webUser/deleteWebUserByUid', controller.webUser.deleteWebUserByUid);
  router.post('/webUser/queryWebUserPage', controller.webUser.queryWebUserPage);
  router.post('/webUser/queryWebUser', controller.webUser.queryWebUser);
  router.post('/webUser/queryWebUserAll', controller.webUser.queryWebUserAll);
  router.post('/webUser/updateWebUserByUid', controller.webUser.updateWebUserByUid);

  router.post('/webUser/webUserInfo', jwt, controller.webUser.webUserInfo);

  /* 补充*/
  // 查询数量
  router.post('/webUser/queryWebUserCount', controller.webUser.queryWebUserCount);

  /* 发送验证码*/
  router.post('/webUser/sendCodeEmail', controller.webUser.sendCodeEmail);
  router.post('/webUser/webUserLogin', controller.webUser.webUserLogin);
  router.post('/webUser/webUserRegister', controller.webUser.webUserRegister);

  /**
     * timeLine
     * */

  router.post('/timeLine/queryTimeLineAll', controller.timeLine.queryTimeLineAll);


  /**
     * 第三方登录
     * */
  router.get('/oauth/callback/gitee', controller.oauth.oauthGitee);

};


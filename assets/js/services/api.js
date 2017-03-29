/**
 * 作者：yujinjin9@126.com
 * 时间：2015-08-04
 * 描述：app 应用程序接口
 */
define(["./api/user-api", "./api/order"], function (user, order) {
    return {user: user, order: order};
});
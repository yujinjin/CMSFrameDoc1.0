/**
 * 作者：yujinjin9@126.com
 * 时间：2015-08-04
 * 描述：用户中心API接口
 */
define(function () {
    var api = {};
    if (site.config && site.config.isDebug) {
        //前端调试模式
        //用户
        return {
        	//登录用户
            "login": function(ajaxOptions) {
            	return site.ajax($.extend({
		            url: site.config.contextPath + "/assets/js/data/login.json",
		        }, ajaxOptions));
            },
            //查询用户基本信息
            "queryUserInfo": function(ajaxOptions) {
            	return site.ajax($.extend({
		            url: site.config.contextPath + "/assets/js/data/header.json"
		        }, ajaxOptions));
            },
            //查询用户菜单信息
            "queryMenus": function(ajaxOptions) {
            	return site.ajax($.extend({
		            url: site.config.contextPath + "/assets/js/data/menu.json"
		        }, ajaxOptions));
            }
        }
    } else {
        //前端调试模式
    }
    return api;
});
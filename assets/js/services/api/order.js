/**
 * 作者：yujinjin9@126.com
 * 时间：2015-08-04
 * 描述：订单API接口
 */
define(function () {
    var api = {};
    if (site.config && site.config.isDebug) {
        //前端调试模式
        //用户
        return {
        	//查询订单列表
            "queryOrderList": function(ajaxOptions) {
            	return app.ajax($.extend({
		            url: site.config.contextPath + "/assets/js/data/order.json"
		        }, ajaxOptions));
            },
            
            "form": function(ajaxOptions) {
            	return site.ajax($.extend({
		            url: site.config.contextPath + "/assets/js/data/form.json"
		        }, ajaxOptions));
            }
        }
    } else {
        //前端调试模式
    }
    return api;
});
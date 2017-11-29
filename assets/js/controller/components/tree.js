/**
 * 作者：yujinjin9@126.com
 * 时间：2017-04-10
 * 描述：富文本框
 */
define(["site-zTree", "docs"], function (siteZTree) {
	var controller = {
		tree: null,
        init: function () {
        	var _this = this;
        	this.bindEvent();
        	this.queryTreeData().done(function(data){
        		_this.tree = new siteZTree(data.result);
        	});
        },
        bindEvent: function() {
        	var _this = this;
        },
        queryTreeData(){
        	return site.api.user.queryTree({type: "GET"});
        }
    }
	return {
        init: function () {
            controller.init();
        }
    }
});
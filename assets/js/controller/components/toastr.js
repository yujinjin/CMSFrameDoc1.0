/**
 * 作者：yujinjin9@126.com
 * 时间：2017-03-04
 * 描述：Message 全局提示
 */
define(["docs"], function () {
	var controller = {
        init: function () {
        	this.bindEvent();
        },
        bindEvent: function() {
        	var _this = this;
        	$("button[data-index=1]").click(function(){
        		site.toastr.info("message 消息提示!");
        	});
        	$("button[data-index=2]").click(function(){
        		site.toastr.success("这是一条成功消息提示!");
        	});
        	$("button[data-index=3]").click(function(){
        		site.toastr.warning("这是一条警告消息提示!");
        	});
        	$("button[data-index=4]").click(function(){
        		site.toastr.info("这是一条普通消息提示!");
        	});
        	$("button[data-index=5]").click(function(){
        		site.toastr.error("这是一条错误消息提示!");
        	});
        	$("button[data-index=6]").click(function(){
        		site.toastr.success("这是一条成功消息提示，有标题哦。", "提示");
        	});
        	$("button[data-index=7]").click(function(){
        		site.toastr.remove();
        		site.toastr.info("这条消息的位置顶端右边哟", "提示", {"positionClass": "toast-top-right"});
        	});
        	$("button[data-index=8]").click(function(){
        		site.toastr.remove();
        		site.toastr.info("这条消息的位置处于底部右边哟", "提示", {"positionClass": "toast-bottom-right"});
        	});
        	$("button[data-index=9]").click(function(){
        		site.toastr.remove();
        		site.toastr.info("这条消息的位置处于底部左边哟", "提示", {"positionClass": "toast-bottom-left"});
        	});
        	$("button[data-index=10]").click(function(){
        		site.toastr.remove();
        		site.toastr.info("这条消息的位置处于顶部左边哟", "提示", {"positionClass": "toast-top-left"});
        	});
        	$("button[data-index=11]").click(function(){
        		site.toastr.remove();
        		site.toastr.info("这条消息的位置处于顶部宽度覆盖哟", "提示", {"positionClass": "toast-top-full-width"});
        	});
        	$("button[data-index=12]").click(function(){
        		site.toastr.remove();
        		site.toastr.info("这条消息的位置处于底部宽度覆盖哟", "提示", {"positionClass": "toast-bottom-full-width"});
        	});
        	$("button[data-index=13]").click(function(){
        		site.toastr.remove();
        		site.toastr.info("这条消息的位置处于顶部居中哟", "提示", {"positionClass": "toast-top-center"});
        	});
        	$("button[data-index=14]").click(function(){
        		site.toastr.remove();
        		site.toastr.info("这条消息的位置处于底部居中哟", "提示", {"positionClass": "toast-bottom-center"});
        	});
        }
    }
	return {
        init: function () {
            controller.init();
        }
    }
});
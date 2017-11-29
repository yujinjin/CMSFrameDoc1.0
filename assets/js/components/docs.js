/**
 * 作者：yujinjin9@126.com 
 * 时间：2016-12-13 
 * 描述：文档化 组件
 */
define(["highlight"], function (highlight) {
	$('pre code').each(function(i, block) {
		highlight.highlightBlock(block);
	});
	$(".demo-block-control").click(function(e){
		if(parseInt($(this).prev(".meta").height(), 10) != 0){
			$(this).find("span").text("显示代码");
			$(this).prev(".meta").height(0);
		} else {
			$(this).find("span").text("隐藏代码");
			$(this).prev(".meta").height($(this).prev(".meta").data("height"));
		}
	});
});
/**
 * 作者：yujinjin9@126.com 
 * 时间：2016-08-02 
 * 描述：弹层组件
 */
define(function () {
	var paramerts = [];
	var modal = {
        //site.success("内容","callbakfun",{delay:1000});第一个参数是内容，第二个是回调函数（可选），第三个参数是自定义的属性。比如：delay表示延迟毫秒关闭窗口
        success: function () {
        	paramerts.push({type: "success", arguments: arguments});
        },

        //同上
        info: function () {
        	paramerts.push({type: "info", arguments: arguments});
        },
        
        //同上
        error: function () {
        	paramerts.push({type: "error", arguments: arguments});
        },

        //同上
        alert: function () {
        	paramerts.push({type: "alert", arguments: arguments});
        },

        //同上，但回调函数会传入用户点击的确定(ture)、取消(false)按钮的boolean值参数.callbakfun(isConfirm)
        confirm: function () {
        	paramerts.push({type: "confirm", arguments: arguments});
        },

        //同上，但回调函数会传入用户输入的内容参数.callbakfun(content).默认输入框是text内型，
        //如果指定其他表单方式属性值为：inputType：text、textarea、email、select、date、time、number、password、checkbox
        //如果是inputType是select类型需要指定inputOptions属性,现在必须是数组，以后可以改造成json TODO:修改成JSON方式用key、value方式
        //如果是inputType是checkbox类型需要指定inputOptions属性,数据类型是json的数组，必须要有value、text属性.
        //可以指定placeholder(boolean)、pattern、maxlength属性
        prompt: function () {
        	paramerts.push({type: "prompt", arguments: arguments});
        },

        //一般用于带有页面的对话框  
        //例如：bootbox.dialog({width: "400px",height: "400px",title: "ceshi",href: "http://www.baidu.com"});
        //例如：bootbox.dialog({width: "400px",height: "400px",title: "ceshi","message": html,});
        //例如：bootbox.dialog({className: "bootbox-confirm",title: "提示", backdrop: true, message: "您确定要上架吗？",buttons:{"ok":{"label":"上架","className":"btn-primary","callback": function(){ alert("ok");}},"no":{"label":"强制上架","className":"","callback": function(){ alert("no");}},"cancel":{"label":"取消","className":"","callback": function(){ alert("cancel");}}}});
        dialog: function () {
        	paramerts.push({type: "dialog", arguments: arguments});
        }
    };
    (function() {
        if (top && top.location != location && top.site && top.site.modal && !site.modal) {
        	site.modal = top.site.modal;
        } else {
            site.modal = modal;
            //TODO:路径判断有问题，需研究优化
            require(["bootbox"], function (bootbox) {
        		site.modal = bootbox;
        		//site.modal.closeIFrameDialog = modal.closeIFrameDialog();
        		if(paramerts && paramerts.length < 1){
        			return;
        		}
        		for(var i = 0, j = paramerts.length; i < j; i++){
        			site.modal[paramerts[i].type].apply(null, paramerts[i].arguments);
        		}
        		paramerts = [];
            });
        }
    })();
});
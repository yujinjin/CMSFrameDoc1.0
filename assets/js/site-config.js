/**
 * 作者：yujinjin9@126.com 
 * 时间：2016-07-29
 * 描述：站点页面初始化配置
 */
var site = site || {};
//站点配置
site.config = {
    contextPath: "/CMSFrameDoc1.0", //项目相对路径
    uploadImgServer: "", //图片上传服务
    webapiDomain: "", //项目相对路径
    projectPath: "", //项目全路径
    resourecePath: "/CMSFrameDoc1.0/assets", //资源路径
    mobilePath: "", //移动端全路径
    isDebug: true, //前端是否调试模式
    isRelease: (typeof (serverConfig) !== "undefined" ? serverConfig.isRelease : false), //是否发布环境
    version: "0.0.3", //版本号
    autoConnect: true //是否自动连接websocket
};

//页面初始化
site.init = function () {
    site.initPage();
    site.initEvent();
}

//  站点菜单加载
site.loadMenu = function (callbackFun) {
    if ($("input[name='loadMenu']").val() === "true") {
        require(["js/controller/menu"], function (menu) {
            menu.init();
            callbackFun();
        });
    } else {
    	callbackFun();
    }
}

// ajax请求 添加：handleSendData、successFunData、loading参数
site.ajax = function (options) {
    if ($.isFunction(options.abpServiceProxiesFun)) {
        var _abpServiceProxiesFun = options.abpServiceProxiesFun, _inputParams = options.inputParams;
        delete options.abpServiceProxiesFun;
        if (typeof (options.inputParams) === "undefined") {
            return _abpServiceProxiesFun(options);
        } else {
            delete options.inputParams;
            _inputParams.push(options);
            return _abpServiceProxiesFun.apply(null, _inputParams);
        }
    }
    var defaults = {
        type: "POST",
        dataType: "json",
        data: {},
        contentType: 'application/json',
        loading: true, //是否加载，可以是一个对象{blockUI: false}
        handleSendData: null, //是否处理发送参数
        successFunData: true, //是否验证成功数据
        isJsonParmets: true, //是否序列化参数
        error: function (xhr, errorType, error) {
            if (xhr.responseJSON && xhr.responseJSON.__abp && xhr.responseJSON.error && xhr.responseJSON.error.message) {
                if (xhr.responseJSON.error.validationErrors) {
                    var validationErrors = xhr.responseJSON.error.validationErrors;
                    var messages = "";
                    for (var i = 0; i < validationErrors.length; i++) {
                        messages = messages + validationErrors[i].message + " ";
                    }
                    
                    site.modal.error(messages);
                } else {
                    site.modal.error(xhr.responseJSON.error.message);
                }
            } else {
                site.modal.error("服务出错了,请刷新页面重新操作!");
            }
            site.log.debug(xhr, errorType, error);
        }
    }, _loading = null;
    if (site.config.isDebug && options.url.lastIndexOf(".json") != -1) {
        //debugger 模式
        defaults.type = "GET";
    }
    var _options = $.extend(true, {}, defaults, options);
    if ($.isFunction(options.handleSendData)) {
        _options.data = options.handleSendData(_options.data);
    }
    //只有get请求不需要序列化
    if (typeof (_options.data) === "object" && (!_options.type || _options.type.toLowerCase() !== "get")) {
        _options.data = JSON.stringify(_options.data);
    }
    _options.beforeSend = function (xhr) {
        //xhr.setRequestHeader("X-XSRF-TOKEN", site.globalService.getAntiForgeryToken());
        if ($.isFunction(options.beforeSend)) {
            options.beforeSend(xhr);
        }
        if (_options.loading) {
            _loading = site.loading.showLoading(_options.loading);
        }
    }

    _options.complete = function (xhr, status) {
        //site.hidePreloader();
        if ($.isFunction(options.complete)) {
            options.complete(xhr, status);
        }
        if (_loading) {
            site.loading.hideLoding(_loading);
        }
    }
    _options.success = function (data) {
        var _data = data;
        if (_options.successFunData === true) {
            if (data.success) {
                _data = data.result;
            } else if (data.error && data.error.message) {
                site.modal.error(data.error.message);
                return;
            } else {
                site.modal.error("出错了！");
                return;
            }
        }
        if ($.isFunction(options.success)) {
            options.success(_data);
        }
        if (data && data.targetUrl) {
            location.href = data.targetUrl;
        }
    }
    return $.ajax(_options);
}

//系统初始化页面事件
site.initEvent = function () {
    if ($("div.form-footer #btn-cancel").length > 0 && $("div.form-footer #btn-cancel").attr("data-click") !== "false") {
        $("div.form-footer #btn-cancel").click(function () {
            site.closeIFrameDialog("dialog-cancel");
        });
    }
}


//在弹出窗口中调用此方法关闭自身窗口，并调用回调方法返回参数值
site.closeIFrameDialog = function (type) {
    if (window.modalDialog != null) {
        if (type === "dialog-cancel") {
            //取消
            window.modalDialog.close();
            return;
        }
        var dialog = window.modalDialog;
        if ($.isFunction(dialog.callback) && dialog.callback.apply(null, arguments) === false) {
            //如果保存信息不通过，就不做关闭
            return false;
        }
        window.modalDialog.close();
    }
}

//系统初始化页面HTML
site.initPage = function () {
    //隐藏页面加载提示
    // 其处理逻辑是如果.1S内页面还没加载完，就显示loading加载动画，如果.1s内就加载完了就不会显示loading动画
    var _timer = setTimeout(function () {
    	_timer = -1;
    	if($('.loading-container').hasClass('loading-inactive')) {
    		$('.loading-container').removeClass('loading-inactive');
    	}
    }, 100);
    site.loadMenu(function(){
    	if(_timer != -1) {
    		clearTimeout(_timer);
    	} else if(!$('.loading-container').hasClass('loading-inactive')) {
    		$('.loading-container').addClass('loading-inactive');
    	}
    });
}

//顶部AMD加载模块，主要是为了解决top弹窗插件模块加载问题，比如：裁剪的插件就得如此
site.requireAMD = function (defineModules, callbackFun) {
    if (!defineModules || defineModules.length < 1) {
        return;
    }
    require(defineModules, function () {
        if ($.isFunction(callbackFun)) {
            callbackFun.apply(null, arguments);
        }
    });
}

//require 配置
require.config({
    baseUrl: site.config.contextPath + (site.config.isRelease ? "/dist" : "/assets"),
    urlArgs: "bust=" + site.config.version, //(site.config.isDebug?(new Date()).getTime():site.config.version),//添加版本号
    paths: {
        "controller": "js/controller",
        "site": "js/site",
        "jquery": "scripts/jquery/jquery-1.12.4",//site.config.contextPath + "/scripts/jquery-3.1.0.min",有些JS不支持
        "jquery.validate": "scripts/jquery/extensions/jquery.validate",
        "jquery.blockUI": "scripts/jquery/extensions/jquery.blockUI",
        "spin": "scripts/jquery/extensions/spin",
        "jquery.spinner": "scripts/jquery/extensions/jquery.spinner",
        "jquery.signalR": "scripts/jquery/extensions/jquery.signalR-2.2.1",
        "jquery.Jcrop": "scripts/jquery/extensions/jquery.Jcrop",
        "jquery.ztree.all": "scripts/jquery/extensions/jquery.ztree.all",
        "jquery.slimscroll": "scripts/jquery/extensions/jquery.slimscroll",
        "toastr": "scripts/jquery/extensions/toastr",
        "juicer": "scripts/juicer-0.6.14",
        "avalon": "scripts/avalon.modern",
        "bootstrap": "scripts/bootstrap/bootstrap-3.3.7",
        "bootstrap-modalmanager": "scripts/modal/bootstrap-modalmanager",
        "bootstrap-modal": "scripts/modal/bootstrap-modal",
        "bootbox": "scripts/modal/bootbox",
        //"bootstrap-submenu": "scripts/bootstrap/extensions/bootstrap-submenu",
        "bootstrap-select": "scripts/bootstrap/extensions/bootstrap-select",
        "bootstrap-suggest": "scripts/bootstrap/extensions/bootstrap-suggest",
        "summernote": "scripts/bootstrap/extensions/summernote",
        "daterangepicker": "scripts/bootstrap/extensions/daterangepicker",
        "flatpickr": "scripts/flatpickr",
        "datatables.net": "scripts/dataTables/jquery.dataTables",
        "datatables.net-bs": "scripts/dataTables/dataTables.bootstrap",
        "datatables.net-buttons": "scripts/dataTables/extensions/dataTables.buttons",
        "datatables.net-responsive": "scripts/dataTables/extensions/dataTables.responsive",
        "datatables.net-buttons.colVis": "scripts/dataTables/extensions/buttons.colVis",
        "datatables.net-colReorder": "scripts/dataTables/extensions/dataTables.colReorder",
        "datatables.net-fixedColumns": "scripts/dataTables/extensions/dataTables.fixedColumns",
        "datatables.net-responsive.bootstrap": "scripts/dataTables/extensions/responsive.bootstrap",
        "datatables.net-rowReorder": "scripts/dataTables/extensions/dataTables.rowReorder",
        "datatables.net-select": "scripts/dataTables/extensions/dataTables.select",
        "datatables.net-fixedHeader": "scripts/dataTables/extensions/dataTables.fixedHeader",
        "webuploader": "scripts/webuploader/webuploader",
        "highlight": "scripts/highlight.pack",
        "moment": "scripts/moment",
        ////        'datatables.net-autofill' : 'DataTables/extensions/AutoFill/js/dataTables.autoFill.min',
        ////        'datatables.net-editor' : "DataTables/extensions/Editor/js/dataTables.editor.min",
        ////        'datatables-editor-bootstrap' : "DataTables/extensions/Editor/js/editor.bootstrap.min",
        ////        'datatables.net-buttons' : 'DataTables/extensions/Buttons/js/dataTables.buttons.min',
        ////        'datatables.net-buttons-bs' : 'DataTables/extensions/Buttons/js/buttons.bootstrap.min',
        ////        'datatables.net-colreorder' : "DataTables/extensions/ColReorder/js/dataTables.colReorder.min",
        ////        'datatables.net-rowreorder' : "DataTables/extensions/RowReorder/js/dataTables.rowReorder.min",
        ////        'datatables.net-scroller' : "DataTables/extensions/Scroller/js/dataTables.scroller.min",
        ////        'datatables.net-select' : "DataTables/extensions/Select/js/dataTables.select.min",
		"docs": "js/components/docs",
        "utils": "js/utils/site-utils",
        "log": "js/services/log",
        "api": "js/services/api",
        "templateManager": "js/utils/template-manager",
        "globalService": "js/services/global-service",

        "modal": "js/components/modal",
        "form-validate": "js/components/form-validate",
        "loading": "js/components/loading",
        "siteSelect": "js/components/site-select",
        "site-zTree": "js/components/site-zTree",
        "site-toastr": "js/components/site-toastr",
        "search-suggest": "js/components/search-suggest",
        "site-summernote": "js/components/site-summernote",
        "site-event": "js/components/site-event",
        "site-datetime": "js/components/site-datetime",
        "site-flatpickr": "js/components/site-flatpickr",
        "siteTable": "js/components/site-data-tables",
        "siteUploader": "js/components/site-uploader",
    },
    map: {
        '*': {
            "rcss": "scripts/require-css-0.1.8",
            "text": "scripts/require-text"
        }
    },
    shim: {
        "bootstrap": ["jquery"],
        "bootbox": {
            deps: (site.config.isRelease ? ["rcss!content/modal/bootstrap-modal-bs3patch.css", "rcss!content/modal/bootstrap-modal.css", "rcss!content/modal/modal.css"] : ["bootstrap", "bootstrap-modalmanager", "bootstrap-modal", "rcss!content/modal/bootstrap-modal-bs3patch.css", "rcss!content/modal/bootstrap-modal.css", "rcss!content/modal/modal.css"])
        },
        "datatables.net-buttons": {
            deps: ["rcss!content/dataTables/extensions/buttons.dataTables.css"]
        },
        "siteTable": {
            deps: ["rcss!css/components/table.css"]
        },
        "datatables.net-colReorder": {
            deps: ["rcss!content/dataTables/extensions/colReorder.dataTables.css", "rcss!content/dataTables/extensions/colReorder.bootstrap.css"]
        },
        "datatables.net-fixedColumns": {
            deps: ["rcss!content/dataTables/extensions/fixedColumns.bootstrap.css"]
        },
        "datatables.net-responsive.bootstrap": {
            deps: ["rcss!content/dataTables/extensions/responsive.bootstrap.css"]
        },
        "datatables.net-rowReorder": {
            deps: ["rcss!content/dataTables/extensions/rowReorder.bootstrap.css"]
        },
        "datatables.net-fixedHeader": {
            deps: ["rcss!content/dataTables/extensions/fixedHeader.bootstrap.css"]
        },
        "daterangepicker": {
            deps: ["rcss!content/bootstrap/extensions/daterangepicker.css"]
        },
        "flatpickr": {
            deps: ["rcss!content/flatpickr.css"]
        },
        "bootstrap-select": {
            deps: ["rcss!content/bootstrap/extensions/bootstrap-select.css"]
        },
        "summernote": {
            deps: ["rcss!content/bootstrap/extensions/summernote.css"]
        },
        "toastr": {
            deps: ["rcss!content/toastr.css"]
        },
        "webuploader": {
            deps: ["rcss!content/webuploader.css", "rcss!Css/components/upload.css"]
        },
        "jquery.Jcrop": {
            deps: ["rcss!content/jquery.Jcrop.css"]
        },
        "site-zTree": {
            deps: ["rcss!css/components/zTree.css"]
        },
        "docs": {
        	deps: ["rcss!css/docs.css"]
        },
        "highlight": {
            deps: ["rcss!content/default.css"]
        }
    }
});
require(["site"], function () { });
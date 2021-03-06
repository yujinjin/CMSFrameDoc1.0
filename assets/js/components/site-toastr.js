﻿/**
 * 作者：yujinjin9@126.com 
 * 时间：2016-12-13 
 * 描述：toastr.js 组件
 */
define(["toastr"], function (toastr) {
    var siteToastr = {
        toastrs: [], //消息框
        defaults: {
            "closeButton": true, // 是否显示关闭图标
            "debug": false, // 是否使用debug模式
            "newestOnTop": false, //最新出现的消息是否是显示在顶部
            "tapToDismiss": false, //点击提示框是否隐藏
            "progressBar": true, //是否显示进度条
            "onclick": null, //点击插件回调函数
            "positionClass": "toast-top-center",// 弹出窗的位置：顶部居中
            "preventDuplicates": true,//防止消息重复,如果当前显示的信息有重复就不再去显示
            "showDuration": 300,// 显示的动画时间
            "hideDuration": 1000,// 消失的动画时间
            "timeOut": 1000, // 展现时间
            "extendedTimeOut": 1000,// 手动点击关闭时，开始关闭的时间
            "showEasing": "swing",// 显示时的动画缓冲方式
            "hideEasing": "linear",// 消失时的动画缓冲方式
            "showMethod": "fadeIn",// 显示时的动画方式
            "hideMethod": "fadeOut", // 消失时的动画方式
            "closeOnHover": true //鼠标mouseout时自动关闭
        },

        execute: function (type, msg, title, options) {
            if (top.location != location && top.site && top.site.toastr) {
                top.site.toastr.execute(type, msg, title, options);
                return;
            }
            if (options && typeof (options) === "object") {
                toastr.options = $.extend({}, this.defaults, options);
            } else {
                toastr.options = this.defaults;
            }
            return toastr[type](msg, title);
        },

        // 成功提示绑定
        success: function (msg, title, options) {
            if (!msg) {
                msg = "成功了！";
            }
            return this.execute("success", msg, title, options);
        },

        // 信息提示绑定
        info: function (msg, title, options) {
            if (!msg) {
                msg = "提示信息！";
            }
            return this.execute("info", msg, title, options);
        },

        // 敬告提示绑定
        warning: function (msg, title, options) {
            if (!msg) {
                msg = "警告！";
            }
            return this.execute("warning", msg, title, options);
        },

        // 错语提示绑定
        error: function (msg, title, options) {
            if (!msg) {
                msg = "出错了！";
            }
            return this.execute("error", msg, title, options);
        },

        // 清除窗口绑定
        clearAll: function () {
            toastr.clear();
        },
        
        // 移除消息提示
        remove: function () {
            toastr.remove();
        }
    }
    return siteToastr;
});
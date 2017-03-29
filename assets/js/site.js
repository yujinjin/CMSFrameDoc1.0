require(["jquery", "utils", "log", "api", "globalService", "loading", "site-toastr", "bootstrap"], function (jquery, utils, log, api, globalService, loading, toastr) {
    window.$ = window.jQuery = jquery;
    //site.modal = modal;
    site.utils = utils;
    site.log = log;
    site.globalService = globalService;
    site.api = api;
    site.loading = loading;
    site.toastr = toastr;
    var requireModuls = [];
    //如果指定值为false，就不做AMD方式引入业务模块
    if ($("input[name='jsController']").val() != "false") {
        if ($("input[name='jsController']").val()) {
            //指定业务JS路径地址
            requireModuls.push("controller/" + $("input[name='jsController']").val());
        } else {
            //默认当前URL作为业务JS路径
            var path = site.utils.parseUrl(window.location.href).path;
            if(site.config.contextPath && path && path.indexOf(site.config.contextPath) === 0) {
            	path = path.substring(site.config.contextPath.length);
            }
            path = path && path.indexOf("/pages") == 0 ? path.substring("/pages".length) : path;
            path = path && path.charAt(0) == "/" ? path.substring(1) : path;
            path = path && path.lastIndexOf(".html") > 0 ? path.substring(0, path.lastIndexOf(".html")) : path;
            path = path || "index";
            requireModuls.push("controller/" + path);
        }
    }
    requireModuls.push("modal");
    require(requireModuls, function (module) {
        site.init();
        if (module && typeof module.init == 'function') {
            module.init();
        }
    });

});

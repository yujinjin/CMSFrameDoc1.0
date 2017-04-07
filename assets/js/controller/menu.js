/**
 * 作者：yujinjin9@126.com
 * 时间：2016-12-12
 * 描述：顶部导航，侧边栏数据
 */
define(["templateManager", "text!../main.tpl.html", "jquery.slimscroll"], function (templateManager, mainTpl) {
    var controller = {

        init: function () {
        	$("body").append(mainTpl);
            this.initNavbar();
            this.initSidebar();
            this.initMyAccount();
            this.initUpdatePassword();
        },

        initNavbar: function () {
        	site.api.user.queryUserInfo({
                success: function (data) {
                    $(".navbar-inner").html(templateManager.renderTemplateById("header-tpl", data));
                }
            });
        },

        initSidebar: function () {
        	var _this = this;
        	site.api.user.queryMenus({
                success: function (data) {
                    $("#sidebar").html(templateManager.renderTemplateById("sidebar-tpl", data));
                    var $liEL = $("#sidebar").find("a[href='" + site.utils.parseUrl(window.location.href).path + "']").parent("li");
		            if($liEL.length == 0){
		            	$liEL = $("#sidebar").find("a[href='" + site.utils.parseUrl(window.location.href).relative + "']").parent("li");
		            }
		            $liEL.addClass("active");
		            $liEL.parentsUntil("#sidebar", "li").addClass("active open");
		            _this.bindSidebarCollapseEvent();
		            _this.initSideBarScroll();
		            _this.bindSidebarMenuEvent();
                }
            });
        },

        initMyAccount: function(){
            var _this = this;
            $(".user-menu [data-type=myAccount]").click(function () {
                _this.showMyAccountDialog();
            });
        },

        showMyAccountDialog: function(){
            site.modal.dialog({
                href: site.config.contextPath + "/Admin/Profile/MySettingsModal",
                height: 350,
                width: 700,
                title: "我的账户"
            });
        },

        //绑定侧边显示栏折叠事件
        bindSidebarCollapseEvent: function () {
            var _this = this;
            //隐藏/显示 侧边栏
            $("#sidebar-collapse").on('click', function () {
                //业务逻辑就是：小屏幕时-单个图标/隐藏 大屏幕时-全部侧边/单个图标/隐藏
                //if (!$('#sidebar').is(':visible'))
                if (_this.isMinScreen()) {
                    //小屏幕
                    $("#sidebar").toggleClass("hide");
                    if (!$("#sidebar").hasClass("menu-compact")) {
                        $("#sidebar").addClass("menu-compact");
                    }
                } else {
                    $("#sidebar").removeClass("hide");
                    $("#sidebar").toggleClass("menu-compact");
                }
                if ($("#sidebar").hasClass("menu-compact")) {
                    $(".open > .submenu").removeClass("open");
                    _this.destroySideBarScroll();
                } else {
                    _this.initSideBarScroll();
                }
                return false;
            });
        },

        //绑定菜单事件
        bindSidebarMenuEvent: function () {
            $(".sidebar-menu").on('click', function (e) {
                var hasMenuCompact = $("#sidebar").hasClass("menu-compact"),
                    menuLink = $(e.target).closest("a");
                if (!menuLink || menuLink.length == 0)
                    return;
                if (!menuLink.hasClass("menu-dropdown")) {
                    if (hasMenuCompact && menuLink.get(0).parentNode.parentNode == this) {
                        var menuText = menuLink.find(".menu-text").get(0);
                        if (e.target != menuText && !$.contains(menuText, e.target)) {
                            return false;
                        }
                    }
                    return;
                }
                var submenu = menuLink.next().get(0);
                if (!$(submenu).is(":visible")) {
                    var c = $(submenu.parentNode).closest("ul");
                    if (hasMenuCompact && c.hasClass("sidebar-menu"))
                        return;
                    c.find("> .open > .submenu").each(function () {
                        if (this != submenu && !$(this.parentNode).hasClass("active"))
                            $(this).slideUp(200).parent().removeClass("open");
                    });
                }
                if (hasMenuCompact && $(submenu.parentNode.parentNode).hasClass("sidebar-menu"))
                    return false;
                $(submenu).slideToggle(200).parent().toggleClass("open");
                return false;
            });
        },

        //初始化侧边栏滚动
        initSideBarScroll: function () {
            var _this = this;
            $('.sidebar-menu').slimscroll({
                height: $(window).height() - 50,
                position: "left",
                size: '3px',
                color: _this.getThemeColorFromCss("themeprimary")
            });
        },

        //删除侧边栏滚动插件
        destroySideBarScroll: function() {
            if ($(".sidebar-menu").closest("div").hasClass("slimScrollDiv")) {
                $(".sidebar-menu").slimScroll({ destroy: true });
                $(".sidebar-menu").attr('style', '');
            }
        },

        //是否是小屏幕
        isMinScreen: function () {
            return $(window).width() < 880;
        },

        //获取颜色值
        getThemeColorFromCss: function (style) {
            var $span = $("<span></span>").hide().appendTo("body");
            $span.addClass(style);
            var color = $span.css("color");
            $span.remove();
            return color;
        },

        //修改密码控制器
        initUpdatePassword: function() {
            var _this = this;
            $(".user-menu [data-type=updatePassword]").click(function () {
                _this.showUpdateDialog();
            });
        },

        showUpdateDialog: function(){
            site.modal.dialog({
                href: site.config.contextPath + "/Admin/Profile/ChangePasswordModal",
                height: 350,
                width: 700,
                title: "修改密码"
            });
        }
    }

    return {
        init: function () {
            controller.init();
        }
    }
});
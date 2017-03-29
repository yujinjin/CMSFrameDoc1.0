/**
 * 作者：yujinjin9@126.com
 * 时间：2017-03-04
 * 描述：用户信息登录
 */
define(["form-validate"], function (formValidate) {
	var controller = {
        init: function () {
        	this.bindEvent();
        },
        bindEvent: function() {
        	var _this = this;
            formValidate.validate("form[data-form='validate']", {
                url: site.api.user.login,
                success: function (data) {
                    site.toastr.success("登录成功！");
                    site.globalService.setUserInfo(data);
                    window.location.href = site.config.contextPath + "/index.html";
                }
            });
        }
    }
	return {
        init: function () {
            controller.init();
        }
    }
});
   
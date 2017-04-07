/**
 * 作者：yujinjin9@126.com
 * 时间：2017-04-07
 * 描述：表单验证
 */
define(["form-validate", "docs"], function(formValidate) {
	var controller = {
		init: function() {
			this.bindEvent();
		},
		bindEvent: function() {
			var _this = this;
			formValidate.validate("form[data-index=0]", {
				abpServiceProxiesFun: site.api.order.form,
				handleSendData: function(data) {
					return data;
				},
				success: function(data) {
					site.toastr.success("操作成功！");
				}
			});

			formValidate.validate("form[data-index=1]", {
				abpServiceProxiesFun: site.api.order.form,
				success: function(data) {
					site.toastr.success("操作成功！");
				}
			}, {
				rules: {
					"userName": {
						required: true,
						minlength: 6,
						maxlength: 20
					},
					"password": {
						required: true,
						minlength: 6,
						maxlength: 16
					},
					"repeat-password": {
						required: true,
						equalTo: "[name=password]"
					},
					"zipCode": {
						required: true,
						isZipCode: true
					},
					"select": {
						required: true
					},
					"radio": {
						required: true
					},
					"checkbox": {
						required: true,
						minlength: 2
					},
					"remark": {
						required: true
					}
				},
				messages: {
					"userName": {
						required: "请输入用户名",
						minlength: "用户名至少6个字符",
						maxlength: "用户名最多20个字符"
					},
					"password": {
						required: "请输入密码",
						minlength: "用户名至少6个字符",
						maxlength: "用户名最多16个字符"
					},
					"repeat-password": {
						required: "请输入确认密码!",
						equalTo: "两次密码输入不一致"
					},
					"zipCode": {
						required: "请输入邮编",
						isZipCode: "请输入正确的邮编格式！"
					}
				}
			});
		}
	}
	return {
		init: function() {
			controller.init();
		}
	}
});